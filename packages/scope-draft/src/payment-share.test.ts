import { describe, expect, it } from "vitest";
import { paymentFromShare, sharesIn } from "./payment-share.js";

describe("payments worked out from a stated share", () => {
  it("reads percentages, words and 'the rest' from the quotes", () => {
    expect(sharesIn(["50% up front and 50% on delivery"]).shares).toEqual([
      { over: 50, of: 100 },
      { over: 50, of: 100 },
    ]);
    expect(sharesIn(["can i pay half now"])).toEqual({ shares: [{ over: 1, of: 2 }], rest: false });
    expect(sharesIn(["40 percent first, the rest when you approve"])).toEqual({
      shares: [{ over: 40, of: 100 }],
      rest: true,
    });
    expect(sharesIn(["a third now, two thirds later, a quarter, three quarters"]).shares).toEqual([
      { over: 1, of: 3 },
      { over: 2, of: 3 },
      { over: 1, of: 4 },
      { over: 3, of: 4 },
    ]);
    // Out-of-range or part of another number: not a share.
    expect(sharesIn(["0% fee, 150% sure, version 2.50%"]).shares).toEqual([]);
  });

  it("accepts an amount that is a stated share of the price, to the cent", () => {
    const half = sharesIn(["50% up front"]);
    expect(paymentFromShare(12_000, 24_000, half, [12_000])).toBe(true);
    expect(paymentFromShare(13_000, 24_000, half, [11_000])).toBe(false);
    expect(paymentFromShare(3_333, 10_000, sharesIn(["a third each month"]), [])).toBe(true);
  });

  it("accepts 'the rest' only as the price less the other stated payments", () => {
    const rest = sharesIn(["and the rest when you approve the finished site"]);
    expect(paymentFromShare(54_000, 90_000, rest, [36_000])).toBe(true);
    expect(paymentFromShare(50_000, 90_000, rest, [36_000])).toBe(false);
    // Another payment without an amount, or no other payment: cannot be checked.
    expect(paymentFromShare(54_000, 90_000, rest, [null])).toBe(false);
    expect(paymentFromShare(90_000, 90_000, rest, [])).toBe(false);
  });

  it("needs a stated price and amounts above zero", () => {
    const half = sharesIn(["half now"]);
    expect(paymentFromShare(12_000, 0, half, [])).toBe(false);
    expect(paymentFromShare(0, 24_000, half, [])).toBe(false);
    expect(paymentFromShare(12_000, 24_000, sharesIn(["now please"]), [])).toBe(false);
  });
});
