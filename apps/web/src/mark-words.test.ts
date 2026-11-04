import { describe, expect, it } from "vitest";
import { draftHints } from "./mark-words";

describe("draft hints", () => {
  it("gives the draft's hints for wording found in the line, ignoring case", () => {
    const suggestions = [
      { phrase: "warm and cosy", kind: "subjective" as const, rewrite: "Approved at sketch" },
      { phrase: "quick turnaround", kind: "unmeasurable" as const, rewrite: "Within 5 days" },
    ];
    expect(draftHints("Warm and cosy hand-drawn style", suggestions)).toEqual([
      "The draft calls “warm and cosy” a matter of taste.",
    ]);
    expect(draftHints("Final files, quick turnaround", suggestions)).toEqual([
      "The draft says “quick turnaround” could be measured but is not.",
    ]);
    expect(draftHints("A2 poster", suggestions)).toEqual([]);
  });
});
