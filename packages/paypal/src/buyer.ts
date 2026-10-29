import { z } from "zod";
import { PayPalResponseError } from "./errors.js";
import { fromPayPalMoney, toPayPalMoney, type MinorAmount } from "./money.js";
import type { PayPalRestClient } from "./rest.js";

const TRANSACTIONS_PATH = "/v1/reporting/transactions";
const DISPUTES_PATH = "/v1/customer/disputes";

/** Dispute reasons the test setup can open with. */
export const TEST_DISPUTE_REASONS = {
  "not-as-described": "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED",
  "not-received": "MERCHANDISE_OR_SERVICE_NOT_RECEIVED",
} as const;

export type TestDisputeReason = keyof typeof TEST_DISPUTE_REASONS;

/** One payment as the buyer's account records it. */
export interface BuyerPayment {
  transactionId: string;
  /** Always positive; the buyer's own record shows it as a negative amount. */
  amount: MinorAmount;
  initiatedAt: string;
}

const transactionList = z.looseObject({
  transaction_details: z
    .array(
      z.looseObject({
        transaction_info: z.looseObject({
          transaction_id: z.string(),
          transaction_initiation_date: z.string(),
          transaction_amount: z.looseObject({ currency_code: z.string(), value: z.string() }),
        }),
      }),
    )
    .default([]),
});

const openedDispute = z.looseObject({
  dispute_id: z.string().optional(),
  links: z.array(z.looseObject({ rel: z.string(), href: z.string() })).default([]),
});

/** PayPal's search wants seconds-precision UTC times. */
const searchTime = (ms: number) => new Date(ms).toISOString().replace(/\.\d{3}Z$/, "Z");

/**
 * Buyer-side actions for the sandbox test setup only: finding the buyer's
 * record of a payment and opening a dispute on it. Real buyers file their own
 * disputes in PayPal; PactPal never does this for them (docs/scope.md).
 */
export class PayPalBuyerTestActions {
  readonly #rest: Pick<PayPalRestClient, "request">;

  constructor(rest: Pick<PayPalRestClient, "request">) {
    this.#rest = rest;
  }

  /**
   * The newest payment of exactly `amount` made between `since` and `until`
   * (milliseconds), or undefined if PayPal's search does not show one yet.
   */
  async findPurchase(input: {
    amount: MinorAmount;
    since: number;
    until: number;
  }): Promise<BuyerPayment | undefined> {
    const { data } = await this.#rest.request({
      method: "GET",
      path: TRANSACTIONS_PATH,
      query: {
        start_date: searchTime(input.since),
        end_date: searchTime(input.until),
        fields: "transaction_info",
        page_size: 100,
      },
      schema: transactionList,
    });
    const matches = data.transaction_details
      .map(({ transaction_info: info }): BuyerPayment | undefined => {
        const value = info.transaction_amount.value.replace(/^-/, "");
        let amount: MinorAmount;
        try {
          amount = fromPayPalMoney({ currency_code: info.transaction_amount.currency_code, value });
        } catch {
          return undefined;
        }
        return {
          transactionId: info.transaction_id,
          amount,
          initiatedAt: info.transaction_initiation_date,
        };
      })
      .filter(
        (payment): payment is BuyerPayment =>
          payment?.amount.minor === input.amount.minor &&
          payment.amount.currency === input.amount.currency,
      )
      .sort((a, b) => Date.parse(b.initiatedAt) - Date.parse(a.initiatedAt));
    return matches[0];
  }

  /** Opens a dispute on the buyer's payment, as the buyer. */
  async openDispute(input: {
    buyerTransactionId: string;
    reason: TestDisputeReason;
    amount: MinorAmount;
    message: string;
    requestId: string;
  }): Promise<{ disputeId: string }> {
    const operation = `POST ${DISPUTES_PATH}`;
    const { data, debugId } = await this.#rest.request({
      method: "POST",
      path: DISPUTES_PATH,
      requestId: input.requestId,
      body: {
        disputed_transactions: [{ buyer_transaction_id: input.buyerTransactionId }],
        reason: TEST_DISPUTE_REASONS[input.reason],
        dispute_amount: toPayPalMoney(input.amount),
        message: input.message,
      },
      schema: openedDispute,
    });
    const disputeId =
      data.dispute_id ??
      data.links
        .find((link) => link.rel === "self")
        ?.href.split("/")
        .pop();
    if (disputeId === undefined || disputeId === "") {
      throw new PayPalResponseError(operation, ["no dispute id or link"], debugId);
    }
    return { disputeId };
  }
}
