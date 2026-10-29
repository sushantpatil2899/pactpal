// Fake PayPal clients shared by the operation tests (invoices, disputes). Not exported from index.ts.
import { PayPalMcpError } from "./errors.js";
import { DEFAULT_FALLBACK_POLICY, McpFallback } from "./fallback.js";
import type { PayPalMcpClient } from "./mcp.js";
import type { PayPalRestClient, RestRequest, RestResponse } from "./rest.js";

/** Today's hosted MCP failure, the default answer of the fake MCP client. */
export const mcpSetupError = new PayPalMcpError(
  "x",
  "PAYPAL_API_SETUP_ERROR",
  "failed",
  "Unsupported cache mode",
);

export interface FakeClients {
  rest: Pick<PayPalRestClient, "request">;
  /** Undefined when the test runs without MCP. */
  mcp: Pick<PayPalMcpClient, "callTool"> | undefined;
  fallback: McpFallback;
  restCalls: RestRequest<unknown>[];
  mcpCalls: { tool: string; args: Record<string, unknown> }[];
}

/**
 * Fake REST and MCP clients answering from queues. REST answers are checked
 * with the request's schema like the real client; an Error in a queue is thrown.
 */
export function fakeClients(
  options: { rest?: unknown[]; mcp?: unknown[] | "none" } = {},
): FakeClients {
  const restReplies = [...(options.rest ?? [])];
  const mcpReplies = options.mcp === "none" ? [] : [...(options.mcp ?? [])];
  const restCalls: RestRequest<unknown>[] = [];
  const mcpCalls: { tool: string; args: Record<string, unknown> }[] = [];

  const rest = {
    request: <T>(request: RestRequest<T>): Promise<RestResponse<T>> => {
      restCalls.push(request);
      const reply = restReplies.shift();
      if (reply instanceof Error) return Promise.reject(reply);
      return Promise.resolve({
        data: request.schema.parse(reply),
        status: 200,
        debugId: "dbg-rest",
      });
    },
  };
  const mcp = {
    callTool: (tool: string, args: Record<string, unknown>) => {
      mcpCalls.push({ tool, args });
      const reply = mcpReplies.shift() ?? mcpSetupError;
      return reply instanceof Error ? Promise.reject(reply) : Promise.resolve(reply);
    },
  };
  const fallback = new McpFallback({ policy: { ...DEFAULT_FALLBACK_POLICY, mcpTimeoutMs: 50 } });
  return { rest, mcp: options.mcp === "none" ? undefined : mcp, fallback, restCalls, mcpCalls };
}
