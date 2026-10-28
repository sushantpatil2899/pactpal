/** `pnpm sandbox:check`: logs in to the PayPal sandbox with each configured app and reports its permissions. */
import { AccessTokenProvider, PayPalMcpClient } from "@pactpal/paypal";
import { APP_KEYS, formatErrors, loadConfig } from "./config.js";
import {
  MCP_TEST_TOOL,
  formatSandboxReport,
  type LoginCheck,
  type McpCheck,
} from "./sandbox-report.js";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** Connects to PayPal's MCP server, counts its tools and makes one read-only call. */
async function checkMcp(tokens: AccessTokenProvider): Promise<McpCheck> {
  const mcp = new PayPalMcpClient(tokens);
  try {
    const tools = (await mcp.listTools()).length;
    try {
      await mcp.callTool(MCP_TEST_TOOL, { page: 1, page_size: 1 });
      return { connected: true, tools, testCall: { ok: true } };
    } catch (error) {
      return { connected: true, tools, testCall: { ok: false, error: message(error) } };
    }
  } catch (error) {
    return { connected: false, error: message(error) };
  } finally {
    await mcp.close();
  }
}

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
      const tokens = new AccessTokenProvider(credentials);
      try {
        const token = await tokens.get();
        return [app, { status: "ok", token, mcp: await checkMcp(tokens) }];
      } catch (error) {
        return [app, { status: "failed", error: String(error) }];
      }
    }),
  ),
) as Record<(typeof APP_KEYS)[number], LoginCheck>;

process.stdout.write(formatSandboxReport(checks, Date.now()));
if (Object.values(checks).some((check) => check.status === "failed")) process.exitCode = 1;
