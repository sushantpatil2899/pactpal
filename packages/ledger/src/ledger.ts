import { canonicalJson, sha256Hex, type JsonValue } from "./canonical.js";

/** Hash used as prevHash for the first entry of a deal's chain. */
export const GENESIS_HASH = "0".repeat(64);

export type Actor = "seller" | "buyer" | "system";

/** Event types recorded by the server. AI drafts are never ledger events. */
export const EVENT_TYPES = [
  "DEAL_CREATED",
  "SOURCE_ADDED",
  "SCOPE_DRAFTED",
  "SCOPE_CONFIRMED",
  "SCOPE_VERSIONED",
  "ACCEPTANCE_REQUESTED",
  "ACCEPTED",
  "DECLINED",
  "RECEIPT_SENT",
  "COVERAGE_NOTICE_SHOWN",
  "INVOICE_SENT",
  "PAYMENT_RECEIVED",
  "DELIVERABLE_ADDED",
  "DELIVERY_CHECKED",
  "DELIVERY_SENT",
  "DELIVERY_VIEWED",
  "DELIVERY_DOWNLOADED",
  "MILESTONE_APPROVED",
  "CHANGE_REQUESTED",
  "MESSAGE_CLASSIFIED",
  "CHANGE_ORDER_PROPOSED",
  "CHANGE_ORDER_ACCEPTED",
  "BUYER_QUESTION",
  "AI_ANSWER_SHOWN",
  "REFUND_ISSUED",
  "DISPUTE_OPENED",
  "DISPUTE_UPDATED",
  "CLAIM_ANALYZED",
  "PACKET_BUILT",
  "PACKET_CONFIRMED",
  "EVIDENCE_UPLOADED",
  "OFFER_MADE",
  "DISPUTE_RESOLVED",
  "APPEAL_CHECKED",
  "APPEAL_SUBMITTED",
  "RECORD_EXPORTED",
  "NOTE_ADDED",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export interface LedgerEntry {
  dealId: string;
  seq: number;
  type: EventType;
  actor: Actor;
  /** The person who acted (a user id); absent for `system` events. Covered by the entry hash. */
  actorId?: string;
  payload: JsonValue;
  payloadHash: string;
  prevHash: string;
  entryHash: string;
  /** ISO 8601 timestamp taken on the server when the event was written. */
  serverTime: string;
  ip?: string;
  userAgent?: string;
}

export interface NewEvent {
  dealId: string;
  type: EventType;
  actor: Actor;
  actorId?: string;
  payload: JsonValue;
  ip?: string;
  userAgent?: string;
}

function computeEntryHash(e: Omit<LedgerEntry, "entryHash" | "payload">): string {
  const fields = {
    dealId: e.dealId,
    seq: e.seq,
    type: e.type,
    actor: e.actor,
    actorId: e.actorId,
    payloadHash: e.payloadHash,
    prevHash: e.prevHash,
    serverTime: e.serverTime,
    ip: e.ip,
    userAgent: e.userAgent,
  };
  return sha256Hex(e.prevHash + canonicalJson(fields));
}

/**
 * Builds the entry that follows `last` (or the first entry when there is none). Pure: the
 * caller persists it. Needs only the previous entry, so a database can load just that one.
 * Corrections are new events that reference earlier ones; nothing is edited.
 */
export function nextEntry(
  last: LedgerEntry | undefined,
  event: NewEvent,
  now: Date = new Date(),
): LedgerEntry {
  if (last && last.dealId !== event.dealId) {
    throw new Error(
      `Event for deal ${event.dealId} cannot extend the chain of deal ${last.dealId}`,
    );
  }
  const base = {
    dealId: event.dealId,
    seq: last ? last.seq + 1 : 0,
    type: event.type,
    actor: event.actor,
    actorId: event.actorId,
    payloadHash: sha256Hex(canonicalJson(event.payload)),
    prevHash: last ? last.entryHash : GENESIS_HASH,
    serverTime: now.toISOString(),
    ip: event.ip,
    userAgent: event.userAgent,
  };
  return { ...base, payload: event.payload, entryHash: computeEntryHash(base) };
}

/** Builds the next entry of a deal's chain from the whole chain so far. */
export function appendEvent(
  chain: readonly LedgerEntry[],
  event: NewEvent,
  now: Date = new Date(),
): LedgerEntry {
  return nextEntry(chain[chain.length - 1], event, now);
}

export type VerifyResult =
  | { valid: true; head: string; length: number }
  | { valid: false; brokenAt: number; reason: string };

/** Recomputes every hash and link; reports the first entry that does not match. */
export function verifyChain(entries: readonly LedgerEntry[]): VerifyResult {
  let prevHash = GENESIS_HASH;
  const dealId = entries[0]?.dealId;
  for (const [i, e] of entries.entries()) {
    if (e.seq !== i)
      return { valid: false, brokenAt: i, reason: `expected seq ${i}, found ${e.seq}` };
    if (e.dealId !== dealId) {
      return { valid: false, brokenAt: i, reason: "entry belongs to a different deal" };
    }
    if (e.prevHash !== prevHash) {
      return { valid: false, brokenAt: i, reason: "prevHash does not match the previous entry" };
    }
    if (sha256Hex(canonicalJson(e.payload)) !== e.payloadHash) {
      return { valid: false, brokenAt: i, reason: "payload does not match payloadHash" };
    }
    if (computeEntryHash(e) !== e.entryHash) {
      return { valid: false, brokenAt: i, reason: "entry fields do not match entryHash" };
    }
    prevHash = e.entryHash;
  }
  return { valid: true, head: prevHash, length: entries.length };
}
