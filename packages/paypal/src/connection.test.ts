import { inspect } from "node:util";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { SANDBOX_API_BASE_URL, Secret } from "./credentials.js";
import { PayPalApiError, PayPalNetworkError, PayPalResponseError } from "./errors.js";
import { defaultHttpDeps, type HttpDeps } from "./http.js";
import { PayPalRestClient } from "./rest.js";
import { DEFAULT_RETRY_POLICY } from "./retry.js";
import { AccessTokenProvider } from "./token.js";

const BASE = "https://paypal.test";
const TOKEN_URL = `${BASE}/v1/oauth2/token`;

type Reply = Response | Error | ((init: RequestInit) => Promise<Response>);

interface Call {
  url: string;
  init: RequestInit;
}

function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

let tokenCounter = 0;
function tokenReply(overrides: Record<string, unknown> = {}): Response {
  tokenCounter += 1;
  return json(200, {
    access_token: `tok-${tokenCounter}`,
    token_type: "Bearer",
    expires_in: 32400,
    scope:
      "https://uri.paypal.com/services/invoicing https://uri.paypal.com/services/disputes/read-seller",
    app_id: "APP-1",
    ...overrides,
  });
}

/** Fake network: answers token requests and API requests from separate queues. */
function setup(options: { tokens?: Reply[]; api?: Reply[]; timeoutMs?: number } = {}) {
  const tokenQueue = [...(options.tokens ?? [])];
  const apiQueue = [...(options.api ?? [])];
  const calls: Call[] = [];
  const sleeps: number[] = [];
  let now = 1_000_000;

  const fakeFetch = async (input: string | URL | Request, init: RequestInit = {}) => {
    const url = input instanceof Request ? input.url : input.toString();
    calls.push({ url, init });
    const queue = url === TOKEN_URL ? tokenQueue : apiQueue;
    const reply = queue.shift() ?? (url === TOKEN_URL ? tokenReply() : undefined);
    if (reply === undefined) throw new Error(`unexpected request to ${url}`);
    if (reply instanceof Error) throw reply;
    if (typeof reply === "function") return reply(init);
    return reply;
  };

  const deps: HttpDeps = {
    fetch: fakeFetch,
    now: () => now,
    sleep: (ms) => {
      sleeps.push(ms);
      return Promise.resolve();
    },
    random: () => 0.5,
  };
  const policy = { ...DEFAULT_RETRY_POLICY, timeoutMs: options.timeoutMs ?? 1000 };
  const credentials = { clientId: "client-id", clientSecret: new Secret("client-secret") };
  const tokens = new AccessTokenProvider(credentials, { baseUrl: BASE, deps, policy });
  const client = new PayPalRestClient(tokens, { baseUrl: BASE, deps, policy });

  return {
    tokens,
    client,
    calls,
    sleeps,
    advance: (ms: number) => {
      now += ms;
    },
    apiCalls: () => calls.filter((call) => call.url !== TOKEN_URL),
    tokenCalls: () => calls.filter((call) => call.url === TOKEN_URL),
  };
}

function header(call: Call | undefined, name: string): string | null {
  return new Headers(call?.init.headers).get(name);
}

const item = z.object({ id: z.string() });

async function rejection(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error("expected the promise to reject");
}

