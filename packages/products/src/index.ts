/**
 * Product listings (8e): a port to read a listing page as structured facts, its Channel3 adapter,
 * and the listing kept in an agreement.
 */
export {
  Channel3Lookup,
  MAX_PHOTO_BYTES,
  type LookupRefusal,
  type ProductLookup,
} from "./channel3.js";
export {
  LISTING_LIMITS,
  PHOTO_HOST,
  channel3ProductSchema,
  productListingSchema,
  toListing,
  type Channel3Product,
  type ProductListing,
} from "./listing.js";
