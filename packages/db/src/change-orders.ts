import type { LedgerEntry } from "@pactpal/ledger";
import { addedSteps, type TimelineStep } from "@pactpal/timeline";
import { z } from "zod";
import {
  acceptTermsSchema,
  documentFingerprint,
  insertAcceptance,
  originOf,
  signaturePayload,
  declineReasonSchema,
  type Acceptance,
  type AcceptTerms,
} from "./acceptance.js";
import type { Database, Queryable } from "./database.js";
import { DEAL_STATUSES } from "./deals.js";
import { DealNotFoundError, appendLedgerEvent } from "./ledger-store.js";
import { signedVersionOf } from "./signed.js";
import {
  getScopeVersion,
  insertScopeVersion,
  nextScopeVersion,
  scopeFingerprint,
  scopeTotalMinor,
  storableScopeContentSchema,
  type DeliverableKind,
  type ScopeContent,
  type ScopeVersion,
} from "./scope.js";

export const CHANGE_ORDER_STATUSES = ["proposed", "accepted", "declined", "withdrawn"] as const;
export type ChangeOrderStatus = (typeof CHANGE_ORDER_STATUSES)[number];

/** Why a change-order step was refused. */
export type ChangeOrderRefusal =
  /** Not this deal's seller (propose, withdraw) or buyer (accept, decline). */
  | "not-your-deal"
  /** The deal is not signed (a change order changes a signed agreement). */
  | "not-signed"
  /** Another change is already waiting for the buyer. */
  | "already-waiting"
  /** The proposal removes or changes signed terms, or adds nothing (see `problems`). */
  | "not-an-addition"
  /** No such change waiting (answered, withdrawn, or another deal's). */
  | "not-waiting"
  /** The page shown is not the change waiting: its version or fingerprint differs. */
  | "stale";

export class ChangeOrderNotAllowedError extends Error {
  override readonly name = "ChangeOrderNotAllowedError";
  constructor(
    readonly reason: ChangeOrderRefusal,
    /** For `not-an-addition`: the parts that are not additions (field names). */
    readonly problems: string[] = [],
  ) {
    super(`The change order step was refused: ${reason}`);
  }
}

/** What a change order adds to (or changes in) a signed agreement. */
export interface ScopeChange {
  addedLines: { text: string; mark: DeliverableKind }[];
  addedExclusions: string[];
  addedBuyerProvides: { text: string; dueDate?: string }[];
  addedStages: { title: string; amountMinor: number; dueDate?: string }[];
  /** Steps added after the signed timeline's (7f); empty when neither lists its own steps. */
  addedSteps: TimelineStep[];
  dueDate?: { from: string | null; to: string | null };
  revisionsIncluded?: { from: number; to: number };
  totalMinor: { from: number; to: number };
}

// Both sides were read through the same schema, so their keys come in the same order.
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Whether `start` is the start of `list`, item by item; and what comes after it. */
function extension<T>(start: readonly T[], list: readonly T[]): T[] | undefined {
  if (list.length < start.length) return undefined;
  return start.every((item, n) => same(item, list[n])) ? list.slice(start.length) : undefined;
}

/**
 * Compares a proposed version with the signed one: a change order may only add lines (with
 * marks), exclusions, buyer-provides items, payment stages and timeline steps after the signed
 * ones, change the
 * overall due date and raise the revisions included (only when the agreement states a number).
 * Everything signed stays exactly as it is, and something must change. Pure.
 */
