import type { JsonValue, LedgerEntry } from "@pactpal/ledger";
import { z } from "zod";
import type { Database, Queryable } from "./database.js";
import { appendLedgerEvent } from "./ledger-store.js";

/** What started a dispute check: the schedule, the seller's "Check now", or a PayPal notification. */
export const DISPUTE_CHECK_SOURCES = ["schedule", "button", "notification"] as const;
export type DisputeCheckSource = (typeof DISPUTE_CHECK_SOURCES)[number];

/** How a dispute was tied to its deal's payment stage. */
export const DISPUTE_MATCHES = ["transaction", "invoice-number"] as const;
export type DisputeMatch = (typeof DISPUTE_MATCHES)[number];

const label = z.string().min(1).max(100);
const actionList = z.array(label).max(50);

/**
 * A dispute as PactPal last read it from PayPal. Reasons, statuses and stages are PayPal's own
 * words; `details` is PayPal's whole answer as read (it holds the buyer's messages).
 */
export const disputeSnapshotSchema = z.object({
  disputeId: label,
  reason: label.optional(),
  status: label,
  state: label.optional(),
  /** PayPal's stage, e.g. "INQUIRY" or "CHARGEBACK" (not a payment stage). */
  stageName: label.optional(),
  amount: z
    .object({ minor: z.number().int().min(0), currency: z.string().regex(/^[A-Z]{3}$/) })
    .optional(),
  sellerDueAt: z.date().optional(),
  buyerDueAt: z.date().optional(),
  allowedActions: actionList,
  offerTypes: actionList,
  outcome: label.optional(),
  paypalCreatedAt: z.date().optional(),
  paypalUpdatedAt: z.date().optional(),
  details: z.json(),
});
export type DisputeSnapshot = z.input<typeof disputeSnapshotSchema>;

/** The deal's payment stage a dispute is about, and how that was worked out. */
export const disputeLinkSchema = z.object({
  dealId: z.uuid(),
  stage: z.number().int().min(1),
  invoiceId: z.string().min(1).max(100).nullable(),
  matchedBy: z.enum(DISPUTE_MATCHES),
});
export type DisputeLink = z.output<typeof disputeLinkSchema>;

const COLUMNS = `dispute_id AS "disputeId", deal_id AS "dealId", stage, invoice_id AS "invoiceId",
  matched_by AS "matchedBy", reason, status, dispute_state AS "state", stage_name AS "stageName",
  amount_minor AS "amountMinor", currency, seller_due_at AS "sellerDueAt",
  buyer_due_at AS "buyerDueAt", allowed_actions AS "allowedActions", offer_types AS "offerTypes",
  outcome, details, paypal_created_at AS "paypalCreatedAt", paypal_updated_at AS "paypalUpdatedAt",
  first_seen_at AS "firstSeenAt", checked_at AS "checkedAt", opened_seq AS "openedSeq",
  resolved_seq AS "resolvedSeq"`;

const disputeRow = z.object({
  disputeId: z.string(),
  dealId: z.string().nullable(),
  stage: z.number().int().nullable(),
  invoiceId: z.string().nullable(),
  matchedBy: z.enum(DISPUTE_MATCHES).nullable(),
  reason: z.string().nullable(),
  status: z.string(),
  state: z.string().nullable(),
  stageName: z.string().nullable(),
  amountMinor: z.number().int().nullable(),
  currency: z.string().nullable(),
  sellerDueAt: z.date().nullable(),
  buyerDueAt: z.date().nullable(),
  allowedActions: z.array(z.string()),
  offerTypes: z.array(z.string()),
  outcome: z.string().nullable(),
  details: z.json().nullable(),
  paypalCreatedAt: z.date().nullable(),
  paypalUpdatedAt: z.date().nullable(),
  firstSeenAt: z.date(),
  checkedAt: z.date(),
  openedSeq: z.number().int().nullable(),
  resolvedSeq: z.number().int().nullable(),
});
/** A dispute as stored: PayPal's latest answer, its deal (if matched) and its log entries. */
export type StoredDispute = z.output<typeof disputeRow>;

