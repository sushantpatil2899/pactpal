import { describe, expect, it } from "vitest";
import { isRailKey, startClosed } from "./rail";

const key = (over: Partial<Parameters<typeof isRailKey>[0]>) => ({
  key: "\\",
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  ...over,
});

describe("the sidebar", () => {
  it("starts as the seller last left it", () => {
    expect(startClosed("closed", 1600)).toBe(true);
    expect(startClosed("open", 900)).toBe(false);
  });

  it("starts closed on narrower screens when nothing was chosen", () => {
    expect(startClosed(null, 1100)).toBe(true);
    expect(startClosed(null, 1440)).toBe(false);
    expect(startClosed("something else", 1440)).toBe(false);
  });

  it("opens and closes with Command or Control and backslash only", () => {
    expect(isRailKey(key({ metaKey: true }))).toBe(true);
    expect(isRailKey(key({ ctrlKey: true }))).toBe(true);
    expect(isRailKey(key({}))).toBe(false);
    expect(isRailKey(key({ metaKey: true, shiftKey: true }))).toBe(false);
    expect(isRailKey(key({ key: "b", metaKey: true }))).toBe(false);
  });
});
