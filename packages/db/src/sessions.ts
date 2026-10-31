import { randomBytes } from "node:crypto";
import { sha256Hex } from "@pactpal/ledger";
import { z } from "zod";
import type { Queryable } from "./database.js";
import { userFrom, type User } from "./users.js";

/** How long a sign-in lasts before the person must sign in again. */
export const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

/** 32 random bytes, written as 43 URL-safe characters. */
export const newSessionToken = (): string => randomBytes(32).toString("base64url");

const TOKEN_FORMAT = /^[A-Za-z0-9_-]{43}$/;

/** True if a value has the shape of a secret made by `newSessionToken` (checked before any lookup). */
export const isTokenShaped = (value: string): boolean => TOKEN_FORMAT.test(value);

/** Only this hash of a secret is stored, so a leaked table cannot be used to get in. */
export const hashToken = (token: string): string => sha256Hex(token);

/** What a session lets its holder do: everything (signed in with PayPal), or one deal (a buyer link). */
export type SessionAccess = { method: "paypal" } | { method: "link"; dealId: string };

/**
 * Starts a session for a user and returns the token to put in the browser's cookie. The token
 * itself is never stored. `now` is the server's clock; `token` is injectable for tests.
 */
export async function createSession(
  q: Queryable,
  userId: string,
  now: Date,
  token: string = newSessionToken(),
  access: SessionAccess = { method: "paypal" },
): Promise<{ token: string; expiresAt: Date }> {
  const expiresAt = new Date(now.getTime() + SESSION_LIFETIME_MS);
  await q.query(
    `INSERT INTO sessions (token_hash, user_id, created_at, expires_at, method, deal_id)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      hashToken(token),
      userId,
      now,
      expiresAt,
      access.method,
      access.method === "link" ? access.dealId : null,
    ],
  );
  return { token, expiresAt };
}

const sessionRow = z.object({
  session_expires_at: z.date(),
  session_method: z.enum(["paypal", "link"]),
  session_deal_id: z.string().nullable(),
});

/**
 * The signed-in user for a cookie's token and what the session allows, or undefined. An expired
 * session is removed.
 */
export async function findSession(
  q: Queryable,
  token: string,
  now: Date,
): Promise<{ user: User; access: SessionAccess } | undefined> {
  if (!isTokenShaped(token)) return undefined;
  const rows = await q.query(
    `SELECT u.*, s.expires_at AS session_expires_at, s.method AS session_method,
            s.deal_id AS session_deal_id
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1`,
    [hashToken(token)],
  );
  const user = userFrom(rows);
  if (!user) return undefined;
  const session = sessionRow.parse(rows[0]);
  if (session.session_expires_at <= now) {
    await deleteSession(q, token);
    return undefined;
  }
  const access: SessionAccess =
    session.session_method === "link" && session.session_deal_id !== null
      ? { method: "link", dealId: session.session_deal_id }
      : { method: "paypal" };
  return { user, access };
}

/** Ends a session (signing out). Unknown tokens are ignored. */
export async function deleteSession(q: Queryable, token: string): Promise<void> {
  if (!isTokenShaped(token)) return;
  await q.query("DELETE FROM sessions WHERE token_hash = $1", [hashToken(token)]);
}
