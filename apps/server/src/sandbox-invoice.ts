/**
 * `pnpm sandbox:invoice --to <email> --amount <decimal>`: creates and sends one
 * real sandbox invoice from the seller app, then reads it back.
 */
import { randomUUID } from "node:crypto";
import { PayPalInvoices } from "@pactpal/paypal";
import { fail, sellerClients } from "./sandbox-clients.js";
import { formatInvoiceReport, parseInvoiceArgs } from "./sandbox-invoice-report.js";

const parsed = parseInvoiceArgs(process.argv.slice(2));
if (!parsed.ok) fail(`${parsed.error}\nUsage: pnpm sandbox:invoice --to <email> --amount 1.00`);

const { rest, mcp, fallback } = sellerClients();
const invoices = new PayPalInvoices(rest, mcp, fallback);
try {
  const sent = await invoices.createAndSend({
    recipientEmail: parsed.args.to,
    amount: parsed.args.amount,
    itemName: "PactPal sandbox test",
    description: "Test invoice created by pnpm sandbox:invoice",
    scopeReference: "sandbox test, no scope",
    requestId: `sandbox-invoice-${randomUUID()}`,
  });
  const read = await invoices.get(sent.invoiceId);
  process.stdout.write(formatInvoiceReport(sent, read.data, read));
} catch (error) {
  process.exitCode = 1;
  process.stderr.write(`${String(error)}\n`);
} finally {
  await mcp.close();
}
