import {
  ReviewNotAllowedError,
  addArtifact,
  deliveryAnswers,
  getArtifact,
  listDeliveries,
  listMessageReviews,
  postgresContentStore,
  startMessageReview,
  type Database,
  type Deal,
  type MessageReviewRecord,
  type ScopeVersion,
} from "@pactpal/db";
import { agreementLines } from "@pactpal/qa";
import { numberSourceLines } from "@pactpal/scope-draft";
import { messageReviewSchema, type WorkRecord } from "@pactpal/watcher";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { documentFor } from "../acceptance/document.js";
import { MESSAGE_PROMPT_VERSIONS, runMessageJob } from "../drafting/message-job.js";
import type { DraftingRuntime } from "../drafting/runtime.js";
import { signedRecord } from "../payments/signed-record.js";
import { featureAnswers, readBody, type DealLookup, sendRefusal } from "./access.js";

export interface MessageRouteOptions {
  sellersDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
  /** The models with keys, the council's effects and the limit on councils at once. */
  drafting: DraftingRuntime | undefined;
}

const messageBody = z.object({ text: z.string().trim().min(1).max(5000) });

const REFUSALS: Record<ReviewNotAllowedError["reason"], { status: number; error: string }> = {
  "not-your-deal": { status: 403, error: "only the seller can do this" },
  "not-signed": { status: 409, error: "messages are checked once the agreement is signed" },
  "already-running": { status: 409, error: "another message is still being checked" },
  "too-many": { status: 429, error: "this deal already has the most message checks allowed" },
};

/** What the council record says about agreement; the model names stay stored, not shown. */
const councilSummary = z
  .object({ needsReview: z.boolean(), reviewReasons: z.array(z.string()) })
  .catch({ needsReview: false, reviewReasons: [] });

/**
 * The buyer's messages and the council's reviews of them (4m), for the seller only: the message
 * is a source file of the deal; labels, the reply and change lines are a draft kept apart from
 * the evidence log, and nothing is sent to the buyer from here.
 */
export const messageRoutes: FastifyPluginAsync<MessageRouteOptions> = (app, options) => {
  const { sellersDeal, clock, newId, drafting } = options;

  async function reviewView(db: Database, deal: Deal, review: MessageReviewRecord) {
    const store = postgresContentStore(db, clock);
    const { artifact, bytes } = await getArtifact(db, store, review.sourceArtifactId, deal.id);
    const parsed = messageReviewSchema.safeParse(review.review);
    const council = review.council === undefined ? undefined : councilSummary.parse(review.council);
    return {
      id: review.id,
      status: review.status,
      version: review.version,
      createdAt: review.createdAt.toISOString(),
      finishedAt: review.finishedAt?.toISOString() ?? null,
      file: { id: artifact.id, filename: artifact.filename },
      message: new TextDecoder().decode(bytes),
      review: parsed.success ? parsed.data : null,
      needsReview: council?.needsReview ?? false,
      failureReason: review.failureReason ?? null,
    };
  }

  const { answer } = featureAnswers(
    async ({ db, deal }) => {
      const [reviews, record] = await Promise.all([
        listMessageReviews(db, deal.id),
        signedRecord(db, deal),
      ]);
      const { content } = record?.scope ?? {};
      return {
        // For "a change to delivered work": change requests so far against the limit.
        revisions: content ? await revisionsOf(db, deal, content.revisionsIncluded ?? null) : null,
        canCheck:
          drafting !== undefined &&
          drafting.clients.length > 0 &&
          (deal.status === "active" || deal.status === "completed"),
        reviews: await Promise.all(reviews.map((review) => reviewView(db, deal, review))),
      };
    },
    () => undefined,
  );

  /** The work so far, counted by code: delivered stages and change requests against the limit. */
  /** Change requests so far across the deal, against the revisions the agreement includes. */
  async function revisionsOf(db: Database, deal: Deal, included: number | null) {
    const answers = await deliveryAnswers(db, deal.id);
    return { used: answers.filter((a) => a.kind === "changes").length, included };
  }

  /** The work so far, counted by code: the signed version, delivered stages and revisions. */
  async function workRecord(db: Database, deal: Deal, scope: ScopeVersion): Promise<WorkRecord> {
    const { milestones, revisionsIncluded } = scope.content;
    const deliveries = await listDeliveries(db, deal.id);
    const delivered = [...new Set(deliveries.map((d) => d.stage))].sort((a, b) => a - b);
    return {
      version: scope.version,
      delivered: delivered.map((stage) => ({ stage, title: milestones[stage - 1]?.title ?? "" })),
      revisions: await revisionsOf(db, deal, revisionsIncluded ?? null),
    };
  }

  app.get("/api/deals/:id/messages", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    return found ? answer(reply, found) : reply;
  });

  app.post("/api/deals/:id/messages", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const body = await readBody(messageBody, request, reply);
    if (!body) return reply;
    if (!drafting || drafting.clients.length === 0) {
      return reply.code(503).send({ error: "no AI model is configured" });
    }
    const { db, deal, viewer } = found;
    const record = await signedRecord(db, deal);
    if (!record) return reply.code(409).send({ error: REFUSALS["not-signed"].error });
    const numbered = numberSourceLines(body.text);
    if (!numbered.ok) return reply.code(422).send({ error: numbered.message });
    // Refused before the message is saved, so a busy deal does not collect copies of it.
    const earlier = await listMessageReviews(db, deal.id);
    if (earlier.some((r) => r.status === "running")) {
      return reply.code(409).send({ error: REFUSALS["already-running"].error });
    }
    const release = drafting.acquire();
    if (!release) return reply.code(429).send({ error: "busy, try again in a minute" });
    try {
      const file = await addArtifact(
        db,
        postgresContentStore(db, clock),
        {
          id: newId(),
          dealId: deal.id,
          kind: "source",
          filename: `buyer-message-${clock().toISOString().slice(0, 10)}.txt`,
          bytes: new TextEncoder().encode(body.text),
          addedBy: { actor: "seller", actorId: viewer.user.id },
        },
        clock(),
      );
      const review = await startMessageReview(
        db,
        {
          id: newId(),
          dealId: deal.id,
          sellerId: viewer.user.id,
          version: record.scope.version,
          sourceArtifactId: file.id,
          sourceSha256: file.sha256,
          promptVersion: MESSAGE_PROMPT_VERSIONS.review,
          rankPromptVersion: MESSAGE_PROMPT_VERSIONS.rank,
        },
        clock(),
      );
      const { document } = await documentFor(db, deal, record.scope);
      const job = {
        reviewId: review.id,
        dealId: deal.id,
        agreement: agreementLines(document),
        record: await workRecord(db, deal, record.scope),
        message: numbered.lines,
      };
      // The message's text stays out of the server's logs; the deal's files have it.
      request.log.info({ dealId: deal.id, reviewId: review.id }, "Message review started");
      drafting.run(async () => {
        try {
          await runMessageJob(db, drafting, job, clock, request.log);
        } finally {
          release();
        }
      });
      return await answer(reply.code(202), found);
    } catch (error) {
      release();
      if (!(error instanceof ReviewNotAllowedError)) throw error;
      return sendRefusal(reply, REFUSALS[error.reason]);
    }
  });

  return Promise.resolve();
};
