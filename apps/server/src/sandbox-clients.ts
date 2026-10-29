import {
  AccessTokenProvider,
  McpFallback,
  PayPalMcpClient,
  PayPalRestClient,
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

/** PayPal clients for one sandbox app, built from the environment, for the sandbox commands. */
export function appClients(app: PayPalApp): {
  rest: PayPalRestClient;
  mcp: PayPalMcpClient;
  fallback: McpFallback;
} {
  const config = loadConfig(process.env);
  if (!config.ok) fail(formatErrors(config.errors));
  const credentials = config.config.paypal.apps[app];
  if (credentials === undefined) {
    fail(`The ${APP_NAMES[app]} app keys are not set; run pnpm env:check.`);
  }
  const tokens = new AccessTokenProvider(credentials);
  return {
    rest: new PayPalRestClient(tokens),
    mcp: new PayPalMcpClient(tokens),
    fallback: new McpFallback(),
  };
}

/** The seller app's clients, used by most sandbox commands. */
export const sellerClients = () => appClients("seller");
