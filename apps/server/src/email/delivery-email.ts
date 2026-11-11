import type { EmailMessage } from "@pactpal/email";
import { stageOf, utcDateTime, type StageFacts } from "./common.js";
import { emailFrom } from "./templates.js";

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
  const { facts } = input;
  return {
    kind: "delivery",
    to: input.to,
    ...emailFrom("delivery", {
      sellerName: input.sellerName,
      dealTitle: facts.dealTitle,
      stage: stageOf(facts),
      stageTitle: facts.stageTitle,
      files: input.fileCount === 1 ? "1 file" : `${String(input.fileCount)} files`,
      message: input.message,
      until: utcDateTime(input.linkExpiresAt),
      link: input.link,
    }),
    idempotencyKey: input.idempotencyKey,
  };
}
