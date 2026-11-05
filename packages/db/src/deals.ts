import { sha256Hex, type LedgerEntry } from "@pactpal/ledger";
import { z } from "zod";
import type { Database, Queryable } from "./database.js";
import { DealNotFoundError, appendLedgerEvent } from "./ledger-store.js";
import { createUser, findUserByEmail, type User } from "./users.js";

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

/**
 * The categories a seller can choose (docs/scope.md, tiers 1 and 2), and the kind each implies.
 * Blocked categories are simply not listed. Kept as data so the list is easy to change.
 */
export const DEAL_CATEGORIES = {
  "art-and-design": { label: "Art and design commission", kind: "service" },
  "writing-and-translation": { label: "Writing and translation", kind: "service" },
  "web-and-software": { label: "Web and software project", kind: "service" },
  "video-and-photo": { label: "Video and photo editing", kind: "service" },
  "consulting-and-coaching": { label: "Consulting and coaching", kind: "service" },
  "digital-products": { label: "Digital product (templates, presets, courses)", kind: "digital" },
  "handmade-goods": { label: "Handmade or custom-made item", kind: "physical" },
} as const satisfies Record<string, { label: string; kind: (typeof DEAL_KINDS)[number] }>;
export type DealCategory = keyof typeof DEAL_CATEGORIES;
export const CATEGORY_IDS = Object.keys(DEAL_CATEGORIES) as [DealCategory, ...DealCategory[]];

/** Currencies a deal can use (ISO 4217). PayPal supports more; the list can grow. */
export const DEAL_CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD"] as const;

export const newDealSchema = z.object({
  id: z.uuid(),
  sellerId: z.uuid(),
  /** Unknown while the deal is only a draft from a pasted chat. */
  buyerId: z.uuid().optional(),
  title: z.string().trim().min(1).max(200),
  /** The seller's chosen category; the deal's kind follows from it (see `DEAL_CATEGORIES`). */
  category: z.enum(CATEGORY_IDS),
  /** One currency per deal, so every milestone invoice agrees. */
  currency: z.enum(DEAL_CURRENCIES),
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
  /** How the deal came in when not from the deal page: an intake key (4p), named by its last 4 characters. */
  via?: { via: "intake"; keyEnding: string },
): Promise<{ deal: Deal; entry: LedgerEntry }> {
  const deal = newDealSchema.parse(input);
  const { kind } = DEAL_CATEGORIES[deal.category];
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
        kind,
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
          kind,
          category: deal.category,
          currency: deal.currency,
          buyerId: deal.buyerId ?? null,
          ...via,
        },
      },
      now,
    );
    return { deal: dealRow.parse(rows[0]), entry };
  });
}

/** One deal, or undefined. Callers check who may see it. */
export async function getDeal(q: Queryable, id: string): Promise<Deal | undefined> {
  const rows = await q.query("SELECT * FROM deals WHERE id = $1", [id]);
  return rows[0] === undefined ? undefined : dealRow.parse(rows[0]);
}

/** The deals a person sells or buys in, newest first. */
export async function listDealsForUser(q: Queryable, userId: string): Promise<Deal[]> {
  const rows = await q.query(
    "SELECT * FROM deals WHERE seller_id = $1 OR buyer_id = $1 ORDER BY created_at DESC, id",
    [userId],
  );
  return rows.map((row) => dealRow.parse(row));
}

/** Why a buyer could not be added. */
export type BuyerRefusal = "not-your-deal" | "already-has-buyer" | "own-email";

export class BuyerNotAllowedError extends Error {
  override readonly name = "BuyerNotAllowedError";
  constructor(readonly reason: BuyerRefusal) {
    super(`The buyer was not added: ${reason}`);
  }
}

export const addBuyerSchema = z.object({
  dealId: z.uuid(),
  sellerId: z.uuid(),
  email: z.email().max(320),
  /** How the seller knows them; optional. */
  name: z.string().trim().min(1).max(200).optional(),
});
export type AddBuyer = z.infer<typeof addBuyerSchema>;

const dealParties = z.object({ seller_id: z.string(), buyer_id: z.string().nullable() });

/**
 * Sets a deal's buyer by email, in one transaction with its `BUYER_ADDED` log entry. An existing
 * user with that email (ignoring case) is reused; otherwise a user is created with the email
 * unproven. The log holds the buyer's id and a SHA-256 of the lower-cased email, never the email
 * itself. One buyer per deal for now.
 */
export async function addBuyer(
  db: Database,
  input: AddBuyer,
  now: Date,
  newId: () => string,
): Promise<{ deal: Deal; buyer: User; entry: LedgerEntry }> {
  const request = addBuyerSchema.parse(input);
  return db.transaction(async (tx) => {
    const rows = await tx.query("SELECT seller_id, buyer_id FROM deals WHERE id = $1 FOR UPDATE", [
      request.dealId,
    ]);
    const parties = dealParties.safeParse(rows[0]);
    if (!parties.success) throw new DealNotFoundError(`No deal ${request.dealId}`);
    if (parties.data.seller_id !== request.sellerId) {
      throw new BuyerNotAllowedError("not-your-deal");
    }
    if (parties.data.buyer_id !== null) throw new BuyerNotAllowedError("already-has-buyer");

    const existing = await findUserByEmail(tx, request.email);
    if (existing?.id === request.sellerId) throw new BuyerNotAllowedError("own-email");
    const buyer =
      existing ??
      (await createUser(tx, { id: newId(), email: request.email, displayName: request.name }, now));
    const updated = await tx.query(
      "UPDATE deals SET buyer_id = $2, updated_at = $3 WHERE id = $1 RETURNING *",
      [request.dealId, buyer.id, now],
    );
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: request.dealId,
        type: "BUYER_ADDED",
        actor: "seller",
        actorId: request.sellerId,
        payload: { buyerId: buyer.id, emailSha256: sha256Hex(request.email.toLowerCase()) },
      },
      now,
    );
    return { deal: dealRow.parse(updated[0]), buyer, entry };
  });
}
