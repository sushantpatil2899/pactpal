import { describe, expect, it } from "vitest";
import type { Database, Row } from "./database.js";
import {
  ArtifactRejectedError,
  MIGRATIONS,
  addArtifact,
  appendLedgerEvent,
  connectPostgres,
  createDeal,
  databaseFromPool,
  getArtifact,
  listArtifacts,
  migrate,
  migrationStatus,
  postgresContentStore,
  verifyStoredLedger,
  type PgClient,
  type PgPool,
} from "./index.js";
import { TEST_NOW, createTestDeal, createTestParties, testDeal, testId } from "./testing.js";

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

/** Runs `work` on an emptied real database with every migration applied, then disconnects. */
async function withRealDatabase(work: (db: Database, errors: Error[]) => Promise<void>) {
  const errors: Error[] = [];
  const db = connectPostgres({ url: realUrl ?? "", onError: (error) => errors.push(error) });
  try {
    await db.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public");
    await migrate(db, MIGRATIONS);
    await work(db, errors);
  } finally {
    await db.close();
  }
}

describe.skipIf(realUrl === undefined)("real Postgres", () => {
  it("applies the migrations, enforces the append-only guard and works in transactions", async () => {
    await withRealDatabase(async (db, errors) => {
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
    });
  });

  it("keeps one unbroken ledger when many writers append to the same deal at once", async () => {
    await withRealDatabase(async (db) => {
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
    });
  });

  it("stores a 10 MB file unchanged and keeps a deal within its size limit under simultaneous uploads", async () => {
    await withRealDatabase(async (db) => {
      const { seller } = await createTestDeal(db);
      const store = postgresContentStore(db, () => TEST_NOW);
      const upload = (
        n: number,
        bytes: Uint8Array,
        limits?: { maxFileBytes: number; maxDealBytes: number },
      ) =>
        addArtifact(
          db,
          store,
          {
            id: testId(500 + n),
            dealId: testId(100),
            kind: "deliverable",
            filename: `file-${n}.bin`,
            bytes,
            addedBy: { actor: "seller", actorId: seller.id },
          },
          new Date(TEST_NOW.getTime() + n),
          limits,
        );

      const big = new Uint8Array(10 * 1024 * 1024);
      for (let i = 0; i < big.length; i++) big[i] = (i * 7) % 251;
      await upload(0, big);
      const stored = await getArtifact(db, store, testId(500));
      // Compared as a whole: `toEqual` would walk ten million elements.
      expect(Buffer.from(stored.bytes).equals(big)).toBe(true);

      // Room for three more 1 MB files (the 10 MB file already counts), six arrive at once.
      const limits = { maxFileBytes: 10 * 1024 * 1024, maxDealBytes: 13 * 1024 * 1024 };
      const results = await Promise.allSettled(
        Array.from({ length: 6 }, (_, n) =>
          upload(n + 1, new Uint8Array(1024 * 1024).fill(n + 1), limits),
        ),
      );
      const refused = results.filter((r) => r.status === "rejected");
      expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(3);
      expect(refused).toHaveLength(3);
      for (const r of refused) expect(r.reason).toBeInstanceOf(ArtifactRejectedError);
      expect(await listArtifacts(db, testId(100))).toHaveLength(4);
      expect(await verifyStoredLedger(db, testId(100))).toMatchObject({ valid: true, length: 5 });
    });
  });
});
