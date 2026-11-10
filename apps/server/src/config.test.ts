import { describe, expect, it } from "vitest";
import {
  SETTING_NAMES,
  formatErrors,
  formatReport,
  loadConfig,
  missingRuntimeSettings,
  type ConfigReport,
} from "./config.js";

// Each value is unique so a leak of any one of them is detectable.
const DATABASE_URL = "postgres://pactpal:db-password-value@db.internal:5432/pactpal";
const fullEnv: Record<string, string> = {
  ...Object.fromEntries(
    SETTING_NAMES.map((name, index) => [name, `value-${index}-${name.toLowerCase()}`]),
  ),
  DATABASE_URL,
  PUBLIC_BASE_URL: "https://pactpal.example.com",
  EMAIL_FROM: "receipts@send.pactpal.example.com",
  INBOUND_DOMAIN: "in.pactpal.example.com",
  DISPUTE_TASK_SLUG: "pactpal-workflows/check-disputes",
  SELLER_KEYS_ENCRYPTION_KEY: Buffer.alloc(32, 9).toString("base64"),
};

const unsetSettings = (report: ConfigReport) =>
  report.settings.filter(({ set }) => !set).map(({ name }) => name);

function expectLoaded(env: NodeJS.ProcessEnv) {
  const result = loadConfig(env);
  if (!result.ok) throw new Error(`expected settings to load: ${result.errors.join("; ")}`);
  return result;
}

function expectErrors(env: NodeJS.ProcessEnv): string[] {
  const result = loadConfig(env);
  if (result.ok) throw new Error("expected settings to be rejected");
  return result.errors;
}

