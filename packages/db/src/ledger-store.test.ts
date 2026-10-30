import type { JsonValue, NewEvent } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import type { Queryable } from "./database.js";
import {
  DealNotFoundError,
  LedgerActorError,
  LedgerConflictError,
  appendLedgerEvent,
  createDeal,
  readLedger,
  verifyStoredLedger,
} from "./index.js";
import {
  TEST_NOW,
  createTestParties,
  testDeal,
  testId,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();
const at = (minutes: number) => new Date(TEST_NOW.getTime() + minutes * 60_000);
const dealId = testId(100);

/** A seller, a buyer and a deal with the buyer already known. */
async function setUp() {
  const { seller, buyer } = await createTestParties(db);
  await createDeal(db, testDeal(seller.id, { buyerId: buyer.id }), TEST_NOW);
  return { seller, buyer };
}

const append = (event: Omit<NewEvent, "dealId">, now: Date) =>
  db.transaction((tx) => appendLedgerEvent(tx, { ...event, dealId }, now));

describe("appendLedgerEvent and readLedger", () => {
  it("adds entries one after another and verifies the whole chain", async () => {
    const { seller, buyer } = await setUp();
    await append(
      { type: "SCOPE_CONFIRMED", actor: "seller", actorId: seller.id, payload: { v: 1 } },
      at(1),
    );
    const accepted = await append(
      { type: "ACCEPTED", actor: "buyer", actorId: buyer.id, payload: { typedName: "Chris" } },
      at(2),
    );
    const entries = await readLedger(db, dealId);
    expect(entries.map(({ seq, type }) => [seq, type])).toEqual([
      [0, "DEAL_CREATED"],
      [1, "SCOPE_CONFIRMED"],
      [2, "ACCEPTED"],
    ]);
    expect(entries[2]?.prevHash).toBe(entries[1]?.entryHash);
    expect(await verifyStoredLedger(db, dealId)).toEqual({
      valid: true,
      head: accepted.entryHash,
      length: 3,
    });
  });

  it.each<[string, Omit<NewEvent, "dealId" | "actorId">, boolean, string?, string?]>([
    ["a system event without extras", { type: "NOTE_ADDED", actor: "system", payload: {} }, false],
    [
      "an event with address and device",
      { type: "ACCEPTED", actor: "buyer", payload: { typedName: "Chris" } },
      true,
      "2001:0db8:0000:0000:0000:0000:0000:0001",
      "Mozilla/5.0 (X11; Linux)",
    ],
  ])(
    "keeps %s byte for byte, so the hashes still match",
    async (_name, event, withActor, ip, userAgent) => {
      const { buyer } = await setUp();
      const saved = await append(
        { ...event, actorId: withActor ? buyer.id : undefined, ip, userAgent },
        at(1),
      );
      expect((await readLedger(db, dealId))[1]).toEqual(saved);
      expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
    },
  );

  it.each<[string, JsonValue]>([
    ["nested objects and arrays", { b: [1, { c: null }, "x"], a: { d: true } }],
    ["decimals and big numbers", { price: 12.5, big: 9007199254740991, tiny: 1e-7 }],
    ["text in other scripts", { name: "Zoë ‮ 山田", quote: 'say "hi"\n' }],
    ["an empty object", {}],
    ["an array at the top", [1, 2, 3]],
    ["a plain string", "just text"],
    ["null", null],
  ])("keeps a payload of %s so the entry still verifies", async (_name, payload) => {
    await setUp();
    await append({ type: "NOTE_ADDED", actor: "system", payload }, at(1));
    const stored = (await readLedger(db, dealId))[1];
    expect(stored?.payload).toEqual(payload);
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
  });

  it("keeps server times to the millisecond", async () => {
    await setUp();
    const saved = await append(
      { type: "NOTE_ADDED", actor: "system", payload: {} },
      new Date("2026-10-02T10:00:00.123Z"),
    );
    expect(saved.serverTime).toBe("2026-10-02T10:00:00.123Z");
    expect((await readLedger(db, dealId))[1]?.serverTime).toBe("2026-10-02T10:00:00.123Z");
  });

  it("returns nothing for a deal that has no entries", async () => {
    expect(await readLedger(db, testId(555))).toEqual([]);
    expect(await verifyStoredLedger(db, testId(555))).toEqual({
      valid: true,
      head: "0".repeat(64),
      length: 0,
    });
  });

  it("refuses an event for a deal that does not exist", async () => {
    await expect(
      db.transaction((tx) =>
        appendLedgerEvent(
          tx,
          { dealId: testId(555), type: "NOTE_ADDED", actor: "system", payload: {} },
          TEST_NOW,
        ),
      ),
    ).rejects.toThrow(DealNotFoundError);
  });
});

describe("who may act", () => {
  it.each<[string, Omit<NewEvent, "dealId">]>([
    [
      "a seller entry naming the buyer",
      { type: "NOTE_ADDED", actor: "seller", actorId: testId(2), payload: {} },
    ],
    [
      "a buyer entry naming the seller",
      { type: "ACCEPTED", actor: "buyer", actorId: testId(1), payload: {} },
    ],
    [
      "a buyer entry naming a stranger",
      { type: "ACCEPTED", actor: "buyer", actorId: testId(9), payload: {} },
    ],
    ["a seller entry naming nobody", { type: "NOTE_ADDED", actor: "seller", payload: {} }],
    [
      "a system entry naming a person",
      { type: "NOTE_ADDED", actor: "system", actorId: testId(1), payload: {} },
    ],
  ])("refuses %s", async (_name, event) => {
    await setUp();
    await expect(append(event, at(1))).rejects.toThrow(LedgerActorError);
    expect(await readLedger(db, dealId)).toHaveLength(1);
  });

  it("refuses a buyer entry while the deal has no buyer yet", async () => {
    const { seller } = await createTestParties(db);
    await createDeal(db, testDeal(seller.id), TEST_NOW);
    await expect(
      append({ type: "ACCEPTED", actor: "buyer", actorId: testId(2), payload: {} }, at(1)),
    ).rejects.toThrow(LedgerActorError);
  });
});

describe("two writers at once", () => {
  /** Hides the entries already written, as a writer that read the ledger a moment too early. */
  const staleReader = (tx: Queryable): Queryable => ({
    query: (sql, params) =>
      sql.includes("ORDER BY seq DESC") ? Promise.resolve([]) : tx.query(sql, params),
  });

  it("reports a taken position as a conflict and saves nothing", async () => {
    await setUp();
    await expect(
      db.transaction((tx) =>
        appendLedgerEvent(
          staleReader(tx),
          { dealId, type: "NOTE_ADDED", actor: "system", payload: {} },
          at(1),
        ),
      ),
    ).rejects.toThrow(LedgerConflictError);
    expect(await readLedger(db, dealId)).toHaveLength(1);
  });

  it("passes on other write errors unchanged", async () => {
    await setUp();
    const failing: Queryable = {
      query: (sql, params) =>
        sql.includes("INSERT INTO ledger_entries")
          ? Promise.reject(new Error("disk full"))
          : db.query(sql, params),
    };
    await expect(
      appendLedgerEvent(
        failing,
        { dealId, type: "NOTE_ADDED", actor: "system", payload: {} },
        at(1),
      ),
    ).rejects.toThrow("disk full");
  });
});

describe("the database's own protection", () => {
  it.each([
    ["editing an entry", "UPDATE ledger_entries SET payload = '{}'::jsonb"],
    ["deleting an entry", "DELETE FROM ledger_entries"],
    ["emptying the table", "TRUNCATE ledger_entries"],
  ])("refuses %s", async (_name, sql) => {
    await setUp();
    await expect(db.query(sql)).rejects.toThrow(/append-only/);
    expect(await readLedger(db, dealId)).toHaveLength(1);
  });

  it.each([
    ["a deal that has entries", "DELETE FROM deals"],
    ["a user who has entries", `DELETE FROM users WHERE id = '${testId(1)}'`],
  ])("refuses to delete %s", async (_name, sql) => {
    await setUp();
    await expect(db.query(sql)).rejects.toThrow(/foreign key/);
  });

  const insert = (overrides: { actor?: string; hash?: string; seq?: number }) =>
    db.query(
      `INSERT INTO ledger_entries (deal_id, seq, type, actor, payload, payload_hash, prev_hash,
                                   entry_hash, server_time)
       VALUES ($1, $2, 'NOTE_ADDED', $3, '{}'::jsonb, $4, $4, $4, now())`,
      [dealId, overrides.seq ?? 5, overrides.actor ?? "system", overrides.hash ?? "a".repeat(64)],
    );

  it.each([
    ["an actor that is not a role", { actor: "robot" }],
    ["a hash that is not 64 hex characters", { hash: "xyz" }],
    ["a negative position", { seq: -1 }],
  ])("refuses an entry with %s", async (_name, overrides) => {
    await setUp();
    await expect(insert(overrides)).rejects.toThrow(/check constraint/);
  });

  it("refuses two entries with the same fingerprint or the same position", async () => {
    await setUp();
    await insert({ seq: 5 });
    await expect(insert({ seq: 6 })).rejects.toThrow(/unique/);
    await expect(insert({ seq: 5, hash: "b".repeat(64) })).rejects.toThrow(/unique|duplicate/);
  });

  it("detects an entry edited behind the database's back and names it", async () => {
    const { seller } = await setUp();
    await append(
      { type: "NOTE_ADDED", actor: "seller", actorId: seller.id, payload: { n: 1 } },
      at(1),
    );
    await append(
      { type: "NOTE_ADDED", actor: "seller", actorId: seller.id, payload: { n: 2 } },
      at(2),
    );
    await db.query("ALTER TABLE ledger_entries DISABLE TRIGGER ledger_entries_append_only");
    await db.query("UPDATE ledger_entries SET payload = '{\"n\": 99}'::jsonb WHERE seq = 1");
    expect(await verifyStoredLedger(db, dealId)).toEqual({
      valid: false,
      brokenAt: 1,
      reason: "payload does not match payloadHash",
    });
  });

  it("detects a swapped acting user, which the hash covers", async () => {
    const { seller, buyer } = await setUp();
    await append({ type: "NOTE_ADDED", actor: "seller", actorId: seller.id, payload: {} }, at(1));
    await db.query("ALTER TABLE ledger_entries DISABLE TRIGGER ledger_entries_append_only");
    await db.query("UPDATE ledger_entries SET actor_user_id = $1 WHERE seq = 1", [buyer.id]);
    expect(await verifyStoredLedger(db, dealId)).toEqual({
      valid: false,
      brokenAt: 1,
      reason: "entry fields do not match entryHash",
    });
  });

  it("refuses to read a row it does not understand", async () => {
    await setUp();
    await db.query("ALTER TABLE ledger_entries DISABLE TRIGGER ledger_entries_append_only");
    await db.query("UPDATE ledger_entries SET type = 'NOT_AN_EVENT'");
    await expect(readLedger(db, dealId)).rejects.toThrow();
  });
});
