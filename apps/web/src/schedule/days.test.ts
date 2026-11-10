import { describe, expect, it } from "vitest";
import { addDays, daysBetween, earlierDay, laterDay } from "./days";

describe("day arithmetic", () => {
  it("moves a day across a month end", () => {
    expect(addDays("2026-02-27", 3)).toBe("2026-03-02");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("picks the earlier and the later day, and counts the days between", () => {
    expect(earlierDay("2026-03-05", "2026-03-02")).toBe("2026-03-02");
    expect(laterDay("2026-03-05", "2026-03-02")).toBe("2026-03-05");
    expect(daysBetween("2026-03-01", "2026-03-15")).toBe(14);
  });
});
