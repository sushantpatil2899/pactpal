import type { EmailMessage } from "@pactpal/email";
import type { ForwardReason } from "@pactpal/db";
import { utcDateTime } from "./common.js";
import { emailFrom } from "./templates.js";

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
  return {
    kind: "question-asked",
    to: input.to,
    ...emailFrom("question-asked", {
      dealTitle: input.dealTitle,
      version: input.version,
      at: utcDateTime(input.askedAt),
      question: input.question,
      reasonLine: REASON_LINES[input.reason],
    }),
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
  return {
    kind: "question-answered",
    to: input.to,
    ...emailFrom("question-answered", {
      sellerName: input.sellerName,
      dealTitle: input.dealTitle,
      at: utcDateTime(input.answeredAt),
      question: input.question,
      answer: input.answer,
      until: utcDateTime(input.linkExpiresAt),
      link: input.link,
    }),
    idempotencyKey: input.idempotencyKey,
  };
}
