import { AccessTokenProvider, PayPalRestClient, PayPalWebhooks } from "@pactpal/paypal";
import { buildApp, closeOnSignals } from "./app.js";
import { formatErrors, loadConfig } from "./config.js";
import { MemorySeenEvents } from "./webhooks/seen-events.js";

const result = loadConfig(process.env);
if (!result.ok) {
  // The logger lives on the app, which cannot be built without valid settings.
  process.stderr.write(formatErrors(result.errors));
  process.exit(1);
}

const { config, report } = result;
const seller = config.paypal.apps.seller;
const app = buildApp(report, {
  webhooks: {
    verifier: seller && new PayPalWebhooks(new PayPalRestClient(new AccessTokenProvider(seller))),
    webhookId: config.paypal.webhookId,
    seen: new MemorySeenEvents(),
  },
});

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
