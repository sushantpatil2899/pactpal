import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { connectPostgres, recordWebhookEvent } from "@pactpal/db";
import {
  AccessTokenProvider,
  PayPalLogin,
  PayPalRestClient,
  PayPalWebhooks,
} from "@pactpal/paypal";
import { buildApp, closeOnSignals } from "./app.js";
import { formatErrors, loadConfig } from "./config.js";

const result = loadConfig(process.env);
if (!result.ok) {
  // The logger lives on the app, which cannot be built without valid settings.
  process.stderr.write(formatErrors(result.errors));
  process.exit(1);
}

const { config, report } = result;
const seller = config.paypal.apps.seller;
const database =
  config.database &&
  connectPostgres({
    url: config.database.url.reveal(),
    // Like the settings errors above, written before the logger exists; the message holds no secrets.
    onError: (error) => process.stderr.write(`database connection error: ${error.message}\n`),
  });
// The built web app sits two folders up from both src/ and dist/ (apps/web/dist).
const webDir = fileURLToPath(new URL("../../web/dist/", import.meta.url));
const app = buildApp(report, {
  database,
  webDir: existsSync(webDir) ? webDir : undefined,
  signIn: {
    // The seller app stands in for PactPal's own PayPal app until Phase 6.
    login: seller && new PayPalLogin(seller),
    database,
    publicBaseUrl: config.publicBaseUrl,
    clock: () => new Date(),
    newId: randomUUID,
  },
  webhooks: {
    verifier: seller && new PayPalWebhooks(new PayPalRestClient(new AccessTokenProvider(seller))),
    webhookId: config.paypal.webhookId,
    events: database && {
      record: (event) => recordWebhookEvent(database, event, new Date()),
    },
  },
});

if (!existsSync(webDir)) app.log.warn("Web pages not built; serving the server's routes only");
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
