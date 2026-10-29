import { describe, expect, it } from "vitest";
import { waitFor } from "./waiting.js";

/** A fake clock that moves forward only when the wait pauses. */
function clock() {
  let now = 0;
  const pauses: number[] = [];
  return {
    pauses,
    now: () => now,
    sleep: (ms: number) => {
      pauses.push(ms);
      now += ms;
      return Promise.resolve();
    },
  };
}

describe("waitFor", () => {
  it("returns the first ready value and reports each wait", async () => {
    const c = clock();
    const answers = [undefined, undefined, "PAID"];
    const waits: number[] = [];
    const result = await waitFor(() => Promise.resolve(answers.shift()), {
      intervalMs: 15,
      timeoutMs: 100,
      ...c,
      onWaiting: (attempt) => waits.push(attempt),
    });
    expect(result).toEqual({ ok: true, value: "PAID" });
    expect(c.pauses).toEqual([15, 15]);
    expect(waits).toEqual([1, 2]);
  });

  it("keeps going after a failed check and gives the last error if time runs out", async () => {
    const c = clock();
    const result = await waitFor(() => Promise.reject(new Error("PayPal busy")), {
      intervalMs: 30,
      timeoutMs: 100,
      ...c,
    });
    expect(result).toEqual({ ok: false, lastError: new Error("PayPal busy") });
    expect(c.pauses).toEqual([30, 30, 30]);
  });

  it("forgets an earlier error once a check succeeds without a value", async () => {
    const c = clock();
    const checks = [() => Promise.reject(new Error("x")), () => Promise.resolve(undefined)];
    const result = await waitFor(() => (checks.shift() ?? (() => Promise.resolve(undefined)))(), {
      intervalMs: 50,
      timeoutMs: 60,
      ...c,
    });
    expect(result).toEqual({ ok: false, lastError: undefined });
  });

  it("uses the real clock by default", async () => {
    const result = await waitFor(() => Promise.resolve(undefined), { intervalMs: 1, timeoutMs: 5 });
    expect(result.ok).toBe(false);
  });
});
