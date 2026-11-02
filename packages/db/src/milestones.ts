import { sha256Hex, type LedgerEntry } from "@pactpal/ledger";
import { z } from "zod";
import type { Database, Queryable } from "./database.js";
import { DEAL_STATUSES } from "./deals.js";
import { DealNotFoundError, appendLedgerEvent } from "./ledger-store.js";

/** Where a payment stage's invoice is: being created at PayPal, sent to the buyer, or paid (4e). */
export const MILESTONE_STATUSES = ["sending", "sent", "paid"] as const;
export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number];

/** Why an invoice step was refused. */
export type MilestoneRefusal =
  /** The person is not this deal's seller. */
  | "not-your-deal"
  /** The deal is not signed, or the version is not the signed one. */
  | "not-signed"
  /** This stage already has a sent invoice. */
  | "already-sent"
  /** This stage's invoice was never sent, so it cannot be paid. */
  | "not-sent";

export class MilestoneNotAllowedError extends Error {
  override readonly name = "MilestoneNotAllowedError";
  constructor(readonly reason: MilestoneRefusal) {
    super(`The invoice step was refused: ${reason}`);
  }
}

/** The stored columns, named as the record's fields. */
const COLUMNS = `deal_id AS "dealId", version, stage, amount_minor AS "amountMinor", currency, status,
  request_id AS "requestId", invoice_sha256 AS "invoiceSha256", invoice_id AS "invoiceId",
  pay_url AS "payUrl", ledger_seq AS "ledgerSeq", created_at AS "createdAt", sent_at AS "sentAt",
  paid_at AS "paidAt", payment_ledger_seq AS "paymentLedgerSeq", transaction_id AS "transactionId"`;

const milestoneRow = z.object({
  dealId: z.string(),
  version: z.number().int(),
  stage: z.number().int(),
  amountMinor: z.number().int(),
  currency: z.string(),
  status: z.enum(MILESTONE_STATUSES),
  requestId: z.string(),
  invoiceSha256: z.string(),
  invoiceId: z.string().nullable(),
  payUrl: z.string().nullable(),
  ledgerSeq: z.number().int().nullable(),
  createdAt: z.date(),
  sentAt: z.date().nullable(),
  paidAt: z.date().nullable(),
  paymentLedgerSeq: z.number().int().nullable(),
  transactionId: z.string().nullable(),
});
export type Milestone = z.output<typeof milestoneRow>;

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);
const stageKey = {
  dealId: z.uuid(),
  version: z.number().int().min(1),
  stage: z.number().int().min(1),
};

export const startInvoiceSchema = z.object({
  ...stageKey,
  sellerId: z.uuid(),
  amountMinor: z.number().int().positive(),
  currency: z.string().regex(/^[A-Z]{3}$/),
  /** Fixed per deal, version and stage, so every retry reaches PayPal as the same request. */
  requestId: z.string().min(1).max(100),
  /** Fingerprint of the invoice text the seller confirmed. */
  invoiceSha256: sha256,
});
export type StartInvoice = z.input<typeof startInvoiceSchema>;

export const invoiceSentSchema = z.object({
  ...stageKey,
  sellerId: z.uuid(),
  invoiceId: z.string().min(1).max(100),
  payUrl: z.url().optional(),
  /** Which route PayPal answered by. */
  transport: z.enum(["rest", "mcp"]),
  /** Logged only as a SHA-256 of the lower-cased address. */
  recipientEmail: z.email(),
  /** Fingerprint of the signed version's content. */
  contentSha256: sha256,
});
export type InvoiceSent = z.input<typeof invoiceSentSchema>;

const lockedDeal = z.object({ seller_id: z.string(), status: z.enum(DEAL_STATUSES) });
const signedVersion = z.object({ version: z.number().int() });

/**
 * Locks the deal row and checks that `sellerId` is its seller, that it is signed, and that
 * `version` is the signed version (the newest acceptance's).
 */
async function lockSigned(tx: Queryable, dealId: string, sellerId: string, version: number) {
  const rows = await tx.query("SELECT seller_id, status FROM deals WHERE id = $1 FOR UPDATE", [
    dealId,
  ]);
  const deal = lockedDeal.safeParse(rows[0]);
  if (!deal.success) throw new DealNotFoundError(`No deal ${dealId}`);
  if (deal.data.seller_id !== sellerId) throw new MilestoneNotAllowedError("not-your-deal");
  const signed = await tx.query(
    "SELECT version FROM acceptances WHERE deal_id = $1 ORDER BY ledger_seq DESC LIMIT 1",
    [dealId],
  );
  const accepted = signedVersion.safeParse(signed[0]);
  const isSigned = deal.data.status === "active" || deal.data.status === "completed";
  if (!isSigned || !accepted.success || accepted.data.version !== version) {
    throw new MilestoneNotAllowedError("not-signed");
  }
}

