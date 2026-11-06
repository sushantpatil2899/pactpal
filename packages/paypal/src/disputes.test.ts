import { describe, expect, it } from "vitest";
import { MAX_DISPUTE_PAGES, PayPalDisputes } from "./disputes.js";
import { DisputeActionNotAllowed, EvidenceFileError, PayPalResponseError } from "./errors.js";
import { PayPalSandboxDisputes } from "./sandbox-disputes.js";
import { fakeClients } from "./test-fakes.js";

function setup(options: Parameters<typeof fakeClients>[0] = {}) {
  const { rest, mcp, fallback, restCalls, mcpCalls } = fakeClients(options);
  return {
    disputes: new PayPalDisputes(rest, mcp, fallback),
    sandbox: new PayPalSandboxDisputes(rest, mcp, fallback),
    restCalls,
    mcpCalls,
  };
}

const API = "https://api-m.sandbox.paypal.com";

/** A listed dispute, shaped like PayPal's documented list answer. */
function listed(id: string) {
  return {
    dispute_id: id,
    create_time: "2026-10-30T10:00:00.000Z",
    update_time: "2026-10-30T11:00:00.000Z",
    reason: "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED",
    status: "WAITING_FOR_SELLER_RESPONSE",
    dispute_state: "REQUIRED_ACTION",
    dispute_amount: { currency_code: "USD", value: "1.00" },
    dispute_life_cycle_stage: "INQUIRY",
    links: [{ href: `${API}/v1/customer/disputes/${id}`, rel: "self", method: "GET" }],
  };
}

function page(ids: string[], next?: string) {
  const links = [{ href: `${API}/v1/customer/disputes`, rel: "self", method: "GET" }];
  if (next !== undefined) links.push({ href: next, rel: "next", method: "GET" });
  return { items: ids.map(listed), links };
}

/** A full dispute, shaped like PayPal's documented details answer. */
const fullDispute = {
  ...listed("PP-D-1"),
  dispute_channel: "INTERNAL",
  seller_response_due_date: "2026-11-09T10:00:00.000Z",
  disputed_transactions: [
    {
      seller_transaction_id: "SELLER-TX-1",
      buyer_transaction_id: "BUYER-TX-1",
      invoice_number: "0001",
      gross_amount: { currency_code: "USD", value: "1.00" },
    },
  ],
  messages: [
    {
      posted_by: "BUYER",
      time_posted: "2026-10-30T10:00:00.000Z",
      content: "The logo files were not the agreed format.",
    },
  ],
  evidences: [
    { evidence_type: "PROOF_OF_REFUND", source: "REQUESTED_FROM_SELLER" },
    { evidence_type: "OTHER", source: "REQUESTED_FROM_SELLER" },
    { evidence_type: "OTHER", source: "REQUESTED_FROM_SELLER" },
    { evidence_type: "RECEIPT", source: "SUBMITTED_BY_BUYER" },
  ],
  allowed_response_options: {
    make_offer: { offer_types: ["REFUND", "REFUND_WITH_RETURN"] },
    accept_claim: { accept_claim_types: ["REFUND"] },
  },
  links: [
    { href: `${API}/v1/customer/disputes/PP-D-1`, rel: "self", method: "GET" },
    {
      href: `${API}/v1/customer/disputes/PP-D-1/accept-claim`,
      rel: "accept_claim",
      method: "POST",
    },
    { href: `${API}/v1/customer/disputes/PP-D-1/make-offer`, rel: "make_offer", method: "POST" },
    {
      href: `${API}/v1/customer/disputes/PP-D-1/send-message`,
      rel: "send_message",
      method: "POST",
    },
  ],
};

