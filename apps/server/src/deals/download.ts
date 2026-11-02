import type { FastifyReply } from "fastify";

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
