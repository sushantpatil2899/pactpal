import type { EmailMessage } from "@pactpal/email";
import { SANDBOX_FOOTER, stageOf, utcDateTime, type StageFacts } from "./common.js";

/**
 * The email telling the buyer that work was delivered for a stage, with a private link into the
 * deal (wording approved by the owner, 4f). Sent only after the seller's own "Send to the buyer".
 */
export function deliveryEmail(input: {
  to: string;
  sellerName: string;
  facts: StageFacts;
  fileCount: number;
  message: string | undefined;
  link: string;
  linkExpiresAt: Date;
  idempotencyKey: string;
}): EmailMessage {
  const { facts, sellerName } = input;
  const files = input.fileCount === 1 ? "1 file" : `${String(input.fileCount)} files`;
  return {
    kind: "delivery",
    to: input.to,
    subject: `Delivery for "${facts.dealTitle}": ${stageOf(facts)}, ${facts.stageTitle}`,
    text: [
      `${sellerName} delivered work for ${stageOf(facts)} of "${facts.dealTitle}" (${facts.stageTitle}): ${files}.`,
      ...(input.message === undefined
        ? []
        : ["", `Message from ${sellerName}: "${input.message}"`]),
      "",
      `Open the delivery (private link, works until ${utcDateTime(input.linkExpiresAt)} UTC, this deal only; please do not forward it):`,
      input.link,
      "",
      "PactPal records when you open the delivery and when you download each file, with the file's fingerprint. A typed name and an IP address are not proof of identity.",
      "",
      SANDBOX_FOOTER,
    ].join("\n"),
    idempotencyKey: input.idempotencyKey,
  };
}
