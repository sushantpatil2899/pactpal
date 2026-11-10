import {
  detectMediaType,
  isWebp,
  hashFile,
  isPlainFileName,
  isPlainText,
  verifyFile,
  type EventType,
} from "@pactpal/ledger";
import { z } from "zod";
import type { ContentStore } from "./content-store.js";
import type { Database, Queryable } from "./database.js";
import { appendLedgerEvent, assertMayAct } from "./ledger-store.js";

/** `source`: what the deal was made from (a pasted chat, an upload). `deliverable`: the delivered work. */
export const ARTIFACT_KINDS = ["source", "deliverable"] as const;
export type ArtifactKind = (typeof ARTIFACT_KINDS)[number];

const EVENT_FOR_KIND = {
  source: "SOURCE_ADDED",
  deliverable: "DELIVERABLE_ADDED",
} as const satisfies Record<ArtifactKind, EventType>;

/**
 * Limits that protect the small database (files live in Postgres for now) and match PayPal's
 * 10 MB evidence limit. Bigger deliverables wait for object storage (docs/decisions.md).
 */
export interface ArtifactLimits {
  maxFileBytes: number;
  maxDealBytes: number;
  /** What the buyer may add to one deal (5b), so they cannot fill it and block the seller. */
  maxBuyerFiles?: number;
  maxBuyerBytes?: number;
}
export const ARTIFACT_LIMITS: ArtifactLimits = {
  maxFileBytes: 10 * 1024 * 1024,
  maxDealBytes: 50 * 1024 * 1024,
  maxBuyerFiles: 20,
  maxBuyerBytes: 20 * 1024 * 1024,
};

/**
 * The types a buyer may add (5b): those PayPal takes as evidence (PDF, PNG, JPEG, GIF) and plain
 * text. Anything else could not be checked, shown or sent on.
 */
export const BUYER_MEDIA_TYPES: readonly string[] = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/gif",
  "text/plain",
];

export type ArtifactRejection =
  | "bad-name"
  | "empty"
  | "file-too-large"
  | "deal-full"
  /** A buyer's file of a type they may not add. */
  | "buyer-type"
  /** The buyer already added as many files, or as many bytes, as one deal allows. */
  | "buyer-files-full";

/** The file broke a rule; `reason` says which. Nothing was recorded. */
export class ArtifactRejectedError extends Error {
  override readonly name = "ArtifactRejectedError";
  constructor(
    readonly reason: ArtifactRejection,
    message: string,
  ) {
    super(message);
  }
}

export class ArtifactNotFoundError extends Error {
  override readonly name = "ArtifactNotFoundError";
}

/** The stored bytes are missing or are no longer the file that was fingerprinted. */
export class ArtifactIntegrityError extends Error {
  override readonly name = "ArtifactIntegrityError";
}

export const newArtifactSchema = z
  .object({
    id: z.uuid(),
    dealId: z.uuid(),
    kind: z.enum(ARTIFACT_KINDS),
    filename: z.string(),
    // Any byte array (a Node Buffer included); `z.instanceof` would insist on a plain ArrayBuffer.
    bytes: z.custom<Uint8Array>((value) => value instanceof Uint8Array),
    /** The seller, the buyer (reference files since 5b) or the system (an import) adds files. */
    addedBy: z.discriminatedUnion("actor", [
      z.object({ actor: z.literal("seller"), actorId: z.uuid() }),
      z.object({ actor: z.literal("buyer"), actorId: z.uuid() }),
      z.object({ actor: z.literal("system") }),
    ]),
    ip: z.string().optional(),
    userAgent: z.string().optional(),
  })
  .refine((file) => file.addedBy.actor !== "buyer" || file.kind === "source", {
    message: "a buyer adds only source files",
    path: ["kind"],
  });
export type NewArtifact = z.infer<typeof newArtifactSchema>;

