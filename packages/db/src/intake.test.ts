import { describe, expect, it } from "vitest";
import {
  MAX_INTAKE_DEALS_PER_DAY,
  createDeal,
  currentIntakeKey,
  findIntakeKey,
  makeIntakeKey,
  readLedger,
  turnOffIntakeKey,
  useIntakeKey,
} from "./index.js";
import {
  TEST_NOW,
  createTestParties,
  minutesAfterTestNow,
  testDeal,
  testId,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();
const at = minutesAfterTestNow;

async function sellerWithKey() {
  const { seller } = await createTestParties(db);
  const make = (n: number) =>
    makeIntakeKey(
      db,
      {
        id: testId(900 + n),
        sellerId: seller.id,
        defaultCategory: "web-and-software",
        defaultCurrency: "EUR",
      },
      at(n),
    );
  return { seller, make };
}

describe("intake keys", () => {
  it("are shown once, stored only as a hash and an ending, and replaced by a new one", async () => {
    const { seller, make } = await sellerWithKey();
    const first = await make(1);
    expect(first.key).toMatch(/^ppk_[\w-]{43}$/);
    expect(first.record).toMatchObject({
      keyEnding: first.key.slice(-4),
      defaultCategory: "web-and-software",
    });
    const stored = await db.query("SELECT * FROM intake_keys");
    expect(JSON.stringify(stored)).not.toContain(first.key);
    const second = await make(2);
    expect((await currentIntakeKey(db, seller.id))?.id).toBe(second.record.id);
    expect(await useIntakeKey(db, first.key, at(3))).toEqual({ ok: false, reason: "not-valid" });
    expect(await useIntakeKey(db, second.key, at(3))).toMatchObject({
      ok: true,
      record: { sellerId: seller.id, lastUsedAt: at(3) },
    });
  });

  it("refuse wrong and turned-off keys alike, and stop at the daily limit until the next day", async () => {
    const { seller, make } = await sellerWithKey();
    const { key } = await make(1);
    expect(await useIntakeKey(db, "not-a-key", at(2))).toEqual({ ok: false, reason: "not-valid" });
    expect(await useIntakeKey(db, `${key.slice(0, -1)}x`, at(2))).toEqual({
      ok: false,
      reason: "not-valid",
    });
    for (let i = 0; i < MAX_INTAKE_DEALS_PER_DAY; i++)
      expect((await useIntakeKey(db, key, at(2))).ok).toBe(true);
    expect(await useIntakeKey(db, key, at(3))).toEqual({ ok: false, reason: "too-many" });
    expect((await useIntakeKey(db, key, at(24 * 60 + 1))).ok).toBe(true);
    expect(await turnOffIntakeKey(db, seller.id, at(24 * 60 + 2))).toBe(true);
    expect(await turnOffIntakeKey(db, seller.id, at(24 * 60 + 3))).toBe(false);
    expect(await useIntakeKey(db, key, at(24 * 60 + 4))).toEqual({
      ok: false,
      reason: "not-valid",
    });
    expect(await currentIntakeKey(db, seller.id)).toBeUndefined();
  });

  it("keep their owner, hash and defaults, are turned off once and never removed", async () => {
    const { make } = await sellerWithKey();
    await make(1);
    await make(2);
    await expect(db.query("UPDATE intake_keys SET default_currency = 'USD'")).rejects.toThrow(
      /append-only/,
    );
    await expect(
      db.query("UPDATE intake_keys SET turned_off_at = now() WHERE turned_off_at IS NOT NULL"),
    ).rejects.toThrow(/append-only/);
    await expect(db.query("DELETE FROM intake_keys")).rejects.toThrow(/append-only/);
    await expect(db.query("TRUNCATE intake_keys")).rejects.toThrow(/append-only/);
  });

  it("include a forwarding address, a second kind kept apart from the key", async () => {
    const { seller, make } = await sellerWithKey();
    const key = await make(1);
    const input = {
      id: testId(950),
      sellerId: seller.id,
      defaultCategory: "art-and-design" as const,
      defaultCurrency: "USD" as const,
    };
    const address = await makeIntakeKey(db, input, at(2), "address");
    expect(address.key).toMatch(/^[a-z2-9]{16}$/);
    expect((await currentIntakeKey(db, seller.id))?.id).toBe(key.record.id);
    expect((await currentIntakeKey(db, seller.id, "address"))?.id).toBe(address.record.id);
    expect(await useIntakeKey(db, address.key, at(3))).toEqual({ ok: false, reason: "not-valid" });
    expect(await useIntakeKey(db, key.key, at(3), "address")).toEqual({
      ok: false,
      reason: "not-valid",
    });
    expect(await useIntakeKey(db, address.key, at(3), "address")).toMatchObject({
      ok: true,
      record: { defaultCategory: "art-and-design" },
    });
    expect((await findIntakeKey(db, address.key, "address"))?.id).toBe(address.record.id);
    expect(await findIntakeKey(db, address.key, "key")).toBeUndefined();
    expect(await turnOffIntakeKey(db, seller.id, at(4), "address")).toBe(true);
    expect(await findIntakeKey(db, address.key, "address")).toBeUndefined();
    expect((await currentIntakeKey(db, seller.id))?.id).toBe(key.record.id);
    await expect(
      db.query("UPDATE intake_keys SET kind = 'key' WHERE kind = 'address'"),
    ).rejects.toThrow(/append-only/);
  });

  it("mark a deal created through one in its log, by the key's ending only", async () => {
    const { seller } = await createTestParties(db);
    const { entry } = await createDeal(db, testDeal(seller.id), TEST_NOW, {
      via: "intake",
      keyEnding: "x7Qa",
    });
    expect(entry.payload).toMatchObject({ via: "intake", keyEnding: "x7Qa" });
    expect((await readLedger(db, entry.dealId))[0]?.type).toBe("DEAL_CREATED");
  });
});
