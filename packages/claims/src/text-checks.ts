import { z } from "zod";

const LINK = /https?:\/\/|www\.|[\w.+-]+@[\w-]+\.[\w.]+/i;
/** Legal or outcome words a draft for PayPal or the buyer must never use (product guardrail 5). */
const BANNED =
  /\b(guarantee[ds]?|legally binding|court|lawsuits?|fraud\w*|will win|chargeback fraud)\b/i;
/** A money amount: a currency sign or code with a number. */
const MONEY = /(?:[$€£]\s?\d[\d,]*(?:\.\d+)?)|(?:\d[\d,]*(?:\.\d+)?\s?(?:usd|eur|gbp|cad|aud)\b)/gi;
const digitsOf = (amount: string) => amount.replace(/[^\d.]/g, "").replace(/\.0+$/, "");

/**
 * What is wrong with a draft text meant for PayPal or the buyer, as error messages naming `what`
 * ("the note"): a link or email address, legal or outcome words, and an amount that is not in
 * `amounts.known` (or any amount at all with "none"). Never repeats the text. Pure.
 */
export function textProblems(
  text: string,
  what: string,
  amounts: { known: string } | "none",
): string[] {
  const errors: string[] = [];
  if (LINK.test(text)) errors.push(`${what} has a link or an email address`);
  if (BANNED.test(text)) errors.push(`${what} uses legal or outcome words`);
  const found = text.match(MONEY) ?? [];
  if (amounts === "none") {
    if (found.length > 0) errors.push(`${what} names an amount`);
  } else if (found.some((amount) => !amounts.known.includes(digitsOf(amount)))) {
    errors.push(`${what} names an amount the record does not hold`);
  }
  return errors;
}

/** A trimmed, non-empty draft text of at most `max` characters. */
export const draftText = (max: number) => z.string().trim().min(1).max(max);

/** The record entries a draft line rests on: at most 12 numbers, none when left out. */
export const citations = z.array(z.number().int().min(1)).max(12).default([]);

/** A reply that failed its checks, with the reasons. */
export const invalidReply = (errors: string[]) => ({
  ok: false as const,
  validation: { valid: false, score: 0, errors },
});

/**
 * What is wrong with the ids a draft covered against the ids it had to cover, each exactly once:
 * "2 option(s) not described", "1 unknown option(s) described", "an option is described twice".
 */
export function coverageProblems(
  given: readonly string[],
  expected: readonly string[],
  noun: string,
  verb: string,
): string[] {
  const errors: string[] = [];
  const missing = expected.filter((id) => !given.includes(id));
  const unknown = given.filter((id) => !expected.includes(id));
  if (missing.length > 0) errors.push(`${String(missing.length)} ${noun}(s) not ${verb}`);
  if (unknown.length > 0) errors.push(`${String(unknown.length)} unknown ${noun}(s) ${verb}`);
  if (new Set(given).size !== given.length) errors.push(`an ${noun} is ${verb} twice`);
  return errors;
}