describe("loadConfig", () => {
  it("loads every app, the webhook id and a custom port when all are set", () => {
    const { config, report } = expectLoaded({ ...fullEnv, PORT: "4000" });
    expect(config.port).toBe(4000);
    expect(config.paypal.apps.seller?.clientId).toBe(fullEnv.PAYPAL_SELLER_CLIENT_ID);
    expect(config.paypal.apps.seller?.clientSecret.reveal()).toBe(
      fullEnv.PAYPAL_SELLER_CLIENT_SECRET,
    );
    expect(Object.keys(config.paypal.apps).sort()).toEqual(["buyerBiz", "platform", "seller"]);
    expect(config.paypal.webhookId).toBe(fullEnv.PAYPAL_WEBHOOK_ID);
    expect(config.database?.url.reveal()).toBe(DATABASE_URL);
    expect(config.publicBaseUrl).toBe("https://pactpal.example.com");
    expect(config.email?.from).toBe("PactPal <receipts@send.pactpal.example.com>");
    expect(config.email?.apiKey.reveal()).toBe(fullEnv.RESEND_API_KEY);
    expect(Object.keys(config.ai.keys)).toEqual([
      "GEMINI_API_KEY",
      "GROQ_API_KEY",
      "MISTRAL_API_KEY",
      "OPENROUTER_API_KEY",
    ]);
    expect(config.ai.keys.GROQ_API_KEY?.reveal()).toBe(fullEnv.GROQ_API_KEY);
    expect(unsetSettings(report)).toEqual([]);
    expect(report.features.every((feature) => feature.missing.length === 0)).toBe(true);
  });

  it("treats missing and empty values as not set, without failing", () => {
    const { config, report } = expectLoaded({ PAYPAL_WEBHOOK_ID: "" });
    expect(config.port).toBe(3000);
    expect(config.paypal).toEqual({ apps: {} });
    expect(config.ai).toEqual({ keys: {} });
    expect(config.database).toBeUndefined();
    expect(unsetSettings(report)).toEqual(SETTING_NAMES);
  });

  it("marks only the features whose settings are missing as not ready", () => {
    const { report } = expectLoaded({
      PAYPAL_SELLER_CLIENT_ID: "id",
      PAYPAL_SELLER_CLIENT_SECRET: "secret",
    });
    const missingByFeature = Object.fromEntries(
      report.features.map(({ name, missing }) => [name, missing]),
    );
    expect(missingByFeature).toEqual({
      "Invoices and disputes (seller app)": [],
      Webhooks: ["PAYPAL_WEBHOOK_ID", "DATABASE_URL"],
      Database: ["DATABASE_URL"],
      "Sign in with PayPal": ["PUBLIC_BASE_URL", "DATABASE_URL"],
      "Email (Resend)": ["RESEND_API_KEY", "EMAIL_FROM"],
      "Email forwarding (Resend inbound)": [
        "RESEND_INBOUND_API_KEY",
        "RESEND_WEBHOOK_SECRET",
        "INBOUND_DOMAIN",
        "DATABASE_URL",
      ],
      "Dispute checks (Render Workflows)": ["RENDER_API_KEY", "DISPUTE_TASK_SLUG"],
      "Linked seller apps": ["SELLER_KEYS_ENCRYPTION_KEY", "DATABASE_URL"],
      "Product listings (Channel3)": ["CHANNEL3_API_KEY"],
      "Test setup script": ["PAYPAL_BUYER_BIZ_CLIENT_ID", "PAYPAL_BUYER_BIZ_CLIENT_SECRET"],
      "Connect with PayPal tests": ["PAYPAL_PLATFORM_CLIENT_ID", "PAYPAL_PLATFORM_CLIENT_SECRET"],
      "AI model: gemini": ["GEMINI_API_KEY"],
      "AI model: qwen-groq": ["GROQ_API_KEY"],
      "AI model: gpt-oss-groq": ["GROQ_API_KEY"],
      "AI model: mistral": ["MISTRAL_API_KEY"],
      "AI model: nemotron-openrouter": ["OPENROUTER_API_KEY"],
    });
  });

  it("makes a model ready when its key is set, and one key serves every model of that host", () => {
    const { config, report } = expectLoaded({ GROQ_API_KEY: "groq-key-value" });
    expect(Object.keys(config.ai.keys)).toEqual(["GROQ_API_KEY"]);
    const ready = report.features
      .filter(({ missing }) => missing.length === 0)
      .map(({ name }) => name);
    expect(ready).toEqual(["AI model: qwen-groq", "AI model: gpt-oss-groq"]);
  });

  it("hides AI keys when the settings are printed", () => {
    const { config } = expectLoaded({ GEMINI_API_KEY: "gemini-key-value" });
    expect(JSON.stringify(config)).not.toContain("gemini-key-value");
  });

  it.each([
    ["PAYPAL_SELLER_CLIENT_ID", "PAYPAL_SELLER_CLIENT_SECRET"],
    ["PAYPAL_PLATFORM_CLIENT_SECRET", "PAYPAL_PLATFORM_CLIENT_ID"],
  ])("rejects %s without %s", (set, unset) => {
    expect(expectErrors({ [set]: "value" })).toEqual([
      `${set} is set but ${unset} is missing; set both or neither`,
    ]);
  });

  it.each([
    [" padded", "contains spaces or line breaks"],
    ["two words", "contains spaces or line breaks"],
    ["line\nbreak", "contains spaces or line breaks"],
    ['"quoted"', "is wrapped in quote marks"],
    ["'quoted'", "is wrapped in quote marks"],
  ])("rejects a value like %j", (value, message) => {
    expect(expectErrors({ PAYPAL_WEBHOOK_ID: value })).toEqual([`PAYPAL_WEBHOOK_ID ${message}`]);
  });

  it.each(["mysql://user:pw-leak@host/db", "not a url", "pw-leak"])(
    "rejects a DATABASE_URL that is not a postgres address, without repeating it",
    (value) => {
      const errors = expectErrors({ DATABASE_URL: value.replace(/ /g, "") });
      expect(errors).toEqual(["DATABASE_URL must be a postgres:// address"]);
      expect(formatErrors(errors)).not.toMatch(/pw-leak/);
    },
  );

  it.each([
    ["https://pactpal.example.com", "https://pactpal.example.com"],
    ["https://pactpal.example.com/", "https://pactpal.example.com"],
    ["http://localhost:3000", "http://localhost:3000"],
  ])("accepts PUBLIC_BASE_URL=%s as %s", (value, origin) => {
    expect(expectLoaded({ PUBLIC_BASE_URL: value }).config.publicBaseUrl).toBe(origin);
  });

  it.each([
    "http://pactpal.example.com",
    "https://pactpal.example.com/app",
    "https://pactpal.example.com?x=1",
    "ftp://pactpal.example.com",
    "pactpal.example.com",
  ])("rejects PUBLIC_BASE_URL=%s", (value) => {
    expect(expectErrors({ PUBLIC_BASE_URL: value })).toEqual([
      "PUBLIC_BASE_URL must be the site's https:// address with nothing after the host (http only for localhost)",
    ]);
  });

  it("accepts the postgresql:// spelling", () => {
    const { config } = expectLoaded({ DATABASE_URL: "postgresql://u:p@host/db" });
    expect(config.database?.url.reveal()).toBe("postgresql://u:p@host/db");
  });

  it("hides the database address when the settings are printed", () => {
    const { config } = expectLoaded({ DATABASE_URL });
    expect(JSON.stringify(config)).not.toContain("db-password-value");
    expect(String(config.database?.url)).toBe("[redacted]");
  });

  it.each(["abc", "0", "65536", "-1", "3000.5"])("rejects PORT=%j", (port) => {
    expect(expectErrors({ PORT: port })).toEqual(["PORT must be a whole number from 1 to 65535"]);
  });

  it("turns email on only when both the key and the sender are set, and checks the sender", () => {
    expect(expectLoaded({ RESEND_API_KEY: "re_key" }).config.email).toBeUndefined();
    expect(expectLoaded({ EMAIL_FROM: "a@b.example" }).config.email).toBeUndefined();
    expect(expectErrors({ EMAIL_FROM: "not-an-address" })).toEqual([
      "EMAIL_FROM must be an email address",
    ]);
    expect(JSON.stringify(expectLoaded(fullEnv).config)).not.toContain(fullEnv.RESEND_API_KEY);
  });

  it("turns email forwarding on only when all three settings are set, and checks the domain", () => {
    const inbound = {
      RESEND_INBOUND_API_KEY: "re_in",
      RESEND_WEBHOOK_SECRET: "whsec_abc",
      INBOUND_DOMAIN: "in.pact-pal.app",
    };
    expect(expectLoaded(inbound).config.inbound).toMatchObject({ domain: "in.pact-pal.app" });
    expect(expectLoaded({ ...inbound, INBOUND_DOMAIN: undefined }).config.inbound).toBeUndefined();
    expect(expectErrors({ INBOUND_DOMAIN: "not a domain" })).toEqual([
      "INBOUND_DOMAIN contains spaces or line breaks",
    ]);
    expect(expectErrors({ INBOUND_DOMAIN: "https://in.x.app" })).toEqual([
      "INBOUND_DOMAIN must be a domain name such as in.example.com",
    ]);
    expect(JSON.stringify(expectLoaded(inbound).config)).not.toMatch(/re_in|whsec_abc/);
  });

  it("starts dispute checks on Render only when the key and the task are set, and checks the task", () => {
    const render = {
      RENDER_API_KEY: "rnd_key",
      DISPUTE_TASK_SLUG: "pactpal-workflows/check-disputes",
    };
    expect(expectLoaded(render).config.render).toMatchObject({
      taskSlug: "pactpal-workflows/check-disputes",
    });
    expect(expectLoaded({ RENDER_API_KEY: "rnd_key" }).config.render).toBeUndefined();
    expect(expectErrors({ DISPUTE_TASK_SLUG: "check-disputes" })).toEqual([
      "DISPUTE_TASK_SLUG must be a workflow and task name such as pactpal-workflows/check-disputes",
    ]);
    expect(JSON.stringify(expectLoaded(render).config)).not.toContain("rnd_key");
  });

  it("reads the key for sellers' app secrets only when it is 32 bytes in base64, never echoing it", () => {
    const key = Buffer.alloc(32, 3).toString("base64");
    const { config } = expectLoaded({ SELLER_KEYS_ENCRYPTION_KEY: key });
    expect(config.sellerKeys?.encryptionKey.reveal()).toBe(key);
    expect(JSON.stringify(config)).not.toContain(key);
    expect(expectLoaded({}).config.sellerKeys).toBeUndefined();
    expect(expectLoaded({ CHANNEL3_API_KEY: "c3-key" }).config.channel3?.apiKey.reveal()).toBe(
      "c3-key",
    );
    expect(expectLoaded({}).config.channel3).toBeUndefined();
    const short = Buffer.alloc(16, 3).toString("base64");
    for (const bad of [short, `${key.slice(0, -1)}A`, key.replace("A", "-")]) {
      expect(expectErrors({ SELLER_KEYS_ENCRYPTION_KEY: bad })).toEqual([
        "SELLER_KEYS_ENCRYPTION_KEY must be 32 random bytes in base64 (make one with: openssl rand -base64 32)",
      ]);
    }
  });

  it("reads how many proxies stand in front of the server, and leaves it unset by default", () => {
    expect(expectLoaded({}).config.trustProxyHops).toBeUndefined();
    expect(expectLoaded({ TRUST_PROXY_HOPS: "0" }).config.trustProxyHops).toBe(0);
    expect(expectLoaded({ TRUST_PROXY_HOPS: "2" }).config.trustProxyHops).toBe(2);
  });

  it.each(["4", "-1", "1.5", "one", "10"])("rejects TRUST_PROXY_HOPS=%j", (hops) => {
    expect(expectErrors({ TRUST_PROXY_HOPS: hops })).toEqual([
      "TRUST_PROXY_HOPS must be a whole number from 0 to 3",
    ]);
  });

  it("never puts values in error messages", () => {
    const leaky = Object.fromEntries(SETTING_NAMES.map((name) => [name, `"leak-${name}"`]));
    const errors = expectErrors(leaky);
    expect(errors).toHaveLength(SETTING_NAMES.length);
    expect(formatErrors(errors)).not.toMatch(/leak-/);
  });
});

