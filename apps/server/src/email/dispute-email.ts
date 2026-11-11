import type { EmailMessage, EmailView } from "@pactpal/email";
import {
  deadlineWords,
  disputeActionWords,
  disputeChangeWords,
  disputeReasonWords,
  plainCode,
} from "@pactpal/words";
import { utcDateTime } from "./common.js";
import { emailFrom } from "./templates.js";

/** What every dispute email says about the dispute (5j; wording approved by the owner). */
export interface DisputeEmailFacts {
  to: string;
  dealTitle: string;
  disputeId: string;
  /** The dispute page in PactPal. */
  link: string;
  /** What PayPal lets the seller do now (its action codes). */
  allowedActions: readonly string[];
  idempotencyKey: string;
}

const respondBy = (due: Date, now: Date) => `${utcDateTime(due)} UTC (${deadlineWords(due, now)})`;

/** One dispute email: the facts every one of them shares, plus the kind's own values. */
const email = (facts: DisputeEmailFacts, kind: string, view: EmailView): EmailMessage => ({
  kind,
  to: facts.to,
  ...emailFrom(kind, {
    dealTitle: facts.dealTitle,
    disputeId: facts.disputeId,
    link: facts.link,
    actions:
      facts.allowedActions.length === 0
        ? ["nothing right now"]
        : facts.allowedActions.map(disputeActionWords),
    ...view,
  }),
  idempotencyKey: facts.idempotencyKey,
});

/** A new dispute on one of the seller's deals. */
export function disputeOpenedEmail(
  facts: DisputeEmailFacts & {
    stage: number | null;
    amount: string | null;
    reason: string | null;
    dueAt: Date | null;
    now: Date;
  },
): EmailMessage {
  return email(facts, "dispute-opened", {
    about: facts.stage === null ? "" : ` about stage ${String(facts.stage)}`,
    amount: facts.amount === null ? "" : ` (${facts.amount})`,
    amountText: facts.amount ?? "",
    reason: facts.reason === null ? "not given" : disputeReasonWords(facts.reason),
    dueShort: facts.dueAt === null ? "" : utcDateTime(facts.dueAt),
    respondBy: facts.dueAt === null ? "" : respondBy(facts.dueAt, facts.now),
  });
}

/** PayPal changed the dispute's status, stage or respond-by date. */
export function disputeChangedEmail(facts: DisputeEmailFacts & { changes: unknown }): EmailMessage {
  const what = disputeChangeWords(facts.changes, (iso) => `${utcDateTime(new Date(iso))} UTC`);
  return email(facts, "dispute-changed", { what: what.join("; ") || "details changed" });
}

/** PayPal decided the dispute. */
export function disputeDecidedEmail(facts: DisputeEmailFacts & { outcome: string }): EmailMessage {
  return email(facts, "dispute-decided", {
    outcome: plainCode(facts.outcome),
    buyerFavour: facts.outcome.includes("BUYER_FAVOUR"),
  });
}

/**
 * A deadline reminder, sent at 72, 24 or 6 hours (or less) before the respond-by date. The subject
 * says the time actually left: a dispute first seen with 30 hours left says so, not "72 hours".
 */
export function disputeReminderEmail(
  facts: DisputeEmailFacts & { dueAt: Date; now: Date },
): EmailMessage {
  const left = deadlineWords(facts.dueAt, facts.now);
  return email(facts, "dispute-reminder", {
    leftTitle: `${left.charAt(0).toUpperCase()}${left.slice(1)}`,
    respondBy: respondBy(facts.dueAt, facts.now),
  });
}
