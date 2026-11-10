import {
  DISPUTE_CHECK_SOURCES,
  MIGRATIONS,
  failDraft,
  getDeal,
  getDraft,
  migrationStatus,
  postgresContentStore,
  runRetentionSweep,
  type Database,
  type DisputeCheckResult,
} from "@pactpal/db";
import type { ChatClient, ChatOutcome } from "@pactpal/ai";
import { StandInEmailSender, type EmailSender } from "@pactpal/email";
import type { PayPalAppCredentials } from "@pactpal/paypal";
import type { Secret } from "@pactpal/net";
import { createDraftingRuntime, cryptoCouncilDeps } from "../drafting/runtime.js";
import { runDraftJob } from "../drafting/draft-job.js";
import { numberedChat } from "../drafting/draft-source.js";
import { askModel } from "../drafting/subtask-clients.js";
import { runDisputeJob } from "./claim-job.js";
import { z } from "zod";
import { formatErrors, loadConfig, type Config } from "../config.js";
import type { LogSink } from "../payments/payment-sync.js";
import { renderWorkflowChecker, startRun, type TaskStarter } from "./checker.js";
import { syncDisputes, type DisputeReader } from "./dispute-sync.js";
import { LinkedApps, linkedDisputeAccounts, type ConnectApp } from "../sellers/linked-apps.js";
import { sellerKeyBox } from "../sellers/key-box.js";
import { publishingBus } from "../chat/bus.js";
import { sendTimelineReminders } from "../chat/reminders.js";

/** The Render Workflow task's name; the website and the cron start it as `<workflow>/<name>`. */
export const DISPUTE_TASK_NAME = "check-disputes";

/** The retention clean-up's Workflow task (9c), started once a day by its Cron Job. */
export const RETENTION_TASK_NAME = "retention-sweep";

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
  return withDatabase(config.database.url, wiring, async (db) => {
    const result = await syncDisputes(
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
    );
    // Timeline reminders (7l) ride on the same 5-minute run; they never fail the dispute check.
    await sendTimelineReminders({
      db,
      bus: publishingBus(db),
      email: notices?.email ?? new StandInEmailSender(wiring.log),
      publicBaseUrl: config.publicBaseUrl,
      clock: wiring.clock,
      newId: wiring.newId,
      log: wiring.log,
    }).catch((error: unknown) => {
      wiring.log.error(
        { err: error instanceof Error ? error.name : "unknown" },
        "Timeline reminders failed",
      );
    });
    return result;
  });
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

/** The council members for the AI keys that are set (on Render: each call its own run, 9R-1). */
export type ClientsFor = (keys: Readonly<Record<string, Secret>>) => ChatClient[];

/** What a council task is wired with. */
export type CouncilTaskWiring = Pick<TaskWiring, "connect" | "clock" | "log"> & {
  clientsFor: ClientsFor;
};

/**
 * One run of the Render Workflow task `analyze-claim` (5d): compares one dispute claim with the
 * record, with every AI model whose key is set. The job itself never throws; settings or the
 * database being out of reach do, so Render retries the run.
 */
export async function runClaimTask(
  env: NodeJS.ProcessEnv,
  input: unknown,
  wiring: CouncilTaskWiring,
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

/** The Render Workflow tasks for scope drafts (9R-1) and for one model call of any council. */
export const DRAFT_TASK_NAME = "draft-scope";
export const ASK_MODEL_TASK_NAME = "ask-model";

/** One model call in its own task run (9R-1): the council members whose keys are set here. */
export function runAskModel(
  env: NodeJS.ProcessEnv,
  modelName: unknown,
  request: unknown,
  clientsFor: ClientsFor,
): Promise<ChatOutcome> {
  return askModel(clientsFor(settings(env).ai.keys), modelName, request);
}

/**
 * One scope draft run as a Render Workflow task (9R-1): reads the waiting draft, its deal and the
 * chat it is made from (checked against its fingerprint), then runs the same job as the website.
 * A draft that is gone or no longer waiting is left alone; an unreadable chat fails the draft.
 */
export async function runDraftTask(
  env: NodeJS.ProcessEnv,
  input: unknown,
  wiring: CouncilTaskWiring,
): Promise<void> {
  const { dealId, draftId } = z.object({ dealId: z.uuid(), draftId: z.uuid() }).parse(input);
  const config = settings(env);
  if (config.database === undefined) throw new Error("Scope drafts need DATABASE_URL");
  await withDatabase(config.database.url, wiring, async (db) => {
    const [draft, deal] = await Promise.all([getDraft(db, dealId, draftId), getDeal(db, dealId)]);
    if (draft?.status !== "running" || deal === undefined) {
      wiring.log.info({ dealId, draftId }, "Draft task found nothing waiting");
      return;
    }
    const store = postgresContentStore(db, wiring.clock);
    const lines = await numberedChat({ db, deal }, draft, store, wiring.log);
    if (lines === null) {
      await failDraft(db, { draftId, reason: "the chat could not be read" }, wiring.clock());
      return;
    }
    await runDraftJob(
      db,
      createDraftingRuntime({ clients: wiring.clientsFor(config.ai.keys) }),
      {
        draftId,
        deal,
        sellerId: draft.createdBy,
        source: { artifactId: draft.sourceArtifactId, sha256: draft.sourceSha256, lines },
      },
      wiring.clock,
      wiring.log,
    );
  });
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

/**
 * One run of the retention clean-up (9c): removes what is past its keeping time (docs/privacy.md)
 * and logs the counts and the ids of deals that could not be removed (never their contents).
 * `{ dryRun: true }` only counts.
 */
export async function runRetentionTask(
  env: NodeJS.ProcessEnv,
  input: unknown,
  wiring: Pick<TaskWiring, "connect" | "clock" | "newId" | "log">,
) {
  const { dryRun } = z.object({ dryRun: z.boolean().default(false) }).parse(input ?? {});
  const config = settings(env);
  if (config.database === undefined) throw new Error("The retention clean-up needs DATABASE_URL");
  return withDatabase(config.database.url, wiring, async (db) => {
    const { counts, failedDeals } = await runRetentionSweep(db, {
      now: wiring.clock(),
      runId: wiring.newId(),
      dryRun,
    });
    // A deal that failed stays whole and is tried again tomorrow; a retry now would redo the rest.
    if (failedDeals.length > 0) {
      wiring.log.error({ failedDeals }, "Some deals could not be removed");
    }
    wiring.log.info({ ...counts, dryRun }, "Retention clean-up finished");
    return counts;
  });
}

/** The daily Cron Job: starts one retention clean-up run, at most once a day. */
export async function startScheduledRetention(
  env: NodeJS.ProcessEnv,
  starterFor: (apiKey: string) => TaskStarter,
  wiring: Pick<TaskWiring, "clock" | "log">,
): Promise<boolean> {
  const retention = settings(env).retention;
  if (retention === undefined) {
    wiring.log.error({}, "The retention clean-up needs RENDER_API_KEY and RETENTION_TASK_SLUG");
    return false;
  }
  const day = wiring.clock().toISOString().slice(0, 10);
  await startRun(starterFor(retention.apiKey.reveal()), wiring.log, {
    taskSlug: retention.taskSlug,
    input: { dryRun: false },
    key: `retention:${day}`,
    ids: { day },
    what: "Retention clean-up",
  });
  return true;
}
