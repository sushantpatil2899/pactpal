import { canonicalJson, sha256Hex, type JsonValue, type LedgerEntry } from "@pactpal/ledger";
import { z } from "zod";
import type { Database, Queryable } from "./database.js";
import { DEAL_STATUSES } from "./deals.js";
import { DealNotFoundError, appendLedgerEvent } from "./ledger-store.js";

/** Most drafts one deal can have, so a loop or a mistake cannot spend tokens without end. */
export const MAX_DRAFTS_PER_DEAL = 10;

/** Why a draft was not started. */
export type DraftRefusal = "not-your-deal" | "not-draft" | "already-running" | "too-many";

export class DraftNotAllowedError extends Error {
  override readonly name = "DraftNotAllowedError";
  constructor(readonly reason: DraftRefusal) {
    super(`The draft was not started: ${reason}`);
  }
}

/** The draft was not running (it already finished, or never existed), so it cannot finish. */
export class DraftStateError extends Error {
  override readonly name = "DraftStateError";
}

/** A stored draft no longer matches its fingerprint. */
export class DraftIntegrityError extends Error {
  override readonly name = "DraftIntegrityError";
}

const draftRow = z
  .object({
    id: z.string(),
    deal_id: z.string(),
    source_artifact_id: z.string(),
    source_sha256: z.string(),
    created_by: z.string(),
    status: z.enum(["running", "ready", "failed"]),
    created_at: z.date(),
    finished_at: z.date().nullable(),
    draft_prompt_version: z.number().int(),
    rank_prompt_version: z.number().int(),
    draft: z.json().nullable(),
    draft_sha256: z.string().nullable(),
    council: z.json().nullable(),
    failure_reason: z.string().nullable(),
    ledger_seq: z.number().int().nullable(),
  })
  .transform((row) => ({
    id: row.id,
    dealId: row.deal_id,
    sourceArtifactId: row.source_artifact_id,
    sourceSha256: row.source_sha256,
    createdBy: row.created_by,
    status: row.status,
    createdAt: row.created_at,
    finishedAt: row.finished_at ?? undefined,
    draftPromptVersion: row.draft_prompt_version,
    rankPromptVersion: row.rank_prompt_version,
    draft: row.draft ?? undefined,
    draftSha256: row.draft_sha256 ?? undefined,
    council: row.council ?? undefined,
    failureReason: row.failure_reason ?? undefined,
    ledgerSeq: row.ledger_seq ?? undefined,
  }));

/**
 * One AI draft of a deal's agreed work. `draft` (the winning draft) and `council` (what each model
 * did, the votes, the agreement) are stored as plain JSON; the server checks their shape with the
 * AI packages' own schemas when it reads them, so this package does not depend on those packages.
 */
export type DraftRecord = z.output<typeof draftRow>;

/** SHA-256 of the draft's canonical JSON, so key order and spacing never change it. */
export function draftFingerprint(draft: JsonValue): string {
  return sha256Hex(canonicalJson(draft));
}

/** A row read back, with a ready draft checked against its fingerprint. */
function checkedDraft(row: unknown): DraftRecord {
  const record = draftRow.parse(row);
  if (record.draft !== undefined && draftFingerprint(record.draft) !== record.draftSha256) {
    throw new DraftIntegrityError(`Draft ${record.id}: content does not match its fingerprint`);
  }
  return record;
}

const lockedDeal = z.object({ seller_id: z.string(), status: z.enum(DEAL_STATUSES) });
const countRow = z.object({ n: z.coerce.number().int() });

export const startDraftSchema = z.object({
  id: z.uuid(),
  dealId: z.uuid(),
  sellerId: z.uuid(),
  sourceArtifactId: z.uuid(),
  sourceSha256: z.string().regex(/^[0-9a-f]{64}$/),
  draftPromptVersion: z.number().int().min(1),
  rankPromptVersion: z.number().int().min(1),
});
export type StartDraft = z.input<typeof startDraftSchema>;

/**
 * Records that a draft is running. The deal row is locked first, so two requests at once cannot
 * both start. Only the seller, only while the deal is a draft, one running draft at a time, and
 * at most `MAX_DRAFTS_PER_DEAL` drafts per deal.
 */
export async function startDraft(db: Database, input: StartDraft, now: Date): Promise<DraftRecord> {
  const draft = startDraftSchema.parse(input);
  return db.transaction(async (tx) => {
    const deals = await tx.query("SELECT seller_id, status FROM deals WHERE id = $1 FOR UPDATE", [
      draft.dealId,
    ]);
    const deal = lockedDeal.safeParse(deals[0]);
    if (!deal.success) throw new DealNotFoundError(`No deal ${draft.dealId}`);
    if (deal.data.seller_id !== draft.sellerId) throw new DraftNotAllowedError("not-your-deal");
    if (deal.data.status !== "draft") throw new DraftNotAllowedError("not-draft");

    const running = await tx.query(
      "SELECT 1 FROM scope_drafts WHERE deal_id = $1 AND status = 'running'",
      [draft.dealId],
    );
    if (running.length > 0) throw new DraftNotAllowedError("already-running");
    const total = await tx.query("SELECT count(*) AS n FROM scope_drafts WHERE deal_id = $1", [
      draft.dealId,
    ]);
    if (countRow.parse(total[0]).n >= MAX_DRAFTS_PER_DEAL) {
      throw new DraftNotAllowedError("too-many");
    }

    const rows = await tx.query(
      `INSERT INTO scope_drafts (id, deal_id, source_artifact_id, source_sha256, created_by, status,
                                 created_at, draft_prompt_version, rank_prompt_version)
       VALUES ($1, $2, $3, $4, $5, 'running', $6, $7, $8)
       RETURNING *`,
      [
        draft.id,
        draft.dealId,
        draft.sourceArtifactId,
        draft.sourceSha256,
        draft.sellerId,
        now,
        draft.draftPromptVersion,
        draft.rankPromptVersion,
      ],
    );
    return checkedDraft(rows[0]);
  });
}

