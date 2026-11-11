import { describe, expect, it } from "vitest";
import { buildApp } from "./app.js";
import { canonicalRedirect } from "./canonical-host.js";
import { loadConfig } from "./config.js";

const SITE = "https://pact-pal.app";
const OLD = "pactpal-server.onrender.com";
const move = (method: string, url: string, host = OLD, site: string | undefined = SITE) =>
  canonicalRedirect({ method, host, url }, site);

describe("moving pages to the site's own address (9i)", () => {
  it("sends a page opened on the old name to the same path and query on the site", () => {
    expect(move("GET", "/deals/1?tab=chat")).toBe("https://pact-pal.app/deals/1?tab=chat");
    expect(move("HEAD", "/")).toBe("https://pact-pal.app/");
    expect(move("GET", "/link", "PACTPAL-SERVER.ONRENDER.COM")).toBe("https://pact-pal.app/link");
  });

  it("serves notifications, agents, the API, health, logos and anything not a page read where they are", () => {
    for (const url of [
      "/webhooks/paypal",
      "/mcp",
      "/api/deals",
      "/health",
      "/ready",
      "/brand/logo-email.png",
    ]) {
      expect(move("GET", url)).toBeUndefined();
    }
    expect(move("POST", "/deals/1")).toBeUndefined();
  });

  it("leaves the site's own name, a local copy and an unset address alone", () => {
    expect(move("GET", "/", "pact-pal.app")).toBeUndefined();
    expect(move("GET", "/", "localhost:3000")).toBeUndefined();
    expect(move("GET", "/", "127.0.0.1:3000")).toBeUndefined();
    expect(canonicalRedirect({ method: "GET", host: OLD, url: "/" }, undefined)).toBeUndefined();
    expect(move("GET", "/", "localhost:3000", "http://localhost:3000")).toBeUndefined();
  });

  it("answers a page on the old name with a permanent move, and health with no move", async () => {
    const loaded = loadConfig({});
    if (!loaded.ok) throw new Error("expected empty settings to load");
    const app = buildApp(loaded.report, {
      logger: false,
      signIn: {
        login: undefined,
        database: undefined,
        publicBaseUrl: SITE,
        clock: () => new Date(),
        newId: () => "x",
      },
    });
    const page = await app.inject({ method: "GET", url: "/deals?x=1", headers: { host: OLD } });
    expect(page.statusCode).toBe(301);
    expect(page.headers.location).toBe("https://pact-pal.app/deals?x=1");
    const health = await app.inject({ method: "GET", url: "/health", headers: { host: OLD } });
    expect(health.statusCode).toBe(200);
    await app.close();
  });
});
