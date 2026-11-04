import { describe, expect, it } from "vitest";
import { LABEL_WORDS, revisionNote } from "./message-words";

describe("message watcher words", () => {
  it("name each label and where a revision would stand", () => {
    expect(LABEL_WORDS["out-of-scope"]).toBe("Not in the agreement");
    expect(revisionNote({ used: 1, included: 2 })).toBe(
      "If asked for on a delivery, this would be revision 2 of the 2 included.",
    );
    expect(revisionNote({ used: 2, included: 2 })).toBe(
      "If asked for on a delivery, this would be revision 3, beyond the 2 included.",
    );
    expect(revisionNote({ used: 0, included: null })).toBe(
      "If asked for on a delivery, this would be revision 1; the agreement states no limit.",
    );
  });
});
