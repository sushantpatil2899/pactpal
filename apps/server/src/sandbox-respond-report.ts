import type {
  DisputeAction,
  DisputeAnswer,
  DisputeDetails,
  MinorAmount,
  PayPalResult,
} from "@pactpal/paypal";
import { z } from "zod";
import {
  AMOUNT_OPTIONS,
  amountOption,
  disputeIdOption,
  readChecked,
  type Checked,
} from "./cli-args.js";
import { describeRoute, formatAmount, rows } from "./format.js";

/** The one answer to send, as given on the command line. */
export type PlannedAnswer =
  | { kind: "evidence"; evidenceType: string; files: string[] }
  | { kind: "offer"; offerType: string; amount: MinorAmount }
  | { kind: "accept"; refundAmount: MinorAmount | undefined }
  | { kind: "appeal"; files: string[] };

export interface RespondArgs {
  id: string;
  answer: PlannedAnswer;
  note: string;
  /** False means a dry run: show what would be sent and send nothing. */
  send: boolean;
}

export const USAGE =
  "Usage: pnpm sandbox:respond --id <dispute id> --note <text> " +
  "(--evidence <TYPE> [--file <path>]... | --offer <TYPE> --amount <decimal> | " +
  "--accept [--amount <decimal>] | --appeal [--file <path>]...) [--currency USD] [--send]";

/** PayPal's action name for each answer, as it appears in the dispute's links. */
export const ACTION_OF: Record<PlannedAnswer["kind"], DisputeAction> = {
  evidence: "provide_evidence",
  offer: "make_offer",
  accept: "accept_claim",
  appeal: "appeal",
};

const argsSchema = z.object({
  id: z.string("--id is required").pipe(disputeIdOption),
  note: z.string("--note is required").min(1, "--note is required"),
  evidence: z.string().min(1).optional(),
  offer: z.string().min(1).optional(),
  accept: z.boolean().default(false),
  appeal: z.boolean().default(false),
  file: z.array(z.string().min(1)).default([]),
  amount: z.string().optional(),
  currency: z.string().default("USD"),
  send: z.boolean().default(false),
});

type Values = z.output<typeof argsSchema>;

function plan(values: Values): Checked<PlannedAnswer> {
  const chosen = [
    values.evidence !== undefined && "--evidence",
    values.offer !== undefined && "--offer",
    values.accept && "--accept",
    values.appeal && "--appeal",
  ].filter((flag) => flag !== false);
  if (chosen.length !== 1) {
    return { ok: false, error: "give exactly one of --evidence, --offer, --accept or --appeal" };
  }
  const takesFiles = values.evidence !== undefined || values.appeal;
  if (!takesFiles && values.file.length > 0) {
    return { ok: false, error: "--file is only used with --evidence or --appeal" };
  }
  const takesAmount = values.offer !== undefined || values.accept;
  if (!takesAmount && values.amount !== undefined) {
    return { ok: false, error: "--amount is only used with --offer or --accept" };
  }
  const amount =
    values.amount === undefined ? undefined : amountOption(values.amount, values.currency);
  if (amount?.ok === false) return amount;

  if (values.evidence !== undefined) {
    return {
      ok: true,
      value: { kind: "evidence", evidenceType: values.evidence, files: values.file },
    };
  }
  if (values.offer !== undefined) {
    if (amount === undefined) return { ok: false, error: "--offer needs --amount" };
    return { ok: true, value: { kind: "offer", offerType: values.offer, amount: amount.value } };
  }
  if (values.accept) return { ok: true, value: { kind: "accept", refundAmount: amount?.value } };
  return { ok: true, value: { kind: "appeal", files: values.file } };
}

/** Reads and checks the command line; exactly one answer must be chosen. */
export function parseRespondArgs(argv: readonly string[]): Checked<RespondArgs> {
  const parsed = readChecked(
    argv,
    {
      id: { type: "string" },
      note: { type: "string" },
      evidence: { type: "string" },
      offer: { type: "string" },
      accept: { type: "boolean" },
      appeal: { type: "boolean" },
      file: { type: "string", multiple: true },
      send: { type: "boolean" },
      ...AMOUNT_OPTIONS,
    },
    argsSchema,
  );
  if (!parsed.ok) return parsed;
  const values = parsed.value;
  const answer = plan(values);
  if (!answer.ok) return answer;
  return {
    ok: true,
    value: {
      id: values.id,
      note: values.note,
      answer: answer.value,
      send: values.send,
    },
  };
}

function describeAnswer(answer: PlannedAnswer): string {
  switch (answer.kind) {
    case "evidence":
      return `evidence ${answer.evidenceType}, files: ${answer.files.join(", ") || "none"}`;
    case "offer":
      return `offer ${answer.offerType} of ${formatAmount(answer.amount)}`;
    case "accept":
      return answer.refundAmount === undefined
        ? "accept the claim with a full refund"
        : `accept the claim with a refund of ${formatAmount(answer.refundAmount)}`;
    case "appeal":
      return `appeal, files: ${answer.files.join(", ") || "none"}`;
  }
}

/** Whether PayPal allows this answer on the dispute right now, and if not, why. */
export function allowedNow(args: RespondArgs, dispute: DisputeDetails): string {
  const action = ACTION_OF[args.answer.kind];
  if (!dispute.allowedActions.includes(action)) return `no: PayPal does not allow ${action} now`;
  if (args.answer.kind === "offer" && !dispute.allowedOfferTypes.includes(args.answer.offerType)) {
    return `no: offer type ${args.answer.offerType} is not allowed now`;
  }
  return "yes";
}

/** What would be sent, and whether PayPal allows it now. */
export function formatPlan(args: RespondArgs, dispute: DisputeDetails): string {
  const list = (items: string[]) => (items.length === 0 ? "none" : items.join(", "));
  return (
    `Dispute ${dispute.disputeId}\n` +
    rows([
      ["Status", dispute.status],
      ["Seller due by", dispute.sellerResponseDueDate ?? "-"],
      ["Allowed actions", list(dispute.allowedActions)],
      ["Offer types", list(dispute.allowedOfferTypes)],
      ["Answer", describeAnswer(args.answer)],
      ["Note", args.note],
      ["Allowed now", allowedNow(args, dispute)],
    ]) +
    (args.send ? "" : "Dry run: nothing was sent. Add --send to send it.\n")
  );
}

/** PayPal's acceptance of the answer. */
export function formatSent(args: RespondArgs, result: PayPalResult<DisputeAnswer>): string {
  const debug = result.debugId === undefined ? "" : `, debug id ${result.debugId}`;
  return `Sent ${ACTION_OF[args.answer.kind]} to ${result.data.disputeId} via ${describeRoute(result)}${debug}\n`;
}
