/**
 * The Render Workflow service (`node apps/server/dist/workflow.js`): registers PactPal's tasks.
 * Render's SDK starts serving them by itself once this file has run (RENDER_SDK_SOCKET_PATH).
 */
import { randomUUID } from "node:crypto";
import { ResendEmailSender } from "@pactpal/email";
import { connectPostgres } from "@pactpal/db";
import {
  AccessTokenProvider,
  McpFallback,
  PayPalDisputes,
  PayPalRestClient,
} from "@pactpal/paypal";
import { task } from "@renderinc/sdk/workflows";
import {
  APPEAL_TASK_NAME,
  CLAIM_TASK_NAME,
  RESPONSE_TASK_NAME,
  STATEMENT_TASK_NAME,
  SUMMARY_TASK_NAME,
} from "./disputes/claim-job.js";
import {
  ASK_MODEL_TASK_NAME,
  DISPUTE_TASK_NAME,
  DRAFT_TASK_NAME,
  RETENTION_TASK_NAME,
  jsonLines,
  runAskModel,
  runClaimTask,
  runDisputeTask,
  runDraftTask,
  runRetentionTask,
} from "./disputes/task.js";
import { councilClients } from "./drafting/runtime.js";
import { subtaskClients } from "./drafting/subtask-clients.js";
import { connectOwnApp } from "./sellers/connect-app.js";
import { SEED_TASK_NAME, runSeedTask } from "./demo/seed.js";
import { formatErrors, loadConfig } from "./config.js";
import { productionApp } from "./production-app.js";
import type { Secret } from "@pactpal/net";

const log = jsonLines((line) => process.stdout.write(line));
const connect = (url: string) =>
  connectPostgres({
    url,
    onError: (error) => {
      log.error({ err: error.name }, "database connection error");
    },
  });

task(
  // Two minutes is plenty for one check; a failed run (PayPal or the database down) is tried
  // twice more, 5 then 10 seconds later.
  {
    name: DISPUTE_TASK_NAME,
    timeoutSeconds: 120,
    retry: { maxRetries: 2, waitDurationMs: 5_000, backoffScaling: 2 },
  },
  (_context, source: unknown) =>
    runDisputeTask(process.env, source, {
      connect,
      // Reads go over REST, like invoices: PayPal's hosted MCP still fails every call.
      disputesFor: (seller) =>
        new PayPalDisputes(
          new PayPalRestClient(new AccessTokenProvider(seller)),
          undefined,
          new McpFallback(),
        ),
      // Sellers' own linked apps are checked too (6h-5), with SELLER_KEYS_ENCRYPTION_KEY.
      connectApp: connectOwnApp,
      clock: () => new Date(),
      newId: randomUUID,
      log,
      // The seller's dispute emails (5j) go through Resend when the email settings are set here.
      emailFor: (settings) => new ResendEmailSender(settings),
    }),
);

// One model call of any council, in its own run (9R-1): Render shows each model's answer and
// ranking as a run of its own, side by side, under the council's run. Each client already retries
// its host, so the task itself does not.
const askModelTask = task(
  { name: ASK_MODEL_TASK_NAME, timeoutSeconds: 150 },
  (_context, modelName: unknown, request: unknown) =>
    runAskModel(process.env, modelName, request, councilClients),
);

/** What a task's handler is given to start other tasks (the SDK does not export its name). */
type TaskContext = Parameters<Parameters<typeof task>[1]>[0];

/** The council members whose keys are set, each answering through its own `ask-model` run. */
const membersFor = (context: TaskContext) => (keys: Readonly<Record<string, Secret>>) =>
  subtaskClients(
    councilClients(keys).map((client) => client.spec),
    (name, request) => context.run(askModelTask, name, request),
  );

// A scope draft (3d, 7h, 9R-1): the drafting council, started by the website for one draft.
task(
  {
    name: DRAFT_TASK_NAME,
    timeoutSeconds: 600,
    retry: { maxRetries: 1, waitDurationMs: 10_000, backoffScaling: 2 },
  },
  (context, input: unknown) =>
    runDraftTask(process.env, input, {
      connect,
      clientsFor: membersFor(context),
      clock: () => new Date(),
      log,
    }),
);

// The claim comparison (5d) and the packet summary (5f) are both dispute council jobs: the same
// handler reads the job's kind. A council takes about a minute and a few minutes at worst (each
// model call has its own limits). The job never throws for a model failure, so a retry only
// follows a crash or a lost database.
for (const name of [
  CLAIM_TASK_NAME,
  SUMMARY_TASK_NAME,
  RESPONSE_TASK_NAME,
  APPEAL_TASK_NAME,
  STATEMENT_TASK_NAME,
]) {
  task(
    {
      name,
      timeoutSeconds: 600,
      retry: { maxRetries: 1, waitDurationMs: 10_000, backoffScaling: 2 },
    },
    (context, analysisId: unknown) =>
      runClaimTask(process.env, analysisId, {
        connect,
        clientsFor: membersFor(context),
        clock: () => new Date(),
        log,
      }),
  );
}

task(
  // The daily retention clean-up (9c): up to 200 deals a run, each in seconds. One retry, a
  // minute later, if the database was down; a deal that fails is tried again the next day.
  {
    name: RETENTION_TASK_NAME,
    timeoutSeconds: 600,
    retry: { maxRetries: 1, waitDurationMs: 60_000, backoffScaling: 1 },
  },
  (_context, input: unknown) =>
    runRetentionTask(process.env, input, {
      connect,
      clock: () => new Date(),
      newId: randomUUID,
      log,
    }),
);

task(
  // The demo seed (9b-2): plays the people of one demo story through the website's own routes.
  // Started by hand; a run stops for a person (a sandbox payment, a dispute) and the next run
  // carries on, so it is never retried automatically.
  { name: SEED_TASK_NAME, timeoutSeconds: 1800 },
  (_context, input: unknown) =>
    runSeedTask(input, {
      app: async () => {
        const loaded = loadConfig(process.env);
        if (!loaded.ok) throw new Error(formatErrors(loaded.errors));
        return productionApp(loaded.config, loaded.report, "");
      },
      clock: () => new Date(),
      sleep: (ms) => new Promise((done) => setTimeout(done, ms)),
      log,
    }),
);
