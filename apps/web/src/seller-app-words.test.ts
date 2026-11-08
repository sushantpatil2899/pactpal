import { describe, expect, it } from "vitest";
import type { SellerAppProblem } from "./api";
import { sellerAppProblemText } from "./seller-app-words";

const ALL: SellerAppProblem[] = [
  "login-failed",
  "missing-features",
  "account-unreadable",
  "account-taken",
  "paypal-unavailable",
  "unavailable",
  "invalid",
  "other",
];

describe("sellerAppProblemText", () => {
  it("has its own sentence for every problem", () => {
    const texts = ALL.map((problem) => sellerAppProblemText(problem, []));
    expect(new Set(texts).size).toBe(ALL.length);
  });

  it("names the missing permissions", () => {
    expect(sellerAppProblemText("missing-features", ["Invoicing"])).toBe(
      "Your app is not allowed to use Invoicing. Turn it on in the app's settings on the PayPal developer site, save, and try again.",
    );
    expect(sellerAppProblemText("missing-features", ["Invoicing", "Disputes"])).toContain(
      "use Invoicing and Disputes. Turn them on",
    );
  });
});
