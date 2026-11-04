import type { EmailMessage } from "@pactpal/email";
import type { ForwardReason } from "@pactpal/db";
import { SANDBOX_FOOTER, utcDateTime } from "./common.js";

/** Why a question reached the seller, as their email says it. */
const REASON_LINES: Record<ForwardReason, string> = {
  "not-in-agreement": "The agreement does not answer it, so it was sent to you.",
  "quote-not-found":
    "The automatic answer could not be checked against the agreement, so it was sent to you.",
  "no-model": "No automatic answer was available, so it was sent to you.",
  "buyer-asked":
    "An automatic answer from the agreement's text was shown, and the buyer asked for your answer.",
};

/**
 * The email telling the seller a buyer's question needs their answer: the question and why it
 * came to them, never the automatic answer's text (wording approved by the owner, 4k-2).
 */
export function questionForSellerEmail(input: {
  to: string;
  dealTitle: string;
  version: number;
  question: string;
  askedAt: Date;
  reason: ForwardReason;
  idempotencyKey: string;
}): EmailMessage {
  const { dealTitle } = input;
  return {
    kind: "question-asked",
    to: input.to,
    subject: `Question from the buyer: "${dealTitle}"`,
    text: [
      `The buyer asked a question about "${dealTitle}" (version ${String(input.version)}) on ${utcDateTime(input.askedAt)} UTC:`,
      "",
      `"${input.question}"`,
      "",
      REASON_LINES[input.reason],
      "",
      `Open the deal in PactPal to answer it under "Questions from the buyer". The buyer sees your answer there, and it is recorded in this deal's evidence log.`,
      "",
      SANDBOX_FOOTER,
    ].join("\n"),
    idempotencyKey: input.idempotencyKey,
  };
}

/**
 * The email giving the buyer the seller's answer to their question, with a private link into the
 * deal; the answer does not change the agreement (wording approved by the owner, 4k-2).
 */
export function sellerAnswerEmail(input: {
  to: string;
  sellerName: string;
  dealTitle: string;
  question: string;
  answer: string;
  answeredAt: Date;
  link: string;
  linkExpiresAt: Date;
  idempotencyKey: string;
}): EmailMessage {
  const { sellerName, dealTitle } = input;
  return {
    kind: "question-answered",
    to: input.to,
    subject: `Answer from ${sellerName}: "${dealTitle}"`,
    text: [
      `${sellerName} answered your question about "${dealTitle}" on ${utcDateTime(input.answeredAt)} UTC.`,
      "",
      `Your question: "${input.question}"`,
      `Their answer: "${input.answer}"`,
      "",
      `The agreement itself is what you sign; this answer does not change it. Read it on the deal page (private link, works until ${utcDateTime(input.linkExpiresAt)} UTC, this deal only; please do not forward it):`,
      input.link,
      "",
      SANDBOX_FOOTER,
    ].join("\n"),
    idempotencyKey: input.idempotencyKey,
  };
}
