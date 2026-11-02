import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { MODEL_REGISTRY } from "@pactpal/ai";
import { connectPostgres, failRunningDrafts, recordWebhookEvent } from "@pactpal/db";
import {
  AccessTokenProvider,
  McpFallback,
  PayPalInvoices,
  PayPalLogin,
  PayPalRestClient,
  PayPalWebhooks,
} from "@pactpal/paypal";
import { ResendEmailSender } from "@pactpal/email";
import { buildApp, closeOnSignals } from "./app.js";
import { councilClients, createDraftingRuntime } from "./drafting/runtime.js";
import { formatErrors, loadConfig } from "./config.js";

const result = loadConfig(process.env);
if (!result.ok) {
  // The logger lives on the app, which cannot be built without valid settings.
  process.stderr.write(formatErrors(result.errors));
  process.exit(1);
}

const { config, report } = result;
const seller = config.paypal.apps.seller;
// One login per seller app, shared by webhook checks and invoices.
const sellerRest = seller && new PayPalRestClient(new AccessTokenProvider(seller));
const database =
  config.database &&
  connectPostgres({
    url: config.database.url.reveal(),
    // Like the settings errors above, written before the logger exists; the message holds no secrets.
    onError: (error) => process.stderr.write(`database connection error: ${error.message}\n`),
  });
// The built web app sits two folders up from both src/ and dist/ (apps/web/dist).
const webDir = fileURLToPath(new URL("../../web/dist/", import.meta.url));
// Every model whose key is set takes part in the council; with none, drafting answers "unavailable".
const members = councilClients(config.ai.keys);
const app = buildApp(report, {
  database,
  drafting:
    database && members.length > 0 ? createDraftingRuntime({ clients: members }) : undefined,
  webDir: existsSync(webDir) ? webDir : undefined,
  // Invoices go over REST only: PayPal's MCP tool takes no request id, so a retry could create a
  // second invoice (docs/decisions.md, 4d). No MCP client means McpFallback goes straight to REST.
  ...(sellerRest ? { invoices: new PayPalInvoices(sellerRest, undefined, new McpFallback()) } : {}),
  // Without Resend's key and a sender the app uses its stand-in, which sends nothing.
  ...(config.email ? { email: new ResendEmailSender(config.email) } : {}),
  ...(config.trustProxyHops === undefined ? {} : { trustProxyHops: config.trustProxyHops }),
  signIn: {
    // The seller app stands in for PactPal's own PayPal app until Phase 6.
    login: seller && new PayPalLogin(seller),
    database,
    publicBaseUrl: config.publicBaseUrl,
    clock: () => new Date(),
    newId: randomUUID,
  },
  webhooks: {
    verifier: sellerRest && new PayPalWebhooks(sellerRest),
    webhookId: config.paypal.webhookId,
    events: database && {
      record: (event) => recordWebhookEvent(database, event, new Date()),
    },
  },
});

if (!existsSync(webDir)) app.log.warn("Web pages not built; serving the server's routes only");
app.log.info(
  `AI models ready for scope drafting: ${String(members.length)} of ${String(MODEL_REGISTRY.length)}`,
);
// No draft job survives a restart (one server instance), so a draft still "running" was cut off.
if (database) {
  try {
    const interrupted = await failRunningDrafts(database, "interrupted by a restart", new Date());
    if (interrupted > 0)
      app.log.warn(`${String(interrupted)} running draft(s) marked as interrupted`);
  } catch (error) {
    // Like /health, the server stays up while the database is unreachable.
    app.log.warn(
      { err: error instanceof Error ? error.name : "unknown" },
      "Could not sweep interrupted drafts",
    );
  }
}
for (const feature of report.features) {
  if (feature.missing.length > 0) {
    app.log.warn(`${feature.name} not ready: missing ${feature.missing.join(", ")}`);
  }
}

closeOnSignals(app, process, (code) => process.exit(code));

try {
  await app.listen({ port: config.port, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