describe("PayPalDisputes.list", () => {
  it("follows next links over REST and converts each dispute", async () => {
    const next = `${API}/v1/customer/disputes?page_size=50&next_page_token=TOKEN2`;
    const { disputes, restCalls } = setup({
      rest: [page(["PP-D-1", "PP-D-2"], next), page(["PP-D-3"])],
    });
    const result = await disputes.list();

    expect(result.transport).toBe("rest");
    expect(result.fallbackReason).toContain("PAYPAL_API_SETUP_ERROR");
    expect(result.debugId).toBe("dbg-rest");
    expect(result.data.truncated).toBe(false);
    expect(result.data.disputes.map((d) => d.disputeId)).toEqual(["PP-D-1", "PP-D-2", "PP-D-3"]);
    expect(result.data.disputes[0]).toEqual({
      disputeId: "PP-D-1",
      reason: "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED",
      status: "WAITING_FOR_SELLER_RESPONSE",
      state: "REQUIRED_ACTION",
      stage: "INQUIRY",
      amount: { minor: 100, currency: "USD" },
      createdAt: "2026-10-30T10:00:00.000Z",
      updatedAt: "2026-10-30T11:00:00.000Z",
    });
    expect(restCalls.map(({ path, query }) => ({ path, query }))).toEqual([
      { path: "/v1/customer/disputes", query: { page_size: 50 } },
      { path: "/v1/customer/disputes", query: { page_size: "50", next_page_token: "TOKEN2" } },
    ]);
  });

  it("returns an empty list, and accepts a page with no items field", async () => {
    const { disputes } = setup({ mcp: "none", rest: [{ links: [] }] });
    expect((await disputes.list()).data).toEqual({ disputes: [], truncated: false });
  });

  it("stops at the page limit and marks the list as truncated", async () => {
    const next = `${API}/v1/customer/disputes?next_page_token=MORE`;
    const pages = Array.from({ length: MAX_DISPUTE_PAGES + 1 }, (_, i) =>
      page([`PP-D-${i}`], next),
    );
    const { disputes, restCalls } = setup({ mcp: "none", rest: pages });
    const result = await disputes.list();
    expect(result.data.truncated).toBe(true);
    expect(result.data.disputes).toHaveLength(MAX_DISPUTE_PAGES);
    expect(restCalls).toHaveLength(MAX_DISPUTE_PAGES);
  });

  it("pages through MCP by page number when MCP works", async () => {
    const { disputes, restCalls, mcpCalls } = setup({
      mcp: [page(["PP-D-1"], "next-page"), page(["PP-D-2"])],
    });
    const result = await disputes.list();
    expect(result.transport).toBe("mcp");
    expect(result.data.disputes.map((d) => d.disputeId)).toEqual(["PP-D-1", "PP-D-2"]);
    expect(mcpCalls).toEqual([
      { tool: "list_disputes", args: { page: 1, page_size: 50 } },
      { tool: "list_disputes", args: { page: 2, page_size: 50 } },
    ]);
    expect(restCalls).toEqual([]);
  });

  it("falls back to REST when an MCP page has the wrong shape", async () => {
    const { disputes } = setup({ mcp: [{ items: "nope" }], rest: [page(["PP-D-9"])] });
    const result = await disputes.list();
    expect(result.transport).toBe("rest");
    expect(result.data.disputes.map((d) => d.disputeId)).toEqual(["PP-D-9"]);
  });

  it("rejects a listed dispute without an id", async () => {
    const { disputes } = setup({ mcp: "none", rest: [{ items: [{ status: "OPEN" }], links: [] }] });
    const error = await disputes.list().catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(PayPalResponseError);
    expect((error as PayPalResponseError).issues.join()).toMatch(/dispute_id/);
  });
});

