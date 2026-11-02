import { z } from "zod";
import type { Queryable } from "./database.js";
import { DEAL_STATUSES } from "./deals.js";
import { DealNotFoundError } from "./ledger-store.js";

/** Why a step on a signed deal was refused: not this deal's seller, or not signed (that version). */
export type SignedRefusal = "not-your-deal" | "not-signed";

const lockedDeal = z.object({ seller_id: z.string(), status: z.enum(DEAL_STATUSES) });
const signedVersion = z.object({ version: z.number().int() });

/**
 * Locks the deal row and checks that `sellerId` is its seller, that it is signed, and that
 * `version` is the signed version (the newest acceptance's). Refusals are thrown as the caller's
 * own error, made by `refuse`. Call inside a transaction.
 */
export async function lockSignedDeal(
  tx: Queryable,
  check: { dealId: string; sellerId: string; version: number },
  refuse: (reason: SignedRefusal) => Error,
): Promise<void> {
  const rows = await tx.query("SELECT seller_id, status FROM deals WHERE id = $1 FOR UPDATE", [
    check.dealId,
  ]);
  const deal = lockedDeal.safeParse(rows[0]);
  if (!deal.success) throw new DealNotFoundError(`No deal ${check.dealId}`);
  if (deal.data.seller_id !== check.sellerId) throw refuse("not-your-deal");
  const signed = await tx.query(
    "SELECT version FROM acceptances WHERE deal_id = $1 ORDER BY ledger_seq DESC LIMIT 1",
    [check.dealId],
  );
  const accepted = signedVersion.safeParse(signed[0]);
  const isSigned = deal.data.status === "active" || deal.data.status === "completed";
  if (!isSigned || !accepted.success || accepted.data.version !== check.version) {
    throw refuse("not-signed");
  }
}
