import {
  DISPUTE_CHECK_SOURCES,
  MIGRATIONS,
  migrationStatus,
  type Database,
  type DisputeCheckResult,
} from "@pactpal/db";
import type { ChatClient } from "@pactpal/ai";
import type { EmailSender } from "@pactpal/email";
import type { PayPalAppCredentials } from "@pactpal/paypal";
import type { Secret } from "@pactpal/net";
import { cryptoCouncilDeps } from "../drafting/runtime.js";
import { runDisputeJob } from "./claim-job.js";
import { z } from "zod";
import { formatErrors, loadConfig, type Config } from "../config.js";
import type { LogSink } from "../payments/payment-sync.js";
import { renderWorkflowChecker, type TaskStarter } from "./checker.js";
import { syncDisputes, type DisputeReader } from "./dispute-sync.js";
import { LinkedApps, linkedDisputeAccounts, type ConnectApp } from "../sellers/linked-apps.js";
import { sellerKeyBox } from "../sellers/key-box.js";

/** The Render Workflow task's name; the website and the cron start it as `<workflow>/<name>`. */
export const DISPUTE_TASK_NAME = "check-disputes";

/** Where the task and the cron get their outside connections; real ones in the entry files. */
export interface TaskWiring {
  connect: (url: string) => Database;
  disputesFor: (seller: PayPalAppCredentials) => DisputeReader;
  /** Builds a seller's own linked app's clients (6h-5); its disputes are checked too. */
  connectApp?: ConnectApp;
  clock: () => Date;
  newId: () => string;
  log: LogSink;
  /** The email service for the seller's dispute emails (5j), from the email settings. */
  emailFor?: (settings: NonNullable<Config["email"]>) => EmailSender;
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
  const config = settings(env);
  const seller = config.paypal.apps.seller;
  const box =
    config.sellerKeys && wiring.connectApp
      ? { box: sellerKeyBox(config.sellerKeys.encryptionKey), connect: wiring.connectApp }
      : undefined;
  if (config.database === undefined || (seller === undefined && box === undefined)) {
    throw new Error(
      "Dispute checks need DATABASE_URL and the PayPal seller app's keys or SELLER_KEYS_ENCRYPTION_KEY",
    );
  }
  const notices =
    config.email && config.publicBaseUrl !== undefined && wiring.emailFor
      ? { email: wiring.emailFor(config.email), publicBaseUrl: config.publicBaseUrl }
      : undefined;
  if (!notices) wiring.log.info({}, "Dispute emails are off (no email settings or site address)");
  return withDatabase(config.database.url, wiring, (db) =>
    syncDisputes(
      {
        db,
        ...(seller ? { disputes: wiring.disputesFor(seller) } : {}),
        ...(box
          ? {
              linkedAccounts: () =>
                linkedDisputeAccounts(db, new LinkedApps(db, box.box, box.connect)),
            }
          : {}),
        clock: wiring.clock,
        newId: wiring.newId,
        log: wiring.log,
        ...(notices ? { notices } : {}),
      },
      source,
    ),
  );
}

/** The settings, or an error naming the wrong ones (never their values). */
function settings(env: NodeJS.ProcessEnv) {
  const loaded = loadConfig(env);
  if (!loaded.ok) throw new Error(formatErrors(loaded.errors));
  return loaded.config;
}

/**
 * Connects, checks that the database has every migration (the workflow service deploys apart
 * from the website, whose deploy runs them), does the work and disconnects.
 */
async function withDatabase<T>(
  url: Secret,
  wiring: Pick<TaskWiring, "connect">,
  work: (db: Database) => Promise<T>,
): Promise<T> {
  const db = wiring.connect(url.reveal());
  try {
    const status = await migrationStatus(db, MIGRATIONS);
    if (!status.upToDate) {
      throw new Error("The database is waiting for migrations; try again later");
    }
    return await work(db);
  } finally {
    await db.close();
  }
}

/**
 * One run of the Render Workflow task `analyze-claim` (5d): compares one dispute claim with the
 * record, with every AI model whose key is set. The job itself never throws; settings or the
 * database being out of reach do, so Render retries the run.
 */
export async function runClaimTask(
  env: NodeJS.ProcessEnv,
  input: unknown,
  wiring: Pick<TaskWiring, "connect" | "clock" | "log"> & {
    clientsFor: (keys: Readonly<Record<string, Secret>>) => ChatClient[];
  },
): Promise<void> {
  const analysisId = z.uuid().parse(input);
  const config = settings(env);
  if (config.database === undefined) throw new Error("Claim comparisons need DATABASE_URL");
  await withDatabase(config.database.url, wiring, (db) =>
    runDisputeJob(
      {
        db,
        clients: wiring.clientsFor(config.ai.keys),
        council: cryptoCouncilDeps(),
        clock: wiring.clock,
        log: wiring.log,
      },
      analysisId,
    ),
  );
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
