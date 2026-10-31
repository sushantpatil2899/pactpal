import { SESSION_LIFETIME_MS, createUser } from "@pactpal/db";
import { useMigratedTestDatabase } from "@pactpal/db/testing";
import type { PayPalIdentity } from "@pactpal/paypal";
import { describe, expect, it } from "vitest";
import { buildApp } from "../app.js";
import type { ConfigReport } from "../config.js";
import { CALLBACK_PATH, SESSION_COOKIE, STATE_COOKIE, type SignInOptions } from "./sign-in.js";

const db = useMigratedTestDatabase();
const report: ConfigReport = { settings: [], features: [] };
const BASE = "https://pactpal.test";

const maya: PayPalIdentity = {
  userId: "PP-USER-1",
  payerId: "PAYER1",
  email: "maya@example.com",
  emailVerified: true,
  name: "Maya Seller",
};

function setup(answer: PayPalIdentity | Error = maya, overrides: Partial<SignInOptions> = {}) {
  let now = new Date("2026-10-31T10:00:00.000Z");
  let ids = 0;
  const logs: string[] = [];
  const codes: string[] = [];
  const app = buildApp(report, {
    logger: { stream: { write: (line) => logs.push(line) } },
    // Only the sign-in routes get the database: the app would close it when the app closes.
    signIn: {
      login: {
        authorizeUrl: (state, redirectUri) =>
          `https://paypal.test/connect?state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`,
        identify: (code) => {
          codes.push(code);
          return answer instanceof Error ? Promise.reject(answer) : Promise.resolve(answer);
        },
      },
      database: db,
      publicBaseUrl: BASE,
      clock: () => now,
      newId: () => `00000000-0000-4000-8000-${String(++ids).padStart(12, "0")}`,
      newState: () => "STATE-1",
      ...overrides,
    },
  });

  const get = (url: string, cookies: Record<string, string> = {}) =>
    app.inject({ method: "GET", url, cookies });
  /** Starts a sign-in and returns from PayPal with `query`, carrying the state cookie. */
  const returnFromPayPal = async (query = "code=CODE-1&state=STATE-1") => {
    const start = await get("/auth/paypal/start");
    const state = start.cookies.find((c) => c.name === STATE_COOKIE)?.value ?? "";
    return get(`${CALLBACK_PATH}?${query}`, { [STATE_COOKIE]: state });
  };
  const signIn = async () => {
    const res = await returnFromPayPal();
    return res.cookies.find((c) => c.name === SESSION_COOKIE)?.value ?? "";
  };
  return {
    app,
    get,
    returnFromPayPal,
    signIn,
    logs,
    codes,
    advance: (ms: number) => {
      now = new Date(now.getTime() + ms);
    },
  };
}

