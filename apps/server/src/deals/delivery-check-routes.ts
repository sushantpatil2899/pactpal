import { parseJsonReply } from "@pactpal/ai";
import {
  DeliveryCheckNotAllowedError,
  ArtifactNotFoundError,
  getArtifact,
  listDeliveryChecks,
  postgresContentStore,
  recordDeliveryCheck,
  type Database,
  type Deal,
  type DeliveryCheck,
} from "@pactpal/db";
import {
  LOOK_PROMPT_VERSION,
  buildLookMessages,
  checkLook,
  checkableLines,
  codeChecks,
  imageFacts,
  type CheckLine,
  type CheckedFile,
  type Look,
} from "@pactpal/delivery-check";
import type { FastifyBaseLogger, FastifyPluginAsync } from "fastify";
import { z } from "zod";
import type { ModelMemory } from "../drafting/model-memory.js";
import { MAX_COPY_CHARS, askImageModels, imageCopySchema } from "../drafting/vision.js";
import type { DraftingRuntime } from "../drafting/runtime.js";
import { signedRecord } from "../payments/signed-record.js";
import { featureAnswers, readBody, type DealLookup } from "./access.js";

export interface DeliveryCheckRouteOptions {
  sellersDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
  /** The models with keys and the random markers; without it only the code checks run. */
  drafting: DraftingRuntime | undefined;
  /** Recent model outcomes, shared with buyer questions, to choose the model. */
  models: ModelMemory;
}

/** At most this many images are looked at per check. */
export const MAX_LOOKS_PER_CHECK = 4;
const BODY_LIMIT = MAX_LOOKS_PER_CHECK * MAX_COPY_CHARS + 64 * 1024;

const checkBody = z.object({
  stage: z.number().int().min(1).max(20),
  fileIds: z
    .array(z.uuid())
    .min(1)
    .max(10)
    .refine((ids) => new Set(ids).size === ids.length, "each file once"),
  copies: z.array(imageCopySchema).max(MAX_LOOKS_PER_CHECK).default([]),
});

const REFUSALS: Record<DeliveryCheckNotAllowedError["reason"], { status: number; error: string }> =
  {
    "not-your-deal": { status: 403, error: "only the seller can do this" },
    "not-signed": { status: 409, error: "the deal is not signed yet" },
    "too-many": { status: 429, error: "this deal already has the most checks allowed" },
    "wrong-files": { status: 400, error: "those files are not this deal's delivered files" },
  };

/** One image's look: by which model, or that none was available. */
type LookResult =
  | { fileId: string; model: string; promptVersion: number; look: Look }
  | { fileId: string; unavailable: true };

/** A check as the seller's page reads it; the model's name stays stored, not shown. */
const checkView = (check: DeliveryCheck) => {
  const looks = z
    .array(z.record(z.string(), z.unknown()))
    .catch([])
    .parse(check.report.looks)
    .map((look) => Object.fromEntries(Object.entries(look).filter(([key]) => key !== "model")));
  return {
    id: check.id,
    stage: check.stage,
    version: check.version,
    checkedAt: check.createdAt.toISOString(),
    files: check.files.map(({ fileId, filename }) => ({ fileId, filename })),
    report: { ...check.report, looks },
  };
};

/**
 * The pre-delivery check (4l), for the seller only: code checks of the delivered files against
 * the signed agreement's lines, then a vision model's look at each image (a smaller copy made by
 * the seller's browser). Kept apart from the evidence log; it never blocks sending.
 */
export const deliveryCheckRoutes: FastifyPluginAsync<DeliveryCheckRouteOptions> = (
  app,
  options,
) => {
  const { sellersDeal, clock, newId, drafting, models } = options;

  const { answer, step } = featureAnswers(
    async ({ db, deal }) => ({
      checks: (await listDeliveryChecks(db, deal.id)).map(checkView),
    }),
    (error) => {
      if (!(error instanceof DeliveryCheckNotAllowedError)) return undefined;
      const { status, error: message } = REFUSALS[error.reason];
      return { status, body: { error: message } };
    },
  );

  /** The look at each image copy, by the image models in the order their records suggest. */
  async function looks(
    db: Database,
    deal: Deal,
    lines: readonly CheckLine[],
    copies: z.output<typeof checkBody>["copies"],
    log: FastifyBaseLogger,
  ): Promise<LookResult[]> {
    const results: LookResult[] = [];
    for (const { fileId, mediaType, base64 } of copies) {
      const answered = await askImageModels({
        db,
        drafting,
        models,
        log,
        dealId: deal.id,
        what: "Looking at a delivered image",
        messages: () => {
          if (!drafting) return undefined;
          const image = { mediaType, base64 };
          const built = buildLookMessages({ lines, image, marker: drafting.council.newMarker() });
          return built.ok ? built.messages : undefined;
        },
        read: (outcome) => {
          const parsed = parseJsonReply(outcome);
          const checked = parsed.ok
            ? checkLook(
                parsed.value,
                lines.map((line) => line.n),
              )
            : undefined;
          return checked?.ok === true ? checked.look : undefined;
        },
      });
      results.push(
        answered
          ? {
              fileId,
              model: answered.model,
              promptVersion: LOOK_PROMPT_VERSION,
              look: answered.value,
            }
          : { fileId, unavailable: true },
      );
    }
    return results;
  }

  app.get("/api/deals/:id/delivery-checks", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    return found ? answer(reply, found) : reply;
  });

  app.post("/api/deals/:id/delivery-checks", { bodyLimit: BODY_LIMIT }, async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const body = await readBody(checkBody, request, reply);
    if (!body) return reply;
    const { db, deal, viewer } = found;
    const record = await signedRecord(db, deal);
    if (!record) return reply.code(409).send({ error: REFUSALS["not-signed"].error });
    const { content } = record.scope;
    if (body.stage > content.milestones.length) {
      return reply.code(400).send({ error: "the agreement has no such payment stage" });
    }
    const store = postgresContentStore(db, clock);
    const files: (CheckedFile & { sha256: string })[] = [];
    for (const fileId of body.fileIds) {
      try {
        const { artifact, bytes } = await getArtifact(db, store, fileId, deal.id, "deliverable");
        files.push({
          fileId,
          filename: artifact.filename,
          sha256: artifact.sha256,
          facts: imageFacts(bytes),
        });
      } catch (error) {
        if (!(error instanceof ArtifactNotFoundError)) throw error;
        return reply.code(400).send({ error: REFUSALS["wrong-files"].error });
      }
    }
    const lines = checkableLines(content.deliverables, content.deliverableKinds);
    // Only copies of the images being checked are looked at.
    const images = new Set(
      files.filter((f) => f.facts.mediaType.startsWith("image/")).map((f) => f.fileId),
    );
    const copies = body.copies.filter((copy) => images.has(copy.fileId));
    const looked = lines.length === 0 ? [] : await looks(db, deal, lines, copies, request.log);
    return step(reply, found, async () => {
      await recordDeliveryCheck(
        db,
        {
          id: newId(),
          dealId: deal.id,
          sellerId: viewer.user.id,
          version: record.scope.version,
          stage: body.stage,
          files: files.map(({ fileId, filename, sha256 }) => ({ fileId, filename, sha256 })),
          report: {
            lines,
            files: files.map(({ fileId, filename, facts }) => ({ fileId, filename, facts })),
            code: codeChecks(lines, files),
            looks: looked,
          },
        },
        clock(),
      );
      request.log.info(
        { dealId: deal.id, files: files.length, looked: looked.length },
        "Pre-delivery check done",
      );
    });
  });

  return Promise.resolve();
};
