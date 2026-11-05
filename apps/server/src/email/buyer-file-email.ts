import type { EmailMessage } from "@pactpal/email";
import { sizeWords } from "@pactpal/words";
import { SANDBOX_FOOTER, utcDateTime } from "./common.js";

/**
 * The email telling the seller the buyer added a file to the deal (wording approved by the
 * owner, 5b). A notice, not evidence: the file's own log entry is the record.
 */
export function buyerFileEmail(input: {
  to: string;
  dealTitle: string;
  filename: string;
  sizeBytes: number;
  addedAt: Date;
  idempotencyKey: string;
}): EmailMessage {
  const { dealTitle } = input;
  return {
    kind: "buyer-file",
    to: input.to,
    subject: `The buyer added a file: "${dealTitle}"`,
    text: [
      `The buyer added a file to "${dealTitle}" on ${utcDateTime(input.addedAt)} UTC: ${input.filename} (${sizeWords(input.sizeBytes)}).`,
      "",
      `It is saved with its fingerprint and recorded in this deal's evidence log as added by the buyer. Open the deal in PactPal to see it under "Files".`,
      "",
      SANDBOX_FOOTER,
    ].join("\n"),
    idempotencyKey: input.idempotencyKey,
  };
}
