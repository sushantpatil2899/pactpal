import { activeConnection, ownAppKeys } from "@pactpal/db";
import {
  TEST_NOW,
  createTestDeal,
  createTestParties,
  testId,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { SecretBox } from "@pactpal/net";
import { PayPalApiError, type PayPalAppCredentials, type SellerAppCheck } from "@pactpal/paypal";
import { describe, expect, it } from "vitest";
import { fakeAppClients } from "./test-support.js";
import { buyerVisitors, dealTestApp, signedInAs } from "../deals/test-app.js";
import { SELLER_APP_PATH, sellerAppView } from "./app-link-routes.js";

const db = useMigratedTestDatabase();
const box = new SecretBox(Buffer.alloc(32, 5));
const SECRET = "EJ-very-secret-value_123";
const keys = { clientId: "AbC-client_1", clientSecret: SECRET };
const SCOPES = ["https://uri.paypal.com/services/invoicing"];

/** The app with linking on, answering every check with `answer` (or throwing it). */
function setup(
  answer: SellerAppCheck | Error = { ok: true, merchantId: "SELLER2", scopes: SCOPES },
) {
  const checked: PayPalAppCredentials[] = [];
  const check = (credentials: PayPalAppCredentials) => {
    checked.push(credentials);
    return answer instanceof Error ? Promise.reject(answer) : Promise.resolve(answer);
  };
  const connect = () => fakeAppClients();
  return { ...dealTestApp(db, undefined, { sellerApps: { box, check, connect } }), checked };
}

/** Everything the server said or logged, to show the secret never appears. */
const everything = (bodies: string[], logs: string[]) => [...bodies, ...logs].join("\n");

describe("seller app routes", () => {
  it("links an app after the check, storing the secret only encrypted, and shows the link", async () => {
    const { seller } = await createTestParties(db);
    const token = await signedInAs(db, seller.id);
    const { call, checked, logs } = setup();

    const before = await call("GET", SELLER_APP_PATH, token);
    expect(before.json()).toEqual({ available: true, link: null });

    const res = await call("POST", SELLER_APP_PATH, token, {
      clientId: ` ${keys.clientId} `,
      clientSecret: `${SECRET}\n`,
    });
    expect(res.statusCode).toBe(200);
    const link = {
      merchantId: "SELLER2",
      clientId: keys.clientId,
      linkedAt: TEST_NOW.toISOString(),
      alerts: true,
    };
    expect(res.json()).toEqual({ link });
    expect(checked.map((c) => [c.clientId, c.clientSecret.reveal()])).toEqual([
      [keys.clientId, SECRET],
    ]);

    const connection = await activeConnection(db, seller.id);
    const stored = await ownAppKeys(db, connection?.id ?? "");
    expect(stored?.sealedSecret).not.toContain(SECRET);
    expect(
      box.open(stored?.sealedSecret ?? "", `${connection?.id ?? ""}:${keys.clientId}`)?.reveal(),
    ).toBe(SECRET);
    const after = await call("GET", SELLER_APP_PATH, token);
    expect(after.json()).toEqual({ available: true, link });
    expect(everything([before.body, res.body, after.body], logs)).not.toContain(SECRET);
  });

  it.each([
    [{ ok: false, reason: "login-failed", debugId: "d1" }, { error: "login-failed" }],
    [
      { ok: false, reason: "missing-features", missing: ["Invoicing", "Disputes"] },
      { error: "missing-features", missing: ["Invoicing", "Disputes"] },
    ],
    [{ ok: false, reason: "account-unreadable", debugId: "d2" }, { error: "account-unreadable" }],
  ] satisfies [SellerAppCheck, object][])(
    "refuses keys the check turns down: %j",
    async (answer, body) => {
      const { seller } = await createTestParties(db);
      const { call, logs } = setup(answer);
      const res = await call("POST", SELLER_APP_PATH, await signedInAs(db, seller.id), keys);
      expect(res.statusCode).toBe(422);
      expect(res.json()).toEqual(body);
      expect(await activeConnection(db, seller.id)).toBeUndefined();
      expect(everything([res.body], logs)).not.toContain(SECRET);
    },
  );

  it("refuses a PayPal account another user has linked", async () => {
    const { seller, buyer } = await createTestParties(db);
    const { call } = setup();
    expect(
      (await call("POST", SELLER_APP_PATH, await signedInAs(db, buyer.id), keys)).statusCode,
    ).toBe(200);
    const res = await call("POST", SELLER_APP_PATH, await signedInAs(db, seller.id), keys);
    expect(res.statusCode).toBe(409);
    expect(res.json()).toEqual({ error: "account-taken" });
  });

  it("answers 502 when PayPal fails, logging its debug id and never the secret", async () => {
    const { seller } = await createTestParties(db);
    const outage = new PayPalApiError("POST /v1/oauth2/token", 503, "x", "y", [], "dbg-503");
    const { call, logs } = setup(outage);
    const res = await call("POST", SELLER_APP_PATH, await signedInAs(db, seller.id), keys);
    expect(res.statusCode).toBe(502);
    expect(res.json()).toEqual({ error: "paypal-unavailable" });
    expect(logs.join("\n")).toContain("dbg-503");
    expect(everything([res.body], logs)).not.toContain(SECRET);
  });

  it("answers 400 naming the bad fields, never their values", async () => {
    const { seller } = await createTestParties(db);
    const { call, checked, logs } = setup();
    const res = await call("POST", SELLER_APP_PATH, await signedInAs(db, seller.id), {
      clientId: "has spaces inside",
      clientSecret: `${SECRET}!`,
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ error: "invalid", fields: ["clientId", "clientSecret"] });
    expect(checked).toEqual([]);
    expect(everything([res.body], logs)).not.toContain(SECRET);
  });

  it("unlinks, wiping the secret; unlinking again changes nothing", async () => {
    const { seller } = await createTestParties(db);
    const token = await signedInAs(db, seller.id);
    const { call } = setup();
    await call("POST", SELLER_APP_PATH, token, keys);
    const id = (await activeConnection(db, seller.id))?.id ?? "";
    expect((await call("DELETE", SELLER_APP_PATH, token)).statusCode).toBe(204);
    expect(await ownAppKeys(db, id)).toBeUndefined();
    expect((await call("GET", SELLER_APP_PATH, token)).json()).toEqual({
      available: true,
      link: null,
    });
    expect((await call("DELETE", SELLER_APP_PATH, token)).statusCode).toBe(204);
  });

  it("refuses people signed out or in through a buyer link, and says when linking is off", async () => {
    const { buyer, dealId } = await createTestDeal(db);
    const [, linkSession] = await buyerVisitors(db, dealId, buyer.id);
    const { call } = setup();
    expect((await call("GET", SELLER_APP_PATH)).statusCode).toBe(401);
    for (const method of ["GET", "POST", "DELETE"] as const) {
      expect((await call(method, SELLER_APP_PATH, linkSession, keys)).statusCode).toBe(403);
    }

    const off = dealTestApp(db);
    const token = await signedInAs(db, buyer.id);
    expect((await off.call("GET", SELLER_APP_PATH, token)).json()).toEqual({
      available: false,
      link: null,
    });
    expect((await off.call("POST", SELLER_APP_PATH, token, keys)).statusCode).toBe(503);
    expect((await dealTestApp(undefined).call("GET", SELLER_APP_PATH, token)).statusCode).toBe(503);
  });
});

describe("sellerAppView", () => {
  it("shows only an own-app link", () => {
    const base = {
      id: testId(9),
      userId: testId(1),
      status: "connected" as const,
      merchantId: "M1",
      scopes: [],
      createdAt: TEST_NOW,
      connectedAt: undefined,
      disconnectedAt: undefined,
    };
    expect(sellerAppView(undefined)).toBeNull();
    expect(sellerAppView({ ...base, method: "partner", trackingId: "t" })).toBeNull();
    expect(sellerAppView({ ...base, method: "own_app", clientId: "c", webhookId: "WH" })).toEqual({
      merchantId: "M1",
      clientId: "c",
      linkedAt: TEST_NOW.toISOString(),
      alerts: true,
    });
  });
});
