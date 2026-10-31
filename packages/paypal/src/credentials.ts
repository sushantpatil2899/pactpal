import type { Secret } from "@pactpal/net";

/**
 * PayPal REST base address. Fixed to the sandbox: live money and production
 * credentials are out of scope (docs/scope.md), so no setting can point the
 * client at real PayPal by mistake.
 */
export const SANDBOX_API_BASE_URL = "https://api-m.sandbox.paypal.com";

/** Client id and secret of one PayPal REST app. */
export interface PayPalAppCredentials {
  clientId: string;
  clientSecret: Secret;
}
