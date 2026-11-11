import type { EmailMessage } from "@pactpal/email";
import { amountOf, stageOf, type StageFacts } from "./common.js";
import { emailFrom } from "./templates.js";

/**
 * The email telling the buyer a stage's PayPal invoice was sent, with PayPal's view-and-pay link
 * (wording approved by the owner, 4e). Sent only after the seller's own "Send to PayPal".
 */
export function invoiceEmail(input: {
  to: string;
  sellerName: string;
  facts: StageFacts;
  payUrl: string | undefined;
  idempotencyKey: string;
}): EmailMessage {
  const { facts } = input;
  return {
    kind: "invoice",
    to: input.to,
    ...emailFrom("invoice", {
      sellerName: input.sellerName,
      dealTitle: facts.dealTitle,
      stage: stageOf(facts),
      stageTitle: facts.stageTitle,
      amount: amountOf(facts),
      payUrl: input.payUrl ?? "",
    }),
    idempotencyKey: input.idempotencyKey,
  };
}