async function stageRow(q: Queryable, key: { dealId: string; version: number; stage: number }) {
  const rows = await q.query(
    `SELECT ${COLUMNS} FROM milestones WHERE deal_id = $1 AND version = $2 AND stage = $3`,
    [key.dealId, key.version, key.stage],
  );
  return rows[0] === undefined ? undefined : milestoneRow.parse(rows[0]);
}

/**
 * Reserves a stage's invoice before PayPal is asked: a `sending` row with the fixed request id.
 * Asking again for a stage still `sending` returns that row (a retry); a stage already sent is
 * refused. Only the seller, only on a signed deal and its signed version.
 */
export async function startInvoice(
  db: Database,
  input: StartInvoice,
  now: Date,
): Promise<Milestone> {
  const request = startInvoiceSchema.parse(input);
  return db.transaction(async (tx) => {
    await lockSigned(tx, request.dealId, request.sellerId, request.version);
    const existing = await stageRow(tx, request);
    if (existing) {
      if (existing.status !== "sending") throw new MilestoneNotAllowedError("already-sent");
      return existing;
    }
    const rows = await tx.query(
      `INSERT INTO milestones (deal_id, version, stage, amount_minor, currency, status, request_id,
                               invoice_sha256, created_at)
       VALUES ($1, $2, $3, $4, $5, 'sending', $6, $7, $8)
       RETURNING ${COLUMNS}`,
      [
        request.dealId,
        request.version,
        request.stage,
        request.amountMinor,
        request.currency,
        request.requestId,
        request.invoiceSha256,
        now,
      ],
    );
    return milestoneRow.parse(rows[0]);
  });
}

/** Keeps the id of an invoice PayPal created but did not send, so a retry re-sends that one. */
export async function recordInvoiceId(
  q: Queryable,
  key: { dealId: string; version: number; stage: number },
  invoiceId: string,
): Promise<void> {
  await q.query(
    `UPDATE milestones SET invoice_id = $4
      WHERE deal_id = $1 AND version = $2 AND stage = $3 AND status = 'sending'`,
    [key.dealId, key.version, key.stage, invoiceId],
  );
}

/** Removes a reservation PayPal refused, before any invoice existed, so the stage can be tried again. */
export async function dropFailedInvoice(
  q: Queryable,
  key: { dealId: string; version: number; stage: number },
): Promise<void> {
  await q.query(
    `DELETE FROM milestones
      WHERE deal_id = $1 AND version = $2 AND stage = $3 AND status = 'sending'
        AND invoice_id IS NULL`,
    [key.dealId, key.version, key.stage],
  );
}

/**
 * Records that PayPal sent the stage's invoice: with the deal locked, the row becomes `sent` and
 * an `INVOICE_SENT` entry (by the seller) records the version, stage, invoice id, amount, the
 * fingerprints of the agreed work and of the invoice text, a SHA-256 of the buyer's address and
 * the route PayPal answered by. Done once: a stage already sent returns its row and no entry.
 */
export async function markInvoiceSent(
  db: Database,
  input: InvoiceSent,
  now: Date,
): Promise<{ milestone: Milestone; entry?: LedgerEntry }> {
  const sent = invoiceSentSchema.parse(input);
  return db.transaction(async (tx) => {
    await lockSigned(tx, sent.dealId, sent.sellerId, sent.version);
    const row = await stageRow(tx, sent);
    if (!row) throw new MilestoneNotAllowedError("not-signed");
    if (row.status !== "sending") return { milestone: row };
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: sent.dealId,
        type: "INVOICE_SENT",
        actor: "seller",
        actorId: sent.sellerId,
        payload: {
          version: sent.version,
          stage: sent.stage,
          invoiceId: sent.invoiceId,
          amountMinor: row.amountMinor,
          currency: row.currency,
          contentSha256: sent.contentSha256,
          invoiceSha256: row.invoiceSha256,
          recipientEmailSha256: sha256Hex(sent.recipientEmail.toLowerCase()),
          transport: sent.transport,
        },
      },
      now,
    );
    const rows = await tx.query(
      `UPDATE milestones SET status = 'sent', invoice_id = $4, pay_url = $5, ledger_seq = $6,
                             sent_at = $7
        WHERE deal_id = $1 AND version = $2 AND stage = $3
        RETURNING ${COLUMNS}`,
      [sent.dealId, sent.version, sent.stage, sent.invoiceId, sent.payUrl ?? null, entry.seq, now],
    );
    return { milestone: milestoneRow.parse(rows[0]), entry };
  });
}

