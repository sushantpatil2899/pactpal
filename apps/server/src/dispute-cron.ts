/**
 * The Render Cron Job (`node apps/server/dist/dispute-cron.js`, every 5 minutes): starts one
 * dispute check as a run of the Workflow task, then exits. Render Workflows has no schedule of
 * its own, so this is how the check runs on a timer.
 */
import { Render } from "@renderinc/sdk";
import { jsonLines, startScheduledCheck } from "./disputes/task.js";

const log = jsonLines((line) => process.stdout.write(line));

try {
  const started = await startScheduledCheck(
    process.env,
    (apiKey) => new Render({ token: apiKey }).workflows,
    { clock: () => new Date(), log },
  );
  if (!started) process.exitCode = 1;
} catch (error) {
  log.error({ err: error instanceof Error ? error.name : "unknown" }, "Dispute check not started");
  process.exitCode = 1;
}
