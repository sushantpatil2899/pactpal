import { randomBytes } from "node:crypto";
import { sha256Hex } from "@pactpal/ledger";
import type { Queryable } from "./database.js";
import { userFrom, type User } from "./users.js";

/** How long a sign-in lasts before the person must sign in again. */
export const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

/** 32 random bytes, written as 43 URL-safe characters. */
export const newSessionToken = (): string => randomBytes(32).toString("base64url");

const TOKEN_FORMAT = /^[A-Za-z0-9_-]{43}$/;

// Only the hash is stored, so the sessions table cannot be used to sign in.
const hashOf = (token: string): string => sha256Hex(token);

/**
 * Starts a session for a user and returns the token to put in the browser's cookie. The token
 * itself is never stored. `now` is the server's clock; `token` is injectable for tests.
 */
export async function createSession(
  q: Queryable,
  userId: string,
  now: Date,
  token: string = newSessionToken(),
): Promise<{ token: string; expiresAt: Date }> {
  const expiresAt = new Date(now.getTime() + SESSION_LIFETIME_MS);
  await q.query(
    "INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES ($1, $2, $3, $4)",
    [hashOf(token), userId, now, expiresAt],
  );
  return { token, expiresAt };
}

/** The signed-in user for a cookie's token, or undefined. An expired session is removed. */
export async function findSessionUser(
  q: Queryable,
  token: string,
  now: Date,
): Promise<User | undefined> {
  if (!TOKEN_FORMAT.test(token)) return undefined;
  const rows = await q.query(
    `SELECT u.*, s.expires_at AS session_expires_at
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1`,
    [hashOf(token)],
  );
  const expiresAt = rows[0]?.session_expires_at;
  if (!(expiresAt instanceof Date)) return undefined;
  if (expiresAt <= now) {
    await deleteSession(q, token);
    return undefined;
  }
  return userFrom(rows);
}

/** Ends a session (signing out). Unknown tokens are ignored. */
export async function deleteSession(q: Queryable, token: string): Promise<void> {
  if (!TOKEN_FORMAT.test(token)) return;
  await q.query("DELETE FROM sessions WHERE token_hash = $1", [hashOf(token)]);
}
