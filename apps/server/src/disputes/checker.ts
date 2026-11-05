import type { DisputeCheckSource } from "@pactpal/db";
import type { LogSink } from "../payments/payment-sync.js";

/** Why a dispute check is wanted. */
export type CheckRequest =
  | { kind: "schedule" }
  | { kind: "button"; dealId: string }
  | { kind: "notification"; eventId: string };

/** Starts a dispute check: as a Render Workflow task on the live site, in process locally. */
export interface DisputeChecker {
  start(request: CheckRequest): Promise<void>;
}

/** The slice of Render's workflows client that starts a task run. */
export interface TaskStarter {
  startTask(
    taskSlug: string,
    inputData: unknown[],
    options: { idempotencyKey: string },
  ): Promise<{ taskRunId: string }>;
}

/** How often the schedule fires, and how long a "Check now" press counts as the same press. */
export const SCHEDULE_WINDOW_MS = 5 * 60_000;
export const BUTTON_WINDOW_MS = 30_000;

/**
 * The key that makes starting a check safe to repeat: Render starts one run per key within 24
 * hours. Overlapping schedule runs in one 5-minute window, or presses within 30 seconds on one
 * deal, start one check; a PayPal notification starts one check per event.
 */
export function checkKey(request: CheckRequest, now: Date): string {
  const window = (ms: number) => String(Math.floor(now.getTime() / ms));
  switch (request.kind) {
    case "schedule":
      return `schedule:${window(SCHEDULE_WINDOW_MS)}`;
    case "button":
      return `button:${request.dealId}:${window(BUTTON_WINDOW_MS)}`;
    case "notification":
      return `notification:${request.eventId}`;
  }
}

/** Starts the check as a run of the Render Workflow task `taskSlug` ("workflow/task"). */
export function renderWorkflowChecker(
  starter: TaskStarter,
  taskSlug: string,
  clock: () => Date,
  log: LogSink,
): DisputeChecker {
  return {
    async start(request) {
      const source: DisputeCheckSource = request.kind;
      const run = await starter.startTask(taskSlug, [source], {
        idempotencyKey: checkKey(request, clock()),
      });
      log.info({ source, taskRunId: run.taskRunId }, "Dispute check started on Render");
    },
  };
}

/** Runs the check here and now; for a local copy and tests, where there is no Render. */
export function inProcessChecker(
  run: (source: DisputeCheckSource) => Promise<unknown>,
): DisputeChecker {
  return {
    async start(request) {
      await run(request.kind);
    },
  };
}
