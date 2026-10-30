import { sha256Hex } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import {
  SESSION_LIFETIME_MS,
  createSession,
  deleteSession,
  findSessionUser,
  newSessionToken,
} from "./index.js";
import { TEST_NOW, createTestParties, useMigratedTestDatabase } from "./testing.js";

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
    expect((await findSessionUser(db, token, later(1000)))?.id).toBe(seller.id);
    const stored = await db.query("SELECT token_hash FROM sessions");
    expect(stored).toEqual([{ token_hash: sha256Hex(token) }]);
    expect(JSON.stringify(stored)).not.toContain(token);
  });

  it("refuses and removes a session once it has expired", async () => {
    const { seller } = await createTestParties(db);
    const { token } = await createSession(db, seller.id, TEST_NOW);
    expect(await findSessionUser(db, token, later(SESSION_LIFETIME_MS))).toBeUndefined();
    expect(await db.query("SELECT 1 FROM sessions")).toEqual([]);
  });

  it("ends a session when the person signs out, leaving their other sessions alone", async () => {
    const { seller } = await createTestParties(db);
    const first = await createSession(db, seller.id, TEST_NOW);
    const second = await createSession(db, seller.id, TEST_NOW);
    await deleteSession(db, first.token);
    expect(await findSessionUser(db, first.token, TEST_NOW)).toBeUndefined();
    expect((await findSessionUser(db, second.token, TEST_NOW))?.id).toBe(seller.id);
  });

  it.each(["", "short", "x".repeat(43).replace("x", "!"), "a".repeat(500)])(
    "ignores a cookie value that is not a token (%j) without asking the database",
    async (value) => {
      const failing = { query: () => Promise.reject(new Error("should not be called")) };
      expect(await findSessionUser(failing, value, TEST_NOW)).toBeUndefined();
      await expect(deleteSession(failing, value)).resolves.toBeUndefined();
    },
  );

  it("returns nobody for a well-formed token that was never issued", async () => {
    expect(await findSessionUser(db, "a".repeat(43), TEST_NOW)).toBeUndefined();
  });
});
