/**
 * The Render Workflow service (`node apps/server/dist/workflow.js`): registers PactPal's tasks.
 * Render's SDK starts serving them by itself once this file has run (RENDER_SDK_SOCKET_PATH).
 */
import { randomUUID } from "node:crypto";
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
  SUMMARY_TASK_NAME,
} from "./disputes/claim-job.js";
import { DISPUTE_TASK_NAME, jsonLines, runClaimTask, runDisputeTask } from "./disputes/task.js";
import { councilClients } from "./drafting/runtime.js";

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
      clock: () => new Date(),
      newId: randomUUID,
      log,
    }),
);

// The claim comparison (5d) and the packet summary (5f) are both dispute council jobs: the same
// handler reads the job's kind. A council takes about a minute and a few minutes at worst (each
// model call has its own limits). The job never throws for a model failure, so a retry only
// follows a crash or a lost database.
for (const name of [CLAIM_TASK_NAME, SUMMARY_TASK_NAME, RESPONSE_TASK_NAME, APPEAL_TASK_NAME]) {
  task(
    {
      name,
      timeoutSeconds: 600,
      retry: { maxRetries: 1, waitDurationMs: 10_000, backoffScaling: 2 },
    },
    (_context, analysisId: unknown) =>
      runClaimTask(process.env, analysisId, {
        connect,
        clientsFor: councilClients,
        clock: () => new Date(),
        log,
      }),
  );
}
