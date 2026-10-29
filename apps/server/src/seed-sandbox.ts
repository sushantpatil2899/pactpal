/**
 * `pnpm seed:sandbox`: sets up a real sandbox dispute. The seller app sends an
 * invoice, the person running this pays it by hand as the test buyer, then the
 * buyer business app finds its copy of the payment and opens a dispute.
 * Safe to re-run: --invoice resumes, and the dispute request id is fixed per invoice.
 */
import { randomUUID } from "node:crypto";
import {
  PayPalBuyerTestActions,
  PayPalDisputes,
  PayPalInvoices,
  waitFor,
  type BuyerPayment,
  type DisputeDetails,
  type InvoiceDetails,
} from "@pactpal/paypal";
import { formatAmount } from "./format.js";
import { appClients, fail, sellerClients } from "./sandbox-clients.js";
import {
  USAGE,
  formatPayInstructions,
  formatPayTimeout,
  formatSearchTimeout,
  formatSeedSummary,
  parseSeedArgs,
} from "./seed-sandbox-report.js";

const MINUTE = 60_000;
const say = (text: string) => process.stdout.write(text);

const parsed = parseSeedArgs(process.argv.slice(2));
if (!parsed.ok) fail(`${parsed.error}\n${USAGE}`);
const args = parsed.value;

const seller = sellerClients();
const buyer = appClients("buyerBiz");
const invoices = new PayPalInvoices(seller.rest, seller.mcp, seller.fallback);
const disputes = new PayPalDisputes(seller.rest, seller.mcp, seller.fallback);
const buyerActions = new PayPalBuyerTestActions(buyer.rest);

try {
  // 1. The invoice: create one, or resume with an existing one.
  const startedAt = Date.now();
  let invoiceId = args.invoiceId;
  if (invoiceId === undefined) {
    const sent = await invoices.createAndSend({
      recipientEmail: args.to ?? "",
      amount: args.amount,
      itemName: "PactPal sandbox test",
      description: "Test invoice for a sandbox dispute (pnpm seed:sandbox)",
      scopeReference: "sandbox test, no scope",
      requestId: `seed-invoice-${randomUUID()}`,
    });
    invoiceId = sent.invoiceId;
  }

  // 2. Wait for the person running this to pay it as the buyer.
  const first = (await invoices.get(invoiceId)).data;
  let invoice: InvoiceDetails = first;
  if (first.status !== "PAID") {
    say(formatPayInstructions(invoiceId, first.payerViewUrl));
    const paid = await waitFor(
      async () => {
        const current = (await invoices.get(invoiceId)).data;
        return current.status === "PAID" ? current : undefined;
      },
      { intervalMs: 15_000, timeoutMs: 15 * MINUTE, onWaiting: () => say(".") },
    );
    say("\n");
    if (!paid.ok) fail(formatPayTimeout(invoiceId));
    invoice = paid.value;
  }
  const amount = invoice.amount ?? args.amount;
  say(`Invoice ${invoiceId} is paid (${formatAmount(amount)}).\n`);

  // 3. The buyer's own transaction id, which a dispute must name.
  let buyerTransactionId = args.buyerTransactionId;
  if (buyerTransactionId === undefined) {
    say("Looking up the buyer's copy of the payment (up to 10 minutes)...\n");
    // When resuming, the payment may be older than this run, so look back a week.
    const since =
      args.invoiceId === undefined ? startedAt - MINUTE : startedAt - 7 * 24 * 60 * MINUTE;
    const found = await waitFor<BuyerPayment>(
      () => buyerActions.findPurchase({ amount, since, until: Date.now() }),
      { intervalMs: 30_000, timeoutMs: 10 * MINUTE, onWaiting: () => say(".") },
    );
    say("\n");
    if (!found.ok) fail(formatSearchTimeout(invoiceId));
    buyerTransactionId = found.value.transactionId;
  }

  // 4. Open the dispute as the buyer; the fixed request id stops a second one on re-runs.
  const { disputeId } = await buyerActions.openDispute({
    buyerTransactionId,
    reason: args.reason,
    amount,
    message: "PactPal sandbox test: the delivered work is not what was agreed.",
    requestId: `seed-dispute-${invoiceId}`,
  });
  say(`Dispute ${disputeId} opened. Reading it as the seller...\n`);

  // 5. Read it back as the seller; it can take a moment to appear.
  const seen = await waitFor<DisputeDetails>(async () => (await disputes.get(disputeId)).data, {
    intervalMs: 15_000,
    timeoutMs: 5 * MINUTE,
  });
  if (!seen.ok)
    fail(
      `Dispute ${disputeId} was opened but the seller cannot read it yet: ${String(seen.lastError)}`,
    );
  say(formatSeedSummary({ invoiceId, amount, buyerTransactionId, dispute: seen.value }));
} catch (error) {
  process.exitCode = 1;
  process.stderr.write(`${String(error)}\n`);
} finally {
  await Promise.all([seller.mcp.close(), buyer.mcp.close()]);
}
