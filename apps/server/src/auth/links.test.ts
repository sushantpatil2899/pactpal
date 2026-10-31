import { createDealLink } from "@pactpal/db";
import { TEST_NOW, createTestDeal, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buildApp } from "../app.js";
import { REDEEM_PATH } from "./links.js";
import { SESSION_COOKIE } from "./sign-in.js";

const db = useMigratedTestDatabase();

function setup(withDatabase = true) {
  const logs: string[] = [];
  const app = buildApp(
    { settings: [], features: [] },
    {
      logger: { stream: { write: (line) => logs.push(line) } },
      // Only the routes get the database: the app would close it when the app closes.
      signIn: {
        login: undefined,
        database: withDatabase ? db : undefined,
        publicBaseUrl: undefined,
        clock: () => TEST_NOW,
        newId: () => "unused",
      },
    },
  );
  const redeem = (body: unknown) =>
    app.inject({ method: "POST", url: REDEEM_PATH, payload: body as object });
  return { app, redeem, logs };
}

describe("POST /api/links/redeem", () => {
  it("lets the buyer in for that deal only, with the protected session cookie", async () => {
    const { buyer, dealId } = await createTestDeal(db);
    const { token } = await createDealLink(db, { dealId, userId: buyer.id }, TEST_NOW);
    const { app, redeem, logs } = setup();
    const res = await redeem({ token });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ dealId });
    const cookie = res.cookies.find((c) => c.name === SESSION_COOKIE);
    expect(cookie).toMatchObject({ httpOnly: true, secure: true, sameSite: "Lax", path: "/" });

    const me = await app.inject({
      method: "GET",
      url: "/api/me",
      cookies: { [SESSION_COOKIE]: cookie?.value ?? "" },
    });
    expect(me.json()).toMatchObject({ id: buyer.id, access: { dealId } });
    const all = logs.join("");
    expect(all).not.toContain(token);
    expect(all).not.toContain(buyer.email);
    await app.close();
  });

  it.each([
    ["a made-up link", { token: "a".repeat(43) }, "unknown"],
    ["no token", {}, "unknown"],
    ["a token that is far too long", { token: "a".repeat(500) }, "unknown"],
  ])("refuses %s without a session", async (_name, body, reason) => {
    const { app, redeem } = setup();
    const res = await redeem(body);
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ error: reason });
    expect(res.cookies.find((c) => c.name === SESSION_COOKIE)).toBeUndefined();
    await app.close();
  });

  it("refuses a link a newer one replaced", async () => {
    const { buyer, dealId } = await createTestDeal(db);
    const old = await createDealLink(db, { dealId, userId: buyer.id }, TEST_NOW);
    await createDealLink(db, { dealId, userId: buyer.id }, TEST_NOW);
    const { app, redeem } = setup();
    expect((await redeem({ token: old.token })).json()).toEqual({ error: "replaced" });
    await app.close();
  });

  it("is unavailable without a database", async () => {
    const { app, redeem } = setup(false);
    expect((await redeem({ token: "a".repeat(43) })).statusCode).toBe(503);
    await app.close();
  });
});
