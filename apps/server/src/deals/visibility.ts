import type { Deal, SessionAccess, User } from "@pactpal/db";

/** Who is asking, and what their session allows. */
export interface Viewer {
  user: User;
  access: SessionAccess;
}

/**
 * Whether this person may see this deal: the seller or the buyer when signed in with PayPal; only
 * the link's own deal, as its buyer, for a buyer-link session.
 */
export function canSeeDeal(viewer: Viewer, deal: Deal): boolean {
  const { user, access } = viewer;
  if (access.method === "link") return access.dealId === deal.id && deal.buyerId === user.id;
  return deal.sellerId === user.id || deal.buyerId === user.id;
}

/** The person's role in a deal they may see. */
export const roleIn = (viewer: Viewer, deal: Deal): "seller" | "buyer" =>
  deal.sellerId === viewer.user.id ? "seller" : "buyer";
