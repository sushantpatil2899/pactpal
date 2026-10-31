/** One email to send. `kind` names the template (for logs); the rest is the email itself. */
export interface EmailMessage {
  kind: string;
  to: string;
  subject: string;
  text: string;
}

/** Sends email. The real service (for example Resend or Postmark) is a later decision. */
export interface EmailSender {
  send(message: EmailMessage): Promise<void>;
}

/**
 * Stand-in until an email service is chosen: sends nothing and logs only the kind of email, never
 * the address or the text (which may hold a private link).
 */
export class StandInEmailSender implements EmailSender {
  constructor(private readonly log: { info(details: object, message: string): void }) {}

  send(message: EmailMessage): Promise<void> {
    this.log.info({ kind: message.kind }, "Email not sent: no email service yet");
    return Promise.resolve();
  }
}
