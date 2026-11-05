import type { JsonValue } from "@pactpal/ledger";
import { z } from "zod";
import { councilJobColumns, councilJobFields } from "./council-jobs.js";
import type { Database, Queryable } from "./database.js";
import { lockDeal } from "./deal-lock.js";

/** Most messages one deal can have checked, so a loop or a mistake cannot spend tokens without end. */
export const MAX_REVIEWS_PER_DEAL = 30;

/** Why a review was not started. */
export type ReviewRefusal = "not-your-deal" | "not-signed" | "already-running" | "too-many";

export class ReviewNotAllowedError extends Error {
  override readonly name = "ReviewNotAllowedError";
  constructor(readonly reason: ReviewRefusal) {
    super(`The message review was not started: ${reason}`);
  }
}

const reviewRow = z
  .object({
    id: z.string(),
    deal_id: z.string(),
    version: z.number().int(),
    source_artifact_id: z.string(),
    source_sha256: z.string(),
    review: z.json().nullable(),
    ...councilJobColumns,
  })
  .transform((row) => ({
    id: row.id,
    dealId: row.deal_id,
    version: row.version,
    sourceArtifactId: row.source_artifact_id,
    sourceSha256: row.source_sha256,
    review: row.review ?? undefined,
    ...councilJobFields(row),
  }));

/**
 * One council review of a buyer's message. `review` (the winner) and `council` (what each model
 * did and the votes) are plain JSON; the server checks their shape when it reads them.
 */
export type MessageReviewRecord = z.output<typeof reviewRow>;

const startSchema = z.object({
  id: z.uuid(),
  dealId: z.uuid(),
  sellerId: z.uuid(),
  version: z.number().int().min(1),
  sourceArtifactId: z.uuid(),
  sourceSha256: z.string().regex(/^[0-9a-f]{64}$/),
  promptVersion: z.number().int().min(1),
  rankPromptVersion: z.number().int().min(1),
});
export type StartMessageReview = z.input<typeof startSchema>;

/**
 * Records that a review is running. With the deal row locked: only its seller, only once it is
 * signed, one running review at a time and at most `MAX_REVIEWS_PER_DEAL` per deal. Not logged.
 */
export async function startMessageReview(
  db: Database,
  input: StartMessageReview,
  now: Date,
): Promise<MessageReviewRecord> {
  const start = startSchema.parse(input);
  return db.transaction(async (tx) => {
    const deal = await lockDeal(tx, start.dealId);
    if (deal.seller_id !== start.sellerId) throw new ReviewNotAllowedError("not-your-deal");
    if (deal.status !== "active" && deal.status !== "completed") {
      throw new ReviewNotAllowedError("not-signed");
    }
    const counts = z
      .object({ total: z.coerce.number().int(), running: z.coerce.number().int() })
      .parse(
        (
          await tx.query(
            `SELECT count(*) AS total, count(*) FILTER (WHERE status = 'running') AS running
               FROM message_reviews WHERE deal_id = $1`,
            [start.dealId],
          )
        )[0],
      );
    if (counts.running > 0) throw new ReviewNotAllowedError("already-running");
    if (counts.total >= MAX_REVIEWS_PER_DEAL) throw new ReviewNotAllowedError("too-many");
    const rows = await tx.query(
      `INSERT INTO message_reviews (id, deal_id, version, source_artifact_id, source_sha256, status,
                                    prompt_version, rank_prompt_version, requested_by, created_at)
       VALUES ($1, $2, $3, $4, $5, 'running', $6, $7, $8, $9)
       RETURNING *`,
      [
        start.id,
        start.dealId,
        start.version,
        start.sourceArtifactId,
        start.sourceSha256,
        start.promptVersion,
        start.rankPromptVersion,
        start.sellerId,
        now,
      ],
    );
    return reviewRow.parse(rows[0]);
  });
}

/** Marks a running review ready with the winner and the council record; undefined if not running. */
export async function finishMessageReview(
  q: Queryable,
  input: { reviewId: string; review: JsonValue; council: JsonValue },
  now: Date,
): Promise<MessageReviewRecord | undefined> {
  const rows = await q.query(
    `UPDATE message_reviews SET status = 'ready', finished_at = $2, review = $3::jsonb,
            council = $4::jsonb
      WHERE id = $1 AND status = 'running'
      RETURNING *`,
    [input.reviewId, now, JSON.stringify(input.review), JSON.stringify(input.council)],
  );
  return rows[0] === undefined ? undefined : reviewRow.parse(rows[0]);
}

/**
 * Marks a running review failed, with a reason that never repeats the message and, when there is
 * one, what the council did. Undefined if it was not running.
 */
export async function failMessageReview(
  q: Queryable,
  input: { reviewId: string; reason: string; council?: JsonValue },
  now: Date,
): Promise<MessageReviewRecord | undefined> {
  const rows = await q.query(
    `UPDATE message_reviews SET status = 'failed', finished_at = $2, failure_reason = $3,
            council = $4::jsonb
      WHERE id = $1 AND status = 'running'
      RETURNING *`,
    [
      input.reviewId,
      now,
      input.reason,
      input.council === undefined ? null : JSON.stringify(input.council),
    ],
  );
  return rows[0] === undefined ? undefined : reviewRow.parse(rows[0]);
}

/** Marks every running review failed. Run when the server starts: no job survives a restart. */
export async function failRunningMessageReviews(
  q: Queryable,
  reason: string,
  now: Date,
): Promise<number> {
  const rows = await q.query(
    `UPDATE message_reviews SET status = 'failed', finished_at = $1, failure_reason = $2
      WHERE status = 'running'
      RETURNING id`,
    [now, reason],
  );
  return rows.length;
}

/** A deal's message reviews, newest first. Show them to its seller only. */
export async function listMessageReviews(
  q: Queryable,
  dealId: string,
): Promise<MessageReviewRecord[]> {
  const rows = await q.query(
    "SELECT * FROM message_reviews WHERE deal_id = $1 ORDER BY created_at DESC, id DESC",
    [dealId],
  );
  return rows.map((row) => reviewRow.parse(row));
}