const artifactRow = z
  .object({
    id: z.string(),
    deal_id: z.string(),
    kind: z.enum(ARTIFACT_KINDS),
    filename: z.string(),
    media_type: z.string(),
    size_bytes: z.number().int(),
    sha256: z.string(),
    added_by: z.string().nullable(),
    ledger_seq: z.number().int(),
    created_at: z.date(),
  })
  .transform((row) => ({
    id: row.id,
    dealId: row.deal_id,
    kind: row.kind,
    filename: row.filename,
    mediaType: row.media_type,
    sizeBytes: row.size_bytes,
    sha256: row.sha256,
    addedBy: row.added_by ?? undefined,
    ledgerSeq: row.ledger_seq,
    createdAt: row.created_at,
  }));
export type Artifact = z.output<typeof artifactRow>;

/** Found from the bytes, never from the name or what the uploader says. */
function mediaTypeOf(bytes: Uint8Array): string {
  const known = detectMediaType(bytes) ?? (isWebp(bytes) ? "image/webp" : undefined);
  return known ?? (isPlainText(bytes) ? "text/plain" : "application/octet-stream");
}

const totalRow = z.object({ total: z.coerce.number().int() });

async function assertRoom(q: Queryable, dealId: string, size: number, limits: ArtifactLimits) {
  const rows = await q.query(
    "SELECT COALESCE(SUM(size_bytes), 0) AS total FROM artifacts WHERE deal_id = $1",
    [dealId],
  );
  if (totalRow.parse(rows[0]).total + size > limits.maxDealBytes) {
    throw new ArtifactRejectedError("deal-full", "the deal's files would be over the size limit");
  }
}

const buyerTotals = z.object({ files: z.coerce.number().int(), total: z.coerce.number().int() });

/** A buyer's file must be of an allowed type and fit in what the buyer may add to the deal. */
async function assertBuyerRoom(
  q: Queryable,
  file: { dealId: string; buyerId: string; mediaType: string; size: number },
  limits: ArtifactLimits,
) {
  if (!BUYER_MEDIA_TYPES.includes(file.mediaType)) {
    throw new ArtifactRejectedError("buyer-type", "a buyer may add PDF, PNG, JPEG, GIF or text");
  }
  const rows = await q.query(
    `SELECT COUNT(*) AS files, COALESCE(SUM(size_bytes), 0) AS total FROM artifacts
      WHERE deal_id = $1 AND added_by = $2`,
    [file.dealId, file.buyerId],
  );
  const { files, total } = buyerTotals.parse(rows[0]);
  const { maxBuyerFiles = Infinity, maxBuyerBytes = Infinity } = limits;
  if (files + 1 > maxBuyerFiles || total + file.size > maxBuyerBytes) {
    throw new ArtifactRejectedError(
      "buyer-files-full",
      "the buyer's files would be over the limit",
    );
  }
}

function assertFileAllowed(file: NewArtifact, limits: ArtifactLimits): void {
  if (!isPlainFileName(file.filename)) {
    throw new ArtifactRejectedError(
      "bad-name",
      "file name must be 1-255 characters without slashes",
    );
  }
  if (file.bytes.byteLength === 0) throw new ArtifactRejectedError("empty", "file is empty");
  if (file.bytes.byteLength > limits.maxFileBytes) {
    throw new ArtifactRejectedError("file-too-large", "file is over the size limit");
  }
}

/**
 * Adds a file to a deal. Refuses early (before storing anything) if the file breaks a rule, the
 * deal is unknown, the actor may not act, or the deal is full. Then saves the bytes, and in one
 * transaction writes the ledger entry (`SOURCE_ADDED` or `DELIVERABLE_ADDED`) and the record,
 * re-checking the deal's total under the deal lock so two uploads at once cannot exceed it.
 * A record therefore never points at missing bytes; a failure can only leave an unused stored
 * copy, which is harmless. `now` is the server's clock.
 */
