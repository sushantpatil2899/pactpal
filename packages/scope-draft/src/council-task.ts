import { schemaEnforced } from "@pactpal/ai";
import type { CouncilTask } from "@pactpal/council";
import { buildScopeDraftMessages, renderChat, type ScopeDraftPromptInput } from "./prompt.js";
import type { ScopeDraft } from "./schema.js";
import { readScopeDraft } from "./validate.js";
import { SCOPE_DRAFT_SCHEMA_NAME, scopeDraftWireSchema } from "./wire-schema.js";

/** Room for the draft, including the thinking some models do before they answer. */
const DRAFT_MAX_TOKENS = 6000;

/** What the voters are told the drafts are, and what makes one better (ranking prompt version 1). */
const RANK_SUMMARY =
  "The drafts record what a seller and a buyer agreed in a pasted chat: what is delivered, price, payment terms, dates, exclusions, vague wording and the kind of product.";
const RANK_CRITERIA = [
  "Completeness: the draft records every term the source states (price, payment terms, due date, number of revisions, what is delivered, what is excluded). Marking something missing when the source states it is a flaw.",
  "Accuracy: every recorded fact matches the source. Nothing is invented, guessed or taken from the wrong line. Something marked missing is only correct if the source really does not state it.",
  "Citations: each citation points to the line where the fact is stated and quotes it.",
  "Vague wording: the draft flags phrases that two people could understand differently, and its suggested rewrites could be checked and are not presented as already agreed.",
  "Category: the draft names the right kind of product or service.",
];

export type ScopeDraftTask =
  | { ok: true; task: CouncilTask<ScopeDraft> }
  | { ok: false; reason: "bad-marker" | "marker-in-chat" };

/**
 * The council task for drafting a scope from a pasted chat: the drafting request from the
 * drafting prompt (with the schema in the prompt only for models whose host does not enforce
 * it), the citation checker, and what voters are shown. `input.marker` wraps the chat in the
 * drafting prompt and is refused if the chat already contains it.
 */
export function scopeDraftCouncilTask(
  input: Omit<ScopeDraftPromptInput, "replySchema"> & { categoryIds: readonly string[] },
): ScopeDraftTask {
  const { categoryIds, ...promptInput } = input;
  const schema = scopeDraftWireSchema();
  const enforced = buildScopeDraftMessages(promptInput);
  const described = buildScopeDraftMessages({ ...promptInput, replySchema: schema });
  if (!enforced.ok) return { ok: false, reason: enforced.reason };
  if (!described.ok) return { ok: false, reason: described.reason };
  const context = {
    lines: input.lines,
    categoryIds,
    dealCurrency: input.dealCurrency,
  };
  return {
    ok: true,
    task: {
      answerRequest: (spec) => ({
        messages: schemaEnforced(spec) ? enforced.messages : described.messages,
        maxTokens: DRAFT_MAX_TOKENS,
        reply: { name: SCOPE_DRAFT_SCHEMA_NAME, schema },
      }),
      check: (outcome) => {
        const result = readScopeDraft(outcome, context);
        return result.ok
          ? { ok: true, content: result.draft, validation: result.validation }
          : { ok: false, validation: result.validation };
      },
      rank: {
        summary: RANK_SUMMARY,
        criteria: RANK_CRITERIA,
        source: renderChat(input.lines),
        render: (draft) => JSON.stringify(draft),
      },
    },
  };
}
