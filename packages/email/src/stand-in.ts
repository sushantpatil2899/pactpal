import type { EmailMessage, EmailSender, SendResult } from "./message.js";

/**
 * Used while no email service is set up: sends nothing and logs only the kind of email, never
 * the address or the text (which may hold a private link).
 */
export class StandInEmailSender implements EmailSender {
  readonly live = false;

  constructor(private readonly log: { info(details: object, message: string): void }) {}

  send(message: EmailMessage): Promise<SendResult> {
    this.log.info({ kind: message.kind }, "Email not sent: no email service yet");
    return Promise.resolve({ ok: false, reason: "not_configured", detail: "no email service" });
  }
}
