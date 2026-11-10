import {
  failDraft,
  ArtifactIntegrityError,
  ArtifactNotFoundError,
  addArtifact,
  lastChatSeqDrafted,
  listAllMessages,
  DealNotFoundError,
  DraftNotAllowedError,
  getArtifact,
  getDraft,
  listDrafts,
  postgresContentStore,
  startDraft,
  type Artifact,
  type Database,
} from "@pactpal/db";
import { agreementLines } from "@pactpal/qa";
import { draftSourceText, numberSourceLines } from "@pactpal/scope-draft";
import { currentDocument } from "../acceptance/document.js";
import { CHAT_TRANSCRIPT_PREFIX, chatNames } from "../chat/chat-routes.js";
import type { FastifyBaseLogger, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PROMPT_VERSIONS, runDraftJob } from "../drafting/draft-job.js";
import { draftView } from "../drafting/draft-view.js";
import { numberedChat, textOf } from "../drafting/draft-source.js";
import type { DraftStarter } from "../disputes/checker.js";
import type { DraftingRuntime } from "../drafting/runtime.js";
import { type DealLookup, type FoundDeal, sendRefusal } from "./access.js";
import { sellerModelStep } from "./model-step.js";

export interface DraftRouteOptions {
  database: Database | undefined;
  /** Undefined until a database and at least one AI model key are set. */
  drafting: DraftingRuntime | undefined;
  sellersDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
  /** Starts each draft as a Render Workflow run (9R-1); undefined: drafts run in this server. */
  remoteDrafts?: DraftStarter | undefined;
}

const startBody = z.object({ sourceFileId: z.uuid() });

/**
 * A draft from the deal's own conversation (7h): the in-app chat, pasted chats, or both. With
 * `update` (7i), the agreement as it stands plus only the chat messages since the last draft.
 */
const fromChatBody = z
  .object({
    chat: z.boolean().default(true),
    pastedFileIds: z.array(z.uuid()).max(10).default([]),
    update: z.boolean().default(false),
  })
  .refine((body) => body.chat || body.update || body.pastedFileIds.length > 0, {
    message: "choose at least one source",
    path: ["chat"],
  });
const draftParams = z.object({ draftId: z.uuid() });

const REFUSALS: Record<DraftNotAllowedError["reason"], { status: number; error: string }> = {
  "not-your-deal": { status: 403, error: "only the seller can do this" },
  "not-draft": { status: 409, error: "drafts can only be made while the deal is a draft" },
  "already-running": { status: 409, error: "a draft is already running for this deal" },
  "too-many": { status: 409, error: "this deal already has the most drafts it can have" },
};

/**
 * Drafts of a deal's agreed work, made by the council from a chat saved as a text source file.
 * Only the seller can start, list or read drafts. A draft starts at once as `running`; the page
 * reads it again until it is `ready` or `failed`. A draft is a proposal, never agreed work.
 */
