import { parseArgs } from "node:util";
import type { DisputeDetails, DisputeList, Route } from "@pactpal/paypal";
import { z } from "zod";
import { describeRoute, formatAmount, rows } from "./format.js";

const disputeId = z.string().regex(/^[A-Za-z0-9_-]{1,255}$/, "--id must be a PayPal dispute id");

/** Reads the optional `--id <dispute id>`. */
export function parseDisputeArgs(
  argv: readonly string[],
): { ok: true; id: string | undefined } | { ok: false; error: string } {
  try {
    const { values } = parseArgs({ args: [...argv], options: { id: { type: "string" } } });
    if (values.id === undefined) return { ok: true, id: undefined };
    const parsed = disputeId.safeParse(values.id);
    return parsed.success
      ? { ok: true, id: parsed.data }
      : { ok: false, error: parsed.error.issues.map((issue) => issue.message).join("; ") };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/** The seller's disputes, one line each. */
export function formatDisputeList(list: DisputeList, route: Route): string {
  const lines = list.disputes.map(
    (d) =>
      `  ${d.disputeId}  ${d.status}  ${d.stage ?? "-"}  ${d.reason ?? "-"}  ${formatAmount(d.amount)}  ${d.createdAt ?? "-"}\n`,
  );
  const more = list.truncated ? "  (more disputes exist beyond the page limit)\n" : "";
  return (
    `Sandbox disputes (seller app): ${list.disputes.length}\n` +
    (lines.join("") || "  none\n") +
    more +
    `Read via ${describeRoute(route)}\n`
  );
}

/** One dispute in full: deadline, matching transactions, messages and what the seller may do now. */
export function formatDisputeDetails(d: DisputeDetails, route: Route): string {
  const list = (items: string[]) => (items.length === 0 ? "none" : items.join(", "));
  const transactions = d.transactions.map(
    (t) =>
      `seller ${t.sellerTransactionId ?? "-"} / buyer ${t.buyerTransactionId ?? "-"} / invoice ${t.invoiceNumber ?? "-"}`,
  );
  const messages = d.messages.map((m) => `    ${m.postedAt ?? "-"} ${m.postedBy}: ${m.content}\n`);
  return (
    `Sandbox dispute ${d.disputeId}\n` +
    rows([
      ["Status", d.status],
      ["State", d.state ?? "-"],
      ["Stage", d.stage ?? "-"],
      ["Reason", d.reason ?? "-"],
      ["Channel", d.channel ?? "-"],
      ["Amount", formatAmount(d.amount)],
      ["Seller due by", d.sellerResponseDueDate ?? "-"],
      ["Buyer due by", d.buyerResponseDueDate ?? "-"],
      ["Allowed actions", list(d.allowedActions)],
      ["Offer types", list(d.allowedOfferTypes)],
      ["Outcome", d.outcome ?? "-"],
      ["Transactions", list(transactions)],
      ["Read via", describeRoute(route)],
    ]) +
    `  Messages (${d.messages.length})\n${messages.join("")}`
  );
}
