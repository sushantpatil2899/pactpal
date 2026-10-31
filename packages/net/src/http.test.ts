import { describe, expect, it } from "vitest";
import { defaultHttpDeps, sendWithRetry, type HttpDeps } from "./http.js";
import { DEFAULT_RETRY_POLICY } from "./retry.js";

const urlOf = (input: Parameters<typeof fetch>[0]): string =>
  typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

type Step = Response | Error;

/** A fake network that answers from a queue and records what was asked and waited. */
function fakeNetwork(steps: Step[]) {
  const urls: string[] = [];
  const sleeps: number[] = [];
  const deps: HttpDeps = {
    fetch: (input) => {
      urls.push(urlOf(input));
      const step = steps.shift();
      if (step === undefined) return Promise.reject(new Error("unexpected request"));
      if (step instanceof Error) return Promise.reject(step);
      return Promise.resolve(step);
    },
    now: () => 0,
    sleep: (ms) => {
      sleeps.push(ms);
      return Promise.resolve();
    },
    random: () => 0.5,
  };
  return { deps, urls, sleeps };
}

const failing = (status: number) => new Response("nope", { status });

const options = (idempotent = true) => ({
  operation: "GET /thing",
  url: "https://example.test/thing",
  init: { method: "GET" },
  idempotent,
});
const policy = { ...DEFAULT_RETRY_POLICY, maxAttempts: 3, timeoutMs: 1000 };
const makeError = (timedOut: boolean, cause: unknown) =>
  new Error(`no answer (timed out: ${String(timedOut)})`, { cause });

describe("sendWithRetry", () => {
  it("returns a successful answer at once", async () => {
    const net = fakeNetwork([new Response("ok")]);
    const response = await sendWithRetry(options(), net.deps, policy, makeError);
    expect(await response.text()).toBe("ok");
    expect(net.sleeps).toEqual([]);
  });

  it("retries a transient status and waits with growing pauses", async () => {
    const net = fakeNetwork([failing(503), failing(429), new Response("ok")]);
    const response = await sendWithRetry(options(), net.deps, policy, makeError);
    expect(response.status).toBe(200);
    expect(net.sleeps).toEqual([375, 750]);
    expect(net.urls).toHaveLength(3);
  });

  it("gives back the last error answer when the tries run out", async () => {
    const net = fakeNetwork([failing(500), failing(500), failing(502)]);
    const response = await sendWithRetry(options(), net.deps, policy, makeError);
    expect(response.status).toBe(502);
    expect(net.urls).toHaveLength(3);
  });

  it("does not retry a client error or a request that is not safe to repeat", async () => {
    const client = fakeNetwork([failing(400)]);
    expect((await sendWithRetry(options(), client.deps, policy, makeError)).status).toBe(400);
    expect(client.urls).toHaveLength(1);

    const write = fakeNetwork([failing(503)]);
    expect((await sendWithRetry(options(false), write.deps, policy, makeError)).status).toBe(503);
    expect(write.urls).toHaveLength(1);
  });

  it("retries a lost connection, then reports it with the caller's own error", async () => {
    const down = new Error("connection reset");
    const net = fakeNetwork([down, down, down]);
    await expect(sendWithRetry(options(), net.deps, policy, makeError)).rejects.toMatchObject({
      message: "no answer (timed out: false)",
      cause: down,
    });
    expect(net.urls).toHaveLength(3);
  });

  it("says when the failure was the time limit", async () => {
    const timeout = new DOMException("The operation timed out", "TimeoutError");
    const net = fakeNetwork([timeout]);
    await expect(sendWithRetry(options(false), net.deps, policy, makeError)).rejects.toThrow(
      "timed out: true",
    );
  });

  it("gives every try its own time limit", async () => {
    const seen: (AbortSignal | null | undefined)[] = [];
    const deps: HttpDeps = {
      ...fakeNetwork([]).deps,
      fetch: (_input, init) => {
        seen.push(init?.signal);
        return Promise.resolve(new Response("ok"));
      },
    };
    await sendWithRetry(options(), deps, policy, makeError);
    expect(seen[0]).toBeInstanceOf(AbortSignal);
  });
});

describe("defaultHttpDeps", () => {
  it("uses the real clock, sleep and randomness", async () => {
    expect(defaultHttpDeps.now()).toBeGreaterThan(0);
    await expect(defaultHttpDeps.sleep(1)).resolves.toBeUndefined();
    const value = defaultHttpDeps.random();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });
});
