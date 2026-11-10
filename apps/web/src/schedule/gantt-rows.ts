import type { StageView } from "../api";
import type { RunningStepView } from "../chat-api";
import { addDays, earlierDay, laterDay } from "./days";

/** One step as a bar on the deal's chart. Days are YYYY-MM-DD; `end` is the day after the last. */
export interface GanttTask {
  id: number;
  name: string;
  kind: RunningStepView["kind"];
  owner: "seller" | "buyer";
  start: string;
  end: string;
  /** The agreed due day, when the step has one. */
  due: string | null;
  state: "done" | "current" | "late" | "held" | "todo";
  /** What the bar says about itself: who it waits for, or how a payment stands. */
  note: string;
}

export interface GanttLink {
  id: number;
  from: number;
  to: number;
}

export interface GanttRows {
  tasks: GanttTask[];
  links: GanttLink[];
  start: string;
  end: string;
}

const PAYMENT_WORDS: Record<StageView["status"], string> = {
  not_invoiced: "Not invoiced yet",
  sending: "Invoice being sent",
  sent: "Invoice sent, not paid yet",
  paid: "Paid",
};

/** The day a step was finished: its last update. */
const doneDay = (step: RunningStepView): string | undefined => step.updates.at(-1)?.at.slice(0, 10);

function noteFor(step: RunningStepView, stages: readonly StageView[]): string {
  const stage = step.kind === "payment" ? stages.find((s) => s.stage === step.stage) : undefined;
  if (stage) return PAYMENT_WORDS[stage.status];
  if (step.state === "done") return "Done";
  return step.waitingOn === null ? "To do" : `Waiting for the ${step.waitingOn}`;
}

/**
 * The signed timeline as a chain of bars: each step starts where the one before it ended, so a
 * step that runs past its due day (a payment not yet made, say) pushes every later step along.
 * A step pushed past its own due day is "held". `today` is a day (YYYY-MM-DD).
 */
export function ganttRows(
  steps: readonly RunningStepView[],
  stages: readonly StageView[],
  today: string,
): GanttRows {
  const first = steps[0];
  if (!first) return { tasks: [], links: [], start: today, end: addDays(today, 1) };
  const firstDay = doneDay(first) ?? first.dueDate ?? today;
  let cursor = addDays(earlierDay(firstDay, today), -2);
  const start = cursor;
  const current = steps.find((step) => step.state !== "done");
  const tasks = steps.map((step): GanttTask => {
    const begins = cursor;
    const done = step.state === "done";
    let last: string;
    if (done) last = doneDay(step) ?? step.dueDate ?? begins;
    else if (step === current) last = laterDay(step.dueDate ?? today, today);
    else last = step.dueDate ?? begins;
    const end = addDays(laterDay(last, begins), 1);
    cursor = end;
    let state: GanttTask["state"] = "todo";
    if (done) state = "done";
    else if (step === current)
      state = step.dueDate !== null && step.dueDate < today ? "late" : "current";
    else if (step.dueDate !== null && addDays(end, -1) > step.dueDate) state = "held";
    return {
      id: step.n,
      name: step.title,
      kind: step.kind,
      owner: step.owner,
      start: begins,
      end,
      due: step.dueDate,
      state,
      note: noteFor(step, stages),
    };
  });
  const links = tasks
    .slice(1)
    .map((task, i) => ({ id: i + 1, from: tasks[i]?.id ?? 0, to: task.id }));
  return { tasks, links, start, end: addDays(cursor, 2) };
}
