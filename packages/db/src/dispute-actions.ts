import type { LedgerEntry } from "@pactpal/ledger";
import { z } from "zod";
import type { Database, Queryable } from "./database.js";
import { lockDeal } from "./deal-lock.js";
import { appendLedgerEvent } from "./ledger-store.js";

/** Most evidence uploads one dispute can have (refused ones aside), so a mistake cannot loop. */
export const MAX_EVIDENCE_UPLOADS_PER_DISPUTE = 10;

/** PayPal's longest note for an escalation or an evidence upload. */
export const MAX_DISPUTE_NOTE_CHARS = 2000;

/** What the seller sends PayPal for a dispute (5g). */
export const DISPUTE_ACTION_KINDS = ["escalate", "evidence"] as const;
export type DisputeActionKind = (typeof DISPUTE_ACTION_KINDS)[number];

/** Why an action was not started or sent again. */
export type DisputeActionRefusal =
  | "not-your-deal"
  | "not-this-deal"
  | "not-this-packet"
  | "too-many"
  | "already-sending"
  | "not-unknown";

export class DisputeActionNotAllowedError extends Error {
  override readonly name = "DisputeActionNotAllowedError";
  constructor(readonly reason: DisputeActionRefusal) {
    super(`The dispute action was not started: ${reason}`);
  }
}

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);

/** One file of an evidence upload as confirmed: the packet PDF (exhibit null) or an exhibit. */
export const actionFileSchema = z.object({
  exhibit: z.number().int().min(1).nullable(),
  name: z.string().min(1).max(255),
  mediaType: z.string().min(1).max(100),
  bytes: z.number().int().min(1),
  sha256,
});
export type ActionFile = z.output<typeof actionFileSchema>;

const actionRow = z
  .object({
    id: z.string(),
    deal_id: z.string(),
    dispute_id: z.string(),
    seller_id: z.string(),
    kind: z.enum(DISPUTE_ACTION_KINDS),
    status: z.enum(["sending", "sent", "unknown", "refused"]),
    request_id: z.string(),
    packet_id: z.string().nullable(),
    evidence_type: z.string().nullable(),
    note: z.string(),
    note_sha256: z.string(),
    files: z.array(actionFileSchema),
    total_bytes: z.number().int(),
    transport: z.enum(["rest", "mcp"]).nullable(),
    debug_id: z.string().nullable(),
    failure: z.string().nullable(),
    ledger_seq: z.number().int().nullable(),
    created_at: z.date(),
    finished_at: z.date().nullable(),
  })
  .transform((row) => ({
    id: row.id,
    dealId: row.deal_id,
    disputeId: row.dispute_id,
    sellerId: row.seller_id,
    kind: row.kind,
    status: row.status,
    requestId: row.request_id,
    packetId: row.packet_id ?? undefined,
    evidenceType: row.evidence_type ?? undefined,
    note: row.note,
    noteSha256: row.note_sha256,
    files: row.files,
    totalBytes: row.total_bytes,
    transport: row.transport ?? undefined,
    debugId: row.debug_id ?? undefined,
    failure: row.failure ?? undefined,
    ledgerSeq: row.ledger_seq ?? undefined,
    createdAt: row.created_at,
    finishedAt: row.finished_at ?? undefined,
  }));
/** An escalation or evidence upload as recorded. */
export type DisputeActionRecord = z.output<typeof actionRow>;

const common = {
  id: z.uuid(),
  dealId: z.uuid(),
  disputeId: z.string().min(1).max(100),
  sellerId: z.uuid(),
  note: z.string().min(1).max(MAX_DISPUTE_NOTE_CHARS),
  noteSha256: sha256,
};
const newActionSchema = z.discriminatedUnion("kind", [
  z.object({ ...common, kind: z.literal("escalate") }),
  z.object({
    ...common,
    kind: z.literal("evidence"),
    packetId: z.uuid(),
    evidenceType: z.string().regex(/^[A-Z0-9_]{1,255}$/),
    files: z.array(actionFileSchema).min(1).max(100),
  }),
]);
export type NewDisputeAction = z.input<typeof newActionSchema>;

