/** Sending email: the `EmailSender` port, the Resend adapter and a stand-in that sends nothing. */
export { emailAttachmentSchema, emailMessageSchema } from "./message.js";
export type { EmailFailure, EmailMessage, EmailSender, SendResult } from "./message.js";
export { EMAIL_RETRY_POLICY, RESEND_EMAILS_URL, ResendEmailSender } from "./resend.js";
export type { ResendOptions } from "./resend.js";
export { StandInEmailSender } from "./stand-in.js";
