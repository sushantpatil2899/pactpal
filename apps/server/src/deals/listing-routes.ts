import {
  ArtifactRejectedError,
  addArtifact,
  listingSnapshotSha256,
  postgresContentStore,
} from "@pactpal/db";
import { detectMediaType, isWebp, sha256Hex } from "@pactpal/ledger";
import type { SharedStore } from "../keyvalue.js";
import {
  MAX_PHOTO_BYTES,
  PHOTO_HOST,
  productListingSchema,
  type LookupRefusal,
  type ProductLookup,
} from "@pactpal/products";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { requestOrigin } from "../request-origin.js";
import { readBody, type DealLookup } from "./access.js";
import { toJpeg } from "./photo-convert.js";

export interface ListingRouteOptions {
  sellersDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
  recordIp: boolean;
  /** Reads listing pages; undefined until `CHANNEL3_API_KEY` is set. */
  products: ProductLookup | undefined;
  /** Keeps a page's listing for an hour (9R-2), so looking it up again costs no credit. */
  store: SharedStore;
}

/** How long a looked-up listing is kept for the same page. */
export const LISTING_CACHE_SECONDS = 3600;

/** At most this many photos are kept (each within the lookup's own size limit). */
export const MAX_LISTING_PHOTOS = 3;

const lookupBody = z.object({ url: z.url({ protocol: /^https?$/ }).max(2000) });
const photosBody = z.object({
  imageUrls: z
    .array(
      z
        .url({ protocol: /^https$/ })
        .refine((url) => new URL(url).hostname === PHOTO_HOST)
        .max(2000),
    )
    .min(1)
    .max(MAX_LISTING_PHOTOS),
});

const LOOKUP_REFUSALS: Record<LookupRefusal, { status: number; error: string }> = {
  "not-found": { status: 404, error: "no product was found on that page" },
  unsupported: { status: 422, error: "that page cannot be read as a product listing" },
  unavailable: { status: 502, error: "product lookup did not answer; try again" },
};

/** Whether the bytes are a picture (WebP, as Channel3 serves them, or JPEG, PNG or GIF). */
const isPicture = (bytes: Uint8Array) => {
  const type = detectMediaType(bytes);
  return isWebp(bytes) || (type !== undefined && type !== "application/pdf");
};

class PhotoError extends Error {}

/**
 * "What's being sold" (8e), for the seller of a goods or digital-product deal: read a listing
 * page through Channel3 (shown, not saved), and save its photos as the deal's files once the
 * seller uses it. The listing joins the agreement when the seller saves the agreement.
 */
export const listingRoutes: FastifyPluginAsync<ListingRouteOptions> = (app, options) => {
  const { sellersDeal, clock, newId, recordIp, products, store } = options;

  /** The page's listing: kept from the last hour when there is one, else read through Channel3. */
  async function lookUp(lookup: ProductLookup, url: string) {
    const key = `listing:${sha256Hex(url)}`;
    const kept = productListingSchema.safeParse(await store.getJson(key));
    if (kept.success && kept.data.url === url) return { ok: true as const, listing: kept.data };
    const looked = await lookup.lookup(url);
    if (looked.ok) await store.setJson(key, looked.listing, LISTING_CACHE_SECONDS);
    return looked;
  }

  app.post("/api/deals/:id/listing/lookup", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    if (found.deal.kind === "service") {
      return reply.code(409).send({ error: "listings are for goods and digital products" });
    }
    if (!products) return reply.code(503).send({ error: "product lookup is not set up yet" });
    const body = await readBody(lookupBody, request, reply);
    if (!body) return reply;
    const looked = await lookUp(products, body.url);
    if (!looked.ok) {
      const refusal = LOOKUP_REFUSALS[looked.reason];
      request.log.warn({ dealId: found.deal.id, reason: looked.reason }, "Listing lookup refused");
      return reply.code(refusal.status).send({ error: refusal.error });
    }
    const { listing } = looked;
    request.log.info({ dealId: found.deal.id, domain: listing.domain }, "Listing looked up");
    return reply.send({ listing: { ...listing, snapshotSha256: listingSnapshotSha256(listing) } });
  });

  /** One photo's bytes through the lookup's own fetch: a picture, or an error. */
  /** One photo through the lookup's own fetch, checked as a picture and saved as JPEG (8h). */
  async function photo(lookup: ProductLookup, url: string) {
    const bytes = await lookup.photo(url);
    const jpeg = bytes === undefined || !isPicture(bytes) ? undefined : await toJpeg(bytes);
    if (jpeg === undefined || jpeg.byteLength > MAX_PHOTO_BYTES) throw new PhotoError("not saved");
    return jpeg;
  }

  app.post("/api/deals/:id/listing/photos", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    if (!products) return reply.code(503).send({ error: "product lookup is not set up yet" });
    const body = await readBody(photosBody, request, reply);
    if (!body) return reply;
    const { db, deal, viewer } = found;
    let fetched;
    try {
      fetched = await Promise.all(body.imageUrls.map((url) => photo(products, url)));
    } catch (error) {
      if (!(error instanceof PhotoError)) throw error;
      request.log.warn({ dealId: deal.id, host: PHOTO_HOST }, "Listing photo not saved");
      return reply.code(502).send({ error: "a listing photo could not be saved; try again" });
    }
    try {
      const saved = [];
      for (const [n, bytes] of fetched.entries()) {
        const file = await addArtifact(
          db,
          postgresContentStore(db, clock),
          {
            id: newId(),
            dealId: deal.id,
            kind: "source",
            filename: `listing-photo-${String(n + 1)}.jpg`,
            bytes,
            addedBy: { actor: "seller", actorId: viewer.user.id },
            ...requestOrigin(request, recordIp),
          },
          clock(),
        );
        saved.push({ artifactId: file.id, sha256: file.sha256, filename: file.filename });
      }
      request.log.info({ dealId: deal.id, photos: saved.length }, "Listing photos saved");
      return await reply.code(201).send({ photos: saved });
    } catch (error) {
      if (!(error instanceof ArtifactRejectedError)) throw error;
      return reply.code(413).send({ error: error.message });
    }
  });

  return Promise.resolve();
};