describe("AccessTokenProvider", () => {
  it("logs in with client credentials and reads the token details", async () => {
    const { tokens, tokenCalls } = setup();
    const token = await tokens.get();

    const call = tokenCalls()[0];
    expect(call?.init.method).toBe("POST");
    expect(call?.init.body).toBe("grant_type=client_credentials");
    expect(header(call, "Authorization")).toBe(`Basic ${btoa("client-id:client-secret")}`);
    expect(header(call, "Content-Type")).toBe("application/x-www-form-urlencoded");
    expect(token.value.reveal()).toMatch(/^tok-/);
    expect(token.expiresAt).toBe(1_000_000 + 32400 * 1000);
    expect(token.scopes).toEqual([
      "https://uri.paypal.com/services/invoicing",
      "https://uri.paypal.com/services/disputes/read-seller",
    ]);
    expect(token.appId).toBe("APP-1");
  });

  it("never shows the token when printed", async () => {
    const { tokens } = setup();
    const token = await tokens.get();
    const printed = `${JSON.stringify(token)} ${inspect(token)}`;
    expect(printed).not.toContain(token.value.reveal());
  });

  it("reuses the token until 5 minutes before expiry, then renews it", async () => {
    const { tokens, tokenCalls, advance } = setup({
      tokens: [tokenReply({ expires_in: 3600 })],
    });
    const first = await tokens.get();
    advance(3600_000 - 5 * 60_000 - 1);
    expect(await tokens.get()).toBe(first);
    advance(1);
    expect(await tokens.get()).not.toBe(first);
    expect(tokenCalls()).toHaveLength(2);
  });

  it("shares one login between concurrent callers", async () => {
    const { tokens, tokenCalls } = setup();
    const [a, b, c] = await Promise.all([tokens.get(), tokens.get(), tokens.get()]);
    expect(a).toBe(b);
    expect(b).toBe(c);
    expect(tokenCalls()).toHaveLength(1);
  });

  it("logs in again after invalidate()", async () => {
    const { tokens, tokenCalls } = setup();
    await tokens.get();
    tokens.invalidate();
    await tokens.get();
    expect(tokenCalls()).toHaveLength(2);
  });

  it("treats a missing scope as no permissions", async () => {
    const { tokens } = setup({ tokens: [tokenReply({ scope: undefined })] });
    expect((await tokens.get()).scopes).toEqual([]);
  });

  it("reports a rejected login with PayPal's error and debug id, without the secret", async () => {
    const { tokens } = setup({
      tokens: [
        json(
          401,
          { error: "invalid_client", error_description: "Client Authentication failed" },
          { "PayPal-Debug-Id": "dbg-401" },
        ),
      ],
    });
    const error = await rejection(tokens.get());
    expect(error).toBeInstanceOf(PayPalApiError);
    expect(error).toMatchObject({
      status: 401,
      errorName: "invalid_client",
      errorMessage: "Client Authentication failed",
      debugId: "dbg-401",
    });
    expect(String(error)).toBe(
      "PayPalApiError: POST /v1/oauth2/token failed with 401 invalid_client: Client Authentication failed (debug id dbg-401)",
    );
    expect(String(error)).not.toContain("client-secret");
  });

  it("retries a login after a server error", async () => {
    const { tokens, tokenCalls, sleeps } = setup({ tokens: [json(503, {}), tokenReply()] });
    await tokens.get();
    expect(tokenCalls()).toHaveLength(2);
    expect(sleeps).toEqual([375]);
  });

  it("rejects a login answer of the wrong shape", async () => {
    const { tokens } = setup({ tokens: [json(200, { token_type: "Bearer" })] });
    const error = await rejection(tokens.get());
    expect(error).toBeInstanceOf(PayPalResponseError);
    expect((error as PayPalResponseError).issues.join()).toMatch(/access_token/);
  });

  it("allows another login attempt after a failed one", async () => {
    const { tokens } = setup({ tokens: [json(400, {})] });
    await rejection(tokens.get());
    await expect(tokens.get()).resolves.toBeDefined();
  });
});

