import { describe, expect, it } from "vitest";
import { Secret } from "./credentials.js";
import { PayPalApiError, PayPalResponseError } from "./errors.js";
import type { HttpDeps } from "./http.js";
import { LOGIN_SCOPES, PayPalLogin, PayPalLoginRefusedError } from "./login.js";
import { DEFAULT_RETRY_POLICY } from "./retry.js";

const credentials = { clientId: "client-id", clientSecret: new Secret("client-secret") };

/** A fake PayPal answering the token request, then the details request, from a queue. */
function fakePayPal(answers: { status: number; body: unknown; debugId?: string }[]) {
  const calls: { url: string; init: RequestInit }[] = [];
  const queue = [...answers];
  const deps: HttpDeps = {
    fetch: (input, init = {}) => {
      calls.push({ url: input instanceof Request ? input.url : input.toString(), init });
      const answer = queue.shift() ?? { status: 500, body: {} };
      return Promise.resolve(
        new Response(JSON.stringify(answer.body), {
          status: answer.status,
          headers: {
            "Content-Type": "application/json",
            "PayPal-Debug-Id": answer.debugId ?? "dbg-1",
          },
        }),
      );
    },
    now: () => 0,
    sleep: () => Promise.resolve(),
    random: () => 0.5,
  };
  const login = new PayPalLogin(credentials, {
    baseUrl: "https://paypal.test",
    loginUrl: "https://login.paypal.test/connect",
    deps,
    policy: DEFAULT_RETRY_POLICY,
  });
  return { login, calls };
}

const token = {
  status: 200,
  body: { access_token: "PERSON-TOKEN", token_type: "Bearer", expires_in: 900 },
};
const header = (init: RequestInit, name: string) => new Headers(init.headers).get(name);

describe("PayPalLogin.authorizeUrl", () => {
  it("sends the person to PayPal with the app, the details asked for, the return address and the state", () => {
    const url = new URL(
      fakePayPal([]).login.authorizeUrl("STATE-1", "https://pactpal.test/auth/paypal/callback"),
    );
    expect(url.origin + url.pathname).toBe("https://login.paypal.test/connect");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      flowEntry: "static",
      client_id: "client-id",
      response_type: "code",
      scope: LOGIN_SCOPES.join(" "),
      redirect_uri: "https://pactpal.test/auth/paypal/callback",
      state: "STATE-1",
    });
  });
});

const GUIDE = "https://paypal.test/v1/identity/oauth2/userinfo?schema=paypalv1.1";
const GUIDE_OPENID = "https://paypal.test/v1/identity/oauth2/userinfo?schema=openid";
const REFERENCE = "https://paypal.test/v1/identity/openidconnect/userinfo?schema=openid";

/** An unsigned JWT with these claims (PayPal's signature is not checked; see login.ts). */
const idToken = (claims: Record<string, unknown>) =>
  ["header", Buffer.from(JSON.stringify(claims)).toString("base64url"), "signature"].join(".");
const goodClaims = {
  iss: "https://www.sandbox.paypal.com",
  aud: "client-id",
  exp: 3600, // the fake clock is at 0
  sub: "https://www.paypal.com/webapps/auth/identity/user/ABC",
  email: "maya@example.com",
  email_verified: true,
  name: "Maya Seller",
};
const tokenWith = (extra: Record<string, unknown>) => ({
  status: 200,
  body: { ...token.body, scope: "openid email", ...extra },
});
const refused = (status: number, debugId: string) => ({
  status,
  body: { name: "INVALID_REQUEST" },
  debugId,
});

