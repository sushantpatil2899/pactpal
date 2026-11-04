import type { EmailMessage } from "@pactpal/email";
import { changeLines, type ChangeFacts } from "@pactpal/words";
import { SANDBOX_FOOTER, utcDateTime } from "./common.js";

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
  const { sellerName, dealTitle } = input;
  return {
    kind: "change-proposed",
    to: input.to,
    subject: `Change proposed: "${dealTitle}" (version ${String(input.version)})`,
    text: [
      `${sellerName} proposed a change to your agreement "${dealTitle}" on ${utcDateTime(input.proposedAt)} UTC.`,
      ...(input.message === undefined
        ? []
        : ["", `Message from ${sellerName}: "${input.message}"`]),
      "",
      "What changes:",
      ...changeLines(input.change, input.currency, input.stages).map((line) => `- ${line}`),
      "",
      `Nothing changes unless you agree. Read the full new agreement, then agree or decline (private link, works until ${utcDateTime(input.linkExpiresAt)} UTC, this deal only; please do not forward it):`,
      input.link,
      "",
      SANDBOX_FOOTER,
    ].join("\n"),
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
  const { dealTitle, answer } = input;
  const at = `on ${utcDateTime(input.answeredAt)} UTC`;
  const version = String(input.toVersion);
  const body =
    answer.kind === "accepted"
      ? [
          `${answer.typedName} agreed to your change to "${dealTitle}" ${at}. Version ${version} is now the signed agreement; its receipt comes in a separate email.`,
          ...(answer.addsStages
            ? ["", "You can send the invoice for the new payment stages from the deal page."]
            : []),
        ]
      : [
          `The buyer declined your change to "${dealTitle}" ${at}.`,
          ...(answer.reason === undefined ? [] : ["", `Their reason: "${answer.reason}"`]),
          "",
          `The signed agreement (version ${String(input.fromVersion)}) stays as it was. The decline is in this deal's evidence log.`,
        ];
  return {
    kind: answer.kind === "accepted" ? "change-accepted" : "change-declined",
    to: input.to,
    subject:
      answer.kind === "accepted"
        ? `Change accepted: "${dealTitle}" (now version ${version})`
        : `Change declined: "${dealTitle}" (version ${version})`,
    text: [...body, "", SANDBOX_FOOTER].join("\n"),
    idempotencyKey: input.idempotencyKey,
  };
}
