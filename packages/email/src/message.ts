import { z } from "zod";

/** A file sent with an email; the provider works out its type from the name. */
export const emailAttachmentSchema = z.object({
  filename: z.string().min(1).max(255),
  // Any Uint8Array (a Buffer included), whatever memory it sits on.
  bytes: z.custom<Uint8Array>((value) => value instanceof Uint8Array, "must be bytes"),
});

/** One email to one person. `kind` names the template, for logs; the rest is the email itself. */
export const emailMessageSchema = z.object({
  kind: z.string().min(1).max(64),
  to: z.email(),
  subject: z.string().min(1).max(300),
  text: z.string().min(1),
  /** The designed version (9h); mail apps that block designs show `text`. */
  html: z.string().min(1).optional(),
  /**
   * The same key sent twice within a day is treated as one email by the provider, so retries
   * and repeats after a crash never send twice. Up to 256 characters.
   */
  idempotencyKey: z.string().min(1).max(256).optional(),
  attachments: z.array(emailAttachmentSchema).max(5).optional(),
});
export type EmailMessage = z.input<typeof emailMessageSchema>;

/** Why an email was not sent. */
export type EmailFailure =
  /** No email service is set up (the stand-in), or its key is missing. */
  | "not_configured"
  /** The provider refused it (bad address, unverified sender, bad key). Repeating will not help. */
  | "rejected"
  /** Too many emails; try later. */
  | "rate_limited"
  /** No answer from the provider. */
  | "network"
  /** The provider failed or answered with something unreadable. */
  | "server";

/** What happened to one email. `detail` never holds the address, the text or a key. */
export type SendResult =
  { ok: true; id: string } | { ok: false; reason: EmailFailure; detail: string };

/** Sends email. The real service is Resend; the stand-in sends nothing. */
export interface EmailSender {
  /** False for the stand-in, so pages can say email is off instead of "failed". */
  readonly live: boolean;
  send(message: EmailMessage): Promise<SendResult>;
}
