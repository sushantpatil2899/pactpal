import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, beforeEach, expect } from "vitest";
import type { Database, Queryable, Row } from "./database.js";
import { migrate } from "./migrate.js";
import { MIGRATIONS } from "./migrations.js";
import { createUser, type User } from "./users.js";
import { createDeal, type NewDeal } from "./deals.js";
import { acceptTerms, documentFingerprint, requestAcceptance } from "./acceptance.js";
import { saveScopeVersion, type ScopeContentInput } from "./scope.js";
import { addArtifact, type ArtifactKind } from "./artifacts.js";
import { postgresContentStore } from "./content-store.js";
import { markInvoicePaid, markInvoiceSent, startInvoice } from "./milestones.js";
import { recordDispute } from "./disputes.js";

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

/** A file added to a test deal by its seller (`deal` as the test deal makers return it). */
export function addTestFile(
  db: Database,
  deal: { dealId: string; seller: { id: string } },
  file: { id: string; kind: ArtifactKind; filename: string; bytes: Uint8Array },
  at: Date,
) {
  return addArtifact(
    db,
    postgresContentStore(db, () => TEST_NOW),
    { ...file, dealId: deal.dealId, addedBy: { actor: "seller", actorId: deal.seller.id } },
    at,
  );
}

/** The test deal with a short chat (test file 500) saved by its seller at `at`, to draft from. */
export async function createTestDealWithChat(db: Database, at: Date) {
  const deal = await createTestDeal(db);
  const file = await addTestFile(
    db,
    deal,
    {
      id: testId(500),
      kind: "source",
      filename: "chat.txt",
      bytes: new TextEncoder().encode("Maya: a logo for $250"),
    },
    at,
  );
  return { ...deal, file };
}

/** `TEST_NOW` plus some minutes. */
export const minutesAfterTestNow = (minutes: number) =>
  new Date(TEST_NOW.getTime() + minutes * 60_000);

/** Matches a refusal error of the named class with this reason, for `rejects.toEqual`. */
export const refusalMatching = (name: string, reason: string) =>
  expect.objectContaining({ name, reason }) as unknown;

/** Makes either kind of test deal waiting on, or past, the buyer's signature. */
export type TestDealMaker = typeof createAwaitingTestDeal | typeof createSignedTestDeal;

/**
 * The test deal (id 100) sent to its buyer for signing: version 1 of the agreed work with two
 * payment stages (120.00 and 130.00 USD) and, when given, a number of revisions or line marks;
 * the acceptance requested at `TEST_NOW` for the stand-in document `{ format: 1, version: 1 }`.
 */
export async function createAwaitingTestDeal(
  db: Database,
  terms: Pick<ScopeContentInput, "revisionsIncluded" | "deliverableKinds" | "timeline"> = {},
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
  terms: Pick<ScopeContentInput, "revisionsIncluded" | "deliverableKinds" | "timeline"> = {},
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

/**
 * The signed test deal with stage 1 invoiced and paid at `TEST_NOW`: PayPal invoice
 * `INV2-TEST-PAID`, transaction `transactionId` and, when given, invoice number `invoiceNumber`.
 */
export async function createPaidTestDeal(
  db: Database,
  payment: { transactionId?: string; invoiceNumber?: string } = {},
  terms: Parameters<typeof createSignedTestDeal>[1] = {},
) {
  const deal = await createSignedTestDeal(db, terms);
  const stage = { dealId: deal.dealId, version: 1, stage: 1 };
  const invoiceId = "INV2-TEST-PAID";
  await startInvoice(
    db,
    {
      ...stage,
      sellerId: deal.seller.id,
      amountMinor: 12_000,
      currency: "USD",
      requestId: `pp-${deal.dealId}-v1-s1`,
      invoiceSha256: "a".repeat(64),
    },
    TEST_NOW,
  );
  await markInvoiceSent(
    db,
    {
      ...stage,
      sellerId: deal.seller.id,
      invoiceId,
      transport: "rest",
      recipientEmail: deal.buyer.email,
      contentSha256: deal.scope.contentSha256,
    },
    TEST_NOW,
  );
  await markInvoicePaid(
    db,
    {
      ...stage,
      invoiceId,
      ...(payment.invoiceNumber === undefined ? {} : { invoiceNumber: payment.invoiceNumber }),
      paidAmount: { minor: 12_000, currency: "USD" },
      transactions: [{ paymentId: payment.transactionId ?? "4VS53548AF878232T" }],
      source: "status-check",
    },
    TEST_NOW,
  );
  return { ...deal, invoiceId };
}

/** Dispute PP-R-TEST-1 (open, nothing allowed), tied to stage 1 of a test deal at `at`. */
export const linkTestDispute = (db: Database, dealId: string, at: Date) =>
  recordDispute(
    db,
    { disputeId: "PP-R-TEST-1", status: "OPEN", allowedActions: [], offerTypes: [], details: {} },
    { dealId, stage: 1, invoiceId: "INV2-TEST-PAID", matchedBy: "transaction" },
    at,
  );
