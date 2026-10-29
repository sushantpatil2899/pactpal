import {
  type InvoiceDetails,
  type MinorAmount,
  type Route,
  type SentInvoice,
} from "@pactpal/paypal";
import { z } from "zod";
import { AMOUNT_OPTIONS, amountOption, readChecked } from "./cli-args.js";
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
  const parsed = readChecked(argv, { to: { type: "string" }, ...AMOUNT_OPTIONS }, argsSchema);
  if (!parsed.ok) return parsed;
  const { to, amount, currency } = parsed.value;
  const minor = amountOption(amount, currency);
  return minor.ok ? { ok: true, args: { to, amount: minor.value } } : minor;
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
