import type { EmailMessage } from "@pactpal/email";
import { utcDateTime } from "./common.js";
import { emailFrom } from "./templates.js";

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
    ...emailFrom("intake-created", {
      dealTitle: input.dealTitle,
      at: utcDateTime(input.forwardedAt),
      link: input.link,
    }),
    idempotencyKey: input.idempotencyKey,
  };
}
