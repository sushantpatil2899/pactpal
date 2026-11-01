import { describe, expect, it } from "vitest";
import { DEFAULT_RETRY_POLICY, backoffDelay, isRetryable, retryAfterMs } from "./retry.js";

describe("isRetryable", () => {
  it.each([
    [{ kind: "network" } as const, true, true],
    [{ kind: "status", status: 429 } as const, true, true],
    [{ kind: "status", status: 500 } as const, true, true],
    [{ kind: "status", status: 503 } as const, true, true],
    [{ kind: "status", status: 400 } as const, true, false],
    [{ kind: "status", status: 401 } as const, true, false],
    [{ kind: "status", status: 403 } as const, true, false],
    [{ kind: "status", status: 422 } as const, true, false],
    [{ kind: "network" } as const, false, false],
    [{ kind: "status", status: 500 } as const, false, false],
  ])("%j with idempotent=%s -> %s", (outcome, idempotent, expected) => {
    expect(isRetryable(outcome, idempotent)).toBe(expected);
  });
});

describe("backoffDelay", () => {
  const policy = { ...DEFAULT_RETRY_POLICY, baseDelayMs: 500, maxDelayMs: 4000 };

  it("doubles each retry and spreads between half and the full value", () => {
    expect([1, 2, 3].map((retry) => backoffDelay(retry, policy, () => 0))).toEqual([
      250, 500, 1000,
    ]);
    expect([1, 2, 3].map((retry) => backoffDelay(retry, policy, () => 1))).toEqual([
      500, 1000, 2000,
    ]);
  });

  it("never exceeds the cap", () => {
    expect(backoffDelay(10, policy, () => 1)).toBe(4000);
  });
});

describe("retryAfterMs", () => {
  it.each([
    ["2", 2000],
    [" 0 ", 0],
    ["1.5", 1500],
    ["120", 120_000],
  ])("reads %j seconds as %i ms", (header, ms) => {
    expect(retryAfterMs(header, 0)).toBe(ms);
  });

  it("reads a date relative to now, never negative", () => {
    const now = Date.parse("2026-11-01T10:00:00Z");
    expect(retryAfterMs("Sun, 01 Nov 2026 10:00:07 GMT", now)).toBe(7000);
    expect(retryAfterMs("Sun, 01 Nov 2026 09:59:00 GMT", now)).toBe(0);
  });

  it.each([null, "", "soon", "-3", "1e3"])("does not understand %j", (header) => {
    expect(retryAfterMs(header, 0)).toBeUndefined();
  });
});
