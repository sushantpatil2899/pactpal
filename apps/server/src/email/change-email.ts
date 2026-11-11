import type { EmailMessage } from "@pactpal/email";
import { changeLines, type ChangeFacts } from "@pactpal/words";
import { utcDateTime } from "./common.js";
import { emailFrom } from "./templates.js";

/**
 * The email telling the buyer the seller proposed a change, with what changes and a private
 * link into the deal (wording approved by the owner, 4j-2). Nothing changes unless they agree.
 */
export function changeProposedEmail(input: {
  to: string;
  sellerName: string;
  dealTitle: string;
  version: number;
  proposedAt: Date;
  message: string | undefined;
  change: ChangeFacts;
  currency: string;
  /** The new version's payment stages, which a matter of taste may name. */
  stages: readonly { title: string }[];
  link: string;
  linkExpiresAt: Date;
  idempotencyKey: string;
}): EmailMessage {
  return {
    kind: "change-proposed",
    to: input.to,
    ...emailFrom("change-proposed", {
      sellerName: input.sellerName,
      dealTitle: input.dealTitle,
      version: input.version,
      at: utcDateTime(input.proposedAt),
      message: input.message,
      changes: changeLines(input.change, input.currency, input.stages),
      until: utcDateTime(input.linkExpiresAt),
      link: input.link,
    }),
    idempotencyKey: input.idempotencyKey,
  };
}

/** How the buyer answered a change, as the seller's email needs it. */
export type ChangeAnswer =
  | { kind: "accepted"; typedName: string; addsStages: boolean }
  | { kind: "declined"; reason: string | undefined };

/**
 * The email telling the seller how the buyer answered their change: agreed (the new version is
 * signed) or declined, with the reason when given (wording approved by the owner, 4j-2).
 */
export function changeAnswerEmail(input: {
  to: string;
  dealTitle: string;
  fromVersion: number;
  toVersion: number;
  answer: ChangeAnswer;
  answeredAt: Date;
  idempotencyKey: string;
}): EmailMessage {
  const { answer } = input;
  const shared = {
    dealTitle: input.dealTitle,
    at: `on ${utcDateTime(input.answeredAt)} UTC`,
    version: input.toVersion,
  };
  const kind = answer.kind === "accepted" ? "change-accepted" : "change-declined";
  return {
    kind,
    to: input.to,
    ...(answer.kind === "accepted"
      ? emailFrom(kind, { ...shared, typedName: answer.typedName, addsStages: answer.addsStages })
      : emailFrom(kind, { ...shared, reason: answer.reason, fromVersion: input.fromVersion })),
    idempotencyKey: input.idempotencyKey,
  };
}
