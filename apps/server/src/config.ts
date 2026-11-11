import { MODEL_REGISTRY, keyNames } from "@pactpal/ai";
import { Secret } from "@pactpal/net";
import type { PayPalAppCredentials } from "@pactpal/paypal";
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
/** `ai:<VARIABLE>` is one AI host key, taken from the model registry. */
type Part =
  | PayPalApp
  | "webhook"
  | "database"
  | "publicUrl"
  | "email"
  | "inbound"
  | "render"
  | "retention"
  | "sellerKeys"
  | "products"
  | "keyValue"
  | `ai:${string}`;

const WEBHOOK_ID = "PAYPAL_WEBHOOK_ID";
const DATABASE_URL = "DATABASE_URL";
const PUBLIC_BASE_URL = "PUBLIC_BASE_URL";
const RESEND_API_KEY = "RESEND_API_KEY";
/** The sender's address on the domain verified in Resend; "PactPal" is added as its name. */
const EMAIL_FROM = "EMAIL_FROM";
/** Email forwarding (4p-2): Resend's key for reading received mail, its webhook secret, the domain. */
const RESEND_INBOUND_API_KEY = "RESEND_INBOUND_API_KEY";
const RESEND_WEBHOOK_SECRET = "RESEND_WEBHOOK_SECRET";
const INBOUND_DOMAIN = "INBOUND_DOMAIN";
/** Dispute checks (5a): a Render API key, and the Workflow task to start ("workflow/task"). */
const RENDER_API_KEY = "RENDER_API_KEY";
const DISPUTE_TASK_SLUG = "DISPUTE_TASK_SLUG";
/** The retention clean-up (9c): the Workflow task its daily Cron Job starts. */
const RETENTION_TASK_SLUG = "RETENTION_TASK_SLUG";
/** Sellers' own apps (6h): the key that encrypts their app secrets in the database. */
const SELLER_KEYS_ENCRYPTION_KEY = "SELLER_KEYS_ENCRYPTION_KEY";
/** The shared store (9R-2): Render Key Value's internal address (redis://…). */
const KEY_VALUE_URL = "KEY_VALUE_URL";
/** Product listings (8e): Channel3's API key. */
const CHANNEL3_API_KEY = "CHANNEL3_API_KEY";
/** 32 bytes in standard base64, as `openssl rand -base64 32` prints them. */
const ENCRYPTION_KEY = /^[A-Za-z0-9+/]{43}=$/;
const DEFAULT_PORT = 3000;

function appVars(app: PayPalApp): { id: string; secret: string } {
  const prefix = PAYPAL_APPS[app];
  return { id: `${prefix}_CLIENT_ID`, secret: `${prefix}_CLIENT_SECRET` };
}

/** The key variables of the AI hosts in the model registry (several models may share one key). */
const AI_KEYS = keyNames(MODEL_REGISTRY);

const isAiPart = (part: Part): part is `ai:${string}` => part.startsWith("ai:");

function partVars(part: Part): string[] {
  if (isAiPart(part)) return [part.slice("ai:".length)];
  if (part === "webhook") return [WEBHOOK_ID];
  if (part === "database") return [DATABASE_URL];
  if (part === "publicUrl") return [PUBLIC_BASE_URL];
  if (part === "email") return [RESEND_API_KEY, EMAIL_FROM];
  if (part === "inbound") return [RESEND_INBOUND_API_KEY, RESEND_WEBHOOK_SECRET, INBOUND_DOMAIN];
  if (part === "render") return [RENDER_API_KEY, DISPUTE_TASK_SLUG];
  if (part === "retention") return [RENDER_API_KEY, RETENTION_TASK_SLUG];
  if (part === "sellerKeys") return [SELLER_KEYS_ENCRYPTION_KEY];
  if (part === "products") return [CHANNEL3_API_KEY];
  if (part === "keyValue") return [KEY_VALUE_URL];
  const { id, secret } = appVars(part);
  return [id, secret];
}

/** Every PayPal app PactPal uses, in report order. */
export const APP_KEYS = Object.keys(PAYPAL_APPS) as PayPalApp[];

