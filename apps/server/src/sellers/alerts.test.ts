import { activeConnection, recordWebhookEvent } from "@pactpal/db";
import { TEST_NOW, createSignedTestDeal, useMigratedTestDatabase } from "@pactpal/db/testing";
import { SecretBox } from "@pactpal/net";
import { describe, expect, it } from "vitest";
import { fakeAppClients } from "./test-support.js";
import { dealTestApp, signedInAs } from "../deals/test-app.js";
import { fakeAppWebhooks, fakePayPal } from "../payments/paypal-test-support.js";

const db = useMigratedTestDatabase();

/** A signed deal whose seller can link an app; PayPal's alerts are stored in the test database. */
async function setup(publicBaseUrl?: string) {
  const deal = await createSignedTestDeal(db);
  const own = fakePayPal("INV2-OWN");
  const alerts = fakeAppWebhooks();
  const env = dealTestApp(db, undefined, {
    ...(publicBaseUrl === undefined ? {} : { publicBaseUrl }),
    sellerApps: {
      box: new SecretBox(Buffer.alloc(32, 4)),
      check: () => Promise.resolve({ ok: true, merchantId: "OWN1", scopes: [] }),
      connect: () => fakeAppClients({ invoices: own.invoices, webhooks: alerts.webhooks }),
    },
    webhooks: {
      verifier: undefined,
      webhookId: undefined,
      events: { record: (event) => recordWebhookEvent(db, event, TEST_NOW) },
    },
  });
  const token = await signedInAs(db, deal.seller.id);
  const link = async () => {
    const res = await env.call("POST", "/api/seller-app", token, {
      clientId: "own-client",
      clientSecret: "s",
    });
    return res.json<{ link: { alerts: boolean } | null }>().link;
  };
  const connectionId = async () => (await activeConnection(db, deal.seller.id))?.id ?? "none";
  const alert = (id: string, invoiceId: string, eventId = "WH-EVT-1") =>
    env.app.inject({
      method: "POST",
      url: `/webhooks/paypal/seller/${id}`,
      headers: { "content-type": "application/json" },
      payload: JSON.stringify({
        id: eventId,
        event_type: "INVOICING.INVOICE.PAID",
        resource: { invoice: { id: invoiceId } },
      }),
    });
  const base = `/api/deals/${deal.dealId}/milestones`;
  const sendStage1 = async () => {
    const view = (await env.call("GET", base, token)).json<{
      stages: { invoice?: { invoiceSha256: string } }[];
    }>();
    return env.call("POST", `${base}/1/invoice`, token, {
      invoiceSha256: view.stages[0]?.invoice?.invoiceSha256 ?? "",
    });
  };
  const status1 = async () =>
    (await env.call("GET", base, token)).json<{ stages: { status: string }[] }>().stages[0]?.status;
  return { ...deal, ...env, own, alerts, token, link, connectionId, alert, sendStage1, status1 };
}

describe("payment alerts from a seller's own app (6h-4)", () => {
  it("registers the link's own address when linking, and keeps PayPal's id for it", async () => {
    const { link, alerts, connectionId, seller } = await setup();
    expect(await link()).toMatchObject({ alerts: true });
    const id = await connectionId();
    expect(alerts.calls).toEqual([
      `register https://pactpal.test/webhooks/paypal/seller/${id} alerts-${id}`,
    ]);
    expect(await activeConnection(db, seller.id)).toMatchObject({ webhookId: "WH-1" });
  });

  it("still links when PayPal refuses the address, with alerts off", async () => {
    const refused = await setup();
    refused.alerts.state.refuse = true;
    expect(await refused.link()).toMatchObject({ alerts: false });
    expect(refused.logs.join("\n")).toContain("dbg-wh");
  });

  it("does not ask PayPal when the site is not https, which PayPal requires", async () => {
    const local = await setup("http://localhost:3000");
    expect(await local.link()).toMatchObject({ alerts: false });
    expect(local.alerts.calls).toEqual([]);
  });

  it("marks a stage paid from a genuine alert, checked with that app and its own id, once", async () => {
    const { link, connectionId, alert, sendStage1, status1, own, alerts } = await setup();
    await link();
    await sendStage1();
    own.paid.add("INV2-OWN-1");
    const id = await connectionId();
    expect((await alert(id, "INV2-OWN-1")).json()).toEqual({ status: "received" });
    expect(alerts.calls).toContain("verify WH-1");
    expect(await status1()).toBe("paid");
    expect((await alert(id, "INV2-OWN-1")).json()).toEqual({ status: "repeat" });
    expect(
      await db.query(
        "SELECT count(*)::int AS n FROM ledger_entries WHERE type = 'PAYMENT_RECEIVED'",
      ),
    ).toEqual([{ n: 1 }]);
  });

  it("refuses a forged alert, an unknown address, and a link without a registered address", async () => {
    const { link, connectionId, alert, alerts, status1, sendStage1, own } = await setup();
    await link();
    await sendStage1();
    own.paid.add("INV2-OWN-1");
    const id = await connectionId();
    alerts.state.verified = false;
    expect((await alert(id, "INV2-OWN-1")).statusCode).toBe(400);
    expect(await status1()).toBe("sent");
    expect((await alert("00000000-0000-4000-8000-000000000999", "x")).statusCode).toBe(404);
    expect((await alert("not-a-link", "x")).statusCode).toBe(404);
    await db.query("UPDATE seller_connections SET webhook_id = NULL");
    expect((await alert(id, "x")).statusCode).toBe(503);
  });

  it("removes the address before unlinking, and then refuses its alerts", async () => {
    const { link, connectionId, alert, alerts, call, token } = await setup();
    await link();
    const id = await connectionId();
    expect((await call("DELETE", "/api/seller-app", token)).statusCode).toBe(204);
    expect(alerts.calls.at(-1)).toBe("remove WH-1");
    expect((await alert(id, "x")).statusCode).toBe(404);
  });
});
