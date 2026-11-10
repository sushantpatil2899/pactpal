import { describe, expect, it } from "vitest";
import type { DealOverview } from "../overview-api";
import { deadlineRows, hasEvidence } from "./deadline-rows";

const deal = (id: string, changes: Partial<DealOverview> = {}): DealOverview =>
  ({
    id,
    title: `Deal ${id}`,
    role: "seller",
    buyer: { name: "Chris Okafor", email: "chris@example.com" },
    stage: "in_progress",
    next: {
      text: "Send the invoice",
      waitingOn: "seller",
      dueDate: "2026-03-12",
      overdue: false,
      step: 1,
    },
    dispute: null,
    ...changes,
  }) as DealOverview;

describe("evidence on a dispute", () => {
  it("counts a built packet or an upload, and nothing else", () => {
    expect(hasEvidence([{ type: "DISPUTE_OPENED" }])).toBe(false);
    expect(hasEvidence([{ type: "DISPUTE_OPENED" }, { type: "PACKET_BUILT" }])).toBe(true);
    expect(hasEvidence([{ type: "EVIDENCE_UPLOADED" }])).toBe(true);
  });
});

describe("the deadlines across deals", () => {
  it("lists due and late steps, and leaves out finished or undated deals", () => {
    const next = { text: "Pay", waitingOn: "buyer" as const, step: 2 };
    const found = deadlineRows(
      [
        deal("a"),
        deal("b", {
          next: { ...next, dueDate: "2026-03-05", overdue: true },
          role: "buyer",
          seller: { name: "Maya Lin" },
        }),
        deal("c", { next: { ...next, dueDate: null, overdue: false } }),
        deal("d", { stage: "complete" }),
        deal("e", { next: null, buyer: { name: null, email: "amara@example.com" } }),
      ],
      {},
      "2026-03-10",
    );
    expect(found.rows).toEqual([
      { id: "a", deal: "Deal a", otherSide: "Chris Okafor" },
      { id: "b", deal: "Deal b", otherSide: "Maya Lin" },
    ]);
    expect(found.events.map((e) => [e.id, e.day, e.kind, e.path])).toEqual([
      ["a-step", "2026-03-12", "due", "/deals/a#timeline"],
      ["b-step", "2026-03-05", "late", "/deals/b#timeline"],
    ]);
    expect([found.start, found.end]).toEqual(["2026-03-02", "2026-03-19"]);
  });

  it("marks a dispute deadline that has no evidence yet", () => {
    const dispute = (id: string) => ({ disputeId: id, respondBy: "2026-03-20T18:00:00Z" });
    const found = deadlineRows(
      [
        deal("a", { next: null, dispute: dispute("D1"), stage: "disputed" }),
        deal("b", { next: null, dispute: dispute("D2"), stage: "disputed", buyer: null }),
        deal("c", { next: null, dispute: dispute("D3"), stage: "disputed", role: "buyer" }),
        deal("d", { next: null, dispute: { disputeId: "D4", respondBy: null } }),
      ],
      { D1: false, D2: true },
      "2026-03-10",
    );
    expect(found.events.map((e) => [e.kind, e.name, e.path])).toEqual([
      ["dispute-bare", "Respond to the dispute: no evidence prepared yet", "/deals/a/disputes/D1"],
      ["dispute", "Respond to the dispute", "/deals/b/disputes/D2"],
      ["dispute", "Respond to the dispute", "/deals/c/disputes/D3"],
    ]);
    expect(found.rows.map((r) => r.otherSide)).toEqual(["Chris Okafor", "the buyer", "the seller"]);
    expect(found.end).toBe("2026-03-27");
  });

  it("frames today when nothing is dated", () => {
    expect(deadlineRows([], {}, "2026-03-10")).toEqual({
      rows: [],
      events: [],
      start: "2026-03-07",
      end: "2026-03-17",
    });
  });
});
