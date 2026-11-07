import {
  AccessTokenProvider,
  McpFallback,
  PayPalMcpClient,
  PayPalRestClient,
  SANDBOX_MCP_SSE_URL,
  authAssertion,
  sseTransport,
} from "@pactpal/paypal";
import { formatErrors, loadConfig, type PayPalApp } from "./config.js";

/** Prints the message and exits; for the sandbox commands only. */
export function fail(message: string): never {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

const APP_NAMES: Record<PayPalApp, string> = {
  seller: "seller",
  buyerBiz: "buyer business",
  platform: "platform",
};

/**
 * PayPal clients for one sandbox app, built from the environment, for the sandbox commands.
 * With `actAs` (a connected seller's payer id) every REST and MCP call is made for that seller.
 */
export function appClients(
  app: PayPalApp,
  options: { actAs?: string } = {},
): {
  rest: PayPalRestClient;
  mcp: PayPalMcpClient;
  fallback: McpFallback;
  clientId: string;
} {
  const config = loadConfig(process.env);
  if (!config.ok) fail(formatErrors(config.errors));
  const credentials = config.config.paypal.apps[app];
  if (credentials === undefined) {
    fail(`The ${APP_NAMES[app]} app keys are not set; run pnpm env:check.`);
  }
  const tokens = new AccessTokenProvider(credentials);
  const assertion =
    options.actAs === undefined ? undefined : authAssertion(credentials.clientId, options.actAs);
  return {
    rest: new PayPalRestClient(tokens, assertion === undefined ? {} : { authAssertion: assertion }),
    mcp: new PayPalMcpClient(
      tokens,
      assertion === undefined
        ? {}
        : { transport: sseTransport(SANDBOX_MCP_SSE_URL, { "PayPal-Auth-Assertion": assertion }) },
    ),
    fallback: new McpFallback(),
    clientId: credentials.clientId,
  };
}

/** The seller app's clients, used by most sandbox commands. */
export const sellerClients = () => appClients("seller");

/**
 * Clients for the dispute commands: the seller app, or with `asSeller` (a
 * connected seller's payer id) the platform app working for that seller over
 * REST only, because PayPal's MCP server ignores the seller header (6a).
 */
export function disputeClients(asSeller: string | undefined): {
  rest: PayPalRestClient;
  mcp: PayPalMcpClient | undefined;
  fallback: McpFallback;
  close: () => Promise<void>;
} {
  const clients =
    asSeller === undefined ? sellerClients() : appClients("platform", { actAs: asSeller });
  return {
    rest: clients.rest,
    mcp: asSeller === undefined ? clients.mcp : undefined,
    fallback: clients.fallback,
    close: () => clients.mcp.close(),
  };
}
