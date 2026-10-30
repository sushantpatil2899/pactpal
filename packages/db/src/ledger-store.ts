import {
  EVENT_TYPES,
  nextEntry,
  verifyChain,
  type Actor,
  type LedgerEntry,
  type NewEvent,
  type VerifyResult,
} from "@pactpal/ledger";
import { z } from "zod";
import type { Queryable } from "./database.js";

/** Another writer took the position this entry needed. Nothing was saved; the caller may retry. */
export class LedgerConflictError extends Error {
  override readonly name = "LedgerConflictError";
}

/** The event names someone who is not allowed to act in that role on that deal. */
export class LedgerActorError extends Error {
  override readonly name = "LedgerActorError";
}

export class DealNotFoundError extends Error {
  override readonly name = "DealNotFoundError";
}

const ACTORS = ["seller", "buyer", "system"] as const satisfies readonly Actor[];

const COLUMNS = `deal_id, seq, type, actor, actor_user_id, payload, payload_hash, prev_hash,
  entry_hash, server_time, ip, user_agent`;

const entryRow = z
  .object({
    deal_id: z.string(),
    seq: z.number().int(),
    type: z.enum(EVENT_TYPES),
    actor: z.enum(ACTORS),
    actor_user_id: z.string().nullable(),
    payload: z.json(),
    payload_hash: z.string(),
    prev_hash: z.string(),
    entry_hash: z.string(),
    server_time: z.date(),
    ip: z.string().nullable(),
    user_agent: z.string().nullable(),
  })
  .transform((row): LedgerEntry => ({
    dealId: row.deal_id,
    seq: row.seq,
    type: row.type,
    actor: row.actor,
    // The database stores "none" as NULL; the entry's hash was computed without the field.
    actorId: row.actor_user_id ?? undefined,
    payload: row.payload,
    payloadHash: row.payload_hash,
    prevHash: row.prev_hash,
    entryHash: row.entry_hash,
    serverTime: row.server_time.toISOString(),
    ip: row.ip ?? undefined,
    userAgent: row.user_agent ?? undefined,
  }));

const dealParties = z.object({ seller_id: z.string(), buyer_id: z.string().nullable() });

const UNIQUE_VIOLATION = "23505";

/** True for a Postgres "already exists" error, from either driver. */
export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === UNIQUE_VIOLATION
  );
}

async function loadParties(q: Queryable, dealId: string, lock: boolean) {
  const rows = await q.query(
    `SELECT seller_id, buyer_id FROM deals WHERE id = $1${lock ? " FOR UPDATE" : ""}`,
    [dealId],
  );
  const parties = dealParties.safeParse(rows[0]);
  if (!parties.success) throw new DealNotFoundError(`No deal ${dealId}`);
  return parties.data;
}

/** A person acts as the seller or the buyer only if they are that deal's seller or buyer. */
function assertActorAllowed(
  event: Pick<NewEvent, "type" | "actor" | "actorId">,
  parties: z.infer<typeof dealParties>,
): void {
  const allowed =
    event.actor === "system"
      ? event.actorId === undefined
      : event.actorId === (event.actor === "seller" ? parties.seller_id : parties.buyer_id);
  if (!allowed) {
    throw new LedgerActorError(
      `${event.type}: the acting user is not the deal's ${event.actor === "system" ? "system (it has none)" : event.actor}`,
    );
  }
}

/**
 * Checks, without locking or writing, that the deal exists and the event's actor may act on it.
 * Lets callers refuse early (before storing a file, say); `appendLedgerEvent` checks again
 * under the lock, which is the check that counts.
 */
export async function assertMayAct(
  q: Queryable,
  event: Pick<NewEvent, "dealId" | "type" | "actor" | "actorId">,
): Promise<void> {
  assertActorAllowed(event, await loadParties(q, event.dealId, false));
}

/**
 * Adds an event to a deal's ledger. Call it inside `Database.transaction`, with the change the
 * event records, so both are saved together or not at all. Locks the deal's row so writers to
 * the same deal take turns; the (deal, position) key is the backstop if a caller forgets the
 * transaction. `now` is the server's clock, passed in so tests are exact.
 */
export async function appendLedgerEvent(
  tx: Queryable,
  event: NewEvent,
  now: Date,
): Promise<LedgerEntry> {
  assertActorAllowed(event, await loadParties(tx, event.dealId, true));

  const lastRows = await tx.query(
    `SELECT ${COLUMNS} FROM ledger_entries WHERE deal_id = $1 ORDER BY seq DESC LIMIT 1`,
    [event.dealId],
  );
  const entry = nextEntry(
    lastRows[0] === undefined ? undefined : entryRow.parse(lastRows[0]),
    event,
    now,
  );
  try {
    await tx.query(
      `INSERT INTO ledger_entries (${COLUMNS})
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12)`,
      [
        entry.dealId,
        entry.seq,
        entry.type,
        entry.actor,
        entry.actorId ?? null,
        JSON.stringify(entry.payload),
        entry.payloadHash,
        entry.prevHash,
        entry.entryHash,
        entry.serverTime,
        entry.ip ?? null,
        entry.userAgent ?? null,
      ],
    );
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new LedgerConflictError(`Deal ${event.dealId} already has an entry at ${entry.seq}`, {
        cause: error,
      });
    }
    throw error;
  }
  return entry;
}

/** A deal's whole ledger, oldest first. Empty for an unknown deal. */
export async function readLedger(q: Queryable, dealId: string): Promise<LedgerEntry[]> {
  const rows = await q.query(
    `SELECT ${COLUMNS} FROM ledger_entries WHERE deal_id = $1 ORDER BY seq`,
    [dealId],
  );
  return rows.map((row) => entryRow.parse(row));
}

/** Reads a deal's ledger and recomputes every fingerprint and link; names the first bad entry. */
export async function verifyStoredLedger(q: Queryable, dealId: string): Promise<VerifyResult> {
  return verifyChain(await readLedger(q, dealId));
}