/** A log entry a dispute change calls for. */
export type DisputeEvent =
  | { type: "DISPUTE_OPENED"; payload: Record<string, JsonValue> }
  | { type: "DISPUTE_UPDATED"; payload: Record<string, JsonValue> }
  | { type: "DISPUTE_RESOLVED"; payload: Record<string, JsonValue> };

/** What a newly read dispute changes: the link to set (first match only) and the entries to write. */
export interface DisputeChanges {
  link: DisputeLink | undefined;
  events: DisputeEvent[];
}

const iso = (date: Date | null | undefined): string | null => date?.toISOString() ?? null;
const sameTime = (a: Date | null | undefined, b: Date | null | undefined) =>
  (a?.getTime() ?? null) === (b?.getTime() ?? null);

/**
 * Which log entries a newly read dispute calls for, from what was stored before. Pure.
 * Nothing is logged for a dispute that matches no deal. A dispute is opened once (when it is
 * first matched); after that only a change of status, PayPal stage or seller due date is logged,
 * not every change of what the seller may do; the decision is logged once. Payloads hold ids and
 * PayPal's own words, never the buyer's messages.
 */
export function disputeChanges(
  stored: StoredDispute | undefined,
  next: z.output<typeof disputeSnapshotSchema>,
  match: DisputeLink | undefined,
): DisputeChanges {
  // Only a dispute not yet tied to a deal takes the match; a linked one keeps its deal.
  const link = (stored?.dealId ?? null) === null ? match : undefined;
  const linked = link !== undefined || (stored?.dealId ?? null) !== null;
  if (!linked) return { link: undefined, events: [] };
  const events: DisputeEvent[] = [];
  const disputeId = next.disputeId;
  if (link !== undefined) {
    events.push({
      type: "DISPUTE_OPENED",
      payload: {
        disputeId,
        reason: next.reason ?? null,
        status: next.status,
        paypalStage: next.stageName ?? null,
        amountMinor: next.amount?.minor ?? null,
        currency: next.amount?.currency ?? null,
        sellerDueAt: iso(next.sellerDueAt),
        stage: link.stage,
        invoiceId: link.invoiceId,
        matchedBy: link.matchedBy,
      },
    });
  } else if (stored !== undefined) {
    const changes: Record<string, JsonValue> = {};
    if (stored.status !== next.status) changes.status = { from: stored.status, to: next.status };
    if ((stored.stageName ?? null) !== (next.stageName ?? null)) {
      changes.paypalStage = { from: stored.stageName, to: next.stageName ?? null };
    }
    if (!sameTime(stored.sellerDueAt, next.sellerDueAt)) {
      changes.sellerDueAt = { from: iso(stored.sellerDueAt), to: iso(next.sellerDueAt) };
    }
    if (Object.keys(changes).length > 0) {
      events.push({ type: "DISPUTE_UPDATED", payload: { disputeId, changes } });
    }
  }
  if (next.outcome !== undefined && (stored?.resolvedSeq ?? null) === null) {
    events.push({
      type: "DISPUTE_RESOLVED",
      payload: { disputeId, outcome: next.outcome, status: next.status },
    });
  }
  return { link, events };
}

async function lockedDispute(q: Queryable, disputeId: string) {
  const rows = await q.query(`SELECT ${COLUMNS} FROM disputes WHERE dispute_id = $1 FOR UPDATE`, [
    disputeId,
  ]);
  return rows[0] === undefined ? undefined : disputeRow.parse(rows[0]);
}

/** One stored dispute, or undefined. */
export async function getDispute(
  q: Queryable,
  disputeId: string,
): Promise<StoredDispute | undefined> {
  const rows = await q.query(`SELECT ${COLUMNS} FROM disputes WHERE dispute_id = $1`, [disputeId]);
  return rows[0] === undefined ? undefined : disputeRow.parse(rows[0]);
}

/** A deal's disputes, oldest first. */
export async function listDealDisputes(q: Queryable, dealId: string): Promise<StoredDispute[]> {
  const rows = await q.query(
    `SELECT ${COLUMNS} FROM disputes WHERE deal_id = $1 ORDER BY first_seen_at, dispute_id`,
    [dealId],
  );
  return rows.map((row) => disputeRow.parse(row));
}

