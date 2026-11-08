import { disconnectSeller, linkOwnApp } from "@pactpal/db";
import {
  TEST_NOW,
  createSignedTestDeal,
  createTestParties,
  testId,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { Secret, SecretBox } from "@pactpal/net";
import type { PayPalAppCredentials } from "@pactpal/paypal";
import { describe, expect, it } from "vitest";
import { dealTestApp, signedInAs } from "../deals/test-app.js";
import { fakePayPal } from "../payments/paypal-test-support.js";
import { LinkedApps, invoicesFor } from "./linked-apps.js";

const db = useMigratedTestDatabase();
const box = new SecretBox(Buffer.alloc(32, 6));
const CONNECTION = testId(80);

/** A seller with an own app linked as `merchantId`, its secret sealed with `sealWith`. */
async function linkedSeller(userId: string, merchantId = "OWN1", sealWith = box) {
  await linkOwnApp(
    db,
    {
      id: CONNECTION,
      userId,
      clientId: "own-client",
      sealedSecret: sealWith.seal(new Secret("own-secret"), `${CONNECTION}:own-client`),
      merchantId,
      scopes: [],
    },
    TEST_NOW,
  );
}

function apps() {
  const opened: PayPalAppCredentials[] = [];
  const own = fakePayPal();
  const linked = new LinkedApps(db, box, (credentials) => {
    opened.push(credentials);
    return { invoices: own.invoices };
  });
  return { linked, opened, own };
}

describe("LinkedApps", () => {
  it("opens a live link once, with its own keys, and gives nothing once it has ended", async () => {
    const { seller } = await createTestParties(db);
    await linkedSeller(seller.id);
    const { linked, opened } = apps();
    const first = await linked.get(CONNECTION);
    expect(first?.merchantId).toBe("OWN1");
    expect(await linked.get(CONNECTION)).toBe(first);
    expect(opened.map((c) => [c.clientId, c.clientSecret.reveal()])).toEqual([
      ["own-client", "own-secret"],
    ]);
    await disconnectSeller(db, seller.id, TEST_NOW);
    expect(await linked.get(CONNECTION)).toBeUndefined();
  });

  it("gives nothing for a secret sealed with another key", async () => {
    const { seller } = await createTestParties(db);
    await linkedSeller(seller.id, "OWN1", new SecretBox(Buffer.alloc(32, 7)));
    expect(await apps().linked.get(CONNECTION)).toBeUndefined();
  });
});

describe("invoicesFor", () => {
  it("uses PactPal's app for a stage with no link, the linked app otherwise, and never swaps", async () => {
    const { seller } = await createTestParties(db);
    await linkedSeller(seller.id);
    const pactpal = fakePayPal().invoices;
    const { linked, own } = apps();
    expect(await invoicesFor({ invoices: pactpal, linked }, null)).toEqual({
      ok: true,
      account: { kind: "pactpal", invoices: pactpal },
    });
    expect(await invoicesFor({ invoices: undefined }, undefined)).toEqual({
      ok: false,
      reason: "not-set-up",
    });
    expect(await invoicesFor({ invoices: pactpal, linked }, CONNECTION)).toEqual({
      ok: true,
      account: { kind: "own-app", merchantId: "OWN1", invoices: own.invoices },
    });
    expect(await invoicesFor({ invoices: pactpal }, CONNECTION)).toEqual({
      ok: false,
      reason: "account-unlinked",
    });
  });
});

describe("invoices from a seller's own app (6h-3)", () => {
  /** A signed deal whose seller has linked their own app; PactPal's app is a separate fake. */
  async function setup() {
    const deal = await createSignedTestDeal(db);
    const pactpal = fakePayPal();
    const own = fakePayPal("INV2-OWN");
    const env = dealTestApp(db, undefined, {
      invoices: pactpal.invoices,
      sellerApps: {
        box,
        check: () => Promise.resolve({ ok: true, merchantId: "OWN1", scopes: [] }),
        connect: () => ({ invoices: own.invoices }),
      },
    });
    const token = await signedInAs(db, deal.seller.id);
    const base = `/api/deals/${deal.dealId}/milestones`;
    const stages = async () =>
      (await env.call("GET", base, token)).json<{
        stages: {
          status: string;
          invoice?: { fromAccount: string | null; invoiceSha256: string };
        }[];
      }>().stages;
    const send = async (stage: number) =>
      env.call("POST", `${base}/${String(stage)}/invoice`, token, {
        invoiceSha256: (await stages())[stage - 1]?.invoice?.invoiceSha256 ?? "",
      });
    const link = () =>
      env.call("POST", "/api/seller-app", token, { clientId: "own-client", clientSecret: "s" });
    const unlink = () => env.call("DELETE", "/api/seller-app", token);
    const check = () => env.call("POST", `${base}/check`, token);
    return { ...deal, ...env, pactpal, own, stages, send, link, unlink, check };
  }

  it("sends from PactPal's app until the seller links, then from theirs, and logs the account", async () => {
    const { stages, send, link, pactpal, own, dealId } = await setup();
    expect((await stages())[0]?.invoice?.fromAccount).toBeNull();
    expect((await send(1)).statusCode).toBe(200);
    expect(pactpal.drafts).toHaveLength(1);

    await link();
    expect((await stages())[1]?.invoice?.fromAccount).toBe("OWN1");
    expect((await send(2)).statusCode).toBe(200);
    expect(own.drafts).toHaveLength(1);
    expect(pactpal.drafts).toHaveLength(1);
    const entries = (await db.query(
      "SELECT payload FROM ledger_entries WHERE deal_id = $1 AND type = 'INVOICE_SENT' ORDER BY seq",
      [dealId],
    )) as { payload: Record<string, unknown> }[];
    expect(entries.map((e) => e.payload.paypalAccount)).toEqual([undefined, "OWN1"]);
  });

  it("checks each stage's payment with the account that sent it", async () => {
    const { send, link, check, pactpal, own, stages } = await setup();
    await send(1);
    await link();
    await send(2);
    // PactPal's account would call stage 2's invoice paid too; only the seller's own may answer.
    pactpal.paid.add("INV2-TEST-1");
    pactpal.paid.add("INV2-OWN-1");
    const readsBefore = own.state.reads;
    expect((await check()).statusCode).toBe(200);
    expect((await stages()).map((s) => s.status)).toEqual(["paid", "sent"]);
    expect(own.state.reads).toBe(readsBefore + 1);
  });

  it("says plainly when an invoice's app is no longer linked, and still checks the others", async () => {
    const { send, link, unlink, check, pactpal, stages } = await setup();
    await send(1);
    await link();
    await send(2);
    await unlink();
    pactpal.paid.add("INV2-TEST-1");
    const res = await check();
    expect(res.statusCode).toBe(409);
    expect(res.json()).toEqual({
      error:
        "the invoice for stage 2 was sent from a PayPal app that is no longer linked; link it again to check its payment",
    });
    expect((await stages()).map((s) => s.status)).toEqual(["paid", "sent"]);
  });

  it("keeps a retry on the account the stage was reserved for", async () => {
    const { send, link, unlink, own, pactpal } = await setup();
    await link();
    own.state.mode = "unsent";
    expect((await send(1)).statusCode).toBe(502);
    await unlink();
    own.state.mode = "ok";
    const res = await send(1);
    expect(res.statusCode).toBe(409);
    expect(res.json()).toEqual({
      error:
        "this invoice was started from a PayPal app that is no longer linked; link it again to finish sending",
    });
    expect(pactpal.drafts).toHaveLength(0);
  });

  it("drops the reservation when the linked app cannot be used before anything was created", async () => {
    const { send, link, own, pactpal, dealId } = await setup();
    await link();
    // The secret becomes unreadable between the press and the send (as if the key changed).
    await db.query("UPDATE seller_connections SET client_secret_sealed = 'v1.x.y.z'");
    const res = await send(1);
    expect(res.statusCode).toBe(409);
    expect(own.drafts).toHaveLength(0);
    expect(await db.query("SELECT 1 FROM milestones WHERE deal_id = $1", [dealId])).toEqual([]);
    expect(pactpal.drafts).toHaveLength(0);
  });
});
