import { describe, expect, it } from "vitest";
import type { Database } from "./database.js";
import { createUser, signInWithPayPal, type SignedInPerson } from "./index.js";
import { TEST_NOW, testId, useMigratedTestDatabase } from "./testing.js";

const db = useMigratedTestDatabase();
let next = 10;
const newId = () => testId(next++);

const maya: SignedInPerson = {
  paypalUserId: "PP-USER-1",
  paypalPayerId: "PAYER1",
  email: "maya@example.com",
  emailVerified: true,
  name: "Maya Seller",
};

describe("signInWithPayPal", () => {
  it("creates a user the first time and finds the same user afterwards", async () => {
    const first = await signInWithPayPal(db, maya, newId, TEST_NOW);
    expect(first).toMatchObject({
      ok: true,
      created: true,
      user: {
        email: "maya@example.com",
        emailVerifiedAt: TEST_NOW,
        displayName: "Maya Seller",
        paypalUserId: "PP-USER-1",
        paypalPayerId: "PAYER1",
      },
    });
    const again = await signInWithPayPal(
      db,
      { ...maya, email: "new@example.com" },
      newId,
      TEST_NOW,
    );
    expect(again).toMatchObject({ ok: true, created: false });
    expect(again.ok && first.ok && again.user.id === first.user.id).toBe(true);
  });

  it("leaves the email unproven when PayPal does not call it verified", async () => {
    const result = await signInWithPayPal(db, { ...maya, emailVerified: false }, newId, TEST_NOW);
    expect(result.ok && result.user.emailVerifiedAt).toBeUndefined();
  });

  it("refuses someone PayPal shares no email for", async () => {
    expect(await signInWithPayPal(db, { ...maya, email: undefined }, newId, TEST_NOW)).toEqual({
      ok: false,
      reason: "no-email",
    });
  });

  it("links an invited user when both sides have proven the email", async () => {
    await createUser(
      db,
      { id: testId(2), email: "Maya@Example.com", emailVerifiedAt: TEST_NOW },
      TEST_NOW,
    );
    const result = await signInWithPayPal(db, maya, newId, TEST_NOW);
    expect(result).toMatchObject({
      ok: true,
      created: false,
      user: { id: testId(2), paypalUserId: "PP-USER-1", paypalPayerId: "PAYER1" },
    });
  });

  it.each([
    ["we never proved the email", { emailVerifiedAt: undefined }, maya],
    [
      "PayPal has not verified it",
      { emailVerifiedAt: TEST_NOW },
      { ...maya, emailVerified: false },
    ],
    [
      "the email already belongs to another PayPal account",
      { emailVerifiedAt: TEST_NOW, paypalUserId: "PP-OTHER" },
      maya,
    ],
  ])("does not merge accounts when %s", async (_name, existing, person) => {
    await createUser(db, { id: testId(2), email: "maya@example.com", ...existing }, TEST_NOW);
    expect(await signInWithPayPal(db, person, newId, TEST_NOW)).toEqual({
      ok: false,
      reason: "email-taken",
    });
  });

  it("uses the user another sign-in created at the same moment", async () => {
    const raced: Database = {
      ...db,
      transaction: async (work) => {
        // The other sign-in commits after our look-ups saw nothing, so our insert clashes.
        await signInWithPayPal(db, maya, () => testId(77), TEST_NOW);
        return db.transaction((tx) =>
          work({
            query: (sql, params) =>
              sql.startsWith("SELECT * FROM users WHERE")
                ? Promise.resolve([])
                : tx.query(sql, params),
          }),
        );
      },
    };
    expect(await signInWithPayPal(raced, maya, newId, TEST_NOW)).toMatchObject({
      ok: true,
      created: false,
      user: { id: testId(77) },
    });
  });

  it("passes on unexpected errors", async () => {
    const broken: Database = { ...db, transaction: () => Promise.reject(new Error("db down")) };
    await expect(signInWithPayPal(broken, maya, newId, TEST_NOW)).rejects.toThrow("db down");
  });
});