describe("missingRuntimeSettings", () => {
  it("lists what the running server needs, leaving out test-script settings", () => {
    const { report } = expectLoaded({});
    // AI keys are not listed: the running server does not use AI models yet.
    expect(missingRuntimeSettings(report)).toEqual([
      "PAYPAL_SELLER_CLIENT_ID",
      "PAYPAL_SELLER_CLIENT_SECRET",
      "PAYPAL_WEBHOOK_ID",
      "DATABASE_URL",
      "PUBLIC_BASE_URL",
      "RESEND_API_KEY",
      "EMAIL_FROM",
      "RESEND_INBOUND_API_KEY",
      "RESEND_WEBHOOK_SECRET",
      "INBOUND_DOMAIN",
      "RENDER_API_KEY",
      "DISPUTE_TASK_SLUG",
      "SELLER_KEYS_ENCRYPTION_KEY",
      "CHANNEL3_API_KEY",
    ]);
  });

  it("is empty once the server's settings are set", () => {
    const { report } = expectLoaded({
      PAYPAL_SELLER_CLIENT_ID: "id",
      PAYPAL_SELLER_CLIENT_SECRET: "secret",
      PAYPAL_WEBHOOK_ID: "hook",
      DATABASE_URL,
      PUBLIC_BASE_URL: "https://pactpal.example.com",
      RESEND_API_KEY: "re_key",
      EMAIL_FROM: "receipts@send.pactpal.example.com",
      RESEND_INBOUND_API_KEY: "re_in",
      RESEND_WEBHOOK_SECRET: "whsec_abc",
      INBOUND_DOMAIN: "in.pactpal.example.com",
      RENDER_API_KEY: "rnd_key",
      DISPUTE_TASK_SLUG: "pactpal-workflows/check-disputes",
      SELLER_KEYS_ENCRYPTION_KEY: fullEnv.SELLER_KEYS_ENCRYPTION_KEY,
      CHANNEL3_API_KEY: "c3-key",
    });
    expect(missingRuntimeSettings(report)).toEqual([]);
  });
});

