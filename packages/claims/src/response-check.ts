import { parseJsonReply, type ChatOutcome } from "@pactpal/ai";
import { z } from "zod";
import type { RecordLine } from "./record.js";
import { MAX_MESSAGE_CHARS, MAX_OFFER_NOTE_CHARS } from "./response-prompt.js";
import { textProblems } from "./text-checks.js";

const text = (max: number) => z.string().trim().min(1).max(max);

export const responseDraftSchema = z.object({
  message: text(MAX_MESSAGE_CHARS),
  options: z
    .array(
      z.object({
        code: text(60),
        fits: text(400),
        record: z.array(z.number().int().min(1)).max(12).default([]),
      }),
    )
    .min(1)
    .max(10),
  offerNote: text(MAX_OFFER_NOTE_CHARS),
});

/** A model's answer help after the checks: a draft message, option notes and an offer note. */
export type ResponseDraft = z.output<typeof responseDraftSchema>;

/** What an answer is checked against. */
export interface ResponseContext {
  record: readonly RecordLine[];
  /** The codes of the options PayPal allows now; each must be described once. */
  optionCodes: readonly string[];
  /** The options' own words (by code): an option note may repeat an amount named there. */
  optionText: string;
}

const invalid = (errors: string[]) => ({
  ok: false as const,
  validation: { valid: false, score: 0, errors },
});

/**
 * Checks answer help against what the models were given: every allowed option described exactly
 * once (and no other), cited record entries exist, and neither the message nor the offer note
 * has a link, legal or outcome words, or any amount (the seller chooses amounts); an option note
 * may only repeat an amount the options' own (code-written) words name. The score is
 * the share of citations found. Pure; error messages never repeat the text.
 */
export function checkResponse(value: unknown, context: ResponseContext) {
  const parsed = responseDraftSchema.safeParse(value);
  if (!parsed.success) return invalid(["the reply is not in the expected shape"]);
  const draft = parsed.data;
  const numbers = new Set(context.record.map(({ n }) => n));
  const errors: string[] = [];
  const codes = draft.options.map((option) => option.code);
  const missing = context.optionCodes.filter((code) => !codes.includes(code));
  const unknown = codes.filter((code) => !context.optionCodes.includes(code));
  if (missing.length > 0) errors.push(`${String(missing.length)} option(s) not described`);
  if (unknown.length > 0) errors.push(`${String(unknown.length)} unknown option(s) described`);
  if (new Set(codes).size !== codes.length) errors.push("an option is described twice");
  let checked = 0;
  let found = 0;
  for (const option of draft.options) {
    for (const n of option.record) {
      checked += 1;
      if (numbers.has(n)) found += 1;
      else errors.push(`option ${option.code}: record entry #${String(n)} is not in the record`);
    }
    errors.push(
      ...textProblems(option.fits, `option ${option.code}`, { known: context.optionText }),
    );
  }
  errors.push(...textProblems(draft.message, "the message", "none"));
  errors.push(...textProblems(draft.offerNote, "the offer note", "none"));
  const validation = {
    valid: errors.length === 0,
    score: checked === 0 ? 1 : found / checked,
    errors,
  };
  return validation.valid
    ? { ok: true as const, content: draft, validation }
    : { ok: false as const, validation };
}

/** Reads a model's outcome: a failed call or a reply that is not JSON is invalid, never thrown. */
export function readResponse(outcome: ChatOutcome, context: ResponseContext) {
  const parsed = parseJsonReply(outcome);
  if (!parsed.ok) return invalid([`no usable reply (${parsed.kind})`]);
  return checkResponse(parsed.value, context);
}