/**
 * Disputes tied to a deal that PayPal is waiting on the seller to answer, with a respond-by date
 * after `now` and at most `until` (for deadline reminders, 5j).
 */
export async function listDisputesDueBy(
  q: Queryable,
  now: Date,
  until: Date,
): Promise<StoredDispute[]> {
  const rows = await q.query(
    `SELECT ${COLUMNS} FROM disputes
      WHERE deal_id IS NOT NULL AND status = 'WAITING_FOR_SELLER_RESPONSE'
        AND seller_due_at > $1 AND seller_due_at <= $2
      ORDER BY seller_due_at, dispute_id`,
    [now, until],
  );
  return rows.map((row) => disputeRow.parse(row));
}

/**
 * Saves a dispute as just read from PayPal, matched to a payment stage when `match` is given,
 * and writes the log entries the change calls for (`disputeChanges`), all in one transaction with
 * the dispute's row locked, so two checks at once write each entry once. A dispute already linked
 * keeps its deal; `match` only links one that was not.
 */
export async function recordDispute(
  db: Database,
  snapshot: DisputeSnapshot,
  match: DisputeLink | undefined,
  now: Date,
): Promise<{ dispute: StoredDispute; entries: LedgerEntry[] }> {
  const next = disputeSnapshotSchema.parse(snapshot);
  const link = match === undefined ? undefined : disputeLinkSchema.parse(match);
  return db.transaction(async (tx) => {
    const inserted = await tx.query(
      `INSERT INTO disputes (dispute_id, status, first_seen_at, checked_at) VALUES ($1, $2, $3, $3)
       ON CONFLICT (dispute_id) DO NOTHING RETURNING dispute_id`,
      [next.disputeId, next.status, now],
    );
    const before = await lockedDispute(tx, next.disputeId);
    const stored = inserted.length > 0 ? undefined : before;
    const changes = disputeChanges(stored, next, link);
    const dealId = changes.link?.dealId ?? stored?.dealId ?? null;
    const entries: LedgerEntry[] = [];
    // Events exist only for a dispute tied to a deal (see disputeChanges).
    if (dealId !== null) {
      for (const event of changes.events) {
        entries.push(await appendLedgerEvent(tx, { dealId, actor: "system", ...event }, now));
      }
    }
    const seqOf = (type: DisputeEvent["type"]) =>
      entries.find((entry) => entry.type === type)?.seq ?? null;
    const rows = await tx.query(
      `UPDATE disputes SET reason = $2, status = $3, dispute_state = $4, stage_name = $5,
         amount_minor = $6, currency = $7, seller_due_at = $8, buyer_due_at = $9,
         allowed_actions = $10::jsonb, offer_types = $11::jsonb, outcome = $12, details = $13::jsonb,
         paypal_created_at = $14, paypal_updated_at = $15, checked_at = $16,
         deal_id = COALESCE(deal_id, $17), stage = COALESCE(stage, $18),
         invoice_id = COALESCE(invoice_id, $19), matched_by = COALESCE(matched_by, $20),
         opened_seq = COALESCE(opened_seq, $21), resolved_seq = COALESCE(resolved_seq, $22)
       WHERE dispute_id = $1 RETURNING ${COLUMNS}`,
      [
        next.disputeId,
        next.reason ?? null,
        next.status,
        next.state ?? null,
        next.stageName ?? null,
        next.amount?.minor ?? null,
        next.amount?.currency ?? null,
        next.sellerDueAt ?? null,
        next.buyerDueAt ?? null,
        JSON.stringify(next.allowedActions),
        JSON.stringify(next.offerTypes),
        next.outcome ?? null,
        JSON.stringify(next.details),
        next.paypalCreatedAt ?? null,
        next.paypalUpdatedAt ?? null,
        now,
        changes.link?.dealId ?? null,
        changes.link?.stage ?? null,
        changes.link?.invoiceId ?? null,
        changes.link?.matchedBy ?? null,
        seqOf("DISPUTE_OPENED"),
        seqOf("DISPUTE_RESOLVED"),
      ],
    );
    return { dispute: disputeRow.parse(rows[0]), entries };
  });
}

