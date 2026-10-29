import { z } from "zod";

/** An amount in the currency's smallest unit (1050 = 10.50 USD), as stored by PactPal. */
export interface MinorAmount {
  minor: number;
  currency: string;
}

/** PayPal's amount format: a decimal string with the currency code. */
export interface PayPalMoney {
  currency_code: string;
  value: string;
}

/** Checks a PayPal amount object in an answer and converts it to minor units. */
export const payPalAmount = z
  .looseObject({ currency_code: z.string(), value: z.string() })
  .transform((money) => fromPayPalMoney(money));

// PayPal does not support decimals for these currencies.
const ZERO_DECIMAL = new Set(["JPY", "HUF", "TWD"]);

function decimalsOf(currency: string): number {
  return ZERO_DECIMAL.has(currency) ? 0 : 2;
}

/** Converts minor units to PayPal's format. Rejects fractions, negatives and malformed codes. */
export function toPayPalMoney({ minor, currency }: MinorAmount): PayPalMoney {
  if (!Number.isSafeInteger(minor) || minor < 0) {
    throw new RangeError("amount must be a whole, non-negative number of minor units");
  }
  if (!/^[A-Z]{3}$/.test(currency)) throw new RangeError("currency must be a 3-letter code");
  const decimals = decimalsOf(currency);
  if (decimals === 0) return { currency_code: currency, value: String(minor) };
  const text = String(minor).padStart(decimals + 1, "0");
  return {
    currency_code: currency,
    value: `${text.slice(0, -decimals)}.${text.slice(-decimals)}`,
  };
}

/**
 * Converts PayPal's format (or a typed amount such as "10.5") to minor units,
 * without floating-point arithmetic. Rejects more decimals than the currency has.
 */
export function fromPayPalMoney({ currency_code, value }: PayPalMoney): MinorAmount {
  const decimals = decimalsOf(currency_code);
  const match = /^(\d+)(?:\.(\d*))?$/.exec(value);
  const [, whole = "", fraction = ""] = match ?? [];
  if (match === null || fraction.length > decimals) {
    throw new RangeError(`"${value}" is not a valid ${currency_code} amount`);
  }
  const amount = { minor: Number(whole + fraction.padEnd(decimals, "0")), currency: currency_code };
  toPayPalMoney(amount); // checks the size and the currency code
  return amount;
}
