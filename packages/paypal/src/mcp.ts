import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import type { Secret } from "@pactpal/net";
import { z } from "zod";
import { PayPalMcpError } from "./errors.js";
import type { AccessToken, AccessTokenProvider } from "./token.js";

/**
 * PayPal's hosted sandbox MCP server, over SSE. The documented streamable HTTP
 * address (`/http`) answered 404 in October 2026, while `/sse` connected.
 */
export const SANDBOX_MCP_SSE_URL = "https://mcp.sandbox.paypal.com/sse";

/** Opens the MCP connection for a given access token; replaced in tests. */
export type McpTransportFactory = (token: Secret) => Transport;

/** The headers of every MCP request: the app's token, plus any extra ones (such as `PayPal-Auth-Assertion`). */
export const mcpHeaders = (
  token: Secret,
  extraHeaders: Readonly<Record<string, string>> = {},
): Record<string, string> => ({ ...extraHeaders, Authorization: `Bearer ${token.reveal()}` });

export const sseTransport =
  (
    url: string = SANDBOX_MCP_SSE_URL,
    extraHeaders: Readonly<Record<string, string>> = {},
  ): McpTransportFactory =>
  (token) =>
    // PayPal's sandbox MCP server only works over SSE (its streamable HTTP address returns 404).
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    new SSEClientTransport(new URL(url), {
      requestInit: { headers: mcpHeaders(token, extraHeaders) },
    });

export interface McpClientOptions {
  transport?: McpTransportFactory;
  /** Limit for connecting and for each call. */
  timeoutMs?: number;
}

// PayPal's tools answer with JSON text; failures look like {"ok":false,"code":...,"message":...}.
const toolFailure = z.object({
  ok: z.literal(false),
  code: z.string().default("UNKNOWN"),
  message: z.string().default(""),
});

const toolResult = z.object({
  content: z.array(z.looseObject({ type: z.string(), text: z.string().optional() })),
  isError: z.boolean().optional(),
});

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Talks to PayPal's MCP server for one app, logging in with that app's access
 * token. The connection is opened on first use and reopened when the token is
 * renewed or a call leaves it in an unknown state.
 */
export class PayPalMcpClient {
  readonly #tokens: Pick<AccessTokenProvider, "get">;
  readonly #transport: McpTransportFactory;
  readonly #timeoutMs: number;
  #connection: { client: Client; token: AccessToken } | undefined;

  constructor(tokens: Pick<AccessTokenProvider, "get">, options: McpClientOptions = {}) {
    this.#tokens = tokens;
    this.#transport = options.transport ?? sseTransport();
    this.#timeoutMs = options.timeoutMs ?? 10_000;
  }

  /** Names of the tools the server offers. */
  async listTools(): Promise<string[]> {
    const client = await this.#connect("tools/list");
    try {
      const { tools } = await client.listTools(undefined, { timeout: this.#timeoutMs });
      return tools.map((tool) => tool.name);
    } catch (error) {
      await this.#drop();
      throw new PayPalMcpError("tools/list", "NO_ANSWER", "unknown", describe(error), {
        cause: error,
      });
    }
  }

  /** Calls a tool and returns its answer parsed from JSON. Throws PayPalMcpError on any failure. */
  async callTool(tool: string, args: Record<string, unknown>): Promise<unknown> {
    const client = await this.#connect(tool);
    let raw: unknown;
    try {
      raw = await client.callTool({ name: tool, arguments: args }, undefined, {
        timeout: this.#timeoutMs,
      });
    } catch (error) {
      await this.#drop();
      throw new PayPalMcpError(tool, "NO_ANSWER", "unknown", describe(error), { cause: error });
    }

    const parsed = toolResult.safeParse(raw);
    if (!parsed.success) {
      throw new PayPalMcpError(tool, "NO_ANSWER", "unknown", "answer is not an MCP tool result");
    }
    const text = parsed.data.content.map((part) => part.text ?? "").join("");
    if (parsed.data.isError === true) throw new PayPalMcpError(tool, "TOOL_ERROR", "failed", text);

    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      throw new PayPalMcpError(tool, "NO_ANSWER", "unknown", "answer is not JSON");
    }
    const failure = toolFailure.safeParse(body);
    if (failure.success) {
      throw new PayPalMcpError(tool, failure.data.code, "failed", failure.data.message);
    }
    return body;
  }

  /** Closes the connection, if open. */
  async close(): Promise<void> {
    await this.#drop();
  }

  async #connect(tool: string): Promise<Client> {
    let token: AccessToken;
    try {
      token = await this.#tokens.get();
    } catch (error) {
      throw new PayPalMcpError(tool, "CONNECT_FAILED", "failed", describe(error), { cause: error });
    }
    if (this.#connection?.token === token) return this.#connection.client;

    await this.#drop();
    const client = new Client({ name: "pactpal", version: "0.1.0" });
    try {
      await client.connect(this.#transport(token.value), { timeout: this.#timeoutMs });
    } catch (error) {
      await client.close().catch(() => undefined);
      throw new PayPalMcpError(tool, "CONNECT_FAILED", "failed", describe(error), { cause: error });
    }
    this.#connection = { client, token };
    return client;
  }

  async #drop(): Promise<void> {
    const connection = this.#connection;
    this.#connection = undefined;
    // Closing a connection that already broke can fail; there is nothing left to clean up then.
    await connection?.client.close().catch(() => undefined);
  }
}
