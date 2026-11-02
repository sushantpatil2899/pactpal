import { sha256Hex, type LedgerEntry } from "@pactpal/ledger";
import { z } from "zod";
import type { Database, Queryable } from "./database.js";
import { appendLedgerEvent } from "./ledger-store.js";
import { getScopeVersion } from "./scope.js";
import { lockSignedDeal } from "./signed.js";

/** Why a delivery step was refused. */
export type DeliveryRefusal =
  /** The person is not this deal's seller. */
  | "not-your-deal"
  /** The deal is not signed, or the version is not the signed one. */
  | "not-signed"
  /** The signed version has no such payment stage. */
  | "no-stage"
  /** A file is not one of this deal's delivered files. */
  | "bad-files"
  /** The delivery or file does not belong to this deal. */
  | "not-found";

export class DeliveryNotAllowedError extends Error {
  override readonly name = "DeliveryNotAllowedError";
  constructor(readonly reason: DeliveryRefusal) {
    super(`The delivery step was refused: ${reason}`);
  }
}

const refuse = (reason: DeliveryRefusal) => new DeliveryNotAllowedError(reason);

/** A buyer's repeated opening of the same delivery within this time is logged once. */
export const VIEW_REPEAT_MS = 10 * 60 * 1000;

/** The most files one delivery can carry. */
export const MAX_DELIVERY_FILES = 10;

export const sendDeliverySchema = z.object({
  id: z.uuid(),
  dealId: z.uuid(),
  sellerId: z.uuid(),
  version: z.number().int().min(1),
  stage: z.number().int().min(1),
  /** The seller's note to the buyer; blank counts as none. */
  message: z
    .string()
    .trim()
    .max(1000)
    .transform((text) => (text === "" ? undefined : text))
    .optional(),
  artifactIds: z
    .array(z.uuid())
    .min(1)
    .max(MAX_DELIVERY_FILES)
    .refine((ids) => new Set(ids).size === ids.length, "a file is listed twice"),
});
export type SendDelivery = z.input<typeof sendDeliverySchema>;

/** One delivered file, as stored. */
export interface DeliveryFile {
  artifactId: string;
  filename: string;
  mediaType: string;
  sizeBytes: number;
  sha256: string;
}

export interface Delivery {
  id: string;
  dealId: string;
  version: number;
  stage: number;
  message: string | undefined;
  sentBy: string;
  ledgerSeq: number;
  createdAt: Date;
  files: DeliveryFile[];
}

const deliveryRow = z.object({
  id: z.string(),
  deal_id: z.string(),
  version: z.number().int(),
  stage: z.number().int(),
  message: z.string().nullable(),
  sent_by: z.string(),
  ledger_seq: z.number().int(),
  created_at: z.date(),
});
const fileRow = z
  .object({
    delivery_id: z.string(),
    artifact_id: z.string(),
    filename: z.string(),
    media_type: z.string(),
    size_bytes: z.coerce.number().int(),
    sha256: z.string(),
    kind: z.string(),
  })
  .transform((row) => ({
    deliveryId: row.delivery_id,
    kind: row.kind,
    file: {
      artifactId: row.artifact_id,
      filename: row.filename,
      mediaType: row.media_type,
      sizeBytes: row.size_bytes,
      sha256: row.sha256,
    },
  }));

/**
 * Sends a delivery: with the deal row locked, checks the seller, the signed version and its stage,
 * and that every file is one of this deal's delivered files; then writes `DELIVERY_SENT` (by the
 * seller: the delivery, version, stage, message and each file's id, name, size and SHA-256), the
 * delivery and its files, together.
 */
