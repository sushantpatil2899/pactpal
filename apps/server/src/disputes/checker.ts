import type { AnalysisKind, DisputeCheckSource } from "@pactpal/db";
import type { DraftingRuntime } from "../drafting/runtime.js";
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

/** Another task of the same workflow: "pactpal-workflows/check-disputes" → "pactpal-workflows/<task>". */
export const sameWorkflowTask = (taskSlug: string, task: string): string =>
  `${taskSlug.split("/")[0] ?? taskSlug}/${task}`;

/** Starts one dispute council job (a 5d comparison or a 5f summary): a Render run, or in process. */
export interface ClaimRunner {
  start(analysisId: string, kind: AnalysisKind): Promise<void>;
}

/** Every council place in this server is taken; try again in a minute. */
export class RunnerBusyError extends Error {
  override readonly name = "RunnerBusyError";
}

/** Starts each job as a run of its kind's Workflow task (`taskSlugs`), once per job. */
export function renderClaimRunner(
  starter: TaskStarter,
  taskSlugs: Readonly<Record<AnalysisKind, string>>,
  log: LogSink,
): ClaimRunner {
  return {
    async start(analysisId, kind) {
      const run = await starter.startTask(taskSlugs[kind], [analysisId], {
        idempotencyKey: `${kind}:${analysisId}`,
      });
      log.info(
        { analysisId, kind, taskRunId: run.taskRunId },
        "Dispute council job started on Render",
      );
    },
  };
}

/**
 * Runs the comparison in this server's background, within its limit of councils at once (a local
 * copy, where there is no Render). `run` must never throw.
 */
export function inProcessClaimRunner(
  runtime: Pick<DraftingRuntime, "acquire" | "run">,
  run: (analysisId: string) => Promise<void>,
): ClaimRunner {
  return {
    start(analysisId) {
      const release = runtime.acquire();
      if (!release) return Promise.reject(new RunnerBusyError("every council place is taken"));
      runtime.run(async () => {
        try {
          await run(analysisId);
        } finally {
          release();
        }
      });
      return Promise.resolve();
    },
  };
}
