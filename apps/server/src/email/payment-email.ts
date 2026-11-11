import type { EmailMessage } from "@pactpal/email";
import { amountOf, stageOf, utcDateTime, type StageFacts } from "./common.js";
import { emailFrom } from "./templates.js";

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
  return {
    kind: "payment",
    to: input.to,
    ...emailFrom("payment", {
      buyer: input.role === "buyer",
      dealTitle: facts.dealTitle,
      stage: stageOf(facts),
      stageTitle: facts.stageTitle,
      amount,
      what: `${amount} for ${stageOf(facts)} of "${facts.dealTitle}" (${facts.stageTitle}) on ${utcDateTime(input.paidAt)} UTC.`,
      transactionId: input.transactionId ?? "",
    }),
    idempotencyKey: input.idempotencyKey,
  };
}
