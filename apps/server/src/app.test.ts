import { describe, expect, it } from "vitest";
import { buildApp } from "./app.js";
import { loadConfig } from "./config.js";

describe("config", () => {
  it("lists missing variables without exposing values", () => {
    const status = loadConfig({ PORT: "4000", PAYPAL_SELLER_CLIENT_ID: "x" });
    expect(status.port).toBe(4000);
    expect(status.missing).not.toContain("PAYPAL_SELLER_CLIENT_ID");
    expect(status.missing).toContain("PAYPAL_SELLER_CLIENT_SECRET");
  });

  it("rejects an invalid port", () => {
    expect(() => loadConfig({ PORT: "abc" })).toThrow(/PORT/);
  });
});

describe("GET /health", () => {
  it("returns ok and the missing variable names", async () => {
    const app = buildApp({ port: 0, missing: ["DATABASE_URL"] }, { logger: false });
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      status: "ok",
      service: "pactpal-server",
      missingEnv: ["DATABASE_URL"],
    });
    await app.close();
  });
});
