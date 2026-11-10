import { dayWords } from "./changes.js";

/** A product as listed (8e), as far as its words go. */
export interface ListingFacts {
  title: string;
  brand?: string | undefined;
  domain: string;
  retrievedAt: string;
  description?: string | undefined;
  materials: readonly string[];
  keyFeatures: readonly string[];
  attributes: readonly { name: string; values: readonly string[] }[];
  price?: { amount: string; currency: string } | undefined;
  weight?: string | undefined;
}

/** Where and when the listing was read: "allbirds.com, 10 Nov 2026". */
export const listingSource = (listing: ListingFacts) =>
  `${listing.domain}, ${dayWords(listing.retrievedAt.slice(0, 10))}`;

/**
 * The listing in plain lines, the same on the signed page, the receipt and the lines the AI
 * reads for buyers' questions and dispute comparisons. Pure.
 */
export function listingLines(listing: ListingFacts): string[] {
  return [
    `Listed product: ${listing.title}${listing.brand === undefined ? "" : ` (${listing.brand})`}, as listed on ${listingSource(listing)}`,
    ...(listing.description === undefined ? [] : [`Listed description: ${listing.description}`]),
    ...(listing.materials.length === 0
      ? []
      : [`Listed materials: ${listing.materials.join(", ")}`]),
    ...listing.keyFeatures.map((feature) => `Listed feature: ${feature}`),
    ...listing.attributes.map(
      (attribute) => `Listed ${attribute.name.toLowerCase()}: ${attribute.values.join(", ")}`,
    ),
    ...(listing.weight === undefined ? [] : [`Listed weight: ${listing.weight}`]),
    ...(listing.price === undefined
      ? []
      : [`Listed price: ${listing.price.amount} ${listing.price.currency}`]),
  ];
}
