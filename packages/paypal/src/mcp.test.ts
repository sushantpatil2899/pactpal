import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { describe, expect, it } from "vitest";
import { Secret } from "./credentials.js";
import { PayPalMcpError } from "./errors.js";
import { PayPalMcpClient, sseTransport, type McpTransportFactory } from "./mcp.js";
import type { AccessToken } from "./token.js";

const text = (value: string) => ({ content: [{ type: "text" as const, text: value }] });

/** A fake PayPal MCP server with tools covering each kind of answer. */
function fakeServer(options: { withTools?: boolean } = {}): McpServer {
  const server = new McpServer({ name: "fake-paypal", version: "0" });
  if (options.withTools === false) return server;
  server.registerTool("list_invoices", { description: "list" }, () =>
    text(JSON.stringify({ items: [{ id: "INV-1" }] })),
  );
  server.registerTool("broken", { description: "PayPal-style failure" }, () =>
    text(
      JSON.stringify({
        ok: false,
        code: "PAYPAL_API_SETUP_ERROR",
        message: "Unsupported cache mode: default",
      }),
    ),
  );
  server.registerTool("tool_error", { description: "MCP error result" }, () => ({
    ...text("bad arguments"),
    isError: true,
  }));
  server.registerTool("not_json", { description: "plain text" }, () => text("hello"));
  server.registerTool(
    "slow",
    { description: "never answers" },
    () => new Promise<never>(() => undefined),
  );
  return server;
}

function token(value: string): AccessToken {
  return {
    value: new Secret(value),
    expiresAt: Number.MAX_SAFE_INTEGER,
    scopes: [],
    appId: undefined,
  };
}

/** Connects each new MCP connection to a fresh fake server, recording the token it used. */
function setup(options: { withTools?: boolean; timeoutMs?: number } = {}) {
  let current = token("tok-1");
  const usedTokens: string[] = [];
  const transport: McpTransportFactory = (secret) => {
    usedTokens.push(secret.reveal());
    const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();
    void fakeServer(options).connect(serverSide);
    return clientSide;
  };
  const client = new PayPalMcpClient(
    { get: () => Promise.resolve(current) },
    { transport, timeoutMs: options.timeoutMs ?? 1000 },
  );
  return {
    client,
    usedTokens,
    renewToken: (value: string) => {
      current = token(value);
    },
  };
}

async function mcpError(promise: Promise<unknown>): Promise<PayPalMcpError> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof PayPalMcpError) return error;
    throw error;
  }
  throw new Error("expected a PayPalMcpError");
}

describe("PayPalMcpClient", () => {
  it("connects with the app's token, lists tools and returns a tool's JSON answer", async () => {
    const { client, usedTokens } = setup();
    expect(await client.listTools()).toEqual([
      "list_invoices",
      "broken",
      "tool_error",
      "not_json",
      "slow",
    ]);
    expect(await client.callTool("list_invoices", { page: 1 })).toEqual({
      items: [{ id: "INV-1" }],
    });
    expect(usedTokens).toEqual(["tok-1"]);
    await client.close();
  });

  it("turns PayPal's {ok:false} answer into a failed PayPalMcpError", async () => {
    const { client } = setup();
    const error = await mcpError(client.callTool("broken", {}));
    expect(error).toMatchObject({
      tool: "broken",
      code: "PAYPAL_API_SETUP_ERROR",
      outcome: "failed",
      message: "MCP broken failed: PAYPAL_API_SETUP_ERROR: Unsupported cache mode: default",
    });
  });

  it("reports an MCP error result as failed", async () => {
    const { client } = setup();
    expect(await mcpError(client.callTool("tool_error", {}))).toMatchObject({
      code: "TOOL_ERROR",
      outcome: "failed",
    });
  });

  it("reports an answer that is not JSON as unknown outcome", async () => {
    const { client } = setup();
    expect(await mcpError(client.callTool("not_json", {}))).toMatchObject({
      code: "NO_ANSWER",
      outcome: "unknown",
    });
  });

  it("times out a call with unknown outcome and reconnects for the next one", async () => {
    const { client, usedTokens } = setup({ timeoutMs: 20 });
    expect(await mcpError(client.callTool("slow", {}))).toMatchObject({
      code: "NO_ANSWER",
      outcome: "unknown",
    });
    await client.callTool("list_invoices", {});
    expect(usedTokens).toEqual(["tok-1", "tok-1"]);
  });

  it("reconnects with the new token after the token is renewed", async () => {
    const { client, usedTokens, renewToken } = setup();
    await client.callTool("list_invoices", {});
    await client.callTool("list_invoices", {});
    renewToken("tok-2");
    await client.callTool("list_invoices", {});
    expect(usedTokens).toEqual(["tok-1", "tok-2"]);
  });

  it("reports a failed listing when the server offers no tools", async () => {
    const { client } = setup({ withTools: false });
    expect(await mcpError(client.listTools())).toMatchObject({
      tool: "tools/list",
      code: "NO_ANSWER",
    });
  });

  it("reports a refused connection as failed", async () => {
    const refusing: Transport = {
      start: () => Promise.reject(new Error("connection refused")),
      send: () => Promise.resolve(),
      close: () => Promise.resolve(),
    };
    const client = new PayPalMcpClient(
      { get: () => Promise.resolve(token("t")) },
      { transport: () => refusing },
    );
    expect(await mcpError(client.callTool("list_invoices", {}))).toMatchObject({
      code: "CONNECT_FAILED",
      outcome: "failed",
    });
  });

  it("reports a failed login as a failed connection", async () => {
    const client = new PayPalMcpClient({ get: () => Promise.reject(new Error("invalid_client")) });
    expect(await mcpError(client.callTool("list_invoices", {}))).toMatchObject({
      code: "CONNECT_FAILED",
      outcome: "failed",
      message: "MCP list_invoices failed: CONNECT_FAILED: invalid_client",
    });
  });

  it("builds an SSE connection to PayPal's sandbox server by default", () => {
    // PayPal only serves MCP over SSE, which the SDK marks deprecated.
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expect(sseTransport()(new Secret("t"))).toBeInstanceOf(SSEClientTransport);
  });
});
