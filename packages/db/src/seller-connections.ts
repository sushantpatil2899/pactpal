import { z } from "zod";
import type { Database, Queryable } from "./database.js";

interface ConnectionBase {
  id: string;
  userId: string;
  status: "pending" | "connected" | "disconnected";
  /** The seller's PayPal account id (payer id); set once connected. */
  merchantId: string | undefined;
  /** Permission addresses PayPal lists for the app that acts for the seller. */
  scopes: string[];
  createdAt: Date;
  connectedAt: Date | undefined;
  disconnectedAt: Date | undefined;
}

/**
 * A PactPal seller's link to a PayPal account: through Partner Referrals ("Connect with PayPal",
 * PactPal's platform app acts for them) or through the seller's own sandbox REST app (6h).
 */
export type SellerConnection =
  | (ConnectionBase & {
      method: "partner";
      /** PactPal's own id for the attempt; PayPal gives it back when the seller is looked up. */
      trackingId: string;
    })
  | (ConnectionBase & {
      method: "own_app";
      /** The client id of the seller's own app. Not secret; the secret is read with `ownAppKeys`. */
      clientId: string;
      /** PayPal's id for the alert address registered on the app (6h-4), if registered. */
      webhookId: string | undefined;
    });

const COLUMNS =
  "id, user_id, method, tracking_id, client_id, webhook_id, status, merchant_id, scopes, created_at, connected_at, disconnected_at";

const connectionRow = z
  .object({
    id: z.string(),
    user_id: z.string(),
    method: z.enum(["partner", "own_app"]),
    tracking_id: z.string().nullable(),
    client_id: z.string().nullable(),
    webhook_id: z.string().nullable(),
    status: z.enum(["pending", "connected", "disconnected"]),
    merchant_id: z.string().nullable(),
    scopes: z.array(z.string()),
    created_at: z.date(),
    connected_at: z.date().nullable(),
    disconnected_at: z.date().nullable(),
  })
  .transform((row, ctx): SellerConnection => {
    const base: ConnectionBase = {
      id: row.id,
      userId: row.user_id,
      status: row.status,
      merchantId: row.merchant_id ?? undefined,
      scopes: row.scopes,
      createdAt: row.created_at,
      connectedAt: row.connected_at ?? undefined,
      disconnectedAt: row.disconnected_at ?? undefined,
    };
    if (row.method === "partner" && row.tracking_id !== null) {
      return { ...base, method: "partner", trackingId: row.tracking_id };
    }
    if (row.method === "own_app" && row.client_id !== null) {
      return {
        ...base,
        method: "own_app",
        clientId: row.client_id,
        webhookId: row.webhook_id ?? undefined,
      };
    }
    // The database's own checks make this unreachable; refuse rather than guess.
    ctx.addIssue({ code: "custom", message: `a ${row.method} connection is missing its id` });
    return z.NEVER;
  });

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
 * Inside a transaction: refuses if the PayPal account is live for another user, else ends the
 * user's earlier connection, so each user and each PayPal account keeps at most one.
 */
async function claimAccount(
  tx: Queryable,
  userId: string,
  merchantId: string,
  now: Date,
): Promise<boolean> {
  const holder = first(
    await tx.query(
      `SELECT ${COLUMNS} FROM seller_connections
       WHERE merchant_id = $1 AND status = 'connected' FOR UPDATE`,
      [merchantId],
    ),
  );
  if (holder !== undefined && holder.userId !== userId) return false;
  await endConnection(tx, userId, now);
  return true;
}

/** Marks an attempt connected once PayPal has confirmed it, in one transaction. */
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
    if (!(await claimAccount(tx, attempt.userId, input.merchantId, now))) {
      return { ok: false, reason: "account-taken" } as const;
    }
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

/** A seller's own app, already checked with PayPal; its secret sealed by the caller. */
export interface OwnAppLink {
  id: string;
  userId: string;
  clientId: string;
  /** The app secret, encrypted (`SecretBox`); never the plain value. */
  sealedSecret: string;
  merchantId: string;
  scopes: readonly string[];
}

/**
 * Links a seller's own app in one transaction, ending their earlier connection. Refused if the
 * PayPal account is live for another user.
 */
export async function linkOwnApp(
  db: Database,
  input: OwnAppLink,
  now: Date,
): Promise<{ ok: true; connection: SellerConnection } | { ok: false; reason: "account-taken" }> {
  return db.transaction(async (tx) => {
    if (!(await claimAccount(tx, input.userId, input.merchantId, now))) {
      return { ok: false, reason: "account-taken" } as const;
    }
    const rows = await tx.query(
      `INSERT INTO seller_connections
         (id, user_id, method, client_id, client_secret_sealed, status, merchant_id, scopes,
          created_at, connected_at)
       VALUES ($1, $2, 'own_app', $3, $4, 'connected', $5, $6, $7, $7)
       RETURNING ${COLUMNS}`,
      [
        input.id,
        input.userId,
        input.clientId,
        input.sealedSecret,
        input.merchantId,
        [...input.scopes],
        now,
      ],
    );
    return { ok: true, connection: connectionRow.parse(rows[0]) } as const;
  });
}

/** Ends the user's live connection; an own app's secret is wiped, the row kept. */
async function endConnection(q: Queryable, userId: string, now: Date): Promise<boolean> {
  const rows = await q.query(
    `UPDATE seller_connections
     SET status = 'disconnected', disconnected_at = $2, client_secret_sealed = NULL
     WHERE user_id = $1 AND status = 'connected'
     RETURNING id`,
    [userId, now],
  );
  return rows.length > 0;
}

/**
 * Ends the seller's connection; the row is kept, so it stays known which PayPal account past
 * invoices came from. An own app's secret is wiped. True if there was one to end.
 */
export function disconnectSeller(q: Queryable, userId: string, now: Date): Promise<boolean> {
  return endConnection(q, userId, now);
}

const keysRow = z.object({
  client_id: z.string(),
  client_secret_sealed: z.string(),
  merchant_id: z.string(),
  webhook_id: z.string().nullable(),
});

/**
 * The client id, sealed secret and PayPal account of a live own-app connection, or undefined once it has ended
 * (the secret is gone) or for a Partner Referrals connection.
 */
export async function ownAppKeys(
  q: Queryable,
  connectionId: string,
): Promise<
  | { clientId: string; sealedSecret: string; merchantId: string; webhookId: string | undefined }
  | undefined
> {
  const rows = await q.query(
    `SELECT client_id, client_secret_sealed, merchant_id, webhook_id FROM seller_connections
     WHERE id = $1 AND method = 'own_app' AND status = 'connected'`,
    [connectionId],
  );
  if (rows[0] === undefined) return undefined;
  const row = keysRow.parse(rows[0]);
  return {
    clientId: row.client_id,
    sealedSecret: row.client_secret_sealed,
    merchantId: row.merchant_id,
    webhookId: row.webhook_id ?? undefined,
  };
}

/** Keeps the alert address PayPal registered on a live own app (6h-4). True if one was updated. */
export async function setOwnAppWebhook(
  q: Queryable,
  connectionId: string,
  webhookId: string,
): Promise<boolean> {
  const rows = await q.query(
    `UPDATE seller_connections SET webhook_id = $2
     WHERE id = $1 AND method = 'own_app' AND status = 'connected'
     RETURNING id`,
    [connectionId, webhookId],
  );
  return rows.length > 0;
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
