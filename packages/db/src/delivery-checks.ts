import { z } from "zod";
import type { Database, Queryable } from "./database.js";
import { lockDeal } from "./deal-lock.js";
import { sellerStageStep } from "./deliveries.js";

/** At most this many checks per deal, so a page cannot spend the models' free limits. */
export const MAX_CHECKS_PER_DEAL = 20;

/** Why a check could not be kept. */
export type DeliveryCheckRefusal =
  /** Not this deal's seller. */
  | "not-your-deal"
  /** The deal is not signed (checks compare files with the signed agreement). */
  | "not-signed"
  /** The deal already has the most checks allowed. */
  | "too-many"
  /** A file is not one of this deal's delivered files, or its fingerprint differs. */
  | "wrong-files";

export class DeliveryCheckNotAllowedError extends Error {
  override readonly name = "DeliveryCheckNotAllowedError";
  constructor(readonly reason: DeliveryCheckRefusal) {
    super(`The delivery check was refused: ${reason}`);
  }
}

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);
const checkedFileSchema = z.object({
  fileId: z.uuid(),
  filename: z.string().min(1).max(255),
  sha256,
});

const newCheckSchema = z.object({
  ...sellerStageStep,
  stage: sellerStageStep.stage.max(20),
  files: z.array(checkedFileSchema).min(1).max(10),
  /** The code results and the model's look, as the server built them (a draft, not evidence). */
  report: z.record(z.string(), z.unknown()),
});
export type NewDeliveryCheck = z.input<typeof newCheckSchema>;

const checkRow = z.object({
  id: z.string(),
  dealId: z.string(),
  version: z.number().int(),
  stage: z.number().int(),
  files: z.array(checkedFileSchema),
  report: z.record(z.string(), z.unknown()),
  checkedBy: z.string(),
  createdAt: z.date(),
});
export type DeliveryCheck = z.output<typeof checkRow>;

const COLUMNS = `id, deal_id AS "dealId", version, stage, files, report, checked_by AS "checkedBy",
  created_at AS "createdAt"`;

/**
 * Keeps a seller's pre-delivery check, apart from the evidence log (nothing is logged). With the
 * deal row locked: only its seller, only once it is signed, only its own delivered files (by
 * fingerprint), and at most `MAX_CHECKS_PER_DEAL` per deal.
 */
export async function recordDeliveryCheck(
  db: Database,
  input: NewDeliveryCheck,
  now: Date,
): Promise<DeliveryCheck> {
  const check = newCheckSchema.parse(input);
  return db.transaction(async (tx) => {
    const deal = await lockDeal(tx, check.dealId);
    if (deal.seller_id !== check.sellerId) throw new DeliveryCheckNotAllowedError("not-your-deal");
    if (deal.status !== "active" && deal.status !== "completed") {
      throw new DeliveryCheckNotAllowedError("not-signed");
    }
    const count = z.coerce
      .number()
      .parse(
        (
          await tx.query("SELECT count(*) AS n FROM delivery_checks WHERE deal_id = $1", [
            check.dealId,
          ])
        )[0]?.n,
      );
    if (count >= MAX_CHECKS_PER_DEAL) throw new DeliveryCheckNotAllowedError("too-many");
    const matching = await tx.query(
      `SELECT id FROM artifacts WHERE deal_id = $1 AND kind = 'deliverable'
         AND (id, sha256) IN (SELECT * FROM unnest($2::uuid[], $3::text[]))`,
      [check.dealId, check.files.map((f) => f.fileId), check.files.map((f) => f.sha256)],
    );
    if (matching.length !== new Set(check.files.map((f) => f.fileId)).size) {
      throw new DeliveryCheckNotAllowedError("wrong-files");
    }
    const rows = await tx.query(
      `INSERT INTO delivery_checks (id, deal_id, version, stage, files, report, checked_by,
                                    created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING ${COLUMNS}`,
      [
        check.id,
        check.dealId,
        check.version,
        check.stage,
        JSON.stringify(check.files),
        JSON.stringify(check.report),
        check.sellerId,
        now,
      ],
    );
    return checkRow.parse(rows[0]);
  });
}

/** A deal's pre-delivery checks, newest first. Show them to its seller only. */
export async function listDeliveryChecks(q: Queryable, dealId: string): Promise<DeliveryCheck[]> {
  const rows = await q.query(
    `SELECT ${COLUMNS} FROM delivery_checks WHERE deal_id = $1 ORDER BY created_at DESC, id`,
    [dealId],
  );
  return rows.map((row) => checkRow.parse(row));
}
