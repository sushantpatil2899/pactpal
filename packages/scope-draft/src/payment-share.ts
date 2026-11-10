/**
 * Payments worked out from a share the chat states (7p): "$240 total … 50% up front" lets a
 * drafted payment of 120.00 stand, because the code redoes the arithmetic. Pure; money in
 * integer minor units.
 */

/** A share of the price stated in a quote, as a fraction (numerator over denominator). */
interface Share {
  over: number;
  of: number;
}

/** What the quotes cited for a payment state about its share of the price. */
export interface StatedShares {
  shares: readonly Share[];
  /** The quotes call it the rest of the price ("the rest", "the remaining", "the balance"). */
  rest: boolean;
}

const WORD_SHARES: readonly [RegExp, Share][] = [
  [/\bhalf\b/, { over: 1, of: 2 }],
  [/\b(?:a|one) third\b/, { over: 1, of: 3 }],
  [/\btwo thirds\b/, { over: 2, of: 3 }],
  [/\b(?:a|one) quarter\b/, { over: 1, of: 4 }],
  [/\bthree quarters\b/, { over: 3, of: 4 }],
];

const REST = /\b(?:the )?(?:rest|remaining|remainder|balance)\b/;

/** The shares stated in some quotes (already normalized: lower case, plain spaces). */
export function sharesIn(quotes: readonly string[]): StatedShares {
  const text = quotes.join(" ");
  const percents = [...text.matchAll(/(?<![\d.])(\d{1,3})\s?(?:%|percent\b)/g)]
    .map((match) => Number(match[1]))
    .filter((n) => n > 0 && n <= 100)
    .map((n) => ({ over: n, of: 100 }));
  const words = WORD_SHARES.filter(([pattern]) => pattern.test(text)).map(([, share]) => share);
  return { shares: [...percents, ...words], rest: REST.test(text) };
}

/** A share of a price in minor units, to the nearest cent. */
const shareOf = (priceMinor: number, { over, of }: Share) => Math.round((priceMinor * over) / of);

/**
 * Whether a payment's amount is one of the stated shares of the price, or, when the quotes call
 * it the rest, the price less the other payments (only when all of them are stated).
 */
export function paymentFromShare(
  amountMinor: number,
  priceMinor: number,
  stated: StatedShares,
  otherPaymentsMinor: readonly (number | null)[],
): boolean {
  if (priceMinor <= 0 || amountMinor <= 0) return false;
  if (stated.shares.some((share) => shareOf(priceMinor, share) === amountMinor)) return true;
  if (!stated.rest || otherPaymentsMinor.some((other) => other === null)) return false;
  const others = otherPaymentsMinor.reduce<number>((sum, other) => sum + (other ?? 0), 0);
  return others > 0 && priceMinor - others === amountMinor;
}
