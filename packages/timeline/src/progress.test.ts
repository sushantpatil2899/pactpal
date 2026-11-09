import { describe, expect, it } from "vitest";
import { allowedUpdates, timelineProgress, type StageFacts, type TimelineStep } from "./index.js";

const steps: TimelineStep[] = [
  { kind: "payment", stage: 1 },
  { kind: "buyer-provides", item: 1 },
  { kind: "review", text: "Sketches" },
  { kind: "delivery", stage: 2 },
  { kind: "payment", stage: 2 },
  { kind: "other", owner: "seller", text: "Print proof" },
];
const stage = (n: number, facts: Partial<StageFacts> = {}): StageFacts => ({
  stage: n,
  invoiced: false,
  paid: false,
  delivered: false,
  approved: false,
  changesAsked: false,
  ...facts,
});
const at = "2026-11-08T10:00:00.000Z";

describe("timeline progress", () => {
  it("starts with every step open and waiting on whoever acts first", () => {
    expect(
      timelineProgress(steps, [], [stage(1), stage(2)]).map((p) => [p.state, p.waitingOn, p.next]),
    ).toEqual([
      ["open", "seller", "Send the PayPal invoice"],
      ["open", "buyer", "Mark it done once it is done"],
      ["open", "seller", "Share it for review"],
      ["open", "seller", "Send the delivery"],
      ["open", "seller", "Send the PayPal invoice"],
      ["open", "seller", "Mark it done once it is done"],
    ]);
  });

  it("follows recorded updates and the payment and delivery records", () => {
    const progress = timelineProgress(
      steps,
      [
        { step: 2, status: "done", actor: "buyer", at },
        { step: 3, status: "submitted", actor: "seller", at },
        { step: 3, status: "changes", actor: "buyer", at },
      ],
      [stage(1, { invoiced: true, paid: true }), stage(2, { invoiced: true, delivered: true })],
    );
    expect(progress.map((p) => [p.state, p.waitingOn])).toEqual([
      ["done", null],
      ["done", null],
      ["changes", "seller"],
      ["submitted", "buyer"],
      ["submitted", "buyer"],
      ["open", "seller"],
    ]);
    const later = timelineProgress(
      steps,
      [
        { step: 3, status: "submitted", actor: "seller", at },
        { step: 6, status: "done", actor: "seller", at },
      ],
      [stage(2, { delivered: true, changesAsked: true })],
    );
    expect(later.map((p) => p.state)).toEqual([
      "open",
      "open",
      "submitted",
      "changes",
      "open",
      "done",
    ]);
    const finished = timelineProgress(
      steps,
      [{ step: 3, status: "approved", actor: "buyer", at }],
      [stage(2, { approved: true })],
    );
    expect(finished[2]?.state).toBe("done");
    expect(finished[3]?.state).toBe("done");
  });

  it("allows each side only the updates that fit the step's state", () => {
    const [, provides, review, delivery, payment, other] = steps as [
      TimelineStep,
      ...TimelineStep[],
    ];
    if (!provides || !review || !delivery || !payment || !other) throw new Error("steps");
    expect(allowedUpdates(provides, "open", "buyer")).toEqual(["done"]);
    expect(allowedUpdates(provides, "open", "seller")).toEqual([]);
    expect(allowedUpdates(provides, "done", "buyer")).toEqual([]);
    expect(allowedUpdates(review, "open", "seller")).toEqual(["submitted"]);
    expect(allowedUpdates(review, "changes", "seller")).toEqual(["submitted"]);
    expect(allowedUpdates(review, "submitted", "seller")).toEqual([]);
    expect(allowedUpdates(review, "submitted", "buyer")).toEqual(["approved", "changes"]);
    expect(allowedUpdates(review, "open", "buyer")).toEqual([]);
    expect(allowedUpdates(delivery, "open", "seller")).toEqual([]);
    expect(allowedUpdates(payment, "open", "buyer")).toEqual([]);
    expect(allowedUpdates(other, "open", "seller")).toEqual(["done"]);
  });
});
