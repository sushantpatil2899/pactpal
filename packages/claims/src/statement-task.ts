import type { CouncilTask } from "@pactpal/council";
import { appealSource } from "./appeal-prompt.js";
import { draftCouncilTask } from "./draft-task.js";
import { readStatement, type AppealStatement } from "./statement-check.js";
import { buildStatementMessages } from "./statement-prompt.js";

/** Room for the statement and the note, with any thinking first. */
const STATEMENT_MAX_TOKENS = 5000;

/** What the voters are told the answers are, and what makes one better (approved by the owner, 5i-2). */
const RANK_SUMMARY =
  "Neutral appeal statements explaining what new evidence shows about a buyer's claim, with a note for PayPal.";
const RANK_CRITERIA = [
  "Every sentence is true to the record entries it cites.",
  "The statement explains what the new evidence adds, not the whole case again.",
  "The wording is neutral and predicts nothing.",
  "The note is clear, polite and short, and says nothing the statement does not.",
  "Nothing is invented.",
];

export type StatementTask =
  | { ok: true; task: CouncilTask<AppealStatement> }
  | { ok: false; reason: "bad-marker" | "marker-in-text" };

/**
 * The council task for the appeal statement (5i-2): the same source as the appeal check, with
 * the new items the check found speaking to the claim (and why), the code checks every answer
 * must pass before the vote, and what voters are shown.
 */
export function statementCouncilTask(input: Parameters<typeof appealSource>[0]): StatementTask {
  const built = buildStatementMessages(input);
  if (!built.ok) return { ok: false, reason: built.reason };
  const context = {
    record: input.record,
    sourceText: [...input.record.map(({ text }) => text), ...input.items.map((i) => i.words)].join(
      "\n",
    ),
  };
  return {
    ok: true,
    task: draftCouncilTask<AppealStatement>({
      messages: built.messages,
      maxTokens: STATEMENT_MAX_TOKENS,
      check: (outcome) => readStatement(outcome, context),
      rank: { summary: RANK_SUMMARY, criteria: RANK_CRITERIA, source: appealSource(input) },
    }),
  };
}
