import { describe, expect, it } from "vitest";
import { markWords, markedLine } from "./marks.js";

const stages = [{ title: "Sketch" }, { title: "Final files" }];

describe("mark words", () => {
  it("says how each delivered line can be judged", () => {
    expect(markWords({ kind: "objective" }, stages)).toBe("(can be checked)");
    expect(markWords({ kind: "process" }, stages)).toBe("(a step in the work)");
    expect(markWords({ kind: "subjective", approvalStage: 1 }, stages)).toBe(
      "(a matter of taste: settled when the buyer approves stage 1, Sketch)",
    );
    expect(markWords({ kind: "subjective", approvalStage: 3 }, stages)).toBe(
      "(a matter of taste: settled when the buyer approves stage 3)",
    );
    expect(markWords(null, stages)).toBe("");
    expect(markWords(undefined, stages)).toBe("");
  });

  it("puts the words after the line, or leaves an unmarked line alone", () => {
    expect(markedLine("A2 poster", { kind: "objective" }, stages)).toBe(
      "A2 poster (can be checked)",
    );
    expect(markedLine("Notes", null, stages)).toBe("Notes");
  });
});
