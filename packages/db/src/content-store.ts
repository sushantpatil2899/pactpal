import { sha256Hex } from "@pactpal/ledger";
import { z } from "zod";
import type { Queryable } from "./database.js";

/**
 * Where file bytes live, addressed by their SHA-256. Saving the same bytes again changes nothing,
 * so callers can save first and record afterwards. Postgres is the first store; object storage
 * would be another, with no change to callers.
 */
export interface ContentStore {
  /** Saves the bytes; refuses them if their SHA-256 is not the one given. */
  put(sha256: string, bytes: Uint8Array): Promise<void>;
  /** The bytes for that SHA-256, or undefined if none are stored. */
  get(sha256: string): Promise<Uint8Array | undefined>;
}

/** The bytes offered are not the file the fingerprint names. */
export class ContentMismatchError extends Error {
  override readonly name = "ContentMismatchError";
}

const contentRow = z.object({ bytes: z.instanceof(Uint8Array) });

/** A `ContentStore` on the `file_contents` table. `now` is the server's clock. */
export function postgresContentStore(q: Queryable, now: () => Date): ContentStore {
  return {
    async put(sha256, bytes) {
      if (sha256Hex(bytes) !== sha256) {
        throw new ContentMismatchError("The bytes do not match the SHA-256 given");
      }
      await q.query(
        `INSERT INTO file_contents (sha256, size_bytes, bytes, created_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (sha256) DO NOTHING`,
        [sha256, bytes.byteLength, bytes, now()],
      );
    },
    async get(sha256) {
      const rows = await q.query("SELECT bytes FROM file_contents WHERE sha256 = $1", [sha256]);
      return rows[0] === undefined ? undefined : contentRow.parse(rows[0]).bytes;
    },
  };
}
