import { describe, expect, it } from "vitest";
import { MAX_DISPUTE_PAGES, PayPalDisputes } from "./disputes.js";
import { PayPalResponseError } from "./errors.js";
import { fakeClients } from "./test-fakes.js";

function setup(options: Parameters<typeof fakeClients>[0] = {}) {
  const { rest, mcp, fallback, restCalls, mcpCalls } = fakeClients(options);
  return { disputes: new PayPalDisputes(rest, mcp, fallback), restCalls, mcpCalls };
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
        outcome: "RESOLVED_SELLER_FAVOUR",
      },
    });
  });
});
