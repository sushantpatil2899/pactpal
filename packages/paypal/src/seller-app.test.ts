import { DEFAULT_RETRY_POLICY, Secret, type HttpDeps } from "@pactpal/net";
import { describe, expect, it } from "vitest";
import { checkSellerApp } from "./seller-app.js";

const INVOICING = "https://uri.paypal.com/services/invoicing";
const DISPUTES = "https://uri.paypal.com/services/disputes/read-seller";

interface Reply {
  status: number;
  body: unknown;
}

/** PayPal answering by path: the login, then the balances report. */
function paypal(login: Reply, balances: Reply = { status: 200, body: { account_id: "SELLER2" } }) {
  const paths: string[] = [];
  const deps: HttpDeps = {
    fetch: (input) => {
      const path = new URL(input instanceof Request ? input.url : input.toString()).pathname;
      paths.push(path);
      const reply = path === "/v1/oauth2/token" ? login : balances;
      const headers = { "Content-Type": "application/json", "PayPal-Debug-Id": `dbg${path}` };
      return Promise.resolve(new Response(JSON.stringify(reply.body), { ...reply, headers }));
    },
    now: () => 0,
    sleep: () => Promise.resolve(),
    random: () => 0.5,
  };
  const check = () =>
    checkSellerApp(
      { clientId: "seller-client", clientSecret: new Secret("seller-secret") },
      { baseUrl: "https://paypal.test", deps, policy: { ...DEFAULT_RETRY_POLICY, maxAttempts: 1 } },
    );
  return { check, paths };
}

const loggedIn = (scopes: string[]): Reply => ({
  status: 200,
  body: { access_token: "T", token_type: "Bearer", expires_in: 900, scope: scopes.join(" ") },
});

describe("checkSellerApp", () => {
  it("accepts an app with invoices and disputes, naming its account", async () => {
    const { check, paths } = paypal(loggedIn([INVOICING, DISPUTES]));
    expect(await check()).toEqual({
      ok: true,
      merchantId: "SELLER2",
      scopes: [INVOICING, DISPUTES],
    });
    expect(paths).toEqual(["/v1/oauth2/token", "/v1/reporting/balances"]);
  });

  it("refuses keys PayPal does not accept, without reading anything else", async () => {
    const { check, paths } = paypal({ status: 401, body: { error: "invalid_client" } });
    expect(await check()).toEqual({
      ok: false,
      reason: "login-failed",
      debugId: "dbg/v1/oauth2/token",
    });
    expect(paths).toEqual(["/v1/oauth2/token"]);
  });

  it("names the permissions the app lacks", async () => {
    const { check } = paypal(loggedIn([DISPUTES]));
    expect(await check()).toEqual({
      ok: false,
      reason: "missing-features",
      missing: ["Invoicing"],
    });
  });

  it("says when PayPal will not name the account", async () => {
    const { check } = paypal(loggedIn([INVOICING, DISPUTES]), { status: 403, body: {} });
    expect(await check()).toEqual({
      ok: false,
      reason: "account-unreadable",
      debugId: "dbg/v1/reporting/balances",
    });
  });

  it("throws on a PayPal outage rather than blaming the keys", async () => {
    await expect(paypal({ status: 500, body: {} }).check()).rejects.toThrow();
    const balancesDown = paypal(loggedIn([INVOICING, DISPUTES]), { status: 500, body: {} });
    await expect(balancesDown.check()).rejects.toThrow();
  });
});