/**
 * The settings kept once in the Render Environment Group `pactpal-shared` (9R-3), because the
 * website, Workflows and the Cron Job all need them; `render.yaml` points those services at it.
 */
export const SHARED_SETTINGS: readonly string[] = [
  "PAYPAL_SELLER_CLIENT_ID",
  "PAYPAL_SELLER_CLIENT_SECRET",
  ...AI_KEYS,
  RESEND_API_KEY,
  EMAIL_FROM,
  PUBLIC_BASE_URL,
  SELLER_KEYS_ENCRYPTION_KEY,
  RENDER_API_KEY,
  // Product listings (8e): the website looks pages up; the demo seed (Workflows) does too.
  CHANNEL3_API_KEY,
];

/** Every setting in report order. */
export const SETTING_NAMES: readonly string[] = [
  ...APP_KEYS,
  "webhook" as const,
  "database" as const,
  "publicUrl" as const,
  "email" as const,
  "inbound" as const,
  "render" as const,
  "retention" as const,
  "sellerKeys" as const,
  "products" as const,
  "keyValue" as const,
  ...AI_KEYS.map((name): Part => `ai:${name}`),
].flatMap(partVars);

/**
 * What each feature needs before it can run. `runtime` marks the features of the
 * running server; the others belong to test scripts and are not listed by `/health`.
 */
