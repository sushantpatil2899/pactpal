import { z } from "zod";
import type { Queryable } from "./database.js";
import { DEAL_STATUSES } from "./deals.js";
import { DealNotFoundError } from "./ledger-store.js";

const lockedDeal = z.object({
  seller_id: z.string(),
  buyer_id: z.string().nullable(),
  status: z.enum(DEAL_STATUSES),
});

/** Locks the deal row and returns its parties and status. Call inside a transaction. */
export async function lockDeal(tx: Queryable, dealId: string) {
  const rows = await tx.query(
    "SELECT seller_id, buyer_id, status FROM deals WHERE id = $1 FOR UPDATE",
    [dealId],
  );
  const deal = lockedDeal.safeParse(rows[0]);
  if (!deal.success) throw new DealNotFoundError(`No deal ${dealId}`);
  return deal.data;
}
