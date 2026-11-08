import { PayPalWebhooks, ownAppClients, type PayPalAppCredentials } from "@pactpal/paypal";
import type { LinkedAppClients } from "./linked-apps.js";

/**
 * The real clients for a seller's own app, for the website and the background jobs alike. REST
 * only, like PactPal's own app: PayPal's MCP tool takes no request id (docs/decisions.md, 4d).
 */
export function connectOwnApp(credentials: PayPalAppCredentials): LinkedAppClients {
  const clients = ownAppClients(credentials);
  return {
    invoices: clients.invoices,
    disputes: clients.disputes,
    webhooks: new PayPalWebhooks(clients.rest),
  };
}
