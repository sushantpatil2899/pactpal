import { DEAL_CATEGORIES, getUser, type Database, type Deal, type User } from "@pactpal/db";

/** The deal's seller and buyer, loaded once per answer. */
export async function partiesOf(db: Database, deal: Deal) {
  const [seller, buyer] = await Promise.all([
    getUser(db, deal.sellerId),
    deal.buyerId === undefined ? undefined : getUser(db, deal.buyerId),
  ]);
  return { seller, buyer };
}

/** How a person is named to the other side: display name or role, never their email. */
export const nameOf = (user: User | undefined, role: "Seller" | "Buyer") =>
  user?.displayName ?? role;

/** Each category's plain-words label, by id. */
export const categoryLabels = new Map<string, string>(
  Object.entries(DEAL_CATEGORIES).map(([id, { label }]) => [id, label]),
);

/** A deal's category as people read it; an unknown id is shown as it is. */
export const categoryLabelOf = (deal: Deal) => categoryLabels.get(deal.category) ?? deal.category;
