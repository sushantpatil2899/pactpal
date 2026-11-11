import type { EmailMessage } from "@pactpal/email";
import { utcDateTime } from "./common.js";
import { emailFrom } from "./templates.js";

export interface ReceiptEmailInput {
  to: string;
  /** Who it is for: the first line differs. */
  role: "buyer" | "seller";
  dealTitle: string;
  sellerName: string;
  typedName: string;
  signedAt: Date;
  version: number;
  receipt: { filename: string; bytes: Uint8Array; sha256: string };
  /** The provider treats a repeat of this key as the same email. */
  idempotencyKey: string;
}

/** The email that sends one side the signed receipt (wording approved by the owner, 4c). */
export function receiptEmail(input: ReceiptEmailInput): EmailMessage {
  return {
    kind: "receipt",
    to: input.to,
    ...emailFrom("receipt", {
      buyer: input.role === "buyer",
      dealTitle: input.dealTitle,
      sellerName: input.sellerName,
      typedName: input.typedName,
      when: `${utcDateTime(input.signedAt)} UTC (version ${String(input.version)})`,
      sha256: input.receipt.sha256,
    }),
    idempotencyKey: input.idempotencyKey,
    attachments: [{ filename: input.receipt.filename, bytes: input.receipt.bytes }],
  };
}
