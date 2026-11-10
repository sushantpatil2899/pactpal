import { toListing } from "./listing.js";

/** Test code only: Channel3's real answer for an Allbirds product page (10 Nov 2026), trimmed. */
export const CHANNEL3_LOOKUP_ANSWER = {
  product: {
    id: "biyIA8e",
    title: "Men's Tree Runner",
    description:
      "The Allbirds Women's Tree Runner is a versatile, minimalist casual walking shoe designed for everyday comfort. Featuring a breathable upper made from a blend of TENCEL\u2122 Lyocell (eucalyptus tree fiber) and recycled polyester, these shoes offer a light, cool feel ideal for traveling, commuting, and wa",
    brands: [
      {
        id: "WIge",
        name: "ALL BIRDS",
      },
    ],
    images: [
      {
        url: "https://cdn.trychannel3.com/77fa2227-3fe7-424f-b56f-537530edb07a?mid=FJaR",
        cleaned_url: null,
        is_main_image: true,
        shot_type: "hero",
        alt_text: "Black men's tree runner shoe on white background.",
      },
      {
        url: "https://cdn.trychannel3.com/29620b96-491e-43b5-93e7-7b827a5d0641?mid=FJaR",
        cleaned_url:
          "https://cdn.trychannel3.com/cleaned/v1/29620b96-491e-43b5-93e7-7b827a5d0641?mid=FJaR",
        is_main_image: false,
        shot_type: "hero",
        alt_text: "Black men's tree runner shoe view from the back.",
      },
      {
        url: "https://cdn.trychannel3.com/0a4d958b-3c14-41d0-8fa6-f61ecf35f541?mid=FJaR",
        cleaned_url:
          "https://cdn.trychannel3.com/cleaned/v1/0a4d958b-3c14-41d0-8fa6-f61ecf35f541?mid=FJaR",
        is_main_image: false,
        shot_type: "detail",
        alt_text: "Interior view of the black men's tree runner insole.",
      },
      {
        url: "https://cdn.trychannel3.com/2c9db0e3-20d1-4db2-9c1f-cb59b384618e?mid=FJaR",
        cleaned_url: null,
        is_main_image: false,
        shot_type: "detail",
        alt_text: "Close-up of the white outsole of the men's tree runner.",
      },
    ],
    materials: [
      "TENCEL\u2122 Lyocell",
      "Recycled Polyester",
      "Sugarcane-based EVA foam",
      "Merino wool",
    ],
    key_features: [
      "Breathable TENCEL\u2122 Lyocell and recycled polyester blend upper",
      "Sugarcane-based SweetFoam\u00ae cushioning for responsive energy return",
      "Soft Merino-wool blend lining",
      "100% recycled polyester laces",
      "Machine washable",
      "Lightweight and flexible barefoot feel",
    ],
    structured_attributes: {
      "shoe-features": ["Breathable design", "Cushioned", "Lightweight", "Recycled materials"],
      "footwear-material": ["Textile", "Polyester"],
      pattern: ["Solid"],
      "care-instructions": ["Machine washable", "Hand wash", "Line dry"],
      "toe-style": ["Round"],
      "closure-type": ["Lace-up"],
      "upper-material": ["Knit", "Synthetic"],
      activity: ["Walking"],
      "occasion-style": ["Casual"],
      "sneaker-style": ["Low-top"],
      "lining-material": ["Wool"],
      "heel-height-type": ["Flat"],
    },
    offers: [
      {
        url: "https://buy.trychannel3.com/x",
        domain: "allbirds.com",
        price: {
          price: 50.0,
          compare_at_price: 100.0,
          currency: "USD",
        },
        availability: "InStock",
        condition: "new",
        max_commission_rate: 0.035,
        dimensions: {
          length: null,
          width: null,
          height: null,
          weight: {
            number: 7.3,
            unit: "oz",
          },
        },
      },
    ],
  },
};

/** Test code only: the listing PactPal keeps from that answer. */
export const TEST_LISTING = toListing(CHANNEL3_LOOKUP_ANSWER.product, {
  url: "https://www.allbirds.com/products/mens-tree-runners",
  retrievedAt: new Date("2026-11-10T04:00:00.000Z"),
});
