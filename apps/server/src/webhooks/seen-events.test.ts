import { describe, expect, it } from "vitest";
import { MemorySeenEvents } from "./seen-events.js";

describe("MemorySeenEvents", () => {
  it("remembers ids and drops the oldest beyond its capacity", () => {
    const seen = new MemorySeenEvents(2);
    seen.add("a");
    seen.add("b");
    expect(seen.has("a")).toBe(true);
    seen.add("c");
    expect([seen.has("a"), seen.has("b"), seen.has("c")]).toEqual([false, true, true]);
  });

  it("keeps 10,000 ids by default", () => {
    const seen = new MemorySeenEvents();
    for (let i = 0; i <= 10_000; i++) seen.add(`e${i}`);
    expect([seen.has("e0"), seen.has("e1"), seen.has("e10000")]).toEqual([false, true, true]);
  });
});
