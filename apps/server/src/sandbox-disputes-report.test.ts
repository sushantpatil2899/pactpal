import type { DisputeDetails } from "@pactpal/paypal";
import { describe, expect, it } from "vitest";
import {
  formatDisputeDetails,
  formatDisputeList,
  parseDisputeArgs,
} from "./sandbox-disputes-report.js";

const viaRest = { transport: "rest" as const, fallbackReason: "MCP setup error" };

const summary = {
  disputeId: "PP-D-1",
  reason: "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED",
  status: "WAITING_FOR_SELLER_RESPONSE",
  state: "REQUIRED_ACTION",
  stage: "INQUIRY",
  amount: { minor: 100, currency: "USD" },
  createdAt: "2026-10-30T10:00:00.000Z",
  updatedAt: undefined,
};

describe("parseDisputeArgs", () => {
  it("accepts no arguments or a dispute id", () => {
    expect(parseDisputeArgs([])).toEqual({ ok: true, id: undefined });
    expect(parseDisputeArgs(["--id", "PP-D-1"])).toEqual({ ok: true, id: "PP-D-1" });
  });

  it.each([
    [["--id", "../etc"], /--id must be a PayPal dispute id/],
    [["--color", "red"], /Unknown option '--color'/],
  ])("rejects %j", (argv, message) => {
    const result = parseDisputeArgs(argv);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(message);
  });
});

describe("formatDisputeList", () => {
  it("lists each dispute on one line with the route", () => {
    expect(formatDisputeList({ disputes: [summary], truncated: true }, viaRest)).toBe(
      "Sandbox disputes (seller app): 1\n" +
        "  PP-D-1  WAITING_FOR_SELLER_RESPONSE  INQUIRY  MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED  1.00 USD  2026-10-30T10:00:00.000Z\n" +
        "  (more disputes exist beyond the page limit)\n" +
        "Read via rest (MCP skipped: MCP setup error)\n",
    );
  });

  it("says none for an empty list, and dashes for missing values", () => {
    expect(formatDisputeList({ disputes: [], truncated: false }, { transport: "mcp" })).toBe(
      "Sandbox disputes (seller app): 0\n  none\nRead via mcp\n",
    );
    const bare = { ...summary, stage: undefined, reason: undefined, createdAt: undefined };
    expect(formatDisputeList({ disputes: [bare], truncated: false }, viaRest)).toContain(
      "  PP-D-1  WAITING_FOR_SELLER_RESPONSE  -  -  1.00 USD  -\n",
    );
  });
});

describe("formatDisputeDetails", () => {
  const details: DisputeDetails = {
    ...summary,
    channel: "INTERNAL",
    sellerResponseDueDate: "2026-11-09T10:00:00.000Z",
    buyerResponseDueDate: undefined,
    transactions: [
      { sellerTransactionId: "S-1", buyerTransactionId: "B-1", invoiceNumber: undefined },
    ],
    messages: [{ postedBy: "BUYER", postedAt: undefined, content: "Wrong format." }],
    allowedActions: ["accept_claim", "make_offer"],
    allowedOfferTypes: ["REFUND"],
    requestedEvidence: [],
    outcome: undefined,
  };

  it("shows the deadline, allowed actions, transactions and messages", () => {
    const text = formatDisputeDetails(details, viaRest);
    expect(text).toContain("  Seller due by    2026-11-09T10:00:00.000Z\n");
    expect(text).toContain("  Allowed actions  accept_claim, make_offer\n");
    expect(text).toContain("  Offer types      REFUND\n");
    expect(text).toContain("  Transactions     seller S-1 / buyer B-1 / invoice -\n");
    expect(text).toContain("  Messages (1)\n    - BUYER: Wrong format.\n");
  });

  it("says none when PayPal allows nothing", () => {
    const text = formatDisputeDetails(
      {
        ...details,
        state: undefined,
        stage: undefined,
        reason: undefined,
        channel: undefined,
        amount: undefined,
        sellerResponseDueDate: undefined,
        allowedActions: [],
        allowedOfferTypes: [],
        transactions: [],
        messages: [],
        outcome: "RESOLVED_BUYER_FAVOUR",
      },
      { transport: "mcp" },
    );
    expect(text).toContain("  Allowed actions  none\n");
    expect(text).toContain("  Amount           unknown\n");
    expect(text).toContain("  Outcome          RESOLVED_BUYER_FAVOUR\n");
    expect(text).toContain("  Messages (0)\n");
  });
});
