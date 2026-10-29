import {
  AccessTokenProvider,
  McpFallback,
  PayPalMcpClient,
  PayPalRestClient,
} from "@pactpal/paypal";
import { formatErrors, loadConfig } from "./config.js";

/** Prints the message and exits; for the sandbox commands only. */
export function fail(message: string): never {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

/** PayPal clients for the seller app, built from the environment, for the sandbox commands. */
export function sellerClients(): {
  rest: PayPalRestClient;
  mcp: PayPalMcpClient;
  fallback: McpFallback;
} {
  const config = loadConfig(process.env);
  if (!config.ok) fail(formatErrors(config.errors));
  const credentials = config.config.paypal.apps.seller;
  if (credentials === undefined) fail("The seller app keys are not set; run pnpm env:check.");
  const tokens = new AccessTokenProvider(credentials);
  return {
    rest: new PayPalRestClient(tokens),
    mcp: new PayPalMcpClient(tokens),
    fallback: new McpFallback(),
  };
}
