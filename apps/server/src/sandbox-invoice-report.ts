import { parseArgs } from "node:util";
import {
  fromPayPalMoney,
  type InvoiceDetails,
  type MinorAmount,
  type Route,
  type SentInvoice,
} from "@pactpal/paypal";
import { z } from "zod";
import { describeRoute, formatAmount, rows } from "./format.js";

export interface InvoiceArgs {
  to: string;
  amount: MinorAmount;
}

const argsSchema = z.object({
  to: z.email("--to must be an email address"),
  amount: z.string("--amount is required, e.g. --amount 1.00"),
  currency: z.string().default("USD"),
});

/** Reads `--to <email> --amount <decimal> [--currency USD]`. */
export function parseInvoiceArgs(
  argv: readonly string[],
): { ok: true; args: InvoiceArgs } | { ok: false; error: string } {
  let values: Record<string, unknown>;
  try {
    ({ values } = parseArgs({
      args: [...argv],
      options: {
        to: { type: "string" },
        amount: { type: "string" },
        currency: { type: "string" },
      },
    }));
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
  const parsed = argsSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((issue) => issue.message).join("; ") };
  }
  const { to, amount, currency } = parsed.data;
  try {
    return {
      ok: true,
      args: { to, amount: fromPayPalMoney({ currency_code: currency, value: amount }) },
    };
  } catch (error) {
    return {
      ok: false,
      error: `--amount: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/** Plain-text result of the sandbox invoice run. */
export function formatInvoiceReport(
  sent: SentInvoice,
  details: InvoiceDetails,
  read: Route,
): string {
  return `Sandbox invoice\n${rows([
    ["Invoice", details.invoiceId],
    ["Status", details.status],
    ["Amount", formatAmount(details.amount)],
    ["Recipient", details.recipientEmail ?? "unknown"],
    ["Note", details.note ?? "none"],
    ["Payment link", details.payerViewUrl ?? "not provided"],
    ["Created via", describeRoute(sent.create)],
    ["Sent via", describeRoute(sent.send)],
    ["Read via", describeRoute(read)],
  ])}`;
}
