import { describe, expect, it } from "vitest";
import { buildApp } from "./app.js";

describe("GET /health", () => {
  it("returns ok and the missing variable names", async () => {
    const app = buildApp(
      {
        settings: [
          { name: "PAYPAL_SELLER_CLIENT_ID", set: true },
          { name: "PAYPAL_WEBHOOK_ID", set: false },
        ],
        features: [],
      },
      { logger: false },
    );
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      status: "ok",
      service: "pactpal-server",
      missingEnv: ["PAYPAL_WEBHOOK_ID"],
    });
    await app.close();
  });
});
