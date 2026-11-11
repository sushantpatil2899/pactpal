import type { EmailMessage } from "@pactpal/email";
import { sizeWords } from "@pactpal/words";
import { utcDateTime } from "./common.js";
import { emailFrom } from "./templates.js";

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
  return {
    kind: "buyer-file",
    to: input.to,
    ...emailFrom("buyer-file", {
      dealTitle: input.dealTitle,
      at: utcDateTime(input.addedAt),
      filename: input.filename,
      size: sizeWords(input.sizeBytes),
    }),
    idempotencyKey: input.idempotencyKey,
  };
}