describe("PayPalDisputes.get", () => {
  it("reads deadline, transactions, messages, allowed actions and offer types", async () => {
    const { disputes, restCalls } = setup({ rest: [fullDispute] });
    const result = await disputes.get("PP-D-1");

    expect(restCalls[0]).toMatchObject({ method: "GET", path: "/v1/customer/disputes/PP-D-1" });
    expect(result.data).toMatchObject({
      disputeId: "PP-D-1",
      stage: "INQUIRY",
      channel: "INTERNAL",
      amount: { minor: 100, currency: "USD" },
      sellerResponseDueDate: "2026-11-09T10:00:00.000Z",
      buyerResponseDueDate: undefined,
      transactions: [
        {
          sellerTransactionId: "SELLER-TX-1",
          buyerTransactionId: "BUYER-TX-1",
          invoiceNumber: "0001",
        },
      ],
      messages: [
        {
          postedBy: "BUYER",
          postedAt: "2026-10-30T10:00:00.000Z",
          content: "The logo files were not the agreed format.",
        },
      ],
      allowedActions: ["accept_claim", "make_offer", "send_message"],
      allowedOfferTypes: ["REFUND", "REFUND_WITH_RETURN"],
      requestedEvidence: ["PROOF_OF_REFUND", "OTHER"],
      outcome: undefined,
    });
  });

  it("reads a minimal dispute and keeps unknown values as PayPal's text", async () => {
    const { disputes, mcpCalls } = setup({
      mcp: [
        {
          dispute_id: "PP-D-2",
          status: "SOME_NEW_STATUS",
          dispute_life_cycle_stage: "SOME_NEW_STAGE",
          messages: [{ posted_by: "SELLER" }],
          dispute_outcome: { outcome_code: "RESOLVED_SELLER_FAVOUR" },
        },
      ],
    });
    const result = await disputes.get("PP-D-2");

    expect(mcpCalls).toEqual([{ tool: "get_dispute", args: { dispute_id: "PP-D-2" } }]);
    expect(result).toMatchObject({
      transport: "mcp",
      data: {
        status: "SOME_NEW_STATUS",
        stage: "SOME_NEW_STAGE",
        reason: undefined,
        amount: undefined,
        transactions: [],
        messages: [{ postedBy: "SELLER", postedAt: undefined, content: "" }],
        allowedActions: [],
        allowedOfferTypes: [],
        requestedEvidence: [],
        outcome: "RESOLVED_SELLER_FAVOUR",
      },
    });
  });
});

/** The full dispute with only the given actions allowed. */
function allowing(actions: string[]) {
  return {
    ...fullDispute,
    links: [
      { href: `${API}/v1/customer/disputes/PP-D-1`, rel: "self", method: "GET" },
      ...actions.map((rel) => ({
        href: `${API}/v1/customer/disputes/PP-D-1/${rel}`,
        rel,
        method: "POST",
      })),
    ],
  };
}

const accepted = {
  links: [{ href: `${API}/v1/customer/disputes/PP-D-1`, rel: "self", method: "GET" }],
};
const pdfFile = {
  filename: "delivery.pdf",
  bytes: new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31]),
};
const offer = {
  offerType: "REFUND",
  amount: { minor: 50, currency: "USD" },
  note: "Half refund",
  requestId: "r-offer",
};

