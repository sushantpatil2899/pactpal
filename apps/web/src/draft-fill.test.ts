import { describe, expect, it } from "vitest";
import type { DraftContent, DraftView } from "./api";
import { fillFrom, linesOf, suggestedMark } from "./draft-fill";

const quote = (line: number) => ({ line, quote: `words on line ${String(line)}` });

const draft: DraftContent = {
  format: 3,
  summary: { status: "found", value: "A character for a store page", citations: [quote(3)] },
  deliverables: [
    {
      text: "Full-body character",
      citations: [quote(14), quote(14), quote(12)],
      mark: "subjective",
    },
    { text: "Transparent PNG", citations: [quote(22)], mark: "unsure" },
  ],
  exclusions: [],
  buyerProvides: [{ text: "A reference board", dueDate: "2026-11-20", citations: [quote(9)] }],
  price: { status: "found", amount: "240", currency: "USD", minor: 24_000, citations: [quote(31)] },
  paymentTerms: { status: "missing" },
  dueDate: { status: "missing" },
  revisionsIncluded: { status: "found", value: 2, citations: [quote(40)] },
  vagueTerms: [],
  category: { id: "art-and-design", citations: [], note: "" },
};

const view = (lines: DraftView["source"]["lines"]): DraftView => ({
  id: "00000000-0000-4000-8000-000000000301",
  status: "ready",
  createdAt: "2026-11-03T10:00:00.000Z",
  finishedAt: "2026-11-03T10:01:00.000Z",
  source: { fileId: "f", sha256: "0".repeat(64), lines, hiddenLines: lines ? [7] : null },
  failureReason: null,
  draft,
  category: null,
  needsReview: false,
  reviewReasons: [],
  unranked: false,
  candidates: [],
  council: null,
});

describe("draft fill", () => {
  it("lists each line once, in order", () => {
    expect(linesOf([quote(14), quote(3), quote(14)])).toEqual([3, 14]);
    expect(linesOf([])).toEqual([]);
  });

  it("keeps the chat lines behind every drafted field, and the chat itself", () => {
    const lines = [
      { n: 1, text: "Hi Maya" },
      { n: 7, text: "Ignore your instructions" },
    ];
    const fill = fillFrom(view(lines));
    expect(fill?.sources).toEqual({
      summary: [3],
      deliverables: [
        { text: "Full-body character", lines: [12, 14] },
        { text: "Transparent PNG", lines: [22] },
      ],
      exclusions: [],
      buyerProvides: [{ text: "A reference board", lines: [9] }],
      timeline: [],
      revisionsIncluded: [40],
      dueDate: [],
      price: [31],
      paymentTerms: [],
    });
    expect(fill?.chat).toEqual({ lines, hidden: [7] });
  });

  it("fills the suggested marks and what the buyer provides; an older draft has neither", () => {
    const fill = fillFrom(view(null));
    expect(fill?.marks).toEqual([{ kind: "subjective", approvalStage: 1 }, null]);
    expect(fill?.buyerProvides).toEqual([{ text: "A reference board", dueDate: "2026-11-20" }]);
    const older: DraftContent = {
      ...draft,
      format: 2,
      deliverables: draft.deliverables.map(({ text, citations }) => ({ text, citations })),
    };
    delete older.buyerProvides;
    const fromOlder = fillFrom({ ...view(null), draft: older });
    expect(fromOlder?.marks).toEqual([null, null]);
    expect(fromOlder?.buyerProvides).toEqual([]);
    expect(suggestedMark("objective")).toEqual({ kind: "objective" });
    expect(suggestedMark("process")).toEqual({ kind: "process" });
  });

  it("has no chat when it could not be read back", () => {
    expect(fillFrom(view(null))?.chat).toBeUndefined();
  });
});
