import type { Database, Queryable } from "./database.js";

/**
 * How long PactPal keeps personal data (owner, 10 Nov 2026; docs/decisions.md, Retention):
 * a deal's whole record for 210 days after its last activity (PayPal disputes and chargebacks
 * can come up to about 180 days after a payment, plus a buffer), and raw PayPal notifications
 * and AI scope drafts, which quote the pasted chat, for 60 days.
 */
export const RETENTION = { dealDays: 210, shortDays: 60, maxDealsPerRun: 200 } as const;

const DAY_MS = 86_400_000;

/** The moments before which each kind of data is due, for a sweep at `now`. Pure. */
export function retentionCutoffs(now: Date): { dealsBefore: Date; shortBefore: Date } {
  return {
    dealsBefore: new Date(now.getTime() - RETENTION.dealDays * DAY_MS),
    shortBefore: new Date(now.getTime() - RETENTION.shortDays * DAY_MS),
  };
}

/**
 * Every table holding a deal's rows, children before the tables they point to, so a deal can
 * be removed in one transaction without breaking a reference. `deals` itself goes last.
 */
export const DEAL_TABLES = [
  "message_reads",
  "notifications",
  "sessions",
  "link_tokens",
  "agent_requests",
  "timeline_reminders",
  "timeline_progress",
  "dispute_notices",
  "dispute_actions",
  "evidence_packets",
  "claim_analyses",
  "disputes",
  "message_reviews",
  "delivery_checks",
  "delivery_answers",
  "delivery_files",
  "deliveries",
  "buyer_questions",
  "change_orders",
  "milestones",
  "acceptances",
  "scope_drafts",
  "deal_messages",
  "artifacts",
  "scope_versions",
  "ledger_entries",
] as const;

/** Lets this transaction delete from the guarded tables; it ends with the transaction. */
const allowPurge = (tx: Queryable) => tx.query("SET LOCAL pactpal.retention_purge = 'on'");

/** Which cutoff a kind of data is measured against. */
type Cutoff = "now" | "short" | "deals";

/**
 * The data removed without its deal, in order (files last, once purged deals no longer use
 * them). `from` and `where` are fixed SQL; the one parameter is the named cutoff.
 */
const LOOSE_DATA = [
  // Raw PayPal notifications. Repeats come within days, so the 60-day record still catches them.
  { kind: "webhookEvents", from: "webhook_events", where: "received_at < $1", cutoff: "short" },
  // A finished draft's chat quotes; its fingerprint stays in the deal's log.
  {
    kind: "scopeDrafts",
    from: "scope_drafts",
    where: "status <> 'running' AND finished_at < $1",
    cutoff: "short",
  },
  { kind: "sessions", from: "sessions", where: "expires_at < $1", cutoff: "now" },
  { kind: "linkTokens", from: "link_tokens", where: "expires_at < $1", cutoff: "now" },
  // Disputes PayPal reported that never matched a deal.
  {
    kind: "unmatchedDisputes",
    from: "disputes",
    where:
      "deal_id IS NULL AND status = 'RESOLVED' AND COALESCE(paypal_updated_at, first_seen_at) < $1",
    cutoff: "deals",
  },
  // Stored bytes no file or packet uses any more; new uploads are never that old.
  {
    kind: "files",
    from: "file_contents f",
    where: `f.created_at < $1
      AND NOT EXISTS (SELECT 1 FROM artifacts a WHERE a.sha256 = f.sha256)
      AND NOT EXISTS (SELECT 1 FROM evidence_packets p WHERE p.packet_sha256 = f.sha256)`,
    cutoff: "short",
  },
] as const satisfies readonly { kind: string; from: string; where: string; cutoff: Cutoff }[];

type LooseKind = (typeof LOOSE_DATA)[number]["kind"];

