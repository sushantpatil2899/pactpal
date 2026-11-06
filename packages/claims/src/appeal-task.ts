import type { CouncilTask } from "@pactpal/council";
import { readAppeal, type AppealCheck } from "./appeal-check.js";
import { appealSource, buildAppealMessages } from "./appeal-prompt.js";
import { draftCouncilTask } from "./draft-task.js";

/** Room for a judgement per item and the summary, with any thinking first. */
const APPEAL_MAX_TOKENS = 6000;

/** What the voters are told the answers are, and what makes one better (approved by the owner, 5i). */
const RANK_SUMMARY =
  "Neutral judgements of whether evidence not sent before speaks to a buyer's claim that PayPal decided for the buyer.";
const RANK_CRITERIA = [
  "Each judgement is true to the item and to the claim.",
  "An item is marked as speaking to the claim only if it adds something the evidence already sent did not.",
  "The wording is neutral and predicts nothing.",
  "The summary says plainly when nothing new speaks to the claim.",
  "Nothing is invented.",
];

export type AppealTask =
  | { ok: true; task: CouncilTask<AppealCheck> }
  | { ok: false; reason: "bad-marker" | "marker-in-text" };

/**
 * The council task for the appeal check (5i): the request (the claim, PayPal's decision, what was
 * sent, the record and the new items, in elements named with `marker`), the code checks every
 * answer must pass before the vote, and what voters are shown.
 */
export function appealCouncilTask(input: Parameters<typeof appealSource>[0]): AppealTask {
  const built = buildAppealMessages(input);
  if (!built.ok) return { ok: false, reason: built.reason };
  const context = { record: input.record, itemIds: input.items.map((item) => item.id) };
  return {
    ok: true,
    task: draftCouncilTask<AppealCheck>({
      messages: built.messages,
      maxTokens: APPEAL_MAX_TOKENS,
      check: (outcome) => readAppeal(outcome, context),
      rank: { summary: RANK_SUMMARY, criteria: RANK_CRITERIA, source: appealSource(input) },
    }),
  };
}
