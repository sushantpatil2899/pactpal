import type { SellerAppProblem } from "./api";

/** Why linking did not work, in the seller's words. Never repeats what they typed. */
export function sellerAppProblemText(
  problem: SellerAppProblem,
  missing: readonly string[],
): string {
  switch (problem) {
    case "login-failed":
      return "PayPal did not accept that client ID and secret. Copy both again from your sandbox app and check you are using sandbox keys, not live ones.";
    case "missing-features": {
      const names = missing.length > 0 ? missing.join(" and ") : "a feature PactPal needs";
      return `Your app is not allowed to use ${names}. Turn ${missing.length > 1 ? "them" : "it"} on in the app's settings on the PayPal developer site, save, and try again.`;
    }
    case "account-unreadable":
      return "PayPal would not say which account this app belongs to. Check the app is a sandbox business (merchant) app and try again.";
    case "account-taken":
      return "That PayPal account is already linked to another PactPal account.";
    case "paypal-unavailable":
      return "PayPal is not answering right now. Nothing was saved; please try again in a few minutes.";
    case "unavailable":
      return "Linking a PayPal app is not available on this server right now.";
    case "invalid":
      return "The client ID and secret can only contain letters, numbers, - and _. Copy them again without extra characters.";
    case "other":
      return "Something went wrong. Nothing was saved; please try again.";
  }
}
