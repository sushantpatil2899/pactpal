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
    expect(unsetSettings(report)).toEqual([]);
    expect(report.features.every((feature) => feature.missing.length === 0)).toBe(true);
  });

  it("treats missing and empty values as not set, without failing", () => {
    const { config, report } = expectLoaded({ PAYPAL_WEBHOOK_ID: "" });
    expect(config.port).toBe(3000);
    expect(config.paypal).toEqual({ apps: {} });
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
      "Test setup script": ["PAYPAL_BUYER_BIZ_CLIENT_ID", "PAYPAL_BUYER_BIZ_CLIENT_SECRET"],
      "Connect with PayPal tests": ["PAYPAL_PLATFORM_CLIENT_ID", "PAYPAL_PLATFORM_CLIENT_SECRET"],
    });
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
    expect(missingRuntimeSettings(report)).toEqual([
      "PAYPAL_SELLER_CLIENT_ID",
      "PAYPAL_SELLER_CLIENT_SECRET",
      "PAYPAL_WEBHOOK_ID",
      "DATABASE_URL",
      "PUBLIC_BASE_URL",
    ]);
  });

  it("is empty once the server's settings are set", () => {
    const { report } = expectLoaded({
      PAYPAL_SELLER_CLIENT_ID: "id",
      PAYPAL_SELLER_CLIENT_SECRET: "secret",
      PAYPAL_WEBHOOK_ID: "hook",
      DATABASE_URL,
      PUBLIC_BASE_URL: "https://pactpal.example.com",
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
