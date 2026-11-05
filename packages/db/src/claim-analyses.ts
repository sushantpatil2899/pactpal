import { canonicalJson, sha256Hex, type JsonValue, type LedgerEntry } from "@pactpal/ledger";
import { z } from "zod";
import { councilJobColumns, councilJobFields } from "./council-jobs.js";
import type { Database, Queryable } from "./database.js";
import { lockDeal } from "./deal-lock.js";
import { appendLedgerEvent } from "./ledger-store.js";

/** Most comparisons one dispute can have, so a loop or a mistake cannot spend tokens without end. */
export const MAX_ANALYSES_PER_DISPUTE = 10;

/** An analysis still running after this long is taken as failed ("did not finish"). */
export const ANALYSIS_TIMEOUT_MS = 15 * 60_000;

/** The two dispute council jobs: the claim comparison (5d) and the packet summary (5f). */
export const ANALYSIS_KINDS = ["claim", "summary"] as const;
export type AnalysisKind = (typeof ANALYSIS_KINDS)[number];

/** Why a comparison or summary was not started. */
export type AnalysisRefusal =
  | "not-your-deal"
  | "not-this-deal"
  | "already-running"
  | "too-many"
  /** A summary needs a ready comparison of the same dispute. */
  | "no-comparison";

export class AnalysisNotAllowedError extends Error {
  override readonly name = "AnalysisNotAllowedError";
  constructor(readonly reason: AnalysisRefusal) {
    super(`The claim comparison was not started: ${reason}`);
  }
}

const analysisRow = z
  .object({
    id: z.string(),
    deal_id: z.string(),
    dispute_id: z.string(),
    pasted_artifact_id: z.string().nullable(),
    kind: z.enum(ANALYSIS_KINDS),
    based_on: z.string().nullable(),
    claim_sha256: z.string().nullable(),
    record_sha256: z.string().nullable(),
    analysis: z.json().nullable(),
    ledger_seq: z.number().int().nullable(),
    ...councilJobColumns,
  })
  .transform((row) => ({
    id: row.id,
    dealId: row.deal_id,
    disputeId: row.dispute_id,
    pastedArtifactId: row.pasted_artifact_id ?? undefined,
    kind: row.kind,
    basedOn: row.based_on ?? undefined,
    claimSha256: row.claim_sha256 ?? undefined,
    recordSha256: row.record_sha256 ?? undefined,
    analysis: row.analysis ?? undefined,
    ledgerSeq: row.ledger_seq ?? undefined,
    ...councilJobFields(row),
  }));

/**
 * One council comparison of a dispute claim with the record. `analysis` (the winner, a draft) and
 * `council` (what each model did and the votes) are plain JSON; the server checks their shape
 * when it reads them.
 */
export type ClaimAnalysisRecord = z.output<typeof analysisRow>;

const startSchema = z.object({
  id: z.uuid(),
  dealId: z.uuid(),
  disputeId: z.string().min(1).max(100),
  sellerId: z.uuid(),
  pastedArtifactId: z.uuid().optional(),
  /** "summary" jobs name the ready comparison they are based on. */
  kind: z.enum(ANALYSIS_KINDS).default("claim"),
  basedOn: z.uuid().optional(),
  promptVersion: z.number().int().min(1),
  rankPromptVersion: z.number().int().min(1),
});
export type StartClaimAnalysis = z.input<typeof startSchema>;

/** The reason stored for an analysis that ran longer than `ANALYSIS_TIMEOUT_MS`. */
const TIMED_OUT = "did not finish in time";

/**
 * Marks analyses still running after `ANALYSIS_TIMEOUT_MS` as failed, so a lost run never blocks
 * the next. Returns how many.
 */
export async function failStaleClaimAnalyses(q: Queryable, now: Date): Promise<number> {
  const rows = await q.query(
    `UPDATE claim_analyses SET status = 'failed', finished_at = $1, failure_reason = $2
      WHERE status = 'running' AND created_at < $3
      RETURNING id`,
    [now, TIMED_OUT, new Date(now.getTime() - ANALYSIS_TIMEOUT_MS)],
  );
  return rows.length;
}

/**
 * Records that a comparison is running. With the deal row locked: only the deal's seller, only a
 * dispute tied to this deal, one running per dispute (one running longer than the time limit is
 * failed first) and at most `MAX_ANALYSES_PER_DISPUTE` per dispute. Not logged.
 */