describe("PayPalDisputes answers", () => {
  it("makes an allowed offer after re-reading the dispute", async () => {
    const { disputes, restCalls } = setup({ mcp: "none", rest: [fullDispute, accepted] });
    const result = await disputes.makeOffer("PP-D-1", offer);

    expect(result).toEqual({
      data: { disputeId: "PP-D-1" },
      transport: "rest",
      debugId: "dbg-rest",
    });
    expect(restCalls.map(({ method, path }) => `${method} ${path}`)).toEqual([
      "GET /v1/customer/disputes/PP-D-1",
      "POST /v1/customer/disputes/PP-D-1/make-offer",
    ]);
    expect(restCalls[1]).toMatchObject({
      requestId: "r-offer",
      body: {
        note: "Half refund",
        offer_type: "REFUND",
        offer_amount: { currency_code: "USD", value: "0.50" },
      },
    });
  });

  it.each([
    [
      "an offer type PayPal does not allow",
      fullDispute,
      { ...offer, offerType: "REPLACEMENT" },
      "make_offer REPLACEMENT",
      ["REFUND", "REFUND_WITH_RETURN"],
    ],
    [
      "an offer when offers are not allowed",
      allowing(["provide_evidence"]),
      offer,
      "make_offer",
      ["provide_evidence"],
    ],
  ])("refuses %s without sending anything", async (_label, dispute, input, action, allowed) => {
    const { disputes, restCalls } = setup({ mcp: "none", rest: [dispute] });
    const error = await disputes.makeOffer("PP-D-1", input).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(DisputeActionNotAllowed);
    expect(error).toMatchObject({ disputeId: "PP-D-1", action, allowed });
    expect(restCalls).toHaveLength(1);
  });

  it("sends evidence as PayPal's multipart form", async () => {
    const { disputes, restCalls } = setup({
      mcp: "none",
      rest: [allowing(["provide_evidence"]), accepted],
    });
    await disputes.provideEvidence("PP-D-1", {
      evidenceType: "PROOF_OF_FULFILLMENT",
      notes: "Delivered on 1 Nov",
      files: [pdfFile],
      requestId: "r-evidence",
    });

    const send = restCalls[1];
    expect(send).toMatchObject({
      path: "/v1/customer/disputes/PP-D-1/provide-evidence",
      requestId: "r-evidence",
    });
    const form = (send as { form: FormData }).form;
    const input = form.get("input") as Blob;
    expect(input.type).toBe("application/json");
    expect(JSON.parse(await input.text())).toEqual({
      evidences: [
        {
          evidence_type: "PROOF_OF_FULFILLMENT",
          notes: "Delivered on 1 Nov",
          documents: [{ name: "delivery.pdf" }],
        },
      ],
    });
    const file = form.get("file1") as File;
    expect([file.name, file.type, file.size]).toEqual(["delivery.pdf", "application/pdf", 6]);
  });

  it("rejects a bad file before reading the dispute or sending", async () => {
    const { disputes, restCalls } = setup({ mcp: "none" });
    await expect(
      disputes.provideEvidence("PP-D-1", {
        evidenceType: "OTHER",
        notes: "x",
        files: [{ filename: "a.txt", bytes: new Uint8Array([1, 2]) }],
        requestId: "r",
      }),
    ).rejects.toBeInstanceOf(EvidenceFileError);
    expect(restCalls).toEqual([]);
  });

  it("appeals with notes and files when PayPal allows it", async () => {
    const { disputes, restCalls } = setup({ mcp: "none", rest: [allowing(["appeal"]), accepted] });
    await disputes.appeal("PP-D-1", {
      evidenceType: "OTHER",
      notes: "New proof",
      files: [pdfFile],
      requestId: "r-appeal",
    });
    expect(restCalls[1]).toMatchObject({
      path: "/v1/customer/disputes/PP-D-1/appeal",
      requestId: "r-appeal",
    });
  });

  it("accepts a full-refund claim over MCP when MCP works", async () => {
    const { disputes, restCalls, mcpCalls } = setup({ mcp: [fullDispute, { ok: true }] });
    const result = await disputes.acceptClaim("PP-D-1", {
      note: "accepted_by_seller",
      requestId: "r-accept",
    });
    expect(result.transport).toBe("mcp");
    expect(mcpCalls.map((call) => call.tool)).toEqual(["get_dispute", "accept_dispute_claim"]);
    expect(mcpCalls[1]?.args).toEqual({ dispute_id: "PP-D-1", note: "accepted_by_seller" });
    expect(restCalls).toEqual([]);
  });

  it("falls back to REST to accept a claim when MCP clearly failed", async () => {
    const { disputes, restCalls } = setup({ rest: [fullDispute, accepted] });
    const result = await disputes.acceptClaim("PP-D-1", {
      note: "accepted_by_seller",
      requestId: "r-accept",
    });
    expect(result.transport).toBe("rest");
    expect(result.fallbackReason).toContain("PAYPAL_API_SETUP_ERROR");
    expect(restCalls[1]).toMatchObject({
      path: "/v1/customer/disputes/PP-D-1/accept-claim",
      requestId: "r-accept",
      body: { note: "accepted_by_seller" },
    });
  });

  it.each([
    [
      "a partial refund",
      { note: "partial", refundAmount: { minor: 25, currency: "USD" } },
      { note: "partial", refund_amount: { currency_code: "USD", value: "0.25" } },
    ],
    ["a note MCP cannot take", { note: "Refunding in full." }, { note: "Refunding in full." }],
  ])("accepts %s over REST only", async (_label, input, body) => {
    const { disputes, restCalls, mcpCalls } = setup({ rest: [fullDispute, accepted] });
    const result = await disputes.acceptClaim("PP-D-1", { ...input, requestId: "r" });
    expect(result.transport).toBe("rest");
    expect(mcpCalls.map((call) => call.tool)).toEqual(["get_dispute"]);
    expect(restCalls[1]).toMatchObject({ body });
  });

  it("sends answers to the same dispute one at a time, even after a refused one", async () => {
    const { disputes, restCalls } = setup({
      mcp: "none",
      rest: [fullDispute, fullDispute, accepted],
    });
    const results = await Promise.allSettled([
      disputes.makeOffer("PP-D-1", { ...offer, offerType: "REPLACEMENT" }),
      disputes.makeOffer("PP-D-1", offer),
    ]);
    expect(results.map((r) => r.status)).toEqual(["rejected", "fulfilled"]);
    expect(restCalls.map(({ method }) => method)).toEqual(["GET", "GET", "POST"]);
  });
});

