import { parseJsonReply, type ChatOutcome } from "@pactpal/ai";
import { z } from "zod";
import type { RecordLine } from "./record.js";
import { MAX_APPEAL_NOTE_CHARS } from "./statement-prompt.js";
import { citations, draftText, invalidReply, textProblems } from "./text-checks.js";

export const appealStatementSchema = z.object({
  statement: z
    .array(z.object({ text: draftText(400), record: citations }))
    .min(2)
    .max(6),
  note: draftText(MAX_APPEAL_NOTE_CHARS),
});

/** A model's appeal statement and note after the checks: a draft for the seller. */
export type AppealStatement = z.output<typeof appealStatementSchema>;

/** What an answer is checked against. */
export interface StatementContext {
  record: readonly RecordLine[];
  /** The record's and the new items' own text: amounts named must appear here. */
  sourceText: string;
}

/**
 * Checks an appeal statement: at least one sentence cites record entries, every cited entry
 * exists, and no sentence or note has a link, legal or outcome words, or an amount the source
 * does not hold. The score is the share of citations found. Pure; error messages never repeat
 * the text.
 */
export function checkStatement(value: unknown, context: StatementContext) {
  const parsed = appealStatementSchema.safeParse(value);
  if (!parsed.success) return invalidReply(["the reply is not in the expected shape"]);
  const draft = parsed.data;
  const numbers = new Set(context.record.map(({ n }) => n));
  const known = { known: context.sourceText };
  const errors: string[] = [];
  if (draft.statement.every((sentence) => sentence.record.length === 0)) {
    errors.push("no sentence cites a record entry");
  }
  let checked = 0;
  let found = 0;
  draft.statement.forEach((sentence, i) => {
    const what = `sentence ${String(i + 1)}`;
    for (const n of sentence.record) {
      checked += 1;
      if (numbers.has(n)) found += 1;
      else errors.push(`${what}: record entry #${String(n)} is not in the record`);
    }
    errors.push(...textProblems(sentence.text, what, known));
  });
  errors.push(...textProblems(draft.note, "the note", known));
  const validation = {
    valid: errors.length === 0,
    score: checked === 0 ? 0 : found / checked,
    errors,
  };
  return validation.valid
    ? { ok: true as const, content: draft, validation }
    : { ok: false as const, validation };
}

/** Reads a model's outcome: a failed call or a reply that is not JSON is invalid, never thrown. */
export function readStatement(outcome: ChatOutcome, context: StatementContext) {
  const parsed = parseJsonReply(outcome);
  if (!parsed.ok) return invalidReply([`no usable reply (${parsed.kind})`]);
  return checkStatement(parsed.value, context);
}
