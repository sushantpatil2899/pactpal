import { describe, expect, it } from "vitest";
import type { Row } from "./database.js";
import {
  MIGRATIONS,
  appendLedgerEvent,
  connectPostgres,
  createDeal,
  databaseFromPool,
  migrate,
  migrationStatus,
  verifyStoredLedger,
  type PgClient,
  type PgPool,
} from "./index.js";
import { TEST_NOW, createTestParties, testDeal, testId } from "./testing.js";

type Call = [string, unknown[] | undefined];

function fakePool(options: { failOn?: string; failRollback?: boolean } = {}) {
  const calls: Call[] = [];
  const events: string[] = [];
  const listeners: ((error: Error) => void)[] = [];
  const run = (sql: string, params?: unknown[]): Promise<{ rows: Row[] }> => {
    calls.push([sql, params]);
    if (sql === options.failOn) return Promise.reject(new Error("statement failed"));
    if (sql === "ROLLBACK" && options.failRollback) return Promise.reject(new Error("no rollback"));
    return Promise.resolve({ rows: [{ answer: 42 }] });
  };
  const client: PgClient = { query: run, release: () => events.push("released") };
  const pool: PgPool = {
    query: run,
    connect: () => Promise.resolve(client),
    end: () => {
      events.push("ended");
      return Promise.resolve();
    },
    on: (_event, listener) => listeners.push(listener),
  };
  return { pool, calls, events, listeners };
}

describe("databaseFromPool", () => {
  it("runs a query on the pool and returns its rows", async () => {
    const { pool, calls } = fakePool();
    const db = databaseFromPool(pool, () => undefined);
    expect(await db.query("SELECT $1", [7])).toEqual([{ answer: 42 }]);
    expect(await db.query("SELECT 1")).toEqual([{ answer: 42 }]);
    expect(calls).toEqual([
      ["SELECT $1", [7]],
      ["SELECT 1", undefined],
    ]);
  });

  it("commits a transaction on one connection and gives the connection back", async () => {
    const { pool, calls, events } = fakePool();
    const db = databaseFromPool(pool, () => undefined);
    const result = await db.transaction(async (tx) => (await tx.query("SELECT 2"))[0]?.answer);
    expect(result).toBe(42);
    expect(calls.map(([sql]) => sql)).toEqual(["BEGIN", "SELECT 2", "COMMIT"]);
    expect(events).toEqual(["released"]);
  });

  it("rolls back and rethrows the original error when the work fails", async () => {
    const { pool, calls, events } = fakePool();
    const db = databaseFromPool(pool, () => undefined);
    await expect(db.transaction(() => Promise.reject(new Error("work failed")))).rejects.toThrow(
      "work failed",
    );
    expect(calls.map(([sql]) => sql)).toEqual(["BEGIN", "ROLLBACK"]);
    expect(events).toEqual(["released"]);
  });

  it("reports a failed rollback without hiding the original error", async () => {
    const { pool } = fakePool({ failRollback: true });
    const reported: string[] = [];
    const db = databaseFromPool(pool, (error) => reported.push(error.message));
    await expect(db.transaction(() => Promise.reject(new Error("work failed")))).rejects.toThrow(
      "work failed",
    );
    expect(reported).toEqual(["no rollback"]);
  });

  it("hands errors from idle connections to the error callback and closes the pool", async () => {
    const { pool, listeners, events } = fakePool();
    const reported: string[] = [];
    const db = databaseFromPool(pool, (error) => reported.push(error.message));
    listeners[0]?.(new Error("connection reset"));
    await db.close();
    expect(reported).toEqual(["connection reset"]);
    expect(events).toEqual(["ended"]);
  });
});

describe("connectPostgres", () => {
  it("does not connect until the first query", async () => {
    const db = connectPostgres({
      url: "postgres://user:secret@127.0.0.1:1/none",
      onError: () => undefined,
      maxConnections: 1,
    });
    await db.close();
  });
});

// Runs only when a real Postgres is available (CI starts one; set TEST_DATABASE_URL locally).
const realUrl = process.env.TEST_DATABASE_URL;
describe.skipIf(realUrl === undefined)("real Postgres", () => {
  it("applies the migrations, enforces the append-only guard and works in transactions", async () => {
    const errors: Error[] = [];
    const db = connectPostgres({ url: realUrl ?? "", onError: (error) => errors.push(error) });
    try {
      await db.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public");
      await migrate(db, MIGRATIONS);
      expect(await migrationStatus(db, MIGRATIONS)).toEqual({
        upToDate: true,
        applied: MIGRATIONS.length,
      });
      await db.query(`CREATE TABLE log (note text);
        CREATE TRIGGER log_append_only BEFORE UPDATE OR DELETE ON log
          FOR EACH ROW EXECUTE FUNCTION pactpal_forbid_change()`);
      await db.transaction((tx) => tx.query("INSERT INTO log (note) VALUES ($1)", ["kept"]));
      await expect(
        db.transaction(async (tx) => {
          await tx.query("INSERT INTO log (note) VALUES ($1)", ["undone"]);
          throw new Error("stop");
        }),
      ).rejects.toThrow("stop");
      await expect(db.query("DELETE FROM log")).rejects.toThrow(/append-only/);
      expect(await db.query("SELECT note FROM log")).toEqual([{ note: "kept" }]);
      expect(errors).toEqual([]);
    } finally {
      await db.close();
    }
  });

  it("keeps one unbroken ledger when many writers append to the same deal at once", async () => {
    const db = connectPostgres({ url: realUrl ?? "", onError: () => undefined });
    try {
      await db.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public");
      await migrate(db, MIGRATIONS);
      const { seller } = await createTestParties(db);
      await createDeal(db, testDeal(seller.id), TEST_NOW);

      const writers = Array.from({ length: 20 }, (_, n) =>
        db.transaction((tx) =>
          appendLedgerEvent(
            tx,
            {
              dealId: testId(100),
              type: "NOTE_ADDED",
              actor: "seller",
              actorId: seller.id,
              payload: { n },
            },
            new Date(TEST_NOW.getTime() + n),
          ),
        ),
      );
      const entries = await Promise.all(writers);

      expect(entries.map((entry) => entry.seq).sort((a, b) => a - b)).toEqual(
        Array.from({ length: 20 }, (_, n) => n + 1),
      );
      expect(await verifyStoredLedger(db, testId(100))).toMatchObject({ valid: true, length: 21 });
    } finally {
      await db.close();
    }
  });
});
