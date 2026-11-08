import { describe, expect, it } from "vitest";
import {
  activeConnection,
  confirmConnection,
  connectedSellers,
  disconnectSeller,
  linkOwnApp,
  ownAppKeys,
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

const link = (userId: string, merchantId: string, now = TEST_NOW) =>
  linkOwnApp(
    db,
    {
      id: newId(),
      userId,
      clientId: `client-${merchantId}`,
      sealedSecret: `v1.sealed-${merchantId}`,
      merchantId,
      scopes: SCOPES,
    },
    now,
  );

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
    expect(await activeConnection(db, seller.id)).toMatchObject({ trackingId: "t-2" });
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

  describe("own apps (6h)", () => {
    it("links an app as connected straight away, with its keys readable while live", async () => {
      const { seller } = await createTestParties(db);
      const linked = await link(seller.id, "M1");
      expect(linked).toEqual({
        ok: true,
        connection: expect.objectContaining({
          method: "own_app",
          clientId: "client-M1",
          status: "connected",
          merchantId: "M1",
          scopes: SCOPES,
          connectedAt: TEST_NOW,
        }) as unknown,
      });
      const id = linked.ok ? linked.connection.id : "";
      expect(await ownAppKeys(db, id)).toEqual({
        clientId: "client-M1",
        sealedSecret: "v1.sealed-M1",
        merchantId: "M1",
      });
      expect(await activeConnection(db, seller.id)).toMatchObject({ method: "own_app" });
    });

    it("refuses an account live for another user, whichever way they connected", async () => {
      const { seller, buyer } = await createTestParties(db);
      await attempt(buyer.id, "t-b");
      await confirmConnection(db, { trackingId: "t-b", merchantId: "M1", scopes: [] }, TEST_NOW);
      expect(await link(seller.id, "M1")).toEqual({ ok: false, reason: "account-taken" });
      expect(await activeConnection(db, seller.id)).toBeUndefined();
    });

    it("relinking ends the earlier link and wipes its secret, keeping the row", async () => {
      const { seller } = await createTestParties(db);
      const before = await link(seller.id, "M1");
      await link(seller.id, "M2", later(3));
      expect((await activeConnection(db, seller.id))?.merchantId).toBe("M2");
      expect(await ownAppKeys(db, before.ok ? before.connection.id : "")).toBeUndefined();
      expect(
        await db.query(
          "SELECT merchant_id, status, client_secret_sealed FROM seller_connections ORDER BY merchant_id",
        ),
      ).toEqual([
        { merchant_id: "M1", status: "disconnected", client_secret_sealed: null },
        { merchant_id: "M2", status: "connected", client_secret_sealed: "v1.sealed-M2" },
      ]);
    });

    it("unlinking wipes the secret", async () => {
      const { seller } = await createTestParties(db);
      await link(seller.id, "M1");
      expect(await disconnectSeller(db, seller.id, later(1))).toBe(true);
      expect(
        await db.query("SELECT client_id, client_secret_sealed FROM seller_connections"),
      ).toEqual([{ client_id: "client-M1", client_secret_sealed: null }]);
    });

    it("gives no keys for a Partner Referrals connection", async () => {
      const { seller } = await createTestParties(db);
      const started = await attempt(seller.id, "t-1");
      await confirmConnection(db, { trackingId: "t-1", merchantId: "M1", scopes: [] }, TEST_NOW);
      expect(await ownAppKeys(db, started.id)).toBeUndefined();
    });

    it.each([
      ["an ended row that still holds a secret", "own_app", null, "c1", "s", "disconnected"],
      ["a live own app without its secret", "own_app", null, "c1", null, "connected"],
      ["a pending own app", "own_app", null, "c1", "s", "pending"],
      ["an own app without a client id", "own_app", null, null, "s", "connected"],
      ["an own app with a tracking id", "own_app", "t-1", "c1", "s", "connected"],
      ["a partner row without a tracking id", "partner", null, null, null, "connected"],
      ["a partner row with a secret", "partner", "t-1", null, "s", "connected"],
      ["a client id with odd characters", "own_app", null, "c 1!", "s", "connected"],
    ])("refuses %s", async (_label, method, tracking, client, secret, status) => {
      const { seller } = await createTestParties(db);
      await expect(
        db.query(
          `INSERT INTO seller_connections
             (id, user_id, method, tracking_id, client_id, client_secret_sealed, status,
              merchant_id, created_at, connected_at, disconnected_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'M1', now(),
             CASE WHEN $7 <> 'pending' THEN now() END, CASE WHEN $7 = 'disconnected' THEN now() END)`,
          [newId(), seller.id, method, tracking, client, secret, status],
        ),
      ).rejects.toThrow();
    });
  });
});
