// Keeps render.yaml in step with the project, without a YAML library: the file is small and flat.
import { MODEL_REGISTRY } from "@pactpal/ai";
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SHARED_SETTINGS, loadConfig, settingsFor } from "./config.js";
import { PAYPAL_WEBHOOK_PATH } from "./webhooks/paypal-webhook.js";

const blueprint = readFileSync(new URL("../../../render.yaml", import.meta.url), "utf8");
const ciWorkflow = readFileSync(
  new URL("../../../.github/workflows/ci.yml", import.meta.url),
  "utf8",
);
const [servicesSection = "", databaseSection = ""] = blueprint.split(/^databases:$/m);
// Each service by its name: the website, the Workflow service and its Cron Jobs (5a, 9c), Key
// Value (9R-2) and the docs site (9R-4).
const sections = servicesSection.split(/^ {2}- type: /m).slice(1);
const named = (name: string) =>
  sections.find((section) => new RegExp(`^ {4}name: ${name}$`, "m").test(section)) ?? "";
const serviceSection = named("pactpal-server");
const workflowSection = named("pactpal-workflows");
const cronSection = named("pactpal-dispute-check");
const serverPackage = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { name: string; scripts: { start: string } };

function field(name: string, section = blueprint): string | undefined {
  return new RegExp(`^\\s+${name}: (.+)$`, "m").exec(section)?.[1];
}

