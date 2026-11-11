/**
 * The Render Cron Job for the retention clean-up (`node apps/server/dist/retention-cron.js`, once
 * a day, 9c): starts one run of the Workflow task, then exits.
 */
import { runCronJob } from "./cron-job.js";
import { startScheduledRetention } from "./disputes/task.js";

await runCronJob(startScheduledRetention, "Retention clean-up not started");
