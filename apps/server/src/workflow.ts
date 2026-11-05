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
import { DISPUTE_TASK_NAME, jsonLines, runDisputeTask } from "./disputes/task.js";

const log = jsonLines((line) => process.stdout.write(line));

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
      connect: (url) =>
        connectPostgres({
          url,
          onError: (error) => {
            log.error({ err: error.name }, "database connection error");
          },
        }),
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
