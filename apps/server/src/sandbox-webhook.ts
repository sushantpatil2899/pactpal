/**
 * `pnpm sandbox:webhook`: lists, registers or removes the seller app's (or with
 * --app platform, the platform app's) PayPal
 * notification addresses, or shows PayPal's record of recent notifications.
 * Registering and removing are dry runs unless --send is given.
 */
import { randomUUID } from "node:crypto";
import { PayPalWebhooks } from "@pactpal/paypal";
import { appClients, fail } from "./sandbox-clients.js";
import {
  USAGE,
  formatEvents,
  formatPreview,
  formatRegistered,
  formatRegistrations,
  parseWebhookArgs,
} from "./sandbox-webhook-report.js";

const parsed = parseWebhookArgs(process.argv.slice(2));
if (!parsed.ok) fail(`${parsed.error}\n${USAGE}`);
const task = parsed.value;

const { rest, mcp } = appClients(task.app);
const webhooks = new PayPalWebhooks(rest);
const requestId = `sandbox-webhook-${randomUUID()}`;
try {
  switch (task.kind) {
    case "list":
      process.stdout.write(formatRegistrations(await webhooks.list()));
      break;
    case "events":
      process.stdout.write(formatEvents(await webhooks.recentEvents()));
      break;
    case "register":
      process.stdout.write(
        task.send
          ? formatRegistered(await webhooks.register(task.url, requestId), task.app)
          : formatPreview(task),
      );
      break;
    case "delete":
      if (task.send) {
        await webhooks.remove(task.webhookId, requestId);
        process.stdout.write(`Removed webhook ${task.webhookId}\n`);
      } else {
        process.stdout.write(formatPreview(task));
      }
      break;
  }
} catch (error) {
  process.exitCode = 1;
  process.stderr.write(`${String(error)}\n`);
} finally {
  await mcp.close();
}
