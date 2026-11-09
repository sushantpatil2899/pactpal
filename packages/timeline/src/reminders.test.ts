import { describe, expect, it } from "vitest";
import { dueReminders, type StepProgress } from "./index.js";

const waiting = (step: number, on: "seller" | "buyer" | null): StepProgress => ({
  step,
  state: on === null ? "done" : "open",
  waitingOn: on,
  next: "",
});
const now = new Date("2026-11-10T09:30:00.000Z");

describe("reminders", () => {
  it("remind whoever a step waits for when it is due within two days or late", () => {
    const steps = [
      { n: 1, dueDate: "2026-11-08" },
      { n: 2, dueDate: "2026-11-12" },
      { n: 3, dueDate: "2026-11-13" },
      { n: 4, dueDate: null },
      { n: 5, dueDate: "2026-11-01" },
      { n: 6, dueDate: "2026-11-10" },
    ];
    const progress = [
      waiting(1, "buyer"),
      waiting(2, "seller"),
      waiting(3, "seller"),
      waiting(4, "buyer"),
      waiting(5, null),
      waiting(6, "buyer"),
    ];
    expect(dueReminders(steps, progress, now)).toEqual([
      { step: 1, to: "buyer", kind: "overdue", dueDate: "2026-11-08", day: "2026-11-10" },
      { step: 2, to: "seller", kind: "soon", dueDate: "2026-11-12", day: "2026-11-10" },
      { step: 6, to: "buyer", kind: "soon", dueDate: "2026-11-10", day: "2026-11-10" },
    ]);
  });

  it("skips steps with no progress known", () => {
    expect(dueReminders([{ n: 1, dueDate: "2026-11-10" }], [], now)).toEqual([]);
  });
});