describe("signing in with PayPal", () => {
  it("sends the person to PayPal with a one-time state kept in a protected cookie", async () => {
    const { app, get } = setup();
    const res = await get("/auth/paypal/start");
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe(
      `https://paypal.test/connect?state=STATE-1&redirect_uri=${encodeURIComponent(`${BASE}/auth/paypal/callback`)}`,
    );
    expect(res.cookies).toEqual([
      {
        name: STATE_COOKIE,
        value: "STATE-1",
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 600,
      },
    ]);
    await app.close();
  });

  it("signs the person in on return: a new user, a protected session cookie, and /api/me knows them", async () => {
    const { app, get, returnFromPayPal, codes } = setup();
    const res = await returnFromPayPal();
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/");
    expect(codes).toEqual(["CODE-1"]);
    const session = res.cookies.find((c) => c.name === SESSION_COOKIE);
    expect(session).toMatchObject({
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: SESSION_LIFETIME_MS / 1000,
    });
    expect(session?.value).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(res.cookies.find((c) => c.name === STATE_COOKIE)?.value).toBe("");

    const me = await get("/api/me", { [SESSION_COOKIE]: session?.value ?? "" });
    expect(me.statusCode).toBe(200);
    expect(me.json()).toEqual({
      id: "00000000-0000-4000-8000-000000000001",
      email: "maya@example.com",
      displayName: "Maya Seller",
      paypalLinked: true,
      access: "full",
    });
    await app.close();
  });

  it("signs the same person in as the same user, with a new session each time", async () => {
    const { app, signIn } = setup();
    const first = await signIn();
    const second = await signIn();
    expect(second).not.toBe(first);
    expect(await db.query("SELECT 1 FROM users")).toHaveLength(1);
    expect(await db.query("SELECT 1 FROM sessions")).toHaveLength(2);
    await app.close();
  });

  it.each([
    ["the person cancelled on PayPal", "error=access_denied&state=STATE-1", "cancelled"],
    ["the state does not match", "code=CODE-1&state=OTHER", "expired"],
    ["the state is missing", "code=CODE-1", "expired"],
    ["there is no code", "state=STATE-1", "failed"],
    ["the answer is malformed", "code=a&code=b&state=STATE-1", "failed"],
  ])("sends the person home without a session when %s", async (_name, query, reason) => {
    const { app, returnFromPayPal, codes } = setup();
    const res = await returnFromPayPal(query);
    expect(res.headers.location).toBe(`/?signin=${reason}`);
    expect(res.cookies.find((c) => c.name === SESSION_COOKIE)).toBeUndefined();
    expect(codes).toEqual([]);
    expect(await db.query("SELECT 1 FROM sessions")).toEqual([]);
    await app.close();
  });

  it("refuses a return that never started here (no state cookie)", async () => {
    const { app, get } = setup();
    const res = await get(`${CALLBACK_PATH}?code=CODE-1&state=STATE-1`);
    expect(res.headers.location).toBe("/?signin=expired");
    await app.close();
  });

  it("reports a PayPal failure and logs no personal data", async () => {
    const { app, returnFromPayPal, logs } = setup(new Error("PayPal down (debug id dbg-1)"));
    const res = await returnFromPayPal();
    expect(res.headers.location).toBe("/?signin=failed");
    const all = logs.join("");
    expect(all).toContain("dbg-1");
    for (const secret of ["CODE-1", "STATE-1"]) expect(all).not.toContain(secret);
    await app.close();
  });

  it("does not merge with an unproven account that has the same email", async () => {
    await createUser(
      db,
      { id: "00000000-0000-4000-8000-000000000099", email: "maya@example.com" },
      new Date("2026-10-01T00:00:00.000Z"),
    );
    const { app, returnFromPayPal } = setup();
    const res = await returnFromPayPal();
    expect(res.headers.location).toBe("/?signin=email-taken");
    expect(await db.query("SELECT 1 FROM sessions")).toEqual([]);
    await app.close();
  });

  it("logs one line for a sign-in, never the person's email or name", async () => {
    const { app, signIn, logs } = setup();
    await signIn();
    const all = logs.join("");
    expect(logs.filter((line) => line.includes("Signed in"))).toHaveLength(1);
    for (const secret of ["maya@example.com", "Maya Seller", "PAYER1"]) {
      expect(all).not.toContain(secret);
    }
    await app.close();
  });

  it("is unavailable until PayPal, the database and the site address are all set", async () => {
    const { app, get } = setup(maya, { publicBaseUrl: undefined });
    expect((await get("/auth/paypal/start")).headers.location).toBe("/?signin=unavailable");
    expect((await get(`${CALLBACK_PATH}?code=x&state=y`)).headers.location).toBe(
      "/?signin=unavailable",
    );
    await app.close();
  });
});

describe("being signed in", () => {
  it("answers 401 without a session, with a made-up one, or once it has expired", async () => {
    const { app, get, signIn, advance } = setup();
    expect((await get("/api/me")).statusCode).toBe(401);
    expect((await get("/api/me", { [SESSION_COOKIE]: "a".repeat(43) })).statusCode).toBe(401);
    const token = await signIn();
    advance(SESSION_LIFETIME_MS);
    expect((await get("/api/me", { [SESSION_COOKIE]: token })).json()).toEqual({
      error: "signed out",
    });
    await app.close();
  });

  it("signs out: the session is deleted and the cookie cleared", async () => {
    const { app, get, signIn } = setup();
    const token = await signIn();
    const out = await app.inject({
      method: "POST",
      url: "/auth/logout",
      cookies: { [SESSION_COOKIE]: token },
    });
    expect(out.statusCode).toBe(204);
    expect(out.cookies.find((c) => c.name === SESSION_COOKIE)?.value).toBe("");
    expect(await db.query("SELECT 1 FROM sessions")).toEqual([]);
    expect((await get("/api/me", { [SESSION_COOKIE]: token })).statusCode).toBe(401);
    expect((await app.inject({ method: "POST", url: "/auth/logout" })).statusCode).toBe(204);
    await app.close();
  });

  it("knows nobody when there is no database", async () => {
    const app = buildApp(report, { logger: false });
    const res = await app.inject({ method: "GET", url: "/api/me" });
    expect(res.statusCode).toBe(401);
    expect(res.headers["content-security-policy"]).toContain("default-src 'self'");
    await app.close();
  });
});
