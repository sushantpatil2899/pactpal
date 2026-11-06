import { parseJsonReply, type ChatOutcome } from "@pactpal/ai";
import { z } from "zod";
import type { RecordLine } from "./record.js";
import {
  citations,
  coverageProblems,
  draftText,
  invalidReply,
  textProblems,
} from "./text-checks.js";

export const appealCheckSchema = z.object({
  items: z
    .array(
      z.object({
        id: draftText(120),
        answers: z.boolean(),
        // Models leave "why" empty or null for an item that adds nothing (5i live run).
        why: z
          .string()
          .trim()
          .max(400)
          .nullable()
          .default("")
          .transform((why) => why ?? ""),
        record: citations,
      }),
    )
    .min(1)
    .max(100),
  summary: draftText(600),
});

/** A model's appeal check after the checks: a judgement per new item and a short summary. */
export type AppealCheck = z.output<typeof appealCheckSchema>;

/** What an answer is checked against. */
export interface AppealContext {
  record: readonly RecordLine[];
  /** The ids of the new items; each must be judged once. */
  itemIds: readonly string[];
}

/**
 * Checks an appeal check against what the models were given: every new item judged exactly once
 * (and no other), cited record entries exist, and no judgement or summary has a link, legal or
 * outcome words, or an amount. The score is the share of citations found. Pure; error messages
 * never repeat the text.
 */
export function checkAppeal(value: unknown, context: AppealContext) {
  const parsed = appealCheckSchema.safeParse(value);
  if (!parsed.success) return invalidReply(["the reply is not in the expected shape"]);
  // An id copied with its line's words after it ("D1: receipt.pdf") is the item it starts with.
  const canonical = (id: string) =>
    context.itemIds.find((known) => id === known || id.startsWith(`${known}:`)) ?? id;
  const check = {
    ...parsed.data,
    items: parsed.data.items.map((item) => ({ ...item, id: canonical(item.id) })),
  };
  const numbers = new Set(context.record.map(({ n }) => n));
  const errors: string[] = [];
  const ids = check.items.map((item) => item.id);
  errors.push(...coverageProblems(ids, context.itemIds, "item", "judged"));
  let checked = 0;
  let found = 0;
  for (const item of check.items) {
    for (const n of item.record) {
      checked += 1;
      if (numbers.has(n)) found += 1;
      else errors.push(`item ${item.id}: record entry #${String(n)} is not in the record`);
    }
    if (item.answers && item.why === "") {
      errors.push(`item ${item.id}: speaks to the claim without saying why`);
    }
    errors.push(...textProblems(item.why, `item ${item.id}`, "none"));
  }
  errors.push(...textProblems(check.summary, "the summary", "none"));
  const validation = {
    valid: errors.length === 0,
    score: checked === 0 ? 1 : found / checked,
    errors,
  };
  return validation.valid
    ? { ok: true as const, content: check, validation }
    : { ok: false as const, validation };
}

/** Reads a model's outcome: a failed call or a reply that is not JSON is invalid, never thrown. */
export function readAppeal(outcome: ChatOutcome, context: AppealContext) {
  const parsed = parseJsonReply(outcome);
  if (!parsed.ok) return invalidReply([`no usable reply (${parsed.kind})`]);
  return checkAppeal(parsed.value, context);
}
