import type { HttpDeps, RetryPolicy } from "@pactpal/net";
import { authAssertion } from "./assertion.js";
import type { PayPalAppCredentials } from "./credentials.js";
import { PayPalDisputes } from "./disputes.js";
import { McpFallback } from "./fallback.js";
import { PayPalInvoices } from "./invoices.js";
import { PayPalRestClient } from "./rest.js";
import { AccessTokenProvider } from "./token.js";

/** PayPal access for one connected seller. */
export interface SellerClients {
  rest: PayPalRestClient;
  invoices: PayPalInvoices;
  disputes: PayPalDisputes;
}

/** Invoices and disputes over one REST client; no MCP client, so every call goes over REST. */
function clientsOver(rest: PayPalRestClient): SellerClients {
  const fallback = new McpFallback();
  return {
    rest,
    invoices: new PayPalInvoices(rest, undefined, fallback),
    disputes: new PayPalDisputes(rest, undefined, fallback),
  };
}

/**
 * PayPal access through a seller's own sandbox app (6h): it logs in with the seller's keys and acts
 * as their account directly, with no seller header. REST only, like the platform path.
 */
export function ownAppClients(
  credentials: PayPalAppCredentials,
  options: PlatformSellerOptions = {},
): SellerClients {
  return clientsOver(new PayPalRestClient(new AccessTokenProvider(credentials, options), options));
}

export interface PlatformSellerOptions {
  baseUrl?: string;
  deps?: HttpDeps;
  policy?: RetryPolicy;
}

/**
 * The platform app working for connected sellers: every call carries the seller's
 * `PayPal-Auth-Assertion`. REST only, because PayPal's hosted MCP server ignores that header and
 * would act on PactPal's own account (spike S0c, docs/spike-results.md). One login serves every
 * seller; each seller keeps one set of clients, so their dispute answers still go one at a time.
 */
export class PlatformSellerClients {
  readonly #clientId: string;
  readonly #tokens: AccessTokenProvider;
  readonly #options: PlatformSellerOptions;
  readonly #sellers = new Map<string, SellerClients>();

  constructor(credentials: PayPalAppCredentials, options: PlatformSellerOptions = {}) {
    this.#clientId = credentials.clientId;
    this.#tokens = new AccessTokenProvider(credentials, options);
    this.#options = options;
  }

  /** The clients for the seller with this PayPal account id (payer id). */
  for(merchantId: string): SellerClients {
    const known = this.#sellers.get(merchantId);
    if (known !== undefined) return known;
    const clients = clientsOver(
      new PayPalRestClient(this.#tokens, {
        ...this.#options,
        authAssertion: authAssertion(this.#clientId, merchantId),
      }),
    );
    this.#sellers.set(merchantId, clients);
    return clients;
  }
}
