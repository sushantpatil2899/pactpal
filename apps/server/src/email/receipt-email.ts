import type { EmailMessage } from "@pactpal/email";
import { SANDBOX_FOOTER, utcDateTime } from "./common.js";

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
  const { dealTitle, version, signedAt } = input;
  const when = `${utcDateTime(signedAt)} UTC (version ${String(version)})`;
  const first =
    input.role === "buyer"
      ? `You signed the agreement "${dealTitle}" with ${input.sellerName} on ${when}.`
      : `${input.typedName} signed your agreement "${dealTitle}" on ${when}.`;
  return {
    kind: "receipt",
    to: input.to,
    subject: `Receipt: "${dealTitle}" was signed on PactPal`,
    text: [
      first,
      "",
      "The receipt is attached as a PDF. It lists every agreed term and the fingerprints that let anyone check the record has not changed.",
      "",
      `Receipt fingerprint (SHA-256): ${input.receipt.sha256}`,
      "",
      "A typed name and an IP address are not proof of identity.",
      SANDBOX_FOOTER,
    ].join("\n"),
    idempotencyKey: input.idempotencyKey,
    attachments: [{ filename: input.receipt.filename, bytes: input.receipt.bytes }],
  };
}
