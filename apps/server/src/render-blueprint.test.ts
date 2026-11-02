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
const [serviceSection = "", databaseSection = ""] = blueprint.split(/^databases:$/m);
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
    const keys = [...blueprint.matchAll(/- key: (\S+)\n\s+sync: false/g)].map((m) => m[1]);
    // The database address is the exception: Render fills it in from the database itself.
    const aiKeys = MODEL_REGISTRY.map((spec) => spec.apiKeyEnv).filter(
      (name, index, all) => all.indexOf(name) === index,
    );
    expect(keys).toEqual([
      ...settingsFor("Webhooks").filter((name) => name !== "DATABASE_URL"),
      ...aiKeys,
      // The email sender is not secret: it is a plain value, added once the domain is verified.
      ...settingsFor("Email (Resend)").filter((name) => name !== "EMAIL_FROM"),
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

  it("knows no settings for an unknown feature", () => {
    expect(settingsFor("Nope")).toEqual([]);
  });
});
