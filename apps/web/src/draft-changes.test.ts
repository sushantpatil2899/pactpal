import { describe, expect, it } from "vitest";
import type { DraftContent, ScopeView } from "./api";
import { draftChanges } from "./draft-changes";

const missing = { status: "missing" } as const;
const money = (text: string) => ({ minor: Math.round(Number(text) * 100), text });

const scope: ScopeView = {
  version: 2,
  contentSha256: "c".repeat(64),
  currency: "USD",
  summary: "Three logo concepts",
  deliverables: ["Three concepts"],
  exclusions: ["Printing"],
  revisionsIncluded: 2,
  dueDate: null,
  milestones: [{ title: "Full price", amount: money("300.00"), dueDate: null }],
  total: money("300.00"),
  savedAt: "2026-11-08T10:00:00.000Z",
  steps: [
    {
      n: 1,
      kind: "payment",
      owner: "buyer",
      title: "Full price",
      dueDate: null,
      stage: 1,
      amount: money("300.00"),
    },
  ],
  timelineSteps: [{ kind: "payment", stage: 1 }],
  ownTimeline: false,
};

const draft = (over: Partial<DraftContent>): DraftContent => ({
  format: 4,
  summary: missing,
  deliverables: [],
  exclusions: [],
  buyerProvides: [],
  price: missing,
  paymentTerms: missing,
  dueDate: missing,
  revisionsIncluded: missing,
  vagueTerms: [],
  category: { id: "unclear", citations: [], note: "" },
  ...over,
});

/** A draft that repeats the scope's lists, so only what a test changes shows. */
const unchanged = (over: Partial<DraftContent>) =>
  draft({
    deliverables: [{ text: "Three concepts", citations: [] }],
    exclusions: [{ text: "Printing", citations: [] }],
    ...over,
  });

describe("what an updated draft changes", () => {
  it("lists additions, removals and new values, ignoring case and spacing", () => {
    expect(
      draftChanges(
        draft({
          summary: { status: "found", value: "Four logo concepts", citations: [] },
          deliverables: [
            { text: "three  CONCEPTS", citations: [] },
            { text: "A favicon", citations: [] },
          ],
          exclusions: [],
          buyerProvides: [{ text: "Brand colours", dueDate: null, citations: [] }],
          price: {
            status: "found",
            amount: "380.00",
            currency: "USD",
            minor: 38_000,
            citations: [],
          },
          dueDate: { status: "found", value: "2026-11-30", citations: [] },
          revisionsIncluded: { status: "found", value: 3, citations: [] },
          timeline: [
            {
              kind: "payment",
              text: "Full price",
              owner: "buyer",
              amount: "380.00",
              dueDate: null,
              citations: [],
            },
            {
              kind: "review",
              text: "Sketches",
              owner: "seller",
              amount: null,
              dueDate: null,
              citations: [],
            },
          ],
        }),
        scope,
      ),
    ).toEqual([
      "Summary: Four logo concepts",
      "Delivered, added: A favicon",
      "Not included, no longer: Printing",
      "The buyer provides, added: Brand colours",
      "Price: 300.00 → 380.00 USD",
      "Due date: none → 2026-11-30",
      "Revisions included: 2 → 3",
      "Timeline, added: Review (seller shares, buyer approves): Sketches",
    ]);
  });

  it("does not count what the draft leaves missing as a change", () => {
    expect(
      draftChanges(
        draft({
          deliverables: [{ text: "Three concepts", citations: [] }],
          exclusions: [{ text: "printing", citations: [] }],
        }),
        { ...scope, revisionsIncluded: null },
      ),
    ).toEqual([]);
  });

  it("shows a line the models only reworded once, as reworded", () => {
    expect(
      draftChanges(
        unchanged({
          deliverables: [
            { text: "Three logo concepts as vector files", citations: [] },
            { text: "A favicon", citations: [] },
          ],
        }),
        { ...scope, deliverables: ["Three logo concepts in vector format", "Business cards"] },
      ),
    ).toEqual([
      "Delivered, reworded: Three logo concepts in vector format → Three logo concepts as vector files",
      "Delivered, added: A favicon",
      "Delivered, no longer: Business cards",
    ]);
  });

  it("pairs each line once, best match first, and ignores filler words", () => {
    expect(
      draftChanges(
        unchanged({
          exclusions: [
            { text: "Printing of business cards", citations: [] },
            { text: "Printing of the flyers", citations: [] },
          ],
        }),
        { ...scope, exclusions: ["Printing business cards and flyers", "The domain"] },
      ),
    ).toEqual([
      "Not included, reworded: Printing business cards and flyers → Printing of business cards",
      "Not included, added: Printing of the flyers",
      "Not included, no longer: The domain",
    ]);
  });

  it("pairs timeline steps only with a step of the same kind, on their own words", () => {
    expect(
      draftChanges(
        unchanged({
          timeline: [
            {
              kind: "payment",
              text: "Full price payment",
              owner: "buyer",
              amount: "300.00",
              dueDate: null,
              citations: [],
            },
            {
              kind: "review",
              text: "Full price",
              owner: "seller",
              amount: null,
              dueDate: null,
              citations: [],
            },
          ],
        }),
        scope,
      ),
    ).toEqual([
      "Timeline, reworded: Payment: Full price → Payment: Full price payment",
      "Timeline, added: Review (seller shares, buyer approves): Full price",
    ]);
  });

  it("never pairs lines made only of filler words", () => {
    expect(
      draftChanges(unchanged({ exclusions: [{ text: "and the", citations: [] }] }), {
        ...scope,
        exclusions: ["of a"],
      }),
    ).toEqual(["Not included, added: and the", "Not included, no longer: of a"]);
  });
});
