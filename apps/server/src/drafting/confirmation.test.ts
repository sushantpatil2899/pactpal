import type { ScopeContent } from "@pactpal/db";
import { MAYA_DRAFT } from "@pactpal/scope-draft/testing";
import type { ScopeDraft } from "@pactpal/scope-draft";
import { describe, expect, it } from "vitest";
import { compareWithDraft } from "./confirmation.js";

/** The agreed work exactly as the Maya draft states it, with one payment stage for the whole price. */
const same: ScopeContent = {
  format: 1,
  summary: MAYA_DRAFT.summary.status === "found" ? MAYA_DRAFT.summary.value : "",
  deliverables: MAYA_DRAFT.deliverables.map((item) => item.text),
  exclusions: MAYA_DRAFT.exclusions.map((item) => item.text),
  milestones: [{ title: "Payment", amountMinor: 24_000 }],
};

const withDraft = (change: (draft: ScopeDraft) => void): ScopeDraft => {
  const copy = structuredClone(MAYA_DRAFT);
  change(copy);
  return copy;
};

const compare = (draft: ScopeDraft, content: ScopeContent = same) =>
  compareWithDraft(draft, content, "USD");

describe("compareWithDraft", () => {
  it("calls everything the seller kept unchanged, and leaves out fields neither side has", () => {
    expect(compare(MAYA_DRAFT)).toEqual({
      summary: "unchanged",
      deliverables: "unchanged",
      exclusions: "unchanged",
      totalPrice: "unchanged",
    });
  });

  it("ignores spacing and Unicode forms but not wording or case", () => {
    const spaced = { ...same, summary: `  ${same.summary.replace(/ /g, "  ")}  ` };
    expect(compare(MAYA_DRAFT, spaced).summary).toBe("unchanged");
    expect(compare(MAYA_DRAFT, { ...same, summary: same.summary.toUpperCase() }).summary).toBe(
      "changed",
    );
    expect(compare(MAYA_DRAFT, { ...same, summary: `${same.summary} today` }).summary).toBe(
      "changed",
    );
  });

  it("compares lists item by item, in order, and tells added from removed", () => {
    expect(
      compare(MAYA_DRAFT, { ...same, deliverables: [...same.deliverables, "A bonus"] })
        .deliverables,
    ).toBe("changed");
    expect(
      compare(MAYA_DRAFT, { ...same, deliverables: [...same.deliverables].reverse() }).deliverables,
    ).toBe("changed");
    expect(compare(MAYA_DRAFT, { ...same, exclusions: [] }).exclusions).toBe("removed");
    expect(
      compare(
        withDraft((d) => void (d.exclusions = [])),
        { ...same, exclusions: ["No printing"] },
      ).exclusions,
    ).toBe("added");
    expect(
      compare(
        withDraft((d) => void (d.deliverables = [])),
        same,
      ).deliverables,
    ).toBe("added");
  });

  it("says added for a field the draft left missing, changed or removed otherwise", () => {
    const stated = withDraft((d) => {
      d.revisionsIncluded = {
        status: "found",
        value: 2,
        citations: [{ line: 20, quote: "rough sketch" }],
      };
      d.dueDate = {
        status: "found",
        value: "2026-11-20",
        citations: [{ line: 22, quote: "quick turnaround" }],
      };
    });
    expect(
      compare(MAYA_DRAFT, { ...same, revisionsIncluded: 3, dueDate: "2026-11-20" }),
    ).toMatchObject({
      revisionsIncluded: "added",
      dueDate: "added",
    });
    expect(compare(stated, { ...same, revisionsIncluded: 2, dueDate: "2026-11-21" })).toMatchObject(
      {
        revisionsIncluded: "unchanged",
        dueDate: "changed",
      },
    );
    expect(compare(stated, same)).toMatchObject({
      revisionsIncluded: "removed",
      dueDate: "removed",
    });
    expect(compare(stated, { ...same, revisionsIncluded: 0 }).revisionsIncluded).toBe("changed");
  });

  it("compares the total of the payment stages with the draft's price", () => {
    const split: ScopeContent = {
      ...same,
      milestones: [
        { title: "Deposit", amountMinor: 12_000 },
        { title: "Final", amountMinor: 12_000 },
      ],
    };
    expect(compare(MAYA_DRAFT, split).totalPrice).toBe("unchanged");
    expect(
      compare(MAYA_DRAFT, { ...same, milestones: [{ title: "P", amountMinor: 25_000 }] })
        .totalPrice,
    ).toBe("changed");
    expect(
      compare(
        withDraft((d) => void (d.price = { status: "missing" })),
        same,
      ).totalPrice,
    ).toBe("added");
  });

  it("treats a drafted price that does not fit the currency as changed", () => {
    const odd = withDraft((d) => {
      d.price = {
        status: "found",
        amount: "240.555",
        currency: "USD",
        citations: [{ line: 16, quote: "it's $240 total" }],
      };
    });
    expect(compare(odd).totalPrice).toBe("changed");
  });
});
