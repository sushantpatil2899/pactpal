import { canonicalJson, sha256Hex, type LedgerEntry } from "@pactpal/ledger";
import { z } from "zod";
import type { Database, Queryable } from "./database.js";
import { DEAL_STATUSES } from "./deals.js";
import { DealNotFoundError, appendLedgerEvent } from "./ledger-store.js";

/** The largest amount one payment stage may have, in minor units (999,999.99 in a 2-decimal currency). */
export const MAX_MILESTONE_MINOR = 99_999_999;

const line = z.string().trim().min(1).max(500);

/** One payment stage (a milestone): what it pays for and how much, in the deal's currency. */
const milestoneSchema = z.strictObject({
  title: z.string().trim().min(1).max(200),
  amountMinor: z.number().int().positive().max(MAX_MILESTONE_MINOR),
  dueDate: z.iso.date().optional(),
});

/**
 * What a deal covers, format 1: written by the seller. A later format (AI drafts with quotes from
 * the source chat, Phase 3) gets its own number so stored versions keep their meaning.
 */
export const scopeContentSchema = z.strictObject({
  format: z.literal(1),
  summary: z.string().trim().min(1).max(2000),
  deliverables: z.array(line).min(1).max(50),
  /** What the price does not include. */
  exclusions: z.array(line).max(50),
  revisionsIncluded: z.number().int().min(0).max(20).optional(),
  dueDate: z.iso.date().optional(),
  milestones: z.array(milestoneSchema).min(1).max(20),
});
export type ScopeContent = z.output<typeof scopeContentSchema>;
export type ScopeContentInput = z.input<typeof scopeContentSchema>;

/** Why a version was not saved. */
export type ScopeRefusal = "not-your-deal" | "not-draft" | "bad-draft";

export class ScopeNotAllowedError extends Error {
  override readonly name = "ScopeNotAllowedError";
  constructor(readonly reason: ScopeRefusal) {
    super(`The agreed work was not saved: ${reason}`);
  }
}

/** A stored version no longer matches its fingerprint. */
export class ScopeIntegrityError extends Error {
  override readonly name = "ScopeIntegrityError";
}

const scopeRow = z
  .object({
    deal_id: z.string(),
    version: z.number().int(),
    content: z.json(),
    content_sha256: z.string(),
    created_by: z.string(),
    ledger_seq: z.number().int(),
    created_at: z.date(),
  })
  .transform((row) => ({
    dealId: row.deal_id,
    version: row.version,
    content: row.content,
    contentSha256: row.content_sha256,
    createdBy: row.created_by,
    ledgerSeq: row.ledger_seq,
    createdAt: row.created_at,
  }));

export interface ScopeVersion {
  dealId: string;
  version: number;
  content: ScopeContent;
  contentSha256: string;
  createdBy: string;
  ledgerSeq: number;
  createdAt: Date;
}

/** SHA-256 of the content's canonical JSON, so key order and spacing never change it. */
export function scopeFingerprint(content: ScopeContent): string {
  return sha256Hex(canonicalJson(content));
}

/** The price: the sum of the payment stages, in minor units. */
export function scopeTotalMinor(content: ScopeContent): number {
  return content.milestones.reduce((total, stage) => total + stage.amountMinor, 0);
}

/** Checks a stored row's content against its fingerprint before it is trusted. */
function checkedVersion(row: unknown): ScopeVersion {
  const stored = scopeRow.parse(row);
  const content = scopeContentSchema.safeParse(stored.content);
  if (!content.success || scopeFingerprint(content.data) !== stored.contentSha256) {
    throw new ScopeIntegrityError(
      `Deal ${stored.dealId} version ${String(stored.version)}: content does not match its fingerprint`,
    );
  }
  return { ...stored, content: content.data };
}

const lockedDeal = z.object({
  seller_id: z.string(),
  status: z.enum(DEAL_STATUSES),
  currency: z.string(),
});
const lastVersion = z.object({ last: z.coerce.number().int() });

/**
 * Says the version was made from an AI draft: which draft (by id and fingerprint) and, field by
 * field, whether the seller kept it, changed it, added it or removed it. Only these words and
 * fingerprints go into the log, never the text. `usedCandidate` is given when the council could
 * not rank its drafts and the seller chose one: its letter and its fingerprint.
 */
export const confirmedFromSchema = z.object({
  draftId: z.uuid(),
  draftSha256: z.string().regex(/^[0-9a-f]{64}$/),
  usedCandidate: z
    .object({ label: z.string().min(1).max(8), sha256: z.string().regex(/^[0-9a-f]{64}$/) })
    .optional(),
  fields: z.record(z.string(), z.string()),
});

