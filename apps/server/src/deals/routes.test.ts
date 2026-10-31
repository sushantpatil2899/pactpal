import { createDealLink, createSession, createUser } from "@pactpal/db";
import { TEST_NOW, createTestDeal, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buildApp } from "../app.js";
import { SESSION_COOKIE } from "../auth/sign-in.js";
import type { EmailMessage } from "../email/sender.js";
import { redeemDealLink } from "@pactpal/db";

const db = useMigratedTestDatabase();

function setup(withDatabase = true) {
  let ids = 200;
  const sent: EmailMessage[] = [];
  const logs: string[] = [];
  const app = buildApp(
    { settings: [], features: [] },
    {
      logger: { stream: { write: (line) => logs.push(line) } },
      email: {
        send: (message) => {
          sent.push(message);
          return Promise.resolve();
        },
      },
      // Only the routes get the database: the app would close it when the app closes.
      signIn: {
        login: undefined,
        database: withDatabase ? db : undefined,
        publicBaseUrl: "https://pactpal.test",
        clock: () => TEST_NOW,
        newId: () => testId(ids++),
      },
    },
  );
  const call = (method: "GET" | "POST", url: string, token?: string, payload?: object) =>
    app.inject({
      method,
      url,
      ...(payload ? { payload } : {}),
      ...(token ? { cookies: { [SESSION_COOKIE]: token } } : {}),
    });
  return { app, call, sent, logs };
}

/** A signed-in (PayPal) session for a user. */
const signedIn = async (userId: string) => (await createSession(db, userId, TEST_NOW)).token;

const newDeal = { title: "Logo design", category: "handmade-goods", currency: "USD" };

describe("deal options", () => {
  it("lists the categories a seller can pick and the currencies", async () => {
    const { app, call } = setup();
    const body = (await call("GET", "/api/deal-options")).json<{
      categories: { id: string; label: string }[];
      currencies: string[];
    }>();
    expect(body.categories).toHaveLength(7);
    expect(body.categories[0]).toEqual({
      id: "art-and-design",
      label: "Art and design commission",
    });
    expect(body.currencies).toEqual(["USD", "EUR", "GBP", "CAD", "AUD"]);
    await app.close();
  });
});

describe("POST /api/deals", () => {
  it("creates a deal for the signed-in seller, with its kind from the category and its first log entry", async () => {
    const seller = await createUser(
      db,
      { id: testId(1), email: "m@example.com", displayName: "Maya" },
      TEST_NOW,
    );
    const { app, call } = setup();
    const res = await call("POST", "/api/deals", await signedIn(seller.id), newDeal);
    expect(res.statusCode).toBe(201);
    expect(res.json()).toEqual({
      id: testId(200),
      title: "Logo design",
      kind: "physical",
      category: "handmade-goods",
      categoryLabel: "Handmade or custom-made item",
      currency: "USD",
      status: "draft",
      createdAt: TEST_NOW.toISOString(),
      hasBuyer: false,
      role: "seller",
      buyer: null,
    });
    const log = (
      await call("GET", `/api/deals/${testId(200)}/ledger`, await signedIn(seller.id))
    ).json<{
      entries: { type: string; actorName: string }[];
    }>();
    expect(log.entries).toMatchObject([{ type: "DEAL_CREATED", actorName: "Maya" }]);
    await app.close();
  });

  it.each([
    ["an unknown category", { ...newDeal, category: "gift-cards" }, ["category"]],
    ["an unsupported currency", { ...newDeal, currency: "JPY" }, ["currency"]],
    ["no title", { category: "art-and-design", currency: "USD" }, ["title"]],
  ])("refuses %s and names the field", async (_name, body, fields) => {
    const seller = await createUser(db, { id: testId(1), email: "m@example.com" }, TEST_NOW);
    const { app, call } = setup();
    const res = await call("POST", "/api/deals", await signedIn(seller.id), body);
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ error: "invalid", fields });
    expect(await db.query("SELECT 1 FROM deals")).toEqual([]);
    await app.close();
  });

  it("refuses people who are signed out, and buyer-link visitors", async () => {
    const { buyer, dealId } = await createTestDeal(db);
    const { token } = await createDealLink(db, { dealId, userId: buyer.id }, TEST_NOW);
    const redeemed = await redeemDealLink(db, token, TEST_NOW);
    if (!redeemed.ok) throw new Error("expected a link session");
    const { app, call } = setup();
    expect((await call("POST", "/api/deals", undefined, newDeal)).statusCode).toBe(401);
    const linkVisitor = await call("POST", "/api/deals", redeemed.session.token, newDeal);
    expect(linkVisitor.statusCode).toBe(403);
    await app.close();
  });
});

