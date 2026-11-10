import { describe, expect, it } from "vitest";
import { defaultTab, statusBadge, stripSteps, type StripSource } from "./deal-view";

const step = (n: number, changes: Partial<StripSource> = {}): StripSource => ({
  n,
  kind: "other",
  owner: "seller",
  title: `Step ${String(n)}`,
  dueDate: null,
  stage: null,
  amount: null,
  ...changes,
});

describe("the deal space's opening view", () => {
  it("opens the agreement until it is signed, then the timeline, then the log", () => {
    expect(defaultTab("draft")).toBe("scope");
    expect(defaultTab("awaiting_acceptance")).toBe("scope");
    expect(defaultTab("active")).toBe("timeline");
    expect(defaultTab("completed")).toBe("log");
    expect(defaultTab("cancelled")).toBe("scope");
  });

  it("names each status", () => {
    expect(statusBadge("draft").word).toBe("Drafting");
    expect(statusBadge("awaiting_acceptance")).toEqual({
      badge: "awaiting",
      word: "Waiting for buyer",
    });
    expect(statusBadge("active").word).toBe("In progress");
    expect(statusBadge("completed").word).toBe("Complete");
    expect(statusBadge("cancelled").word).toBe("Cancelled");
  });
});

describe("the progress strip", () => {
  it("marks done steps, the current one, and the rest", () => {
    const steps = [
      step(1, { state: "done" }),
      step(2, {
        state: "submitted",
        dueDate: "2026-03-20",
        amount: { minor: 20000, text: "200.00" },
      }),
      step(3, { state: "open" }),
    ];
    expect(stripSteps(steps, true, "2026-03-10")).toEqual([
      { n: 1, title: "Step 1", detail: "", state: "done" },
      { n: 2, title: "Step 2", detail: "200.00 · 20 Mar 2026", state: "now" },
      { n: 3, title: "Step 3", detail: "", state: "todo" },
    ]);
  });

  it("marks the current step late once its due day has passed", () => {
    const steps = [
      step(1, { state: "open", dueDate: "2026-03-05" }),
      step(2, { state: "open", dueDate: "2026-03-01" }),
    ];
    expect(stripSteps(steps, true, "2026-03-10").map((s) => s.state)).toEqual(["late", "todo"]);
  });

  it("shows every step as still to do before the agreement is signed", () => {
    expect(stripSteps([step(1), step(2)], false, "2026-03-10").map((s) => s.state)).toEqual([
      "todo",
      "todo",
    ]);
  });
});
