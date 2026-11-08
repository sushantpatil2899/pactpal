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
});
