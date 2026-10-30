import { describe, expect, it } from "vitest";
import type { Database } from "./database.js";
import { createDeal, readLedger, verifyStoredLedger } from "./index.js";
import {
  TEST_NOW,
  createTestParties,
  testDeal,
  testId,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();

describe("createDeal", () => {
  it("saves a draft deal and writes its first ledger entry, which verifies", async () => {
    const { seller } = await createTestParties(db);
    const { deal, entry } = await createDeal(db, testDeal(seller.id), TEST_NOW);
    expect(deal).toEqual({
      id: testId(100),
      sellerId: seller.id,
      buyerId: undefined,
      title: "Logo design",
      kind: "service",
      category: "art-and-design",
      currency: "USD",
      status: "draft",
      createdAt: TEST_NOW,
      updatedAt: TEST_NOW,
    });
    expect(entry).toMatchObject({
      dealId: deal.id,
      seq: 0,
      type: "DEAL_CREATED",
      actor: "seller",
      actorId: seller.id,
      serverTime: "2026-10-02T10:00:00.000Z",
      payload: {
        title: "Logo design",
        kind: "service",
        category: "art-and-design",
        currency: "USD",
        buyerId: null,
      },
    });
    expect(await readLedger(db, deal.id)).toEqual([entry]);
    expect(await verifyStoredLedger(db, deal.id)).toEqual({
      valid: true,
      head: entry.entryHash,
      length: 1,
    });
  });

  it("records the buyer when already known", async () => {
    const { seller, buyer } = await createTestParties(db);
    const { deal, entry } = await createDeal(
      db,
      testDeal(seller.id, { buyerId: buyer.id }),
      TEST_NOW,
    );
    expect(deal.buyerId).toBe(buyer.id);
    expect(entry.payload).toMatchObject({ buyerId: buyer.id });
  });

  it("refuses a deal between a person and themselves", async () => {
    const { seller } = await createTestParties(db);
    await expect(
      createDeal(db, testDeal(seller.id, { buyerId: seller.id }), TEST_NOW),
    ).rejects.toThrow(/deals_seller_is_not_buyer/);
    expect(await db.query("SELECT 1 FROM deals")).toEqual([]);
  });

  it("refuses an unknown seller and leaves nothing behind", async () => {
    await expect(createDeal(db, testDeal(testId(99)), TEST_NOW)).rejects.toThrow(/foreign key/);
    expect(await db.query("SELECT 1 FROM ledger_entries")).toEqual([]);
  });

  it.each([
    ["a kind that does not exist", { kind: "goods" }],
    ["a currency in small letters", { currency: "usd" }],
    ["a currency of the wrong length", { currency: "US" }],
    ["an empty title", { title: "  " }],
    ["an empty category", { category: "" }],
    ["a deal id that is not a uuid", { id: "deal-1" }],
  ])("rejects %s before touching the database", async (_name, overrides) => {
    const { seller } = await createTestParties(db);
    await expect(
      createDeal(
        db,
        testDeal(seller.id, overrides as Partial<ReturnType<typeof testDeal>>),
        TEST_NOW,
      ),
    ).rejects.toThrow();
    expect(await db.query("SELECT 1 FROM deals")).toEqual([]);
  });

  it("leaves no deal behind when its ledger entry cannot be written", async () => {
    const { seller } = await createTestParties(db);
    const failing: Database = {
      ...db,
      transaction: (work) =>
        db.transaction((tx) =>
          work({
            query: (sql, params) =>
              sql.includes("INSERT INTO ledger_entries")
                ? Promise.reject(new Error("disk full"))
                : tx.query(sql, params),
          }),
        ),
    };
    await expect(createDeal(failing, testDeal(seller.id), TEST_NOW)).rejects.toThrow("disk full");
    expect(await db.query("SELECT 1 FROM deals")).toEqual([]);
  });
});
