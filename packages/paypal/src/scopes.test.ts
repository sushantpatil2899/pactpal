import { describe, expect, it } from "vitest";
import { grantedFeatures } from "./scopes.js";

describe("grantedFeatures", () => {
  it("matches permission URLs to the features PactPal needs", () => {
    expect(
      grantedFeatures([
        "https://uri.paypal.com/services/invoicing",
        "https://uri.paypal.com/services/disputes/read-seller",
      ]),
    ).toEqual([
      { feature: "Invoicing", granted: true },
      { feature: "Disputes", granted: true },
      { feature: "Transaction search", granted: false },
    ]);
  });
});
