import type { PaidStage } from "@pactpal/db";
import { describe, expect, it } from "vitest";
import { matchDispute, paymentKeys } from "./match.js";

const stage = (overrides: Partial<PaidStage> = {}): PaidStage => ({
  dealId: "00000000-0000-4000-8000-000000000100",
  stage: 1,
  invoiceId: "INV2-A",
  transactionId: "TX-1",
  invoiceNumber: "0001",
  ...overrides,
});
const paid = (sellerTransactionId?: string, invoiceNumber?: string) => [
  { sellerTransactionId, buyerTransactionId: "BUYER-TX", invoiceNumber },
];

describe("matchDispute", () => {
  it("ties a dispute by the seller's transaction id first", () => {
    expect(matchDispute(paid("TX-1", "9999"), [stage()])).toEqual({
      ok: true,
      link: { dealId: stage().dealId, stage: 1, invoiceId: "INV2-A", matchedBy: "transaction" },
    });
  });

  it("falls back to the invoice the dispute names: its id, as PayPal sends it", () => {
    const found = matchDispute(paid("TX-OTHER", "INV2-A"), [stage({ transactionId: null })]);
    expect(found).toMatchObject({ ok: true, link: { matchedBy: "invoice-number" } });
  });

  it("also accepts the invoice's own number", () => {
    const found = matchDispute(paid("TX-OTHER", "0001"), [stage({ transactionId: null })]);
    expect(found).toMatchObject({ ok: true, link: { matchedBy: "invoice-number" } });
  });

  it("never guesses between two stages, and says when nothing matches", () => {
    const two = [stage(), stage({ stage: 2, invoiceId: "INV2-B" })];
    expect(matchDispute(paid("TX-1"), two)).toEqual({ ok: false, reason: "several-stages" });
    expect(matchDispute(paid("TX-9"), [stage()])).toEqual({ ok: false, reason: "no-paid-stage" });
    expect(matchDispute([], [])).toEqual({ ok: false, reason: "no-paid-stage" });
  });

  it("looks up only the ids the dispute names", () => {
    expect(paymentKeys([...paid("TX-1", undefined), ...paid(undefined, "7")])).toEqual({
      transactionIds: ["TX-1"],
      invoiceNumbers: ["7"],
    });
  });
});
