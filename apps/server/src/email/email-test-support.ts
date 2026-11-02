import type { EmailMessage, EmailSender } from "@pactpal/email";

/**
 * Test code only: a "live" email sender that keeps every email it accepts in `sent`; addresses in
 * `failTo` fail as if the email service answered 500.
 */
export function capturingEmail(failTo: Iterable<string> = []) {
  const sent: EmailMessage[] = [];
  const failEmailTo = new Set(failTo);
  const email: EmailSender = {
    live: true,
    send: (message) => {
      if (failEmailTo.has(message.to)) {
        return Promise.resolve({ ok: false, reason: "server", detail: "Resend answered 500" });
      }
      sent.push(message);
      return Promise.resolve({ ok: true, id: `msg_${String(sent.length)}` });
    },
  };
  return { email, sent, failEmailTo };
}
