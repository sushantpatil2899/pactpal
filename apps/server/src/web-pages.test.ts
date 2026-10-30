import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { buildApp } from "./app.js";

const root = mkdtempSync(join(tmpdir(), "pactpal-web-"));
mkdirSync(join(root, "assets"));
writeFileSync(join(root, "index.html"), "<!doctype html><title>PactPal</title>");
writeFileSync(join(root, "assets", "app-1a2b.js"), "console.log(1)");

const app = buildApp({ settings: [], features: [] }, { logger: false, webDir: root });
afterAll(() => app.close());
const get = (url: string) => app.inject({ method: "GET", url });

describe("web pages", () => {
  it("serves the app's page at the site's address, always re-checked, with security headers", async () => {
    const res = await get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("<title>PactPal</title>");
    expect(res.headers["cache-control"]).toBe("no-cache");
    expect(res.headers["content-security-policy"]).toContain("script-src 'self'");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("caches asset files, whose names change with their content, for a year", async () => {
    const res = await get("/assets/app-1a2b.js");
    expect(res.statusCode).toBe(200);
    expect(res.headers["cache-control"]).toBe("public, max-age=31536000, immutable");
  });

  it.each(["/deals/123", "/settings?tab=1"])(
    "answers the app's page for %s, which routes itself",
    async (url) => {
      const res = await get(url);
      expect(res.statusCode).toBe(200);
      expect(res.body).toContain("<title>PactPal</title>");
    },
  );

  it.each(["/missing.js", "/api/nothing", "/auth/nothing", "/webhooks/nothing"])(
    "answers 404 for %s, which is not a page",
    async (url) => {
      const res = await get(url);
      expect(res.statusCode).toBe(404);
      expect(res.json()).toEqual({ error: "not found" });
    },
  );

  it("does not answer a page for other methods, and keeps the server's own routes", async () => {
    expect((await app.inject({ method: "POST", url: "/deals" })).statusCode).toBe(404);
    expect((await get("/health")).json()).toMatchObject({ status: "ok" });
  });
});
