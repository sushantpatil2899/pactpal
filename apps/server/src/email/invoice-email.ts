import type { EmailMessage } from "@pactpal/email";
import { SANDBOX_FOOTER, amountOf, stageOf, type StageFacts } from "./common.js";

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
  const amount = amountOf(facts);
  return {
    kind: "invoice",
    to: input.to,
    subject: `Invoice for "${facts.dealTitle}": ${stageOf(facts)}, ${facts.stageTitle} (${amount})`,
    text: [
      `${input.sellerName} sent you a PayPal invoice for ${stageOf(facts)} of "${facts.dealTitle}": ${facts.stageTitle}, ${amount}.`,
      "",
      ...(input.payUrl === undefined
        ? ["Log in to PayPal to view and pay it."]
        : ["View and pay it on PayPal:", input.payUrl]),
      "",
      "The invoice's note names the agreement you signed and its fingerprint. You pay PayPal directly; PactPal does not hold money.",
      "",
      SANDBOX_FOOTER,
    ].join("\n"),
    idempotencyKey: input.idempotencyKey,
  };
}
