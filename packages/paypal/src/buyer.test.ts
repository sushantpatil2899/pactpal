import { describe, expect, it } from "vitest";
import { PayPalBuyerTestActions } from "./buyer.js";
import { PayPalResponseError } from "./errors.js";
import { fakeClients } from "./test-fakes.js";

function setup(rest: unknown[] = []) {
  const { rest: client, restCalls } = fakeClients({ mcp: "none", rest });
  return { buyer: new PayPalBuyerTestActions(client), restCalls };
}

const tx = (id: string, value: string, at: string, currency = "USD") => ({
  transaction_info: {
    transaction_id: id,
    transaction_initiation_date: at,
    transaction_amount: { currency_code: currency, value },
  },
});

const dollar = { minor: 100, currency: "USD" };

describe("PayPalBuyerTestActions.findPurchase", () => {
  it("searches the time window and returns the newest payment of exactly that amount", async () => {
    const { buyer, restCalls } = setup([
      {
        transaction_details: [
          tx("OLDER", "-1.00", "2026-10-29T10:00:00+0000"),
          tx("NEWER", "-1.00", "2026-10-29T10:05:00+0000"),
          tx("OTHER-AMOUNT", "-2.00", "2026-10-29T10:06:00+0000"),
          tx("OTHER-CURRENCY", "-1.00", "2026-10-29T10:07:00+0000", "EUR"),
          tx("ODD", "-1.0.0", "2026-10-29T10:08:00+0000"),
        ],
      },
    ]);
    const found = await buyer.findPurchase({
      amount: dollar,
      since: Date.parse("2026-10-29T09:59:00.123Z"),
      until: Date.parse("2026-10-29T10:10:00.999Z"),
    });
    expect(found).toEqual({
      transactionId: "NEWER",
      amount: dollar,
      initiatedAt: "2026-10-29T10:05:00+0000",
    });
    expect(restCalls[0]).toMatchObject({
      method: "GET",
      path: "/v1/reporting/transactions",
      query: {
        start_date: "2026-10-29T09:59:00Z",
        end_date: "2026-10-29T10:10:00Z",
        fields: "transaction_info",
        page_size: 100,
      },
    });
  });

  it("returns undefined when nothing matches yet", async () => {
    const { buyer } = setup([{}]);
    expect(await buyer.findPurchase({ amount: dollar, since: 0, until: 1000 })).toBeUndefined();
  });
});

describe("PayPalBuyerTestActions.openDispute", () => {
  const input = {
    buyerTransactionId: "BUYER-TX",
    reason: "not-as-described" as const,
    amount: dollar,
    message: "Not what was agreed.",
    requestId: "seed-dispute-INV2-1",
  };

  it("opens the dispute as the buyer with a fixed request id", async () => {
    const { buyer, restCalls } = setup([{ dispute_id: "PP-D-1" }]);
    expect(await buyer.openDispute(input)).toEqual({ disputeId: "PP-D-1" });
    expect(restCalls[0]).toMatchObject({
      method: "POST",
      path: "/v1/customer/disputes",
      requestId: "seed-dispute-INV2-1",
      body: {
        disputed_transactions: [{ buyer_transaction_id: "BUYER-TX" }],
        reason: "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED",
        dispute_amount: { currency_code: "USD", value: "1.00" },
        message: "Not what was agreed.",
      },
    });
  });

  it("reads the dispute id from the self link and maps the not-received reason", async () => {
    const { buyer, restCalls } = setup([
      {
        links: [
          { rel: "self", href: "https://api-m.sandbox.paypal.com/v1/customer/disputes/PP-D-2" },
        ],
      },
    ]);
    expect(await buyer.openDispute({ ...input, reason: "not-received" })).toEqual({
      disputeId: "PP-D-2",
    });
    expect(restCalls[0]).toMatchObject({ body: { reason: "MERCHANDISE_OR_SERVICE_NOT_RECEIVED" } });
  });

  it("rejects an answer without a dispute id or link", async () => {
    const { buyer } = setup([{ links: [] }]);
    await expect(buyer.openDispute(input)).rejects.toBeInstanceOf(PayPalResponseError);
  });
});
