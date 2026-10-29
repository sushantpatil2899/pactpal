import type { DisputeDetails, DisputeList, Route } from "@pactpal/paypal";
import { z } from "zod";
import { disputeIdOption, readChecked } from "./cli-args.js";
import { describeRoute, formatAmount, rows } from "./format.js";

/** Reads the optional `--id <dispute id>`. */
export function parseDisputeArgs(
  argv: readonly string[],
): { ok: true; id: string | undefined } | { ok: false; error: string } {
  const parsed = readChecked(
    argv,
    { id: { type: "string" } },
    z.object({ id: disputeIdOption.optional() }),
  );
  return parsed.ok ? { ok: true, id: parsed.value.id } : parsed;
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