describe("seeing deals", () => {
  it("shows each person only the deals they sell or buy in, with their role", async () => {
    const { seller, buyer, dealId } = await createTestDeal(db);
    const stranger = await createUser(db, { id: testId(9), email: "s@example.com" }, TEST_NOW);
    const { app, call } = setup();
    const roles = async (userId: string) =>
      (await call("GET", "/api/deals", await signedIn(userId))).json<{
        deals: { id: string; role: string }[];
      }>().deals;
    expect(await roles(seller.id)).toMatchObject([{ id: dealId, role: "seller" }]);
    expect(await roles(buyer.id)).toMatchObject([{ id: dealId, role: "buyer" }]);
    expect(await roles(stranger.id)).toEqual([]);
    const asStranger = await call("GET", `/api/deals/${dealId}`, await signedIn(stranger.id));
    expect(asStranger.statusCode).toBe(404);
    expect((await call("GET", "/api/deals/not-a-uuid", await signedIn(seller.id))).statusCode).toBe(
      404,
    );
    await app.close();
  });

  it("lets a buyer-link visitor see only that deal", async () => {
    const { seller, buyer, dealId } = await createTestDeal(db);
    const { token } = await createDealLink(db, { dealId, userId: buyer.id }, TEST_NOW);
    const redeemed = await redeemDealLink(db, token, TEST_NOW);
    if (!redeemed.ok) throw new Error("expected a link session");
    // Another deal where the same person is also the buyer: the link must not open it.
    const { app, call } = setup();
    const other = await call("POST", "/api/deals", await signedIn(seller.id), newDeal);
    await db.query("UPDATE deals SET buyer_id = $1 WHERE id = $2", [
      buyer.id,
      other.json<{ id: string }>().id,
    ]);

    const visitor = redeemed.session.token;
    expect((await call("GET", "/api/deals", visitor)).json()).toMatchObject({
      deals: [{ id: dealId, role: "buyer" }],
    });
    expect((await call("GET", `/api/deals/${dealId}`, visitor)).statusCode).toBe(200);
    const otherDeal = await call("GET", `/api/deals/${other.json<{ id: string }>().id}`, visitor);
    expect(otherDeal.statusCode).toBe(404);
    await app.close();
  });

  it("answers 401 when signed out and 503 without a database", async () => {
    const { app, call } = setup();
    expect((await call("GET", "/api/deals")).statusCode).toBe(401);
    expect((await call("GET", `/api/deals/${testId(1)}`)).statusCode).toBe(401);
    await app.close();
    const none = setup(false);
    expect((await none.call("GET", "/api/deals")).statusCode).toBe(503);
    expect((await none.call("POST", "/api/deals", undefined, newDeal)).statusCode).toBe(503);
    expect((await none.call("GET", `/api/deals/${testId(1)}`)).statusCode).toBe(503);
    await none.app.close();
  });
});

describe("the evidence log", () => {
  it("reports an untouched log as unchanged", async () => {
    const { seller, dealId } = await createTestDeal(db);
    const { app, call } = setup();
    const check = await call("GET", `/api/deals/${dealId}/ledger/check`, await signedIn(seller.id));
    expect(check.json()).toMatchObject({ status: "unchanged", entries: 1 });
    await app.close();
  });

  it("reports the exact entry when the log was changed behind the database's back", async () => {
    const { seller, dealId } = await createTestDeal(db);
    await db.query("ALTER TABLE ledger_entries DISABLE TRIGGER ledger_entries_append_only");
    await db.query('UPDATE ledger_entries SET payload = \'{"title":"Changed"}\'::jsonb');
    const { app, call } = setup();
    const check = await call("GET", `/api/deals/${dealId}/ledger/check`, await signedIn(seller.id));
    expect(check.json()).toEqual({
      status: "changed",
      atEntry: 0,
      reason: "payload does not match payloadHash",
    });
    await app.close();
  });

  it("names people by display name or role, never by email", async () => {
    const { seller, dealId } = await createTestDeal(db);
    await db.query("UPDATE users SET display_name = NULL WHERE id = $1", [seller.id]);
    const { app, call } = setup();
    const log = await call("GET", `/api/deals/${dealId}/ledger`, await signedIn(seller.id));
    expect(log.json()).toMatchObject({ entries: [{ actor: "seller", actorName: "Seller" }] });
    expect(log.body).not.toContain("maya@example.com");
    await app.close();
  });
});

