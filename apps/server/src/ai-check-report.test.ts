import { okReply, testSpec } from "@pactpal/ai/testing";
import { describe, expect, it } from "vitest";
import { AI_CHECK_PROMPT, formatAiReport, summarizeOutcome } from "./ai-check-report.js";

const spec = testSpec({ name: "gemini", model: "gemini-3.6-flash" });

describe("summarizeOutcome", () => {
  it.each([
    ['{"status":"OK"}', true],
    ['```json\n{"status": "OK"}\n```', true],
    ["OK", false],
    ['{"status":"no"}', false],
    ["[1]", false],
    ["null", false],
  ])("reads the reply %j as JSON reply: %s", (text, jsonReply) => {
    expect(summarizeOutcome(okReply(spec, text))).toMatchObject({ status: "ok", jsonReply });
  });

  it("shows the time and the token counts when the host reports them", () => {
    expect(summarizeOutcome({ ...okReply(spec, "{}"), latencyMs: 1234 })).toMatchObject({
      latencyMs: 1234,
      tokens: "10 + 5 tokens",
    });
    expect(summarizeOutcome({ ...okReply(spec, "{}"), usage: undefined })).toMatchObject({
      tokens: undefined,
    });
  });

  it("keeps a failure's safe message", () => {
    expect(
      summarizeOutcome({
        ok: false,
        model: "gemini",
        kind: "auth",
        message: "gemini: HTTP 401 (auth)",
        status: 401,
      }),
    ).toEqual({ status: "failed", error: "gemini: HTTP 401 (auth)" });
  });
});

describe("formatAiReport", () => {
  it("shows each model's result and never the question or the keys", () => {
    const other = testSpec({ name: "mistral", model: "ministral-14b-latest" });
    const third = testSpec({ name: "qwen-groq", model: "qwen/qwen3.8-27b" });
    const text = formatAiReport([
      {
        spec,
        check: { status: "ok", latencyMs: 1250, tokens: "12 + 6 tokens", jsonReply: true },
      },
      { spec: other, check: { status: "skipped", missingKey: "MISTRAL_API_KEY" } },
      { spec: third, check: { status: "failed", error: "qwen-groq: HTTP 429 (rate_limited)" } },
    ]);
    expect(text).toBe(
      [
        "gemini (gemini-3.6-flash)",
        "  Result      ok, 1.3 s, 12 + 6 tokens",
        "  JSON reply  yes",
        "mistral (ministral-14b-latest)",
        "  Result  skipped: MISTRAL_API_KEY is not set",
        "qwen-groq (qwen/qwen3.8-27b)",
        "  Result  failed: qwen-groq: HTTP 429 (rate_limited)",
        "",
      ].join("\n"),
    );
    expect(text).not.toContain(AI_CHECK_PROMPT);
  });

  it("says plainly when a reply was not the JSON asked for, and omits tokens that were not reported", () => {
    const text = formatAiReport([
      { spec, check: { status: "ok", latencyMs: 400, tokens: undefined, jsonReply: false } },
    ]);
    expect(text).toContain("ok, 0.4 s\n");
    expect(text).toContain("no (the reply was not the JSON that was asked for)");
  });
});
