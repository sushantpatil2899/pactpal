import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, beforeEach } from "vitest";
import type { Database, Queryable, Row } from "./database.js";
import { migrate } from "./migrate.js";
import { MIGRATIONS } from "./migrations.js";
import { createUser, type User } from "./users.js";
import { createDeal, type NewDeal } from "./deals.js";

/** The slice of PGlite (and of its transactions) that the adapter uses. */
interface Engine {
  query(sql: string, params?: unknown[]): Promise<{ rows: Row[] }>;
  exec(sql: string): Promise<{ rows: Row[] }[]>;
}

function queryOn(engine: Engine): Queryable["query"] {
  return async (sql, params) => {
    // PGlite runs several statements at once only without values, as `pg` does.
    if (params === undefined) return (await engine.exec(sql)).at(-1)?.rows ?? [];
    return (await engine.query(sql, [...params])).rows;
  };
}

export interface TestDatabase extends Database {
  /** Drops everything, giving the next test an empty database without paying the start-up cost again. */
  reset(): Promise<void>;
}

/**
 * A real Postgres running inside the test process (PGlite): nothing to install or start.
 * Starting one takes a few seconds, so create one per test file and call `reset()` between tests.
 * Test code only; one connection, so it cannot show how two writers at once behave.
 */
export async function createTestDatabase(): Promise<TestDatabase> {
  const engine = new PGlite();
  await engine.waitReady;
  return {
    reset: async () => {
      await engine.exec("DROP SCHEMA public CASCADE; CREATE SCHEMA public");
    },
    query: queryOn(engine),
    transaction: (work) => engine.transaction((tx) => work({ query: queryOn(tx) })),
    close: () => engine.close(),
  };
}

const START_TIMEOUT_MS = 60_000;

/**
 * For a test file: starts one test database before its tests, empties it before each test and
 * closes it afterwards. The returned object can be used like a `Database` inside the tests.
 */
export function useTestDatabase(): TestDatabase {
  let current: TestDatabase | undefined;
  const open = (): TestDatabase => {
    if (current === undefined) throw new Error("The test database is only available inside tests");
    return current;
  };
  beforeAll(async () => {
    current = await createTestDatabase();
  }, START_TIMEOUT_MS);
  beforeEach(() => open().reset());
  afterAll(() => open().close());
  return {
    query: (sql, params) => open().query(sql, params),
    transaction: (work) => open().transaction(work),
    reset: () => open().reset(),
    close: () => open().close(),
  };
}

/** Like `useTestDatabase`, and every migration is applied before each test. */
export function useMigratedTestDatabase(): TestDatabase {
  const db = useTestDatabase();
  beforeEach(async () => {
    await migrate(db, MIGRATIONS);
  });
  return db;
}

/** A fixed moment, so tests can compare server times exactly. */
export const TEST_NOW = new Date("2026-10-02T10:00:00.000Z");

/** A valid id for test number `n` (ids are uuids). */
export const testId = (n: number): string =>
  `00000000-0000-4000-8000-${n.toString().padStart(12, "0")}`;

/** A seller and a buyer, both users, for tests that need a deal. */
export async function createTestParties(q: Queryable): Promise<{ seller: User; buyer: User }> {
  const seller = await createUser(
    q,
    {
      id: testId(1),
      email: "maya@example.com",
      displayName: "Maya Seller",
      paypalPayerId: "PAYER1",
    },
    TEST_NOW,
  );
  const buyer = await createUser(q, { id: testId(2), email: "chris@example.com" }, TEST_NOW);
  return { seller, buyer };
}

/** A valid new deal for `sellerId`; override any field to test a rule. */
export const testDeal = (sellerId: string, overrides: Partial<NewDeal> = {}): NewDeal => ({
  id: testId(100),
  sellerId,
  title: "Logo design",
  category: "art-and-design",
  currency: "USD",
  ...overrides,
});

/** A seller, a buyer and a draft deal (test id 100) that already has its buyer. */
export async function createTestDeal(
  db: Database,
): Promise<{ seller: User; buyer: User; dealId: string }> {
  const { seller, buyer } = await createTestParties(db);
  const { deal } = await createDeal(db, testDeal(seller.id, { buyerId: buyer.id }), TEST_NOW);
  return { seller, buyer, dealId: deal.id };
}