export async function startClaimAnalysis(
  db: Database,
  input: StartClaimAnalysis,
  now: Date,
): Promise<ClaimAnalysisRecord> {
  const start = startSchema.parse(input);
  return db.transaction(async (tx) => {
    const deal = await lockDeal(tx, start.dealId);
    if (deal.seller_id !== start.sellerId) throw new AnalysisNotAllowedError("not-your-deal");
    const owner = await tx.query("SELECT deal_id FROM disputes WHERE dispute_id = $1", [
      start.disputeId,
    ]);
    if (owner[0]?.deal_id !== start.dealId) throw new AnalysisNotAllowedError("not-this-deal");
    await failStaleClaimAnalyses(tx, now);
    if (start.kind === "summary") {
      const base = await tx.query(
        `SELECT 1 FROM claim_analyses
          WHERE id = $1 AND dispute_id = $2 AND kind = 'claim' AND status = 'ready'`,
        [start.basedOn ?? null, start.disputeId],
      );
      if (base.length === 0) throw new AnalysisNotAllowedError("no-comparison");
    }
    const counts = z
      .object({ total: z.coerce.number().int(), running: z.coerce.number().int() })
      .parse(
        (
          await tx.query(
            `SELECT count(*) AS total, count(*) FILTER (WHERE status = 'running') AS running
               FROM claim_analyses WHERE dispute_id = $1 AND kind = $2`,
            [start.disputeId, start.kind],
          )
        )[0],
      );
    if (counts.running > 0) throw new AnalysisNotAllowedError("already-running");
    if (counts.total >= MAX_ANALYSES_PER_DISPUTE) throw new AnalysisNotAllowedError("too-many");
    const rows = await tx.query(
      `INSERT INTO claim_analyses (id, deal_id, dispute_id, pasted_artifact_id, status,
                                   prompt_version, rank_prompt_version, requested_by, created_at,
                                   kind, based_on)
       VALUES ($1, $2, $3, $4, 'running', $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        start.id,
        start.dealId,
        start.disputeId,
        start.pastedArtifactId ?? null,
        start.promptVersion,
        start.rankPromptVersion,
        start.sellerId,
        now,
        start.kind,
        start.basedOn ?? null,
      ],
    );
    return analysisRow.parse(rows[0]);
  });
}

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);
const finishSchema = z.object({
  analysisId: z.uuid(),
  analysis: z.json(),
  council: z.json(),
  /** Fingerprints of what the models read: the claim (or, for a summary, the comparison) and the record. */
  claimSha256: sha256,
  recordSha256: sha256,
  /** For a summary: the fingerprint of the document list the models picked from. */
  exhibitsSha256: sha256.optional(),
  /** What the log says about the run: model names, the winner and how many statements or sentences. */
  models: z.array(z.string().min(1).max(100)).max(10),
  winner: z.string().min(1).max(100),
  statements: z.number().int().min(0),
  needsReview: z.boolean(),
});
export type FinishClaimAnalysis = z.input<typeof finishSchema>;

/**
 * Marks a running job ready and logs it (by the system) in one transaction: `CLAIM_ANALYZED` for a
 * comparison, `SUMMARY_DRAFTED` for a summary (with the comparison it was based on and the
 * document list's fingerprint): ids, fingerprints of the result and of what the models read,
 * prompt versions, models, the winner, the count and whether it needs review. No AI text goes in
 * the log. Undefined (and nothing logged) if it was not running.
 */
export async function finishClaimAnalysis(
  db: Database,
  input: FinishClaimAnalysis,
  now: Date,
): Promise<{ analysis: ClaimAnalysisRecord; entry: LedgerEntry } | undefined> {
  const done = finishSchema.parse(input);
  return db.transaction(async (tx) => {
    const current = await tx.query(
      "SELECT * FROM claim_analyses WHERE id = $1 AND status = 'running' FOR UPDATE",
      [done.analysisId],
    );
    if (current[0] === undefined) return undefined;
    const row = analysisRow.parse(current[0]);
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: row.dealId,
        type: row.kind === "summary" ? "SUMMARY_DRAFTED" : "CLAIM_ANALYZED",
        actor: "system",
        payload: {
          analysisId: row.id,
          disputeId: row.disputeId,
          analysisSha256: sha256Hex(canonicalJson(done.analysis)),
          ...(row.kind === "summary"
            ? {
                basedOn: row.basedOn ?? null,
                comparisonSha256: done.claimSha256,
                exhibitsSha256: done.exhibitsSha256 ?? null,
                sentences: done.statements,
              }
            : { claimSha256: done.claimSha256, statements: done.statements }),
          recordSha256: done.recordSha256,
          promptVersion: row.promptVersion,
          rankPromptVersion: row.rankPromptVersion,
          models: done.models,
          winner: done.winner,
          needsReview: done.needsReview,
        },
      },
      now,
    );
    const rows = await tx.query(
      `UPDATE claim_analyses SET status = 'ready', finished_at = $2, analysis = $3::jsonb,
              council = $4::jsonb, claim_sha256 = $5, record_sha256 = $6, ledger_seq = $7
        WHERE id = $1
        RETURNING *`,
      [
        row.id,
        now,
        JSON.stringify(done.analysis),
        JSON.stringify(done.council),
        done.claimSha256,
        done.recordSha256,
        entry.seq,
      ],
    );
    return { analysis: analysisRow.parse(rows[0]), entry };
  });
}

/**
 * Marks a running analysis failed, with a reason that never repeats the claim and, when there is
 * one, what the council did. Undefined if it was not running.
 */
export async function failClaimAnalysis(
  q: Queryable,
  input: { analysisId: string; reason: string; council?: JsonValue },
  now: Date,
): Promise<ClaimAnalysisRecord | undefined> {
  const rows = await q.query(
    `UPDATE claim_analyses SET status = 'failed', finished_at = $2, failure_reason = $3,
            council = $4::jsonb
      WHERE id = $1 AND status = 'running'
      RETURNING *`,
    [
      input.analysisId,
      now,
      input.reason,
      input.council === undefined ? null : JSON.stringify(input.council),
    ],
  );
  return rows[0] === undefined ? undefined : analysisRow.parse(rows[0]);
}

/** One analysis, or undefined. */
export async function getClaimAnalysis(
  q: Queryable,
  id: string,
): Promise<ClaimAnalysisRecord | undefined> {
  const rows = await q.query("SELECT * FROM claim_analyses WHERE id = $1", [id]);
  return rows[0] === undefined ? undefined : analysisRow.parse(rows[0]);
}

/** A dispute's comparisons (or, with `kind`, its summaries), newest first. Seller only. */
export async function listClaimAnalyses(
  q: Queryable,
  disputeId: string,
  kind: AnalysisKind = "claim",
): Promise<ClaimAnalysisRecord[]> {
  const rows = await q.query(
    `SELECT * FROM claim_analyses WHERE dispute_id = $1 AND kind = $2
      ORDER BY created_at DESC, id DESC`,
    [disputeId, kind],
  );
  return rows.map((row) => analysisRow.parse(row));
}
