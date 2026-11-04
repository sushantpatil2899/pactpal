import { z } from "zod";
import type { Queryable } from "./database.js";
import { DEAL_STATUSES } from "./deals.js";
import { DealNotFoundError } from "./ledger-store.js";

/** Why a step on a signed deal was refused: not this deal's seller, or not signed (that version). */
export type SignedRefusal = "not-your-deal" | "not-signed";

const lockedDeal = z.object({ seller_id: z.string(), status: z.enum(DEAL_STATUSES) });
const signedVersion = z.object({ version: z.number().int() });

/** The deal's signed version (the newest acceptance's), or undefined if it was never signed. */
export async function signedVersionOf(q: Queryable, dealId: string): Promise<number | undefined> {
  const rows = await q.query(
    "SELECT version FROM acceptances WHERE deal_id = $1 ORDER BY ledger_seq DESC LIMIT 1",
    [dealId],
  );
  const signed = signedVersion.safeParse(rows[0]);
  return signed.success ? signed.data.version : undefined;
}

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
  const accepted = await signedVersionOf(tx, check.dealId);
  const isSigned = deal.data.status === "active" || deal.data.status === "completed";
  if (!isSigned || accepted !== check.version) {
    throw refuse("not-signed");
  }
}
