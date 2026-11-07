import { parseArgs, type ParseArgsConfig } from "node:util";
import { fromPayPalMoney, type MinorAmount } from "@pactpal/paypal";
import { z } from "zod";

/** A checked command-line value, or a message saying what is wrong with it. */
export type Checked<T> = { ok: true; value: T } | { ok: false; error: string };

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** Reads the given options; unknown options and wrong types become an error message. */
export function readOptions<O extends NonNullable<ParseArgsConfig["options"]>>(
  argv: readonly string[],
  options: O,
): Checked<ReturnType<typeof parseArgs<{ options: O }>>["values"]> {
  try {
    return { ok: true, value: parseArgs({ args: [...argv], options }).values };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}

/** The value of a checked command line; a bad one prints the problem and the usage line, then exits with 1. */
export function valueOrExit<T>(checked: Checked<T>, usage: string): T {
  if (!checked.ok) {
    process.stderr.write(`${checked.error}\n${usage}\n`);
    process.exit(1);
  }
  return checked.value;
}

/** Progress lines of the long live commands go to stderr, so stdout holds only the report. */
export function logProgress(message: string): void {
  process.stderr.write(`${message}\n`);
}

/** Reads the options, then checks their values with `schema`. */
export function readChecked<T>(
  argv: readonly string[],
  options: NonNullable<ParseArgsConfig["options"]>,
  schema: z.ZodType<T>,
): Checked<T> {
  const read = readOptions(argv, options);
  if (!read.ok) return read;
  const parsed = schema.safeParse(read.value);
  return parsed.success
    ? { ok: true, value: parsed.data }
    : { ok: false, error: issuesText(parsed.error) };
}

/** The `--amount <decimal> [--currency USD]` options. */
export const AMOUNT_OPTIONS = {
  amount: { type: "string" },
  currency: { type: "string" },
} as const;

/** All of a schema mismatch's messages, joined. */
export function issuesText(error: z.ZodError): string {
  return error.issues.map((issue) => issue.message).join("; ");
}

/** Converts a typed amount such as "1.00" to minor units for `currency`. */
export function amountOption(value: string, currency: string): Checked<MinorAmount> {
  try {
    return { ok: true, value: fromPayPalMoney({ currency_code: currency, value }) };
  } catch (error) {
    return { ok: false, error: `--amount: ${message(error)}` };
  }
}

/** A PayPal account id (payer id) or similar plain PayPal id given as `option`. */
export const payPalIdOption = (option: string) =>
  z.string().regex(/^[A-Za-z0-9_-]{1,64}$/, `${option} needs a PayPal id`);

export const disputeIdOption = z
  .string()
  .regex(/^[A-Za-z0-9_-]{1,255}$/, "--id must be a PayPal dispute id");
