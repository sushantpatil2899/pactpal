import { Secret, type PayPalAppCredentials } from "@pactpal/paypal";
import { z } from "zod";
import { rows } from "./format.js";

/**
 * Environment settings, read and checked once at startup.
 *
 * Wrong values (bad port, a value with spaces or quote marks, an app id
 * without its secret) fail the whole load. Missing values only mark the
 * features that need them as not ready, so the server can run before every
 * key is added. Messages name variables, never their values.
 */

/** PayPal sandbox REST apps, by the prefix of their `_CLIENT_ID` / `_CLIENT_SECRET` variables. */
const PAYPAL_APPS = {
  seller: "PAYPAL_SELLER",
  buyerBiz: "PAYPAL_BUYER_BIZ",
  platform: "PAYPAL_PLATFORM",
} as const;

export type PayPalApp = keyof typeof PAYPAL_APPS;
type Part = PayPalApp | "webhook";

const WEBHOOK_ID = "PAYPAL_WEBHOOK_ID";
const DEFAULT_PORT = 3000;

function appVars(app: PayPalApp): { id: string; secret: string } {
  const prefix = PAYPAL_APPS[app];
  return { id: `${prefix}_CLIENT_ID`, secret: `${prefix}_CLIENT_SECRET` };
}

function partVars(part: Part): string[] {
  if (part === "webhook") return [WEBHOOK_ID];
  const { id, secret } = appVars(part);
  return [id, secret];
}

/** Every PayPal app PactPal uses, in report order. */
export const APP_KEYS = Object.keys(PAYPAL_APPS) as PayPalApp[];

/** Every setting in report order. */
export const SETTING_NAMES: readonly string[] = [...APP_KEYS, "webhook" as const].flatMap(partVars);

/** What each feature needs before it can run. */
export const FEATURES: readonly { name: string; needs: readonly Part[] }[] = [
  { name: "Invoices and disputes (seller app)", needs: ["seller"] },
  { name: "Webhooks", needs: ["seller", "webhook"] },
  { name: "Test setup script", needs: ["seller", "buyerBiz"] },
  { name: "Connect with PayPal tests", needs: ["platform"] },
];

/** The setting names a feature needs, e.g. "Webhooks" -> seller app keys and webhook id. */
export function settingsFor(featureName: string): string[] {
  return FEATURES.find(({ name }) => name === featureName)?.needs.flatMap(partVars) ?? [];
}

// PayPal ids, secrets and webhook ids never contain spaces; quotes usually come from copy-paste.
const settingValue = z
  .string()
  .regex(/^\S+$/, "contains spaces or line breaks")
  .refine((value) => !/^["']|["']$/.test(value), "is wrapped in quote marks");

const portValue = z
  .string()
  .regex(/^\d+$/)
  .transform(Number)
  .refine((port) => port >= 1 && port <= 65535);

export interface Config {
  port: number;
  paypal: {
    /** Only apps whose id and secret are both set. */
    apps: Partial<Record<PayPalApp, PayPalAppCredentials>>;
    webhookId?: string;
  };
}

export interface ConfigReport {
  settings: { name: string; set: boolean }[];
  features: { name: string; missing: string[] }[];
}

export type LoadConfigResult =
  { ok: true; config: Config; report: ConfigReport } | { ok: false; errors: string[] };

const isPresent = (value: string | undefined): value is string =>
  value !== undefined && value !== "";

export function loadConfig(env: NodeJS.ProcessEnv): LoadConfigResult {
  const errors: string[] = [];

  let port = DEFAULT_PORT;
  if (isPresent(env.PORT)) {
    const parsed = portValue.safeParse(env.PORT);
    if (parsed.success) port = parsed.data;
    else errors.push("PORT must be a whole number from 1 to 65535");
  }

  const values = new Map<string, string>();
  for (const name of SETTING_NAMES) {
    const raw = env[name];
    if (!isPresent(raw)) continue;
    const parsed = settingValue.safeParse(raw);
    if (parsed.success) values.set(name, parsed.data);
    else errors.push(`${name} ${parsed.error.issues.map((issue) => issue.message).join(", ")}`);
  }

  for (const app of APP_KEYS) {
    const { id, secret } = appVars(app);
    if (isPresent(env[id]) !== isPresent(env[secret])) {
      const [set, unset] = isPresent(env[id]) ? [id, secret] : [secret, id];
      errors.push(`${set} is set but ${unset} is missing; set both or neither`);
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  const apps: Config["paypal"]["apps"] = {};
  for (const app of APP_KEYS) {
    const { id, secret } = appVars(app);
    const clientId = values.get(id);
    const clientSecret = values.get(secret);
    if (clientId !== undefined && clientSecret !== undefined) {
      apps[app] = { clientId, clientSecret: new Secret(clientSecret) };
    }
  }
  const webhookId = values.get(WEBHOOK_ID);

  const report: ConfigReport = {
    settings: SETTING_NAMES.map((name) => ({ name, set: values.has(name) })),
    features: FEATURES.map(({ name, needs }) => ({
      name,
      missing: needs.flatMap(partVars).filter((variable) => !values.has(variable)),
    })),
  };

  return {
    ok: true,
    config: { port, paypal: webhookId === undefined ? { apps } : { apps, webhookId } },
    report,
  };
}

/** Names of settings that are not set. */
export function missingSettings(report: ConfigReport): string[] {
  return report.settings.filter((setting) => !setting.set).map((setting) => setting.name);
}

/** Plain-text report of which settings are set and which features are ready. Never shows values. */
export function formatReport(report: ConfigReport): string {
  const settings = rows(
    report.settings.map(({ name, set }): [string, string] => [name, set ? "set" : "missing"]),
  );
  const features = rows(
    report.features.map(({ name, missing }): [string, string] => [
      name,
      missing.length === 0 ? "ready" : `not ready: missing ${missing.join(", ")}`,
    ]),
  );
  return `PayPal sandbox settings\n${settings}\nFeatures\n${features}`;
}

/** Plain-text list of setting errors. */
export function formatErrors(errors: readonly string[]): string {
  return `Settings are invalid:\n${errors.map((error) => `  - ${error}\n`).join("")}`;
}