describe("adding the buyer and making their link", () => {
  /** A seller (PayPal session) with a deal that has no buyer yet. */
  async function sellerDeal() {
    const seller = await createUser(
      db,
      { id: testId(1), email: "maya@example.com", displayName: "Maya" },
      TEST_NOW,
    );
    const env = setup();
    const token = await signedIn(seller.id);
    const deal = (await env.call("POST", "/api/deals", token, newDeal)).json<{ id: string }>();
    return { ...env, token, dealId: deal.id };
  }

  it("lets the seller add the buyer by email, logs it, and shows the buyer's details to the seller only", async () => {
    const { app, call, token, dealId } = await sellerDeal();
    const res = await call("POST", `/api/deals/${dealId}/buyer`, token, {
      email: "chris@example.com",
      name: "Chris",
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({
      hasBuyer: true,
      role: "seller",
      buyer: { name: "Chris", email: "chris@example.com" },
    });
    const log = (await call("GET", `/api/deals/${dealId}/ledger`, token)).json<{
      entries: { type: string; actorName: string }[];
    }>();
    expect(log.entries.map((e) => e.type)).toEqual(["DEAL_CREATED", "BUYER_ADDED"]);
    expect(log.entries[1]?.actorName).toBe("Maya");
    expect((await call("GET", `/api/deals/${dealId}/ledger/check`, token)).json()).toMatchObject({
      status: "unchanged",
      entries: 2,
    });
    await app.close();
  });

  it("makes a copyable buyer link, passes the email to the sender, and the buyer sees only the seller's name", async () => {
    const { app, call, token, dealId, sent, logs } = await sellerDeal();
    await call("POST", `/api/deals/${dealId}/buyer`, token, { email: "chris@example.com" });
    const made = await call("POST", `/api/deals/${dealId}/buyer-link`, token);
    expect(made.statusCode).toBe(200);
    const { url, expiresAt } = made.json<{ url: string; expiresAt: string }>();
    expect(url).toMatch(/^https:\/\/pactpal\.test\/link#t=[A-Za-z0-9_-]{43}$/);
    expect(expiresAt).toBe(new Date(TEST_NOW.getTime() + 14 * 24 * 3600 * 1000).toISOString());
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({ kind: "deal-link", to: "chris@example.com" });
    expect(sent[0]?.text).toContain(url);
    const secret = url.split("#t=")[1] ?? "";
    expect(logs.join("")).not.toContain(secret);

    const redeemed = await redeemDealLink(db, secret, TEST_NOW);
    if (!redeemed.ok) throw new Error("expected the link to work");
    const asBuyer = await call("GET", `/api/deals/${dealId}`, redeemed.session.token);
    expect(asBuyer.json()).toMatchObject({ role: "buyer", seller: { name: "Maya" } });
    expect(asBuyer.body).not.toContain("maya@example.com");
    await app.close();
  });

  it.each([
    ["a second buyer", { email: "other@example.com" }, 409],
    ["the seller's own email", { email: "MAYA@example.com" }, 400],
    ["a badly formed email", { email: "nope" }, 400],
  ])("refuses %s", async (name, body, status) => {
    const { app, call, token, dealId } = await sellerDeal();
    if (name === "a second buyer") {
      await call("POST", `/api/deals/${dealId}/buyer`, token, { email: "chris@example.com" });
    }
    expect((await call("POST", `/api/deals/${dealId}/buyer`, token, body)).statusCode).toBe(status);
    await app.close();
  });

  it("asks for a buyer before making a link", async () => {
    const { app, call, token, dealId } = await sellerDeal();
    const res = await call("POST", `/api/deals/${dealId}/buyer-link`, token);
    expect(res.statusCode).toBe(409);
    expect(res.json()).toEqual({ error: "add the buyer first" });
    await app.close();
  });

  it("lets only the seller add buyers or make links", async () => {
    const { buyer, dealId } = await createTestDeal(db);
    const { app, call } = setup();
    const asBuyer = await signedIn(buyer.id);
    expect((await call("POST", `/api/deals/${dealId}/buyer-link`, asBuyer)).statusCode).toBe(403);
    const stranger = await createUser(db, { id: testId(9), email: "s@example.com" }, TEST_NOW);
    const asStranger = await signedIn(stranger.id);
    const res = await call("POST", `/api/deals/${dealId}/buyer`, asStranger, {
      email: "a@example.com",
    });
    expect(res.statusCode).toBe(404);
    await app.close();
  });
});