/** The PayPal-Request-Id of an action: fixed, so sending it again cannot make a second one. */
const requestIdOf = (kind: DisputeActionKind, id: string) => `pactpal-${kind}-${id}`;

const countOf = async (tx: Queryable, sql: string, values: unknown[]) =>
  z.coerce
    .number()
    .int()
    .parse((await tx.query(sql, values))[0]?.n);

async function refuseWhileSending(tx: Queryable, disputeId: string) {
  const sending = await countOf(
    tx,
    "SELECT count(*) AS n FROM dispute_actions WHERE dispute_id = $1 AND status = 'sending'",
    [disputeId],
  );
  if (sending > 0) throw new DisputeActionNotAllowedError("already-sending");
}

/**
 * Reserves an escalation or evidence upload the seller confirmed, before anything is sent: with
 * the deal locked, checks the seller, that the dispute (and the packet) are this deal's, that
 * nothing else is being sent for the dispute and the upload limit, then saves it as `sending`
 * with its fixed request id.
 */
export async function startDisputeAction(
  db: Database,
  input: NewDisputeAction,
  now: Date,
): Promise<DisputeActionRecord> {
  const action = newActionSchema.parse(input);
  return db.transaction(async (tx) => {
    const deal = await lockDeal(tx, action.dealId);
    if (deal.seller_id !== action.sellerId) {
      throw new DisputeActionNotAllowedError("not-your-deal");
    }
    const owner = await tx.query("SELECT deal_id FROM disputes WHERE dispute_id = $1", [
      action.disputeId,
    ]);
    if (owner[0]?.deal_id !== action.dealId) {
      throw new DisputeActionNotAllowedError("not-this-deal");
    }
    if (action.kind === "evidence") {
      const packet = await tx.query("SELECT dispute_id FROM evidence_packets WHERE id = $1", [
        action.packetId,
      ]);
      if (packet[0]?.dispute_id !== action.disputeId) {
        throw new DisputeActionNotAllowedError("not-this-packet");
      }
      const uploads = await countOf(
        tx,
        `SELECT count(*) AS n FROM dispute_actions
          WHERE dispute_id = $1 AND kind = 'evidence' AND status <> 'refused'`,
        [action.disputeId],
      );
      if (uploads >= MAX_EVIDENCE_UPLOADS_PER_DISPUTE) {
        throw new DisputeActionNotAllowedError("too-many");
      }
    }
    await refuseWhileSending(tx, action.disputeId);
    const files = action.kind === "evidence" ? action.files : [];
    const rows = await tx.query(
      `INSERT INTO dispute_actions (id, deal_id, dispute_id, seller_id, kind, status, request_id,
                                    packet_id, evidence_type, note, note_sha256, files,
                                    total_bytes, created_at)
       VALUES ($1, $2, $3, $4, $5, 'sending', $6, $7, $8, $9, $10, $11::jsonb, $12, $13)
       RETURNING *`,
      [
        action.id,
        action.dealId,
        action.disputeId,
        action.sellerId,
        action.kind,
        requestIdOf(action.kind, action.id),
        action.kind === "evidence" ? action.packetId : null,
        action.kind === "evidence" ? action.evidenceType : null,
        action.note,
        action.noteSha256,
        JSON.stringify(files),
        files.reduce((sum, file) => sum + file.bytes, 0),
        now,
      ],
    );
    return actionRow.parse(rows[0]);
  });
}

/**
 * Takes an action whose outcome was unknown back to `sending`, for the seller to send it again
 * with the same request id and the same confirmed content.
 */
export async function resendDisputeAction(
  db: Database,
  input: { actionId: string; sellerId: string },
): Promise<DisputeActionRecord> {
  return db.transaction(async (tx) => {
    const found = await getDisputeAction(tx, input.actionId);
    if (!found) throw new DisputeActionNotAllowedError("not-this-deal");
    await lockDeal(tx, found.dealId);
    if (found.sellerId !== input.sellerId) throw new DisputeActionNotAllowedError("not-your-deal");
    const row = await getDisputeAction(tx, input.actionId);
    if (row?.status !== "unknown") throw new DisputeActionNotAllowedError("not-unknown");
    await refuseWhileSending(tx, row.disputeId);
    const rows = await tx.query(
      "UPDATE dispute_actions SET status = 'sending', failure = NULL WHERE id = $1 RETURNING *",
      [row.id],
    );
    return actionRow.parse(rows[0]);
  });
}

