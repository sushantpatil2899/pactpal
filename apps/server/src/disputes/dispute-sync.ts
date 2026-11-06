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
  type StoredDispute,
} from "@pactpal/db";
import {
  PayPalApiError,
  PayPalNetworkError,
  PayPalResponseError,
  type DisputeDetails,
  type DisputeSummary,
  type PayPalDisputes,
} from "@pactpal/paypal";
import { z } from "zod";
import type { LogSink } from "../payments/payment-sync.js";
import { sendDisputeNotices, type NoticeDeps } from "./notices.js";
import { matchDispute, paymentKeys, type DisputedPayments } from "./match.js";

/** The PayPal reads a dispute check makes. */
export type DisputeReader = Pick<PayPalDisputes, "list" | "get">;

export interface DisputeSyncDeps {
  db: Database;
  disputes: DisputeReader;
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

const sameTime = (a: Date | null | undefined, b: Date | null | undefined) =>
  (a?.getTime() ?? null) === (b?.getTime() ?? null);

/** True when the listed dispute differs from the stored copy, so it must be read in full again. */
function changedSince(stored: StoredDispute | undefined, listed: DisputeSummary): boolean {
  if (stored === undefined) return true;
  return (
    stored.details === null ||
    stored.status !== listed.status ||
    (stored.stageName ?? undefined) !== listed.stage ||
    !sameTime(stored.paypalUpdatedAt, toDate(listed.updatedAt))
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
    details: JSON.parse(JSON.stringify(details)) as DisputeSnapshot["details"],
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

/**
 * One dispute check: reads the seller's dispute list from PayPal, reads in full each dispute
 * that is new or changed, ties each to the paid stage it is about (`matchDispute`) and saves it,
 * writing its log entries (`recordDispute`). Each check is recorded in `dispute_checks` with its
 * counts or why it failed; a failure is then thrown again, so a scheduled task is retried.
 */
export async function syncDisputes(
  deps: DisputeSyncDeps,
  source: DisputeCheckSource,
): Promise<DisputeCheckResult> {
  const { db, disputes, clock, log } = deps;
  const checkId = deps.newId();
  await startDisputeCheck(db, { id: checkId, source }, clock());
  const counts = { listed: 0, readInFull: 0, matched: 0, unmatched: 0, newEntries: 0 };
  try {
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
      const match = matchDispute(transactions, await findPaidStages(db, paymentKeys(transactions)));
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
