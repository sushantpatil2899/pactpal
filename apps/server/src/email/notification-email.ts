import type { EmailMessage } from "@pactpal/email";
import { SANDBOX_FOOTER } from "./common.js";

/**
 * A notice that something in the deal space needs the person (7e): a chat message while they
 * were away, the agreement sent for review, changes asked for, a signature, a timeline step or
 * a reminder. It never quotes a chat message: the person reads it in PactPal.
 */
export function notificationEmail(input: {
  kind: string;
  to: string;
  subject: string;
  lines: readonly string[];
  link: string;
  /** For the buyer's private link: when it stops working. */
  linkNote?: string;
  idempotencyKey: string;
}): EmailMessage {
  return {
    kind: `notice-${input.kind}`,
    to: input.to,
    subject: input.subject,
    text: [
      ...input.lines,
      "",
      input.linkNote ?? "Open the deal in PactPal:",
      input.link,
      "",
      SANDBOX_FOOTER,
    ].join("\n"),
    idempotencyKey: input.idempotencyKey,
  };
}