/** A deal's invoiced stages, by version and stage. */
export async function listMilestones(q: Queryable, dealId: string): Promise<Milestone[]> {
  const rows = await q.query(
    `SELECT ${COLUMNS} FROM milestones WHERE deal_id = $1 ORDER BY version, stage`,
    [dealId],
  );
  return rows.map((row) => milestoneRow.parse(row));
}

export const invoicePaidSchema = z.object({
  ...stageKey,
  invoiceId: z.string().min(1).max(100),
  /** What PayPal says was paid, read from PayPal itself. */
  paidAmount: z.object({
    minor: z.number().int().min(0),
    currency: z.string().regex(/^[A-Z]{3}$/),
  }),
  transactions: z
    .array(
      z.object({
        paymentId: z.string().min(1).max(100).optional(),
        paymentDate: z.string().min(1).max(40).optional(),
        method: z.string().min(1).max(40).optional(),
      }),
    )
    .max(20),
  /** How PactPal learned of it: PayPal's notification, or someone pressing "check". */
  source: z.enum(["notification", "status-check"]),
  /** PayPal's id for the notification, when that is how it was learned. */
  eventId: z.string().min(1).max(100).optional(),
});
export type InvoicePaid = z.input<typeof invoicePaidSchema>;

/**
 * Records that PayPal confirmed a stage's invoice as paid: with the deal locked, the row becomes
 * `paid` and a `PAYMENT_RECEIVED` entry (by the system) records the version, stage, invoice id,
 * the amount PayPal says was paid, PayPal's transaction ids, dates and methods, and how PactPal
 * learned of it. Done once: a stage already paid returns its row and no entry.
 */
export async function markInvoicePaid(
  db: Database,
  input: InvoicePaid,
  now: Date,
): Promise<{ milestone: Milestone; entry?: LedgerEntry }> {
  const paid = invoicePaidSchema.parse(input);
  return db.transaction(async (tx) => {
    const locked = await tx.query("SELECT 1 FROM deals WHERE id = $1 FOR UPDATE", [paid.dealId]);
    if (locked.length === 0) throw new DealNotFoundError(`No deal ${paid.dealId}`);
    const row = await stageRow(tx, paid);
    if (row?.status === "paid") return { milestone: row };
    if (row?.status !== "sent" || row.invoiceId !== paid.invoiceId) {
      throw new MilestoneNotAllowedError("not-sent");
    }
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: paid.dealId,
        type: "PAYMENT_RECEIVED",
        actor: "system",
        payload: {
          version: paid.version,
          stage: paid.stage,
          invoiceId: paid.invoiceId,
          amountMinor: paid.paidAmount.minor,
          currency: paid.paidAmount.currency,
          transactions: paid.transactions.map((t) => ({
            paymentId: t.paymentId ?? null,
            paymentDate: t.paymentDate ?? null,
            method: t.method ?? null,
          })),
          source: paid.source,
          ...(paid.eventId === undefined ? {} : { eventId: paid.eventId }),
        },
      },
      now,
    );
    const rows = await tx.query(
      `UPDATE milestones SET status = 'paid', paid_at = $4, payment_ledger_seq = $5,
                             transaction_id = $6
        WHERE deal_id = $1 AND version = $2 AND stage = $3
        RETURNING ${COLUMNS}`,
      [
        paid.dealId,
        paid.version,
        paid.stage,
        now,
        entry.seq,
        paid.transactions.find((t) => t.paymentId !== undefined)?.paymentId ?? null,
      ],
    );
    return { milestone: milestoneRow.parse(rows[0]), entry };
  });
}

/** The stage whose PayPal invoice this is, or undefined if PactPal did not send it. */
export async function findMilestoneByInvoice(
  q: Queryable,
  invoiceId: string,
): Promise<Milestone | undefined> {
  const rows = await q.query(`SELECT ${COLUMNS} FROM milestones WHERE invoice_id = $1`, [
    invoiceId,
  ]);
  return rows[0] === undefined ? undefined : milestoneRow.parse(rows[0]);
}