describe("escalating and sandbox verdict steps", () => {
  const moves = [
    [
      "escalates an inquiry to a claim",
      "escalate",
      (d: PayPalSandboxDisputes) => d.escalate("PP-D-1", { note: "Please review", requestId: "r" }),
      { note: "Please review" },
    ],
    [
      "messages the buyer",
      "send_message",
      (d: PayPalSandboxDisputes) => d.sendMessage("PP-D-1", { message: "Hello", requestId: "r" }),
      { message: "Hello" },
    ],
    [
      "asks the seller for evidence",
      "require_evidence",
      (d: PayPalSandboxDisputes) => d.requireEvidence("PP-D-1", "seller", "r"),
      { action: "SELLER_EVIDENCE" },
    ],
    [
      "asks the buyer for evidence",
      "require_evidence",
      (d: PayPalSandboxDisputes) => d.requireEvidence("PP-D-1", "buyer", "r"),
      { action: "BUYER_EVIDENCE" },
    ],
    [
      "settles for the seller",
      "adjudicate",
      (d: PayPalSandboxDisputes) => d.adjudicate("PP-D-1", "seller", "r"),
      { adjudication_outcome: "SELLER_FAVOR" },
    ],
    [
      "settles for the buyer",
      "adjudicate",
      (d: PayPalSandboxDisputes) => d.adjudicate("PP-D-1", "buyer", "r"),
      { adjudication_outcome: "BUYER_FAVOR" },
    ],
  ] as const;

  it.each(moves)("%s when PayPal allows it", async (_label, action, send, body) => {
    const { sandbox, restCalls } = setup({ mcp: "none", rest: [allowing([action]), accepted] });
    const result = await send(sandbox);
    expect(result).toEqual({
      data: { disputeId: "PP-D-1" },
      transport: "rest",
      debugId: "dbg-rest",
    });
    expect(restCalls[1]).toMatchObject({
      method: "POST",
      path: `/v1/customer/disputes/PP-D-1/${action.replace("_", "-")}`,
      requestId: "r",
      body,
    });
  });

  it.each(moves)("refuses to: %s, when PayPal does not allow it", async (_label, action, send) => {
    const { sandbox, restCalls } = setup({ mcp: "none", rest: [allowing(["make_offer"])] });
    await expect(send(sandbox)).rejects.toMatchObject({ action, allowed: ["make_offer"] });
    expect(restCalls).toHaveLength(1);
  });

  it("accepts an empty reply from PayPal", async () => {
    const { sandbox } = setup({ mcp: "none", rest: [allowing(["adjudicate"]), undefined] });
    const result = await sandbox.adjudicate("PP-D-1", "seller", "r");
    expect(result.data).toEqual({ disputeId: "PP-D-1" });
  });
});
