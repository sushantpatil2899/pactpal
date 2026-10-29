import type { z } from "zod";
import type { McpFallback } from "./fallback.js";
import type { PayPalMcpClient } from "./mcp.js";
import type { PayPalRestClient } from "./rest.js";

/**
 * Shared base of the PayPal operation groups (invoices, disputes): the REST
 * client, the optional MCP client, and the MCP-first fallback that chooses
 * between them.
 */
export abstract class PayPalOperations {
  protected readonly rest: Pick<PayPalRestClient, "request">;
  protected readonly mcp: Pick<PayPalMcpClient, "callTool"> | undefined;
  protected readonly fallback: McpFallback;

  constructor(
    rest: Pick<PayPalRestClient, "request">,
    mcp: Pick<PayPalMcpClient, "callTool"> | undefined,
    fallback: McpFallback,
  ) {
    this.rest = rest;
    this.mcp = mcp;
    this.fallback = fallback;
  }

  /** The MCP attempt for one tool call, or undefined when no MCP client is configured. */
  protected mcpCall<T>(
    tool: string,
    schema: z.ZodType<T>,
    args: Record<string, unknown>,
  ): { call: () => Promise<unknown>; schema: z.ZodType<T> } | undefined {
    const mcp = this.mcp;
    return mcp && { call: () => mcp.callTool(tool, args), schema };
  }
}
