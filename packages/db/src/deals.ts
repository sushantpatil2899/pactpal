import type { LedgerEntry } from "@pactpal/ledger";
import { z } from "zod";
import type { Database } from "./database.js";
import { appendLedgerEvent } from "./ledger-store.js";

/**
 * How the work reaches the buyer, which decides how delivery is proven: a tracked link for
 * `service` and `digital`, shipment tracking for `physical`. Also maps to PayPal's SERVICE or
 * PRODUCT dispute type.
 */
export const DEAL_KINDS = ["service", "digital", "physical"] as const;

/** Convenience copy of the deal's stage for dashboards; the ledger is the truth. */
export const DEAL_STATUSES = [
  "draft",
  "awaiting_acceptance",
  "active",
  "completed",
  "cancelled",
] as const;

export const newDealSchema = z.object({
  id: z.uuid(),
  sellerId: z.uuid(),
  /** Unknown while the deal is only a draft from a pasted chat. */
  buyerId: z.uuid().optional(),
  title: z.string().trim().min(1),
  kind: z.enum(DEAL_KINDS),
  /** The seller's chosen category (scope.md). Checked in code, because the list will change. */
  category: z.string().trim().min(1),
  /** One currency per deal, so every milestone invoice agrees (ISO 4217, capitals). */
  currency: z.string().regex(/^[A-Z]{3}$/),
});
export type NewDeal = z.infer<typeof newDealSchema>;

const dealRow = z
  .object({
    id: z.string(),
    seller_id: z.string(),
    buyer_id: z.string().nullable(),
    title: z.string(),
    kind: z.enum(DEAL_KINDS),
    category: z.string(),
    currency: z.string(),
    status: z.enum(DEAL_STATUSES),
    created_at: z.date(),
    updated_at: z.date(),
  })
  .transform((row) => ({
    id: row.id,
    sellerId: row.seller_id,
    buyerId: row.buyer_id ?? undefined,
    title: row.title,
    kind: row.kind,
    category: row.category,
    currency: row.currency,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
export type Deal = z.output<typeof dealRow>;

/**
 * Creates a draft deal and writes its `DEAL_CREATED` ledger entry in one transaction, so a deal
 * never exists without its first entry. Ids and the clock come from the caller.
 */
export async function createDeal(
  db: Database,
  input: NewDeal,
  now: Date,
): Promise<{ deal: Deal; entry: LedgerEntry }> {
  const deal = newDealSchema.parse(input);
  return db.transaction(async (tx) => {
    const rows = await tx.query(
      `INSERT INTO deals (id, seller_id, buyer_id, title, kind, category, currency, status,
                          created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'draft', $8, $8)
       RETURNING *`,
      [
        deal.id,
        deal.sellerId,
        deal.buyerId ?? null,
        deal.title,
        deal.kind,
        deal.category,
        deal.currency,
        now,
      ],
    );
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: deal.id,
        type: "DEAL_CREATED",
        actor: "seller",
        actorId: deal.sellerId,
        payload: {
          title: deal.title,
          kind: deal.kind,
          category: deal.category,
          currency: deal.currency,
          buyerId: deal.buyerId ?? null,
        },
      },
      now,
    );
    return { deal: dealRow.parse(rows[0]), entry };
  });
}
