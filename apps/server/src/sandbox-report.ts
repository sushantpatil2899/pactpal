import { grantedFeatures, type AccessToken } from "@pactpal/paypal";
import { APP_KEYS, type PayPalApp } from "./config.js";
import { rows } from "./format.js";

const APP_LABELS: Record<PayPalApp, string> = {
  seller: "Seller app",
  buyerBiz: "Buyer business app",
  platform: "Platform app",
};

/** Outcome of logging in with one app. */
export type LoginCheck =
  | { status: "ok"; token: Pick<AccessToken, "expiresAt" | "scopes" | "appId"> }
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
      const hours = ((expiresAt - now) / HOUR_MS).toFixed(1);
      const title = appId === undefined ? APP_LABELS[app] : `${APP_LABELS[app]} (${appId})`;
      const features = grantedFeatures(scopes).map(({ feature, granted }): [string, string] => [
        feature,
        granted ? "yes" : "no",
      ]);
      const permissions = scopes.map((scope) => `    ${scope}\n`).join("");
      return (
        `${title}\n` +
        rows([["Login", `ok, token valid for ${hours} hours`], ...features]) +
        `  Permissions (${scopes.length})\n${permissions}`
      );
    }
  }
}

/** Plain-text report of each app's login and permissions. Never shows keys or tokens. */
export function formatSandboxReport(checks: Record<PayPalApp, LoginCheck>, now: number): string {
  return APP_KEYS.map((app) => appSection(app, checks[app], now)).join("\n");
}
