import { describe, expect, it } from "vitest";
import { DEFAULT_MODEL, rankModels } from "./index.js";

describe("model ranking", () => {
  const now = new Date("2026-11-04T12:00:00.000Z");
  const ago = (minutes: number) => new Date(now.getTime() - minutes * 60_000);
  const models = ["gemini", "qwen-groq", "mistral"];

  it("starts with the default when there is no record", () => {
    expect(rankModels(models, [], now)).toEqual([DEFAULT_MODEL, "gemini", "mistral"]);
  });

  it("orders by success rate, then speed, and skips a model that just failed", () => {
    const records = [
      { model: "gemini", ok: true, latencyMs: 15_000, at: ago(60) },
      { model: "gemini", ok: true, latencyMs: 14_000, at: ago(50) },
      { model: "mistral", ok: true, latencyMs: 20_000, at: ago(60) },
      { model: "mistral", ok: false, at: ago(70) },
      { model: "qwen-groq", ok: true, latencyMs: 1_000, at: ago(40) },
      { model: "qwen-groq", ok: true, latencyMs: 1_200, at: ago(30) },
    ];
    expect(rankModels(models, records, now)).toEqual(["qwen-groq", "gemini", "mistral"]);
    const qwenJustFailed = [...records, { model: "qwen-groq", ok: false, at: ago(2) }];
    expect(rankModels(models, qwenJustFailed, now)).toEqual(["gemini", "mistral"]);
  });

  it("falls back to the default when every model failed recently, if it has a key", () => {
    const failing = models.map((model) => ({ model, ok: false, at: ago(1) }));
    expect(rankModels(models, failing, now)).toEqual([DEFAULT_MODEL]);
    expect(rankModels(["gemini"], [{ model: "gemini", ok: false, at: ago(1) }], now)).toEqual([]);
  });
});
