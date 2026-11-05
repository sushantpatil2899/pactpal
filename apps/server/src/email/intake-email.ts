import type { EmailMessage } from "@pactpal/email";
import { SANDBOX_FOOTER, utcDateTime } from "./common.js";

/**
 * The email telling a seller their forwarded email became a draft deal (4p-2; wording approved
 * by the owner). Sent only to the seller's own address, never to an unknown sender.
 */
export function intakeEmail(input: {
  to: string;
  dealTitle: string;
  forwardedAt: Date;
  link: string;
  idempotencyKey: string;
}): EmailMessage {
  return {
    kind: "intake-created",
    to: input.to,
    subject: `Draft deal created: "${input.dealTitle}"`,
    text: [
      `PactPal made a draft deal from the email you forwarded on ${utcDateTime(input.forwardedAt)} UTC, with its text saved as the deal's chat.`,
      "",
      "Open it to check the text and draft the agreed work:",
      input.link,
      "",
      'Only emails from this address are accepted at your forwarding address. If you did not forward this, make a new address on "Your deals".',
      "",
      SANDBOX_FOOTER,
    ].join("\n"),
    idempotencyKey: input.idempotencyKey,
  };
}
