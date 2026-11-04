import { normalizeForMatch } from "@pactpal/scope-draft";
import { z } from "zod";
import type { AgreementLine } from "./lines.js";

const citation = z.object({
  line: z.number().int().min(1),
  quote: z.string().trim().min(1).max(300),
});

/** The reply's shape: an answer with citations, or "not answerable". Extra fields are ignored. */
const replySchema = z.union([
  z.object({
    answerable: z.literal(true),
    answer: z.string().trim().min(1).max(600),
    citations: z.array(citation).min(1).max(8),
  }),
  z.object({ answerable: z.literal(false) }),
]);

/** An answer that passed every check: what the buyer is shown. */
export interface CheckedAnswer {
  text: string;
  citations: { line: number; quote: string }[];
}

/** Why a reply is not shown to the buyer. */
export type AnswerRefusal =
  /** The model says the agreement does not answer the question. */
  | "not-in-agreement"
  /** The reply is not in the expected shape. */
  | "bad-shape"
  /** A cited line does not exist, or its quote is not on it. */
  | "quote-not-found";

/** Models sometimes copy the "6: " line prefix into the quote. */
const withoutLinePrefix = (quote: string) => quote.replace(/^\d+:\s*/, "");

/**
 * Checks a model's reply against the agreement's lines: the answer is shown only if every
 * citation names a real line and its quote is on that line (spacing, case and typography
 * forgiven, nothing else). Pure.
 */
export function checkAnswer(
  value: unknown,
  lines: readonly AgreementLine[],
): { ok: true; answer: CheckedAnswer } | { ok: false; reason: AnswerRefusal } {
  const reply = replySchema.safeParse(value);
  if (!reply.success) return { ok: false, reason: "bad-shape" };
  if (!reply.data.answerable) return { ok: false, reason: "not-in-agreement" };
  const byNumber = new Map(lines.map(({ n, text }) => [n, normalizeForMatch(text)]));
  const citations = reply.data.citations.map((c) => ({
    line: c.line,
    quote: withoutLinePrefix(c.quote),
  }));
  const found = citations.every((c) => {
    const line = byNumber.get(c.line);
    const quote = normalizeForMatch(c.quote);
    return line !== undefined && quote.length > 0 && line.includes(quote);
  });
  if (!found) return { ok: false, reason: "quote-not-found" };
  return { ok: true, answer: { text: reply.data.answer, citations } };
}
