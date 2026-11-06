import type { EmailMessage } from "@pactpal/email";
import {
  deadlineWords,
  disputeActionWords,
  disputeChangeWords,
  disputeReasonWords,
  plainCode,
} from "@pactpal/words";
import { SANDBOX_FOOTER, utcDateTime } from "./common.js";

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

const actionLines = (actions: readonly string[]) =>
  actions.length === 0 ? ["- nothing right now"] : actions.map((a) => `- ${disputeActionWords(a)}`);

const respondBy = (due: Date, now: Date) => `${utcDateTime(due)} UTC (${deadlineWords(due, now)})`;

const email = (
  facts: DisputeEmailFacts,
  kind: string,
  subject: string,
  lines: readonly string[],
): EmailMessage => ({
  kind,
  to: facts.to,
  subject,
  text: [...lines, "", SANDBOX_FOOTER].join("\n"),
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
  const about = facts.stage === null ? "" : ` about stage ${String(facts.stage)}`;
  const amount = facts.amount === null ? "" : ` (${facts.amount})`;
  return email(
    facts,
    "dispute-opened",
    facts.dueAt === null
      ? `PayPal dispute on "${facts.dealTitle}"`
      : `PayPal dispute on "${facts.dealTitle}": respond by ${utcDateTime(facts.dueAt)}`,
    [
      `The buyer opened a PayPal dispute${about} of "${facts.dealTitle}"${amount}.`,
      `Reason given to PayPal: ${facts.reason === null ? "not given" : disputeReasonWords(facts.reason)}.`,
      "PayPal lets you:",
      ...actionLines(facts.allowedActions),
      ...(facts.dueAt === null ? [] : [`Respond by ${respondBy(facts.dueAt, facts.now)}.`]),
      "",
      `Open the dispute in PactPal to see the claim against your record and the AI drafts: ${facts.link}`,
      "",
      "PactPal is a record-keeping tool and does not decide disputes.",
    ],
  );
}

/** PayPal changed the dispute's status, stage or respond-by date. */
export function disputeChangedEmail(facts: DisputeEmailFacts & { changes: unknown }): EmailMessage {
  const what = disputeChangeWords(facts.changes, (iso) => `${utcDateTime(new Date(iso))} UTC`);
  return email(facts, "dispute-changed", `PayPal changed the dispute on "${facts.dealTitle}"`, [
    `PayPal changed dispute ${facts.disputeId} on "${facts.dealTitle}": ${what.join("; ") || "details changed"}.`,
    "PayPal lets you now:",
    ...actionLines(facts.allowedActions),
    "",
    `Open the dispute in PactPal: ${facts.link}`,
  ]);
}

/** PayPal decided the dispute. */
export function disputeDecidedEmail(facts: DisputeEmailFacts & { outcome: string }): EmailMessage {
  return email(facts, "dispute-decided", `PayPal decided the dispute on "${facts.dealTitle}"`, [
    `PayPal decided dispute ${facts.disputeId} on "${facts.dealTitle}": ${plainCode(facts.outcome)}.`,
    ...(facts.outcome.includes("BUYER_FAVOUR")
      ? [
          "If PayPal allows an appeal, the appeal check on the dispute page lists what you hold that was not sent to PayPal before.",
        ]
      : []),
    "",
    `Open the dispute in PactPal: ${facts.link}`,
  ]);
}

/**
 * A deadline reminder, sent at 72, 24 or 6 hours (or less) before the respond-by date. The subject
 * says the time actually left: a dispute first seen with 30 hours left says so, not "72 hours".
 */
export function disputeReminderEmail(
  facts: DisputeEmailFacts & { dueAt: Date; now: Date },
): EmailMessage {
  const left = deadlineWords(facts.dueAt, facts.now);
  return email(
    facts,
    "dispute-reminder",
    `${left.charAt(0).toUpperCase()}${left.slice(1)} to answer the PayPal dispute on "${facts.dealTitle}"`,
    [
      `PayPal is waiting for your answer to dispute ${facts.disputeId} on "${facts.dealTitle}" until ${respondBy(facts.dueAt, facts.now)}.`,
      "PayPal lets you:",
      ...actionLines(facts.allowedActions),
      "After that date PayPal no longer waits for your answer.",
      "",
      `Open the dispute in PactPal: ${facts.link}`,
    ],
  );
}
