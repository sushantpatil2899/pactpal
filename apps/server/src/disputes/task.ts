import {
  DISPUTE_CHECK_SOURCES,
  MIGRATIONS,
  migrationStatus,
  type Database,
  type DisputeCheckResult,
} from "@pactpal/db";
import type { PayPalAppCredentials } from "@pactpal/paypal";
import { z } from "zod";
import { formatErrors, loadConfig } from "../config.js";
import type { LogSink } from "../payments/payment-sync.js";
import { renderWorkflowChecker, type TaskStarter } from "./checker.js";
import { syncDisputes, type DisputeReader } from "./dispute-sync.js";

/** The Render Workflow task's name; the website and the cron start it as `<workflow>/<name>`. */
export const DISPUTE_TASK_NAME = "check-disputes";

/** Where the task and the cron get their outside connections; real ones in the entry files. */
export interface TaskWiring {
  connect: (url: string) => Database;
  disputesFor: (seller: PayPalAppCredentials) => DisputeReader;
  clock: () => Date;
  newId: () => string;
  log: LogSink;
}

/**
 * One run of the Render Workflow task: checks the settings and that the database has every
 * migration (the workflow service deploys apart from the website, whose deploy runs them), then
 * runs one dispute check. Throws on any problem, so Render retries the run.
 */
export async function runDisputeTask(
  env: NodeJS.ProcessEnv,
  input: unknown,
  wiring: TaskWiring,
): Promise<DisputeCheckResult> {
  const source = z.enum(DISPUTE_CHECK_SOURCES).parse(input);
  const loaded = loadConfig(env);
  if (!loaded.ok) throw new Error(formatErrors(loaded.errors));
  const { database, paypal } = loaded.config;
  const seller = paypal.apps.seller;
  if (database === undefined || seller === undefined) {
    throw new Error("Dispute checks need DATABASE_URL and the PayPal seller app's keys");
  }
  const db = wiring.connect(database.url.reveal());
  try {
    const status = await migrationStatus(db, MIGRATIONS);
    if (!status.upToDate)
      throw new Error("The database is waiting for migrations; try again later");
    return await syncDisputes(
      {
        db,
        disputes: wiring.disputesFor(seller),
        clock: wiring.clock,
        newId: wiring.newId,
        log: wiring.log,
      },
      source,
    );
  } finally {
    await db.close();
  }
}

/**
 * The Render Cron Job: starts one scheduled dispute check as a Workflow task run and returns.
 * False (nothing started) when Render's settings are missing.
 */
export async function startScheduledCheck(
  env: NodeJS.ProcessEnv,
  starterFor: (apiKey: string) => TaskStarter,
  wiring: Pick<TaskWiring, "clock" | "log">,
): Promise<boolean> {
  const loaded = loadConfig(env);
  if (!loaded.ok) throw new Error(formatErrors(loaded.errors));
  const render = loaded.config.render;
  if (render === undefined) {
    wiring.log.error({}, "Dispute checks need RENDER_API_KEY and DISPUTE_TASK_SLUG");
    return false;
  }
  const checker = renderWorkflowChecker(
    starterFor(render.apiKey.reveal()),
    render.taskSlug,
    wiring.clock,
    wiring.log,
  );
  await checker.start({ kind: "schedule" });
  return true;
}

/** Log lines as JSON on standard output, the way the server's own logger writes them. */
export function jsonLines(write: (line: string) => void): LogSink {
  const line = (level: number) => (details: object, msg: string) => {
    write(`${JSON.stringify({ level, time: Date.now(), ...details, msg })}\n`);
  };
  return { info: line(30), warn: line(40), error: line(50) };
}
