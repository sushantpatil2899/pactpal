import { describe, expect, it } from "vitest";
import type { DealOverview } from "../overview-api";
import { insightRows } from "./insight-rows";

const deal = (changes: Partial<DealOverview>): DealOverview =>
  ({
    id: "d1",
    title: "Logo refresh",
    categoryLabel: "Art and design",
    currency: "USD",
    role: "seller",
    buyer: { name: "Daniel Reyes", email: "daniel@example.com" },
    updatedAt: "2026-03-08T10:00:00Z",
    amount: { minor: 45050, text: "450.50" },
    stage: "in_progress",
    next: { text: "Send the invoice", waitingOn: "seller", dueDate: "2026-03-05", overdue: true },
    stepsDone: 1,
    stepsTotal: 5,
    completeness: 41,
    unreadMessages: 2,
    unreadNotifications: 1,
    dispute: null,
    ...changes,
  }) as DealOverview;

describe("the rows the Insights page charts", () => {
  it("flattens a deal into plain words and numbers", () => {
    expect(insightRows([deal({})])).toEqual([
      {
        id: "d1",
        deal: "Logo refresh",
        otherSide: "Daniel Reyes",
        category: "Art and design",
        stage: "In progress",
        waitingOn: "You",
        timing: "Overdue",
        amount: 450.5,
        currency: "USD",
        records: 41,
        stepsDone: 1,
        stepsTotal: 5,
        unread: 3,
        changed: "2026-03-08",
      },
    ]);
  });

  it("says who a deal waits on and whether it is on time", () => {
    const next = { text: "Pay", step: null, overdue: false };
    const [buyer, paypal, none, done] = insightRows([
      deal({ next: { ...next, waitingOn: "buyer", dueDate: "2026-03-20" } }),
      deal({ next: { ...next, waitingOn: "paypal", dueDate: null } }),
      deal({ next: null, amount: null, completeness: null }),
    ]);
    expect([buyer?.waitingOn, buyer?.timing]).toEqual(["The other side", "On time"]);
    expect([paypal?.waitingOn, paypal?.timing]).toEqual(["PayPal", "No due day"]);
    expect([none?.waitingOn, none?.timing, none?.amount, none?.records]).toEqual([
      "Nobody",
      "No due day",
      null,
      null,
    ]);
    expect(done).toBeUndefined();
  });
});
