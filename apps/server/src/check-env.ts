/** `pnpm env:check`: shows which settings are set and which features are ready, never the values. */
import { formatErrors, formatReport, loadConfig } from "./config.js";

const result = loadConfig(process.env);
if (result.ok) {
  process.stdout.write(formatReport(result.report));
} else {
  process.stderr.write(formatErrors(result.errors));
  process.exitCode = 1;
}
