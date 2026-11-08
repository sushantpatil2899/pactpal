import {
  findPaidStages,
  finishDisputeCheck,
  getDispute,
  recordDispute,
  startDisputeCheck,
  type Database,
  type DisputeCheckResult,
  type DisputeCheckSource,
  type DisputeSnapshot,
  type PaidStageAccount,
  type StoredDispute,
} from "@pactpal/db";
import {
  PayPalApiError,
  PayPalNetworkError,
  PayPalResponseError,
  type DisputeDetails,
  type DisputeSummary,
} from "@pactpal/paypal";
import { z } from "zod";
import type { LogSink } from "../payments/payment-sync.js";
import { sendDisputeNotices, type NoticeDeps } from "./notices.js";
import { matchDispute, paymentKeys, type DisputedPayments } from "./match.js";

import type { DisputeReader, LinkedDisputeAccount } from "./dispute-reader.js";

export type { DisputeReader, LinkedDisputeAccount } from "./dispute-reader.js";

export interface DisputeSyncDeps {
  db: Database;
  /** PactPal's own seller app; absent when only sellers' own apps are set up. */
  disputes?: DisputeReader | undefined;
  /** Sellers' own linked apps, read at the start of each check (6h-5). */
  linkedAccounts?: () => Promise<LinkedDisputeAccount[]>;
  clock: () => Date;
  newId: () => string;
  log: LogSink;
  /** Emails the seller after each check (5j); off without an email service and a site address. */
  notices?: Omit<NoticeDeps, "db" | "clock" | "log">;
}

