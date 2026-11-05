/**
 * Email: sending (the `EmailSender` port, the Resend adapter and a stand-in that sends nothing)
 * and reading received email with its webhook signature check (4p-2).
 */
export { emailAttachmentSchema, emailMessageSchema } from "./message.js";
export type { EmailFailure, EmailMessage, EmailSender, SendResult } from "./message.js";
export {
  EMAIL_RETRY_POLICY,
  RESEND_EMAILS_URL,
  ResendEmailSender,
  isReservedTestAddress,
} from "./resend.js";
export type { ResendOptions } from "./resend.js";
export { StandInEmailSender } from "./stand-in.js";
export {
  RESEND_RECEIVED_URL,
  ResendReceivedEmails,
  WEBHOOK_TOLERANCE_SECONDS,
  bareAddress,
  verifyWebhookSignature,
} from "./received.js";
export type { ReadResult, ReceivedEmail, ReceivedEmails, SenderChecks } from "./received.js";
export { htmlToText } from "./html-text.js";
