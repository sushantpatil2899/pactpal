import type { StepProgress } from "@pactpal/timeline";
import { describe, expect, it } from "vitest";
import { dealOverview, type OverviewFacts } from "./overview.js";

const TODAY = "2026-03-10";
const facts = (more: Partial<OverviewFacts>): OverviewFacts => ({
  status: "active",
  steps: [],
  progress: [],
  dispute: undefined,
  today: TODAY,
  ...more,
});
const done = (step: number): StepProgress => ({ step, state: "done", waitingOn: null, next: "" });
const STEPS = [
  { title: "Deposit", kind: "payment", dueDate: "2026-03-05" },
  { title: "Sketch", kind: "review", dueDate: "2026-03-12" },
  { title: "Final files", kind: "delivery", dueDate: null },
];

describe("a deal's overview", () => {
  it("follows the deal's status before signing and after the end", () => {
    expect(dealOverview(facts({ status: "draft" }))).toMatchObject({
      stage: "drafting",
      next: { waitingOn: "seller", overdue: false, step: null },
    });
    expect(dealOverview(facts({ status: "awaiting_acceptance" }))).toMatchObject({
      stage: "awaiting_buyer",
      next: { waitingOn: "buyer", text: "Sign the agreement or ask for changes" },
    });
    expect(dealOverview(facts({ status: "completed" }))).toMatchObject({
      stage: "complete",
      next: null,
    });
    expect(dealOverview(facts({ status: "cancelled" }))).toMatchObject({
      stage: "cancelled",
      next: null,
    });
  });

  it("names the first step that is not done, who it waits for and whether it is late", () => {
    const late = dealOverview(
      facts({
        steps: STEPS,
        progress: [
          { step: 1, state: "submitted", waitingOn: "buyer", next: "Pay the PayPal invoice" },
          { step: 2, state: "open", waitingOn: "seller", next: "Share it" },
          { step: 3, state: "open", waitingOn: "seller", next: "Send the delivery" },
        ],
      }),
    );
    expect(late).toEqual({
      stage: "in_progress",
      next: {
        text: "Deposit: Pay the PayPal invoice",
        waitingOn: "buyer",
        dueDate: "2026-03-05",
        overdue: true,
        step: 1,
      },
      stepsDone: 0,
      stepsTotal: 3,
    });
    const onTime = dealOverview(
      facts({
        steps: STEPS,
        progress: [
          done(1),
          { step: 2, state: "changes", waitingOn: "seller", next: "Share it again" },
          { step: 3, state: "open", waitingOn: "seller", next: "Send the delivery" },
        ],
      }),
    );
    expect(onTime.next).toMatchObject({ step: 2, overdue: false, dueDate: "2026-03-12" });
    expect(onTime.stepsDone).toBe(1);
  });

  it("is delivered once every delivery is approved, and has nothing next when all is done", () => {
    const delivered = dealOverview(
      facts({
        steps: STEPS,
        progress: [
          { step: 1, state: "open", waitingOn: "seller", next: "Send the PayPal invoice" },
          done(2),
          done(3),
        ],
      }),
    );
    expect(delivered).toMatchObject({ stage: "delivered", next: { step: 1 }, stepsDone: 2 });
    const all = dealOverview(facts({ steps: STEPS, progress: [done(1), done(2), done(3)] }));
    expect(all).toMatchObject({ stage: "delivered", next: null, stepsDone: 3 });
    expect(dealOverview(facts({}))).toMatchObject({ stage: "in_progress", next: null });
  });

  it("puts an open dispute first, with the seller's respond-by day", () => {
    const due = new Date("2026-03-09T18:00:00Z");
    const mine = dealOverview(
      facts({ dispute: { status: "WAITING_FOR_SELLER_RESPONSE", sellerDueAt: due } }),
    );
    expect(mine).toMatchObject({
      stage: "disputed",
      next: {
        text: "Answer the dispute",
        waitingOn: "seller",
        dueDate: "2026-03-09",
        overdue: true,
      },
    });
    expect(
      dealOverview(facts({ dispute: { status: "WAITING_FOR_BUYER_RESPONSE", sellerDueAt: null } }))
        .next?.waitingOn,
    ).toBe("buyer");
    expect(
      dealOverview(facts({ dispute: { status: "UNDER_REVIEW", sellerDueAt: null } })).next,
    ).toMatchObject({ waitingOn: "paypal", dueDate: null, overdue: false });
    expect(
      dealOverview(
        facts({
          dispute: { status: "WAITING_FOR_SELLER_RESPONSE", sellerDueAt: null },
        }),
      ).next?.dueDate,
    ).toBeNull();
  });
});