/** How a send ended. */
export type ActionOutcome =
  | { status: "sent"; transport: "rest" | "mcp"; debugId?: string | undefined }
  | { status: "unknown" | "refused"; failure: string };

/** The log entry of a sent action: ids and fingerprints, never the note's words. */
function sentEvent(row: DisputeActionRecord, transport: string, debugId: string | undefined) {
  const common = {
    actionId: row.id,
    disputeId: row.disputeId,
    noteSha256: row.noteSha256,
    transport,
    debugId: debugId ?? null,
  };
  if (row.kind === "escalate") return { type: "DISPUTE_ESCALATED" as const, payload: common };
  return {
    type: "EVIDENCE_UPLOADED" as const,
    payload: {
      ...common,
      packetId: row.packetId ?? null,
      evidenceType: row.evidenceType ?? null,
      files: row.files.map((file) => ({
        exhibit: file.exhibit,
        name: file.name,
        bytes: file.bytes,
        sha256: file.sha256,
      })),
      totalBytes: row.totalBytes,
    },
  };
}

/**
 * Settles a send: `sent` writes `DISPUTE_ESCALATED` or `EVIDENCE_UPLOADED` (by the seller) and
 * marks the row in one transaction; `unknown` or `refused` keeps the reason. Only a `sending` row
 * settles; anything else is returned as it is, with no entry.
 */
export async function finishDisputeAction(
  db: Database,
  input: { actionId: string; outcome: ActionOutcome },
  now: Date,
): Promise<{ action: DisputeActionRecord; entry?: LedgerEntry }> {
  return db.transaction(async (tx) => {
    const found = await getDisputeAction(tx, input.actionId);
    if (!found) throw new DisputeActionNotAllowedError("not-this-deal");
    await lockDeal(tx, found.dealId);
    const row = (await getDisputeAction(tx, input.actionId)) ?? found;
    if (row.status !== "sending") return { action: row };
    const { outcome } = input;
    if (outcome.status !== "sent") {
      const rows = await tx.query(
        `UPDATE dispute_actions SET status = $2, failure = $3, finished_at = $4
          WHERE id = $1 RETURNING *`,
        [row.id, outcome.status, outcome.failure.slice(0, 500), now],
      );
      return { action: actionRow.parse(rows[0]) };
    }
    const event = sentEvent(row, outcome.transport, outcome.debugId);
    const entry = await appendLedgerEvent(
      tx,
      { dealId: row.dealId, actor: "seller", actorId: row.sellerId, ...event },
      now,
    );
    const rows = await tx.query(
      `UPDATE dispute_actions SET status = 'sent', transport = $2, debug_id = $3, failure = NULL,
              ledger_seq = $4, finished_at = $5
        WHERE id = $1 RETURNING *`,
      [row.id, outcome.transport, outcome.debugId ?? null, entry.seq, now],
    );
    return { action: actionRow.parse(rows[0]), entry };
  });
}

export async function getDisputeAction(
  q: Queryable,
  id: string,
): Promise<DisputeActionRecord | undefined> {
  if (!z.uuid().safeParse(id).success) return undefined;
  const rows = await q.query("SELECT * FROM dispute_actions WHERE id = $1", [id]);
  return rows[0] === undefined ? undefined : actionRow.parse(rows[0]);
}

/** A dispute's escalations and evidence uploads, newest first. */
export async function listDisputeActions(
  q: Queryable,
  disputeId: string,
): Promise<DisputeActionRecord[]> {
  const rows = await q.query(
    "SELECT * FROM dispute_actions WHERE dispute_id = $1 ORDER BY created_at DESC, id DESC",
    [disputeId],
  );
  return rows.map((row) => actionRow.parse(row));
}
