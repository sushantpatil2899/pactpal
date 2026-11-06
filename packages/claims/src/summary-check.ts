import { parseJsonReply, type ChatOutcome } from "@pactpal/ai";
import type { Validation } from "@pactpal/council";
import { z } from "zod";
import { MAX_NOTE_CHARS } from "./summary-prompt.js";
import type { RecordLine } from "./record.js";
import { textProblems } from "./text-checks.js";

const text = (max: number) => z.string().trim().min(1).max(max);

export const packetSummarySchema = z.object({
  summary: z
    .array(z.object({ text: text(400), record: z.array(z.number().int().min(1)).max(12) }))
    .min(2)
    .max(8),
  exhibits: z
    .array(
      z.object({ id: text(100), use: z.boolean(), why: z.string().trim().max(300).default("") }),
    )
    .max(100),
  note: text(MAX_NOTE_CHARS),
});

/** A model's summary, document picks and note, after the checks: a draft for the seller. */
export type PacketSummary = z.output<typeof packetSummarySchema>;

/** What an answer is checked against. */
export interface SummaryContext {
  record: readonly RecordLine[];
  /** Ids of the documents that can go to PayPal; each must be picked once. */
  exhibitIds: readonly string[];
  /** The comparison's and the record's own text: amounts in the note must appear here. */
  sourceText: string;
}

/**
 * Checks a summary against what the models were given: at least one sentence cites record
 * entries, every cited entry exists, every document is picked exactly once (and no unknown one), and the note has no links,
 * no legal or outcome words and no amount the record does not hold. Error messages never repeat
 * the text. The score is the share of record citations found. Pure.
 */
export function checkSummary(
  value: unknown,
  context: SummaryContext,
):
  | { ok: true; summary: PacketSummary; validation: Validation }
  | { ok: false; validation: Validation } {
  const parsed = packetSummarySchema.safeParse(value);
  if (!parsed.success) {
    return {
      ok: false,
      validation: { valid: false, score: 0, errors: ["the reply is not in the expected shape"] },
    };
  }
  const summary = parsed.data;
  const numbers = new Set(context.record.map(({ n }) => n));
  const errors: string[] = [];
  let checked = 0;
  let found = 0;
  // A sentence that says no record covers a statement has nothing to cite (owner's choice, 5f-2),
  // but a summary that cites nothing at all says nothing checkable.
  if (summary.summary.every((sentence) => sentence.record.length === 0))
    errors.push("no sentence cites a record entry");
  summary.summary.forEach((sentence, i) => {
    for (const n of sentence.record) {
      checked += 1;
      if (numbers.has(n)) found += 1;
      else
        errors.push(`sentence ${String(i + 1)}: record entry #${String(n)} is not in the record`);
    }
  });
  const picked = summary.exhibits.map((e) => e.id);
  const missing = context.exhibitIds.filter((id) => !picked.includes(id));
  const unknown = picked.filter((id) => !context.exhibitIds.includes(id));
  if (missing.length > 0) errors.push(`${String(missing.length)} document(s) not picked`);
  if (unknown.length > 0) errors.push(`${String(unknown.length)} unknown document(s) picked`);
  if (new Set(picked).size !== picked.length) errors.push("a document is picked twice");
  errors.push(...textProblems(summary.note, "the note", { known: context.sourceText }));
  const validation = {
    valid: errors.length === 0,
    score: checked === 0 ? 0 : found / checked,
    errors,
  };
  return validation.valid ? { ok: true, summary, validation } : { ok: false, validation };
}

/** Reads a model's outcome: a failed call or a reply that is not JSON is invalid, never thrown. */
export function readSummary(outcome: ChatOutcome, context: SummaryContext) {
  const parsed = parseJsonReply(outcome);
  if (!parsed.ok) {
    return {
      ok: false as const,
      validation: { valid: false, score: 0, errors: [`no usable reply (${parsed.kind})`] },
    };
  }
  return checkSummary(parsed.value, context);
}
