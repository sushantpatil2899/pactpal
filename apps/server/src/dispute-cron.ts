/**
 * The Render Cron Job (`node apps/server/dist/dispute-cron.js`, every 5 minutes): starts one
 * dispute check as a run of the Workflow task, then exits. Render Workflows has no schedule of
 * its own, so this is how the check runs on a timer.
 */
import { runCronJob } from "./cron-job.js";
import { startScheduledCheck } from "./disputes/task.js";

await runCronJob(startScheduledCheck, "Dispute check not started");
