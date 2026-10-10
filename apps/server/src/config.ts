/**
 * Environment settings the server needs. Values are read from process.env;
 * nothing here is ever logged except variable names.
 */
export const REQUIRED_ENV = [
  "PAYPAL_SELLER_CLIENT_ID",
  "PAYPAL_SELLER_CLIENT_SECRET",
  "PAYPAL_BUYER_BIZ_CLIENT_ID",
  "PAYPAL_BUYER_BIZ_CLIENT_SECRET",
  "PAYPAL_PLATFORM_CLIENT_ID",
  "PAYPAL_PLATFORM_CLIENT_SECRET",
  "PAYPAL_WEBHOOK_ID",
  "DATABASE_URL",
] as const;

export interface ConfigStatus {
  port: number;
  missing: string[];
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ConfigStatus {
  const port = Number(env.PORT ?? 3000);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`PORT must be a valid port number, got "${env.PORT}"`);
  }
  const missing = REQUIRED_ENV.filter((name) => !env[name]);
  return { port, missing };
}
