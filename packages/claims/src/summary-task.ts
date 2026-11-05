import type { CouncilTask } from "@pactpal/council";
import type { RecordLine } from "./record.js";
import { readSummary, type PacketSummary } from "./summary-check.js";
import { buildSummaryMessages, summarySource, type ExhibitLine } from "./summary-prompt.js";

/** Room for the summary, the picks and the note, including the thinking some models do first. */
const SUMMARY_MAX_TOKENS = 5000;

/** What the voters are told the answers are, and what makes one better (approved by the owner, 5f). */
const RANK_SUMMARY = "Neutral summaries of a dispute record, document picks and a note for PayPal.";
const RANK_CRITERIA = [
  "Every summary sentence is true to the record entries it cites.",
  "The wording is neutral and does not decide who is right.",
  "The picks keep the documents that relate to the claim and leave out the rest.",
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
    task: {
      answerRequest: () => ({
        messages: built.messages,
        maxTokens: SUMMARY_MAX_TOKENS,
        temperature: 0,
        reply: "json",
      }),
      check: (outcome) => {
        const result = readSummary(outcome, context);
        return result.ok
          ? { ok: true, content: result.summary, validation: result.validation }
          : { ok: false, validation: result.validation };
      },
      rank: {
        summary: RANK_SUMMARY,
        criteria: RANK_CRITERIA,
        source: summarySource(input),
        render: (summary) => JSON.stringify(summary),
      },
    },
  };
}
