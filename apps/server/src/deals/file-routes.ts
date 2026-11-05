import {
  ARTIFACT_LIMITS,
  ArtifactRejectedError,
  addArtifact,
  listArtifacts,
  postgresContentStore,
  type Artifact,
  type Database,
  type Deal,
} from "@pactpal/db";
import type { EmailSender } from "@pactpal/email";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { requestOrigin } from "../request-origin.js";
import { buyerFileEmail } from "../email/buyer-file-email.js";
import { emailSellerQuietly } from "../email/deal-mail.js";
import type { DealLookup } from "./access.js";
import { sendCheckedFile } from "./download.js";
import { roleIn } from "./visibility.js";

export interface FileRouteOptions {
  database: Database | undefined;
  visibleDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
  /** Whether visitors' IP addresses are known (the number of proxies is set). */
  recordIp: boolean;
  /** Tells the seller when the buyer adds a file. */
  email: EmailSender;
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
  "buyer-type": { status: 415, error: "you can add PDF, PNG, JPEG, GIF or text files" },
  "buyer-files-full": {
    status: 409,
    error: "you have added as many files as one deal allows (20 files, 20 MB)",
  },
};

const fileParams = z.object({ fileId: z.uuid() });
/** An upload is a source file unless the seller marks it as delivered work (buyers add sources). */
const uploadQuery = z.object({ kind: z.enum(["source", "deliverable"]).default("source") });

/** The header's file name, or undefined when it is missing or not valid URL encoding. */
function fileNameFrom(header: string | string[] | undefined): string | undefined {
  if (typeof header !== "string") return undefined;
  try {
    return decodeURIComponent(header);
  } catch {
    return undefined;
  }
}

/** Who added a file, as both sides see it: the deal's seller, its buyer, or PactPal itself. */
export function addedByRole(file: Artifact, deal: Deal): "seller" | "buyer" | "system" {
  if (file.addedBy === undefined) return "system";
  if (file.addedBy === deal.sellerId) return "seller";
  return file.addedBy === deal.buyerId ? "buyer" : "system";
}

const fileView = (file: Artifact, deal: Deal) => ({
  id: file.id,
  kind: file.kind,
  addedBy: addedByRole(file, deal),
  filename: file.filename,
  mediaType: file.mediaType,
  sizeBytes: file.sizeBytes,
  sha256: file.sha256,
  addedAt: file.createdAt.toISOString(),
});

/**
 * Files on a deal: both sides list, download and add them. The seller adds sources (what the deal
 * is based on) and delivered work; the buyer, signed in or by their link, adds reference files
 * (5b), within their own limits, and the seller is emailed. Every download is checked against the
 * file's fingerprint first and is always saved, never opened in the page.
 */
export const fileRoutes: FastifyPluginAsync<FileRouteOptions> = (app, options) => {
  const { database, visibleDeal, clock, newId, recordIp, email } = options;
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
    const files = await listArtifacts(found.db, found.deal.id, "source");
    return reply.send({ files: files.map((file) => fileView(file, found.deal)) });
  });

  app.post("/api/deals/:id/files", { bodyLimit: UPLOAD_BODY_LIMIT }, async (request, reply) => {
    const found = await visibleDeal(request, reply);
    if (!found || !store) return reply;
    const { deal, db, viewer } = found;
    const role = roleIn(viewer, deal);
    // The seller adds files signed in with PayPal; the buyer also by their private link.
    if (role === "seller" && viewer.access.method !== "paypal") {
      return reply.code(403).send({ error: "only the seller can do this" });
    }
    const query = uploadQuery.safeParse(request.query);
    if (!query.success) return reply.code(400).send({ error: "invalid", fields: ["kind"] });
    if (role === "buyer" && query.data.kind !== "source") {
      return reply.code(403).send({ error: "only the seller adds delivered work" });
    }
    const filename = fileNameFrom(request.headers[FILE_NAME_HEADER]);
    if (filename === undefined) return reply.code(400).send({ error: "the file name is missing" });
    try {
      const file = await addArtifact(
        db,
        store,
        {
          id: newId(),
          dealId: deal.id,
          kind: query.data.kind,
          filename,
          bytes: Buffer.isBuffer(request.body) ? request.body : new Uint8Array(),
          addedBy: { actor: role, actorId: viewer.user.id },
          ...requestOrigin(request, recordIp),
        },
        clock(),
      );
      request.log.info({ dealId: deal.id, fileId: file.id, by: role }, "File added");
      if (role === "buyer") {
        await emailSellerQuietly(
          { db, deal, email, clock, log: request.log, what: "Buyer file email" },
          (to) =>
            buyerFileEmail({
              to,
              dealTitle: deal.title,
              filename: file.filename,
              sizeBytes: file.sizeBytes,
              addedAt: file.createdAt,
              idempotencyKey: `buyer-file:${file.id}`,
            }),
        );
      }
      return await reply.code(201).send(fileView(file, deal));
    } catch (error) {
      if (!(error instanceof ArtifactRejectedError)) throw error;
      const { status, error: message } = REFUSALS[error.reason];
      return reply.code(status).send({ error: message });
    }
  });

  // Source files only: delivered files are reached through their delivery, so each download is logged.
  app.get("/api/deals/:id/files/:fileId", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    if (!found || !store) return reply;
    const params = fileParams.safeParse(request.params);
    if (!params.success) return reply.code(404).send({ error: "not found" });
    return sendCheckedFile(reply, request.log, {
      db: found.db,
      store,
      dealId: found.deal.id,
      fileId: params.data.fileId,
      kind: "source",
    });
  });

  return Promise.resolve();
};
