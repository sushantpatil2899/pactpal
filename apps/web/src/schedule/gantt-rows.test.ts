import { describe, expect, it } from "vitest";
import type { StageView } from "../api";
import type { RunningStepView } from "../chat-api";
import { ganttRows } from "./gantt-rows";

const step = (n: number, changes: Partial<RunningStepView> = {}): RunningStepView => ({
  n,
  kind: "other",
  owner: "seller",
  title: `Step ${String(n)}`,
  dueDate: null,
  stage: null,
  amount: null,
  state: "open",
  waitingOn: "seller",
  next: "",
  canDo: [],
  updates: [],
  ...changes,
});

const done = (at: string): Partial<RunningStepView> => ({
  state: "done",
  waitingOn: null,
  updates: [{ status: "done", actor: "buyer", at, note: null, files: [] }],
});

const stage = (n: number, status: StageView["status"]) => ({ stage: n, status }) as StageView;

describe("the deal's chart rows", () => {
  it("is empty when there are no steps", () => {
    expect(ganttRows([], [], "2026-03-10")).toEqual({
      tasks: [],
      links: [],
      start: "2026-03-10",
      end: "2026-03-11",
    });
  });

  it("chains the steps, each starting where the last one ended", () => {
    const rows = ganttRows(
      [
        step(1, {
          kind: "payment",
          owner: "buyer",
          stage: 1,
          dueDate: "2026-03-05",
          ...done("2026-03-04T10:00:00Z"),
        }),
        step(2, { dueDate: "2026-03-12", waitingOn: "buyer" }),
        step(3, { dueDate: "2026-03-20" }),
      ],
      [stage(1, "paid")],
      "2026-03-10",
    );
    expect(rows.tasks.map((t) => [t.start, t.end, t.state, t.note])).toEqual([
      ["2026-03-02", "2026-03-05", "done", "Paid"],
      ["2026-03-05", "2026-03-13", "current", "Waiting for the buyer"],
      ["2026-03-13", "2026-03-21", "todo", "Waiting for the seller"],
    ]);
    expect(rows.links).toEqual([
      { id: 1, from: 1, to: 2 },
      { id: 2, from: 2, to: 3 },
    ]);
    expect([rows.start, rows.end]).toEqual(["2026-03-02", "2026-03-23"]);
  });

  it("shows a late payment holding up the step after it", () => {
    const rows = ganttRows(
      [
        step(1, {
          kind: "payment",
          owner: "buyer",
          stage: 1,
          dueDate: "2026-03-05",
          waitingOn: "buyer",
        }),
        step(2, { dueDate: "2026-03-08" }),
        step(3, { waitingOn: null }),
      ],
      [stage(1, "sent")],
      "2026-03-10",
    );
    expect(rows.tasks.map((t) => [t.start, t.end, t.state])).toEqual([
      ["2026-03-03", "2026-03-11", "late"],
      ["2026-03-11", "2026-03-12", "held"],
      ["2026-03-12", "2026-03-13", "todo"],
    ]);
    expect(rows.tasks.map((t) => t.note)).toEqual([
      "Invoice sent, not paid yet",
      "Waiting for the seller",
      "To do",
    ]);
  });

  it("uses the due day for a done step with no update, and names other payment states", () => {
    const rows = ganttRows(
      [
        step(1, { state: "done", waitingOn: null, dueDate: "2026-03-09" }),
        step(2, { kind: "payment", stage: 2 }),
        step(3, { kind: "payment", stage: 3, state: "done" }),
        step(4, { kind: "payment", stage: 9 }),
      ],
      [stage(2, "not_invoiced"), stage(3, "sending")],
      "2026-03-10",
    );
    expect(rows.tasks.map((t) => t.note)).toEqual([
      "Done",
      "Not invoiced yet",
      "Invoice being sent",
      "Waiting for the seller",
    ]);
    expect(rows.tasks[0]?.end).toBe("2026-03-10");
  });
});
