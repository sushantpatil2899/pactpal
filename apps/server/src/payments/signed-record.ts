import {
  getLatestAcceptance,
  getScopeVersion,
  getUser,
  type Database,
  type Deal,
} from "@pactpal/db";

/** The signed record a deal's invoices are made from, or undefined if it is not signed. */
export async function signedRecord(db: Database, deal: Deal) {
  if (deal.status !== "active" && deal.status !== "completed") return undefined;
  const acceptance = await getLatestAcceptance(db, deal.id);
  if (!acceptance || deal.buyerId === undefined) return undefined;
  const [scope, buyer] = await Promise.all([
    getScopeVersion(db, deal.id, acceptance.version),
    getUser(db, deal.buyerId),
  ]);
  if (!scope || !buyer) return undefined;
  return { acceptance, scope, buyer };
}
