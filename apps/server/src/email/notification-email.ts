import type { EmailMessage, EmailTone } from "@pactpal/email";
import { emailFrom } from "./templates.js";

/** The tag and colour of each notice kind (7e); anything else reads as news. */
const NOTICE_LOOK: Readonly<Record<string, { tag: string; tone: EmailTone }>> = {
  message: { tag: "New message", tone: "info" },
  "review-requested": { tag: "Needs you", tone: "wait" },
  "changes-requested": { tag: "Needs you", tone: "wait" },
  signed: { tag: "Signed", tone: "ok" },
  step: { tag: "Needs you", tone: "wait" },
  "step-news": { tag: "Update", tone: "ok" },
  reminder: { tag: "Reminder", tone: "wait" },
  "agent-request": { tag: "Your approval", tone: "ai" },
};

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
  const look = NOTICE_LOOK[input.kind] ?? { tag: "Update", tone: "info" };
  return {
    kind: `notice-${input.kind}`,
    to: input.to,
    ...emailFrom("notice", {
      subject: input.subject,
      tag: look.tag,
      tone: look.tone,
      lines: input.lines,
      linkNote: input.linkNote ?? "Open the deal in PactPal:",
      link: input.link,
    }),
    idempotencyKey: input.idempotencyKey,
  };
}