describe("PayPalRestClient", () => {
  it("sends an authenticated read with query parameters and returns checked data", async () => {
    const { client, apiCalls } = setup({
      api: [json(200, { id: "INV-1" }, { "PayPal-Debug-Id": "dbg-1" })],
    });
    const result = await client.request({
      method: "GET",
      path: "/v2/invoicing/invoices",
      query: { page: 1, total_required: true },
      schema: item,
    });

    expect(result).toEqual({ data: { id: "INV-1" }, status: 200, debugId: "dbg-1" });
    const call = apiCalls()[0];
    expect(call?.url).toBe(`${BASE}/v2/invoicing/invoices?page=1&total_required=true`);
    expect(header(call, "Authorization")).toMatch(/^Bearer tok-/);
    expect(header(call, "PayPal-Request-Id")).toBeNull();
  });

  it("sends a write as JSON with its request id", async () => {
    const { client, apiCalls } = setup({ api: [json(201, { id: "INV-2" })] });
    await client.request({
      method: "POST",
      path: "/v2/invoicing/invoices",
      body: { amount: "10.00" },
      requestId: "req-1",
      schema: item,
    });
    const call = apiCalls()[0];
    expect(call?.init.body).toBe('{"amount":"10.00"}');
    expect(header(call, "Content-Type")).toBe("application/json");
    expect(header(call, "PayPal-Request-Id")).toBe("req-1");
  });

  it("sends a write without a body and accepts an empty 204 answer", async () => {
    const { client, apiCalls } = setup({ api: [new Response(null, { status: 204 })] });
    const result = await client.request({
      method: "POST",
      path: "/v2/invoicing/invoices/INV-2/send",
      requestId: "req-2",
      schema: z.undefined(),
    });
    expect(result.status).toBe(204);
    expect(apiCalls()[0]?.init.body).toBeUndefined();
    expect(header(apiCalls()[0], "Content-Type")).toBeNull();
  });

  it.each([
    ["429", () => json(429, {})],
    ["500", () => json(500, {})],
    ["a network failure", () => new TypeError("fetch failed")],
  ])("retries a write after %s with the same request id", async (_label, failure) => {
    const { client, apiCalls, sleeps } = setup({ api: [failure(), json(201, { id: "INV-3" })] });
    await client.request({
      method: "POST",
      path: "/v2/invoicing/invoices",
      body: {},
      requestId: "req-3",
      schema: item,
    });
    expect(apiCalls().map((call) => header(call, "PayPal-Request-Id"))).toEqual(["req-3", "req-3"]);
    expect(sleeps).toEqual([375]);
  });

  it("gives up after 3 tries and reports the last error", async () => {
    const { client, apiCalls, sleeps } = setup({
      api: [json(500, {}), json(502, {}), json(503, { name: "SERVICE_UNAVAILABLE" })],
    });
    const error = await rejection(client.request({ method: "GET", path: "/v1/x", schema: item }));
    expect(error).toMatchObject({ status: 503, errorName: "SERVICE_UNAVAILABLE" });
    expect(apiCalls()).toHaveLength(3);
    expect(sleeps).toEqual([375, 750]);
  });

  it("does not retry a client error and carries PayPal's details", async () => {
    const { client, apiCalls } = setup({
      api: [
        json(422, {
          name: "UNPROCESSABLE_ENTITY",
          message: "The requested action could not be performed.",
          debug_id: "dbg-body",
          details: [{ field: "/amount", issue: "INVALID_AMOUNT", description: "Too low" }],
        }),
      ],
    });
    const error = await rejection(
      client.request({ method: "POST", path: "/v1/y", requestId: "req-4", schema: item }),
    );
    expect(error).toBeInstanceOf(PayPalApiError);
    expect(error).toMatchObject({
      status: 422,
      errorName: "UNPROCESSABLE_ENTITY",
      debugId: "dbg-body",
      details: [{ field: "/amount", issue: "INVALID_AMOUNT", description: "Too low" }],
    });
    expect(apiCalls()).toHaveLength(1);
  });

  it("reports an error answer that is not JSON", async () => {
    const { client } = setup({ api: [new Response("Bad Gateway", { status: 400 })] });
    const error = await rejection(client.request({ method: "GET", path: "/v1/z", schema: item }));
    expect(String(error)).toBe("PayPalApiError: GET /v1/z failed with 400");
  });

  it("renews the token once when PayPal rejects it", async () => {
    const { client, apiCalls, tokenCalls } = setup({
      api: [json(401, { name: "AUTHENTICATION_FAILURE" }), json(200, { id: "ok" })],
    });
    const result = await client.request({ method: "GET", path: "/v1/a", schema: item });
    expect(result.data).toEqual({ id: "ok" });
    expect(tokenCalls()).toHaveLength(2);
    expect(apiCalls().map((call) => header(call, "Authorization"))).toEqual([
      expect.stringMatching(/^Bearer tok-/),
      expect.stringMatching(/^Bearer tok-/),
    ]);
    expect(header(apiCalls()[0], "Authorization")).not.toBe(header(apiCalls()[1], "Authorization"));
  });

  it("fails if PayPal rejects the renewed token too", async () => {
    const { client, tokenCalls } = setup({ api: [json(401, {}), json(401, {})] });
    const error = await rejection(client.request({ method: "GET", path: "/v1/a", schema: item }));
    expect(error).toMatchObject({ status: 401 });
    expect(tokenCalls()).toHaveLength(2);
  });

  it("times out a request that never answers", async () => {
    const hang = (init: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init.signal?.addEventListener("abort", () => {
          reject(init.signal?.reason as Error);
        });
      });
    const { client, apiCalls } = setup({ api: [hang, hang, hang], timeoutMs: 5 });
    const error = await rejection(
      client.request({ method: "GET", path: "/v1/slow", schema: item }),
    );
    expect(error).toBeInstanceOf(PayPalNetworkError);
    expect(error).toMatchObject({ timedOut: true, message: "GET /v1/slow timed out" });
    expect(apiCalls()).toHaveLength(3);
  });

  it("reports a dropped connection", async () => {
    const drop = () => new TypeError("fetch failed");
    const { client } = setup({ api: [drop(), drop(), drop()] });
    const error = await rejection(client.request({ method: "GET", path: "/v1/b", schema: item }));
    expect(error).toMatchObject({ timedOut: false, message: "GET /v1/b could not reach PayPal" });
  });

  it.each([
    ["wrong shape", json(200, { id: 7 }, { "PayPal-Debug-Id": "dbg-shape" }), /id: /],
    ["not JSON", new Response("<html>", { status: 200 }), /body is not JSON/],
    ["empty", new Response("", { status: 200 }), /\(root\)/],
  ])("rejects a success answer that is %s", async (_label, reply, issue) => {
    const { client } = setup({ api: [reply] });
    const error = await rejection(client.request({ method: "GET", path: "/v1/c", schema: item }));
    expect(error).toBeInstanceOf(PayPalResponseError);
    expect((error as PayPalResponseError).issues.join()).toMatch(issue);
  });
});

describe("defaults", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses the sandbox address and the global fetch when no options are given", async () => {
    const urls: string[] = [];
    vi.stubGlobal("fetch", (input: string) => {
      urls.push(input);
      return Promise.resolve(
        input.endsWith("/v1/oauth2/token") ? tokenReply() : json(200, { id: "x" }),
      );
    });
    const tokens = new AccessTokenProvider({ clientId: "id", clientSecret: new Secret("s") });
    await new PayPalRestClient(tokens).request({ method: "GET", path: "/v1/d", schema: item });
    expect(urls).toEqual([
      `${SANDBOX_API_BASE_URL}/v1/oauth2/token`,
      `${SANDBOX_API_BASE_URL}/v1/d`,
    ]);
  });

  it("provides a real clock, wait and random source", async () => {
    expect(defaultHttpDeps.now()).toBeGreaterThan(0);
    await expect(defaultHttpDeps.sleep(1)).resolves.toBeUndefined();
    const value = defaultHttpDeps.random();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });
});
