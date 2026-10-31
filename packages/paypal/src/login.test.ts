import { describe, expect, it } from "vitest";
import { Secret } from "./credentials.js";
import { PayPalApiError, PayPalResponseError } from "./errors.js";
import type { HttpDeps } from "./http.js";
import { LOGIN_SCOPES, PayPalLogin } from "./login.js";
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

const SWAP = "https://paypal.test/v1/identity/openidconnect/tokenservice";
const DETAILS = "https://paypal.test/v1/identity/oauth2/userinfo?schema=paypalv1.1";

describe("PayPalLogin.identify", () => {
  it("swaps the code at PayPal's identity token service, then asks who the person is with their key", async () => {
    const { login, calls } = fakePayPal([
      {
        status: 200,
        body: { ...token.body, id_token: "x.y.z", refresh_token: "R" },
      },
      {
        status: 200,
        body: {
          user_id: "https://www.paypal.com/webapps/auth/identity/user/ABC",
          name: "John Doe",
          payer_id: "PAYER1",
          verified_account: "true",
          emails: [{ value: "john@example.com", primary: true, confirmed: true }],
        },
      },
    ]);
    expect(await login.identify("CODE-1")).toEqual({
      userId: "https://www.paypal.com/webapps/auth/identity/user/ABC",
      payerId: "PAYER1",
      email: "john@example.com",
      emailVerified: true,
      name: "John Doe",
    });
    const [swap, details] = calls;
    expect(swap?.url).toBe(SWAP);
    expect(swap?.init.body).toBe("grant_type=authorization_code&code=CODE-1");
    expect(header(swap!.init, "Authorization")).toBe(`Basic ${btoa("client-id:client-secret")}`);
    expect(details?.url).toBe(DETAILS);
    expect(header(details!.init, "Authorization")).toBe("Bearer PERSON-TOKEN");
  });

  it("also reads the OpenID shape, with sub, email and email_verified", async () => {
    const { login } = fakePayPal([
      token,
      { status: 200, body: { sub: "USER-2", email: "b@example.com", email_verified: "true" } },
    ]);
    expect(await login.identify("CODE-1")).toEqual({
      userId: "USER-2",
      payerId: undefined,
      email: "b@example.com",
      emailVerified: true,
      name: undefined,
    });
  });

  it("treats an email PayPal does not call verified as unproven", async () => {
    const { login } = fakePayPal([
      token,
      { status: 200, body: { user_id: "U", emails: [{ value: "a@example.com" }] } },
    ]);
    expect((await login.identify("CODE-1")).emailVerified).toBe(false);
  });

  it("never repeats the code swap, even when PayPal is failing", async () => {
    const { login, calls } = fakePayPal([
      { status: 503, body: { error: "temporarily_unavailable" } },
    ]);
    await expect(login.identify("CODE-1")).rejects.toThrow(PayPalApiError);
    expect(calls).toHaveLength(1);
  });

  it("reports a refused code with PayPal's code and debug id", async () => {
    const { login } = fakePayPal([
      { status: 400, body: { error: "access_denied" }, debugId: "dbg-swap" },
    ]);
    await expect(login.identify("OLD")).rejects.toThrow(
      /tokenservice failed with 400 access_denied.*debug id dbg-swap/,
    );
  });

  it("reports PayPal declining to say who the person is, with the debug id", async () => {
    const { login } = fakePayPal([
      token,
      { status: 400, body: { error: "invalid_request" }, debugId: "dbg-who" },
    ]);
    await expect(login.identify("CODE-1")).rejects.toThrow(
      /oauth2\/userinfo failed with 400 invalid_request.*debug id dbg-who/,
    );
  });

  it("retries the details request when PayPal is briefly failing", async () => {
    const { login, calls } = fakePayPal([
      token,
      { status: 500, body: {} },
      { status: 200, body: { sub: "U", email: "a@example.com" } },
    ]);
    expect((await login.identify("CODE-1")).userId).toBe("U");
    expect(calls.map((c) => c.url)).toEqual([SWAP, DETAILS, DETAILS]);
  });

  it("names the missing field, without values, when the person has no id", async () => {
    const { login } = fakePayPal([token, { status: 200, body: { email: "a@example.com" } }]);
    const error = await login.identify("CODE-1").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(PayPalResponseError);
    expect(String(error)).toContain("user_id");
    expect(String(error)).not.toContain("a@example.com");
  });
});