/** A PayPal date, or undefined when PayPal sent none or something that is not a date. */
function toDate(value: string | undefined): Date | undefined {
  if (value === undefined) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * Same time to the second: PayPal's dispute list gives whole seconds while the full dispute gives
 * milliseconds, so comparing milliseconds would read every dispute in full at every check
 * (5k-fix-3).
 */
const sameSecond = (a: Date | null | undefined, b: Date | null | undefined) =>
  (a === null || a === undefined ? null : Math.floor(a.getTime() / 1000)) ===
  (b === null || b === undefined ? null : Math.floor(b.getTime() / 1000));

/** A full read this close to PayPal's last change may have caught PayPal mid-update. */
const SETTLE_MS = 60_000;

/**
 * True when PactPal's last full read came within a minute of PayPal's last change, so PayPal may
 * still have been changing what it allows (seen live after a refund offer, 5k-2). The next check
 * reads it once more; that read comes minutes later, so it happens at most once (5k-fix-3).
 */
const readTooSoon = (stored: StoredDispute): boolean =>
  stored.paypalUpdatedAt !== null &&
  Math.abs(stored.checkedAt.getTime() - stored.paypalUpdatedAt.getTime()) < SETTLE_MS;

/**
 * How PactPal reads PayPal's answer. A stored copy read the older way is read once again: version 2
 * takes the buyer's words from their own evidence entries too (5k-fix-1).
 */
const READ_VERSION = 2;

const readVersionOf = (details: StoredDispute["details"]): number | undefined =>
  z.object({ readVersion: z.number() }).safeParse(details).data?.readVersion;

/** True when the listed dispute differs from the stored copy, so it must be read in full again. */
function changedSince(stored: StoredDispute | undefined, listed: DisputeSummary): boolean {
  if (stored === undefined) return true;
  return (
    stored.details === null ||
    readVersionOf(stored.details) !== READ_VERSION ||
    stored.status !== listed.status ||
    (stored.stageName ?? undefined) !== listed.stage ||
    !sameSecond(stored.paypalUpdatedAt, toDate(listed.updatedAt)) ||
    readTooSoon(stored)
  );
}

/** PayPal's full answer as a stored snapshot. The answer itself is kept as plain JSON. */
function snapshotOf(details: DisputeDetails): DisputeSnapshot {
  const optional = <K extends string, V>(key: K, value: V | undefined) =>
    (value === undefined ? {} : { [key]: value }) as Partial<Record<K, V>>;
  return {
    disputeId: details.disputeId,
    status: details.status,
    ...optional("reason", details.reason),
    ...optional("state", details.state),
    ...optional("stageName", details.stage),
    ...optional("amount", details.amount),
    ...optional("sellerDueAt", toDate(details.sellerResponseDueDate)),
    ...optional("buyerDueAt", toDate(details.buyerResponseDueDate)),
    allowedActions: details.allowedActions,
    offerTypes: details.allowedOfferTypes,
    ...optional("outcome", details.outcome),
    ...optional("paypalCreatedAt", toDate(details.createdAt)),
    ...optional("paypalUpdatedAt", toDate(details.updatedAt)),
    // Through JSON so fields PayPal left out are dropped rather than stored as undefined.
    details: {
      ...(JSON.parse(JSON.stringify(details)) as Record<string, DisputeSnapshot["details"]>),
      readVersion: READ_VERSION,
    },
  };
}

const storedDetails = z.object({
  transactions: z
    .array(
      z.object({
        sellerTransactionId: z.string().optional(),
        buyerTransactionId: z.string().optional(),
        invoiceNumber: z.string().optional(),
      }),
    )
    .default([]),
});

const storedTransactions = (stored: StoredDispute): DisputedPayments =>
  storedDetails
    .parse(stored.details ?? {})
    .transactions.map(({ sellerTransactionId, buyerTransactionId, invoiceNumber }) => ({
      sellerTransactionId,
      buyerTransactionId,
      invoiceNumber,
    }));

/** The stored copy as a snapshot again, so a dispute PayPal did not change can still be matched. */
function storedSnapshot(stored: StoredDispute): DisputeSnapshot {
  const optional = <K extends string, V>(key: K, value: V | null) =>
    (value === null ? {} : { [key]: value }) as Partial<Record<K, V>>;
  return {
    disputeId: stored.disputeId,
    status: stored.status,
    ...optional("reason", stored.reason),
    ...optional("state", stored.state),
    ...optional("stageName", stored.stageName),
    ...(stored.amountMinor === null || stored.currency === null
      ? {}
      : { amount: { minor: stored.amountMinor, currency: stored.currency } }),
    ...optional("sellerDueAt", stored.sellerDueAt),
    ...optional("buyerDueAt", stored.buyerDueAt),
    allowedActions: stored.allowedActions,
    offerTypes: stored.offerTypes,
    ...optional("outcome", stored.outcome),
    ...optional("paypalCreatedAt", stored.paypalCreatedAt),
    ...optional("paypalUpdatedAt", stored.paypalUpdatedAt),
    details: stored.details ?? {},
  };
}

/** A short reason a check failed: PayPal's status and error name only, never its text. */
export function failureCode(error: unknown): string {
  if (error instanceof PayPalApiError) {
    return `PayPal answered ${String(error.status)}${error.errorName === undefined ? "" : ` ${error.errorName}`}`;
  }
  if (error instanceof PayPalNetworkError) {
    return error.timedOut ? "PayPal did not answer in time" : "PayPal could not be reached";
  }
  if (error instanceof PayPalResponseError) return "PayPal's answer could not be read";
  return "the check failed inside PactPal";
}

type Counts = Omit<Extract<DisputeCheckResult, { ok: true }>, "ok">;

/**
 * Reads one account's dispute list, reads in full each dispute that is new or changed, ties each
 * to the paid stage of that same account it is about (`matchDispute`) and saves it (`recordDispute`).
 */
async function syncAccount(
  deps: DisputeSyncDeps,
  disputes: DisputeReader,
  account: PaidStageAccount,
  counts: Counts,
  checkId: string,
): Promise<void> {
  const { db, clock, log } = deps;
  const { data: list } = await disputes.list();
  if (list.truncated) log.warn({ checkId }, "Dispute list stopped at the page limit");
  for (const listed of list.disputes) {
    counts.listed += 1;
    const stored = await getDispute(db, listed.disputeId);
    let snapshot: DisputeSnapshot;
    let transactions: DisputedPayments;
    if (changedSince(stored, listed)) {
      const { data: details } = await disputes.get(listed.disputeId);
      counts.readInFull += 1;
      snapshot = snapshotOf(details);
      transactions = details.transactions;
    } else if (stored?.dealId === null) {
      // Unchanged at PayPal, but its payment may have been recorded since: try matching again.
      snapshot = storedSnapshot(stored);
      transactions = storedTransactions(stored);
    } else {
      counts.matched += 1;
      continue;
    }
    const stages = await findPaidStages(db, paymentKeys(transactions), account);
    const match = matchDispute(transactions, stages);
    if (!match.ok)
      log.info({ disputeId: listed.disputeId, reason: match.reason }, "Dispute not matched");
    const { dispute, entries } = await recordDispute(
      db,
      snapshot,
      match.ok ? match.link : undefined,
      clock(),
    );
    counts.newEntries += entries.length;
    if (dispute.dealId === null) counts.unmatched += 1;
    else counts.matched += 1;
  }
}

/**
 * One dispute check: PactPal's own seller app, then each seller's own linked app (6h-5), each
 * matched only against stages invoiced from that account. Each check is recorded in
 * `dispute_checks` with its counts or why it failed. A failure of PactPal's own app (or of reading
 * the links) fails the check and is thrown again, so a scheduled task is retried; one linked app
 * failing is logged and the others are still checked.
 */
export async function syncDisputes(
  deps: DisputeSyncDeps,
  source: DisputeCheckSource,
): Promise<DisputeCheckResult> {
  const { db, clock, log } = deps;
  const checkId = deps.newId();
  await startDisputeCheck(db, { id: checkId, source }, clock());
  const counts: Counts = { listed: 0, readInFull: 0, matched: 0, unmatched: 0, newEntries: 0 };
  try {
    if (deps.disputes) {
      await syncAccount(deps, deps.disputes, { kind: "pactpal" }, counts, checkId);
    }
    for (const linked of (await deps.linkedAccounts?.()) ?? []) {
      const account = { kind: "own-app", merchantId: linked.merchantId } as const;
      try {
        await syncAccount(deps, linked.disputes, account, counts, checkId);
      } catch (error) {
        const failure = failureCode(error);
        if (failure === "the check failed inside PactPal") throw error;
        log.warn({ checkId, connectionId: linked.connectionId, failure }, "Seller app not checked");
      }
    }
  } catch (error) {
    const failure = failureCode(error);
    await finishDisputeCheck(db, checkId, { ok: false, failure }, clock());
    log.error({ checkId, source, failure }, "Dispute check failed");
    throw error;
  }
  const result: DisputeCheckResult = { ok: true, ...counts };
  await finishDisputeCheck(db, checkId, result, clock());
  log.info({ checkId, source, ...counts }, "Dispute check done");
  if (deps.notices) {
    const emails = await sendDisputeNotices({ ...deps.notices, db, clock, log });
    log.info({ checkId, ...emails }, "Dispute emails done");
  }
  return result;
}