/** What one sweep removed (or, in a dry run, would remove). Counts only, never personal data. */
export type RetentionCounts = Record<LooseKind, number> & {
  /** Deals removed whole. */
  deals: number;
  /** Deals past 210 days kept because a PayPal dispute on them is not resolved. */
  dealsHeld: number;
  /** Deals that could not be removed this time (tried again on the next sweep). */
  dealsFailed: number;
};

const DUE_DEALS = `FROM deals d
  WHERE COALESCE((SELECT max(l.server_time) FROM ledger_entries l WHERE l.deal_id = d.id),
    d.updated_at) < $1`;
const OPEN_DISPUTE = `EXISTS (SELECT 1 FROM disputes x WHERE x.deal_id = d.id AND x.status <> 'RESOLVED')`;

/** Deals with no activity since `before` and no open PayPal dispute, oldest first. */
export async function dealsDue(q: Queryable, before: Date, limit: number): Promise<string[]> {
  const rows = await q.query(
    `SELECT d.id ${DUE_DEALS} AND NOT ${OPEN_DISPUTE} ORDER BY d.created_at, d.id LIMIT $2`,
    [before, limit],
  );
  return rows.map((row) => String(row.id));
}

const countOf = async (q: Queryable, sql: string, params: readonly unknown[]) =>
  Number((await q.query(`SELECT count(*)::int AS n ${sql}`, params))[0]?.n ?? 0);

/**
 * Removes everything about one deal in one transaction: its log, files, chat, signatures,
 * disputes, packets and the rest. All or nothing, so no deal is ever left half removed.
 */
export async function purgeDeal(db: Database, dealId: string): Promise<void> {
  await db.transaction(async (tx) => {
    await allowPurge(tx);
    for (const table of DEAL_TABLES) {
      await tx.query(`DELETE FROM ${table} WHERE deal_id = $1`, [dealId]);
    }
    await tx.query("DELETE FROM deals WHERE id = $1", [dealId]);
  });
}

export interface RetentionSweep {
  now: Date;
  /** The id of this run's record. */
  runId: string;
  /** Count what is due without removing anything. */
  dryRun: boolean;
}

/**
 * The daily clean-up: removes due deals (up to `RETENTION.maxDealsPerRun`, one transaction
 * each, so one failure does not stop the others), then the 60-day data, and records the run in
 * `retention_runs`. Returns the counts and the ids of deals that failed.
 */
export async function runRetentionSweep(
  db: Database,
  sweep: RetentionSweep,
): Promise<{ counts: RetentionCounts; failedDeals: string[] }> {
  const { dealsBefore, shortBefore } = retentionCutoffs(sweep.now);
  const cutoffs: Record<Cutoff, Date> = { now: sweep.now, short: shortBefore, deals: dealsBefore };
  const due = await dealsDue(db, dealsBefore, RETENTION.maxDealsPerRun);
  const failedDeals: string[] = [];
  if (!sweep.dryRun) {
    for (const dealId of due) {
      try {
        await purgeDeal(db, dealId);
      } catch {
        failedDeals.push(dealId);
      }
    }
  }
  const loose = {} as Record<LooseKind, number>;
  await db.transaction(async (tx) => {
    await allowPurge(tx);
    for (const { kind, from, where, cutoff } of LOOSE_DATA) {
      const params = [cutoffs[cutoff]];
      loose[kind] = sweep.dryRun
        ? await countOf(tx, `FROM ${from} WHERE ${where}`, params)
        : (await tx.query(`DELETE FROM ${from} WHERE ${where} RETURNING 1`, params)).length;
    }
  });
  const counts: RetentionCounts = {
    deals: due.length - failedDeals.length,
    dealsHeld: await countOf(db, `${DUE_DEALS} AND ${OPEN_DISPUTE}`, [dealsBefore]),
    dealsFailed: failedDeals.length,
    ...loose,
  };
  await db.query(
    `INSERT INTO retention_runs (id, ran_at, dry_run, deals_before, short_before, counts)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [sweep.runId, sweep.now, sweep.dryRun, dealsBefore, shortBefore, JSON.stringify(counts)],
  );
  return { counts, failedDeals };
}
