/** `pnpm sandbox:check`: logs in to the PayPal sandbox with each configured app and reports its permissions. */
import { AccessTokenProvider } from "@pactpal/paypal";
import { APP_KEYS, formatErrors, loadConfig } from "./config.js";
import { formatSandboxReport, type LoginCheck } from "./sandbox-report.js";

const result = loadConfig(process.env);
if (!result.ok) {
  process.stderr.write(formatErrors(result.errors));
  process.exit(1);
}

const { apps } = result.config.paypal;
const checks = Object.fromEntries(
  await Promise.all(
    APP_KEYS.map(async (app): Promise<[string, LoginCheck]> => {
      const credentials = apps[app];
      if (credentials === undefined) return [app, { status: "skipped" }];
      try {
        return [app, { status: "ok", token: await new AccessTokenProvider(credentials).get() }];
      } catch (error) {
        return [app, { status: "failed", error: String(error) }];
      }
    }),
  ),
) as Record<(typeof APP_KEYS)[number], LoginCheck>;

process.stdout.write(formatSandboxReport(checks, Date.now()));
if (Object.values(checks).some((check) => check.status === "failed")) process.exitCode = 1;
