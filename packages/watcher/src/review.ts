import { parseJsonReply, type ChatOutcome } from "@pactpal/ai";
import type { Validation } from "@pactpal/council";
import { quoteOnLine, withoutLinePrefix, type AgreementLine } from "@pactpal/qa";
import { normalizeForMatch, type SourceLine } from "@pactpal/scope-draft";
import { z } from "zod";

export const REQUEST_LABELS = [
  "within-scope",
  "extra-revision",
  "out-of-scope",
  "unclear",
] as const;
export type RequestLabel = (typeof REQUEST_LABELS)[number];

const citationSchema = z.object({
  line: z.number().int().min(1),
  quote: z.string().trim().min(1).max(300),
});

export const messageReviewSchema = z.object({
  requests: z
    .array(
      z.object({
        quote: z.string().trim().min(1).max(300),
        label: z.enum(REQUEST_LABELS),
        citations: z.array(citationSchema).max(6).default([]),
        why: z.string().trim().max(300).default(""),
      }),
    )
    .max(20),
  reply: z.string().trim().min(1).max(1200),
  changeLines: z.array(z.string().trim().min(1).max(300)).max(10).default([]),
});

/** A model's review of one buyer message, after the checks: a draft for the seller only. */
export type MessageReview = z.output<typeof messageReviewSchema>;

/** A money amount: a currency sign or code next to a number. The seller sets every price. */
const MONEY =
  /[$€£]\s?\d|\d\s?(?:usd|eur|gbp|cad|aud|dollars?|euros?|pounds?)\b|\b(?:usd|eur|gbp|cad|aud)\s?\d/i;

/**
 * Checks a review against the message and the agreement: every request quotes one message line,
 * every citation is on its agreement line, a request said to be in the agreement cites it, change
 * lines come only with out-of-scope requests, and the reply names no money amount. The score is
 * the share of quotes and citations found. Pure.
 */
export function checkReview(
  value: unknown,
  context: { agreement: readonly AgreementLine[]; message: readonly SourceLine[] },
):
  | { ok: true; review: MessageReview; validation: Validation }
  | { ok: false; validation: Validation } {
  const parsed = messageReviewSchema.safeParse(value);
  if (!parsed.success) {
    return {
      ok: false,
      validation: { valid: false, score: 0, errors: ["the reply is not in the expected shape"] },
    };
  }
  const review = {
    ...parsed.data,
    requests: parsed.data.requests.map((r) => ({
      ...r,
      citations: r.citations.map((c) => ({ line: c.line, quote: withoutLinePrefix(c.quote) })),
    })),
  };
  const messageLines = context.message.map((line) => normalizeForMatch(line.text));
  const errors: string[] = [];
  let checked = 0;
  let found = 0;
  review.requests.forEach((request, i) => {
    const which = `request ${String(i + 1)}`;
    checked += 1;
    const quote = normalizeForMatch(request.quote);
    if (quote.length > 0 && messageLines.some((line) => line.includes(quote))) found += 1;
    else errors.push(`${which}: its quote is not on a message line`);
    for (const citation of request.citations) {
      checked += 1;
      if (quoteOnLine(context.agreement, citation)) found += 1;
      else errors.push(`${which}: a citation is not on agreement line ${String(citation.line)}`);
    }
    if (request.label === "within-scope" && request.citations.length === 0) {
      errors.push(`${which}: said to be in the agreement without citing it`);
    }
  });
  const outOfScope = review.requests.some((r) => r.label === "out-of-scope");
  if (outOfScope !== review.changeLines.length > 0) {
    errors.push(
      outOfScope
        ? "no change lines for the out-of-scope requests"
        : "change lines with nothing out of scope",
    );
  }
  if (MONEY.test(review.reply)) errors.push("the reply names a price");
  const validation = {
    valid: errors.length === 0,
    score: checked === 0 ? 1 : found / checked,
    errors,
  };
  return validation.valid ? { ok: true, review, validation } : { ok: false, validation };
}

/** Reads a model's outcome: a failed call or a reply that is not JSON is invalid, never thrown. */
export function readReview(
  outcome: ChatOutcome,
  context: Parameters<typeof checkReview>[1],
): ReturnType<typeof checkReview> {
  const parsed = parseJsonReply(outcome);
  if (!parsed.ok) {
    return {
      ok: false,
      validation: { valid: false, score: 0, errors: [`no usable reply (${parsed.kind})`] },
    };
  }
  return checkReview(parsed.value, context);
}
