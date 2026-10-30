import { describe, expect, it } from "vitest";
import { Secret } from "./credentials.js";
import { PayPalApiError, PayPalResponseError } from "./errors.js";
import type { HttpDeps } from "./http.js";
import { LOGIN_SCOPES, PayPalLogin } from "./login.js";
import { DEFAULT_RETRY_POLICY } from "./retry.js";

const credentials = { clientId: "client-id", clientSecret: new Secret("client-secret") };

/** A fake PayPal answering the token request, then the details request, from a queue. */
function fakePayPal(answers: { status: number; body: unknown }[]) {
  const calls: { url: string; init: RequestInit }[] = [];
  const queue = [...answers];
  const deps: HttpDeps = {
    fetch: (input, init = {}) => {
      calls.push({ url: input instanceof Request ? input.url : input.toString(), init });
      const answer = queue.shift() ?? { status: 500, body: {} };
      return Promise.resolve(
        new Response(JSON.stringify(answer.body), {
          status: answer.status,
          headers: { "Content-Type": "application/json", "PayPal-Debug-Id": "dbg-1" },
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

describe("PayPalLogin.identify", () => {
  it("swaps the code with the app's credentials and reads the person with their token", async () => {
    const { login, calls } = fakePayPal([
      token,
      {
        status: 200,
        body: {
          sub: "https://www.paypal.com/webapps/auth/identity/user/ABC",
          payer_id: "PAYER1",
          name: "Maya Seller",
          email: "maya@example.com",
          email_verified: true,
        },
      },
    ]);
    expect(await login.identify("CODE-1")).toEqual({
      userId: "https://www.paypal.com/webapps/auth/identity/user/ABC",
      payerId: "PAYER1",
      email: "maya@example.com",
      emailVerified: true,
      name: "Maya Seller",
    });
    const [exchange, details] = calls;
    expect(exchange?.url).toBe("https://paypal.test/v1/oauth2/token");
    expect(exchange?.init.body).toBe("grant_type=authorization_code&code=CODE-1");
    expect(header(exchange!.init, "Authorization")).toBe(
      `Basic ${btoa("client-id:client-secret")}`,
    );
    expect(details?.url).toBe(
      "https://paypal.test/v1/identity/openidconnect/userinfo?schema=openid",
    );
    expect(header(details!.init, "Authorization")).toBe("Bearer PERSON-TOKEN");
  });

  it("also reads PayPal's older shape, with user_id and a list of emails", async () => {
    const { login } = fakePayPal([
      token,
      {
        status: 200,
        body: {
          user_id: "USER-1",
          emails: [
            { value: "old@example.com", primary: false, confirmed: true },
            { value: "main@example.com", primary: "true", confirmed: "false" },
          ],
        },
      },
    ]);
    expect(await login.identify("CODE-1")).toEqual({
      userId: "USER-1",
      payerId: undefined,
      email: "main@example.com",
      emailVerified: false,
      name: undefined,
    });
  });

  it("treats an email PayPal does not call verified as unproven", async () => {
    const { login } = fakePayPal([
      token,
      { status: 200, body: { sub: "U", email: "a@example.com" } },
    ]);
    expect((await login.identify("CODE-1")).emailVerified).toBe(false);
  });

  it("does not repeat the code exchange when PayPal fails, and reports PayPal's error", async () => {
    const { login, calls } = fakePayPal([
      { status: 503, body: { error: "temporarily_unavailable" } },
    ]);
    await expect(login.identify("CODE-1")).rejects.toThrow(PayPalApiError);
    expect(calls).toHaveLength(1);
  });

  it("reports a refused code", async () => {
    const { login } = fakePayPal([
      { status: 400, body: { error: "invalid_grant", error_description: "code expired" } },
    ]);
    await expect(login.identify("OLD")).rejects.toThrow(/invalid_grant/);
  });

  it("reports PayPal refusing the details request", async () => {
    const { login } = fakePayPal([token, { status: 401, body: { error: "invalid_token" } }]);
    await expect(login.identify("CODE-1")).rejects.toThrow(/userinfo failed with 401/);
  });

  it("names the missing field, without values, when the person has no id", async () => {
    const { login } = fakePayPal([token, { status: 200, body: { email: "a@example.com" } }]);
    const error = await login.identify("CODE-1").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(PayPalResponseError);
    expect(String(error)).toContain("user_id");
    expect(String(error)).not.toContain("a@example.com");
  });
});
