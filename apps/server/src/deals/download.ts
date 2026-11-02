import {
  ArtifactIntegrityError,
  ArtifactNotFoundError,
  getArtifact,
  type Artifact,
  type ArtifactKind,
  type ContentStore,
  type Database,
} from "@pactpal/db";
import type { FastifyBaseLogger, FastifyReply } from "fastify";

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

/**
 * Sends bytes as a file to save, never to show: `attachment` with the exact name, the given type,
 * and rules so that even if a browser opened it, it could not run scripts or load anything. Never
 * cached. Used for every download (deal files, receipts).
 */
export function sendDownload(
  reply: FastifyReply,
  file: { mediaType: string; filename: string; bytes: Uint8Array },
): FastifyReply {
  return reply
    .header("content-type", file.mediaType)
    .header("content-disposition", attachmentHeader(file.filename))
    .header("content-security-policy", "default-src 'none'; sandbox")
    .header("cache-control", "private, no-store")
    .send(Buffer.from(file.bytes));
}

/**
 * Sends one of a deal's stored files after checking its bytes against its fingerprint: 404 if it
 * is not this deal's file of `kind`, 409 (logged) if the bytes no longer match. `beforeSend` runs
 * once the file is known to be good, for example to log the download.
 */
export async function sendCheckedFile(
  reply: FastifyReply,
  log: FastifyBaseLogger,
  file: { db: Database; store: ContentStore; dealId: string; fileId: string; kind: ArtifactKind },
  beforeSend?: (artifact: Artifact) => Promise<unknown>,
): Promise<FastifyReply> {
  try {
    const { artifact, bytes } = await getArtifact(
      file.db,
      file.store,
      file.fileId,
      file.dealId,
      file.kind,
    );
    await beforeSend?.(artifact);
    return await sendDownload(reply, {
      mediaType: artifact.mediaType,
      filename: artifact.filename,
      bytes,
    });
  } catch (error) {
    if (error instanceof ArtifactNotFoundError) return reply.code(404).send({ error: "not found" });
    if (!(error instanceof ArtifactIntegrityError)) throw error;
    log.error({ dealId: file.dealId, fileId: file.fileId }, "File failed its fingerprint check");
    return reply.code(409).send({ error: "this file failed its check and was not sent" });
  }
}
