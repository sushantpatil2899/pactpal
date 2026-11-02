import { listMilestones, readLedger, verifyStoredLedger } from "@pactpal/db";
import { createSignedTestDeal, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { fakePayPal } from "../payments/paypal-test-support.js";

/** A fresh fake PayPal that already knows these invoices as paid (for a second app). */
const signedPayPal = (paid: Set<string>) => {
  const paypal = fakePayPal();
  for (const id of paid) paypal.paid.add(id);
  return paypal;
};
import { buyerVisitors, dealTestApp, signedInAs } from "./test-app.js";

const db = useMigratedTestDatabase();

interface StageView {
  stage: number;
  status: string;
  sentAt: string | null;
  payUrl: string | null;
  invoice?: { to: string; itemName: string; note: string; invoiceSha256: string };
}

/** A signed deal, the app with a fake PayPal, the seller's session and the stage routes. */
async function signedDeal(withPayPal = true) {
  const deal = await createSignedTestDeal(db);
  const paypal = fakePayPal();
  const env = dealTestApp(db, undefined, withPayPal ? { invoices: paypal.invoices } : {});
  const token = await signedInAs(db, deal.seller.id);
  const base = `/api/deals/${deal.dealId}/milestones`;
  const list = async (who = token) =>
    (await env.call("GET", base, who)).json<{
      signed: boolean;
      invoicing: boolean;
      stages: StageView[];
    }>();
  const preview = async (stage: number) =>
    (await list()).stages[stage - 1]?.invoice?.invoiceSha256 ?? "";
  const send = async (stage: number, sha?: string) =>
    env.call("POST", `${base}/${String(stage)}/invoice`, token, {
      invoiceSha256: sha ?? (await preview(stage)),
    });
  return { ...deal, ...env, ...paypal, token, base, list, send };
}

const invoiceEntries = async (dealId: string) =>
  (await readLedger(db, dealId)).filter((e) => e.type === "INVOICE_SENT");

describe("milestone invoices", () => {
  it("shows the seller each stage and the exact invoice before anything is sent", async () => {
    const { app, list, drafts, dealId } = await signedDeal();
    const view = await list();
    expect(view).toMatchObject({ signed: true, invoicing: true });
    expect(view.stages).toHaveLength(2);
    expect(view.stages[0]).toMatchObject({
      stage: 1,
      title: "Deposit",
      amount: { minor: 12_000, currency: "USD", text: "120.00" },
      status: "not_invoiced",
      invoice: { to: "chris@example.com", itemName: "Stage 1 of 2: Deposit" },
    });
    expect(view.stages[0]?.invoice?.note).toContain("signed by Chris Buyer");
    expect(view.stages[1]).toMatchObject({ dueDate: "2026-11-27" });
    expect(drafts).toHaveLength(0);
    expect(await invoiceEntries(dealId)).toHaveLength(0);
    await app.close();
  });

  it("sends one stage, records it once, and gives both sides the pay link", async () => {
    const { app, call, base, send, drafts, dealId, buyer, logs } = await signedDeal();
    const res = await send(1);
    expect(res.statusCode).toBe(200);
    expect(drafts).toEqual([
      expect.objectContaining({
        recipientEmail: "chris@example.com",
        amount: { minor: 12_000, currency: "USD" },
        itemName: "Stage 1 of 2: Deposit",
        requestId: `pp-${dealId}-v1-s1`,
      }),
    ]);
    const stage = res.json<{ stages: StageView[] }>().stages[0];
    expect(stage).toMatchObject({
      status: "sent",
      payUrl: "https://www.sandbox.paypal.com/invoice/p/#INV2-TEST-1",
    });
    expect(stage?.invoice).toBeUndefined();
    expect(await invoiceEntries(dealId)).toEqual([
      expect.objectContaining({
        actor: "seller",
        payload: expect.objectContaining({
          stage: 1,
          invoiceId: "INV2-TEST-1",
          transport: "rest",
        }) as unknown,
      }),
    ]);

    for (const visitor of await buyerVisitors(db, dealId, buyer.id)) {
      const seen = (await call("GET", base, visitor)).json<{ stages: StageView[] }>();
      expect(seen.stages[0]).toMatchObject({ status: "sent", payUrl: stage?.payUrl });
      expect(seen.stages[1]?.invoice).toBeUndefined();
      expect(
        (await call("POST", `${base}/1/invoice`, visitor, { invoiceSha256: "a".repeat(64) }))
          .statusCode,
      ).toBe(403);
    }
    expect(logs.join("")).not.toContain("chris@example.com");
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
    await app.close();
  });

  it("answers a repeated send of a stage already sent with the stage, without asking PayPal", async () => {
    const { app, send, list, drafts, dealId, call, base, token } = await signedDeal();
    const sha = (await list()).stages[0]?.invoice?.invoiceSha256 ?? "";
    await send(1, sha);
    const again = await call("POST", `${base}/1/invoice`, token, { invoiceSha256: sha });
    expect(again.statusCode).toBe(200);
    expect(again.json<{ stages: StageView[] }>().stages[0]?.status).toBe("sent");
    expect(drafts).toHaveLength(1);
    expect(await invoiceEntries(dealId)).toHaveLength(1);
    await app.close();
  });

  it("drops the reservation when PayPal refuses, showing only PayPal's code", async () => {
    const { app, send, state, dealId } = await signedDeal();
    state.mode = "refuse";
    const res = await send(1);
    expect(res.statusCode).toBe(502);
    expect(res.json()).toEqual({ error: "PayPal refused the invoice (INVALID_EMAIL)" });
    expect(JSON.stringify(res.json())).not.toContain("secret text");
    expect(await listMilestones(db, dealId)).toEqual([]);
    await app.close();
  });

  it("keeps a created-but-unsent invoice and sends the same one on retry", async () => {
    const { app, send, state, drafts, dealId } = await signedDeal();
    state.mode = "unsent";
    const first = await send(1);
    expect(first.json()).toEqual({ error: "the invoice was created but not sent; try again" });
    expect((await listMilestones(db, dealId))[0]).toMatchObject({
      status: "sending",
      invoiceId: "INV2-TEST-1",
    });
    state.mode = "ok";
    expect((await send(1)).statusCode).toBe(200);
    expect(new Set(drafts.map((d) => d.requestId)).size).toBe(1);
    expect((await listMilestones(db, dealId))[0]).toMatchObject({
      status: "sent",
      invoiceId: "INV2-TEST-1",
    });
    await app.close();
  });

  it("keeps the reservation when PayPal does not answer, and still sends without a pay link", async () => {
    const { app, send, state, dealId } = await signedDeal();
    state.mode = "down";
    expect((await send(2)).json()).toEqual({ error: "PayPal did not answer properly; try again" });
    expect((await listMilestones(db, dealId))[0]?.status).toBe("sending");
    state.mode = "no-link";
    const sent = await send(2);
    expect(sent.json<{ stages: StageView[] }>().stages[1]).toMatchObject({
      status: "sent",
      payUrl: null,
    });
    await app.close();
  });

  it("refuses a stale preview, a stage that does not exist, an unsigned deal and missing PayPal keys", async () => {
    const { app, send, call, base, token } = await signedDeal();
    expect((await send(1, "0".repeat(64))).json()).toEqual({
      error: "the invoice changed; reload the page",
    });
    expect((await send(3, "0".repeat(64))).statusCode).toBe(404);
    expect(
      (await call("POST", `${base}/x/invoice`, token, { invoiceSha256: "0".repeat(64) }))
        .statusCode,
    ).toBe(404);
    await db.query("UPDATE deals SET status = 'draft'");
    expect((await send(1, "0".repeat(64))).json()).toEqual({ error: "the deal is not signed yet" });
    expect((await call("GET", base, token)).json()).toEqual({
      signed: false,
      invoicing: true,
      stages: [],
    });
    await app.close();
  });

  it("says PayPal invoicing is not set up when its keys are missing", async () => {
    const { app, send, list } = await signedDeal(false);
    expect((await list()).invoicing).toBe(false);
    expect((await send(1)).json()).toEqual({ error: "PayPal invoicing is not set up" });
    await app.close();
  });

  it("answers 404 for a deal the person cannot see", async () => {
    const { app, call, token } = await signedDeal();
    expect((await call("GET", `/api/deals/${testId(999)}/milestones`, token)).statusCode).toBe(404);
    await app.close();
  });
});

describe("invoice and payment emails, and checking payment status", () => {
  it("emails the buyer the invoice's link once it is sent", async () => {
    const { app, send, sent, dealId } = await signedDeal();
    await send(1);
    expect(sent.map((m) => [m.kind, m.to, m.idempotencyKey])).toEqual([
      ["invoice", "chris@example.com", `invoice:${dealId}-v1-s1`],
    ]);
    expect(sent[0]?.subject).toBe('Invoice for "Logo design": stage 1 of 2, Deposit (120.00 USD)');
    expect(sent[0]?.text).toContain("Maya Seller sent you a PayPal invoice for stage 1 of 2");
    expect(sent[0]?.text).toContain("https://www.sandbox.paypal.com/invoice/p/#INV2-TEST-1");
    await app.close();
  });

  it("checks with PayPal, marks a paid stage, emails both sides, and is limited to one check at a time", async () => {
    const { app, call, base, token, send, paid, sent, dealId } = await signedDeal();
    await send(1);
    const notYet = await call("POST", `${base}/check`, token);
    expect(notYet.json<{ stages: StageView[] }>().stages[0]?.status).toBe("sent");
    expect((await call("POST", `${base}/check`, token)).statusCode).toBe(429);
    expect(
      (await readLedger(db, dealId)).filter((e) => e.type === "PAYMENT_RECEIVED"),
    ).toHaveLength(0);

    paid.add("INV2-TEST-1");
    const later = dealTestApp(db, undefined, { invoices: signedPayPal(paid).invoices });
    const res = await later.call("POST", `${base}/check`, token);
    expect(
      res.json<{
        stages: (StageView & { paidAt: string | null; transactionId: string | null })[];
      }>().stages[0],
    ).toMatchObject({
      status: "paid",
      transactionId: "TX-INV2-TEST-1",
    });
    expect(later.sent.map((m) => [m.kind, m.to])).toEqual([
      ["payment", "chris@example.com"],
      ["payment", "maya@example.com"],
    ]);
    expect(sent.filter((m) => m.kind === "payment")).toHaveLength(0);
    await later.app.close();
    await app.close();
  });

  it("lets the buyer check too, and reports PayPal not answering or not set up", async () => {
    const { app, call, base, send, state, dealId, buyer } = await signedDeal();
    await send(1);
    const [buyerPayPal = ""] = await buyerVisitors(db, dealId, buyer.id);
    state.mode = "down";
    const res = await call("POST", `${base}/check`, buyerPayPal);
    expect(res.statusCode).toBe(502);
    expect(res.json()).toEqual({ error: "PayPal did not answer; try again" });
    await app.close();

    const off = dealTestApp(db);
    expect((await off.call("POST", `${base}/check`, buyerPayPal)).statusCode).toBe(503);
    await off.app.close();
  });
});
