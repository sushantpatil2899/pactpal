import { describe, expect, it } from "vitest";
import { UserConflictError, createUser } from "./index.js";
import { TEST_NOW, testId, useMigratedTestDatabase } from "./testing.js";

const db = useMigratedTestDatabase();

describe("createUser", () => {
  it("saves everything it is given and returns it", async () => {
    const verified = new Date("2026-10-01T09:00:00.000Z");
    const user = await createUser(
      db,
      {
        id: testId(1),
        email: "Maya@Example.com",
        emailVerifiedAt: verified,
        displayName: "  Maya Seller ",
        paypalUserId: "https://paypal.example/user/1",
        paypalPayerId: "PAYER1",
      },
      TEST_NOW,
    );
    expect(user).toEqual({
      id: testId(1),
      email: "Maya@Example.com",
      emailVerifiedAt: verified,
      displayName: "Maya Seller",
      paypalUserId: "https://paypal.example/user/1",
      paypalPayerId: "PAYER1",
      createdAt: TEST_NOW,
      updatedAt: TEST_NOW,
    });
  });

  it("accepts a person invited by email, with nothing but an address", async () => {
    const user = await createUser(db, { id: testId(2), email: "chris@example.com" }, TEST_NOW);
    expect(user.displayName).toBeUndefined();
    expect(user.emailVerifiedAt).toBeUndefined();
    expect(user.paypalPayerId).toBeUndefined();
  });

  it.each([
    ["an email that differs only in letter case", { id: testId(3), email: "MAYA@example.COM" }],
    ["a PayPal user id", { id: testId(3), email: "other@example.com", paypalUserId: "U1" }],
    ["a PayPal payer id", { id: testId(3), email: "other@example.com", paypalPayerId: "PAYER1" }],
    ["an id", { id: testId(1), email: "other@example.com" }],
  ])("refuses a second user with %s", async (_name, second) => {
    await createUser(
      db,
      { id: testId(1), email: "maya@example.com", paypalUserId: "U1", paypalPayerId: "PAYER1" },
      TEST_NOW,
    );
    await expect(createUser(db, second, TEST_NOW)).rejects.toThrow(UserConflictError);
  });

  it.each([
    ["an id that is not a uuid", { id: "1", email: "a@example.com" }],
    ["an email that is not an address", { id: testId(1), email: "nope" }],
    ["an empty name", { id: testId(1), email: "a@example.com", displayName: " " }],
  ])("rejects %s before touching the database", async (_name, input) => {
    await expect(createUser(db, input, TEST_NOW)).rejects.toThrow();
    expect(await db.query("SELECT 1 FROM users")).toEqual([]);
  });

  it("passes on database errors that are not about duplicates", async () => {
    const broken = { query: () => Promise.reject(new Error("connection lost")) };
    await expect(
      createUser(broken, { id: testId(1), email: "a@example.com" }, TEST_NOW),
    ).rejects.toThrow("connection lost");
  });
});
