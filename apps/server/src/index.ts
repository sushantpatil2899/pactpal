import { buildApp } from "./app.js";
import { loadConfig } from "./config.js";

const config = loadConfig();
const app = buildApp(config);

if (config.missing.length > 0) {
  app.log.warn(`Missing environment variables: ${config.missing.join(", ")}`);
}

try {
  await app.listen({ port: config.port, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
