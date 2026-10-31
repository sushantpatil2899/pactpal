import { sha256Hex } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import {
  SESSION_LIFETIME_MS,
  createSession,
  deleteSession,
  findSession,
  newSessionToken,
} from "./index.js";
import { TEST_NOW, createTestDeal, createTestParties, useMigratedTestDatabase } from "./testing.js";

const db = useMigratedTestDatabase();
const later = (ms: number) => new Date(TEST_NOW.getTime() + ms);

describe("sessions", () => {
  it("makes a fresh 43-character token every time", () => {
    const a = newSessionToken();
    expect(a).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(newSessionToken()).not.toBe(a);
  });

  it("finds the user for a live session and stores only the token's hash", async () => {
    const { seller } = await createTestParties(db);
    const { token, expiresAt } = await createSession(db, seller.id, TEST_NOW);
    expect(expiresAt).toEqual(later(SESSION_LIFETIME_MS));
    expect((await findSession(db, token, later(1000)))?.user.id).toBe(seller.id);
    const stored = await db.query("SELECT token_hash FROM sessions");
    expect(stored).toEqual([{ token_hash: sha256Hex(token) }]);
    expect(JSON.stringify(stored)).not.toContain(token);
  });

  it("says a PayPal session may do everything and a link session only its deal", async () => {
    const { seller, buyer, dealId } = await createTestDeal(db);
    const full = await createSession(db, seller.id, TEST_NOW);
    const link = await createSession(db, buyer.id, TEST_NOW, undefined, { method: "link", dealId });
    expect((await findSession(db, full.token, TEST_NOW))?.access).toEqual({ method: "paypal" });
    expect((await findSession(db, link.token, TEST_NOW))?.access).toEqual({
      method: "link",
      dealId,
    });
  });

  it("refuses a link session without a deal, and a PayPal session with one", async () => {
    const { seller, dealId } = await createTestDeal(db);
    const insert = (method: string, deal: string | null) =>
      db.query(
        `INSERT INTO sessions (token_hash, user_id, created_at, expires_at, method, deal_id)
         VALUES ($1, $2, now(), now() + interval '1 day', $3, $4)`,
        ["c".repeat(64), seller.id, method, deal],
      );
    await expect(insert("link", null)).rejects.toThrow(/sessions_link_has_deal/);
    await expect(insert("paypal", dealId)).rejects.toThrow(/sessions_link_has_deal/);
  });

  it("refuses and removes a session once it has expired", async () => {
    const { seller } = await createTestParties(db);
    const { token } = await createSession(db, seller.id, TEST_NOW);
    expect(await findSession(db, token, later(SESSION_LIFETIME_MS))).toBeUndefined();
    expect(await db.query("SELECT 1 FROM sessions")).toEqual([]);
  });

  it("ends a session when the person signs out, leaving their other sessions alone", async () => {
    const { seller } = await createTestParties(db);
    const first = await createSession(db, seller.id, TEST_NOW);
    const second = await createSession(db, seller.id, TEST_NOW);
    await deleteSession(db, first.token);
    expect(await findSession(db, first.token, TEST_NOW)).toBeUndefined();
    expect((await findSession(db, second.token, TEST_NOW))?.user.id).toBe(seller.id);
  });

  it.each(["", "short", "x".repeat(43).replace("x", "!"), "a".repeat(500)])(
    "ignores a cookie value that is not a token (%j) without asking the database",
    async (value) => {
      const failing = { query: () => Promise.reject(new Error("should not be called")) };
      expect(await findSession(failing, value, TEST_NOW)).toBeUndefined();
      await expect(deleteSession(failing, value)).resolves.toBeUndefined();
    },
  );

  it("returns nobody for a well-formed token that was never issued", async () => {
    expect(await findSession(db, "a".repeat(43), TEST_NOW)).toBeUndefined();
  });
});
