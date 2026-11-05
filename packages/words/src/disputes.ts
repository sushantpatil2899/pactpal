/** PayPal's code in plain letters: "NOT_AS_DESCRIBED" becomes "not as described". */
export const plainCode = (code: string): string => code.replaceAll("_", " ").toLowerCase();

const REASONS: Record<string, string> = {
  MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED: "not as described",
  MERCHANDISE_OR_SERVICE_NOT_RECEIVED: "not received",
  UNAUTHORISED: "unauthorised payment",
  CREDIT_NOT_PROCESSED: "refund not received",
  DUPLICATE_TRANSACTION: "charged twice",
  INCORRECT_AMOUNT: "wrong amount charged",
  PAYMENT_BY_OTHER_MEANS: "paid another way",
  CANCELED_RECURRING_BILLING: "cancelled subscription still charged",
  PROBLEM_WITH_REMITTANCE: "problem with the payment",
  OTHER: "other",
};

/** Why the buyer disputed, in plain words; an unknown reason in plain letters. */
export const disputeReasonWords = (reason: string): string => REASONS[reason] ?? plainCode(reason);

/** The seller actions PactPal will carry out, and the later step that adds each. */
const ACTIONS: Record<string, string> = {
  escalate: "Escalate: ask PayPal to decide the case. Only after this can you send evidence.",
  provide_evidence: "Send evidence: upload documents that answer the claim.",
  make_offer: "Offer a refund: propose a refund the buyer can accept.",
  accept_claim: "Accept the claim: refund the buyer and close the case.",
  send_message: "Message the buyer through PayPal.",
  appeal: "Appeal: ask PayPal to look again, with new evidence.",
  provide_supporting_info: "Add supporting information while PayPal reviews.",
  acknowledge_return_item: "Confirm the returned item arrived.",
};

/**
 * What a PayPal action lets the seller do, in one plain sentence (wording approved by the owner,
 * 5c). None can be done from PactPal yet, so each says it is coming in a later step.
 */
export function disputeActionWords(action: string): string {
  const known = ACTIONS[action];
  return known === undefined
    ? `${plainCode(action)}: PactPal cannot do this yet.`
    : `${known} (coming in a later step)`;
}

const HOUR_MS = 3_600_000;
const plural = (n: number, word: string) => `${String(n)} ${word}${n === 1 ? "" : "s"}`;

/** Days and hours, or hours alone under a day. */
function span(ms: number): string {
  const hours = Math.floor(ms / HOUR_MS);
  const days = Math.floor(hours / 24);
  if (days === 0) return plural(hours, "hour");
  const rest = hours % 24;
  return rest === 0 ? plural(days, "day") : `${plural(days, "day")} ${plural(rest, "hour")}`;
}

/** How long is left before a deadline, or how long ago it passed. */
export function deadlineWords(dueAt: Date, now: Date): string {
  const left = dueAt.getTime() - now.getTime();
  if (left <= 0) {
    return -left < HOUR_MS
      ? "the deadline passed less than an hour ago"
      : `the deadline passed ${span(-left)} ago`;
  }
  return left < HOUR_MS ? "less than an hour left" : `${span(left)} left`;
}

/** True when a deadline is less than two days away (and not passed), so pages can warn. */
export const deadlineIsNear = (dueAt: Date, now: Date): boolean => {
  const left = dueAt.getTime() - now.getTime();
  return left > 0 && left < 48 * HOUR_MS;
};
