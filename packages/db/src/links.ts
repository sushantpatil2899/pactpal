import { z } from "zod";
import type { Database } from "./database.js";
import { DealNotFoundError } from "./ledger-store.js";
import { createSession, hashToken, isTokenShaped, newSessionToken } from "./sessions.js";

/**
 * How long a buyer link works. Buyers may take days to respond, and a link can be opened more
 * than once (mail scanners and re-opened emails would break single-use links).
 */
export const LINK_LIFETIME_MS = 14 * 24 * 60 * 60 * 1000;

/** Links can only be made for the deal's buyer. */
export class LinkNotAllowedError extends Error {
  override readonly name = "LinkNotAllowedError";
}

export type RedeemResult =
  | { ok: true; dealId: string; session: { token: string; expiresAt: Date } }
  /** `replaced`: a newer link was sent, or the person is no longer the deal's buyer. */
  | { ok: false; reason: "unknown" | "expired" | "replaced" };

const dealBuyer = z.object({ buyer_id: z.string().nullable() });

const linkRow = z.object({
  deal_id: z.string(),
  user_id: z.string(),
  expires_at: z.date(),
  revoked_at: z.date().nullable(),
  buyer_id: z.string().nullable(),
});

/**
 * Makes a link that lets the deal's buyer into that one deal, and cancels the buyer's earlier
 * link for it. Returns the secret once; only its hash is stored. `now` and `token` come from the
 * caller.
 */
export async function createDealLink(
  db: Database,
  link: { dealId: string; userId: string },
  now: Date,
  token: string = newSessionToken(),
): Promise<{ token: string; expiresAt: Date }> {
  const expiresAt = new Date(now.getTime() + LINK_LIFETIME_MS);
  await db.transaction(async (tx) => {
    // Locking the deal makes two links sent at once take turns, so only one stays active.
    const rows = await tx.query("SELECT buyer_id FROM deals WHERE id = $1 FOR UPDATE", [
      link.dealId,
    ]);
    const deal = dealBuyer.safeParse(rows[0]);
    if (!deal.success) throw new DealNotFoundError(`No deal ${link.dealId}`);
    if (deal.data.buyer_id !== link.userId) {
      throw new LinkNotAllowedError("Links can only be made for the deal's buyer");
    }
    await tx.query(
      `UPDATE link_tokens SET revoked_at = $3
       WHERE deal_id = $1 AND user_id = $2 AND purpose = 'deal-access' AND revoked_at IS NULL`,
      [link.dealId, link.userId, now],
    );
    await tx.query(
      `INSERT INTO link_tokens (token_hash, deal_id, user_id, purpose, created_at, expires_at)
       VALUES ($1, $2, $3, 'deal-access', $4, $5)`,
      [hashToken(token), link.dealId, link.userId, now, expiresAt],
    );
  });
  return { token, expiresAt };
}

/**
 * Lets the holder of a link in: checks the link, records its use, marks the person's email as
 * proven (the link reached that address) and starts a session limited to the link's deal, all in
 * one transaction.
 */
export async function redeemDealLink(
  db: Database,
  token: string,
  now: Date,
  sessionToken: string = newSessionToken(),
): Promise<RedeemResult> {
  if (!isTokenShaped(token)) return { ok: false, reason: "unknown" };
  return db.transaction(async (tx): Promise<RedeemResult> => {
    const rows = await tx.query(
      `SELECT l.deal_id, l.user_id, l.expires_at, l.revoked_at, d.buyer_id
       FROM link_tokens l JOIN deals d ON d.id = l.deal_id
       WHERE l.token_hash = $1
       FOR UPDATE OF l`,
      [hashToken(token)],
    );
    if (rows[0] === undefined) return { ok: false, reason: "unknown" };
    const link = linkRow.parse(rows[0]);
    if (link.revoked_at !== null || link.buyer_id !== link.user_id) {
      return { ok: false, reason: "replaced" };
    }
    if (link.expires_at <= now) return { ok: false, reason: "expired" };

    await tx.query("UPDATE link_tokens SET last_used_at = $2 WHERE token_hash = $1", [
      hashToken(token),
      now,
    ]);
    await tx.query(
      `UPDATE users SET email_verified_at = $2, updated_at = $2
       WHERE id = $1 AND email_verified_at IS NULL`,
      [link.user_id, now],
    );
    const session = await createSession(tx, link.user_id, now, sessionToken, {
      method: "link",
      dealId: link.deal_id,
    });
    return { ok: true, dealId: link.deal_id, session };
  });
}
