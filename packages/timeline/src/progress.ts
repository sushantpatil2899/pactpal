import { ownerOf, type TimelineStep } from "./timeline.js";

/** What happened to a step, as recorded (manual steps only). */
export type StepUpdateStatus = "submitted" | "approved" | "changes" | "done";

/** One recorded update of a step: who did what, when. Oldest first. */
export interface StepUpdate {
  step: number;
  status: StepUpdateStatus;
  actor: "seller" | "buyer";
  at: string;
}

/** What the payment records say about a stage. */
export interface StageFacts {
  stage: number;
  invoiced: boolean;
  paid: boolean;
  /** A delivery was sent for the stage. */
  delivered: boolean;
  /** The buyer approved a delivery for the stage. */
  approved: boolean;
  /** The buyer's last answer to a delivery asked for changes. */
  changesAsked: boolean;
}

/** Where a step stands now. */
export type StepState =
  /** Nothing has happened yet. */
  | "open"
  /** The seller shared it, or sent the invoice or the delivery; the buyer is next. */
  | "submitted"
  /** The buyer asked for changes; the seller is next. */
  | "changes"
  /** Finished: provided, approved, paid or accepted. */
  | "done";

export interface StepProgress {
  step: number;
  state: StepState;
  /** Who the step is waiting for, or null when it is done. */
  waitingOn: "seller" | "buyer" | null;
  /** In plain words, what has to happen next (empty when done). */
  next: string;
}

const done = (step: number): StepProgress => ({ step, state: "done", waitingOn: null, next: "" });

/** A review step: shared, sent back, shared again, approved. */
function reviewProgress(n: number, status: StepUpdateStatus | undefined): StepProgress {
  switch (status) {
    case "approved":
      return done(n);
    case "submitted":
      return {
        step: n,
        state: "submitted",
        waitingOn: "buyer",
        next: "Approve it or ask for changes",
      };
    case "changes":
      return {
        step: n,
        state: "changes",
        waitingOn: "seller",
        next: "Share it again with the changes",
      };
    case "done":
    case undefined:
      return { step: n, state: "open", waitingOn: "seller", next: "Share it for review" };
  }
}

/** The latest recorded update of each step. */
function latest(updates: readonly StepUpdate[]): Map<number, StepUpdate> {
  const byStep = new Map<number, StepUpdate>();
  for (const update of updates) byStep.set(update.step, update);
  return byStep;
}

/**
 * Where each step of a signed timeline stands, and who it waits for (7k). Manual steps follow
 * their recorded updates; payments and deliveries follow the invoice and delivery records, which
 * stay the only record of them. Pure: the same facts always give the same answer.
 */
export function timelineProgress(
  steps: readonly TimelineStep[],
  updates: readonly StepUpdate[],
  stages: readonly StageFacts[],
): StepProgress[] {
  const last = latest(updates);
  const stageOf = (stage: number) => stages.find((s) => s.stage === stage);
  return steps.map((step, index): StepProgress => {
    const n = index + 1;
    const update = last.get(n);
    switch (step.kind) {
      case "buyer-provides":
      case "other":
        return update?.status === "done"
          ? done(n)
          : {
              step: n,
              state: "open",
              waitingOn: ownerOf(step),
              next: "Mark it done once it is done",
            };
      case "review":
        return reviewProgress(n, update?.status);
      case "payment": {
        const facts = stageOf(step.stage);
        if (facts?.paid === true) return done(n);
        return facts?.invoiced === true
          ? { step: n, state: "submitted", waitingOn: "buyer", next: "Pay the PayPal invoice" }
          : { step: n, state: "open", waitingOn: "seller", next: "Send the PayPal invoice" };
      }
      case "delivery": {
        const facts = stageOf(step.stage);
        if (facts?.approved === true) return done(n);
        if (facts?.changesAsked === true) {
          return {
            step: n,
            state: "changes",
            waitingOn: "seller",
            next: "Deliver again with the changes",
          };
        }
        return facts?.delivered === true
          ? {
              step: n,
              state: "submitted",
              waitingOn: "buyer",
              next: "Approve the delivery or ask for changes",
            }
          : { step: n, state: "open", waitingOn: "seller", next: "Send the delivery" };
      }
    }
  });
}

/** Which manual updates each side may record on a step in its state, by kind. */
export function allowedUpdates(
  step: TimelineStep,
  state: StepState,
  role: "seller" | "buyer",
): StepUpdateStatus[] {
  switch (step.kind) {
    case "buyer-provides":
    case "other":
      return state !== "done" && role === ownerOf(step) ? ["done"] : [];
    case "review":
      if (role === "seller") return state === "open" || state === "changes" ? ["submitted"] : [];
      return state === "submitted" ? ["approved", "changes"] : [];
    case "payment":
    case "delivery":
      return [];
  }
}
