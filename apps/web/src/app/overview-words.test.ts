import { describe, expect, it } from "vitest";
import type { DealOverview, NextStep } from "../overview-api";
import {
  byUrgency,
  dueWords,
  initials,
  isOpen,
  matchingDeals,
  needsMe,
  otherName,
  waitingWords,
} from "./overview-words";

const next = (more: Partial<NextStep> = {}): NextStep => ({
  text: "Send the PayPal invoice",
  waitingOn: "seller",
  dueDate: null,
  overdue: false,
  step: 1,
  ...more,
});

const deal = (more: Partial<DealOverview> = {}): DealOverview => ({
  id: "d1",
  title: "Book cover",
  kind: "service",
  category: "art_design",
  categoryLabel: "Art and design",
  currency: "USD",
  status: "active",
  createdAt: "2026-03-01T09:00:00Z",
  updatedAt: "2026-03-02T09:00:00Z",
  hasBuyer: true,
  role: "seller",
  buyer: { name: "Chris Okafor", email: "chris@example.com" },
  amount: { minor: 60000, text: "600.00" },
  stage: "in_progress",
  next: next(),
  stepsDone: 0,
  stepsTotal: 3,
  completeness: 14,
  unreadMessages: 0,
  unreadNotifications: 0,
  dispute: null,
  ...more,
});

describe("overview words", () => {
  it("says who a deal waits for", () => {
    expect(needsMe(deal())).toBe(true);
    expect(waitingWords(deal())).toBe("Waiting for you");
    expect(waitingWords(deal({ next: next({ waitingOn: "buyer" }) }))).toBe(
      "Waiting for Chris Okafor",
    );
    expect(waitingWords(deal({ next: next({ waitingOn: "paypal" }) }))).toBe("Waiting for PayPal");
    expect(waitingWords(deal({ next: null }))).toBe("");
    expect(needsMe(deal({ role: "buyer" }))).toBe(false);
  });

  it("names the other side, falling back to their email or a plain word", () => {
    expect(otherName(deal({ buyer: { name: null, email: "chris@example.com" } }))).toBe(
      "chris@example.com",
    );
    expect(otherName(deal({ buyer: null }))).toBe("the buyer");
    expect(otherName(deal({ role: "buyer", seller: { name: "Maya Lin" } }))).toBe("Maya Lin");
    expect(otherName(deal({ role: "buyer" }))).toBe("the seller");
  });

  it("says when the next step is due", () => {
    expect(dueWords(deal())).toBe("");
    expect(dueWords(deal({ next: null }))).toBe("");
    expect(dueWords(deal({ next: next({ dueDate: "2026-03-12" }) }))).toBe("Due 12 Mar 2026");
    expect(dueWords(deal({ next: next({ dueDate: "2026-03-05", overdue: true }) }))).toBe(
      "Was due 5 Mar 2026",
    );
  });

  it("orders deals by urgency", () => {
    const late = deal({ id: "late", next: next({ dueDate: "2026-03-05", overdue: true }) });
    const soon = deal({ id: "soon", next: next({ dueDate: "2026-03-12" }) });
    const later = deal({ id: "later", next: next({ dueDate: "2026-03-20" }) });
    const newer = deal({ id: "newer", updatedAt: "2026-03-09T09:00:00Z" });
    const older = deal({ id: "older", next: null });
    const order = [older, later, newer, soon, late].sort(byUrgency).map((d) => d.id);
    expect(order).toEqual(["late", "soon", "later", "newer", "older"]);
  });

  it("tells running deals from finished ones", () => {
    expect(isOpen(deal())).toBe(true);
    expect(isOpen(deal({ stage: "complete" }))).toBe(false);
    expect(isOpen(deal({ stage: "cancelled" }))).toBe(false);
  });

  it("makes initials from names and emails", () => {
    expect(initials("Chris Okafor")).toBe("CO");
    expect(initials("maya@example.com")).toBe("ME");
    expect(initials("Jun")).toBe("J");
    expect(initials("")).toBe("?");
  });

  it("finds deals by every word typed", () => {
    const deals = [deal(), deal({ id: "d2", title: "Logo refresh", buyer: null })];
    expect(matchingDeals(deals, "").length).toBe(2);
    expect(matchingDeals(deals, "chris cover").map((d) => d.id)).toEqual(["d1"]);
    expect(matchingDeals(deals, "LOGO").map((d) => d.id)).toEqual(["d2"]);
    expect(matchingDeals(deals, "nothing")).toEqual([]);
  });
});
