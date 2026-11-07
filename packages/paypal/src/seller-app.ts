import type { HttpDeps, RetryPolicy } from "@pactpal/net";
import type { PayPalAppCredentials } from "./credentials.js";
import { PayPalApiError } from "./errors.js";
import { ownAccountId } from "./partners.js";
import { PayPalRestClient } from "./rest.js";
import { grantedFeatures } from "./scopes.js";
import { AccessTokenProvider } from "./token.js";

/** What a seller's own app must be allowed to do for PactPal to act through it. */
export const SELLER_APP_FEATURES = ["Invoicing", "Disputes"] as const;

/** The result of checking a seller's own app before it is linked. */
export type SellerAppCheck =
  | {
      ok: true;
      /** The PayPal account the app belongs to (payer id). */
      merchantId: string;
      /** Every permission address PayPal lists for the app. */
      scopes: string[];
    }
  /** PayPal refused the client id and secret. */
  | { ok: false; reason: "login-failed"; debugId: string | undefined }
  /** The app lacks a permission PactPal needs; `missing` names them. */
  | { ok: false; reason: "missing-features"; missing: string[] }
  /** PayPal would not say which account the app belongs to. */
  | { ok: false; reason: "account-unreadable"; debugId: string | undefined };

export interface SellerAppCheckOptions {
  baseUrl?: string;
  deps?: HttpDeps;
  policy?: RetryPolicy;
}

/** PayPal refuses bad credentials with 401 at login and a missing permission with 403. */
const refusedWith = (error: unknown, statuses: readonly number[]): error is PayPalApiError =>
  error instanceof PayPalApiError && statuses.includes(error.status);

/**
 * Logs in with a seller's own sandbox app, checks it may send invoices and handle disputes, and
 * reads which PayPal account it belongs to. Read-only. Network failures and PayPal outages are
 * thrown, so a caller never mistakes them for bad keys.
 */
export async function checkSellerApp(
  credentials: PayPalAppCredentials,
  options: SellerAppCheckOptions = {},
): Promise<SellerAppCheck> {
  const tokens = new AccessTokenProvider(credentials, options);
  let scopes: string[];
  try {
    scopes = (await tokens.get()).scopes;
  } catch (error) {
    if (refusedWith(error, [400, 401])) {
      return { ok: false, reason: "login-failed", debugId: error.debugId };
    }
    throw error;
  }
  const missing = grantedFeatures(scopes)
    .filter(({ feature, granted }) => !granted && SELLER_APP_FEATURES.some((f) => f === feature))
    .map(({ feature }) => feature);
  if (missing.length > 0) return { ok: false, reason: "missing-features", missing };
  try {
    const merchantId = await ownAccountId(new PayPalRestClient(tokens, options));
    return { ok: true, merchantId, scopes };
  } catch (error) {
    if (refusedWith(error, [401, 403])) {
      return { ok: false, reason: "account-unreadable", debugId: error.debugId };
    }
    throw error;
  }
}
