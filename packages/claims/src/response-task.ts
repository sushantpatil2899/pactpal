import type { CouncilTask } from "@pactpal/council";
import type { SourceLine } from "@pactpal/scope-draft";
import { draftCouncilTask } from "./draft-task.js";
import type { RecordLine } from "./record.js";
import { readResponse, type ResponseDraft } from "./response-check.js";
import { buildResponseMessages, responseSource, type OptionLine } from "./response-prompt.js";

/** Room for the message, the option notes and the offer note, with any thinking first. */
const RESPONSE_MAX_TOKENS = 5000;

/** What the voters are told the answers are, and what makes one better (approved by the owner, 5h). */
const RANK_SUMMARY =
  "Neutral drafts that help a seller answer a buyer's dispute: a message, how each option relates to the case, and an offer note.";
const RANK_CRITERIA = [
  "The message is polite, neutral and true to the record.",
  "The message promises nothing and names no amount.",
  "Each option's sentences are accurate about this case and cite the right entries.",
  "No option is pushed over another.",
  "The offer note is short and polite.",
  "Nothing is invented.",
];

export type ResponseTask =
  | { ok: true; task: CouncilTask<ResponseDraft> }
  | { ok: false; reason: "bad-marker" | "marker-in-text" };

/**
 * The council task for answer help (5h): the request (the buyer's claim, the comparison's rows,
 * the record and the options PayPal allows, in elements named with `marker`), the code checks
 * every answer must pass before the vote, and what voters are shown.
 */
export function responseCouncilTask(input: {
  claim: readonly SourceLine[];
  comparison: readonly string[];
  record: readonly RecordLine[];
  options: readonly OptionLine[];
  marker: string;
}): ResponseTask {
  const built = buildResponseMessages(input);
  if (!built.ok) return { ok: false, reason: built.reason };
  const context = {
    record: input.record,
    optionCodes: input.options.map((o) => o.code),
    optionText: input.options.map((o) => o.words).join("\n"),
  };
  return {
    ok: true,
    task: draftCouncilTask<ResponseDraft>({
      messages: built.messages,
      maxTokens: RESPONSE_MAX_TOKENS,
      check: (outcome) => readResponse(outcome, context),
      rank: { summary: RANK_SUMMARY, criteria: RANK_CRITERIA, source: responseSource(input) },
    }),
  };
}
