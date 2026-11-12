import {
  McpFallback,
  PayPalSandboxDisputes,
  PayPalWebhooks,
  ownAppClients,
  type PayPalAppCredentials,
  type SellerClients,
} from "@pactpal/paypal";
import type { LinkedAppClients } from "./linked-apps.js";

/** A linked app's clients over one login, with its dispute client given. */
const linkedClients = (
  clients: SellerClients,
  disputes: LinkedAppClients["disputes"],
): LinkedAppClients => ({
  invoices: clients.invoices,
  disputes,
  webhooks: new PayPalWebhooks(clients.rest),
});

/**
 * The real clients for a seller's own app, for the website and the background jobs alike. REST
 * only, like PactPal's own app: PayPal's MCP tool takes no request id (docs/decisions.md, 4d).
 */
export function connectOwnApp(credentials: PayPalAppCredentials): LinkedAppClients {
  const clients = ownAppClients(credentials);
  return linkedClients(clients, clients.disputes);
}

/**
 * The demo seed's clients for a seller's own app (9b-2c): the same, but its dispute client can also
 * take PayPal's sandbox-only steps, such as settling a case. Never used by the website.
 */
export function connectSandboxApp(credentials: PayPalAppCredentials): LinkedAppClients {
  const clients = ownAppClients(credentials);
  return linkedClients(
    clients,
    new PayPalSandboxDisputes(clients.rest, undefined, new McpFallback()),
  );
}
