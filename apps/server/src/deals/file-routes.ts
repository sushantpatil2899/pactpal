import {
  ARTIFACT_LIMITS,
  ArtifactIntegrityError,
  ArtifactNotFoundError,
  ArtifactRejectedError,
  addArtifact,
  getArtifact,
  listArtifacts,
  postgresContentStore,
  type Artifact,
  type Database,
} from "@pactpal/db";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import type { DealLookup } from "./access.js";

export interface FileRouteOptions {
  database: Database | undefined;
  visibleDeal: DealLookup;
  sellersDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
}

/** The header that carries the file's name, URL-encoded so any language survives. */
export const FILE_NAME_HEADER = "x-file-name";

// Room for the largest allowed file; the rest of the server keeps Fastify's 1 MB limit.
const UPLOAD_BODY_LIMIT = ARTIFACT_LIMITS.maxFileBytes + 1024;

const REFUSALS: Record<ArtifactRejectedError["reason"], { status: number; error: string }> = {
  "bad-name": { status: 400, error: "file name must be 1-255 characters without slashes" },
  empty: { status: 400, error: "the file is empty" },
  "file-too-large": { status: 413, error: "the file is larger than 10 MB" },
  "deal-full": { status: 409, error: "this deal's files would be over 50 MB" },
};

const fileParams = z.object({ fileId: z.uuid() });

/** The header's file name, or undefined when it is missing or not valid URL encoding. */
function fileNameFrom(header: string | string[] | undefined): string | undefined {
  if (typeof header !== "string") return undefined;
  try {
    return decodeURIComponent(header);
  } catch {
    return undefined;
  }
}

/**
 * `attachment` with the name twice: a plain-ASCII copy for old browsers and the exact name
 * encoded as RFC 5987 describes, so quotes or line breaks in a name cannot break the header.
 */
export function attachmentHeader(filename: string): string {
  const ascii = filename.replace(/[^\x20-\x7e]|["\\]/g, "_");
  const exact = encodeURIComponent(filename).replace(
    /['()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  return `attachment; filename="${ascii}"; filename*=UTF-8''${exact}`;
}

const fileView = (file: Artifact) => ({
  id: file.id,
  kind: file.kind,
  filename: file.filename,
  mediaType: file.mediaType,
  sizeBytes: file.sizeBytes,
  sha256: file.sha256,
  addedAt: file.createdAt.toISOString(),
});

/**
 * Files on a deal: both sides list and download them; only the seller adds them, as sources (what
 * the deal is based on). Delivered work comes with delivery links in Phase 4. Every download is
 * checked against the file's fingerprint first and is always saved, never opened in the page.
 */
export const fileRoutes: FastifyPluginAsync<FileRouteOptions> = (app, options) => {
  const { database, visibleDeal, sellersDeal, clock, newId } = options;
  const store = database && postgresContentStore(database, clock);

  // Uploads arrive as the file's bytes; this parser exists only inside this plugin.
  app.addContentTypeParser(
    "application/octet-stream",
    { parseAs: "buffer", bodyLimit: UPLOAD_BODY_LIMIT },
    (_request, body, done) => {
      done(null, body);
    },
  );

  app.get("/api/deals/:id/files", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    if (!found) return reply;
    const files = await listArtifacts(found.db, found.deal.id);
    return reply.send({ files: files.map(fileView) });
  });

  app.post("/api/deals/:id/files", { bodyLimit: UPLOAD_BODY_LIMIT }, async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found || !store) return reply;
    const filename = fileNameFrom(request.headers[FILE_NAME_HEADER]);
    if (filename === undefined) return reply.code(400).send({ error: "the file name is missing" });
    const { deal, db, viewer } = found;
    try {
      const file = await addArtifact(
        db,
        store,
        {
          id: newId(),
          dealId: deal.id,
          kind: "source",
          filename,
          bytes: Buffer.isBuffer(request.body) ? request.body : new Uint8Array(),
          addedBy: { actor: "seller", actorId: viewer.user.id },
          userAgent: request.headers["user-agent"],
        },
        clock(),
      );
      request.log.info({ dealId: deal.id, fileId: file.id }, "File added");
      return await reply.code(201).send(fileView(file));
    } catch (error) {
      if (!(error instanceof ArtifactRejectedError)) throw error;
      const { status, error: message } = REFUSALS[error.reason];
      return reply.code(status).send({ error: message });
    }
  });

  app.get("/api/deals/:id/files/:fileId", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    if (!found || !store) return reply;
    const params = fileParams.safeParse(request.params);
    if (!params.success) return reply.code(404).send({ error: "not found" });
    try {
      const { artifact, bytes } = await getArtifact(
        found.db,
        store,
        params.data.fileId,
        found.deal.id,
      );
      return await reply
        .header("content-type", artifact.mediaType)
        .header("content-disposition", attachmentHeader(artifact.filename))
        // Even if a browser opened it, the file could not run scripts or load anything.
        .header("content-security-policy", "default-src 'none'; sandbox")
        .header("cache-control", "private, no-store")
        .send(Buffer.from(bytes));
    } catch (error) {
      if (error instanceof ArtifactNotFoundError)
        return reply.code(404).send({ error: "not found" });
      if (!(error instanceof ArtifactIntegrityError)) throw error;
      request.log.error(
        { dealId: found.deal.id, fileId: params.data.fileId },
        "File failed its fingerprint check",
      );
      return reply.code(409).send({ error: "this file failed its check and was not sent" });
    }
  });

  return Promise.resolve();
};
