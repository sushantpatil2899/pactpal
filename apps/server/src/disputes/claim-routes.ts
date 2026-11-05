import { CLAIM_PROMPT_VERSION, claimAnalysisSchema, recordLines } from "@pactpal/claims";
import { COUNCIL_RANK_PROMPT_VERSION } from "@pactpal/council";
import {
  AnalysisNotAllowedError,
  addArtifact,
  failClaimAnalysis,
  failStaleClaimAnalyses,
  listClaimAnalyses,
  postgresContentStore,
  readLedger,
  startClaimAnalysis,
  type ClaimAnalysisRecord,
  type StoredDispute,
} from "@pactpal/db";
import type { FastifyPluginAsync, FastifyReply } from "fastify";
import { z } from "zod";
import { readBody, sendRefusal, type DealLookup, type FoundDeal } from "../deals/access.js";
import { councilRecordSchema } from "../drafting/council-record.js";
import { RunnerBusyError, type ClaimRunner } from "./checker.js";
import { sellersDispute } from "./dispute-lookup.js";
import { messagesOf } from "./dispute-view.js";

export interface ClaimRouteOptions {
  sellersDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
  /** Starts a comparison; absent until the AI models (or Render) are set up. */
  claims: ClaimRunner | undefined;
}

/** The seller's copy of the claim, when PayPal shows none: as long as a pasted chat may be. */
const startBody = z.object({ pasted: z.string().trim().min(1).max(20_000).optional() });

const REFUSALS: Record<AnalysisNotAllowedError["reason"], { status: number; error: string }> = {
  "not-your-deal": { status: 403, error: "only the seller can do this" },
  "not-this-deal": { status: 404, error: "not found" },
  "already-running": { status: 409, error: "a comparison is already running" },
  "too-many": { status: 429, error: "this dispute already has the most comparisons allowed" },
};

/** What the council did, for the council panel; the candidates stay stored, not shown. */
const councilView = councilRecordSchema
  .extend({ candidates: z.array(z.unknown()) })
  // Undefined fields are left out of the answer, so the drafts are not sent to the page.
  .transform((record) => ({ ...record, candidates: undefined }));

/** One comparison for the page: the analysis with each cited record entry's words, and the council. */
function analysisView(analysis: ClaimAnalysisRecord, recordText: ReadonlyMap<number, string>) {
  const parsed = claimAnalysisSchema.safeParse(analysis.analysis);
  const council = councilView.safeParse(analysis.council);
  return {
    id: analysis.id,
    status: analysis.status,
    createdAt: analysis.createdAt.toISOString(),
    finishedAt: analysis.finishedAt?.toISOString() ?? null,
    failureReason: analysis.failureReason ?? null,
    analysis: parsed.success
      ? {
          ...parsed.data,
          statements: parsed.data.statements.map((statement) => ({
            ...statement,
            record: statement.record.map((n) => ({
              n,
              text: recordText.get(n) ?? `#${String(n)}`,
            })),
          })),
        }
      : null,
    council: council.success ? council.data : null,
  };
}

/**
 * Comparing a dispute claim with the record (5d), for the seller only. A comparison is a draft by
 * a council of AI models, kept apart from the evidence; the log gets its fingerprint only.
 */
export const claimRoutes: FastifyPluginAsync<ClaimRouteOptions> = (app, options) => {
  const { sellersDeal, clock, newId, claims } = options;
  const base = "/api/deals/:id/disputes/:disputeId/analyses";

  async function answer(reply: FastifyReply, found: FoundDeal, dispute: StoredDispute) {
    await failStaleClaimAnalyses(found.db, clock());
    const [analyses, ledger] = await Promise.all([
      listClaimAnalyses(found.db, dispute.disputeId),
      readLedger(found.db, found.deal.id),
    ]);
    const recordText = new Map(recordLines(ledger).lines.map(({ n, text }) => [n, text]));
    const buyerSpoke = (messagesOf(dispute.details) ?? []).some((m) => m.from === "BUYER");
    return reply.send({
      canCompare: claims !== undefined,
      canPaste: !buyerSpoke,
      analyses: analyses.map((analysis) => analysisView(analysis, recordText)),
    });
  }

  app.get(base, async (request, reply) => {
    const both = await sellersDispute(sellersDeal, request, reply);
    return both ? answer(reply, both.found, both.dispute) : reply;
  });

  app.post(base, async (request, reply) => {
    const both = await sellersDispute(sellersDeal, request, reply);
    if (!both) return reply;
    const { found, dispute } = both;
    const body = await readBody(startBody, request, reply);
    if (!body) return reply;
    if (!claims) return reply.code(503).send({ error: "no AI model is configured" });
    const { db, deal, viewer } = found;
    if (
      body.pasted !== undefined &&
      (messagesOf(dispute.details) ?? []).some((m) => m.from === "BUYER")
    ) {
      return reply
        .code(409)
        .send({ error: "PayPal shows the buyer's messages, so there is nothing to paste" });
    }
    let analysisId: string | undefined;
    try {
      // The pasted claim is the buyer's words as the seller received them: a source file.
      const pasted =
        body.pasted === undefined
          ? undefined
          : await addArtifact(
              db,
              postgresContentStore(db, clock),
              {
                id: newId(),
                dealId: deal.id,
                kind: "source",
                filename: `buyer-claim-${clock().toISOString().slice(0, 10)}.txt`,
                bytes: new TextEncoder().encode(body.pasted),
                addedBy: { actor: "seller", actorId: viewer.user.id },
              },
              clock(),
            );
      const started = await startClaimAnalysis(
        db,
        {
          id: newId(),
          dealId: deal.id,
          disputeId: dispute.disputeId,
          sellerId: viewer.user.id,
          ...(pasted === undefined ? {} : { pastedArtifactId: pasted.id }),
          promptVersion: CLAIM_PROMPT_VERSION,
          rankPromptVersion: COUNCIL_RANK_PROMPT_VERSION,
        },
        clock(),
      );
      analysisId = started.id;
      await claims.start(started.id);
      request.log.info({ dealId: deal.id, analysisId }, "Claim comparison started");
      return await answer(reply.code(202), found, dispute);
    } catch (error) {
      if (error instanceof AnalysisNotAllowedError)
        return sendRefusal(reply, REFUSALS[error.reason]);
      if (analysisId === undefined) throw error;
      const busy = error instanceof RunnerBusyError;
      await failClaimAnalysis(
        db,
        { analysisId, reason: busy ? "every council place was taken" : "could not be started" },
        clock(),
      );
      request.log.warn(
        { dealId: deal.id, analysisId, err: error instanceof Error ? error.name : "unknown" },
        "Claim comparison not started",
      );
      return busy
        ? reply.code(429).send({ error: "busy, try again in a minute" })
        : reply.code(502).send({ error: "the comparison could not be started; try again" });
    }
  });

  return Promise.resolve();
};