export const FEATURES: readonly { name: string; needs: readonly Part[]; runtime: boolean }[] = [
  { name: "Invoices and disputes (seller app)", needs: ["seller"], runtime: true },
  { name: "Webhooks", needs: ["seller", "webhook", "database"], runtime: true },
  { name: "Database", needs: ["database"], runtime: true },
  { name: "Sign in with PayPal", needs: ["seller", "publicUrl", "database"], runtime: true },
  // Without it the server uses a stand-in that sends nothing; links can still be copied by hand.
  { name: "Email (Resend)", needs: ["email"], runtime: true },
  // Without it forwarding to the private address is off; the intake key still works.
  { name: "Email forwarding (Resend inbound)", needs: ["inbound", "database"], runtime: true },
  // Without it "Check now" runs the check inside the server and nothing checks on a schedule.
  { name: "Dispute checks (Render Workflows)", needs: ["render"], runtime: true },
  // Only the daily Cron Job uses it, so the website's health page does not ask for it.
  { name: "Retention clean-up (Render Workflows)", needs: ["retention"], runtime: false },
  // Without it a seller cannot link their own PayPal app (6h); everything else works.
  { name: "Linked seller apps", needs: ["sellerKeys", "database"], runtime: true },
  { name: "Product listings (Channel3)", needs: ["products"], runtime: true },
  { name: "Shared store (Render Key Value)", needs: ["keyValue"], runtime: true },
  { name: "Test setup script", needs: ["seller", "buyerBiz"], runtime: false },
  { name: "Connect with PayPal tests", needs: ["platform"], runtime: false },
  // Not runtime yet: the server starts using AI models in sub-phase 3d.
  ...MODEL_REGISTRY.map(({ name, apiKeyEnv }) => ({
    name: `AI model: ${name}`,
    needs: [`ai:${apiKeyEnv}`] satisfies Part[],
    runtime: false,
  })),
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

function parseUrl(value: string): URL | undefined {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

/** A Render Workflow task, named as "workflow/task". */
const TASK_SLUG = /^[a-z0-9][a-z0-9-]{0,62}\/[a-z0-9][a-z0-9-]{0,62}$/i;

const isLocalhost = (url: URL) => ["localhost", "127.0.0.1"].includes(url.hostname);

/** Rules for settings that are addresses; the messages never repeat the value. */
const ADDRESS_RULES: Record<string, { valid: (url: URL) => boolean; message: string }> = {
  // Render and most hosts hand out postgres:// addresses; the password is inside.
  [DATABASE_URL]: {
    valid: (url) => ["postgres:", "postgresql:"].includes(url.protocol),
    message: "must be a postgres:// address",
  },
  // Render Key Value's address (9R-2): redis://, or rediss:// with TLS.
  [KEY_VALUE_URL]: {
    valid: (url) => ["redis:", "rediss:"].includes(url.protocol),
    message: "must be a redis:// address",
  },
  // The site's own address, from which PayPal's return address is built; https except locally.
  [PUBLIC_BASE_URL]: {
    valid: (url) =>
      (url.protocol === "https:" || (url.protocol === "http:" && isLocalhost(url))) &&
      url.pathname === "/" &&
      url.search === "" &&
      url.hash === "",
    message:
      "must be the site's https:// address with nothing after the host (http only for localhost)",
  },
};

/** True unless the setting is an address that breaks its rule. */
function addressAllowed(name: string, value: string): boolean {
  if (name === EMAIL_FROM) return z.email().safeParse(value).success;
  if (name === INBOUND_DOMAIN) return /^(?=.{1,253}$)([a-z0-9-]{1,63}\.)+[a-z]{2,63}$/.test(value);
  if (name === DISPUTE_TASK_SLUG || name === RETENTION_TASK_SLUG) return TASK_SLUG.test(value);
  if (name === SELLER_KEYS_ENCRYPTION_KEY) return ENCRYPTION_KEY.test(value);
  const rule = ADDRESS_RULES[name];
  const url = parseUrl(value);
  return rule === undefined || (url !== undefined && rule.valid(url));
}

const portValue = z
  .string()
  .regex(/^\d+$/)
  .transform(Number)
  .refine((port) => port >= 1 && port <= 65535);

/** How many proxies stand in front of the server (Render's, for example): 0 to 3. */
const hopsValue = z
  .string()
  .regex(/^\d$/)
  .transform(Number)
  .refine((hops) => hops <= 3);

export interface Config {
  port: number;
  paypal: {
    /** Only apps whose id and secret are both set. */
    apps: Partial<Record<PayPalApp, PayPalAppCredentials>>;
    webhookId?: string;
  };
  /** Absent until `DATABASE_URL` is set. */
  database?: { url: Secret };
  /** Keys of the AI hosts that are set, by variable name (for example `GEMINI_API_KEY`). */
  ai: { keys: Record<string, Secret> };
  /** The site's own address without a trailing slash, e.g. https://pact-pal.app. */
  publicBaseUrl?: string;
  /** Resend's key and the sender, e.g. `PactPal <receipts@send.example.com>`; absent until both are set. */
  email?: { apiKey: Secret; from: string };
  /** Email forwarding through Resend inbound (4p-2); absent until all three settings are set. */
  inbound?: { apiKey: Secret; webhookSecret: Secret; domain: string };
  /** Starting dispute checks as Render Workflow task runs (5a); absent until both are set. */
  render?: { apiKey: Secret; taskSlug: string };
  /** The retention clean-up's Workflow task, for its Cron Job (9c). */
  retention?: { apiKey: Secret; taskSlug: string };
  /** The 32-byte key that encrypts sellers' own app secrets (6h); absent until set. */
  sellerKeys?: { encryptionKey: Secret };
  /** Channel3's key for reading product listings (8e); absent until set. */
  channel3?: { apiKey: Secret };
  /** Render Key Value's address, shared by every server copy (9R-2); absent until set. */
  keyValue?: { url: Secret };
  /**
   * How many proxies stand in front of the server, from `TRUST_PROXY_HOPS`. Absent until measured:
   * visitors' IP addresses are then not recorded, because the address seen would be the proxy's.
   */
  trustProxyHops?: number;
}

export interface ConfigReport {
  settings: { name: string; set: boolean }[];
  features: { name: string; missing: string[]; runtime: boolean }[];
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
  let trustProxyHops: number | undefined;
  if (isPresent(env.TRUST_PROXY_HOPS)) {
    const parsed = hopsValue.safeParse(env.TRUST_PROXY_HOPS);
    if (parsed.success) trustProxyHops = parsed.data;
    else errors.push("TRUST_PROXY_HOPS must be a whole number from 0 to 3");
  }

  const values = new Map<string, string>();
  for (const name of SETTING_NAMES) {
    const raw = env[name];
    if (!isPresent(raw)) continue;
    const parsed = settingValue.safeParse(raw);
    if (!parsed.success) {
      errors.push(`${name} ${parsed.error.issues.map((issue) => issue.message).join(", ")}`);
    } else if (!addressAllowed(name, parsed.data)) {
      const message =
        name === INBOUND_DOMAIN
          ? "must be a domain name such as in.example.com"
          : name === DISPUTE_TASK_SLUG || name === RETENTION_TASK_SLUG
            ? "must be a workflow and task name such as pactpal-workflows/check-disputes"
            : name === SELLER_KEYS_ENCRYPTION_KEY
              ? "must be 32 random bytes in base64 (make one with: openssl rand -base64 32)"
              : (ADDRESS_RULES[name]?.message ?? "must be an email address");
      errors.push(`${name} ${message}`);
    } else {
      values.set(name, parsed.data);
    }
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
  const databaseValue = values.get(DATABASE_URL);

  const report: ConfigReport = {
    settings: SETTING_NAMES.map((name) => ({ name, set: values.has(name) })),
    features: FEATURES.map(({ name, needs, runtime }) => ({
      name,
      missing: needs.flatMap(partVars).filter((variable) => !values.has(variable)),
      runtime,
    })),
  };

  const aiKeys: Record<string, Secret> = {};
  for (const name of AI_KEYS) {
    const value = values.get(name);
    if (value !== undefined) aiKeys[name] = new Secret(value);
  }

  const config: Config = {
    port,
    paypal: webhookId === undefined ? { apps } : { apps, webhookId },
    ai: { keys: aiKeys },
  };
  if (databaseValue !== undefined) config.database = { url: new Secret(databaseValue) };
  const publicBaseUrl = values.get(PUBLIC_BASE_URL);
  if (publicBaseUrl !== undefined) config.publicBaseUrl = new URL(publicBaseUrl).origin;
  if (trustProxyHops !== undefined) config.trustProxyHops = trustProxyHops;
  const resendKey = values.get(RESEND_API_KEY);
  const emailFrom = values.get(EMAIL_FROM);
  if (resendKey !== undefined && emailFrom !== undefined) {
    config.email = { apiKey: new Secret(resendKey), from: `PactPal <${emailFrom}>` };
  }
  const inboundKey = values.get(RESEND_INBOUND_API_KEY);
  const webhookSecret = values.get(RESEND_WEBHOOK_SECRET);
  const inboundDomain = values.get(INBOUND_DOMAIN);
  if (inboundKey !== undefined && webhookSecret !== undefined && inboundDomain !== undefined) {
    config.inbound = {
      apiKey: new Secret(inboundKey),
      webhookSecret: new Secret(webhookSecret),
      domain: inboundDomain,
    };
  }
  const channel3Key = values.get(CHANNEL3_API_KEY);
  if (channel3Key !== undefined) config.channel3 = { apiKey: new Secret(channel3Key) };
  const keyValueUrl = values.get(KEY_VALUE_URL);
  if (keyValueUrl !== undefined) config.keyValue = { url: new Secret(keyValueUrl) };
  const renderKey = values.get(RENDER_API_KEY);
  const taskSlug = values.get(DISPUTE_TASK_SLUG);
  if (renderKey !== undefined && taskSlug !== undefined) {
    config.render = { apiKey: new Secret(renderKey), taskSlug };
  }
  const retentionSlug = values.get(RETENTION_TASK_SLUG);
  if (renderKey !== undefined && retentionSlug !== undefined) {
    config.retention = { apiKey: new Secret(renderKey), taskSlug: retentionSlug };
  }
  const encryptionKey = values.get(SELLER_KEYS_ENCRYPTION_KEY);
  if (encryptionKey !== undefined) config.sellerKeys = { encryptionKey: new Secret(encryptionKey) };
  return { ok: true, config, report };
}

/** Names of the settings the running server needs that are not set (test-script settings are left out). */
export function missingRuntimeSettings(report: ConfigReport): string[] {
  return [...new Set(report.features.filter((f) => f.runtime).flatMap((f) => f.missing))];
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
  return `Settings\n${settings}\nFeatures\n${features}`;
}

/** Plain-text list of setting errors. */
export function formatErrors(errors: readonly string[]): string {
  return `Settings are invalid:\n${errors.map((error) => `  - ${error}\n`).join("")}`;
}
