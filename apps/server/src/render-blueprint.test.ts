// Keeps render.yaml in step with the project, without a YAML library: the file is small and flat.
import { MODEL_REGISTRY } from "@pactpal/ai";
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { loadConfig, settingsFor } from "./config.js";
import { PAYPAL_WEBHOOK_PATH } from "./webhooks/paypal-webhook.js";

const blueprint = readFileSync(new URL("../../../render.yaml", import.meta.url), "utf8");
const ciWorkflow = readFileSync(
  new URL("../../../.github/workflows/ci.yml", import.meta.url),
  "utf8",
);
const [servicesSection = "", databaseSection = ""] = blueprint.split(/^databases:$/m);
// The website comes first; the Workflow service and its Cron Job (5a) follow it.
const [serviceSection = "", workflowSection = "", cronSection = ""] = servicesSection
  .split(/^ {2}- type: /m)
  .slice(1);
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

  it("asks in the dashboard for every setting the Webhooks feature needs, and stores no values", () => {
    const keys = [...serviceSection.matchAll(/- key: (\S+)\n\s+sync: false/g)].map((m) => m[1]);
    // The database address is the exception: Render fills it in from the database itself.
    const aiKeys = MODEL_REGISTRY.map((spec) => spec.apiKeyEnv).filter(
      (name, index, all) => all.indexOf(name) === index,
    );
    expect(keys).toEqual([
      ...settingsFor("Webhooks").filter((name) => name !== "DATABASE_URL"),
      ...aiKeys,
      // The email sender is not secret: it is a plain value, added once the domain is verified.
      ...settingsFor("Email (Resend)").filter((name) => name !== "EMAIL_FROM"),
      // The receiving domain is not secret either.
      ...settingsFor("Email forwarding (Resend inbound)").filter(
        (name) => name !== "INBOUND_DOMAIN" && name !== "DATABASE_URL",
      ),
      // The task's name is not secret either.
      ...settingsFor("Dispute checks (Render Workflows)").filter(
        (name) => name !== "DISPUTE_TASK_SLUG",
      ),
    ]);
    // Sign-in needs nothing secret beyond those.
    for (const name of settingsFor("Sign in with PayPal")) {
      expect(blueprint).toContain(`key: ${name}`);
    }
    expect(blueprint).not.toMatch(/key: PAYPAL_\w+\n\s+value:/);
  });

  it("tells the server its own public address, which is the service's Render address", () => {
    const address = /- key: PUBLIC_BASE_URL\n\s+value: (\S+)\n/.exec(serviceSection)?.[1];
    expect(address).toBe(`https://${field("name", serviceSection) ?? "missing"}.onrender.com`);
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

  it("sends email from the verified domain, as a plain value the server accepts", () => {
    const from = /- key: EMAIL_FROM\n\s+value: (\S+)\n/.exec(serviceSection)?.[1];
    expect(from).toBe("receipts@updates.pact-pal.app");
    const loaded = loadConfig({ EMAIL_FROM: from, RESEND_API_KEY: "re_test" });
    expect(loaded.ok && loaded.config.email?.from).toBe("PactPal <receipts@updates.pact-pal.app>");
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
    const secrets = (section: string) =>
      [...section.matchAll(/- key: (\S+)\n\s+sync: false/g)].map((m) => m[1]);
    // ...and, for the claim comparison council (5d), every AI host's key.
    const aiKeys = [...new Set(MODEL_REGISTRY.map((spec) => spec.apiKeyEnv))];
    // ...and, for the seller's dispute emails (5j), email and the site address.
    expect(secrets(workflowSection)).toEqual([
      ...settingsFor("Invoices and disputes (seller app)"),
      ...aiKeys,
      "RESEND_API_KEY",
      "EMAIL_FROM",
      "PUBLIC_BASE_URL",
    ]);
    expect(secrets(cronSection)).toEqual(["RENDER_API_KEY"]);
    // Both the website and the cron start the same task, by a name the settings accept.
    const slug = (section: string) =>
      /- key: DISPUTE_TASK_SLUG\n\s+value: (\S+)\n/.exec(section)?.[1];
    expect(slug(cronSection)).toBe(`${field("name", workflowSection) ?? "missing"}/check-disputes`);
    expect(slug(serviceSection)).toBe(slug(cronSection));
    const loaded = loadConfig({ RENDER_API_KEY: "rnd_test", DISPUTE_TASK_SLUG: slug(cronSection) });
    expect(loaded.ok && loaded.config.render?.taskSlug).toBe("pactpal-workflows/check-disputes");
  });
});
