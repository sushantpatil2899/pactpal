import {
  TEST_DISPUTE_REASONS,
  type DisputeDetails,
  type MinorAmount,
  type TestDisputeReason,
} from "@pactpal/paypal";
import { z } from "zod";
import { AMOUNT_OPTIONS, amountOption, readChecked, type Checked } from "./cli-args.js";
import { formatAmount, rows } from "./format.js";

export interface SeedArgs {
  /** Who the new invoice goes to; not needed when resuming with --invoice. */
  to: string | undefined;
  amount: MinorAmount;
  reason: TestDisputeReason;
  /** Resume with an invoice that already exists instead of creating one. */
  invoiceId: string | undefined;
  /** Skip the search when the buyer's transaction id is already known. */
  buyerTransactionId: string | undefined;
}

export const USAGE =
  "Usage: pnpm seed:sandbox --to <buyer email> [--amount 1.00] [--currency USD] " +
  "[--reason not-as-described|not-received] [--invoice <id>] [--buyer-transaction <id>]";

const id = (option: string) =>
  z
    .string()
    .regex(/^[A-Za-z0-9_-]{1,64}$/, `${option} must be a PayPal id`)
    .optional();

const argsSchema = z.object({
  to: z.email("--to must be an email address").optional(),
  amount: z.string().default("1.00"),
  currency: z.string().default("USD"),
  reason: z
    .enum(Object.keys(TEST_DISPUTE_REASONS) as [TestDisputeReason, ...TestDisputeReason[]], {
      error: "--reason must be not-as-described or not-received",
    })
    .default("not-as-described"),
  invoice: id("--invoice"),
  "buyer-transaction": id("--buyer-transaction"),
});

/** Reads the command line; --to is required unless an existing invoice is given. */
export function parseSeedArgs(argv: readonly string[]): Checked<SeedArgs> {
  const parsed = readChecked(
    argv,
    {
      to: { type: "string" },
      reason: { type: "string" },
      invoice: { type: "string" },
      "buyer-transaction": { type: "string" },
      ...AMOUNT_OPTIONS,
    },
    argsSchema,
  );
  if (!parsed.ok) return parsed;
  const v = parsed.value;
  if (v.to === undefined && v.invoice === undefined) {
    return { ok: false, error: "--to is required unless --invoice is given" };
  }
  const amount = amountOption(v.amount, v.currency);
  if (!amount.ok) return amount;
  return {
    ok: true,
    value: {
      to: v.to,
      amount: amount.value,
      reason: v.reason,
      invoiceId: v.invoice,
      buyerTransactionId: v["buyer-transaction"],
    },
  };
}

/** What the person running the command must do to pay. */
export function formatPayInstructions(invoiceId: string, payLink: string | undefined): string {
  return (
    `Invoice ${invoiceId} is sent. Now pay it as the test buyer:\n` +
    `  1. Open ${payLink ?? "the invoice from the buyer's sandbox PayPal account"}\n` +
    "  2. Log in as the test buyer (its sandbox password).\n" +
    "  3. Choose PayPal balance, not a card, and pay.\n" +
    "Waiting for PayPal to mark it paid (checking every 15 seconds, up to 15 minutes)...\n"
  );
}

/** What to do if the wait ran out. */
export function formatPayTimeout(invoiceId: string): string {
  return (
    `Invoice ${invoiceId} is not paid yet. Pay it whenever you are ready, then run:\n` +
    `  pnpm seed:sandbox --invoice ${invoiceId}\n`
  );
}

/** What to do if the buyer's transaction could not be found. */
export function formatSearchTimeout(invoiceId: string): string {
  return (
    "Could not find the buyer's copy of the payment yet. Copy it by hand:\n" +
    "  1. Log in to https://www.sandbox.paypal.com as the test buyer and open Activity.\n" +
    "  2. Open the payment and copy its Transaction ID.\n" +
    `  3. Run: pnpm seed:sandbox --invoice ${invoiceId} --buyer-transaction <Transaction ID>\n`
  );
}

/** The final summary of what was set up. */
export function formatSeedSummary(summary: {
  invoiceId: string;
  amount: MinorAmount;
  buyerTransactionId: string;
  dispute: DisputeDetails;
}): string {
  const { dispute } = summary;
  const buyerWords =
    dispute.messages.find((message) => message.postedBy === "BUYER")?.content ?? "not provided";
  return `Sandbox dispute ready\n${rows([
    ["Invoice", summary.invoiceId],
    ["Amount", formatAmount(summary.amount)],
    ["Buyer transaction", summary.buyerTransactionId],
    ["Dispute", dispute.disputeId],
    ["Reason", dispute.reason ?? "-"],
    ["Status", dispute.status],
    ["Stage", dispute.stage ?? "-"],
    ["Seller due by", dispute.sellerResponseDueDate ?? "-"],
    ["Seller may", dispute.allowedActions.join(", ") || "nothing yet"],
    ["Buyer's words", buyerWords],
  ])}`;
}
