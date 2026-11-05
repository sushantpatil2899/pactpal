import { ArtifactNotFoundError, getArtifact, postgresContentStore } from "@pactpal/db";
import {
  MAX_SCREENSHOTS,
  buildScreenshotMessages,
  checkTranscript,
  transcriptText,
  type Transcript,
} from "@pactpal/scope-draft";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import type { ModelMemory } from "../drafting/model-memory.js";
import type { DraftingRuntime } from "../drafting/runtime.js";
import { MAX_COPY_CHARS, askImageModels, imageCopySchema } from "../drafting/vision.js";
import { readBody, type DealLookup } from "./access.js";

export interface ScreenshotRouteOptions {
  sellersDeal: DealLookup;
  clock: () => Date;
  /** The models with keys; without any that read images, screenshots cannot be read. */
  drafting: DraftingRuntime | undefined;
  /** Recent model outcomes, shared with questions and checks, to choose the model. */
  models: ModelMemory;
}

const BODY_LIMIT = MAX_SCREENSHOTS * MAX_COPY_CHARS + 64 * 1024;

const readBodySchema = z.object({
  /** The screenshots in the order the seller picked them: source files of this deal. */
  fileIds: z
    .array(z.uuid())
    .min(1)
    .max(MAX_SCREENSHOTS)
    .refine((ids) => new Set(ids).size === ids.length, "each file once"),
  copies: z.array(imageCopySchema).max(MAX_SCREENSHOTS),
});

/**
 * Reading chat screenshots into text (4o), for the seller of a deal still in draft: each saved
 * screenshot's smaller copy goes to the image models, and the messages come back joined as
 * "Speaker: text" lines for the chat box. A helper only: nothing is stored or logged here; the
 * seller checks the text, and drafting saves what they checked as the chat.
 */
export const screenshotRoutes: FastifyPluginAsync<ScreenshotRouteOptions> = (app, options) => {
  const { sellersDeal, clock, drafting, models } = options;

  app.post("/api/deals/:id/screenshots/read", { bodyLimit: BODY_LIMIT }, async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const body = await readBody(readBodySchema, request, reply);
    if (!body) return reply;
    const { db, deal } = found;
    if (deal.status !== "draft") {
      return reply
        .code(409)
        .send({ error: "screenshots are read while the agreed work is a draft" });
    }
    if (!drafting?.clients.some((client) => client.spec.vision === true)) {
      return reply.code(503).send({ error: "no AI model that reads images is configured" });
    }
    const store = postgresContentStore(db, clock);
    const files: { fileId: string; filename: string }[] = [];
    for (const fileId of body.fileIds) {
      try {
        const { artifact } = await getArtifact(db, store, fileId, deal.id, "source");
        if (!artifact.mediaType.startsWith("image/")) throw new ArtifactNotFoundError(fileId);
        files.push({ fileId, filename: artifact.filename });
      } catch (error) {
        if (!(error instanceof ArtifactNotFoundError)) throw error;
        return reply
          .code(400)
          .send({ error: "those files are not screenshots saved on this deal" });
      }
    }
    const transcripts: Transcript[] = [];
    const screenshots = [];
    for (const [i, file] of files.entries()) {
      const copy = body.copies.find((c) => c.fileId === file.fileId);
      const read = copy
        ? await askImageModels({
            db,
            drafting,
            models,
            log: request.log,
            dealId: deal.id,
            what: "Reading a chat screenshot",
            messages: () =>
              buildScreenshotMessages({
                image: { mediaType: copy.mediaType, base64: copy.base64 },
                index: i + 1,
                count: files.length,
              }),
            read: checkTranscript,
          })
        : undefined;
      if (read) transcripts.push(read.value);
      screenshots.push({
        ...file,
        read: read !== undefined,
        messages: read?.value.messages.length ?? 0,
      });
    }
    const joined = transcriptText(transcripts);
    if (!joined)
      return reply.code(422).send({ error: "the screenshots hold more text than a chat may have" });
    // Neither the screenshots' text nor file names reach the server's logs.
    request.log.info(
      { dealId: deal.id, screenshots: files.length, read: transcripts.length },
      "Chat screenshots read",
    );
    return reply.send({ ...joined, screenshots });
  });

  return Promise.resolve();
};