describe("formatReport", () => {
  it("shows set and missing settings and feature readiness, never values", () => {
    const { report } = expectLoaded({
      PAYPAL_SELLER_CLIENT_ID: "seller-id-value",
      PAYPAL_SELLER_CLIENT_SECRET: "seller-secret-value",
    });
    const text = formatReport(report);
    expect(text).toMatch(/PAYPAL_SELLER_CLIENT_SECRET\s+set\n/);
    expect(text).toMatch(/PAYPAL_WEBHOOK_ID\s+missing\n/);
    expect(text).toMatch(/GEMINI_API_KEY\s+missing\n/);
    expect(text).toMatch(/AI model: gemini\s+not ready: missing GEMINI_API_KEY\n/);
    expect(text).toMatch(/Invoices and disputes \(seller app\)\s+ready\n/);
    expect(text).toMatch(/Webhooks\s+not ready: missing PAYPAL_WEBHOOK_ID, DATABASE_URL\n/);
    expect(text).not.toMatch(/seller-(id|secret)-value/);
  });
});

describe("formatErrors", () => {
  it("lists each error on its own line", () => {
    expect(formatErrors(["A is wrong", "B is wrong"])).toBe(
      "Settings are invalid:\n  - A is wrong\n  - B is wrong\n",
    );
  });
});
