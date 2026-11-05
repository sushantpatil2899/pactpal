import type { CouncilTask } from "@pactpal/council";
import type { AgreementLine } from "@pactpal/qa";
import { readAnalysis, type ClaimAnalysis } from "./check.js";
import type { ClaimText } from "./claim.js";
import { buildClaimMessages, claimSource, type PayPalOptions } from "./prompt.js";
import type { RecordLine } from "./record.js";

/** Room for the analysis, including the thinking some models do before they answer. */
const ANALYSIS_MAX_TOKENS = 5000;

/** What the voters are told the answers are, and what makes one better (approved by the owner, 5d). */
const RANK_SUMMARY =
  "Comparisons of a buyer's dispute claim with the signed agreement and the deal's record.";
const RANK_CRITERIA = [
  "The claim is split into its real statements, none missed and none invented.",
  "The cited agreement lines and record entries really speak to each statement.",
  '"No record covers this" is used only when nothing does.',
  "The wording is neutral and does not decide who is right.",
  "The suggested step fits what PayPal allows and what the record shows.",
];

export type ClaimTask =
  | { ok: true; task: CouncilTask<ClaimAnalysis> }
  | { ok: false; reason: "bad-marker" | "marker-in-text" };

/**
 * The council task for comparing a claim with the record: the request (claim, agreement, record
 * and PayPal's options in elements named with `marker`; hidden claim lines as placeholders), the
 * code checks every answer must pass before the vote, and what voters are shown (exactly what the
 * answering models saw).
 */
export function claimCouncilTask(input: {
  claim: ClaimText;
  agreement: readonly AgreementLine[];
  record: { lines: readonly RecordLine[]; cut: boolean };
  paypal: PayPalOptions;
  marker: string;
}): ClaimTask {
  const { claim, agreement, record, paypal, marker } = input;
  const view = {
    claim: claim.modelView,
    agreement,
    record: record.lines,
    recordCut: record.cut,
    paypal,
    marker,
  };
  const built = buildClaimMessages(view);
  if (!built.ok) return { ok: false, reason: built.reason };
  const context = {
    claim: claim.lines,
    hidden: claim.hidden,
    agreement,
    record: record.lines,
    paypal,
  };
  return {
    ok: true,
    task: {
      answerRequest: () => ({
        messages: built.messages,
        maxTokens: ANALYSIS_MAX_TOKENS,
        temperature: 0,
        reply: "json",
      }),
      check: (outcome) => {
        const result = readAnalysis(outcome, context);
        return result.ok
          ? { ok: true, content: result.analysis, validation: result.validation }
          : { ok: false, validation: result.validation };
      },
      rank: {
        summary: RANK_SUMMARY,
        criteria: RANK_CRITERIA,
        source: claimSource(view),
        render: (analysis) => JSON.stringify(analysis),
      },
    },
  };
}
