import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, beforeEach } from "vitest";
import type { Database, Queryable, Row } from "./database.js";
import { migrate } from "./migrate.js";
import { MIGRATIONS } from "./migrations.js";
import { createUser, type User } from "./users.js";
import { createDeal, type NewDeal } from "./deals.js";
import { acceptTerms, documentFingerprint, requestAcceptance } from "./acceptance.js";
import { saveScopeVersion, type ScopeContentInput } from "./scope.js";
import { addArtifact } from "./artifacts.js";
import { postgresContentStore } from "./content-store.js";

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

/** The test deal with a short chat (test file 500) saved by its seller at `at`, to draft from. */
export async function createTestDealWithChat(db: Database, at: Date) {
  const deal = await createTestDeal(db);
  const file = await addArtifact(
    db,
    postgresContentStore(db, () => TEST_NOW),
    {
      id: testId(500),
      dealId: deal.dealId,
      kind: "source",
      filename: "chat.txt",
      bytes: new TextEncoder().encode("Maya: a logo for $250"),
      addedBy: { actor: "seller", actorId: deal.seller.id },
    },
    at,
  );
  return { ...deal, file };
}

/**
 * The test deal (id 100) sent to its buyer for signing: version 1 of the agreed work with two
 * payment stages (120.00 and 130.00 USD) and, when given, a number of revisions or line marks;
 * the acceptance requested at `TEST_NOW` for the stand-in document `{ format: 1, version: 1 }`.
 */
export async function createAwaitingTestDeal(
  db: Database,
  terms: Pick<ScopeContentInput, "revisionsIncluded" | "deliverableKinds"> = {},
) {
  const { seller, buyer, dealId } = await createTestDeal(db);
  const { scope } = await saveScopeVersion(
    db,
    {
      dealId,
      sellerId: seller.id,
      content: {
        format: 1,
        summary: "A character illustration",
        deliverables: ["Full-body character, transparent PNG"],
        exclusions: [],
        ...terms,
        milestones: [
          { title: "Deposit", amountMinor: 12_000 },
          { title: "Final files", amountMinor: 13_000, dueDate: "2026-11-27" },
        ],
      },
    },
    TEST_NOW,
  );
  const document = { format: 1, version: 1 };
  await requestAcceptance(
    db,
    {
      dealId,
      sellerId: seller.id,
      version: 1,
      contentSha256: scope.contentSha256,
      documentSha256: documentFingerprint(document),
    },
    TEST_NOW,
  );
  return { seller, buyer, dealId, scope, document };
}

/** The test deal of `createAwaitingTestDeal`, signed by its buyer at `TEST_NOW`. */
export async function createSignedTestDeal(
  db: Database,
  terms: Pick<ScopeContentInput, "revisionsIncluded" | "deliverableKinds"> = {},
) {
  const { seller, buyer, dealId, scope, document } = await createAwaitingTestDeal(db, terms);
  const { acceptance } = await acceptTerms(
    db,
    {
      dealId,
      buyerId: buyer.id,
      version: 1,
      contentSha256: scope.contentSha256,
      document,
      noticeVersion: 1,
      typedName: "Chris Buyer",
      access: "link",
    },
    TEST_NOW,
  );
  return { seller, buyer, dealId, scope, acceptance };
}
