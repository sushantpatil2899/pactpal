import { Secret, type HttpDeps } from "@pactpal/net";
import { describe, expect, it } from "vitest";
import { inspect } from "node:util";
import { AI_RETRY_POLICY, OpenAiCompatibleClient } from "./client.js";
import { testSpec } from "./testing.js";

const KEY = "sk-very-secret-key";
const PROMPT = "Maya's private chat about the logo";

const urlOf = (input: Parameters<typeof fetch>[0]): string =>
  typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

type Step = Response | Error;

const completion = (content: string | null, extra: Record<string, unknown> = {}) =>
  Response.json({
    choices: [{ message: { role: "assistant", content }, finish_reason: "stop", ...extra }],
    usage: { prompt_tokens: 12, completion_tokens: 3 },
  });

function setup(steps: Step[], spec = testSpec()) {
  const calls: { url: string; init: RequestInit }[] = [];
  const sleeps: number[] = [];
  let clock = 1000;
  const deps: HttpDeps = {
    fetch: (input, init) => {
      calls.push({ url: urlOf(input), init: init ?? {} });
      const step = steps.shift();
      if (step === undefined) return Promise.reject(new Error("unexpected request"));
      if (step instanceof Error) return Promise.reject(step);
      clock += 250;
      return Promise.resolve(step);
    },
    now: () => clock,
    sleep: (ms) => {
      sleeps.push(ms);
      return Promise.resolve();
    },
    random: () => 0.5,
  };
  const client = new OpenAiCompatibleClient(spec, new Secret(KEY), { deps });
  const ask = (extra: { json?: boolean; maxTokens?: number; temperature?: number } = {}) =>
    client.complete({ messages: [{ role: "user", content: PROMPT }], ...extra });
  const sentBody = () => {
    const body = calls[0]?.init.body;
    return JSON.parse(typeof body === "string" ? body : "") as Record<string, unknown>;
  };
  return { client, ask, calls, sleeps, sentBody };
}

