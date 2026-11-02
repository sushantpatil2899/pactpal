import type { EmailMessage } from "@pactpal/email";
import { SANDBOX_FOOTER, stageOf, utcDateTime, type StageFacts } from "./common.js";

/** The buyer's answer, as the seller's email needs it. */
export type AnswerFacts =
  | { kind: "approved"; completesDeal: boolean }
  | { kind: "changes"; request: string; revision: number; revisionsIncluded: number | undefined };

/** Where a change request stands against the revisions in the agreement. */
function revisionLine(answer: Extract<AnswerFacts, { kind: "changes" }>): string {
  const { revision, revisionsIncluded } = answer;
  if (revisionsIncluded === undefined) return "The agreement states no revision limit.";
  return revision > revisionsIncluded
    ? `This is beyond the ${String(revisionsIncluded)} revisions included in the agreement; it may be extra work.`
    : `This is revision ${String(revision)} of the ${String(revisionsIncluded)} included in the agreement.`;
}

/**
 * The email telling the seller how the buyer answered a delivery: approved, or changes requested
 * with the revision count (wording approved by the owner, 4g).
 */
export function answerEmail(input: {
  to: string;
  facts: StageFacts;
  answer: AnswerFacts;
  answeredAt: Date;
  idempotencyKey: string;
}): EmailMessage {
  const { facts, answer } = input;
  const which = `${stageOf(facts)} of "${facts.dealTitle}" (${facts.stageTitle}) on ${utcDateTime(input.answeredAt)} UTC.`;
  const about = `"${facts.dealTitle}", ${stageOf(facts)} (${facts.stageTitle})`;
  const body =
    answer.kind === "approved"
      ? [
          `The buyer approved your delivery for ${which}`,
          ...(answer.completesDeal ? ["Every stage of the agreement is now approved."] : []),
          "",
          "The approval is in this deal's evidence log.",
        ]
      : [
          `The buyer asked for changes to your delivery for ${which}`,
          revisionLine(answer),
          "",
          `Their request: "${answer.request}"`,
          "",
          "Open the deal in PactPal to deliver again.",
        ];
  return {
    kind: answer.kind === "approved" ? "approved" : "changes",
    to: input.to,
    subject: `${answer.kind === "approved" ? "Approved" : "Changes requested"}: ${about}`,
    text: [...body, "", SANDBOX_FOOTER].join("\n"),
    idempotencyKey: input.idempotencyKey,
  };
}
