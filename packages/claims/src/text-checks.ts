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