export async function sendDelivery(
  db: Database,
  input: SendDelivery,
  now: Date,
): Promise<{ delivery: Delivery; entry: LedgerEntry }> {
  const request = sendDeliverySchema.parse(input);
  return db.transaction(async (tx) => {
    await lockSignedDeal(tx, request, refuse);
    const scope = await getScopeVersion(tx, request.dealId, request.version);
    if (!scope || request.stage > scope.content.milestones.length) throw refuse("no-stage");
    const rows = await tx.query(
      `SELECT '' AS delivery_id, id AS artifact_id, filename, media_type, size_bytes, sha256, kind
         FROM artifacts WHERE deal_id = $1 AND id = ANY($2::uuid[])`,
      [request.dealId, request.artifactIds],
    );
    const found = rows.map((row) => fileRow.parse(row));
    if (
      found.length !== request.artifactIds.length ||
      found.some((row) => row.kind !== "deliverable")
    ) {
      throw refuse("bad-files");
    }
    // In the order the seller listed them.
    const byId = new Map(found.map((row) => [row.file.artifactId, row.file]));
    const files = request.artifactIds.flatMap((id) => {
      const file = byId.get(id);
      return file ? [file] : [];
    });
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: request.dealId,
        type: "DELIVERY_SENT",
        actor: "seller",
        actorId: request.sellerId,
        payload: {
          deliveryId: request.id,
          version: request.version,
          stage: request.stage,
          message: request.message ?? null,
          files: files.map((f) => ({
            artifactId: f.artifactId,
            filename: f.filename,
            sizeBytes: f.sizeBytes,
            sha256: f.sha256,
          })),
        },
      },
      now,
    );
    await tx.query(
      `INSERT INTO deliveries (id, deal_id, version, stage, message, sent_by, ledger_seq, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        request.id,
        request.dealId,
        request.version,
        request.stage,
        request.message ?? null,
        request.sellerId,
        entry.seq,
        now,
      ],
    );
    for (const [n, file] of files.entries()) {
      await tx.query(
        `INSERT INTO delivery_files (deal_id, delivery_id, artifact_id, position)
         VALUES ($1, $2, $3, $4)`,
        [request.dealId, request.id, file.artifactId, n + 1],
      );
    }
    const delivery: Delivery = {
      id: request.id,
      dealId: request.dealId,
      version: request.version,
      stage: request.stage,
      message: request.message,
      sentBy: request.sellerId,
      ledgerSeq: entry.seq,
      createdAt: now,
      files,
    };
    return { delivery, entry };
  });
}

/** A deal's deliveries, oldest first, each with its files in order. */
export async function listDeliveries(q: Queryable, dealId: string): Promise<Delivery[]> {
  const [deliveries, files] = await Promise.all([
    q.query("SELECT * FROM deliveries WHERE deal_id = $1 ORDER BY ledger_seq", [dealId]),
    q.query(
      `SELECT f.delivery_id, f.artifact_id, a.filename, a.media_type, a.size_bytes, a.sha256, a.kind
         FROM delivery_files f JOIN artifacts a ON a.id = f.artifact_id AND a.deal_id = f.deal_id
        WHERE f.deal_id = $1 ORDER BY f.delivery_id, f.position`,
      [dealId],
    ),
  ]);
  const parsedFiles = files.map((row) => fileRow.parse(row));
  return deliveries.map((raw) => {
    const row = deliveryRow.parse(raw);
    return {
      id: row.id,
      dealId: row.deal_id,
      version: row.version,
      stage: row.stage,
      message: row.message ?? undefined,
      sentBy: row.sent_by,
      ledgerSeq: row.ledger_seq,
      createdAt: row.created_at,
      files: parsedFiles.filter((f) => f.deliveryId === row.id).map((f) => f.file),
    };
  });
}

/** One delivery of a deal, or undefined. */
async function findDelivery(q: Queryable, dealId: string, deliveryId: string) {
  return (await listDeliveries(q, dealId)).find((d) => d.id === deliveryId);
}

const emailedSchema = z.object({
  dealId: z.uuid(),
  deliveryId: z.uuid(),
  /** Logged only as a SHA-256 of the lower-cased address. */
  email: z.email(),
  providerMessageId: z.string().min(1).max(200),
});

/**
 * Records that the email service accepted the delivery's email to the buyer: `DELIVERY_EMAILED`
 * (by the system) with the delivery, a SHA-256 of the address and the provider's message id.
 */
export async function recordDeliveryEmailed(
  db: Database,
  input: z.input<typeof emailedSchema>,
  now: Date,
): Promise<LedgerEntry> {
  const sent = emailedSchema.parse(input);
  return db.transaction(async (tx) => {
    if (!(await findDelivery(tx, sent.dealId, sent.deliveryId))) throw refuse("not-found");
    return appendLedgerEvent(
      tx,
      {
        dealId: sent.dealId,
        type: "DELIVERY_EMAILED",
        actor: "system",
        payload: {
          deliveryId: sent.deliveryId,
          emailSha256: sha256Hex(sent.email.toLowerCase()),
          providerMessageId: sent.providerMessageId,
        },
      },
      now,
    );
  });
}

const origin = {
  ip: z.string().min(1).max(100).optional(),
  userAgent: z.string().optional(),
};
const buyerStepSchema = z.object({
  dealId: z.uuid(),
  deliveryId: z.uuid(),
  buyerId: z.uuid(),
  ...origin,
});

/** The buyer's connection details for a log entry; absent ones are left out. */
const originOf = (step: { ip?: string | undefined; userAgent?: string | undefined }) => ({
  ...(step.ip === undefined ? {} : { ip: step.ip }),
  ...(step.userAgent === undefined ? {} : { userAgent: step.userAgent }),
});

/**
 * Records that the buyer opened a delivery: `DELIVERY_VIEWED` (by the buyer, with how they came
 * in and where from). An opening within `VIEW_REPEAT_MS` of the last one for the same delivery is
 * not logged again; undefined is returned then.
 */
export async function recordDeliveryViewed(
  db: Database,
  input: z.input<typeof buyerStepSchema> & { access: "link" | "paypal" },
  now: Date,
): Promise<LedgerEntry | undefined> {
  const step = buyerStepSchema.extend({ access: z.enum(["link", "paypal"]) }).parse(input);
  return db.transaction(async (tx) => {
    await tx.query("SELECT 1 FROM deals WHERE id = $1 FOR UPDATE", [step.dealId]);
    if (!(await findDelivery(tx, step.dealId, step.deliveryId))) throw refuse("not-found");
    const last = await tx.query(
      `SELECT server_time FROM ledger_entries
        WHERE deal_id = $1 AND type = 'DELIVERY_VIEWED' AND payload->>'deliveryId' = $2
        ORDER BY seq DESC LIMIT 1`,
      [step.dealId, step.deliveryId],
    );
    const lastAt = z.object({ server_time: z.date() }).safeParse(last[0]);
    if (lastAt.success && now.getTime() - lastAt.data.server_time.getTime() < VIEW_REPEAT_MS) {
      return undefined;
    }
    return appendLedgerEvent(
      tx,
      {
        dealId: step.dealId,
        type: "DELIVERY_VIEWED",
        actor: "buyer",
        actorId: step.buyerId,
        payload: { deliveryId: step.deliveryId, access: step.access },
        ...originOf(step),
      },
      now,
    );
  });
}

/**
 * Records that the buyer downloaded one file of a delivery: `DELIVERY_DOWNLOADED` (by the buyer,
 * with where from) naming the file by id, name, size and SHA-256. Every download is logged.
 */
export async function recordDeliveryDownloaded(
  db: Database,
  input: z.input<typeof buyerStepSchema> & { artifactId: string },
  now: Date,
): Promise<LedgerEntry> {
  const step = buyerStepSchema.extend({ artifactId: z.uuid() }).parse(input);
  return db.transaction(async (tx) => {
    const delivery = await findDelivery(tx, step.dealId, step.deliveryId);
    const file = delivery?.files.find((f) => f.artifactId === step.artifactId);
    if (!file) throw refuse("not-found");
    return appendLedgerEvent(
      tx,
      {
        dealId: step.dealId,
        type: "DELIVERY_DOWNLOADED",
        actor: "buyer",
        actorId: step.buyerId,
        payload: {
          deliveryId: step.deliveryId,
          artifactId: file.artifactId,
          filename: file.filename,
          sizeBytes: file.sizeBytes,
          sha256: file.sha256,
        },
        ...originOf(step),
      },
      now,
    );
  });
}
