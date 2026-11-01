/**
 * What PactPal does not support, from docs/scope.md (tier 3 and the always-blocked list). The
 * model may pick one of these ids; code then stops the deal (sub-phase 3d). The list of
 * supported categories belongs to `@pactpal/db` and is passed in by the caller.
 */
export const BLOCKED_CATEGORIES = [
  { id: "deposit-bookings", label: "Deposit bookings (events, catering, photography)" },
  { id: "retainers-subscriptions", label: "Monthly retainers and subscriptions" },
  {
    id: "regulated-services",
    label: "Regulated professional services (legal, medical, financial advice)",
  },
  { id: "gift-cards-stored-value", label: "Gift cards and stored value" },
  { id: "crypto-nfts-investments", label: "Crypto, NFTs and investments" },
  { id: "vehicles-real-estate", label: "Vehicles and real estate" },
  { id: "other-prohibited", label: "Anything else PayPal's Acceptable Use Policy prohibits" },
] as const;

export const UNCLEAR_CATEGORY = "unclear";

const BLOCKED_IDS: readonly string[] = BLOCKED_CATEGORIES.map(({ id }) => id);

/** How the category read from the chat compares with the seller's choice. */
export type CategoryVerdict = "agrees" | "mismatch" | "blocked" | "unclear";

export function categoryVerdict(fromChat: string, chosenBySeller: string): CategoryVerdict {
  if (BLOCKED_IDS.includes(fromChat)) return "blocked";
  if (fromChat === UNCLEAR_CATEGORY) return "unclear";
  return fromChat === chosenBySeller ? "agrees" : "mismatch";
}

/** Every id the model may answer with, given the supported ids. */
export function allowedCategoryIds(supportedIds: readonly string[]): string[] {
  return [...supportedIds, ...BLOCKED_IDS, UNCLEAR_CATEGORY];
}
