import { describe, expect, it } from "vitest";
import {
  activeConnection,
  confirmConnection,
  connectedSellers,
  disconnectSeller,
  startConnection,
} from "./index.js";
import { TEST_NOW, createTestParties, useMigratedTestDatabase } from "./testing.js";

const db = useMigratedTestDatabase();
const later = (minutes: number) => new Date(TEST_NOW.getTime() + minutes * 60_000);
const SCOPES = [
  "https://uri.paypal.com/services/disputes/read-seller",
  "https://uri.paypal.com/services/disputes/update-seller",
];
let ids = 0;
const newId = () => {
  ids += 1;
  return `00000000-0000-4000-8000-${String(ids).padStart(12, "0")}`;
};

async function attempt(userId: string, trackingId: string) {
  return startConnection(db, { id: newId(), userId, trackingId }, TEST_NOW);
}

describe("seller connections", () => {
  it("starts as pending, then is confirmed with the account and its permissions", async () => {
    const { seller } = await createTestParties(db);
    const started = await attempt(seller.id, "t-1");
    expect(started).toMatchObject({
      userId: seller.id,
      method: "partner",
      trackingId: "t-1",
      status: "pending",
      merchantId: undefined,
      scopes: [],
      connectedAt: undefined,
    });
    expect(await activeConnection(db, seller.id)).toBeUndefined();

    const confirmed = await confirmConnection(
      db,
      { trackingId: "t-1", merchantId: "JDNTE6K43SE6N", scopes: SCOPES },
      later(2),
    );
    expect(confirmed).toEqual({
      ok: true,
      connection: expect.objectContaining({
        status: "connected",
        merchantId: "JDNTE6K43SE6N",
        scopes: SCOPES,
        connectedAt: later(2),
      }) as unknown,
    });
    expect(await activeConnection(db, seller.id)).toMatchObject({ trackingId: "t-1" });
    expect(await connectedSellers(db)).toHaveLength(1);
  });

  it("refuses an unknown tracking id and one already confirmed", async () => {
    const { seller } = await createTestParties(db);
    const input = { trackingId: "t-1", merchantId: "M1", scopes: [] };
    expect(await confirmConnection(db, input, TEST_NOW)).toEqual({ ok: false, reason: "unknown" });
    await attempt(seller.id, "t-1");
    expect((await confirmConnection(db, input, TEST_NOW)).ok).toBe(true);
    expect(await confirmConnection(db, input, TEST_NOW)).toEqual({
      ok: false,
      reason: "not-pending",
    });
  });

  it("refuses a PayPal account already connected to another user, and leaves both as they were", async () => {
    const { seller, buyer } = await createTestParties(db);
    await attempt(seller.id, "t-seller");
    await attempt(buyer.id, "t-other");
    await confirmConnection(db, { trackingId: "t-seller", merchantId: "M1", scopes: [] }, TEST_NOW);
    expect(
      await confirmConnection(
        db,
        { trackingId: "t-other", merchantId: "M1", scopes: [] },
        later(1),
      ),
    ).toEqual({ ok: false, reason: "account-taken" });
    expect((await activeConnection(db, seller.id))?.merchantId).toBe("M1");
    expect(await activeConnection(db, buyer.id)).toBeUndefined();
  });

  it("reconnecting ends the earlier connection and keeps it as history", async () => {
    const { seller } = await createTestParties(db);
    await attempt(seller.id, "t-1");
    await confirmConnection(db, { trackingId: "t-1", merchantId: "M1", scopes: [] }, TEST_NOW);
    await attempt(seller.id, "t-2");
    const again = await confirmConnection(
      db,
      { trackingId: "t-2", merchantId: "M1", scopes: SCOPES },
      later(5),
    );
    expect(again.ok).toBe(true);
    expect((await activeConnection(db, seller.id))?.trackingId).toBe("t-2");
    const rows = await db.query(
      "SELECT tracking_id, status, disconnected_at FROM seller_connections ORDER BY tracking_id",
    );
    expect(rows).toEqual([
      { tracking_id: "t-1", status: "disconnected", disconnected_at: later(5) },
      { tracking_id: "t-2", status: "connected", disconnected_at: null },
    ]);
  });

  it("disconnects, keeping the row, and says whether there was anything to end", async () => {
    const { seller } = await createTestParties(db);
    expect(await disconnectSeller(db, seller.id, TEST_NOW)).toBe(false);
    await attempt(seller.id, "t-1");
    await confirmConnection(db, { trackingId: "t-1", merchantId: "M1", scopes: [] }, TEST_NOW);
    expect(await disconnectSeller(db, seller.id, later(1))).toBe(true);
    expect(await activeConnection(db, seller.id)).toBeUndefined();
    expect(await connectedSellers(db)).toEqual([]);
    expect(await db.query("SELECT status FROM seller_connections")).toEqual([
      { status: "disconnected" },
    ]);
  });

  it("lists every live connection, oldest first", async () => {
    const { seller, buyer } = await createTestParties(db);
    await attempt(seller.id, "t-a");
    await attempt(buyer.id, "t-b");
    await confirmConnection(db, { trackingId: "t-b", merchantId: "MB", scopes: [] }, later(1));
    await confirmConnection(db, { trackingId: "t-a", merchantId: "MA", scopes: [] }, later(2));
    expect((await connectedSellers(db)).map((c) => c.merchantId)).toEqual(["MB", "MA"]);
  });

  it("is deleted with its user", async () => {
    const { seller } = await createTestParties(db);
    await attempt(seller.id, "t-1");
    await db.query("DELETE FROM users WHERE id = $1", [seller.id]);
    expect(await db.query("SELECT id FROM seller_connections")).toEqual([]);
  });

  it("accepts a well-formed row written directly (so the refusals below are about the rule)", async () => {
    const { seller } = await createTestParties(db);
    await db.query(
      `INSERT INTO seller_connections
         (id, user_id, method, tracking_id, status, merchant_id, created_at, connected_at)
       VALUES ($1, $2, 'partner', 't-x', $3, $4, now(), CASE WHEN $5 THEN now() END)`,
      [newId(), seller.id, "connected", "M1", true],
    );
    expect((await activeConnection(db, seller.id))?.merchantId).toBe("M1");
  });

  it.each([
    ["a connected row without an account", "connected", null, true],
    ["a pending row with an account", "pending", "M1", false],
    ["a pending row with a connected time", "pending", null, true],
    ["a disconnected row without its time", "disconnected", "M1", true],
    ["an account id with odd characters", "connected", "M-1!", true],
  ])("refuses %s", async (_label, status, merchant, connected) => {
    const { seller } = await createTestParties(db);
    await expect(
      db.query(
        `INSERT INTO seller_connections
           (id, user_id, method, tracking_id, status, merchant_id, created_at, connected_at)
         VALUES ($1, $2, 'partner', 't-x', $3, $4, now(), CASE WHEN $5 THEN now() END)`,
        [newId(), seller.id, status, merchant, connected],
      ),
    ).rejects.toThrow();
  });

  it("refuses two live connections for one user, or for one account, even written directly", async () => {
    const { seller, buyer } = await createTestParties(db);
    const insert = (userId: string, tracking: string, merchant: string) =>
      db.query(
        `INSERT INTO seller_connections
           (id, user_id, method, tracking_id, status, merchant_id, created_at, connected_at)
         VALUES ($1, $2, 'partner', $3, 'connected', $4, now(), now())`,
        [newId(), userId, tracking, merchant],
      );
    await insert(seller.id, "t-1", "M1");
    await expect(insert(seller.id, "t-2", "M2")).rejects.toThrow(/one_per_user/);
    await expect(insert(buyer.id, "t-3", "M1")).rejects.toThrow(/one_per_account/);
  });
});
