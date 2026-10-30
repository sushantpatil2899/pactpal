import { migrate, type Database, type Migration } from "@pactpal/db";
import { useTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { EventEmitter } from "node:events";
import { buildApp, closeOnSignals } from "./app.js";
import type { ConfigReport } from "./config.js";

const report: ConfigReport = {
  settings: [],
  features: [
    { name: "Webhooks", missing: ["PAYPAL_WEBHOOK_ID"], runtime: true },
    { name: "Database", missing: ["PAYPAL_WEBHOOK_ID", "DATABASE_URL"], runtime: true },
    { name: "Test setup script", missing: ["PAYPAL_BUYER_BIZ_CLIENT_ID"], runtime: false },
  ],
};

/** A database that is down: every query fails. Records whether it was closed. */
function downDatabase() {
  const state = { closed: false };
  const fail = () => Promise.reject(new Error("connection refused"));
  const database: Database = {
    query: fail,
    transaction: fail,
    close: () => {
      state.closed = true;
      return Promise.resolve();
    },
  };
  return { database, state };
}

describe("GET /health", () => {
  it("returns ok and the variables the running server is missing, without test-script ones", async () => {
    const app = buildApp(report, { logger: false });
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      status: "ok",
      service: "pactpal-server",
      missingEnv: ["PAYPAL_WEBHOOK_ID", "DATABASE_URL"],
    });
    await app.close();
  });

  it("stays ok when the database is down", async () => {
    const app = buildApp(report, { logger: false, database: downDatabase().database });
    expect((await app.inject({ method: "GET", url: "/health" })).statusCode).toBe(200);
    await app.close();
  });
});

describe("GET /ready", () => {
  const first: Migration = { id: "0001_first", sql: "CREATE TABLE one (id int)" };
  const second: Migration = { id: "0002_second", sql: "CREATE TABLE two (id int)" };
  const db = useTestDatabase();

  const ready = async (opts: Parameters<typeof buildApp>[1]) => {
    const app = buildApp(report, { logger: false, ...opts });
    const res = await app.inject({ method: "GET", url: "/ready" });
    return { status: res.statusCode, body: res.json<unknown>() };
  };

  it("is not ready, and says so, when no database is configured", async () => {
    expect(await ready({})).toEqual({
      status: 503,
      body: { status: "not ready", database: "not configured" },
    });
  });

  it("is ready when the database answers and has every migration", async () => {
    await migrate(db, [first]);
    expect(await ready({ database: db, migrations: [first] })).toEqual({
      status: 200,
      body: { status: "ready", database: "ok", migrations: 1 },
    });
  });

  it("is not ready, and names what is missing, when the database is behind", async () => {
    await migrate(db, [first]);
    expect(await ready({ database: db, migrations: [first, second] })).toEqual({
      status: 503,
      body: { status: "not ready", database: "behind", pendingMigrations: ["0002_second"] },
    });
  });

  it("is not ready when the database cannot be reached", async () => {
    expect(await ready({ database: downDatabase().database })).toEqual({
      status: 503,
      body: { status: "not ready", database: "unavailable" },
    });
  });

  it("closes the database when the server closes", async () => {
    const { database, state } = downDatabase();
    const app = buildApp(report, { logger: false, database });
    await app.close();
    expect(state.closed).toBe(true);
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
