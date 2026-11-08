import { describe, expect, it } from "vitest";
import {
  addedSteps,
  moveStep,
  ownerOf,
  resolveTimeline,
  syncTimeline,
  timelineOf,
  timelineProblems,
  timelineSchema,
  type TimelineParts,
  type TimelineStep,
} from "./index.js";

const milestones = [
  { title: "Deposit", amountMinor: 5000, dueDate: "2026-11-10" },
  { title: "Final", amountMinor: 15000 },
];
const buyerProvides = [{ text: "Brand colours and three logos you like", dueDate: "2026-11-09" }];
const steps: TimelineStep[] = [
  { kind: "payment", stage: 1 },
  { kind: "buyer-provides", item: 1 },
  { kind: "review", text: "Pencil sketches", dueDate: "2026-11-14" },
  { kind: "delivery", stage: 2 },
  { kind: "payment", stage: 2 },
  { kind: "other", owner: "buyer", text: "Confirm the print size" },
];
const parts: TimelineParts = { milestones, buyerProvides, timeline: steps };

describe("the timeline", () => {
  it("takes the steps in any order and reads each from the agreement", () => {
    expect(timelineProblems(parts)).toEqual([]);
    expect(resolveTimeline(parts)).toEqual([
      {
        n: 1,
        kind: "payment",
        owner: "buyer",
        title: "Deposit",
        dueDate: "2026-11-10",
        stage: 1,
        amountMinor: 5000,
      },
      {
        n: 2,
        kind: "buyer-provides",
        owner: "buyer",
        title: "Brand colours and three logos you like",
        dueDate: "2026-11-09",
        stage: null,
        amountMinor: null,
      },
      {
        n: 3,
        kind: "review",
        owner: "seller",
        title: "Pencil sketches",
        dueDate: "2026-11-14",
        stage: null,
        amountMinor: null,
      },
      {
        n: 4,
        kind: "delivery",
        owner: "seller",
        title: 'Delivery for "Final"',
        dueDate: null,
        stage: 2,
        amountMinor: null,
      },
      {
        n: 5,
        kind: "payment",
        owner: "buyer",
        title: "Final",
        dueDate: null,
        stage: 2,
        amountMinor: 15000,
      },
      {
        n: 6,
        kind: "other",
        owner: "buyer",
        title: "Confirm the print size",
        dueDate: null,
        stage: null,
        amountMinor: null,
      },
    ]);
  });

  it("implies one for agreements that list no steps: buyer items, then each payment", () => {
    expect(timelineOf({ milestones, buyerProvides })).toEqual([
      { kind: "buyer-provides", item: 1 },
      { kind: "payment", stage: 1 },
      { kind: "payment", stage: 2 },
    ]);
    expect(timelineProblems({ milestones })).toEqual([]);
    expect(resolveTimeline({ milestones: [] })).toEqual([]);
  });

  it("names steps pointing nowhere, repeated, or stages and items left out", () => {
    const problems = timelineProblems({
      milestones,
      buyerProvides,
      timeline: [
        { kind: "payment", stage: 1 },
        { kind: "payment", stage: 1 },
        { kind: "payment", stage: 3 },
        { kind: "delivery", stage: 1 },
        { kind: "delivery", stage: 1 },
        { kind: "buyer-provides", item: 2 },
      ],
    });
    expect(problems).toEqual([
      { path: ["timeline", 1, "stage"], message: "that stage's payment is already listed" },
      { path: ["timeline", 2, "stage"], message: "no such payment stage" },
      { path: ["timeline", 4, "stage"], message: "that stage's delivery is already listed" },
      { path: ["timeline", 5, "item"], message: "no such buyer item" },
      { path: ["timeline"], message: "payment stage 2 is missing" },
      { path: ["timeline"], message: "buyer item 1 is missing" },
    ]);
    expect(
      timelineProblems({
        milestones,
        buyerProvides,
        timeline: [...steps, { kind: "buyer-provides", item: 1 }],
      }),
    ).toEqual([{ path: ["timeline", 6, "item"], message: "that item is already listed" }]);
  });

  it("checks each step's shape, and refuses an empty list", () => {
    expect(timelineSchema.safeParse(steps).success).toBe(true);
    expect(timelineSchema.safeParse([]).success).toBe(false);
    expect(timelineSchema.safeParse([{ kind: "review", text: " " }]).success).toBe(false);
    expect(timelineSchema.safeParse([{ kind: "payment", stage: 21 }]).success).toBe(false);
    expect(timelineSchema.safeParse([{ kind: "other", owner: "admin", text: "x" }]).success).toBe(
      false,
    );
  });

  it("knows who acts first", () => {
    expect(steps.map(ownerOf)).toEqual(["buyer", "buyer", "seller", "seller", "buyer", "buyer"]);
  });

  it("follows stages and items being added or removed", () => {
    expect(syncTimeline(steps, 1, 0)).toEqual([
      { kind: "payment", stage: 1 },
      { kind: "review", text: "Pencil sketches", dueDate: "2026-11-14" },
      { kind: "other", owner: "buyer", text: "Confirm the print size" },
    ]);
    expect(syncTimeline([{ kind: "review", text: "Sketch" }], 2, 1)).toEqual([
      { kind: "review", text: "Sketch" },
      { kind: "buyer-provides", item: 1 },
      { kind: "payment", stage: 1 },
      { kind: "payment", stage: 2 },
    ]);
  });

  it("moves a step up or down, never past either end", () => {
    expect(moveStep(["a", "b", "c"], 1, -1)).toEqual(["b", "a", "c"]);
    expect(moveStep(["a", "b", "c"], 1, 1)).toEqual(["a", "c", "b"]);
    expect(moveStep(["a", "b"], 0, -1)).toEqual(["a", "b"]);
    expect(moveStep(["a", "b"], 1, 1)).toEqual(["a", "b"]);
    expect(moveStep(["a"], 5, 1)).toEqual(["a"]);
  });

  it("lets a change add steps after the signed ones, never alter them", () => {
    const longer = {
      ...parts,
      timeline: [...steps, { kind: "review" as const, text: "Colour proofs" }],
    };
    expect(addedSteps(parts, longer)).toEqual([{ kind: "review", text: "Colour proofs" }]);
    expect(addedSteps(parts, { ...parts, timeline: steps.slice(1) })).toBeUndefined();
    expect(
      addedSteps(parts, {
        ...parts,
        timeline: [steps[1], steps[0], ...steps.slice(2)] as TimelineStep[],
      }),
    ).toBeUndefined();
    expect(
      addedSteps(
        { milestones },
        { milestones: [...milestones, { title: "Extra", amountMinor: 1 }] },
      ),
    ).toEqual([]);
    expect(
      addedSteps(
        { milestones },
        {
          milestones,
          timeline: [
            { kind: "payment", stage: 1 },
            { kind: "payment", stage: 2 },
            { kind: "review", text: "x" },
          ],
        },
      ),
    ).toEqual([{ kind: "review", text: "x" }]);
  });
});
