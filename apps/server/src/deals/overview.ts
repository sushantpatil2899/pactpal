import type { StepProgress } from "@pactpal/timeline";

/** Where a deal stands, as the dashboard groups deals. */
export type DealStage =
  | "drafting"
  | "awaiting_buyer"
  | "in_progress"
  | "delivered"
  | "disputed"
  | "complete"
  | "cancelled";

/** The one thing a deal is waiting for. */
export interface NextStep {
  /** In plain words, what has to happen. */
  text: string;
  waitingOn: "seller" | "buyer" | "paypal";
  /** The agreed day (YYYY-MM-DD) or the dispute's respond-by day; null when none is set. */
  dueDate: string | null;
  overdue: boolean;
  /** The timeline step it is, when it is one. */
  step: number | null;
}

export interface OverviewFacts {
  status: "draft" | "awaiting_acceptance" | "active" | "completed" | "cancelled";
  /** The signed timeline's steps, in order; empty before signing. */
  steps: readonly { title: string; kind: string; dueDate: string | null }[];
  /** Where each of those steps stands. */
  progress: readonly StepProgress[];
  /** The deal's open dispute, if any: PayPal's status and the seller's respond-by time. */
  dispute: { status: string; sellerDueAt: Date | null } | undefined;
  /** Today (YYYY-MM-DD), to tell what is overdue. */
  today: string;
}

export interface DealOverview {
  stage: DealStage;
  next: NextStep | null;
  stepsDone: number;
  stepsTotal: number;
}

const waiting = (
  text: string,
  waitingOn: NextStep["waitingOn"],
  dueDate: string | null,
  today: string,
  step: number | null = null,
): NextStep => ({ text, waitingOn, dueDate, overdue: dueDate !== null && dueDate < today, step });

function disputeStep(dispute: NonNullable<OverviewFacts["dispute"]>, today: string): NextStep {
  const due = dispute.sellerDueAt?.toISOString().slice(0, 10) ?? null;
  if (dispute.status === "WAITING_FOR_SELLER_RESPONSE") {
    return waiting("Answer the dispute", "seller", due, today);
  }
  return dispute.status === "WAITING_FOR_BUYER_RESPONSE"
    ? waiting("The buyer answers the dispute in PayPal", "buyer", null, today)
    : waiting("PayPal is reviewing the dispute", "paypal", null, today);
}

/**
 * A deal's stage and the one thing it waits for, from facts already read. Pure: the same facts
 * always give the same answer. A dispute outranks everything; otherwise the deal's status
 * decides, and a signed deal follows its timeline.
 */
export function dealOverview(facts: OverviewFacts): DealOverview {
  const { status, steps, progress, dispute, today } = facts;
  const isDone = (index: number) => progress[index]?.state === "done";
  const stepsDone = steps.filter((_, index) => isDone(index)).length;
  const counts = { stepsDone, stepsTotal: steps.length };
  if (status === "cancelled") return { stage: "cancelled", next: null, ...counts };
  if (dispute) return { stage: "disputed", next: disputeStep(dispute, today), ...counts };
  switch (status) {
    case "draft":
      return {
        stage: "drafting",
        next: waiting("Finish the agreement and send it to the buyer", "seller", null, today),
        ...counts,
      };
    case "awaiting_acceptance":
      return {
        stage: "awaiting_buyer",
        next: waiting("Sign the agreement or ask for changes", "buyer", null, today),
        ...counts,
      };
    case "completed":
      return { stage: "complete", next: null, ...counts };
    case "active": {
      const at = steps.findIndex((_, index) => !isDone(index));
      const step = steps[at];
      const state = progress[at];
      const deliveries = steps.flatMap((s, index) => (s.kind === "delivery" ? [index] : []));
      const delivered = deliveries.length > 0 && deliveries.every(isDone);
      return {
        stage: delivered ? "delivered" : "in_progress",
        next:
          step && state?.waitingOn
            ? waiting(`${step.title}: ${state.next}`, state.waitingOn, step.dueDate, today, at + 1)
            : null,
        ...counts,
      };
    }
  }
}
