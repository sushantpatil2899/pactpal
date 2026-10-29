import type { DisputeDetails } from "@pactpal/paypal";
import { describe, expect, it } from "vitest";
import {
  formatPlan,
  formatSent,
  parseRespondArgs,
  type RespondArgs,
} from "./sandbox-respond-report.js";

const base = ["--id", "PP-D-1", "--note", "Delivered"];

describe("parseRespondArgs", () => {
  it.each([
    [
      [...base, "--evidence", "PROOF_OF_FULFILLMENT", "--file", "a.pdf", "--file", "b.png"],
      { kind: "evidence", evidenceType: "PROOF_OF_FULFILLMENT", files: ["a.pdf", "b.png"] },
    ],
    [
      [...base, "--offer", "REFUND", "--amount", "0.50"],
      { kind: "offer", offerType: "REFUND", amount: { minor: 50, currency: "USD" } },
    ],
    [[...base, "--accept"], { kind: "accept", refundAmount: undefined }],
    [
      [...base, "--accept", "--amount", "500", "--currency", "JPY"],
      { kind: "accept", refundAmount: { minor: 500, currency: "JPY" } },
    ],
    [[...base, "--appeal"], { kind: "appeal", files: [] }],
  ])("reads %j", (argv, answer) => {
    expect(parseRespondArgs(argv)).toEqual({
      ok: true,
      value: { id: "PP-D-1", note: "Delivered", answer, send: false },
    });
  });

  it("sends only with --send", () => {
    expect(parseRespondArgs([...base, "--accept", "--send"])).toMatchObject({
      ok: true,
      value: { send: true },
    });
  });

  it.each([
    [["--note", "x", "--accept"], /--id is required/],
    [["--id", "PP-D-1", "--accept"], /--note is required/],
    [["--id", "../x", "--note", "x", "--accept"], /--id must be a PayPal dispute id/],
    [base, /exactly one of/],
    [[...base, "--accept", "--appeal"], /exactly one of/],
    [[...base, "--offer", "REFUND"], /--offer needs --amount/],
    [
      [...base, "--offer", "REFUND", "--amount", "1.234"],
      /--amount: "1.234" is not a valid USD amount/,
    ],
    [[...base, "--accept", "--file", "a.pdf"], /--file is only used with --evidence or --appeal/],
    [[...base, "--appeal", "--amount", "1"], /--amount is only used with --offer or --accept/],
    [[...base, "--accept", "--colour", "red"], /Unknown option '--colour'/],
  ])("rejects %j", (argv, message) => {
    const result = parseRespondArgs(argv);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(message);
  });
});

const dispute: DisputeDetails = {
  disputeId: "PP-D-1",
  reason: undefined,
  status: "WAITING_FOR_SELLER_RESPONSE",
  state: undefined,
  stage: "INQUIRY",
  amount: { minor: 100, currency: "USD" },
  createdAt: undefined,
  updatedAt: undefined,
  channel: undefined,
  sellerResponseDueDate: "2026-11-09T10:00:00.000Z",
  buyerResponseDueDate: undefined,
  transactions: [],
  messages: [],
  allowedActions: ["make_offer", "accept_claim"],
  allowedOfferTypes: ["REFUND"],
  outcome: undefined,
};

function args(argv: string[]): RespondArgs {
  const parsed = parseRespondArgs([...base, ...argv]);
  if (!parsed.ok) throw new Error(parsed.error);
  return parsed.value;
}

describe("formatPlan", () => {
  it("shows the dispute, the planned answer, whether it is allowed, and the dry-run notice", () => {
    const text = formatPlan(args(["--offer", "REFUND", "--amount", "0.50"]), dispute);
    expect(text).toContain("  Allowed actions  make_offer, accept_claim\n");
    expect(text).toContain("  Answer           offer REFUND of 0.50 USD\n");
    expect(text).toContain("  Allowed now      yes\n");
    expect(text).toContain("Dry run: nothing was sent. Add --send to send it.\n");
  });

  it.each([
    [["--offer", "REPLACEMENT", "--amount", "1"], "no: offer type REPLACEMENT is not allowed now"],
    [["--evidence", "OTHER", "--file", "a.pdf"], "no: PayPal does not allow provide_evidence now"],
  ])("explains why %j is not allowed", (argv, reason) => {
    expect(formatPlan(args(argv), dispute)).toContain(`  Allowed now      ${reason}\n`);
  });

  it("describes each answer and leaves out the dry-run notice when sending", () => {
    const none = {
      ...dispute,
      allowedActions: [],
      allowedOfferTypes: [],
      sellerResponseDueDate: undefined,
    };
    expect(formatPlan(args(["--accept"]), none)).toContain("accept the claim with a full refund");
    expect(formatPlan(args(["--accept", "--amount", "0.25"]), none)).toContain(
      "accept the claim with a refund of 0.25 USD",
    );
    expect(formatPlan(args(["--appeal"]), none)).toContain(
      "  Answer           appeal, files: none\n",
    );
    expect(formatPlan(args(["--evidence", "OTHER"]), none)).toContain(
      "evidence OTHER, files: none",
    );
    expect(formatPlan(args(["--accept", "--send"]), none)).not.toContain("Dry run");
    expect(formatPlan(args(["--accept"]), none)).toContain("  Allowed actions  none\n");
  });
});

describe("formatSent", () => {
  it("names the action, dispute, route and debug id", () => {
    expect(
      formatSent(args(["--accept"]), {
        data: { disputeId: "PP-D-1" },
        transport: "rest",
        fallbackReason: "MCP setup error",
        debugId: "dbg-1",
      }),
    ).toBe("Sent accept_claim to PP-D-1 via rest (MCP skipped: MCP setup error), debug id dbg-1\n");
    expect(
      formatSent(args(["--accept"]), { data: { disputeId: "PP-D-1" }, transport: "mcp" }),
    ).toBe("Sent accept_claim to PP-D-1 via mcp\n");
  });
});
