import { describe, expect, it } from "vitest";
import { EventEmitter } from "node:events";
import { buildApp, closeOnSignals } from "./app.js";

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

describe("closeOnSignals", () => {
  function setup(close: () => Promise<undefined>) {
    const signals = new EventEmitter();
    const exits: number[] = [];
    const logs: string[] = [];
    const app = {
      close,
      log: { info: (m: string) => logs.push(m), error: () => logs.push("error") },
    } as unknown as Parameters<typeof closeOnSignals>[0];
    closeOnSignals(app, signals, (code) => exits.push(code));
    return { signals, exits, logs };
  }

  it("closes the server and exits cleanly when asked to stop", async () => {
    const { signals, exits, logs } = setup(() => Promise.resolve(undefined));
    signals.emit("SIGTERM");
    await new Promise((resolve) => setImmediate(resolve));
    expect(exits).toEqual([0]);
    expect(logs).toEqual(["SIGTERM received; closing"]);
  });

  it("exits with an error code if closing fails", async () => {
    const { signals, exits } = setup(() => Promise.reject(new Error("stuck")));
    signals.emit("SIGINT");
    await new Promise((resolve) => setImmediate(resolve));
    expect(exits).toEqual([1]);
  });
});