export async function addArtifact(
  db: Database,
  store: ContentStore,
  input: NewArtifact,
  now: Date,
  limits: ArtifactLimits = ARTIFACT_LIMITS,
): Promise<Artifact> {
  const file = newArtifactSchema.parse(input);
  assertFileAllowed(file, limits);
  const { sha256, size } = hashFile(file.bytes, file.filename);
  const mediaType = mediaTypeOf(file.bytes);
  const type = EVENT_FOR_KIND[file.kind];
  const actor = {
    actor: file.addedBy.actor,
    actorId: "actorId" in file.addedBy ? file.addedBy.actorId : undefined,
  };

  const buyer =
    file.addedBy.actor === "buyer"
      ? { dealId: file.dealId, buyerId: file.addedBy.actorId, mediaType, size }
      : undefined;

  await assertMayAct(db, { dealId: file.dealId, type, ...actor });
  if (buyer) await assertBuyerRoom(db, buyer, limits);
  await assertRoom(db, file.dealId, size, limits);
  await store.put(sha256, file.bytes);

  return db.transaction(async (tx) => {
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: file.dealId,
        type,
        ...actor,
        payload: {
          artifactId: file.id,
          filename: file.filename,
          mediaType,
          sizeBytes: size,
          sha256,
        },
        ip: file.ip,
        userAgent: file.userAgent,
      },
      now,
    );
    // Under the deal lock taken by the entry, so uploads at once cannot pass the limits together.
    if (buyer) await assertBuyerRoom(tx, buyer, limits);
    await assertRoom(tx, file.dealId, size, limits);
    const rows = await tx.query(
      `INSERT INTO artifacts (id, deal_id, kind, filename, media_type, size_bytes, sha256, added_by,
                              ledger_seq, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        file.id,
        file.dealId,
        file.kind,
        file.filename,
        mediaType,
        size,
        sha256,
        actor.actorId ?? null,
        entry.seq,
        now,
      ],
    );
    return artifactRow.parse(rows[0]);
  });
}

/** A deal's files, in the order they were added; with `kind`, only files of that kind. */
export async function listArtifacts(
  q: Queryable,
  dealId: string,
  kind?: ArtifactKind,
): Promise<Artifact[]> {
  const rows = await q.query(
    `SELECT * FROM artifacts WHERE deal_id = $1 AND ($2::text IS NULL OR kind = $2)
      ORDER BY ledger_seq`,
    [dealId, kind ?? null],
  );
  return rows.map((row) => artifactRow.parse(row));
}

/**
 * A file's record and bytes, after checking the bytes still match the recorded fingerprint. With
 * `dealId`, a file of another deal counts as not found, before any bytes are read; with `kind`,
 * so does a file of another kind.
 */
export async function getArtifact(
  q: Queryable,
  store: ContentStore,
  id: string,
  dealId?: string,
  kind?: ArtifactKind,
): Promise<{ artifact: Artifact; bytes: Uint8Array }> {
  const rows = await q.query(
    `SELECT * FROM artifacts WHERE id = $1 AND ($2::uuid IS NULL OR deal_id = $2)
        AND ($3::text IS NULL OR kind = $3)`,
    [id, dealId ?? null, kind ?? null],
  );
  if (rows[0] === undefined) throw new ArtifactNotFoundError(`No artifact ${id}`);
  const artifact = artifactRow.parse(rows[0]);
  const bytes = await store.get(artifact.sha256);
  if (bytes === undefined)
    throw new ArtifactIntegrityError(`Artifact ${id}: stored bytes are missing`);
  const fingerprint = {
    sha256: artifact.sha256,
    size: artifact.sizeBytes,
    filename: artifact.filename,
  };
  if (!verifyFile(bytes, fingerprint)) {
    throw new ArtifactIntegrityError(`Artifact ${id}: stored bytes do not match their fingerprint`);
  }
  return { artifact, bytes };
}
