import type { CouncilTask } from "@pactpal/council";
import { draftCouncilTask } from "./draft-task.js";
import type { RecordLine } from "./record.js";
import { readSummary, type PacketSummary } from "./summary-check.js";
import { buildSummaryMessages, summarySource, type ExhibitLine } from "./summary-prompt.js";

/** Room for the summary, the picks and the note, including the thinking some models do first. */
const SUMMARY_MAX_TOKENS = 5000;

/** What the voters are told the answers are, and what makes one better (version 2, approved by the owner, 5f-2). */
const RANK_SUMMARY =
  "Neutral summaries of what a dispute record shows about each part of a buyer's claim, document picks and a note for PayPal.";
const RANK_CRITERIA = [
  "Every summary sentence is true to the record entries it cites.",
  "The summary speaks to the claim's statements rather than retelling the whole record.",
  "The wording is neutral and does not decide who is right.",
  "The picks keep the documents that relate to a claim statement and each reason names it; the rest are left out.",
  "The note is clear, polite and short, and says nothing the summary does not.",
  "Nothing is invented.",
];

export type SummaryTask =
  | { ok: true; task: CouncilTask<PacketSummary> }
  | { ok: false; reason: "bad-marker" | "marker-in-text" };

/**
 * The council task for the packet summary (5f): the request (the comparison's rows, the record and
 * the documents in elements named with `marker`), the code checks every answer must pass before
 * the vote, and what voters are shown (exactly what the answering models saw).
 */
export function summaryCouncilTask(input: {
  comparison: readonly string[];
  record: readonly RecordLine[];
  exhibits: readonly ExhibitLine[];
  marker: string;
}): SummaryTask {
  const built = buildSummaryMessages(input);
  if (!built.ok) return { ok: false, reason: built.reason };
  const context = {
    record: input.record,
    exhibitIds: input.exhibits.map((e) => e.id),
    sourceText: [...input.comparison, ...input.record.map(({ text }) => text)].join("\n"),
  };
  return {
    ok: true,
    task: draftCouncilTask<PacketSummary>({
      messages: built.messages,
      maxTokens: SUMMARY_MAX_TOKENS,
      check: (outcome) => {
        const result = readSummary(outcome, context);
        return result.ok
          ? { ok: true, content: result.summary, validation: result.validation }
          : { ok: false, validation: result.validation };
      },
      rank: { summary: RANK_SUMMARY, criteria: RANK_CRITERIA, source: summarySource(input) },
    }),
  };
}
