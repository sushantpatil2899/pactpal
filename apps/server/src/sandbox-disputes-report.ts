import type { DisputeDetails, DisputeList, Route } from "@pactpal/paypal";
import { z } from "zod";
import { disputeIdOption, payPalIdOption, readChecked } from "./cli-args.js";
import { describeRoute, formatAmount, rows } from "./format.js";

/** Reads the optional `--id <dispute id>` and `--as <connected seller's payer id>`. */
export function parseDisputeArgs(
  argv: readonly string[],
): { ok: true; id: string | undefined; as: string | undefined } | { ok: false; error: string } {
  const parsed = readChecked(
    argv,
    { id: { type: "string" }, as: { type: "string" } },
    z.object({ id: disputeIdOption.optional(), as: payPalIdOption("--as").optional() }),
  );
  return parsed.ok ? { ok: true, id: parsed.value.id, as: parsed.value.as } : parsed;
}

/** The seller's disputes, one line each. */
export function formatDisputeList(
  list: DisputeList,
  route: Route,
  /** A connected seller's payer id when read through the platform app (--as). */
  asSeller?: string,
): string {
  const whose = asSeller === undefined ? "seller app" : `connected seller ${asSeller}`;
  const lines = list.disputes.map(
    (d) =>
      `  ${d.disputeId}  ${d.status}  ${d.stage ?? "-"}  ${d.reason ?? "-"}  ${formatAmount(d.amount)}  ${d.createdAt ?? "-"}\n`,
  );
  const more = list.truncated ? "  (more disputes exist beyond the page limit)\n" : "";
  return (
    `Sandbox disputes (${whose}): ${list.disputes.length}\n` +
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
