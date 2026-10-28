/**
 * PayPal features PactPal needs, matched against the permission URLs an
 * app's access token lists (e.g. "https://uri.paypal.com/services/invoicing").
 */
export const FEATURE_SCOPES = [
  { feature: "Invoicing", marker: "/services/invoicing" },
  { feature: "Disputes", marker: "/services/disputes/" },
  { feature: "Transaction search", marker: "/services/reporting/search/read" },
] as const;

/** For each needed feature, whether any granted permission covers it. */
export function grantedFeatures(
  scopes: readonly string[],
): { feature: string; granted: boolean }[] {
  return FEATURE_SCOPES.map(({ feature, marker }) => ({
    feature,
    granted: scopes.some((scope) => scope.includes(marker)),
  }));
}
