import { describe, expect, it } from "vitest";
import { droppedSection, ruleOf } from "./eval-reasons.js";

describe("why drafts were dropped", () => {
  it("names each model, chat and rule once, with how often, without list positions", () => {
    expect(ruleOf("timeline[2]: the quote is not on line 4")).toBe(
      "timeline: the quote is not on line 4",
    );
    expect(
      droppedSection([
        {
          model: "m1",
          caseId: "maya",
          reasons: [
            "timeline[0]: the amount does not appear in the quotes cited for it",
            "timeline[3]: the amount does not appear in the quotes cited for it",
          ],
        },
        {
          model: "m1",
          caseId: "maya",
          reasons: ["timeline[1]: the amount does not appear in the quotes cited for it"],
        },
        {
          model: "m2",
          caseId: "sunrise",
          reasons: ["price: the currency is not the deal's currency"],
        },
      ]),
    ).toBe(
      "\nWhy drafts were dropped (model, chat: rule)\n" +
        "  m1, maya: timeline: the amount does not appear in the quotes cited for it (2)\n" +
        "  m2, sunrise: price: the currency is not the deal's currency\n",
    );
    expect(droppedSection([])).toBe("");
  });
});