export function changeOf(
  signed: ScopeContent,
  proposed: ScopeContent,
): { ok: true; change: ScopeChange } | { ok: false; problems: string[] } {
  const problems: string[] = [];
  if (proposed.summary !== signed.summary) problems.push("summary");
  const marks = (content: ScopeContent) =>
    content.deliverables.map((text, n) => ({ text, mark: content.deliverableKinds?.[n] ?? null }));
  const addedLines = extension(marks(signed), marks(proposed));
  if (addedLines === undefined) problems.push("deliverables");
  const addedExclusions = extension(signed.exclusions, proposed.exclusions);
  if (addedExclusions === undefined) problems.push("exclusions");
  const addedBuyerProvides = extension(signed.buyerProvides ?? [], proposed.buyerProvides ?? []);
  if (addedBuyerProvides === undefined) problems.push("buyerProvides");
  const addedStages = extension(signed.milestones, proposed.milestones);
  if (addedStages === undefined) problems.push("milestones");
  const steps = addedSteps(signed, proposed);
  if (steps === undefined) problems.push("timeline");
  const revisionsOk =
    signed.revisionsIncluded === undefined
      ? proposed.revisionsIncluded === undefined
      : proposed.revisionsIncluded !== undefined &&
        proposed.revisionsIncluded >= signed.revisionsIncluded;
  if (!revisionsOk) problems.push("revisionsIncluded");
  // The product as listed is part of what was signed; a change order adds, never replaces it.
  if (!same(signed.listing, proposed.listing)) problems.push("listing");
  if (
    addedLines === undefined ||
    addedExclusions === undefined ||
    addedBuyerProvides === undefined ||
    addedStages === undefined ||
    steps === undefined ||
    problems.length > 0
  ) {
    return { ok: false, problems };
  }
  const change: ScopeChange = {
    addedLines,
    addedExclusions,
    addedBuyerProvides,
    addedStages,
    addedSteps: steps,
    ...(proposed.dueDate === signed.dueDate
      ? {}
      : { dueDate: { from: signed.dueDate ?? null, to: proposed.dueDate ?? null } }),
    ...(proposed.revisionsIncluded === signed.revisionsIncluded ||
    signed.revisionsIncluded === undefined ||
    proposed.revisionsIncluded === undefined
      ? {}
      : { revisionsIncluded: { from: signed.revisionsIncluded, to: proposed.revisionsIncluded } }),
    totalMinor: { from: scopeTotalMinor(signed), to: scopeTotalMinor(proposed) },
  };
  const nothing =
    addedLines.length +
      addedExclusions.length +
      addedBuyerProvides.length +
      addedStages.length +
      steps.length ===
      0 &&
    change.dueDate === undefined &&
    change.revisionsIncluded === undefined;
  return nothing ? { ok: false, problems: ["nothing"] } : { ok: true, change };
}

const COLUMNS = `id, deal_id AS "dealId", from_version AS "fromVersion", to_version AS "toVersion",
  message, status, reason, proposed_by AS "proposedBy", proposed_seq AS "proposedSeq",
  answered_seq AS "answeredSeq", created_at AS "createdAt", answered_at AS "answeredAt"`;

const changeOrderRow = z.object({
  id: z.string(),
  dealId: z.string(),
  fromVersion: z.number().int(),
  toVersion: z.number().int(),
  message: z.string().nullable(),
  status: z.enum(CHANGE_ORDER_STATUSES),
  reason: z.string().nullable(),
  proposedBy: z.string(),
  proposedSeq: z.number().int(),
  answeredSeq: z.number().int().nullable(),
  createdAt: z.date(),
  answeredAt: z.date().nullable(),
});
export type ChangeOrder = z.output<typeof changeOrderRow>;

const lockedDeal = z.object({
  seller_id: z.string(),
  buyer_id: z.string().nullable(),
  status: z.enum(DEAL_STATUSES),
  currency: z.string(),
});

/**
 * Locks the deal row and checks that `userId` is its `role` and that the deal is signed; returns
 * the deal's currency and its signed version (the newest acceptance's).
 */
async function lockSigned(
  tx: Queryable,
  dealId: string,
  role: "seller" | "buyer",
  userId: string,
): Promise<{ currency: string; signedVersion: number; status: "active" | "completed" }> {
  const rows = await tx.query(
    "SELECT seller_id, buyer_id, status, currency FROM deals WHERE id = $1 FOR UPDATE",
    [dealId],
  );
  const deal = lockedDeal.safeParse(rows[0]);
  if (!deal.success) throw new DealNotFoundError(`No deal ${dealId}`);
  const party = role === "seller" ? deal.data.seller_id : deal.data.buyer_id;
  if (party !== userId) throw new ChangeOrderNotAllowedError("not-your-deal");
  const signedVersion = await signedVersionOf(tx, dealId);
  const { status } = deal.data;
  if (signedVersion === undefined || (status !== "active" && status !== "completed")) {
    throw new ChangeOrderNotAllowedError("not-signed");
  }
  return { currency: deal.data.currency, signedVersion, status };
}

/** The change waiting for the buyer on a deal, if any. */
async function waitingChange(tx: Queryable, dealId: string): Promise<ChangeOrder | undefined> {
  const rows = await tx.query(
    `SELECT ${COLUMNS} FROM change_orders WHERE deal_id = $1 AND status = 'proposed'`,
    [dealId],
  );
  return rows[0] === undefined ? undefined : changeOrderRow.parse(rows[0]);
}

/** The signed and the waiting version of a change, as stored. */
async function versionsOf(tx: Queryable, order: ChangeOrder) {
  const [from, to] = await Promise.all([
    getScopeVersion(tx, order.dealId, order.fromVersion),
    getScopeVersion(tx, order.dealId, order.toVersion),
  ]);
  if (!from || !to) throw new Error(`Change order ${order.id}: a version is missing`);
  return { from, to };
}

