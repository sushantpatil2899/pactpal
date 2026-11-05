import type { DisputeLink, PaidStage } from "@pactpal/db";
import type { DisputeDetails } from "@pactpal/paypal";

/** What a dispute names as the payment it is about. */
export type DisputedPayments = DisputeDetails["transactions"];

/** Why a dispute was not tied to a deal. */
export type NoMatch = "no-paid-stage" | "several-stages";

/** The PayPal transaction ids and invoice numbers a dispute names, to look up paid stages by. */
export function paymentKeys(transactions: DisputedPayments): {
  transactionIds: string[];
  invoiceNumbers: string[];
} {
  return {
    transactionIds: transactions.flatMap((t) =>
      t.sellerTransactionId === undefined ? [] : [t.sellerTransactionId],
    ),
    invoiceNumbers: transactions.flatMap((t) =>
      t.invoiceNumber === undefined ? [] : [t.invoiceNumber],
    ),
  };
}

/**
 * Ties a dispute to the one paid stage it is about, from the stages found by its payment keys.
 * Pure. The seller's transaction id is the first proof, PayPal's invoice number the second. A
 * dispute that points at more than one stage is never guessed: it stays unmatched.
 */
export function matchDispute(
  transactions: DisputedPayments,
  stages: readonly PaidStage[],
): { ok: true; link: DisputeLink } | { ok: false; reason: NoMatch } {
  const keys = paymentKeys(transactions);
  const tries = [
    {
      by: "transaction" as const,
      found: stages.filter(
        (s) => s.transactionId !== null && keys.transactionIds.includes(s.transactionId),
      ),
    },
    {
      by: "invoice-number" as const,
      found: stages.filter(
        (s) => s.invoiceNumber !== null && keys.invoiceNumbers.includes(s.invoiceNumber),
      ),
    },
  ];
  for (const { by, found } of tries) {
    const distinct = new Map(found.map((s) => [`${s.dealId}:${String(s.stage)}`, s]));
    if (distinct.size > 1) return { ok: false, reason: "several-stages" };
    const [stage] = distinct.values();
    if (stage !== undefined) {
      return {
        ok: true,
        link: {
          dealId: stage.dealId,
          stage: stage.stage,
          invoiceId: stage.invoiceId,
          matchedBy: by,
        },
      };
    }
  }
  return { ok: false, reason: "no-paid-stage" };
}
