// Keeps render.yaml in step with the project, without a YAML library: the file is small and flat.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { settingsFor } from "./config.js";
import { PAYPAL_WEBHOOK_PATH } from "./webhooks/paypal-webhook.js";

const blueprint = readFileSync(new URL("../../../render.yaml", import.meta.url), "utf8");
const serverPackage = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { name: string; scripts: { start: string } };

function field(name: string): string | undefined {
  return new RegExp(`^\\s+${name}: (.+)$`, "m").exec(blueprint)?.[1];
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
    expect(PAYPAL_WEBHOOK_PATH.startsWith("/")).toBe(true);
  });

  it("asks in the dashboard for every setting the Webhooks feature needs, and stores no values", () => {
    const keys = [...blueprint.matchAll(/- key: (\S+)\n\s+sync: false/g)].map((m) => m[1]);
    expect(keys).toEqual(settingsFor("Webhooks"));
    expect(blueprint).not.toMatch(/key: PAYPAL_\w+\n\s+value:/);
  });

  it("knows no settings for an unknown feature", () => {
    expect(settingsFor("Nope")).toEqual([]);
  });
});
