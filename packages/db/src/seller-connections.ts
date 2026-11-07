import { z } from "zod";
import type { Database, Queryable } from "./database.js";

/** A PactPal seller's link to a PayPal account through Partner Referrals ("Connect with PayPal"). */
export interface SellerConnection {
  id: string;
  userId: string;
  method: "partner";
  /** PactPal's own id for the attempt; PayPal gives it back when the seller is looked up. */
  trackingId: string;
  status: "pending" | "connected" | "disconnected";
  /** The seller's PayPal account id (payer id); set once connected. */
  merchantId: string | undefined;
  /** Permission addresses PayPal says the seller granted to PactPal's platform app. */
  scopes: string[];
  createdAt: Date;
  connectedAt: Date | undefined;
  disconnectedAt: Date | undefined;
}

const COLUMNS =
  "id, user_id, method, tracking_id, status, merchant_id, scopes, created_at, connected_at, disconnected_at";

const connectionRow = z
  .object({
    id: z.string(),
    user_id: z.string(),
    method: z.literal("partner"),
    tracking_id: z.string(),
    status: z.enum(["pending", "connected", "disconnected"]),
    merchant_id: z.string().nullable(),
    scopes: z.array(z.string()),
    created_at: z.date(),
    connected_at: z.date().nullable(),
    disconnected_at: z.date().nullable(),
  })
  .transform((row): SellerConnection => ({
    id: row.id,
    userId: row.user_id,
    method: row.method,
    trackingId: row.tracking_id,
    status: row.status,
    merchantId: row.merchant_id ?? undefined,
    scopes: row.scopes,
    createdAt: row.created_at,
    connectedAt: row.connected_at ?? undefined,
    disconnectedAt: row.disconnected_at ?? undefined,
  }));

const first = (rows: readonly unknown[]): SellerConnection | undefined =>
  rows[0] === undefined ? undefined : connectionRow.parse(rows[0]);

/** Records that a seller started connecting; PayPal has not confirmed anything yet. */
export async function startConnection(
  q: Queryable,
  input: { id: string; userId: string; trackingId: string },
  now: Date,
): Promise<SellerConnection> {
  const rows = await q.query(
    `INSERT INTO seller_connections (id, user_id, method, tracking_id, status, created_at)
     VALUES ($1, $2, 'partner', $3, 'pending', $4)
     RETURNING ${COLUMNS}`,
    [input.id, input.userId, input.trackingId, now],
  );
  return connectionRow.parse(rows[0]);
}

/** Why a connection could not be confirmed. */
export type ConfirmRefusal =
  /** No attempt has this tracking id. */
  | "unknown"
  /** The attempt was already confirmed or ended. */
  | "not-pending"
  /** The PayPal account is connected to another PactPal user. */
  | "account-taken";

/**
 * Marks an attempt connected once PayPal has confirmed it, in one transaction: the seller's
 * earlier connection (if any) is ended, so each user and each PayPal account has at most one.
 */
export async function confirmConnection(
  db: Database,
  input: { trackingId: string; merchantId: string; scopes: readonly string[] },
  now: Date,
): Promise<{ ok: true; connection: SellerConnection } | { ok: false; reason: ConfirmRefusal }> {
  return db.transaction(async (tx) => {
    const attempt = first(
      await tx.query(
        `SELECT ${COLUMNS} FROM seller_connections WHERE tracking_id = $1 FOR UPDATE`,
        [input.trackingId],
      ),
    );
    if (attempt === undefined) return { ok: false, reason: "unknown" } as const;
    if (attempt.status !== "pending") return { ok: false, reason: "not-pending" } as const;
    const holder = first(
      await tx.query(
        `SELECT ${COLUMNS} FROM seller_connections
         WHERE merchant_id = $1 AND status = 'connected' FOR UPDATE`,
        [input.merchantId],
      ),
    );
    if (holder !== undefined && holder.userId !== attempt.userId) {
      return { ok: false, reason: "account-taken" } as const;
    }
    await endConnection(tx, attempt.userId, now);
    const rows = await tx.query(
      `UPDATE seller_connections
       SET status = 'connected', merchant_id = $2, scopes = $3, connected_at = $4
       WHERE id = $1
       RETURNING ${COLUMNS}`,
      [attempt.id, input.merchantId, [...input.scopes], now],
    );
    return { ok: true, connection: connectionRow.parse(rows[0]) } as const;
  });
}

async function endConnection(q: Queryable, userId: string, now: Date): Promise<boolean> {
  const rows = await q.query(
    `UPDATE seller_connections SET status = 'disconnected', disconnected_at = $2
     WHERE user_id = $1 AND status = 'connected'
     RETURNING id`,
    [userId, now],
  );
  return rows.length > 0;
}

/**
 * Ends the seller's connection; the row is kept, so it stays known which PayPal account past
 * invoices came from. True if there was one to end.
 */
export function disconnectSeller(q: Queryable, userId: string, now: Date): Promise<boolean> {
  return endConnection(q, userId, now);
}

/** The seller's live connection, or undefined (they then use PactPal's own seller app). */
export async function activeConnection(
  q: Queryable,
  userId: string,
): Promise<SellerConnection | undefined> {
  return first(
    await q.query(
      `SELECT ${COLUMNS} FROM seller_connections WHERE user_id = $1 AND status = 'connected'`,
      [userId],
    ),
  );
}

/** Every live connection, oldest first; for checking each connected seller's disputes. */
export async function connectedSellers(q: Queryable): Promise<SellerConnection[]> {
  const rows = await q.query(
    `SELECT ${COLUMNS} FROM seller_connections WHERE status = 'connected' ORDER BY connected_at, id`,
  );
  return rows.map((row) => connectionRow.parse(row));
}
