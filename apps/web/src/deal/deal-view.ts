import { dayWords } from "@pactpal/words";
import type { StepView } from "../api";
import type { DealTab } from "../ChatTab";
import type { Status } from "../design/Badge";

/** The view the right side opens with, by where the deal stands. */
export function defaultTab(status: string): Exclude<DealTab, "chat"> {
  if (status === "active") return "timeline";
  if (status === "completed") return "log";
  return "scope";
}

/** A deal's status as a badge and a word. */
export function statusBadge(status: string): { badge: Status; word: string } {
  switch (status) {
    case "awaiting_acceptance":
      return { badge: "awaiting", word: "Waiting for buyer" };
    case "active":
      return { badge: "signed", word: "In progress" };
    case "completed":
      return { badge: "paid", word: "Complete" };
    case "cancelled":
      return { badge: "draft", word: "Cancelled" };
    default:
      return { badge: "draft", word: "Drafting" };
  }
}

/** A step with where it stands, when the agreement is signed. */
export type StripSource = StepView & { state?: "open" | "submitted" | "changes" | "done" };

export interface StripStep {
  n: number;
  title: string;
  /** The amount and the due day, where the step has them. */
  detail: string;
  /** `now` is the first step not yet done; `late` is that step past its due day. */
  state: "done" | "now" | "late" | "todo";
}

/** The steps as the progress strip draws them. `today` is a day (YYYY-MM-DD). */
export function stripSteps(
  steps: readonly StripSource[],
  signed: boolean,
  today: string,
): StripStep[] {
  const current = signed ? steps.find((step) => step.state !== "done") : undefined;
  return steps.map((step) => {
    const detail = [step.amount?.text, step.dueDate === null ? undefined : dayWords(step.dueDate)]
      .filter((part) => part !== undefined)
      .join(" · ");
    const late = step.dueDate !== null && step.dueDate < today;
    let state: StripStep["state"] = "todo";
    if (signed && step.state === "done") state = "done";
    else if (step === current) state = late ? "late" : "now";
    return { n: step.n, title: step.title, detail, state };
  });
}