const paidStageRow = z.object({
  dealId: z.string(),
  stage: z.number().int(),
  invoiceId: z.string().nullable(),
  transactionId: z.string().nullable(),
  invoiceNumber: z.string().nullable(),
});
/** A paid payment stage a dispute may be about. */
export type PaidStage = z.output<typeof paidStageRow>;

/**
 * Paid stages whose PayPal transaction id is one of `transactionIds`, or whose invoice is named
 * in `invoiceNumbers`. A dispute's `invoice_number` holds the invoice's id (INV2-…), not its
 * number (checked in the sandbox on 5 Nov 2026), so both are compared.
 */
export async function findPaidStages(
  q: Queryable,
  keys: { transactionIds: readonly string[]; invoiceNumbers: readonly string[] },
): Promise<PaidStage[]> {
  if (keys.transactionIds.length === 0 && keys.invoiceNumbers.length === 0) return [];
  const rows = await q.query(
    `SELECT deal_id AS "dealId", stage, invoice_id AS "invoiceId",
            transaction_id AS "transactionId", invoice_number AS "invoiceNumber"
       FROM milestones
      WHERE status = 'paid'
        AND (transaction_id = ANY($1::text[]) OR invoice_number = ANY($2::text[])
             OR invoice_id = ANY($2::text[]))
      ORDER BY deal_id, stage`,
    [[...keys.transactionIds], [...keys.invoiceNumbers]],
  );
  return rows.map((row) => paidStageRow.parse(row));
}

/** How a dispute check ended: what it counted, or why it stopped (PayPal's issue code only). */
export type DisputeCheckResult =
  | {
      ok: true;
      listed: number;
      readInFull: number;
      matched: number;
      unmatched: number;
      newEntries: number;
    }
  | { ok: false; failure: string };

const checkRow = z.object({
  id: z.string(),
  source: z.enum(DISPUTE_CHECK_SOURCES),
  startedAt: z.date(),
  finishedAt: z.date().nullable(),
  listed: z.number().int().nullable(),
  readInFull: z.number().int().nullable(),
  matched: z.number().int().nullable(),
  unmatched: z.number().int().nullable(),
  newEntries: z.number().int().nullable(),
  failure: z.string().nullable(),
});
/** One dispute check as stored. */
export type DisputeCheck = z.output<typeof checkRow>;

const CHECK_COLUMNS = `id, source, started_at AS "startedAt", finished_at AS "finishedAt", listed,
  read_in_full AS "readInFull", matched, unmatched, new_entries AS "newEntries", failure`;

/** Records that a dispute check started. */
export async function startDisputeCheck(
  q: Queryable,
  check: { id: string; source: DisputeCheckSource },
  now: Date,
): Promise<void> {
  const { id, source } = z
    .object({ id: z.uuid(), source: z.enum(DISPUTE_CHECK_SOURCES) })
    .parse(check);
  await q.query("INSERT INTO dispute_checks (id, source, started_at) VALUES ($1, $2, $3)", [
    id,
    source,
    now,
  ]);
}

/** Records how a dispute check ended. */
export async function finishDisputeCheck(
  q: Queryable,
  id: string,
  result: DisputeCheckResult,
  now: Date,
): Promise<void> {
  const counts = result.ok
    ? [result.listed, result.readInFull, result.matched, result.unmatched, result.newEntries]
    : [null, null, null, null, null];
  await q.query(
    `UPDATE dispute_checks SET finished_at = $2, listed = $3, read_in_full = $4, matched = $5,
       unmatched = $6, new_entries = $7, failure = $8 WHERE id = $1`,
    [id, now, ...counts, result.ok ? null : result.failure.slice(0, 200)],
  );
}

/** The newest dispute check, or undefined before the first. */
export async function latestDisputeCheck(q: Queryable): Promise<DisputeCheck | undefined> {
  const rows = await q.query(
    `SELECT ${CHECK_COLUMNS} FROM dispute_checks ORDER BY started_at DESC, id LIMIT 1`,
  );
  return rows[0] === undefined ? undefined : checkRow.parse(rows[0]);
}
