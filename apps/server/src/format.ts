import { toPayPalMoney, type MinorAmount, type Route } from "@pactpal/paypal";

/** Two-column plain-text rows, labels padded so the second column lines up. */
export function rows(entries: readonly (readonly [string, string])[]): string {
  const width = Math.max(...entries.map(([label]) => label.length)) + 2;
  return entries.map(([label, value]) => `  ${label.padEnd(width)}${value}\n`).join("");
}

/** "rest" or "mcp", plus why MCP was skipped. */
export function describeRoute({ transport, fallbackReason }: Route): string {
  return fallbackReason === undefined ? transport : `${transport} (MCP skipped: ${fallbackReason})`;
}

/** e.g. "1.00 USD"; "unknown" when PayPal gave no amount. */
export function formatAmount(amount: MinorAmount | undefined): string {
  if (amount === undefined) return "unknown";
  const { value, currency_code } = toPayPalMoney(amount);
  return `${value} ${currency_code}`;
}
