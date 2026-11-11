import { z } from "zod";

/** Text caps, so a listing stays readable and small in the agreement. */
/** Listing photos are only fetched from Channel3's image server. */
export const PHOTO_HOST = "cdn.trychannel3.com";

/** Whether PactPal may save a listing photo from this address: https on Channel3's image server. */
export const savablePhoto = (url: string): boolean => {
  const parsed = URL.canParse(url) ? new URL(url) : undefined;
  return parsed?.protocol === "https:" && parsed.hostname === PHOTO_HOST;
};

export const LISTING_LIMITS = {
  description: 1500,
  line: 200,
  items: 10,
  attributes: 12,
  values: 5,
  images: 3,
} as const;

const text = (max: number) => z.string().trim().min(1).max(max);
const line = text(LISTING_LIMITS.line);

/**
 * A product as its listing page described it when the seller looked it up (8e): the facts a
 * "not as described" dispute turns on, capped and plain. `source` says where the facts came
 * from; the agreement stores them as they were, with the seller's confirmation.
 */
export const productListingSchema = z.strictObject({
  source: z.literal("channel3"),
  productId: z.string().min(1).max(100),
  url: z.url({ protocol: /^https?$/ }).max(2000),
  domain: z.string().min(1).max(253),
  retrievedAt: z.iso.datetime(),
  title: line,
  brand: line.optional(),
  description: text(LISTING_LIMITS.description).optional(),
  materials: z.array(line).max(LISTING_LIMITS.items),
  keyFeatures: z.array(line).max(LISTING_LIMITS.items),
  attributes: z
    .array(z.strictObject({ name: line, values: z.array(line).min(1).max(LISTING_LIMITS.values) }))
    .max(LISTING_LIMITS.attributes),
  price: z
    .strictObject({
      amount: z.string().regex(/^\d{1,9}\.\d{2}$/),
      currency: z.string().regex(/^[A-Z]{3}$/),
    })
    .optional(),
  weight: line.optional(),
  imageUrls: z.array(z.url({ protocol: /^https$/ }).max(2000)).max(LISTING_LIMITS.images),
});
export type ProductListing = z.output<typeof productListingSchema>;

/**
 * Channel3's product, only the fields PactPal reads (their docs: Product model). Anything else is
 * ignored; a field of the wrong shape fails the whole answer.
 */
export const channel3ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  brands: z.array(z.object({ name: z.string() })).nullish(),
  images: z.array(z.object({ url: z.string(), is_main_image: z.boolean().nullish() })).nullish(),
  materials: z.array(z.string()).nullish(),
  key_features: z.array(z.string()).nullish(),
  structured_attributes: z.record(z.string(), z.array(z.string())).nullish(),
  offers: z
    .array(
      z.object({
        domain: z.string(),
        price: z.object({ price: z.number(), currency: z.string() }).nullish(),
        dimensions: z
          .object({ weight: z.object({ number: z.number(), unit: z.string() }).nullish() })
          .nullish(),
      }),
    )
    .nullish(),
});
export type Channel3Product = z.output<typeof channel3ProductSchema>;

/** A string cut to `max` characters, with an ellipsis when it was longer; undefined when empty. */
function capped(value: string | null | undefined, max: number): string | undefined {
  const trimmed = value?.trim().replace(/\s+/g, " ") ?? "";
  if (trimmed === "") return undefined;
  return trimmed.length > max ? `${trimmed.slice(0, max - 1).trimEnd()}…` : trimmed;
}

const lines = (values: readonly string[] | null | undefined, max: number) =>
  [...new Set((values ?? []).flatMap((v) => capped(v, LISTING_LIMITS.line) ?? []))].slice(0, max);

/** "care-instructions" → "Care instructions". */
const attributeName = (handle: string) => {
  const words = handle.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/**
 * The listing PactPal keeps from Channel3's product for the page at `url`: the offer on that
 * page's own site when there is one (its price and weight), main image first, every text capped.
 * Pure.
 */
export function toListing(
  product: Channel3Product,
  page: { url: string; retrievedAt: Date },
): ProductListing {
  const domain = new URL(page.url).hostname.replace(/^www\./, "");
  const offers = product.offers ?? [];
  const offer =
    offers.find((o) => domain === o.domain || domain.endsWith(`.${o.domain}`)) ?? offers[0];
  const price = offer?.price;
  const weight = offer?.dimensions?.weight;
  const images = [...(product.images ?? [])]
    .sort((a, b) => Number(b.is_main_image === true) - Number(a.is_main_image === true))
    .map((image) => image.url)
    // Only photos PactPal may save; Channel3 sometimes gives the shop's own addresses instead.
    .filter(savablePhoto);
  const brand = capped(product.brands?.[0]?.name, LISTING_LIMITS.line);
  const description = capped(product.description, LISTING_LIMITS.description);
  return productListingSchema.parse({
    source: "channel3",
    productId: product.id,
    url: page.url,
    domain,
    retrievedAt: page.retrievedAt.toISOString(),
    title: capped(product.title, LISTING_LIMITS.line) ?? "Untitled product",
    ...(brand === undefined ? {} : { brand }),
    ...(description === undefined ? {} : { description }),
    materials: lines(product.materials, LISTING_LIMITS.items),
    keyFeatures: lines(product.key_features, LISTING_LIMITS.items),
    attributes: Object.entries(product.structured_attributes ?? {})
      .map(([name, values]) => ({
        name: capped(attributeName(name), LISTING_LIMITS.line) ?? name,
        values: lines(values, LISTING_LIMITS.values),
      }))
      .filter((attribute) => attribute.values.length > 0)
      .slice(0, LISTING_LIMITS.attributes),
    ...(price && price.price > 0 && /^[A-Z]{3}$/.test(price.currency)
      ? { price: { amount: price.price.toFixed(2), currency: price.currency } }
      : {}),
    ...(weight && weight.number > 0 ? { weight: `${String(weight.number)} ${weight.unit}` } : {}),
    imageUrls: [...new Set(images)].slice(0, LISTING_LIMITS.images),
  });
}
