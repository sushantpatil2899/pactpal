import { z } from "zod";
import type { Queryable } from "./database.js";
import { isUniqueViolation } from "./ledger-store.js";

/** The email or a PayPal id already belongs to another user. */
export class UserConflictError extends Error {
  override readonly name = "UserConflictError";
}

export const newUserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  /** Set only when the address was proven (PayPal says verified, or an emailed link was used). */
  emailVerifiedAt: z.date().optional(),
  displayName: z.string().trim().min(1).optional(),
  paypalUserId: z.string().min(1).optional(),
  paypalPayerId: z.string().min(1).optional(),
});
export type NewUser = z.infer<typeof newUserSchema>;

const userRow = z
  .object({
    id: z.string(),
    email: z.string(),
    email_verified_at: z.date().nullable(),
    display_name: z.string().nullable(),
    paypal_user_id: z.string().nullable(),
    paypal_payer_id: z.string().nullable(),
    created_at: z.date(),
    updated_at: z.date(),
  })
  .transform((row) => ({
    id: row.id,
    email: row.email,
    emailVerifiedAt: row.email_verified_at ?? undefined,
    displayName: row.display_name ?? undefined,
    paypalUserId: row.paypal_user_id ?? undefined,
    paypalPayerId: row.paypal_payer_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
export type User = z.output<typeof userRow>;

/** Reads the single user a query returned, if any. */
export function userFrom(rows: readonly unknown[]): User | undefined {
  return rows[0] === undefined ? undefined : userRow.parse(rows[0]);
}

/** Runs a user write, reporting a duplicate email or PayPal id as `UserConflictError`. */
async function writeUser(q: Queryable, sql: string, params: readonly unknown[]): Promise<User> {
  try {
    return userRow.parse((await q.query(sql, params))[0]);
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new UserConflictError("A user with that email or PayPal id already exists", {
        cause: error,
      });
    }
    throw error;
  }
}

/**
 * Adds a person. Everyone is a user: sellers, buyers, or both; the role belongs to the deal.
 * A person invited by email has no PayPal ids until they sign in with PayPal.
 */
export async function createUser(q: Queryable, input: NewUser, now: Date): Promise<User> {
  const user = newUserSchema.parse(input);
  return writeUser(
    q,
    `INSERT INTO users (id, email, email_verified_at, display_name, paypal_user_id,
                        paypal_payer_id, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
     RETURNING *`,
    [
      user.id,
      user.email,
      user.emailVerifiedAt ?? null,
      user.displayName ?? null,
      user.paypalUserId ?? null,
      user.paypalPayerId ?? null,
      now,
    ],
  );
}

export async function findUserByPayPalId(
  q: Queryable,
  paypalUserId: string,
): Promise<User | undefined> {
  return userFrom(await q.query("SELECT * FROM users WHERE paypal_user_id = $1", [paypalUserId]));
}

/** Email addresses are compared ignoring upper and lower case, as the unique rule does. */
export async function findUserByEmail(q: Queryable, email: string): Promise<User | undefined> {
  return userFrom(await q.query("SELECT * FROM users WHERE lower(email) = lower($1)", [email]));
}

/** Attaches PayPal ids to an existing user (one who was invited by email, say). */
export async function linkPayPal(
  q: Queryable,
  userId: string,
  paypal: { paypalUserId: string; paypalPayerId?: string },
  now: Date,
): Promise<User> {
  return writeUser(
    q,
    `UPDATE users SET paypal_user_id = $2, paypal_payer_id = $3, updated_at = $4
     WHERE id = $1 RETURNING *`,
    [userId, paypal.paypalUserId, paypal.paypalPayerId ?? null, now],
  );
}