describe("OpenAiCompatibleClient", () => {
  it("sends the question to the host's chat address with the key in the header", async () => {
    const { ask, calls, sentBody } = setup([completion("OK")]);
    const outcome = await ask();
    expect(outcome).toEqual({
      ok: true,
      model: "test-model",
      text: "OK",
      finishReason: "stop",
      usage: { promptTokens: 12, completionTokens: 3 },
      latencyMs: 250,
    });
    expect(calls[0]?.url).toBe("https://models.test/v1/chat/completions");
    expect(calls[0]?.init.headers).toMatchObject({ Authorization: `Bearer ${KEY}` });
    expect(sentBody()).toEqual({
      model: "test-1",
      messages: [{ role: "user", content: PROMPT }],
      max_tokens: 2000,
      temperature: 0.2,
    });
  });

  it("uses the limits the caller gives", async () => {
    const { ask, sentBody } = setup([completion("OK")]);
    await ask({ maxTokens: 50, temperature: 0 });
    expect(sentBody()).toMatchObject({ max_tokens: 50, temperature: 0 });
  });

  it("asks for a JSON object only when requested and the model supports it", async () => {
    const wanted = setup([completion("{}")]);
    await wanted.ask({ json: true });
    expect(wanted.sentBody()).toMatchObject({ response_format: { type: "json_object" } });

    const notWanted = setup([completion("{}")]);
    await notWanted.ask();
    expect(notWanted.sentBody()).not.toHaveProperty("response_format");

    const unsupported = setup([completion("{}")], testSpec({ jsonMode: false }));
    await unsupported.ask({ json: true });
    expect(unsupported.sentBody()).not.toHaveProperty("response_format");
  });

  it("reports a missing key without sending anything", async () => {
    const calls: string[] = [];
    const deps: HttpDeps = {
      fetch: (input) => {
        calls.push(urlOf(input));
        return Promise.resolve(completion("OK"));
      },
      now: () => 0,
      sleep: () => Promise.resolve(),
      random: () => 0,
    };
    const client = new OpenAiCompatibleClient(testSpec(), undefined, { deps });
    const outcome = await client.complete({ messages: [] });
    expect(outcome).toMatchObject({ ok: false, kind: "no_key" });
    expect(outcome.ok ? "" : outcome.message).toContain("TEST_API_KEY");
    expect(calls).toEqual([]);
  });

  it("retries a rate limit and then succeeds", async () => {
    const { ask, calls, sleeps } = setup([
      new Response("slow down", { status: 429 }),
      completion("OK"),
    ]);
    expect(await ask()).toMatchObject({ ok: true, text: "OK" });
    expect(calls).toHaveLength(2);
    expect(sleeps).toEqual([750]);
  });

  it("gives up after three tries on a server error", async () => {
    const { ask, calls } = setup([
      new Response("x", { status: 503 }),
      new Response("x", { status: 500 }),
      new Response("x", { status: 502 }),
    ]);
    expect(await ask()).toMatchObject({ ok: false, kind: "server", status: 502 });
    expect(calls).toHaveLength(3);
  });

  it("reports a rate limit that never clears", async () => {
    const limited = () => new Response("x", { status: 429 });
    const { ask } = setup([limited(), limited(), limited()]);
    expect(await ask()).toMatchObject({ ok: false, kind: "rate_limited", status: 429 });
  });

  it.each([
    [401, "auth"],
    [403, "auth"],
    [402, "out_of_credit"],
    [400, "rejected"],
    [404, "rejected"],
  ])("does not retry HTTP %i and calls it %s", async (status, kind) => {
    const { ask, calls } = setup([new Response("x", { status })]);
    expect(await ask()).toMatchObject({ ok: false, kind, status });
    expect(calls).toHaveLength(1);
  });

  it("reports a time-out and a lost connection", async () => {
    const timeout = new DOMException("The operation timed out", "TimeoutError");
    const slow = setup([timeout, timeout, timeout]);
    expect(await slow.ask()).toMatchObject({ ok: false, kind: "timeout" });
    expect(slow.calls).toHaveLength(3);

    const down = new Error("connection reset");
    const lost = setup([down, down, down]);
    expect(await lost.ask()).toMatchObject({ ok: false, kind: "network" });
  });

  it("keeps the host's short error code and nothing else from its error answer", async () => {
    const wording = `invalid request: ${PROMPT}`;
    const nested = setup([
      Response.json({ error: { message: wording, code: "invalid_api_key" } }, { status: 401 }),
    ]);
    const outcome = await nested.ask();
    expect(outcome).toMatchObject({ ok: false, kind: "auth" });
    expect(outcome.ok ? "" : outcome.message).toBe(
      "test-model: HTTP 401 (auth), code invalid_api_key",
    );

    const wrapped = setup([
      Response.json([{ error: { code: 400, status: "INVALID_ARGUMENT" } }], { status: 400 }),
    ]);
    const wrappedOutcome = await wrapped.ask();
    expect(wrappedOutcome.ok ? "" : wrappedOutcome.message).toContain("code 400");
  });

  it("drops a host's error code that is not a short plain token", async () => {
    const odd = setup([Response.json({ error: { code: `see: ${PROMPT}` } }, { status: 400 })]);
    const outcome = await odd.ask();
    expect(outcome.ok ? "" : outcome.message).toBe("test-model: HTTP 400 (rejected)");
    expect(outcome.ok ? "" : outcome.message).not.toContain("Maya");

    for (const body of ["not json", JSON.stringify({ error: "plain text error" }), "[]", "{}"]) {
      const other = setup([new Response(body, { status: 400 })]);
      const result = await other.ask();
      expect(result.ok ? "" : result.message).toBe("test-model: HTTP 400 (rejected)");
    }
  });

  it("never shows the key or the question in any failure", async () => {
    const steps: Step[][] = [
      [
        new Response(`echo ${PROMPT} ${KEY}`, { status: 500 }),
        new Response("x", { status: 500 }),
        new Response("x", { status: 500 }),
      ],
      [new Response(`echo ${PROMPT} ${KEY}`, { status: 400 })],
      [new Response(`echo ${PROMPT} ${KEY}`)],
      [new Error(`connect to ${KEY} failed`), new Error("x"), new Error("x")],
    ];
    for (const sequence of steps) {
      const outcome = await setup(sequence).ask();
      const shown = `${JSON.stringify(outcome)} ${inspect(outcome)}`;
      expect(shown).not.toContain(KEY);
      expect(shown).not.toContain("Maya");
    }
  });

  it("reports an answer that is not JSON or has the wrong shape", async () => {
    const notJson = await setup([new Response("<html>oops</html>")]).ask();
    expect(notJson).toMatchObject({ ok: false, kind: "bad_response" });
    expect(notJson.ok ? "" : notJson.message).toContain("not JSON");

    const noChoices = await setup([Response.json({ choices: [] })]).ask();
    expect(noChoices).toMatchObject({ ok: false, kind: "bad_response" });
    expect(noChoices.ok ? "" : noChoices.message).toContain("choices");

    const wrongType = await setup([
      Response.json({ choices: [{ message: { content: 7 } }] }),
    ]).ask();
    expect(wrongType).toMatchObject({ ok: false, kind: "bad_response" });

    const rootWrong = await setup([Response.json("text")]).ask();
    expect(rootWrong.ok ? "" : rootWrong.message).toContain("(root)");
  });

  it("reports an empty reply, and says when it was cut off by the length limit", async () => {
    const empty = await setup([completion(null)]).ask();
    expect(empty.ok ? "" : empty.message).toBe("test-model: reply is empty");

    const blank = await setup([completion("  \n")]).ask();
    expect(blank).toMatchObject({ ok: false, kind: "bad_response" });

    const cut = await setup([completion("", { finish_reason: "length" })]).ask();
    expect(cut.ok ? "" : cut.message).toContain("cut off by the length limit");
  });

  it("returns a reply that was cut off with its finish reason, so the caller can reject it", async () => {
    const outcome = await setup([completion('{"a":', { finish_reason: "length" })]).ask();
    expect(outcome).toMatchObject({ ok: true, text: '{"a":', finishReason: "length" });
  });

  it("accepts a reply without usage or finish reason", async () => {
    const outcome = await setup([
      Response.json({ choices: [{ message: { content: "hi" } }] }),
    ]).ask();
    expect(outcome).toMatchObject({
      ok: true,
      text: "hi",
      finishReason: undefined,
      usage: undefined,
    });
  });

  it("gives models a long time limit and a few capped retries", () => {
    expect(AI_RETRY_POLICY).toEqual({
      maxAttempts: 3,
      baseDelayMs: 1000,
      maxDelayMs: 8000,
      timeoutMs: 60_000,
    });
  });

  it("works with the real clock and network settings when none are given", () => {
    const client = new OpenAiCompatibleClient(testSpec(), new Secret(KEY));
    expect(client.spec.name).toBe("test-model");
  });
});
