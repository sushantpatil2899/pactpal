import { describe, expect, it } from "vitest";
import { BLOCKED_CATEGORIES, allowedCategoryIds, categoryVerdict } from "./category.js";

describe("categoryVerdict", () => {
  it.each([
    ["art-and-design", "art-and-design", "agrees"],
    ["web-and-software", "art-and-design", "mismatch"],
    ["unclear", "art-and-design", "unclear"],
    ["crypto-nfts-investments", "art-and-design", "blocked"],
    ["deposit-bookings", "deposit-bookings", "blocked"],
  ])("chat says %s, seller chose %s -> %s", (fromChat, chosen, verdict) => {
    expect(categoryVerdict(fromChat, chosen)).toBe(verdict);
  });
});

describe("allowedCategoryIds", () => {
  it("adds the blocked ids and 'unclear' to the supported ones", () => {
    const ids = allowedCategoryIds(["art-and-design"]);
    expect(ids[0]).toBe("art-and-design");
    expect(ids.at(-1)).toBe("unclear");
    expect(ids).toHaveLength(1 + BLOCKED_CATEGORIES.length + 1);
  });

  it("has unique blocked ids", () => {
    const ids = BLOCKED_CATEGORIES.map(({ id }) => id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
