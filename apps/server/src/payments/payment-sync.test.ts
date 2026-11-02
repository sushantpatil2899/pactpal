import {
  listMilestones,
  markInvoiceSent,
  readLedger,
  startInvoice,
  verifyStoredLedger,
} from "@pactpal/db";
import { StandInEmailSender, type EmailSender } from "@pactpal/email";
import { capturingEmail } from "../email/email-test-support.js";
import { createSignedTestDeal, TEST_NOW, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { checkInvoicePaid, paymentNotifications, type PaymentSyncDeps } from "./payment-sync.js";
import { fakePayPal } from "./paypal-test-support.js";

const db = useMigratedTestDatabase();

/** A signed test deal whose stage 1 invoice (INV2-1) was sent; the deps with fakes. */
async function sentStage(email: EmailSender = capturingEmail().email) {
  const deal = await createSignedTestDeal(db);
  const key = { dealId: deal.dealId, sellerId: deal.seller.id, version: 1, stage: 1 };
  await startInvoice(
    db,
    {
      ...key,
      amountMinor: 12_000,
      currency: "USD",
      requestId: "pp-1",
      invoiceSha256: "a".repeat(64),
    },
    TEST_NOW,
  );
  await markInvoiceSent(
    db,
    {
      ...key,
      invoiceId: "INV2-1",
      transport: "rest",
      recipientEmail: deal.buyer.email,
      contentSha256: deal.scope.contentSha256,
    },
    TEST_NOW,
  );
  const paypal = fakePayPal();
  const lines: string[] = [];
  const write = (details: object, message: string) => {
    lines.push(JSON.stringify({ ...details, msg: message }));
  };
  const log = { info: write, warn: write, error: write };
  const deps: PaymentSyncDeps = {
    db,
    invoices: paypal.invoices,
    email,
    clock: () => TEST_NOW,
    log,
  };
  return { ...deal, paypal, deps, lines };
}

const payments = async (dealId: string) =>
  (await readLedger(db, dealId)).filter((e) => e.type === "PAYMENT_RECEIVED");

describe("checkInvoicePaid", () => {
  it("records nothing until PayPal itself says the invoice is paid", async () => {
    const { deps, dealId } = await sentStage();
    expect(await checkInvoicePaid(deps, "INV2-1", { kind: "status-check" })).toBe("not-paid");
    expect(await payments(dealId)).toHaveLength(0);
  });

  it("records a paid invoice once, from PayPal's answer, and emails both sides", async () => {
    const box = capturingEmail();
    const { deps, dealId, paypal, lines } = await sentStage(box.email);
    paypal.paid.add("INV2-1");
    expect(await checkInvoicePaid(deps, "INV2-1", { kind: "notification", eventId: "WH-9" })).toBe(
      "paid",
    );
    expect(await payments(dealId)).toEqual([
      expect.objectContaining({
        actor: "system",
        payload: expect.objectContaining({
          stage: 1,
          invoiceId: "INV2-1",
          amountMinor: 12_000,
          source: "notification",
          eventId: "WH-9",
          transactions: [{ paymentId: "TX-INV2-1", paymentDate: "2026-11-02", method: "PAYPAL" }],
        }) as unknown,
      }),
    ]);
    expect((await listMilestones(db, dealId))[0]).toMatchObject({
      status: "paid",
      transactionId: "TX-INV2-1",
    });
    expect(box.sent.map((m) => [m.kind, m.to, m.idempotencyKey])).toEqual([
      ["payment", "chris@example.com", `payment:${dealId}:v1:s1:buyer`],
      ["payment", "maya@example.com", `payment:${dealId}:v1:s1:seller`],
    ]);
    expect(box.sent[0]?.text).toContain(
      "PayPal confirmed your payment of 120.00 USD for stage 1 of 2",
    );
    expect(box.sent[0]?.text).toContain("PayPal transaction: TX-INV2-1");

    // Learned again: nothing new, no more emails, and PayPal is not even asked.
    const reads = paypal.state.reads;
    expect(await checkInvoicePaid(deps, "INV2-1", { kind: "status-check" })).toBe("already-paid");
    expect(paypal.state.reads).toBe(reads);
    expect(box.sent).toHaveLength(2);
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
    expect(lines.join("")).not.toContain("example.com");
  });

  it("ignores an invoice PactPal did not send, and one not sent yet", async () => {
    const { deps } = await sentStage();
    expect(await checkInvoicePaid(deps, "INV2-NOT-OURS", { kind: "status-check" })).toBe("unknown");
    await db.query("UPDATE milestones SET status = 'sending', ledger_seq = NULL, sent_at = NULL");
    expect(await checkInvoicePaid(deps, "INV2-1", { kind: "status-check" })).toBe("not-paid");
  });

  it("passes PayPal failures on, so a notification is tried again", async () => {
    const { deps, paypal } = await sentStage();
    paypal.state.mode = "down";
    await expect(checkInvoicePaid(deps, "INV2-1", { kind: "status-check" })).rejects.toThrow();
  });

  it("keeps the payment when an email fails or email is off", async () => {
    const failing = capturingEmail(["chris@example.com"]);
    const { deps, dealId, paypal, lines } = await sentStage(failing.email);
    paypal.paid.add("INV2-1");
    expect(await checkInvoicePaid(deps, "INV2-1", { kind: "status-check" })).toBe("paid");
    expect(failing.sent.map((m) => m.to)).toEqual(["maya@example.com"]);
    expect(lines.join("")).toContain('"sent":false');
    expect(await payments(dealId)).toHaveLength(1);
  });

  it("keeps the payment when the emails cannot even be prepared", async () => {
    const off = new StandInEmailSender({ info: () => undefined });
    const { deps, dealId, paypal, lines } = await sentStage(off);
    paypal.paid.add("INV2-1");
    const broken: EmailSender = {
      live: true,
      send: () => Promise.reject(new TypeError("broken")),
    };
    expect(
      await checkInvoicePaid({ ...deps, email: broken }, "INV2-1", { kind: "status-check" }),
    ).toBe("paid");
    expect(lines.join("")).toContain("Payment email failed");
    expect(await payments(dealId)).toHaveLength(1);
  });
});

describe("paymentNotifications", () => {
  const notify = (deps: PaymentSyncDeps, body: unknown, eventType = "INVOICING.INVOICE.PAID") =>
    paymentNotifications(deps)({ eventId: "WH-1", eventType, body: body as never });

  it("checks the invoice named in either shape PayPal uses", async () => {
    const { deps, dealId, paypal } = await sentStage();
    paypal.paid.add("INV2-1");
    await notify(deps, { resource: { invoice: { id: "INV2-1" } } });
    expect(await payments(dealId)).toHaveLength(1);
    await notify(deps, { resource: { id: "INV2-1", status: "PAID" } });
    expect(await payments(dealId)).toHaveLength(1);
  });

  it("acts only on invoice-paid notifications that name an invoice", async () => {
    const { deps, paypal, lines } = await sentStage();
    paypal.paid.add("INV2-1");
    await notify(deps, { resource: { id: "INV2-1" } }, "INVOICING.INVOICE.CREATED");
    await notify(deps, { resource: {} });
    await notify(deps, "not an object");
    expect(paypal.state.reads).toBe(0);
    expect(lines.join("")).toContain("without an invoice id");
  });
});
