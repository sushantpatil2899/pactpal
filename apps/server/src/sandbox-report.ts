import { grantedFeatures, type AccessToken } from "@pactpal/paypal";
import { APP_KEYS, type PayPalApp } from "./config.js";
import { rows } from "./format.js";

const APP_LABELS: Record<PayPalApp, string> = {
  seller: "Seller app",
  buyerBiz: "Buyer business app",
  platform: "Platform app",
};

/** The read-only test call made through PayPal's MCP server. */
export const MCP_TEST_TOOL = "list_invoices";

/** Outcome of connecting to PayPal's MCP server with one app; errors are message text. */
export type McpCheck =
  | { connected: false; error: string }
  | { connected: true; tools: number; testCall: { ok: true } | { ok: false; error: string } };

/** Outcome of logging in with one app. */
export type LoginCheck =
  | { status: "ok"; token: Pick<AccessToken, "expiresAt" | "scopes" | "appId">; mcp: McpCheck }
  | { status: "failed"; error: string }
  | { status: "skipped" };

const HOUR_MS = 3_600_000;

function appSection(app: PayPalApp, check: LoginCheck, now: number): string {
  switch (check.status) {
    case "skipped":
      return `${APP_LABELS[app]}\n${rows([["Login", "skipped: keys not set"]])}`;
    case "failed":
      return `${APP_LABELS[app]}\n${rows([["Login", `failed: ${check.error}`]])}`;
    case "ok": {
      const { expiresAt, scopes, appId } = check.token;
      const { mcp } = check;
      const hours = ((expiresAt - now) / HOUR_MS).toFixed(1);
      const title = appId === undefined ? APP_LABELS[app] : `${APP_LABELS[app]} (${appId})`;
      const features = grantedFeatures(scopes).map(({ feature, granted }): [string, string] => [
        feature,
        granted ? "yes" : "no",
      ]);
      const permissions = scopes.map((scope) => `    ${scope}\n`).join("");
      return (
        `${title}\n` +
        rows([
          ["Login", `ok, token valid for ${hours} hours`],
          ...features,
          ["MCP connection", mcp.connected ? `ok, ${mcp.tools} tools` : `failed: ${mcp.error}`],
          ...(mcp.connected
            ? [
                [
                  `MCP ${MCP_TEST_TOOL}`,
                  mcp.testCall.ok ? "ok" : `failed: ${mcp.testCall.error}`,
                ] as [string, string],
              ]
            : []),
        ]) +
        `  Permissions (${scopes.length})\n${permissions}`
      );
    }
  }
}

/** Plain-text report of each app's login and permissions. Never shows keys or tokens. */
export function formatSandboxReport(checks: Record<PayPalApp, LoginCheck>, now: number): string {
  return APP_KEYS.map((app) => appSection(app, checks[app], now)).join("\n");
}
