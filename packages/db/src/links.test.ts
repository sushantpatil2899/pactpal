import { sha256Hex } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import {
  DealNotFoundError,
  LINK_LIFETIME_MS,
  LinkNotAllowedError,
  createDealLink,
  createDeal,
  findSession,
  redeemDealLink,
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
const later = (ms: number) => new Date(TEST_NOW.getTime() + ms);

describe("createDealLink", () => {
  it("makes a 14-day link for the deal's buyer and stores only its hash", async () => {
    const { buyer, dealId } = await createTestDeal(db);
    const link = await createDealLink(db, { dealId, userId: buyer.id }, TEST_NOW);
    expect(link.token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(link.expiresAt).toEqual(later(LINK_LIFETIME_MS));
    const stored = await db.query("SELECT token_hash, purpose FROM link_tokens");
    expect(stored).toEqual([{ token_hash: sha256Hex(link.token), purpose: "deal-access" }]);
  });

  it("refuses a link for anyone but the deal's buyer, and for an unknown deal", async () => {
    const { seller, dealId } = await createTestDeal(db);
    await expect(createDealLink(db, { dealId, userId: seller.id }, TEST_NOW)).rejects.toThrow(
      LinkNotAllowedError,
    );
    await expect(
      createDealLink(db, { dealId: testId(555), userId: seller.id }, TEST_NOW),
    ).rejects.toThrow(DealNotFoundError);
  });

  it("refuses a link while the deal has no buyer yet", async () => {
    const { seller, buyer } = await createTestParties(db);
    const { deal } = await createDeal(db, testDeal(seller.id), TEST_NOW);
    await expect(
      createDealLink(db, { dealId: deal.id, userId: buyer.id }, TEST_NOW),
    ).rejects.toThrow(LinkNotAllowedError);
  });
});

describe("redeemDealLink", () => {
  it("lets the buyer in for that deal only, proves their email, and records the use", async () => {
    const { buyer, dealId } = await createTestDeal(db);
    const link = await createDealLink(db, { dealId, userId: buyer.id }, TEST_NOW);
    const result = await redeemDealLink(db, link.token, later(60_000));
    expect(result).toMatchObject({ ok: true, dealId });
    if (!result.ok) throw new Error("expected a session");
    const session = await findSession(db, result.session.token, later(60_000));
    expect(session?.user.id).toBe(buyer.id);
    expect(session?.user.emailVerifiedAt).toEqual(later(60_000));
    expect(session?.access).toEqual({ method: "link", dealId });
    expect(await db.query("SELECT last_used_at FROM link_tokens")).toEqual([
      { last_used_at: later(60_000) },
    ]);
  });

  it("works more than once until it expires, then refuses", async () => {
    const { buyer, dealId } = await createTestDeal(db);
    const link = await createDealLink(db, { dealId, userId: buyer.id }, TEST_NOW);
    expect((await redeemDealLink(db, link.token, later(1000))).ok).toBe(true);
    expect((await redeemDealLink(db, link.token, later(2000))).ok).toBe(true);
    expect(await redeemDealLink(db, link.token, later(LINK_LIFETIME_MS))).toEqual({
      ok: false,
      reason: "expired",
    });
  });

  it("keeps an email that was already proven as it was", async () => {
    const { buyer, dealId } = await createTestDeal(db);
    await db.query("UPDATE users SET email_verified_at = $2 WHERE id = $1", [buyer.id, TEST_NOW]);
    const link = await createDealLink(db, { dealId, userId: buyer.id }, TEST_NOW);
    await redeemDealLink(db, link.token, later(5000));
    const rows = await db.query("SELECT email_verified_at FROM users WHERE id = $1", [buyer.id]);
    expect(rows).toEqual([{ email_verified_at: TEST_NOW }]);
  });

  it("refuses a link that a newer one replaced, and keeps the newer one working", async () => {
    const { buyer, dealId } = await createTestDeal(db);
    const old = await createDealLink(db, { dealId, userId: buyer.id }, TEST_NOW);
    const fresh = await createDealLink(db, { dealId, userId: buyer.id }, later(1000));
    expect(await redeemDealLink(db, old.token, later(2000))).toEqual({
      ok: false,
      reason: "replaced",
    });
    expect((await redeemDealLink(db, fresh.token, later(2000))).ok).toBe(true);
  });

  it("refuses a link once its person is no longer the deal's buyer", async () => {
    const { buyer, dealId } = await createTestDeal(db);
    const link = await createDealLink(db, { dealId, userId: buyer.id }, TEST_NOW);
    await db.query("UPDATE deals SET buyer_id = NULL WHERE id = $1", [dealId]);
    expect(await redeemDealLink(db, link.token, later(1000))).toEqual({
      ok: false,
      reason: "replaced",
    });
  });

  it.each(["", "not-a-token", "a".repeat(43)])(
    "refuses %j as unknown and creates no session",
    async (value) => {
      await createTestDeal(db);
      expect(await redeemDealLink(db, value, TEST_NOW)).toEqual({ ok: false, reason: "unknown" });
      expect(await db.query("SELECT 1 FROM sessions")).toEqual([]);
    },
  );
});