describe("PayPalLogin.identify", () => {
  it("swaps the code with the app's credentials, then asks the sign-in guide's address with the person's token", async () => {
    const { login, calls } = fakePayPal([
      tokenWith({ refresh_token: "R", id_token: idToken(goodClaims), nonce: "N" }),
      {
        status: 200,
        body: {
          user_id: "https://www.paypal.com/webapps/auth/identity/user/ABC",
          name: "Maya Seller",
          payer_id: "PAYER1",
          verified_account: "true",
          emails: [{ value: "maya@example.com", primary: true, confirmed: true }],
        },
      },
    ]);
    expect(await login.identify("CODE-1")).toEqual({
      identity: {
        userId: "https://www.paypal.com/webapps/auth/identity/user/ABC",
        payerId: "PAYER1",
        email: "maya@example.com",
        emailVerified: true,
        name: "Maya Seller",
      },
      via: "GET /v1/identity/oauth2/userinfo?schema=paypalv1.1",
      diagnostics: {
        swap: "POST /v1/identity/openidconnect/tokenservice",
        swapRefusals: [],
        tokenFields: [
          "access_token",
          "expires_in",
          "id_token",
          "nonce",
          "refresh_token",
          "scope",
          "token_type",
        ],
        scopes: ["openid", "email"],
        refusals: [],
        idToken: { unusable: "not sent" },
      },
    });
    const [exchange, details] = calls;
    expect(exchange?.url).toBe("https://paypal.test/v1/identity/openidconnect/tokenservice");
    expect(exchange?.init.body).toBe("grant_type=authorization_code&code=CODE-1");
    expect(header(exchange!.init, "Authorization")).toBe(
      `Basic ${btoa("client-id:client-secret")}`,
    );
    expect(details?.url).toBe(GUIDE);
    expect(header(details!.init, "Authorization")).toBe("Bearer PERSON-TOKEN");
  });

  it("moves on after each refusal and records every one, with PayPal's codes and debug ids", async () => {
    const { login, calls } = fakePayPal([
      token,
      refused(400, "dbg-1"),
      refused(400, "dbg-2"),
      { status: 200, body: { sub: "USER-2", email: "b@example.com", email_verified: "true" } },
    ]);
    const outcome = await login.identify("CODE-1");
    expect(outcome.via).toBe("GET /v1/identity/openidconnect/userinfo?schema=openid");
    expect(outcome.identity).toMatchObject({ userId: "USER-2", emailVerified: true });
    expect(outcome.diagnostics.refusals).toEqual([
      {
        way: "GET /v1/identity/oauth2/userinfo?schema=paypalv1.1",
        status: 400,
        errorName: "INVALID_REQUEST",
        debugId: "dbg-1",
      },
      {
        way: "GET /v1/identity/oauth2/userinfo?schema=openid",
        status: 400,
        errorName: "INVALID_REQUEST",
        debugId: "dbg-2",
      },
    ]);
    expect(calls.map((c) => c.url).slice(1)).toEqual([GUIDE, GUIDE_OPENID, REFERENCE]);
  });

  it("uses PayPal's ID token when every address declines", async () => {
    const { login } = fakePayPal([
      tokenWith({ id_token: idToken({ ...goodClaims, aud: ["other", "client-id"] }) }),
      refused(400, "a"),
      refused(400, "b"),
      refused(401, "c"),
    ]);
    const outcome = await login.identify("CODE-1");
    expect(outcome.via).toBe("id_token");
    expect(outcome.identity).toEqual({
      userId: goodClaims.sub,
      payerId: undefined,
      email: "maya@example.com",
      emailVerified: true,
      name: "Maya Seller",
    });
    expect(outcome.diagnostics.idToken).toEqual({
      claims: ["aud", "email", "email_verified", "exp", "iss", "name", "sub"],
    });
    expect(outcome.diagnostics.refusals.map((r) => r.status)).toEqual([400, 400, 401]);
  });

  it.each([
    ["no ID token", {}, "not sent"],
    [
      "an ID token for another app",
      { id_token: idToken({ ...goodClaims, aud: "other" }) },
      "issued for another app",
    ],
    [
      "an ID token not from PayPal",
      { id_token: idToken({ ...goodClaims, iss: "https://evil.example" }) },
      "issuer is not PayPal",
    ],
    [
      "an ID token over plain http",
      { id_token: idToken({ ...goodClaims, iss: "http://www.paypal.com" }) },
      "issuer is not PayPal",
    ],
    ["an expired ID token", { id_token: idToken({ ...goodClaims, exp: 0 }) }, "expired"],
    [
      "an ID token without a person id",
      { id_token: idToken({ ...goodClaims, sub: undefined }) },
      "missing sub",
    ],
    ["a token that is not a JWT", { id_token: "nonsense" }, "not a JWT"],
    ["a JWT whose middle is not JSON", { id_token: "a.bm90IGpzb24.c" }, "payload is not JSON"],
  ])(
    "reports everything, without personal data, when every address declines and there is %s",
    async (_name, extra, reason) => {
      const { login } = fakePayPal([
        tokenWith(extra),
        refused(400, "a"),
        refused(400, "b"),
        refused(401, "c"),
      ]);
      const error = await login.identify("CODE-1").catch((e: unknown) => e);
      expect(error).toBeInstanceOf(PayPalLoginRefusedError);
      const { diagnostics } = error as PayPalLoginRefusedError;
      expect(diagnostics.idToken).toEqual({ unusable: reason });
      expect(diagnostics.refusals.map((r) => r.debugId)).toEqual(["a", "b", "c"]);
      expect(String(error)).toMatch(
        /schema=paypalv1\.1 400 INVALID_REQUEST \(debug id a\).*openidconnect.*401/,
      );
      expect(JSON.stringify(diagnostics)).not.toMatch(/maya@example\.com|PERSON-TOKEN|Maya/);
    },
  );

  it("stops without trying other addresses when PayPal itself is failing, after the usual retries", async () => {
    const { login, calls } = fakePayPal([token]); // every later answer is a 500
    await expect(login.identify("CODE-1")).rejects.toThrow(
      /oauth2\/userinfo\?schema=paypalv1\.1 failed with 500/,
    );
    expect(new Set(calls.slice(1).map((c) => c.url))).toEqual(new Set([GUIDE]));
    expect(calls).toHaveLength(4);
  });

  it("treats an email PayPal does not call verified as unproven", async () => {
    const { login } = fakePayPal([
      token,
      { status: 200, body: { sub: "U", email: "a@example.com" } },
    ]);
    expect((await login.identify("CODE-1")).identity.emailVerified).toBe(false);
  });

  it("does not repeat the code exchange when PayPal fails, and reports PayPal's error", async () => {
    const { login, calls } = fakePayPal([
      { status: 503, body: { error: "temporarily_unavailable" } },
    ]);
    await expect(login.identify("CODE-1")).rejects.toThrow(PayPalApiError);
    expect(calls).toHaveLength(1);
  });

  it("swaps at the general token address when the identity token service refuses the code", async () => {
    const { login, calls } = fakePayPal([
      { status: 400, body: { error: "access_denied" }, debugId: "dbg-swap" },
      token,
      { status: 200, body: { sub: "U", email: "a@example.com" } },
    ]);
    const outcome = await login.identify("CODE-1");
    expect(outcome.diagnostics.swap).toBe("POST /v1/oauth2/token");
    expect(outcome.diagnostics.swapRefusals).toEqual([
      {
        way: "POST /v1/identity/openidconnect/tokenservice",
        status: 400,
        errorName: "access_denied",
        debugId: "dbg-swap",
      },
    ]);
    expect(calls.map((c) => c.url).slice(0, 2)).toEqual([
      "https://paypal.test/v1/identity/openidconnect/tokenservice",
      "https://paypal.test/v1/oauth2/token",
    ]);
  });

  it("reports both refusals when neither address accepts the code", async () => {
    const { login, calls } = fakePayPal([
      { status: 400, body: { error: "access_denied" }, debugId: "dbg-a" },
      { status: 401, body: { error: "invalid_authz_code" }, debugId: "dbg-b" },
    ]);
    const error = await login.identify("OLD").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(PayPalLoginRefusedError);
    expect(String(error)).toMatch(
      /tokenservice 400 access_denied \(debug id dbg-a\).*oauth2\/token 401 invalid_authz_code/,
    );
    expect((error as PayPalLoginRefusedError).diagnostics.swap).toBeUndefined();
    expect(calls).toHaveLength(2);
  });

  it("names the missing field, without values, when the person has no id", async () => {
    const { login } = fakePayPal([token, { status: 200, body: { email: "a@example.com" } }]);
    const error = await login.identify("CODE-1").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(PayPalResponseError);
    expect(String(error)).toContain("user_id");
    expect(String(error)).not.toContain("a@example.com");
  });
});
