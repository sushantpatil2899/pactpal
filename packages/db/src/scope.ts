import { canonicalJson, sha256Hex, type LedgerEntry } from "@pactpal/ledger";
import { productListingSchema } from "@pactpal/products";
import { timelineProblems, timelineSchema } from "@pactpal/timeline";
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

/** Something the buyer must provide for the work, and by when if the agreement says so. */
const buyerProvidesSchema = z.strictObject({
  text: line,
  dueDate: z.iso.date().optional(),
});

/**
 * The product as its listing page described it (8e), as the seller confirmed it: the facts, the
 * photos saved as the deal's files (each with its fingerprint), and the facts' own fingerprint.
 */
export const agreementListingSchema = productListingSchema.extend({
  photos: z
    .array(
      z.strictObject({
        artifactId: z.uuid(),
        sha256: z.string().regex(/^[0-9a-f]{64}$/),
        filename: z.string().min(1).max(200),
      }),
    )
    .max(3),
  snapshotSha256: z.string().regex(/^[0-9a-f]{64}$/),
});
export type AgreementListing = z.output<typeof agreementListingSchema>;

/** The fingerprint of a listing's facts: everything but its saved photos and this fingerprint. */
export function listingSnapshotSha256(
  listing: Omit<AgreementListing, "photos" | "snapshotSha256">,
): string {
  const facts: Record<string, unknown> = { ...listing };
  delete facts.photos;
  delete facts.snapshotSha256;
  return sha256Hex(canonicalJson(facts));
}

/**
 * How a delivered line can be judged (4i-2): something anyone can check, a step in the work, or a
 * matter of taste settled when the buyer approves the named payment stage. `null`: not marked.
 */
/** One delivered line's mark, as stored and as signed documents carry it. */
export const deliverableKindSchema = z
  .discriminatedUnion("kind", [
    z.strictObject({ kind: z.enum(["objective", "process"]) }),
    z.strictObject({
      kind: z.literal("subjective"),
      approvalStage: z.number().int().min(1).max(20),
    }),
  ])
  .nullable();
export type DeliverableKind = z.output<typeof deliverableKindSchema>;

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
  /**
   * What the buyer provides (4i). Optional and never stored empty, so content written before it
   * existed keeps its exact fingerprint.
   */
  buyerProvides: z.array(buyerProvidesSchema).max(20).optional(),
  /**
   * One mark per deliverable, in the same order (4i-2). Optional and never stored when no line is
   * marked, for the same reason. The rules that compare fields are in `checkedScopeContentSchema`.
   */
  deliverableKinds: z.array(deliverableKindSchema).max(50).optional(),
  /**
   * The agreed steps in their agreed order (7f): what the buyer provides, reviews, payments,
   * deliveries and other steps. Optional and never stored when absent, so earlier versions keep
   * their fingerprints; readers use `timelineOf`, which implies one for versions without it.
   */
  timeline: timelineSchema.optional(),
  /**
   * What is being sold, as listed (8e). Optional and never stored when absent, so earlier
   * versions keep their fingerprints; a change order cannot change it.
   */
  listing: agreementListingSchema.optional(),
});
export type ScopeContent = z.output<typeof scopeContentSchema>;
export type ScopeContentInput = z.input<typeof scopeContentSchema>;

/**
 * The content with the rules that compare its fields: one mark per deliverable, and a matter of
 * taste settled by a payment stage the agreement has. Used wherever content is accepted or read.
 */
export const checkedScopeContentSchema = scopeContentSchema.superRefine((content, context) => {
  const kinds = content.deliverableKinds;
  if (kinds !== undefined && kinds.length !== content.deliverables.length) {
    context.addIssue({
      code: "custom",
      path: ["deliverableKinds"],
      message: "one mark per delivered line",
    });
  }
  if (
    content.listing &&
    listingSnapshotSha256(content.listing) !== content.listing.snapshotSha256
  ) {
    context.addIssue({
      code: "custom",
      path: ["listing", "snapshotSha256"],
      message: "the listing does not match its fingerprint",
    });
  }
  for (const problem of timelineProblems(content)) {
    context.addIssue({ code: "custom", path: problem.path, message: problem.message });
  }
  if (kinds === undefined) return;
  kinds.forEach((mark, n) => {
    if (mark?.kind === "subjective" && mark.approvalStage > content.milestones.length) {
      context.addIssue({
        code: "custom",
        path: ["deliverableKinds", n, "approvalStage"],
        message: "no such payment stage",
      });
    }
  });
});

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
  const content = checkedScopeContentSchema.safeParse(stored.content);
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

/**
 * Content as it is stored. An empty "buyer provides" list, and marks when no line is marked, are
 * left out, so the fingerprint matches content written without them.
 */
export const storableScopeContentSchema = checkedScopeContentSchema.transform(
  ({ buyerProvides, deliverableKinds, ...rest }) => ({
    ...rest,
    ...(buyerProvides === undefined || buyerProvides.length === 0 ? {} : { buyerProvides }),
    ...(deliverableKinds === undefined || deliverableKinds.every((mark) => mark === null)
      ? {}
      : { deliverableKinds }),
  }),
);

export const saveScopeSchema = z.object({
  dealId: z.uuid(),
  sellerId: z.uuid(),
  content: storableScopeContentSchema,
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

    const version = await nextScopeVersion(tx, dealId);
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
    const scope = await insertScopeVersion(tx, {
      dealId,
      version,
      content,
      createdBy: sellerId,
      ledgerSeq: entry.seq,
      now,
    });
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
    return { scope, entry, ...(confirmation ? { confirmation } : {}) };
  });
}

/**
 * Stores a version, recorded by the given log entry, and returns it checked. Inside the caller's
 * transaction, after its log entry (a save, or a change order).
 */
export async function insertScopeVersion(
  tx: Queryable,
  row: {
    dealId: string;
    version: number;
    content: ScopeContent;
    createdBy: string;
    ledgerSeq: number;
    now: Date;
  },
): Promise<ScopeVersion> {
  const saved = await tx.query(
    `INSERT INTO scope_versions (deal_id, version, format, content, content_sha256, created_by,
                                 ledger_seq, created_at)
     VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8)
     RETURNING *`,
    [
      row.dealId,
      row.version,
      row.content.format,
      JSON.stringify(row.content),
      scopeFingerprint(row.content),
      row.createdBy,
      row.ledgerSeq,
      row.now,
    ],
  );
  return checkedVersion(saved[0]);
}

/** The next version number of a deal's agreed work. */
export async function nextScopeVersion(tx: Queryable, dealId: string): Promise<number> {
  const last = await tx.query(
    "SELECT COALESCE(MAX(version), 0) AS last FROM scope_versions WHERE deal_id = $1",
    [dealId],
  );
  return lastVersion.parse(last[0]).last + 1;
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
