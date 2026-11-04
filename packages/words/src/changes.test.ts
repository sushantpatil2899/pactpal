import { describe, expect, it } from "vitest";
import { changeLines, dayWords, type ChangeFacts } from "./changes.js";

const money = (text: string) => ({ text });
const NONE: ChangeFacts = {
  addedLines: [],
  addedExclusions: [],
  addedBuyerProvides: [],
  addedStages: [],
  dueDate: null,
  revisionsIncluded: null,
  total: { from: money("1500.00"), to: money("1500.00") },
};

describe("change lines", () => {
  it("writes a date as people read it", () => {
    expect(dayWords("2026-11-20")).toBe("20 Nov 2026");
  });

  it("lists everything a change adds or changes, ending with the total", () => {
    const stages = [{ title: "Design" }, { title: "Build" }, { title: "Ordering" }];
    expect(
      changeLines(
        {
          addedLines: [
            { text: "Online ordering page", mark: { kind: "objective" } },
            { text: "Warm look", mark: { kind: "subjective", approvalStage: 3 } },
            { text: "Notes", mark: null },
          ],
          addedExclusions: ["Printing"],
          addedBuyerProvides: [
            { text: "Menu text", dueDate: "2026-11-12" },
            { text: "Logo", dueDate: null },
          ],
          addedStages: [
            { stage: 3, title: "Ordering", amount: money("400.00"), dueDate: "2026-12-01" },
            { stage: 4, title: "Extra", amount: money("50.00"), dueDate: null },
          ],
          dueDate: { from: null, to: "2026-12-20" },
          revisionsIncluded: { from: 2, to: 3 },
          total: { from: money("1500.00"), to: money("1950.00") },
        },
        "USD",
        stages,
      ),
    ).toEqual([
      "Added: Online ordering page (can be checked)",
      "Added: Warm look (a matter of taste: settled when the buyer approves stage 3, Ordering)",
      "Added: Notes",
      'Added to "not included": Printing',
      "The buyer also provides: Menu text (by 12 Nov 2026)",
      "The buyer also provides: Logo",
      "Added payment stage 3: Ordering, 400.00 USD (due 1 Dec 2026)",
      "Added payment stage 4: Extra, 50.00 USD",
      "Due date: none → 20 Dec 2026",
      "Revisions included: 2 → 3",
      "Total: 1500.00 → 1950.00 USD",
    ]);
  });

  it("names a removed due date, and always gives the total", () => {
    expect(changeLines({ ...NONE, dueDate: { from: "2026-11-27", to: null } }, "EUR", [])).toEqual([
      "Due date: 27 Nov 2026 → none",
      "Total: 1500.00 → 1500.00 EUR",
    ]);
  });
});
