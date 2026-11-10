import { describe, expect, it } from "vitest";
import { listingLines, listingSource } from "./listing.js";

describe("a listing in plain lines", () => {
  it("names each fact once, with where and when it was listed", () => {
    const listing = {
      title: "Canvas tote",
      brand: "Maya Makes",
      domain: "mayamakes.example",
      retrievedAt: "2026-11-10T04:00:00.000Z",
      description: "A sturdy tote.",
      materials: ["Cotton canvas", "Leather straps"],
      keyFeatures: ["Inner pocket"],
      attributes: [{ name: "Colour", values: ["Navy", "Cream"] }],
      price: { amount: "45.00", currency: "USD" },
      weight: "400 g",
    };
    expect(listingSource(listing)).toBe("mayamakes.example, 10 Nov 2026");
    expect(listingLines(listing)).toEqual([
      "Listed product: Canvas tote (Maya Makes), as listed on mayamakes.example, 10 Nov 2026",
      "Listed description: A sturdy tote.",
      "Listed materials: Cotton canvas, Leather straps",
      "Listed feature: Inner pocket",
      "Listed colour: Navy, Cream",
      "Listed weight: 400 g",
      "Listed price: 45.00 USD",
    ]);
    expect(
      listingLines({
        ...listing,
        brand: undefined,
        description: undefined,
        materials: [],
        keyFeatures: [],
        attributes: [],
        price: undefined,
        weight: undefined,
      }),
    ).toEqual(["Listed product: Canvas tote, as listed on mayamakes.example, 10 Nov 2026"]);
  });
});
