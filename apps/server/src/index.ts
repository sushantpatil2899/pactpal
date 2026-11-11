import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { MODEL_REGISTRY } from "@pactpal/ai";
import {
  failRunningDrafts,
  failRunningMessageReviews,
  forwardInterruptedQuestions,
} from "@pactpal/db";
import { closeOnSignals } from "./app.js";
import { formatErrors, loadConfig } from "./config.js";
import { productionApp } from "./production-app.js";

const result = loadConfig(process.env);
if (!result.ok) {
  // The logger lives on the app, which cannot be built without valid settings.
  process.stderr.write(formatErrors(result.errors));
  process.exit(1);
}

const { config, report } = result;
// The built web app sits two folders up from both src/ and dist/ (apps/web/dist).
const webDir = fileURLToPath(new URL("../../web/dist/", import.meta.url));
const { app, database, members } = await productionApp(config, report, webDir);

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
    const reviews = await failRunningMessageReviews(
      database,
      "interrupted by a restart",
      new Date(),
    );
    if (reviews > 0)
      app.log.warn(`${String(reviews)} running message review(s) marked as interrupted`);
    // Likewise a buyer's question still being answered goes to the seller.
    const forwarded = await forwardInterruptedQuestions(database, new Date());
    if (forwarded > 0)
      app.log.warn(`${String(forwarded)} interrupted question(s) sent to the seller`);
  } catch (error) {
    // Like /health, the server stays up while the database is unreachable.
    app.log.warn(
      { err: error instanceof Error ? error.name : "unknown" },
      "Could not sweep interrupted drafts and questions",
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
