import { z } from "zod";
import type { Database, Queryable } from "./database.js";
import { CATEGORY_IDS, DEAL_CURRENCIES } from "./deals.js";
import { hashToken, newSessionToken } from "./sessions.js";

/** At most this many deals a day (UTC) through one key, so a leaked key cannot flood an account. */
export const MAX_INTAKE_DEALS_PER_DAY = 30;

/** What every key starts with, so a person can tell it from other secrets. */
const KEY_PREFIX = "ppk_";

const keyRow = z
  .object({
    id: z.string(),
    seller_id: z.string(),
    key_ending: z.string(),
    default_category: z.enum(CATEGORY_IDS),
    default_currency: z.enum(DEAL_CURRENCIES),
    created_at: z.date(),
    last_used_at: z.date().nullable(),
    turned_off_at: z.date().nullable(),
  })
  .transform((row) => ({
    id: row.id,
    sellerId: row.seller_id,
    keyEnding: row.key_ending,
    defaultCategory: row.default_category,
    defaultCurrency: row.default_currency,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at ?? undefined,
    turnedOffAt: row.turned_off_at ?? undefined,
  }));

/** A seller's intake key as stored: never the key itself. */
export type IntakeKey = z.output<typeof keyRow>;

const newKeySchema = z.object({
  id: z.uuid(),
  sellerId: z.uuid(),
  defaultCategory: z.enum(CATEGORY_IDS),
  defaultCurrency: z.enum(DEAL_CURRENCIES),
});

/**
 * Makes a new intake key for a seller, turning off the one they had. The key is returned once;
 * only its SHA-256 and last 4 characters are stored.
 */
export async function makeIntakeKey(
  db: Database,
  input: z.input<typeof newKeySchema>,
  now: Date,
): Promise<{ key: string; record: IntakeKey }> {
  const made = newKeySchema.parse(input);
  const key = `${KEY_PREFIX}${newSessionToken()}`;
  return db.transaction(async (tx) => {
    await tx.query(
      "UPDATE intake_keys SET turned_off_at = $2 WHERE seller_id = $1 AND turned_off_at IS NULL",
      [made.sellerId, now],
    );
    const rows = await tx.query(
      `INSERT INTO intake_keys (id, seller_id, token_hash, key_ending, default_category,
                                default_currency, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        made.id,
        made.sellerId,
        hashToken(key),
        key.slice(-4),
        made.defaultCategory,
        made.defaultCurrency,
        now,
      ],
    );
    return { key, record: keyRow.parse(rows[0]) };
  });
}

/** Turns off a seller's key for good; false when they had none on. */
export async function turnOffIntakeKey(
  q: Queryable,
  sellerId: string,
  now: Date,
): Promise<boolean> {
  const rows = await q.query(
    "UPDATE intake_keys SET turned_off_at = $2 WHERE seller_id = $1 AND turned_off_at IS NULL RETURNING id",
    [sellerId, now],
  );
  return rows.length > 0;
}

/** The seller's key that is on, or undefined. */
export async function currentIntakeKey(
  q: Queryable,
  sellerId: string,
): Promise<IntakeKey | undefined> {
  const rows = await q.query(
    "SELECT * FROM intake_keys WHERE seller_id = $1 AND turned_off_at IS NULL",
    [sellerId],
  );
  return rows[0] === undefined ? undefined : keyRow.parse(rows[0]);
}

/** Why a key could not be used: not a key that is on, or today's deals are used up. */
export type IntakeRefusal = "not-valid" | "too-many";

/**
 * Uses a key for one new deal: with its row locked, a key that is on and under today's limit is
 * counted and its owner returned. A wrong, old or turned-off key is "not-valid", the same for
 * each, so nothing is revealed.
 */
export async function useIntakeKey(
  db: Database,
  key: string,
  now: Date,
): Promise<{ ok: true; record: IntakeKey } | { ok: false; reason: IntakeRefusal }> {
  if (!key.startsWith(KEY_PREFIX)) return { ok: false, reason: "not-valid" };
  const today = now.toISOString().slice(0, 10);
  return db.transaction(async (tx) => {
    const rows = await tx.query(
      `SELECT *, to_char(uses_day, 'YYYY-MM-DD') AS day FROM intake_keys
        WHERE token_hash = $1 AND turned_off_at IS NULL FOR UPDATE`,
      [hashToken(key)],
    );
    if (rows[0] === undefined) return { ok: false, reason: "not-valid" } as const;
    const uses = z
      .object({ day: z.string().nullable(), uses_count: z.number().int() })
      .parse(rows[0]);
    const count = uses.day === today ? uses.uses_count : 0;
    if (count >= MAX_INTAKE_DEALS_PER_DAY) return { ok: false, reason: "too-many" } as const;
    const updated = await tx.query(
      `UPDATE intake_keys SET uses_day = $2::date, uses_count = $3, last_used_at = $4
        WHERE token_hash = $1 RETURNING *`,
      [hashToken(key), today, count + 1, now],
    );
    return { ok: true, record: keyRow.parse(updated[0]) } as const;
  });
}
