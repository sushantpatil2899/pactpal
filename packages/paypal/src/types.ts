export type Transport = "mcp" | "rest";

export interface PayPalResult<T> {
  data: T;
  transport: Transport;
  /** Set when MCP was tried first and REST had to take over. */
  fallbackReason?: string;
  /** PayPal-Debug-Id header from REST responses, for support threads. */
  debugId?: string;
}
