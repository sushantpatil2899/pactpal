import type { DisputeDetails } from "@pactpal/paypal";
import { describe, expect, it } from "vitest";
import {
  formatPayInstructions,
  formatPayTimeout,
  formatSearchTimeout,
  formatSeedSummary,
  parseSeedArgs,
} from "./seed-sandbox-report.js";

describe("parseSeedArgs", () => {
  it("defaults to a $1.00 not-as-described dispute", () => {
    expect(parseSeedArgs(["--to", "buyer@example.com"])).toEqual({
      ok: true,
      value: {
        to: "buyer@example.com",
        amount: { minor: 100, currency: "USD" },
        reason: "not-as-described",
        item: "service",
        invoiceId: undefined,
        buyerTransactionId: undefined,
      },
    });
  });

  it("resumes with an invoice and a known buyer transaction, without --to", () => {
    expect(
      parseSeedArgs([
        "--invoice",
        "INV2-AAAA",
        "--buyer-transaction",
        "9AB12345CD678901E",
        "--reason",
        "not-received",
        "--amount",
        "2.50",
        "--item",
        "product",
      ]),
    ).toMatchObject({
      ok: true,
      value: {
        to: undefined,
        invoiceId: "INV2-AAAA",
        buyerTransactionId: "9AB12345CD678901E",
        reason: "not-received",
        item: "product",
        amount: { minor: 250, currency: "USD" },
      },
    });
  });

  it.each([
    [[], /--to is required unless --invoice is given/],
    [["--to", "nope"], /--to must be an email address/],
    [
      ["--to", "b@example.com", "--reason", "angry"],
      /--reason must be not-as-described or not-received/,
    ],
    [["--invoice", "../x"], /--invoice must be a PayPal id/],
    [["--to", "b@example.com", "--item", "car"], /--item must be service or product/],
    [["--to", "b@example.com", "--amount", "1.234"], /--amount: "1.234" is not a valid USD amount/],
    [["--to", "b@example.com", "--colour", "red"], /Unknown option '--colour'/],
  ])("rejects %j", (argv, message) => {
    const result = parseSeedArgs(argv);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(message);
  });
});

describe("seed messages", () => {
  it("tells the person how to pay, with or without a link", () => {
    expect(formatPayInstructions("INV2-A", "https://pay.example/x")).toContain(
      "1. Open https://pay.example/x\n",
    );
    expect(formatPayInstructions("INV2-A", undefined)).toContain(
      "1. Open the invoice from the buyer's sandbox PayPal account\n",
    );
    expect(formatPayInstructions("INV2-A", undefined)).toContain(
      "Choose PayPal balance, not a card",
    );
  });

  it("tells the person how to resume after a timeout", () => {
    expect(formatPayTimeout("INV2-A")).toContain("pnpm seed:sandbox --invoice INV2-A\n");
    expect(formatSearchTimeout("INV2-A")).toContain(
      "pnpm seed:sandbox --invoice INV2-A --buyer-transaction <Transaction ID>\n",
    );
  });

  const dispute: DisputeDetails = {
    disputeId: "PP-D-1",
    reason: "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED",
    status: "WAITING_FOR_SELLER_RESPONSE",
    state: undefined,
    stage: "INQUIRY",
    amount: { minor: 100, currency: "USD" },
    createdAt: undefined,
    updatedAt: undefined,
    channel: undefined,
    sellerResponseDueDate: "2026-11-08T10:00:00Z",
    buyerResponseDueDate: undefined,
    transactions: [],
    messages: [{ postedBy: "BUYER", postedAt: undefined, content: "Not what was agreed." }],
    allowedActions: ["make_offer", "accept_claim"],
    allowedOfferTypes: [],
    requestedEvidence: [],
    outcome: undefined,
  };
  const base = {
    invoiceId: "INV2-A",
    amount: { minor: 100, currency: "USD" },
    buyerTransactionId: "B-1",
  };

  it("summarises the dispute, including the buyer's words", () => {
    const text = formatSeedSummary({ ...base, dispute });
    expect(text).toContain("  Dispute            PP-D-1\n");
    expect(text).toContain("  Amount             1.00 USD\n");
    expect(text).toContain("  Seller may         make_offer, accept_claim\n");
    expect(text).toContain("  Buyer's words      Not what was agreed.\n");
  });

  it("says when PayPal gives no buyer words or seller actions", () => {
    const text = formatSeedSummary({
      ...base,
      dispute: {
        ...dispute,
        messages: [],
        allowedActions: [],
        reason: undefined,
        stage: undefined,
        sellerResponseDueDate: undefined,
      },
    });
    expect(text).toContain("  Buyer's words      not provided\n");
    expect(text).toContain("  Seller may         nothing yet\n");
  });
});
