import { sha256Hex, type LedgerEntry } from "@pactpal/ledger";
import { z } from "zod";
import type { Database, Queryable } from "./database.js";
import { appendLedgerEvent } from "./ledger-store.js";
import { getScopeVersion } from "./scope.js";
import { DealNotFoundError } from "./ledger-store.js";
import { lockSignedDeal, signedVersionOf } from "./signed.js";

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
  | "not-found"
  /** The buyer has not opened this delivery yet, so cannot answer it. */
  | "not-opened"
  /** This delivery already has the buyer's answer. */
  | "already-answered";

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

/** The buyer's answer to a delivery. */
export type AnswerInput = { kind: "approved" } | { kind: "changes"; request: string };

const answerSchema = buyerStepSchema.extend({
  answer: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("approved") }),
    z.object({ kind: z.literal("changes"), request: z.string().trim().min(1).max(2000) }),
  ]),
});

/** A stored answer: an approval, or a change request with its text and revision number. */
export type DeliveryAnswer = {
  deliveryId: string;
  answeredBy: string;
  ledgerSeq: number;
  createdAt: Date;
} & ({ kind: "approved" } | { kind: "changes"; request: string; revision: number });

const answerRow = z
  .object({
    delivery_id: z.string(),
    kind: z.enum(["approved", "changes"]),
    request: z.string().nullable(),
    revision: z.number().int().nullable(),
    answered_by: z.string(),
    ledger_seq: z.number().int(),
    created_at: z.date(),
  })
  .transform((row): DeliveryAnswer => {
    const common = {
      deliveryId: row.delivery_id,
      answeredBy: row.answered_by,
      ledgerSeq: row.ledger_seq,
      createdAt: row.created_at,
    };
    // The database requires a request and a revision exactly for change requests.
    return row.kind === "changes" && row.request !== null && row.revision !== null
      ? { ...common, kind: "changes", request: row.request, revision: row.revision }
      : { ...common, kind: "approved" };
  });

/** A deal's answers to its deliveries, in the order they were given. */
export async function deliveryAnswers(q: Queryable, dealId: string): Promise<DeliveryAnswer[]> {
  const rows = await q.query(
    "SELECT * FROM delivery_answers WHERE deal_id = $1 ORDER BY ledger_seq",
    [dealId],
  );
  return rows.map((row) => answerRow.parse(row));
}

const lockedBuyer = z.object({ buyer_id: z.string().nullable(), status: z.string() });

/**
 * Records the buyer's answer to a delivery they have opened, once, with the deal row locked:
 * `MILESTONE_APPROVED` (the delivery, version, stage and each file's SHA-256) or `CHANGE_REQUESTED`
 * (the request, its revision number counted across the deal, the revisions included in the signed
 * version and whether it goes beyond them). Change requests are never refused for being beyond the
 * limit. An approval that leaves every stage of the signed version approved completes the deal.
 */
export async function answerDelivery(
  db: Database,
  input: z.input<typeof answerSchema>,
  now: Date,
): Promise<{
  answer: DeliveryAnswer;
  entry: LedgerEntry;
  completed: boolean;
  revisionsIncluded: number | undefined;
}> {
  const step = answerSchema.parse(input);
  return db.transaction(async (tx) => {
    const rows = await tx.query("SELECT buyer_id, status FROM deals WHERE id = $1 FOR UPDATE", [
      step.dealId,
    ]);
    const deal = lockedBuyer.safeParse(rows[0]);
    if (!deal.success) throw new DealNotFoundError(`No deal ${step.dealId}`);
    if (deal.data.buyer_id !== step.buyerId) throw refuse("not-your-deal");
    const delivery = await findDelivery(tx, step.dealId, step.deliveryId);
    if (!delivery) throw refuse("not-found");
    const opened = await tx.query(
      `SELECT 1 FROM ledger_entries
        WHERE deal_id = $1 AND type = 'DELIVERY_VIEWED' AND payload->>'deliveryId' = $2 LIMIT 1`,
      [step.dealId, step.deliveryId],
    );
    if (opened.length === 0) throw refuse("not-opened");
    const answers = await deliveryAnswers(tx, step.dealId);
    if (answers.some((a) => a.deliveryId === step.deliveryId)) throw refuse("already-answered");
    // Revisions and completion follow the current signed version (a change order may add some).
    const signed = await signedVersionOf(tx, step.dealId);
    const scope = signed === undefined ? undefined : await getScopeVersion(tx, step.dealId, signed);
    const revisionsIncluded = scope?.content.revisionsIncluded;
    // The number this would be as a change request: earlier requests across the deal, plus one.
    const revision = answers.filter((a) => a.kind === "changes").length + 1;

    const common = { deliveryId: delivery.id, version: delivery.version, stage: delivery.stage };
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: step.dealId,
        actor: "buyer",
        actorId: step.buyerId,
        ...originOf(step),
        ...(step.answer.kind === "approved"
          ? {
              type: "MILESTONE_APPROVED" as const,
              payload: {
                ...common,
                files: delivery.files.map((f) => ({ artifactId: f.artifactId, sha256: f.sha256 })),
              },
            }
          : {
              type: "CHANGE_REQUESTED" as const,
              payload: {
                ...common,
                request: step.answer.request,
                revision,
                revisionsIncluded: revisionsIncluded ?? null,
                beyondIncluded: revisionsIncluded !== undefined && revision > revisionsIncluded,
              },
            }),
      },
      now,
    );
    const saved = await tx.query(
      `INSERT INTO delivery_answers (delivery_id, deal_id, kind, request, revision, answered_by,
                                     ledger_seq, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        step.deliveryId,
        step.dealId,
        step.answer.kind,
        step.answer.kind === "changes" ? step.answer.request : null,
        step.answer.kind === "changes" ? revision : null,
        step.buyerId,
        entry.seq,
        now,
      ],
    );

    // Every stage of the signed version approved, under whatever version it was delivered (a
    // stage is the same stage in every version): the deal is completed.
    let completed = false;
    if (step.answer.kind === "approved" && scope && deal.data.status === "active") {
      const approved = await tx.query(
        `SELECT DISTINCT d.stage FROM delivery_answers a
           JOIN deliveries d ON d.id = a.delivery_id AND d.deal_id = a.deal_id
          WHERE a.deal_id = $1 AND a.kind = 'approved' AND d.stage <= $2`,
        [step.dealId, scope.content.milestones.length],
      );
      if (approved.length >= scope.content.milestones.length) {
        await tx.query("UPDATE deals SET status = 'completed', updated_at = $2 WHERE id = $1", [
          step.dealId,
          now,
        ]);
        completed = true;
      }
    }
    return { answer: answerRow.parse(saved[0]), entry, completed, revisionsIncluded };
  });
}
