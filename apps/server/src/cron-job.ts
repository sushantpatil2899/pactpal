import { Render } from "@renderinc/sdk";
import type { TaskStarter } from "./disputes/checker.js";
import { jsonLines, type TaskWiring } from "./disputes/task.js";

/** Starts one Workflow run from a Render Cron Job; false when its settings are missing. */
export type CronStart = (
  env: NodeJS.ProcessEnv,
  starterFor: (apiKey: string) => TaskStarter,
  wiring: Pick<TaskWiring, "clock" | "log">,
) => Promise<boolean>;

/**
 * The body of a Render Cron Job entry file: starts its Workflow run with Render's API, logs one
 * JSON line, and exits with a failure code if the run was not started.
 */
export async function runCronJob(start: CronStart, notStarted: string): Promise<void> {
  const log = jsonLines((line) => process.stdout.write(line));
  try {
    const started = await start(process.env, (apiKey) => new Render({ token: apiKey }).workflows, {
      clock: () => new Date(),
      log,
    });
    if (!started) process.exitCode = 1;
  } catch (error) {
    log.error({ err: error instanceof Error ? error.name : "unknown" }, notStarted);
    process.exitCode = 1;
  }
}
