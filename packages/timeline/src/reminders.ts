import type { ResolvedStep } from "./timeline.js";
import type { StepProgress } from "./progress.js";

/** Reminders start this many days before a step is due. */
export const REMIND_DAYS_BEFORE = 2;

/** A reminder due today for one step. */
export interface DueReminder {
  step: number;
  to: "seller" | "buyer";
  kind: "soon" | "overdue";
  /** The step's due date (YYYY-MM-DD). */
  dueDate: string;
  /** Today (YYYY-MM-DD, UTC): one reminder per step and day. */
  day: string;
}

const dayOf = (at: Date) => at.toISOString().slice(0, 10);
const addDays = (day: string, days: number) =>
  dayOf(new Date(Date.parse(`${day}T00:00:00Z`) + days * 86_400_000));

/**
 * The reminders due today (7l): every step that is not done, has a due date and is waiting for
 * someone, when it is due within `REMIND_DAYS_BEFORE` days ("soon") or already late ("overdue").
 * The reminder goes to whoever the step waits for. Pure: `now` is passed in.
 */
export function dueReminders(
  steps: readonly Pick<ResolvedStep, "n" | "dueDate">[],
  progress: readonly StepProgress[],
  now: Date,
): DueReminder[] {
  const today = dayOf(now);
  const horizon = addDays(today, REMIND_DAYS_BEFORE);
  return steps.flatMap((step) => {
    const state = progress.find((p) => p.step === step.n);
    if (state?.waitingOn == null || step.dueDate === null) return [];
    if (step.dueDate > horizon) return [];
    return [
      {
        step: step.n,
        to: state.waitingOn,
        kind: step.dueDate < today ? "overdue" : "soon",
        dueDate: step.dueDate,
        day: today,
      },
    ];
  });
}