export const saveScopeSchema = z.object({
  dealId: z.uuid(),
  sellerId: z.uuid(),
  content: scopeContentSchema,
  confirmedFrom: confirmedFromSchema.optional(),
});
export type SaveScope = z.input<typeof saveScopeSchema>;

/**
 * Saves the seller's agreed work as the deal's next version, in one transaction with its
 * `SCOPE_VERSIONED` log entry. The deal row is locked first, so two saves at once get different
 * numbers. Only the seller, and only while the deal is a draft. The log holds the fingerprint,
 * total and number of stages; the full text stays in the table. When `confirmedFrom` names an AI
 * draft, a `SCOPE_CONFIRMED` entry follows in the same transaction; the draft must be a ready
 * draft of this deal with that fingerprint, or nothing is saved.
 */
export async function saveScopeVersion(
  db: Database,
  input: SaveScope,
  now: Date,
): Promise<{ scope: ScopeVersion; entry: LedgerEntry; confirmation?: LedgerEntry }> {
  const { dealId, sellerId, content, confirmedFrom } = saveScopeSchema.parse(input);
  return db.transaction(async (tx) => {
    const rows = await tx.query(
      "SELECT seller_id, status, currency FROM deals WHERE id = $1 FOR UPDATE",
      [dealId],
    );
    const deal = lockedDeal.safeParse(rows[0]);
    if (!deal.success) throw new DealNotFoundError(`No deal ${dealId}`);
    if (deal.data.seller_id !== sellerId) throw new ScopeNotAllowedError("not-your-deal");
    if (deal.data.status !== "draft") throw new ScopeNotAllowedError("not-draft");

    if (confirmedFrom) {
      const drafts = await tx.query(
        `SELECT 1 FROM scope_drafts
          WHERE id = $1 AND deal_id = $2 AND status = 'ready' AND draft_sha256 = $3`,
        [confirmedFrom.draftId, dealId, confirmedFrom.draftSha256],
      );
      if (drafts.length === 0) throw new ScopeNotAllowedError("bad-draft");
    }

    const last = await tx.query(
      "SELECT COALESCE(MAX(version), 0) AS last FROM scope_versions WHERE deal_id = $1",
      [dealId],
    );
    const version = lastVersion.parse(last[0]).last + 1;
    const contentSha256 = scopeFingerprint(content);
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId,
        type: "SCOPE_VERSIONED",
        actor: "seller",
        actorId: sellerId,
        payload: {
          version,
          format: content.format,
          contentSha256,
          totalMinor: scopeTotalMinor(content),
          currency: deal.data.currency,
          milestoneCount: content.milestones.length,
        },
      },
      now,
    );
    const saved = await tx.query(
      `INSERT INTO scope_versions (deal_id, version, format, content, content_sha256, created_by,
                                   ledger_seq, created_at)
       VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8)
       RETURNING *`,
      [
        dealId,
        version,
        content.format,
        JSON.stringify(content),
        contentSha256,
        sellerId,
        entry.seq,
        now,
      ],
    );
    const confirmation =
      confirmedFrom === undefined
        ? undefined
        : await appendLedgerEvent(
            tx,
            {
              dealId,
              type: "SCOPE_CONFIRMED",
              actor: "seller",
              actorId: sellerId,
              payload: {
                version,
                contentSha256,
                draftId: confirmedFrom.draftId,
                draftSha256: confirmedFrom.draftSha256,
                ...(confirmedFrom.usedCandidate === undefined
                  ? {}
                  : { usedCandidate: confirmedFrom.usedCandidate }),
                fields: confirmedFrom.fields,
              },
            },
            now,
          );
    return { scope: checkedVersion(saved[0]), entry, ...(confirmation ? { confirmation } : {}) };
  });
}

/** The deal's newest version, checked against its fingerprint; undefined before the first save. */
export async function getLatestScope(
  q: Queryable,
  dealId: string,
): Promise<ScopeVersion | undefined> {
  const rows = await q.query(
    "SELECT * FROM scope_versions WHERE deal_id = $1 ORDER BY version DESC LIMIT 1",
    [dealId],
  );
  return rows[0] === undefined ? undefined : checkedVersion(rows[0]);
}

/** One version of a deal, checked against its fingerprint; undefined if there is no such version. */
export async function getScopeVersion(
  q: Queryable,
  dealId: string,
  version: number,
): Promise<ScopeVersion | undefined> {
  const rows = await q.query("SELECT * FROM scope_versions WHERE deal_id = $1 AND version = $2", [
    dealId,
    version,
  ]);
  return rows[0] === undefined ? undefined : checkedVersion(rows[0]);
}