export const draftRoutes: FastifyPluginAsync<DraftRouteOptions> = (app, options) => {
  const { database, drafting, sellersDeal, clock, newId, remoteDrafts } = options;
  const store = database && postgresContentStore(database, clock);

  app.get("/api/deals/:id/drafts", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const drafts = await listDrafts(found.db, found.deal.id);
    return reply.send({ drafts: drafts.map((draft) => draftView(draft, found.deal)) });
  });

  app.get("/api/deals/:id/drafts/:draftId", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const params = draftParams.safeParse(request.params);
    const draft = params.success
      ? await getDraft(found.db, found.deal.id, params.data.draftId)
      : undefined;
    if (!draft) return reply.code(404).send({ error: "not found" });
    // The numbered chat comes with a finished draft, so the page shows exactly what was checked.
    const lines =
      draft.status === "running" || !store
        ? null
        : await numberedChat(found, draft, store, request.log);
    return reply.send({ draft: draftView(draft, found.deal, lines) });
  });

  /**
   * Starts a draft from a text source file of the deal (already read and fingerprint-checked):
   * numbers its lines, records the draft as running and runs the council in the background.
   * `from` says how far into the in-app chat the file reads and, for an update, which version
   * it starts from (7h, 7i).
   */
  async function beginDraft(
    found: FoundDeal,
    file: { artifact: Artifact; bytes: Uint8Array },
    from: { chatThroughSeq?: number; basedOnVersion?: number },
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    if (!drafting || drafting.clients.length === 0) {
      return reply.code(503).send({ error: "no AI model is configured" });
    }
    const { deal, db, viewer } = found;
    const text = textOf(file.bytes);
    if (text === undefined) return reply.code(422).send({ error: "the file is not plain text" });
    const numbered = numberSourceLines(text);
    if (!numbered.ok) return reply.code(422).send({ error: numbered.message });

    // A draft run on Render takes no place in this server's council limit.
    const release = remoteDrafts ? () => undefined : drafting.acquire();
    if (!release) return reply.code(429).send({ error: "busy, try again in a minute" });
    try {
      const record = await startDraft(
        db,
        {
          id: newId(),
          dealId: deal.id,
          sellerId: viewer.user.id,
          sourceArtifactId: file.artifact.id,
          sourceSha256: file.artifact.sha256,
          draftPromptVersion: PROMPT_VERSIONS.draft,
          rankPromptVersion: PROMPT_VERSIONS.rank,
          ...from,
        },
        clock(),
      );
      request.log.info({ dealId: deal.id, draftId: record.id }, "Draft started");
      if (remoteDrafts) {
        try {
          await remoteDrafts({ dealId: deal.id, draftId: record.id });
        } catch (error) {
          await failDraft(
            db,
            { draftId: record.id, reason: "the draft could not be started" },
            clock(),
          );
          request.log.error(
            {
              dealId: deal.id,
              draftId: record.id,
              err: error instanceof Error ? error.name : "unknown",
            },
            "Draft not started on Render",
          );
          return await reply.code(502).send({ error: "the draft could not be started; try again" });
        }
        return await reply.code(202).send({ draft: draftView(record, deal) });
      }
      drafting.run(async () => {
        try {
          await runDraftJob(
            db,
            drafting,
            {
              draftId: record.id,
              deal,
              sellerId: viewer.user.id,
              source: {
                artifactId: file.artifact.id,
                sha256: file.artifact.sha256,
                lines: numbered.lines,
              },
            },
            clock,
            request.log,
          );
        } finally {
          release();
        }
      });
      return await reply.code(202).send({ draft: draftView(record, deal) });
    } catch (error) {
      release();
      if (error instanceof DealNotFoundError) return reply.code(404).send({ error: "not found" });
      if (!(error instanceof DraftNotAllowedError)) throw error;
      return sendRefusal(reply, REFUSALS[error.reason]);
    }
  }

  /** A text source file of the deal, checked against its fingerprint; or undefined after answering. */
  async function sourceFile(
    found: FoundDeal,
    fileId: string,
    reply: FastifyReply,
    log: FastifyBaseLogger,
  ) {
    if (!store) return undefined;
    try {
      const file = await getArtifact(found.db, store, fileId, found.deal.id);
      if (file.artifact.kind !== "source" || file.artifact.mediaType !== "text/plain") {
        await reply.code(404).send({ error: "no such text source file on this deal" });
        return undefined;
      }
      return file;
    } catch (error) {
      if (error instanceof ArtifactNotFoundError) {
        await reply.code(404).send({ error: "no such file on this deal" });
        return undefined;
      }
      if (!(error instanceof ArtifactIntegrityError)) throw error;
      log.error({ dealId: found.deal.id, fileId }, "Chat file failed its check");
      await reply.code(409).send({ error: "this file failed its check and was not used" });
      return undefined;
    }
  }

  app.post("/api/deals/:id/drafts", async (request, reply) => {
    const step = await sellerModelStep(sellersDeal, startBody, drafting, request, reply);
    if (!step || !store) return reply;
    const { found, body } = step;
    // The chat must be a text source file of this deal; reading it checks its fingerprint.
    const file = await sourceFile(found, body.sourceFileId, reply, request.log);
    return file ? beginDraft(found, file, {}, request, reply) : reply;
  });

  app.post("/api/deals/:id/drafts/from-chat", async (request, reply) => {
    const step = await sellerModelStep(sellersDeal, fromChatBody, drafting, request, reply);
    if (!step || !store) return reply;
    const { found, body } = step;
    const { db, deal, viewer } = found;

    // For an update: the agreement as the buyer last saw it, and the chat since the last draft.
    const current = body.update ? await currentDocument(db, deal) : undefined;
    if (body.update && !current) {
      return reply.code(409).send({ error: "there is no agreement to update yet" });
    }
    const after = body.update ? await lastChatSeqDrafted(db, deal.id) : 0;
    const messages = body.chat || body.update ? await listAllMessages(db, deal.id, after) : [];
    const pasted = [];
    for (const id of body.pastedFileIds) {
      const file = await sourceFile(found, id, reply, request.log);
      if (!file) return reply;
      const text = textOf(file.bytes);
      if (text === undefined || file.artifact.filename.startsWith(CHAT_TRANSCRIPT_PREFIX)) {
        return reply.code(422).send({ error: "only pasted chats can be added" });
      }
      pasted.push({ filename: file.artifact.filename, text });
    }
    if (!current && pasted.length === 0 && messages.length === 0) {
      return reply.code(422).send({ error: "the chat has no messages yet" });
    }

    const names = await chatNames(db, deal);
    const text = draftSourceText({
      ...(current
        ? {
            current: {
              version: current.scope.version,
              lines: agreementLines(current.document).map((line) => line.text),
            },
          }
        : {}),
      ...(body.chat || body.update
        ? {
            chat: messages.map((message) => ({
              seq: message.seq,
              at: message.createdAt.toISOString(),
              name: names[message.role],
              role: message.role,
              body: message.body,
            })),
          }
        : {}),
      pasted,
    });
    const numbered = numberSourceLines(text);
    if (!numbered.ok) {
      return reply.code(422).send({
        error: `${numbered.message} Try "Update from the latest chat", which reads only new messages.`,
      });
    }
    // The exact text the models read is kept as a source file of the deal, with its fingerprint.
    const artifact = await addArtifact(
      db,
      store,
      {
        id: newId(),
        dealId: deal.id,
        kind: "source",
        filename: `${CHAT_TRANSCRIPT_PREFIX}${clock().toISOString().replace(/[:.]/g, "-")}.txt`,
        bytes: new TextEncoder().encode(text),
        addedBy: { actor: "seller", actorId: viewer.user.id },
      },
      clock(),
    );
    const lastSeq = messages.at(-1)?.seq ?? after;
    return beginDraft(
      found,
      { artifact, bytes: new TextEncoder().encode(text) },
      {
        ...(body.chat || body.update ? { chatThroughSeq: lastSeq } : {}),
        ...(current ? { basedOnVersion: current.scope.version } : {}),
      },
      request,
      reply,
    );
  });

  return Promise.resolve();
};