export interface FinishDraft {
  draftId: string;
  /** The winning draft. */
  draft: JsonValue;
  /** What each model did, the votes and the agreement, for the council panel. */
  council: JsonValue;
  /**
   * What the `SCOPE_DRAFTED` entry records besides the draft's id and fingerprint, which are added
   * here. Fingerprints, names and numbers only; never the chat or the draft text.
   */
  ledgerPayload: Record<string, JsonValue>;
}

/**
 * Marks a running draft ready, in one transaction with its `SCOPE_DRAFTED` ledger entry (written
 * by the system; a draft is not an action of the seller). Fails if the draft is not running.
 */
export async function finishDraft(
  db: Database,
  input: FinishDraft,
  now: Date,
): Promise<{ draft: DraftRecord; entry: LedgerEntry }> {
  return db.transaction(async (tx) => {
    const dealId = await lockDealOfRunningDraft(tx, input.draftId);
    const draftSha256 = draftFingerprint(input.draft);
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId,
        type: "SCOPE_DRAFTED",
        actor: "system",
        payload: { ...input.ledgerPayload, draftId: input.draftId, draftSha256 },
      },
      now,
    );
    const rows = await tx.query(
      `UPDATE scope_drafts
          SET status = 'ready', finished_at = $2, draft = $3::jsonb, draft_sha256 = $4,
              council = $5::jsonb, ledger_seq = $6
        WHERE id = $1
        RETURNING *`,
      [
        input.draftId,
        now,
        JSON.stringify(input.draft),
        draftSha256,
        JSON.stringify(input.council),
        entry.seq,
      ],
    );
    return { draft: checkedDraft(rows[0]), entry };
  });
}

/** Locks the deal of a running draft (the same order `startDraft` uses) and returns its id. */
async function lockDealOfRunningDraft(tx: Queryable, draftId: string): Promise<string> {
  const found = await tx.query("SELECT deal_id FROM scope_drafts WHERE id = $1", [draftId]);
  const dealId = z.object({ deal_id: z.string() }).safeParse(found[0]);
  if (!dealId.success) throw new DraftStateError(`No draft ${draftId}`);
  await tx.query("SELECT 1 FROM deals WHERE id = $1 FOR UPDATE", [dealId.data.deal_id]);
  const running = await tx.query(
    "SELECT 1 FROM scope_drafts WHERE id = $1 AND status = 'running' FOR UPDATE",
    [draftId],
  );
  if (running.length === 0) throw new DraftStateError(`Draft ${draftId} is not running`);
  return dealId.data.deal_id;
}

/**
 * Marks a running draft failed, with a reason that never repeats the chat and, when there is one,
 * what the council did. Returns undefined if the draft was not running.
 */
export async function failDraft(
  q: Queryable,
  input: { draftId: string; reason: string; council?: JsonValue },
  now: Date,
): Promise<DraftRecord | undefined> {
  const rows = await q.query(
    `UPDATE scope_drafts
        SET status = 'failed', finished_at = $2, failure_reason = $3, council = $4::jsonb
      WHERE id = $1 AND status = 'running'
      RETURNING *`,
    [
      input.draftId,
      now,
      input.reason,
      input.council === undefined ? null : JSON.stringify(input.council),
    ],
  );
  return rows[0] === undefined ? undefined : checkedDraft(rows[0]);
}

/** Marks every running draft failed. Run when the server starts: no job survives a restart. */
export async function failRunningDrafts(q: Queryable, reason: string, now: Date): Promise<number> {
  const rows = await q.query(
    `UPDATE scope_drafts SET status = 'failed', finished_at = $1, failure_reason = $2
      WHERE status = 'running'
      RETURNING id`,
    [now, reason],
  );
  return rows.length;
}

/** One draft of a deal, a ready one checked against its fingerprint; undefined if there is none. */
export async function getDraft(
  q: Queryable,
  dealId: string,
  draftId: string,
): Promise<DraftRecord | undefined> {
  const rows = await q.query("SELECT * FROM scope_drafts WHERE deal_id = $1 AND id = $2", [
    dealId,
    draftId,
  ]);
  return rows[0] === undefined ? undefined : checkedDraft(rows[0]);
}

/** A deal's drafts, newest first. */
export async function listDrafts(q: Queryable, dealId: string): Promise<DraftRecord[]> {
  const rows = await q.query(
    "SELECT * FROM scope_drafts WHERE deal_id = $1 ORDER BY created_at DESC, id DESC",
    [dealId],
  );
  return rows.map(checkedDraft);
}
