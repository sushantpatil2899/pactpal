// Keeps render.yaml in step with the project, without a YAML library: the file is small and flat.
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { settingsFor } from "./config.js";
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
  it("builds the server package and starts the same file as its start script", () => {
    expect(field("buildCommand")).toContain(`pnpm --filter ${serverPackage.name} build`);
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
    expect(keys).toEqual(settingsFor("Webhooks").filter((name) => name !== "DATABASE_URL"));
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

  it("knows no settings for an unknown feature", () => {
    expect(settingsFor("Nope")).toEqual([]);
  });
});