export const proposeChangeSchema = z.object({
  id: z.uuid(),
  dealId: z.uuid(),
  sellerId: z.uuid(),
  content: z.unknown(),
  message: z.string().trim().min(1).max(1000).optional(),
});
export type ProposeChange = z.input<typeof proposeChangeSchema>;

/** How much a change adds, as the log records it (counts and fingerprints, the message whole). */
const addedCounts = (change: ScopeChange) => ({
  lines: change.addedLines.length,
  exclusions: change.addedExclusions.length,
  buyerProvides: change.addedBuyerProvides.length,
  stages: change.addedStages.length,
  dueDateChanged: change.dueDate !== undefined,
  revisionsChanged: change.revisionsIncluded !== undefined,
});

/**
 * The seller proposes a change to the signed agreement: with the deal row locked, the new
 * content must only add to the signed version (`changeOf`); it is stored as the next version, a
 * `CHANGE_ORDER_PROPOSED` entry (by the seller) records it, and the change waits for the buyer.
 * One change waits at a time.
 */
export async function proposeChangeOrder(
  db: Database,
  input: ProposeChange,
  now: Date,
): Promise<{
  changeOrder: ChangeOrder;
  scope: ScopeVersion;
  change: ScopeChange;
  entry: LedgerEntry;
}> {
  const request = proposeChangeSchema.parse(input);
  const content = storableScopeContentSchema.parse(request.content);
  return db.transaction(async (tx) => {
    const { currency, signedVersion } = await lockSigned(
      tx,
      request.dealId,
      "seller",
      request.sellerId,
    );
    if (await waitingChange(tx, request.dealId)) {
      throw new ChangeOrderNotAllowedError("already-waiting");
    }
    const signed = await getScopeVersion(tx, request.dealId, signedVersion);
    if (!signed) throw new ChangeOrderNotAllowedError("not-signed");
    const compared = changeOf(signed.content, content);
    if (!compared.ok) throw new ChangeOrderNotAllowedError("not-an-addition", compared.problems);
    const version = await nextScopeVersion(tx, request.dealId);
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: request.dealId,
        type: "CHANGE_ORDER_PROPOSED",
        actor: "seller",
        actorId: request.sellerId,
        payload: {
          changeOrderId: request.id,
          fromVersion: signedVersion,
          version,
          contentSha256: scopeFingerprint(content),
          totalMinor: compared.change.totalMinor.to,
          currency,
          added: addedCounts(compared.change),
          ...(request.message === undefined ? {} : { message: request.message }),
        },
      },
      now,
    );
    const scope = await insertScopeVersion(tx, {
      dealId: request.dealId,
      version,
      content,
      createdBy: request.sellerId,
      ledgerSeq: entry.seq,
      now,
    });
    const rows = await tx.query(
      `INSERT INTO change_orders (id, deal_id, from_version, to_version, message, status,
                                  proposed_by, proposed_seq, created_at)
       VALUES ($1, $2, $3, $4, $5, 'proposed', $6, $7, $8)
       RETURNING ${COLUMNS}`,
      [
        request.id,
        request.dealId,
        signedVersion,
        version,
        request.message ?? null,
        request.sellerId,
        entry.seq,
        now,
      ],
    );
    return { changeOrder: changeOrderRow.parse(rows[0]), scope, change: compared.change, entry };
  });
}

/** Locks the deal for `role` and returns the waiting change named, or refuses. */
async function lockWaiting(
  tx: Queryable,
  step: { dealId: string; changeOrderId: string },
  role: "seller" | "buyer",
  userId: string,
) {
  const deal = await lockSigned(tx, step.dealId, role, userId);
  const order = await waitingChange(tx, step.dealId);
  if (order?.id !== step.changeOrderId) throw new ChangeOrderNotAllowedError("not-waiting");
  return { deal, order };
}

/** Records the answer on the change's row: its status moves once from `proposed`. */
async function answer(
  tx: Queryable,
  order: ChangeOrder,
  status: Exclude<ChangeOrderStatus, "proposed">,
  entry: LedgerEntry,
  now: Date,
  reason?: string,
): Promise<ChangeOrder> {
  const rows = await tx.query(
    `UPDATE change_orders SET status = $2, reason = $3, answered_seq = $4, answered_at = $5
      WHERE id = $1 RETURNING ${COLUMNS}`,
    [order.id, status, reason ?? null, entry.seq, now],
  );
  return changeOrderRow.parse(rows[0]);
}

export const acceptChangeSchema = acceptTermsSchema.extend({ changeOrderId: z.uuid() });
export type AcceptChange = z.input<typeof acceptChangeSchema>;

/**
 * The buyer signs the waiting change, as they signed the agreement: the document they saw is
 * stored whole as an acceptance of the new version, a `CHANGE_ORDER_ACCEPTED` entry records the
 * same (with where they connected from), and the new version becomes the signed one. A completed
 * deal that gains payment stages is active again.
 */
