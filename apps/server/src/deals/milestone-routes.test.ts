import { listMilestones, readLedger, verifyStoredLedger } from "@pactpal/db";
import { createSignedTestDeal, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import {
  InvoiceSendError,
  PayPalApiError,
  PayPalNetworkError,
  type InvoiceDraft,
} from "@pactpal/paypal";
import { describe, expect, it } from "vitest";
import type { InvoiceSender } from "./milestone-routes.js";
import { buyerVisitors, dealTestApp, signedInAs } from "./test-app.js";

const db = useMigratedTestDatabase();

type Mode = "ok" | "refuse" | "unsent" | "down" | "no-link";

/** A stand-in for PayPal: one invoice id per request id, as PayPal does; `mode` makes it fail. */
function fakePayPal() {
  const drafts: InvoiceDraft[] = [];
  const ids = new Map<string, string>();
  const state: { mode: Mode } = { mode: "ok" };
  const invoices: InvoiceSender = {
    createAndSend: (draft) => {
      drafts.push(draft);
      const invoiceId = ids.get(draft.requestId) ?? `INV2-TEST-${String(ids.size + 1)}`;
      ids.set(draft.requestId, invoiceId);
      switch (state.mode) {
        case "refuse":
          return Promise.reject(
            new PayPalApiError(
              "create invoice",
              422,
              "UNPROCESSABLE_ENTITY",
              "x",
              [
                {
                  field: "/primary_recipients",
                  issue: "INVALID_EMAIL",
                  description: "secret text",
                },
              ],
              "dbg1",
            ),
          );
        case "unsent":
          return Promise.reject(
            new InvoiceSendError(invoiceId, { cause: new Error("send failed") }),
          );
        case "down":
          return Promise.reject(new PayPalNetworkError("create invoice", true));
        case "ok":
        case "no-link":
          return Promise.resolve({
            invoiceId,
            create: { transport: "rest" },
            send: { transport: "rest" },
          });
      }
    },
    get: (invoiceId) =>
      state.mode === "no-link"
        ? Promise.reject(new PayPalNetworkError("get invoice", false))
        : Promise.resolve({
            transport: "rest",
            data: {
              invoiceId,
              status: "SENT",
              amount: undefined,
              recipientEmail: undefined,
              note: undefined,
              payerViewUrl: `https://www.sandbox.paypal.com/invoice/p/#${invoiceId}`,
            },
          }),
  };
  return { invoices, drafts, state };
}

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
