import { z } from "zod";
import type { Queryable } from "./database.js";

/** What a dispute email is about (5j). */
export const NOTICE_KINDS = ["opened", "changed", "decided", "reminder"] as const;
export type NoticeKind = (typeof NOTICE_KINDS)[number];

const noticeRow = z
  .object({
    key: z.string(),
    deal_id: z.string(),
    dispute_id: z.string(),
    kind: z.enum(NOTICE_KINDS),
    ledger_seq: z.number().int().nullable(),
    sent_at: z.date(),
    email_id: z.string().nullable(),
    failure: z.string().nullable(),
  })
  .transform((row) => ({
    key: row.key,
    dealId: row.deal_id,
    disputeId: row.dispute_id,
    kind: row.kind,
    ledgerSeq: row.ledger_seq ?? undefined,
    sentAt: row.sent_at,
    emailId: row.email_id ?? undefined,
    failure: row.failure ?? undefined,
  }));
/** An email sent (or refused) about a dispute. */
export type DisputeNotice = z.output<typeof noticeRow>;

const newNoticeSchema = z.object({
  key: z.string().min(1).max(256),
  dealId: z.uuid(),
  disputeId: z.string().min(1).max(100),
  kind: z.enum(NOTICE_KINDS),
  ledgerSeq: z.number().int().min(0).optional(),
  outcome: z.union([
    z.object({ emailId: z.string().min(1).max(200) }),
    z.object({ failure: z.string().min(1).max(200) }),
  ]),
});
export type NewDisputeNotice = z.input<typeof newNoticeSchema>;

/**
 * Records an email sent (or refused for good) about a dispute, once per key: a second record of
 * the same key is ignored, so two checks at once never record it twice.
 */
export async function recordDisputeNotice(
  q: Queryable,
  input: NewDisputeNotice,
  now: Date,
): Promise<void> {
  const notice = newNoticeSchema.parse(input);
  await q.query(
    `INSERT INTO dispute_notices (key, deal_id, dispute_id, kind, ledger_seq, sent_at, email_id, failure)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (key) DO NOTHING`,
    [
      notice.key,
      notice.dealId,
      notice.disputeId,
      notice.kind,
      notice.ledgerSeq ?? null,
      now,
      "emailId" in notice.outcome ? notice.outcome.emailId : null,
      "failure" in notice.outcome ? notice.outcome.failure : null,
    ],
  );
}

/** Which of `keys` already have a notice. */
export async function noticeKeysTaken(q: Queryable, keys: readonly string[]): Promise<Set<string>> {
  if (keys.length === 0) return new Set();
  const rows = await q.query("SELECT key FROM dispute_notices WHERE key = ANY($1::text[])", [
    [...keys],
  ]);
  return new Set(rows.map((row) => z.object({ key: z.string() }).parse(row).key));
}

/** A dispute's emails, newest first. */
export async function listDisputeNotices(
  q: Queryable,
  disputeId: string,
): Promise<DisputeNotice[]> {
  const rows = await q.query(
    "SELECT * FROM dispute_notices WHERE dispute_id = $1 ORDER BY sent_at DESC, key",
    [disputeId],
  );
  return rows.map((row) => noticeRow.parse(row));
}

const entryRow = z
  .object({
    deal_id: z.string(),
    seq: z.number().int(),
    type: z.enum(["DISPUTE_OPENED", "DISPUTE_UPDATED", "DISPUTE_RESOLVED"]),
    payload: z.record(z.string(), z.json()),
    server_time: z.date(),
  })
  .transform((row) => ({
    dealId: row.deal_id,
    seq: row.seq,
    type: row.type,
    payload: row.payload,
    serverTime: row.server_time,
  }));
/** A dispute's log entry, as the seller's emails need it. */
export type DisputeEntry = z.output<typeof entryRow>;

/** Every deal's dispute entries (opened, changed, decided) written since `since`, oldest first. */
export async function listDisputeEntriesSince(q: Queryable, since: Date): Promise<DisputeEntry[]> {
  const rows = await q.query(
    `SELECT deal_id, seq, type, payload, server_time FROM ledger_entries
      WHERE type IN ('DISPUTE_OPENED', 'DISPUTE_UPDATED', 'DISPUTE_RESOLVED')
        AND server_time >= $1
      ORDER BY server_time, deal_id, seq`,
    [since],
  );
  return rows.map((row) => entryRow.parse(row));
}
