import { sha256Hex } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import {
  MilestoneNotAllowedError,
  createDeal,
  dropFailedInvoice,
  findMilestoneByInvoice,
  listMilestones,
  markInvoicePaid,
  markInvoiceSent,
  readLedger,
  recordInvoiceId,
  startInvoice,
  verifyStoredLedger,
  type StartInvoice,
} from "./index.js";
import {
  TEST_NOW,
  createSignedTestDeal,
  createTestDeal,
  testDeal,
  testId,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();
const at = (minutes: number) => new Date(TEST_NOW.getTime() + minutes * 60_000);
const refusal = (reason: string) => new MilestoneNotAllowedError(reason as never);

/** A signed deal and the start of stage 1's invoice, ready to override. */
async function signed() {
  const deal = await createSignedTestDeal(db);
  const start: StartInvoice = {
    dealId: deal.dealId,
    sellerId: deal.seller.id,
    version: 1,
    stage: 1,
    amountMinor: 12_000,
    currency: "USD",
    requestId: `pp-${deal.dealId}-v1-s1`,
    invoiceSha256: "a".repeat(64),
  };
  const sent = {
    dealId: deal.dealId,
    sellerId: deal.seller.id,
    version: 1,
    stage: 1,
    invoiceId: "INV2-AAAA-BBBB",
    payUrl: "https://www.sandbox.paypal.com/invoice/p/#INV2AAAABBBB",
    transport: "rest" as const,
    recipientEmail: "Chris@Example.com",
    contentSha256: deal.scope.contentSha256,
  };
  return { ...deal, start, sent };
}

describe("milestone invoices", () => {
  it("reserves a stage, then records it as sent once, with its log entry", async () => {
    const { dealId, start, sent, scope } = await signed();
    const reserved = await startInvoice(db, start, at(1));
    expect(reserved).toMatchObject({
      dealId,
      version: 1,
      stage: 1,
      amountMinor: 12_000,
      currency: "USD",
      status: "sending",
      invoiceId: null,
      ledgerSeq: null,
      sentAt: null,
    });
    // A retry of the same stage gets the same reservation back.
    expect(await startInvoice(db, start, at(2))).toEqual(reserved);

    const { milestone, entry } = await markInvoiceSent(db, sent, at(3));
    expect(milestone).toMatchObject({
      status: "sent",
      invoiceId: "INV2-AAAA-BBBB",
      payUrl: sent.payUrl,
      sentAt: at(3),
      ledgerSeq: entry?.seq,
    });
    expect(entry).toMatchObject({
      type: "INVOICE_SENT",
      actor: "seller",
      payload: {
        version: 1,
        stage: 1,
        invoiceId: "INV2-AAAA-BBBB",
        amountMinor: 12_000,
        currency: "USD",
        contentSha256: scope.contentSha256,
        invoiceSha256: "a".repeat(64),
        recipientEmailSha256: sha256Hex("chris@example.com"),
        transport: "rest",
      },
    });
    expect(JSON.stringify(entry)).not.toContain("xample");

    // Recording it again changes nothing and adds no entry; starting it again is refused.
    expect((await markInvoiceSent(db, sent, at(4))).entry).toBeUndefined();
    await expect(startInvoice(db, start, at(5))).rejects.toEqual(refusal("already-sent"));
    expect((await readLedger(db, dealId)).filter((e) => e.type === "INVOICE_SENT")).toHaveLength(1);
    expect(await listMilestones(db, dealId)).toEqual([milestone]);
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
  });

  it("keeps a created-but-unsent invoice's id, and drops only a reservation with no invoice", async () => {
    const { dealId, start } = await signed();
    await startInvoice(db, start, at(1));
    await startInvoice(db, { ...start, stage: 2, amountMinor: 13_000, requestId: "r2" }, at(1));
    await recordInvoiceId(db, { dealId, stage: 1 }, "INV2-KEPT");
    await dropFailedInvoice(db, { dealId, stage: 1 });
    await dropFailedInvoice(db, { dealId, stage: 2 });
    expect((await listMilestones(db, dealId)).map((m) => [m.stage, m.invoiceId])).toEqual([
      [1, "INV2-KEPT"],
    ]);
  });

  it("refuses another person, an unsigned deal, a version that was not signed, and a missing stage", async () => {
    const { buyer, start, sent } = await signed();
    await expect(startInvoice(db, { ...start, sellerId: buyer.id }, at(1))).rejects.toEqual(
      refusal("not-your-deal"),
    );
    await expect(startInvoice(db, { ...start, version: 2 }, at(1))).rejects.toEqual(
      refusal("not-signed"),
    );
    // Recording a stage that was never started.
    await expect(markInvoiceSent(db, { ...sent, stage: 2 }, at(1))).rejects.toEqual(
      refusal("not-signed"),
    );
    await expect(startInvoice(db, { ...start, dealId: testId(999) }, at(1))).rejects.toThrow(
      /No deal/,
    );
  });

  it("refuses a deal that is not signed yet", async () => {
    const { seller, dealId } = await createTestDeal(db);
    const { deal } = await createDeal(db, testDeal(seller.id, { id: testId(101) }), at(0));
    for (const id of [dealId, deal.id]) {
      await expect(
        startInvoice(
          db,
          {
            dealId: id,
            sellerId: seller.id,
            version: 1,
            stage: 1,
            amountMinor: 100,
            currency: "USD",
            requestId: `r-${id}`,
            invoiceSha256: "b".repeat(64),
          },
          at(1),
        ),
      ).rejects.toEqual(refusal("not-signed"));
    }
  });

  it("records a payment once, from PayPal's own answer, and finds the stage by invoice", async () => {
    const { dealId, start, sent } = await signed();
    await startInvoice(db, start, at(1));
    await markInvoiceSent(db, sent, at(2));
    expect(await findMilestoneByInvoice(db, "INV2-AAAA-BBBB")).toMatchObject({
      stage: 1,
      status: "sent",
    });
    expect(await findMilestoneByInvoice(db, "INV2-UNKNOWN")).toBeUndefined();

    const paid = {
      dealId,
      version: 1,
      stage: 1,
      invoiceId: "INV2-AAAA-BBBB",
      paidAmount: { minor: 12_000, currency: "USD" },
      transactions: [
        { paymentId: "5TY05013RG002845M", paymentDate: "2026-11-02", method: "PAYPAL" },
        {},
      ],
      source: "notification" as const,
      eventId: "WH-PAID-1",
    };
    const { milestone, entry } = await markInvoicePaid(db, paid, at(3));
    expect(milestone).toMatchObject({
      status: "paid",
      paidAt: at(3),
      paymentLedgerSeq: entry?.seq,
      transactionId: "5TY05013RG002845M",
    });
    expect(entry).toMatchObject({
      type: "PAYMENT_RECEIVED",
      actor: "system",
      payload: {
        version: 1,
        stage: 1,
        invoiceId: "INV2-AAAA-BBBB",
        amountMinor: 12_000,
        currency: "USD",
        transactions: [
          { paymentId: "5TY05013RG002845M", paymentDate: "2026-11-02", method: "PAYPAL" },
          { paymentId: null, paymentDate: null, method: null },
        ],
        source: "notification",
        eventId: "WH-PAID-1",
      },
    });
    expect(entry?.actorId).toBeUndefined();

    // Learned again (a repeat notification, or the button): nothing new.
    const again = await markInvoicePaid(
      db,
      { ...paid, source: "status-check", eventId: undefined },
      at(4),
    );
    expect(again.entry).toBeUndefined();
    expect(
      (await readLedger(db, dealId)).filter((e) => e.type === "PAYMENT_RECEIVED"),
    ).toHaveLength(1);
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
  });

  it("refuses to mark paid a stage never sent, another invoice, or an unknown deal", async () => {
    const { dealId, start, sent } = await signed();
    const paid = {
      dealId,
      version: 1,
      stage: 1,
      invoiceId: "INV2-AAAA-BBBB",
      paidAmount: { minor: 12_000, currency: "USD" },
      transactions: [],
      source: "status-check" as const,
    };
    await expect(markInvoicePaid(db, paid, at(1))).rejects.toEqual(refusal("not-sent"));
    await startInvoice(db, start, at(1));
    await expect(markInvoicePaid(db, paid, at(2))).rejects.toEqual(refusal("not-sent"));
    await markInvoiceSent(db, sent, at(2));
    await expect(markInvoicePaid(db, { ...paid, invoiceId: "INV2-OTHER" }, at(3))).rejects.toEqual(
      refusal("not-sent"),
    );
    expect(
      (await markInvoicePaid(db, { ...paid, transactions: [] }, at(3))).milestone.transactionId,
    ).toBeNull();
    await expect(markInvoicePaid(db, { ...paid, dealId: testId(999) }, at(4))).rejects.toThrow(
      /No deal/,
    );
  });
});
