import type { EmailMessage } from "@pactpal/email";
import { SANDBOX_FOOTER, amountOf, stageOf, utcDateTime, type StageFacts } from "./common.js";

/**
 * The email telling one side that PayPal confirmed a stage's payment (wording approved by the
 * owner, 4e). Only the first line differs between the buyer and the seller.
 */
export function paymentEmail(input: {
  to: string;
  role: "buyer" | "seller";
  facts: StageFacts;
  paidAt: Date;
  transactionId: string | undefined;
  idempotencyKey: string;
}): EmailMessage {
  const { facts } = input;
  const amount = amountOf(facts);
  const what = `${amount} for ${stageOf(facts)} of "${facts.dealTitle}" (${facts.stageTitle}) on ${utcDateTime(input.paidAt)} UTC.`;
  return {
    kind: "payment",
    to: input.to,
    subject: `Payment received: "${facts.dealTitle}", ${stageOf(facts)} (${amount})`,
    text: [
      input.role === "buyer"
        ? `PayPal confirmed your payment of ${what}`
        : `PayPal confirmed that the buyer paid ${what}`,
      "",
      ...(input.transactionId === undefined ? [] : [`PayPal transaction: ${input.transactionId}`]),
      "The payment is now in this deal's evidence log.",
      "",
      SANDBOX_FOOTER,
    ].join("\n"),
    idempotencyKey: input.idempotencyKey,
  };
}
