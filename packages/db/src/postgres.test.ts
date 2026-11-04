import { describe, expect, it } from "vitest";
import type { Database, Row } from "./database.js";
import {
  ArtifactRejectedError,
  MIGRATIONS,
  acceptChangeOrder,
  acceptTerms,
  answerQuestion,
  askQuestion,
  forwardQuestion,
  answerDelivery,
  addArtifact,
  appendLedgerEvent,
  connectPostgres,
  createDeal,
  databaseFromPool,
  documentFingerprint,
  finishDraft,
  markInvoicePaid,
  markInvoiceSent,
  getArtifact,
  listArtifacts,
  migrate,
  migrationStatus,
  getScopeVersion,
  postgresContentStore,
  proposeChangeOrder,
  recordDeliveryViewed,
  recordWebhookEvent,
  requestAcceptance,
  saveScopeVersion,
  sendDelivery,
  startDraft,
  startInvoice,
  verifyStoredLedger,
  type PgClient,
  type PgPool,
} from "./index.js";
import {
  TEST_NOW,
  createAwaitingTestDeal,
  createSignedTestDeal,
  createTestDeal,
  createTestParties,
  testDeal,
  testId,
} from "./testing.js";

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

  it("numbers agreed-work versions 1 to 5 when five saves arrive at once", async () => {
    await withRealDatabase(async (db) => {
      const { seller } = await createTestDeal(db);
      const saves = Array.from({ length: 5 }, (_, n) =>
        saveScopeVersion(
          db,
          {
            dealId: testId(100),
            sellerId: seller.id,
            content: {
              format: 1,
              summary: `Save ${String(n)}`,
              deliverables: ["Logo"],
              exclusions: [],
              milestones: [{ title: "All", amountMinor: 100 }],
            },
          },
          new Date(TEST_NOW.getTime() + n),
        ),
      );
      const versions = (await Promise.all(saves)).map(({ scope }) => scope.version);
      expect(versions.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
      expect(await verifyStoredLedger(db, testId(100))).toMatchObject({ valid: true, length: 6 });
    });
  });

  it("counts one new event, and the rest repeats, when the same notification arrives ten times at once", async () => {
    await withRealDatabase(async (db) => {
      const event = {
        source: "paypal",
        eventId: "WH-1",
        eventType: "INVOICING.INVOICE.PAID",
        body: { id: "WH-1" },
      };
      const results = await Promise.all(
        Array.from({ length: 10 }, () => recordWebhookEvent(db, event, TEST_NOW)),
      );
      expect(results.filter((result) => result === "new")).toHaveLength(1);
      expect(results.filter((result) => result === "repeat")).toHaveLength(9);
      expect(await db.query("SELECT 1 FROM webhook_events")).toHaveLength(1);
    });
  });

  it("starts one draft, and finishes one draft once, when requests arrive at the same time", async () => {
    await withRealDatabase(async (db) => {
      const { seller } = await createTestDeal(db);
      const artifact = await addArtifact(
        db,
        postgresContentStore(db, () => TEST_NOW),
        {
          id: testId(500),
          dealId: testId(100),
          kind: "source",
          filename: "chat.txt",
          bytes: new TextEncoder().encode("Maya: hello"),
          addedBy: { actor: "seller", actorId: seller.id },
        },
        TEST_NOW,
      );
      const start = (n: number) =>
        startDraft(
          db,
          {
            id: testId(900 + n),
            dealId: testId(100),
            sellerId: seller.id,
            sourceArtifactId: artifact.id,
            sourceSha256: artifact.sha256,
            draftPromptVersion: 1,
            rankPromptVersion: 1,
          },
          TEST_NOW,
        );
      const started = await Promise.allSettled(Array.from({ length: 6 }, (_, n) => start(n)));
      expect(started.filter((r) => r.status === "fulfilled")).toHaveLength(1);
      expect(started.filter((r) => r.status === "rejected")).toHaveLength(5);

      const winner =
        started.flatMap((r) => (r.status === "fulfilled" ? [r.value.id] : []))[0] ?? "";
      const finish = () =>
        finishDraft(
          db,
          { draftId: winner, draft: { format: 2 }, council: {}, ledgerPayload: {} },
          TEST_NOW,
        );
      const finished = await Promise.allSettled([finish(), finish(), finish()]);
      expect(finished.filter((r) => r.status === "fulfilled")).toHaveLength(1);
      // The deal's ledger holds the file, exactly one draft entry, and still verifies.
      expect(await verifyStoredLedger(db, testId(100))).toMatchObject({ valid: true, length: 3 });
    });
  });

  it("records one acceptance when the buyer signs from two tabs at once", async () => {
    await withRealDatabase(async (db) => {
      const { seller, buyer } = await createTestDeal(db);
      const { scope } = await saveScopeVersion(
        db,
        {
          dealId: testId(100),
          sellerId: seller.id,
          content: {
            format: 1,
            summary: "Logo",
            deliverables: ["Logo"],
            exclusions: [],
            milestones: [{ title: "All", amountMinor: 100 }],
          },
        },
        TEST_NOW,
      );
      const document = { format: 1, version: 1 };
      await requestAcceptance(
        db,
        {
          dealId: testId(100),
          sellerId: seller.id,
          version: 1,
          contentSha256: scope.contentSha256,
          documentSha256: documentFingerprint(document),
        },
        TEST_NOW,
      );
      const sign = () =>
        acceptTerms(
          db,
          {
            dealId: testId(100),
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
      const results = await Promise.allSettled([sign(), sign(), sign()]);
      expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
      expect(await db.query("SELECT 1 FROM acceptances")).toHaveLength(1);
      expect(await verifyStoredLedger(db, testId(100))).toMatchObject({ valid: true, length: 4 });
    });
  });

  it("reserves a stage once and records its invoice once when both arrive several times at once", async () => {
    await withRealDatabase(async (db) => {
      const { seller, scope } = await createSignedTestDeal(db);
      const key = { dealId: testId(100), sellerId: seller.id, version: 1, stage: 1 };
      const started = await Promise.all(
        Array.from({ length: 4 }, () =>
          startInvoice(
            db,
            {
              ...key,
              amountMinor: 12_000,
              currency: "USD",
              requestId: "pp-test-v1-s1",
              invoiceSha256: "a".repeat(64),
            },
            TEST_NOW,
          ),
        ),
      );
      expect(new Set(started.map((m) => m.requestId)).size).toBe(1);
      const sent = await Promise.all(
        Array.from({ length: 4 }, () =>
          markInvoiceSent(
            db,
            {
              ...key,
              invoiceId: "INV2-ONE",
              transport: "rest",
              recipientEmail: "chris@example.com",
              contentSha256: scope.contentSha256,
            },
            TEST_NOW,
          ),
        ),
      );
      expect(sent.filter((r) => r.entry !== undefined)).toHaveLength(1);
      expect(await db.query("SELECT 1 FROM milestones")).toHaveLength(1);
      expect(await verifyStoredLedger(db, testId(100))).toMatchObject({ valid: true });
    });
  });

  it("records one payment when PayPal's notification and a status check arrive at once", async () => {
    await withRealDatabase(async (db) => {
      const { seller, scope } = await createSignedTestDeal(db);
      const key = { dealId: testId(100), version: 1, stage: 1 };
      await startInvoice(
        db,
        {
          ...key,
          sellerId: seller.id,
          amountMinor: 12_000,
          currency: "USD",
          requestId: "pp-pay-1",
          invoiceSha256: "a".repeat(64),
        },
        TEST_NOW,
      );
      await markInvoiceSent(
        db,
        {
          ...key,
          sellerId: seller.id,
          invoiceId: "INV2-PAY",
          transport: "rest",
          recipientEmail: "chris@example.com",
          contentSha256: scope.contentSha256,
        },
        TEST_NOW,
      );
      const results = await Promise.all(
        (["notification", "status-check", "notification"] as const).map((source) =>
          markInvoicePaid(
            db,
            {
              ...key,
              invoiceId: "INV2-PAY",
              paidAmount: { minor: 12_000, currency: "USD" },
              transactions: [],
              source,
            },
            TEST_NOW,
          ),
        ),
      );
      expect(results.filter((r) => r.entry !== undefined)).toHaveLength(1);
      expect(await verifyStoredLedger(db, testId(100))).toMatchObject({ valid: true });
    });
  });

  it("logs one opening, and keeps one answer, when the buyer uses several tabs at once", async () => {
    await withRealDatabase(async (db) => {
      const { seller, buyer } = await createSignedTestDeal(db);
      const file = await addArtifact(
        db,
        postgresContentStore(db, () => TEST_NOW),
        {
          id: testId(600),
          dealId: testId(100),
          kind: "deliverable",
          filename: "sketch.png",
          bytes: new TextEncoder().encode("sketch"),
          addedBy: { actor: "seller", actorId: seller.id },
        },
        TEST_NOW,
      );
      await sendDelivery(
        db,
        {
          id: testId(601),
          dealId: testId(100),
          sellerId: seller.id,
          version: 1,
          stage: 1,
          artifactIds: [file.id],
        },
        TEST_NOW,
      );
      const opened = await Promise.all(
        Array.from({ length: 4 }, () =>
          recordDeliveryViewed(
            db,
            { dealId: testId(100), deliveryId: testId(601), buyerId: buyer.id, access: "link" },
            TEST_NOW,
          ),
        ),
      );
      expect(opened.filter((entry) => entry !== undefined)).toHaveLength(1);
      // Two tabs answer the same delivery at once: only one answer is kept.
      const answers = await Promise.allSettled(
        (["approved", "changes"] as const).map((kind) =>
          answerDelivery(
            db,
            {
              dealId: testId(100),
              deliveryId: testId(601),
              buyerId: buyer.id,
              answer: kind === "approved" ? { kind } : { kind, request: "Smaller" },
            },
            TEST_NOW,
          ),
        ),
      );
      expect(answers.filter((r) => r.status === "fulfilled")).toHaveLength(1);
      expect(await db.query("SELECT 1 FROM delivery_answers")).toHaveLength(1);
      expect(await verifyStoredLedger(db, testId(100))).toMatchObject({ valid: true });
    });
  });

  it("keeps one waiting change, and one answer to it, when requests arrive at once", async () => {
    await withRealDatabase(async (db) => {
      const { seller, buyer, dealId } = await createSignedTestDeal(db);
      const v1 = (await getScopeVersion(db, dealId, 1))?.content;
      if (!v1) throw new Error("no version 1");
      const content = {
        ...v1,
        milestones: [...v1.milestones, { title: "Extra", amountMinor: 5_000 }],
      };
      // Three proposals at once: one waits, the others are refused.
      const proposals = await Promise.allSettled(
        [0, 1, 2].map((n) =>
          proposeChangeOrder(
            db,
            { id: testId(600 + n), dealId, sellerId: seller.id, content },
            TEST_NOW,
          ),
        ),
      );
      const made = proposals.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
      expect(made).toHaveLength(1);
      const [proposal] = made;
      if (!proposal) throw new Error("no proposal");
      // The buyer signs from three tabs at once: one acceptance of version 2.
      const signed = await Promise.allSettled(
        [0, 1, 2].map(() =>
          acceptChangeOrder(
            db,
            {
              dealId,
              buyerId: buyer.id,
              changeOrderId: proposal.changeOrder.id,
              version: proposal.scope.version,
              contentSha256: proposal.scope.contentSha256,
              document: { format: 1, version: proposal.scope.version },
              noticeVersion: 1,
              typedName: "Chris Buyer",
              access: "link",
            },
            TEST_NOW,
          ),
        ),
      );
      expect(signed.filter((r) => r.status === "fulfilled")).toHaveLength(1);
      expect(await db.query("SELECT version FROM acceptances ORDER BY version")).toEqual([
        { version: 1 },
        { version: 2 },
      ]);
      expect(await verifyStoredLedger(db, dealId)).toMatchObject({ valid: true });
    });
  });

  it("keeps one question being answered, and one seller answer, when requests arrive at once", async () => {
    await withRealDatabase(async (db) => {
      const { buyer, seller, dealId } = await createAwaitingTestDeal(db);
      const asked = await Promise.allSettled(
        [0, 1, 2].map((n) =>
          askQuestion(
            db,
            {
              id: testId(700 + n),
              dealId,
              buyerId: buyer.id,
              version: 1,
              documentSha256: "d".repeat(64),
              question: "Can I put this on t-shirts?",
            },
            TEST_NOW,
          ),
        ),
      );
      const made = asked.flatMap((r) => (r.status === "fulfilled" ? [r.value.question] : []));
      expect(made).toHaveLength(1);
      const [question] = made;
      if (!question) throw new Error("no question");
      await forwardQuestion(
        db,
        { dealId, questionId: question.id, reason: "not-in-agreement" },
        TEST_NOW,
      );
      const answers = await Promise.allSettled(
        ["Yes", "No"].map((answer) =>
          answerQuestion(
            db,
            { dealId, questionId: question.id, sellerId: seller.id, answer },
            TEST_NOW,
          ),
        ),
      );
      expect(answers.filter((r) => r.status === "fulfilled")).toHaveLength(1);
      expect(await verifyStoredLedger(db, dealId)).toMatchObject({ valid: true });
    });
  });
});
