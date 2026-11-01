import {
  ArtifactIntegrityError,
  ArtifactNotFoundError,
  DealNotFoundError,
  DraftNotAllowedError,
  getArtifact,
  getDraft,
  listDrafts,
  postgresContentStore,
  startDraft,
  type ContentStore,
  type Database,
  type DraftRecord,
} from "@pactpal/db";
import { numberSourceLines, type SourceLine } from "@pactpal/scope-draft";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { PROMPT_VERSIONS, runDraftJob } from "../drafting/draft-job.js";
import { draftView } from "../drafting/draft-view.js";
import type { DraftingRuntime } from "../drafting/runtime.js";
import { readBody, type DealLookup } from "./access.js";

export interface DraftRouteOptions {
  database: Database | undefined;
  /** Undefined until a database and at least one AI model key are set. */
  drafting: DraftingRuntime | undefined;
  sellersDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
}

const startBody = z.object({ sourceFileId: z.uuid() });
const draftParams = z.object({ draftId: z.uuid() });

const REFUSALS: Record<DraftNotAllowedError["reason"], { status: number; error: string }> = {
  "not-your-deal": { status: 403, error: "only the seller can do this" },
  "not-draft": { status: 409, error: "drafts can only be made while the deal is a draft" },
  "already-running": { status: 409, error: "a draft is already running for this deal" },
  "too-many": { status: 409, error: "this deal already has the most drafts it can have" },
};

const decoder = new TextDecoder("utf-8", { fatal: true });

/** The file's text, or undefined when it is not valid UTF-8. */
function textOf(bytes: Uint8Array): string | undefined {
  try {
    return decoder.decode(bytes);
  } catch {
    return undefined;
  }
}

/** The numbered chat a draft was made from, read again from the stored file; null if it cannot be. */
async function numberedChat(
  found: { db: Database; deal: { id: string } },
  draft: DraftRecord,
  store: ContentStore,
  log: { error(fields: object, message: string): void },
): Promise<SourceLine[] | null> {
  try {
    const file = await getArtifact(found.db, store, draft.sourceArtifactId, found.deal.id);
    const text = textOf(file.bytes);
    const numbered = text === undefined ? undefined : numberSourceLines(text);
    return numbered?.ok ? numbered.lines : null;
  } catch (error) {
    // The draft is still shown; only the chat beside it is missing.
    log.error(
      {
        dealId: found.deal.id,
        draftId: draft.id,
        err: error instanceof Error ? error.name : "unknown",
      },
      "The chat of a draft could not be read",
    );
    return null;
  }
}

/**
 * Drafts of a deal's agreed work, made by the council from a chat saved as a text source file.
 * Only the seller can start, list or read drafts. A draft starts at once as `running`; the page
 * reads it again until it is `ready` or `failed`. A draft is a proposal, never agreed work.
 */
export const draftRoutes: FastifyPluginAsync<DraftRouteOptions> = (app, options) => {
  const { database, drafting, sellersDeal, clock, newId } = options;
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

  app.post("/api/deals/:id/drafts", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found || !store) return reply;
    const body = await readBody(startBody, request, reply);
    if (!body) return reply;
    if (!drafting || drafting.clients.length === 0) {
      return reply.code(503).send({ error: "no AI model is configured" });
    }
    const { deal, db, viewer } = found;

    // The chat must be a text source file of this deal; reading it checks its fingerprint.
    let file;
    try {
      file = await getArtifact(db, store, body.sourceFileId, deal.id);
    } catch (error) {
      if (error instanceof ArtifactNotFoundError) {
        return reply.code(404).send({ error: "no such file on this deal" });
      }
      if (!(error instanceof ArtifactIntegrityError)) throw error;
      request.log.error(
        { dealId: deal.id, fileId: body.sourceFileId },
        "Chat file failed its check",
      );
      return reply.code(409).send({ error: "this file failed its check and was not used" });
    }
    if (file.artifact.kind !== "source" || file.artifact.mediaType !== "text/plain") {
      return reply.code(404).send({ error: "no such text source file on this deal" });
    }
    const text = textOf(file.bytes);
    if (text === undefined) return reply.code(422).send({ error: "the file is not plain text" });
    const numbered = numberSourceLines(text);
    if (!numbered.ok) return reply.code(422).send({ error: numbered.message });

    const release = drafting.acquire();
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
        },
        clock(),
      );
      request.log.info({ dealId: deal.id, draftId: record.id }, "Draft started");
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
      const { status, error: message } = REFUSALS[error.reason];
      return reply.code(status).send({ error: message });
    }
  });

  return Promise.resolve();
};