export async function acceptChangeOrder(
  db: Database,
  input: AcceptChange,
  now: Date,
): Promise<{ changeOrder: ChangeOrder; acceptance: Acceptance; entry: LedgerEntry }> {
  const request = acceptChangeSchema.parse(input);
  return db.transaction(async (tx) => {
    const { deal, order } = await lockWaiting(tx, request, "buyer", request.buyerId);
    const { from, to } = await versionsOf(tx, order);
    if (to.version !== request.version || to.contentSha256 !== request.contentSha256) {
      throw new ChangeOrderNotAllowedError("stale");
    }
    const signature: AcceptTerms = request;
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: request.dealId,
        type: "CHANGE_ORDER_ACCEPTED",
        actor: "buyer",
        actorId: request.buyerId,
        payload: {
          changeOrderId: order.id,
          fromVersion: order.fromVersion,
          ...signaturePayload(signature, documentFingerprint(request.document)),
        },
        ...originOf(request),
      },
      now,
    );
    const acceptance = await insertAcceptance(tx, signature, entry, now);
    if (
      deal.status === "completed" &&
      to.content.milestones.length > from.content.milestones.length
    ) {
      await tx.query("UPDATE deals SET status = 'active', updated_at = $2 WHERE id = $1", [
        request.dealId,
        now,
      ]);
    }
    return { changeOrder: await answer(tx, order, "accepted", entry, now), acceptance, entry };
  });
}

const stepSchema = z.object({
  dealId: z.uuid(),
  changeOrderId: z.uuid(),
  ip: z.string().min(1).max(100).optional(),
  userAgent: z.string().optional(),
});

export const declineChangeSchema = stepSchema.extend({
  buyerId: z.uuid(),
  reason: declineReasonSchema.optional(),
});
export type DeclineChange = z.input<typeof declineChangeSchema>;

/**
 * The buyer declines the waiting change, with an optional reason: a `CHANGE_ORDER_DECLINED`
 * entry records it (with where they connected from). The signed agreement stays as it was.
 */
export async function declineChangeOrder(
  db: Database,
  input: DeclineChange,
  now: Date,
): Promise<{ changeOrder: ChangeOrder; entry: LedgerEntry }> {
  const request = declineChangeSchema.parse(input);
  return db.transaction(async (tx) => {
    const { order } = await lockWaiting(tx, request, "buyer", request.buyerId);
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: request.dealId,
        type: "CHANGE_ORDER_DECLINED",
        actor: "buyer",
        actorId: request.buyerId,
        payload: {
          changeOrderId: order.id,
          version: order.toVersion,
          ...(request.reason === undefined ? {} : { reason: request.reason }),
        },
        ...originOf(request),
      },
      now,
    );
    return { changeOrder: await answer(tx, order, "declined", entry, now, request.reason), entry };
  });
}

export const withdrawChangeSchema = stepSchema.extend({ sellerId: z.uuid() });
export type WithdrawChange = z.input<typeof withdrawChangeSchema>;

/** The seller takes back the waiting change: a `CHANGE_ORDER_WITHDRAWN` entry records it. */
export async function withdrawChangeOrder(
  db: Database,
  input: WithdrawChange,
  now: Date,
): Promise<{ changeOrder: ChangeOrder; entry: LedgerEntry }> {
  const request = withdrawChangeSchema.parse(input);
  return db.transaction(async (tx) => {
    const { order } = await lockWaiting(tx, request, "seller", request.sellerId);
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: request.dealId,
        type: "CHANGE_ORDER_WITHDRAWN",
        actor: "seller",
        actorId: request.sellerId,
        payload: { changeOrderId: order.id, version: order.toVersion },
      },
      now,
    );
    return { changeOrder: await answer(tx, order, "withdrawn", entry, now), entry };
  });
}

/** A deal's change orders, oldest first, each with its versions and what it changes. */
export async function listChangeOrders(
  q: Queryable,
  dealId: string,
): Promise<{ order: ChangeOrder; from: ScopeVersion; to: ScopeVersion; change: ScopeChange }[]> {
  const rows = await q.query(
    `SELECT ${COLUMNS} FROM change_orders WHERE deal_id = $1 ORDER BY created_at, to_version`,
    [dealId],
  );
  return Promise.all(
    rows.map(async (row) => {
      const order = changeOrderRow.parse(row);
      const { from, to } = await versionsOf(q, order);
      const compared = changeOf(from.content, to.content);
      if (!compared.ok) throw new Error(`Change order ${order.id} is not an addition`);
      return { order, from, to, change: compared.change };
    }),
  );
}
