import { describe, expect, it } from "vitest";
import { planFromDraft, type DraftedStep } from "./timeline-fill";

const step = (
  kind: DraftedStep["kind"],
  text: string,
  extra: Partial<DraftedStep> = {},
): DraftedStep => ({
  kind,
  text,
  owner: kind === "payment" || kind === "buyer-provides" ? "buyer" : "seller",
  amount: null,
  dueDate: null,
  ...extra,
});

describe("a drafted timeline in the form", () => {
  it("makes a stage per payment, points buyer steps at items and deliveries at the next payment", () => {
    const plan = planFromDraft(
      [
        step("payment", "Deposit", { amount: "50.00" }),
        step("buyer-provides", "Reference board"),
        step("buyer-provides", "Brand fonts", { dueDate: "2026-11-12" }),
        step("review", "Pencil sketch", { dueDate: "2026-11-14" }),
        step("delivery", "Final files"),
        step("payment", "Balance"),
        step("other", "Pick a frame", { owner: "buyer" }),
      ],
      [{ text: "reference board" }],
      "200.00",
    );
    expect(plan).toEqual({
      stages: [
        { title: "Deposit", amount: "50.00" },
        { title: "Balance", amount: "" },
      ],
      buyerProvides: [{ text: "reference board" }, { text: "Brand fonts", dueDate: "2026-11-12" }],
      timeline: [
        { kind: "payment", stage: 1 },
        { kind: "buyer-provides", item: 1 },
        { kind: "buyer-provides", item: 2 },
        { kind: "review", text: "Pencil sketch", dueDate: "2026-11-14" },
        { kind: "delivery", stage: 2, text: "Final files" },
        { kind: "payment", stage: 2 },
        { kind: "other", owner: "buyer", text: "Pick a frame" },
      ],
    });
  });

  it("gives a single payment the price, and a delivery after the last payment that stage", () => {
    const plan = planFromDraft(
      [step("payment", "Full price"), step("delivery", "Files")],
      [],
      "240.00",
    );
    expect(plan.stages).toEqual([{ title: "Full price", amount: "240.00" }]);
    expect(plan.timeline).toEqual([
      { kind: "payment", stage: 1 },
      { kind: "delivery", stage: 1, text: "Files" },
    ]);
  });

  it("leaves stages to the form when the draft has no payments, and everything when it has no steps", () => {
    expect(
      planFromDraft([step("review", "Sketch"), step("delivery", "Files")], [], undefined),
    ).toEqual({
      stages: undefined,
      buyerProvides: [],
      timeline: [
        { kind: "review", text: "Sketch" },
        { kind: "delivery", stage: 1, text: "Files" },
      ],
    });
    expect(planFromDraft([], [{ text: "x" }], "10")).toEqual({
      stages: undefined,
      buyerProvides: [{ text: "x" }],
      timeline: undefined,
    });
  });
});
