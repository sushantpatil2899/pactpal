import { describe, expect, it } from "vitest";
import { fromPayPalMoney, toPayPalMoney } from "./money.js";

describe("toPayPalMoney", () => {
  it.each([
    [1050, "USD", "10.50"],
    [100, "USD", "1.00"],
    [5, "EUR", "0.05"],
    [0, "USD", "0.00"],
    [1500, "JPY", "1500"],
  ])("%i minor %s -> %s", (minor, currency, value) => {
    expect(toPayPalMoney({ minor, currency })).toEqual({ currency_code: currency, value });
  });

  it.each([
    [10.5, "USD"],
    [-1, "USD"],
    [Number.MAX_SAFE_INTEGER + 1, "USD"],
    [100, "usd"],
    [100, "US"],
  ])("rejects %s %s", (minor, currency) => {
    expect(() => toPayPalMoney({ minor, currency })).toThrow(RangeError);
  });
});

describe("fromPayPalMoney", () => {
  it.each([
    ["10.50", "USD", 1050],
    ["10.5", "USD", 1050],
    ["10", "USD", 1000],
    ["0.01", "USD", 1],
    ["1500", "JPY", 1500],
  ])("%s %s -> %i minor", (value, currency, minor) => {
    expect(fromPayPalMoney({ currency_code: currency, value })).toEqual({ minor, currency });
  });

  it.each([
    ["10.505", "USD"],
    ["1500.5", "JPY"],
    ["-1.00", "USD"],
    ["1,00", "USD"],
    ["", "USD"],
    ["abc", "USD"],
  ])("rejects %j %s", (value, currency) => {
    expect(() => fromPayPalMoney({ currency_code: currency, value })).toThrow(RangeError);
  });
});
