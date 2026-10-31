import { describe, expect, it } from "vitest";
import { DEFAULT_RETRY_POLICY, backoffDelay, isRetryable } from "./retry.js";

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
