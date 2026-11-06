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

/** The actions PactPal carries out now (5g, 5h); the others come in a later step. */
const WORKING = new Set([
  "escalate",
  "provide_evidence",
  "send_message",
  "make_offer",
  "accept_claim",
  "appeal",
]);

/** The actions the answer help (5h) describes, in the order the page lists them. */
export const ANSWER_OPTIONS = [
  "send_message",
  "make_offer",
  "accept_claim",
  "escalate",
  "provide_evidence",
] as const;

/**
 * What an action does, in fixed words written by code, never by AI (wording approved by the
 * owner, 5h); `amount` is the disputed amount ("120.00 USD"), when PayPal gave one.
 */
export function answerFacts(action: string, amount: string | null): string {
  const upTo = amount === null ? "" : `, up to ${amount}`;
  const refund = amount ?? "the disputed amount";
  switch (action) {
    case "send_message":
      return "Your message goes to the buyer in PayPal's Resolution Center. The case stays open.";
    case "make_offer":
      return `PayPal shows the buyer your refund offer${upTo}. If the buyer accepts, PayPal refunds it and closes the case.`;
    case "accept_claim":
      return `PayPal refunds the buyer ${refund} from your PayPal account and closes the case in the buyer's favour. This cannot be undone.`;
    default:
      return ACTIONS[action] ?? `${plainCode(action)}: PactPal cannot do this yet.`;
  }
}

/**
 * What a PayPal action lets the seller do, in one plain sentence (wording approved by the owner,
 * 5c). One PactPal cannot do yet says it is coming in a later step.
 */
export function disputeActionWords(action: string): string {
  const known = ACTIONS[action];
  if (known === undefined) return `${plainCode(action)}: PactPal cannot do this yet.`;
  return WORKING.has(action) ? known : `${known} (coming in a later step)`;
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

/**
 * What PayPal changed in a dispute (a `DISPUTE_UPDATED` entry's `changes`), one phrase each:
 * "status now waiting for seller response", "respond-by date now <date>", "respond-by date
 * cleared". `date` writes a respond-by date (the page and emails write dates their own way).
 */
export function disputeChangeWords(changes: unknown, date: (iso: string) => string): string[] {
  if (typeof changes !== "object" || changes === null) return [];
  return Object.entries(changes as Record<string, unknown>).map(([name, change]) => {
    const to = typeof change === "object" && change !== null && "to" in change ? change.to : null;
    const label =
      name === "sellerDueAt"
        ? "respond-by date"
        : name === "paypalStage"
          ? "PayPal stage"
          : plainCode(name);
    if (typeof to !== "string") return `${label} cleared`;
    return `${label} now ${name === "sellerDueAt" ? date(to) : plainCode(to)}`;
  });
}
