import { DEFAULT_RETRY_POLICY, sendWithRetry, type HttpDeps, type Secret } from "@pactpal/net";
import { z } from "zod";
import { channel3ProductSchema, savablePhoto, toListing, type ProductListing } from "./listing.js";

/** Why a listing could not be read. */
export type LookupRefusal = "not-found" | "unsupported" | "unavailable";

/** The largest listing photo kept. */
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

/** Reads a product listing page as structured facts, and its photos (8e). The port callers use. */
export interface ProductLookup {
  lookup(
    url: string,
  ): Promise<{ ok: true; listing: ProductListing } | { ok: false; reason: LookupRefusal }>;
  /** A listing photo's bytes, only from `PHOTO_HOST` and within `MAX_PHOTO_BYTES`; else undefined. */
  photo(url: string): Promise<Uint8Array | undefined>;
}

const CHANNEL3_API = "https://api.trychannel3.com";

class NoAnswerError extends Error {}

/**
 * Channel3's URL lookup (`POST /v1/lookup`, 1 credit): any product page, fetched live when it is
 * not in their catalog. A read, so retried on network failures and 5xx; the answer is checked
 * against the fields PactPal uses before anything is kept. The key is only ever sent to Channel3.
 */
export class Channel3Lookup implements ProductLookup {
  constructor(
    private readonly key: Secret,
    private readonly deps: HttpDeps,
    private readonly now: () => Date,
  ) {}

  async lookup(
    url: string,
  ): Promise<{ ok: true; listing: ProductListing } | { ok: false; reason: LookupRefusal }> {
    let response: Response;
    try {
      response = await sendWithRetry(
        {
          operation: "POST /v1/lookup",
          url: `${CHANNEL3_API}/v1/lookup`,
          init: {
            method: "POST",
            headers: { "x-api-key": this.key.reveal(), "content-type": "application/json" },
            body: JSON.stringify({ url }),
          },
          idempotent: true,
        },
        this.deps,
        DEFAULT_RETRY_POLICY,
        () => new NoAnswerError("Channel3 did not answer"),
      );
    } catch (error) {
      if (error instanceof NoAnswerError) return { ok: false, reason: "unavailable" };
      throw error;
    }
    if (response.status === 404) return { ok: false, reason: "not-found" };
    if (response.status === 400 || response.status === 422) {
      return { ok: false, reason: "unsupported" };
    }
    if (!response.ok) return { ok: false, reason: "unavailable" };
    const body = z.object({ product: channel3ProductSchema }).safeParse(await response.json());
    if (!body.success) return { ok: false, reason: "unavailable" };
    return { ok: true, listing: toListing(body.data.product, { url, retrievedAt: this.now() }) };
  }

  async photo(url: string): Promise<Uint8Array | undefined> {
    if (!savablePhoto(url)) return undefined;
    let response: Response;
    try {
      response = await sendWithRetry(
        { operation: "GET listing photo", url, init: { method: "GET" }, idempotent: true },
        this.deps,
        { ...DEFAULT_RETRY_POLICY, timeoutMs: 10_000 },
        () => new NoAnswerError("no photo"),
      );
    } catch (error) {
      if (error instanceof NoAnswerError) return undefined;
      throw error;
    }
    if (!response.ok) return undefined;
    if (Number(response.headers.get("content-length") ?? "0") > MAX_PHOTO_BYTES) return undefined;
    const bytes = new Uint8Array(await response.arrayBuffer());
    return bytes.byteLength > MAX_PHOTO_BYTES ? undefined : bytes;
  }
}