describe("render.yaml", () => {
  it("builds the web pages and the server package, and starts the same file as its start script", () => {
    expect(field("buildCommand")).toContain(`pnpm --filter ${serverPackage.name} build`);
    expect(field("buildCommand")).toContain("pnpm --filter @pactpal/web build");
    expect(field("buildCommand")).toContain("pnpm install --frozen-lockfile");
    // Render runs from the repository root; the package's start script runs inside apps/server.
    expect(field("startCommand")).toBe(
      serverPackage.scripts.start.replace("node ", "node apps/server/"),
    );
  });

  it("checks the server's health page and deploys the dev branch", () => {
    expect(field("healthCheckPath")).toBe("/health");
    expect(field("branch")).toBe("dev");
    expect(field("plan")).toBe("starter");
    // Render cannot move a service to another region after it is created.
    expect(field("region")).toBe("virginia");
    expect(PAYPAL_WEBHOOK_PATH.startsWith("/")).toBe(true);
  });

  it("asks in the dashboard for every secret, shared ones once in the Environment Group (9R-3)", () => {
    const secrets = (section: string) =>
      [...section.matchAll(/- key: (\S+)\n\s+sync: false/g)].map((m) => m[1] ?? "");
    const needed = [
      ...settingsFor("Webhooks"),
      ...settingsFor("Email (Resend)"),
      ...settingsFor("Email forwarding (Resend inbound)"),
      ...settingsFor("Dispute checks (Render Workflows)"),
      ...settingsFor("Linked seller apps"),
      ...settingsFor("Product listings (Channel3)"),
      ...settingsFor("Sign in with PayPal"),
      ...MODEL_REGISTRY.map((spec) => spec.apiKeyEnv),
    ];
    // Every setting the website needs is its own secret, a plain value, from the database, from
    // Key Value, or in the group; nothing is in two places.
    const own = secrets(serviceSection);
    for (const name of new Set(needed)) {
      const plain = new RegExp(`- key: ${name}\\n\\s+(value|fromDatabase|fromService):`).test(
        serviceSection,
      );
      expect([own.includes(name), plain, SHARED_SETTINGS.includes(name)].filter(Boolean)).toEqual([
        true,
      ]);
    }
    for (const name of SHARED_SETTINGS) {
      expect(blueprint).not.toContain(`- key: ${name}\n`);
    }
    for (const section of [serviceSection, workflowSection, cronSection]) {
      expect(section).toContain("- fromGroup: pactpal-shared");
    }
    expect(blueprint).not.toMatch(/key: PAYPAL_\w+\n\s+value:/);
  });

  it("runs the built migration command before each deploy", () => {
    expect(field("preDeployCommand")).toBe("node apps/server/dist/migrate.js");
    expect(existsSync(new URL("../build.js", import.meta.url))).toBe(true);
    expect(readFileSync(new URL("../build.js", import.meta.url), "utf8")).toContain(
      "src/migrate.ts",
    );
  });

  it("gives the server its database address from the database, never as a stored value", () => {
    expect(serviceSection).toMatch(
      /- key: DATABASE_URL\n\s+fromDatabase:\n\s+name: pactpal-db\n\s+property: connectionString/,
    );
    expect(databaseSection).toMatch(/- name: pactpal-db\n/);
    expect(blueprint).not.toMatch(/postgres(ql)?:\/\//);
  });

  it("keeps the database next to the server, private, and on the Postgres version CI tests", () => {
    // Neither the region nor the version can be changed after creation.
    expect(field("region", databaseSection)).toBe(field("region", serviceSection));
    expect(field("ipAllowList", databaseSection)).toBe("[]");
    const version = /postgresMajorVersion: "(\d+)"/.exec(databaseSection)?.[1];
    expect(ciWorkflow).toContain(`image: postgres:${version ?? "missing"}`);
  });

  it("tells the server how many proxies stand in front of it, as a value it accepts", () => {
    const hops = /- key: TRUST_PROXY_HOPS\n\s+value: "(\d+)"\n/.exec(serviceSection)?.[1];
    expect(hops).toBe("2");
    const loaded = loadConfig({ TRUST_PROXY_HOPS: hops });
    expect(loaded.ok && loaded.config.trustProxyHops).toBe(2);
  });

  it("receives forwarded email on its own subdomain, as a plain value the server accepts", () => {
    const domain = /- key: INBOUND_DOMAIN\n\s+value: (\S+)\n/.exec(serviceSection)?.[1];
    expect(domain).toBe("in.pact-pal.app");
    const loaded = loadConfig({
      INBOUND_DOMAIN: domain,
      RESEND_INBOUND_API_KEY: "re_test",
      RESEND_WEBHOOK_SECRET: "whsec_dGVzdA==",
    });
    expect(loaded.ok && loaded.config.inbound?.domain).toBe("in.pact-pal.app");
  });

  it("adds Key Value, the docs site and a second website copy (9R-2, 9R-4, 9R-5)", () => {
    const keyValue = named("pactpal-kv");
    expect(keyValue.startsWith("keyvalue\n")).toBe(true);
    expect(field("plan", keyValue)).toBe("free");
    expect(field("region", keyValue)).toBe(field("region", serviceSection));
    expect(field("ipAllowList", keyValue)).toBe("[]");
    expect(serviceSection).toMatch(
      /- key: KEY_VALUE_URL\n\s+fromService:\n\s+type: keyvalue\n\s+name: pactpal-kv/,
    );
    expect(field("numInstances", serviceSection)).toBe("2");
    const docs = named("pactpal-docs");
    expect(field("runtime", docs)).toBe("static");
    // Its read-only build image keeps its own pnpm, so the repository's version runs through npx.
    expect(field("buildCommand", docs)).toContain(
      "npx --yes pnpm@10.28.0 --filter @pactpal/docs build",
    );
    expect(field("buildCommand", docs)).not.toContain("corepack");
    expect(field("staticPublishPath", docs)).toBe("apps/docs/dist");
    expect(docs).toContain("X-Frame-Options");
  });

  it("knows no settings for an unknown feature", () => {
    expect(settingsFor("Nope")).toEqual([]);
  });

  it("runs the dispute check as a Workflow task, started every 5 minutes by a Cron Job", () => {
    expect(serviceSection.startsWith("web\n")).toBe(true);
    expect(workflowSection.startsWith("workflow\n")).toBe(true);
    expect(cronSection.startsWith("cron\n")).toBe(true);
    for (const section of [workflowSection, cronSection]) {
      expect(field("region", section)).toBe("virginia");
      expect(field("branch", section)).toBe("dev");
      expect(field("buildCommand", section)).toContain(`pnpm --filter ${serverPackage.name} build`);
    }
    // Workflows set compute per task and have no pre-deploy step.
    expect(field("plan", workflowSection)).toBeUndefined();
    expect(field("preDeployCommand", workflowSection)).toBeUndefined();
    expect(field("startCommand", workflowSection)).toBe("node apps/server/dist/workflow.js");
    expect(field("startCommand", cronSection)).toBe("node apps/server/dist/dispute-cron.js");
    expect(field("schedule", cronSection)).toBe('"*/5 * * * *"');
    const build = readFileSync(new URL("../build.js", import.meta.url), "utf8");
    expect(build).toContain("src/workflow.ts");
    expect(build).toContain("src/dispute-cron.ts");
    // The task reads the database and PayPal; the cron only needs Render's key and the task name.
    expect(workflowSection).toMatch(/- key: DATABASE_URL\n\s+fromDatabase:\n\s+name: pactpal-db/);
    // PayPal, the AI keys, email, the site address, the seller-app key and Render's key all come
    // from the shared group (9R-3); none is kept on these services on its own.
    for (const name of [
      ...settingsFor("Invoices and disputes (seller app)"),
      ...settingsFor("Linked seller apps").filter((name) => name !== "DATABASE_URL"),
      "RESEND_API_KEY",
      "EMAIL_FROM",
      "PUBLIC_BASE_URL",
      "RENDER_API_KEY",
    ]) {
      expect(SHARED_SETTINGS).toContain(name);
    }
    expect(workflowSection).not.toMatch(/sync: false/);
    expect(cronSection).not.toMatch(/sync: false/);
    // Both the website and the cron start the same task, by a name the settings accept.
    const slug = (section: string) =>
      /- key: DISPUTE_TASK_SLUG\n\s+value: (\S+)\n/.exec(section)?.[1];
    expect(slug(cronSection)).toBe(`${field("name", workflowSection) ?? "missing"}/check-disputes`);
    expect(slug(serviceSection)).toBe(slug(cronSection));
    const loaded = loadConfig({ RENDER_API_KEY: "rnd_test", DISPUTE_TASK_SLUG: slug(cronSection) });
    expect(loaded.ok && loaded.config.render?.taskSlug).toBe("pactpal-workflows/check-disputes");
  });

  it("runs the retention clean-up once a day as a Workflow task, from its own Cron Job (9c)", () => {
    const retention = named("pactpal-retention");
    expect(retention.startsWith("cron\n")).toBe(true);
    expect(field("schedule", retention)).toBe('"17 3 * * *"');
    expect(field("region", retention)).toBe("virginia");
    expect(field("startCommand", retention)).toBe("node apps/server/dist/retention-cron.js");
    expect(readFileSync(new URL("../build.js", import.meta.url), "utf8")).toContain(
      "src/retention-cron.ts",
    );
    expect(retention).toContain("- fromGroup: pactpal-shared");
    expect(retention).not.toMatch(/sync: false/);
    const slug = /- key: RETENTION_TASK_SLUG\n\s+value: (\S+)\n/.exec(retention)?.[1];
    expect(slug).toBe(`${field("name", workflowSection) ?? "missing"}/retention-sweep`);
    const loaded = loadConfig({ RENDER_API_KEY: "rnd_test", RETENTION_TASK_SLUG: slug });
    expect(loaded.ok && loaded.config.retention?.taskSlug).toBe(slug);
  });
});
