import { sha256Hex } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import {
  BuyerNotAllowedError,
  DealNotFoundError,
  addBuyer,
  createDeal,
  createUser,
  readLedger,
  verifyStoredLedger,
} from "./index.js";
import {
  TEST_NOW,
  createTestDeal,
  createTestParties,
  testDeal,
  testId,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();
let next = 300;
const newId = () => testId(next++);
const later = new Date(TEST_NOW.getTime() + 60_000);

/** A seller with a deal that has no buyer yet. */
async function sellerWithDeal() {
  const { seller } = await createTestParties(db);
  const { deal } = await createDeal(db, testDeal(seller.id), TEST_NOW);
  return { seller, dealId: deal.id };
}

describe("addBuyer", () => {
  it("creates an unproven user for a new email, sets the buyer and logs it without the email", async () => {
    const { seller, dealId } = await sellerWithDeal();
    const { deal, buyer, entry } = await addBuyer(
      db,
      { dealId, sellerId: seller.id, email: "New.Person@Example.com", name: "Sam" },
      later,
      newId,
    );
    expect(buyer).toMatchObject({
      email: "New.Person@Example.com",
      displayName: "Sam",
      emailVerifiedAt: undefined,
    });
    expect(deal.buyerId).toBe(buyer.id);
    expect(entry).toMatchObject({
      seq: 1,
      type: "BUYER_ADDED",
      actor: "seller",
      actorId: seller.id,
      payload: { buyerId: buyer.id, emailSha256: sha256Hex("new.person@example.com") },
    });
    expect(JSON.stringify(await readLedger(db, dealId))).not.toMatch(/example\\.com/i);
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
  });

  it("reuses an existing user whose email matches, ignoring upper and lower case", async () => {
    const { seller, buyer } = await createTestDeal(db);
    const { deal } = await createDeal(db, testDeal(seller.id, { id: testId(150) }), TEST_NOW);
    const result = await addBuyer(
      db,
      { dealId: deal.id, sellerId: seller.id, email: buyer.email.toUpperCase() },
      later,
      newId,
    );
    expect(result.buyer.id).toBe(buyer.id);
    expect(await db.query("SELECT 1 FROM users")).toHaveLength(2);
  });

  it.each([
    ["the deal already has a buyer", "already-has-buyer"],
    ["it is someone else's deal", "not-your-deal"],
    ["the seller adds their own email", "own-email"],
  ] as const)("refuses when %s, and changes nothing", async (name, reason) => {
    const { seller, dealId } = await createTestDeal(db);
    const other = await createUser(db, { id: testId(9), email: "x@example.com" }, TEST_NOW);
    const input =
      reason === "already-has-buyer"
        ? { dealId, sellerId: seller.id, email: "someone@example.com" }
        : reason === "not-your-deal"
          ? { dealId, sellerId: other.id, email: "someone@example.com" }
          : undefined;
    const target = input ?? (await sellerWithoutBuyer(seller.id));
    const error = await addBuyer(db, target, later, newId).catch((e: unknown) => e);
    expect(error, name).toBeInstanceOf(BuyerNotAllowedError);
    expect((error as BuyerNotAllowedError).reason).toBe(reason);
    expect((await readLedger(db, target.dealId)).map((e) => e.type)).toEqual(["DEAL_CREATED"]);
  });

  it("refuses an unknown deal and a badly formed email", async () => {
    const { seller } = await createTestParties(db);
    await expect(
      addBuyer(
        db,
        { dealId: testId(555), sellerId: seller.id, email: "a@example.com" },
        later,
        newId,
      ),
    ).rejects.toThrow(DealNotFoundError);
    await expect(
      addBuyer(db, { dealId: testId(555), sellerId: seller.id, email: "nope" }, later, newId),
    ).rejects.toThrow();
  });
});

/** A second deal of the same seller, without a buyer, to try adding the seller's own email. */
async function sellerWithoutBuyer(sellerId: string) {
  const { deal } = await createDeal(db, testDeal(sellerId, { id: testId(160) }), TEST_NOW);
  return { dealId: deal.id, sellerId, email: "MAYA@example.com" };
}
