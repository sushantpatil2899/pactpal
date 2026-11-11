import { describe, expect, it } from "vitest";
import { LISTING_LIMITS, toListing } from "./listing.js";

const page = { url: "https://shop.example.com/p/1", retrievedAt: new Date("2026-11-10T04:00:00Z") };

describe("a listing from Channel3's product", () => {
  it("keeps the facts capped, de-duplicated and main image first", () => {
    const long = "x".repeat(LISTING_LIMITS.description + 50);
    const listing = toListing(
      {
        id: "p1",
        title: "  Canvas   tote ",
        description: long,
        brands: [],
        images: [
          { url: "https://cdn.trychannel3.com/1.jpg", is_main_image: false },
          { url: "http://cdn.trychannel3.com/2.jpg", is_main_image: false },
          // A shop's own address (as Channel3 gave for a live page): PactPal could not save it.
          { url: "https://www.shop.example.com/cdn/3.jpg", is_main_image: false },
          { url: "https://cdn.trychannel3.com/main.jpg", is_main_image: true },
        ],
        materials: ["Cotton canvas", "Cotton canvas", " "],
        key_features: Array.from({ length: 15 }, (_, n) => `Feature ${String(n)}`),
        structured_attributes: { "strap-length": ["60 cm"], empty: [] },
        offers: [
          { domain: "other.com", price: { price: 9, currency: "USD" } },
          { domain: "example.com", price: { price: 24.5, currency: "EUR" } },
        ],
      },
      page,
    );
    expect(listing).toMatchObject({
      domain: "shop.example.com",
      title: "Canvas tote",
      materials: ["Cotton canvas"],
      attributes: [{ name: "Strap length", values: ["60 cm"] }],
      price: { amount: "24.50", currency: "EUR" },
      imageUrls: ["https://cdn.trychannel3.com/main.jpg", "https://cdn.trychannel3.com/1.jpg"],
    });
    expect(listing.brand).toBeUndefined();
    expect(listing.weight).toBeUndefined();
    expect(listing.keyFeatures).toHaveLength(LISTING_LIMITS.items);
    expect(listing.description).toHaveLength(LISTING_LIMITS.description);
    expect(listing.description?.endsWith("…")).toBe(true);
  });

  it("leaves out what the product does not state", () => {
    const listing = toListing({ id: "p2", title: "" }, { ...page, url: "https://www.a.com/x" });
    expect(listing).toEqual({
      source: "channel3",
      productId: "p2",
      url: "https://www.a.com/x",
      domain: "a.com",
      retrievedAt: "2026-11-10T04:00:00.000Z",
      title: "Untitled product",
      materials: [],
      keyFeatures: [],
      attributes: [],
      imageUrls: [],
    });
  });
});
