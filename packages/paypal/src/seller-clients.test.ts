import { DEFAULT_RETRY_POLICY, Secret, type HttpDeps } from "@pactpal/net";
import { describe, expect, it } from "vitest";
import { PlatformSellerClients } from "./seller-clients.js";

const BASE = "https://paypal.test";

function setup() {
  const calls: { url: string; headers: Headers }[] = [];
  const deps: HttpDeps = {
    fetch: (input: string | URL | Request, init: RequestInit = {}) => {
      const url = input instanceof Request ? input.url : input.toString();
      calls.push({ url, headers: new Headers(init.headers) });
      const body = url.endsWith("/v1/oauth2/token")
        ? { access_token: "tok", token_type: "Bearer", expires_in: 32400 }
        : { items: [], links: [] };
      return Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
    },
    now: () => 1_000_000,
    sleep: () => Promise.resolve(),
    random: () => 0.5,
  };
  const platform = new PlatformSellerClients(
    { clientId: "client-id", clientSecret: new Secret("secret") },
    { baseUrl: BASE, deps, policy: { ...DEFAULT_RETRY_POLICY, timeoutMs: 1000 } },
  );
  const api = () => calls.filter((call) => !call.url.endsWith("/v1/oauth2/token"));
  const logins = () => calls.filter((call) => call.url.endsWith("/v1/oauth2/token"));
  return { platform, api, logins };
}

const sellerIn = (headers: Headers): unknown => {
  const payload = headers.get("PayPal-Auth-Assertion")?.split(".")[1] ?? "";
  return (JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { payer_id: string })
    .payer_id;
};

describe("PlatformSellerClients", () => {
  it("names each seller in its own calls and shares one login between sellers", async () => {
    const { platform, api, logins } = setup();
    await platform.for("SELLER_A").disputes.list();
    await platform.for("SELLER_B").disputes.list();

    expect(api().map((call) => sellerIn(call.headers))).toEqual(["SELLER_A", "SELLER_B"]);
    expect(api().every((call) => call.url.startsWith(`${BASE}/v1/customer/disputes`))).toBe(true);
    expect(logins()).toHaveLength(1);
    expect(logins()[0]?.headers.get("PayPal-Auth-Assertion")).toBeNull();
  });

  it("keeps one set of clients per seller and goes over REST only", async () => {
    const { platform } = setup();
    const a = platform.for("SELLER_A");
    expect(platform.for("SELLER_A")).toBe(a);
    expect(platform.for("SELLER_B")).not.toBe(a);
    expect((await a.disputes.list()).transport).toBe("rest");
  });
});
