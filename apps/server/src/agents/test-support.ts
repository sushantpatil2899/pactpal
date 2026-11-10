import { makeIntakeKey, type Database } from "@pactpal/db";
import { TEST_NOW, testId } from "@pactpal/db/testing";
import type { dealTestApp } from "../deals/test-app.js";

interface ToolResult {
  result?: { content: { text: string }[]; isError?: boolean; tools?: { name: string }[] };
  error?: unknown;
}

/**
 * Test code only: an agent key for `sellerId` and a way to call `/mcp` with it: `rpc` sends one
 * JSON-RPC message; `tool` calls a tool and gives its text, its data (when not an error) and
 * whether it is an error.
 */
export async function mcpClient(
  db: Database,
  call: ReturnType<typeof dealTestApp>["call"],
  sellerId: string,
) {
  const { key } = await makeIntakeKey(
    db,
    { id: testId(700), sellerId, defaultCategory: "art-and-design", defaultCurrency: "USD" },
    TEST_NOW,
    "agent",
  );
  let ids = 1;
  const rpc = async (method: string, params: object = {}, auth = `Bearer ${key}`) => {
    const answer = await call(
      "POST",
      "/mcp",
      undefined,
      { jsonrpc: "2.0", id: ids++, method, params },
      { authorization: auth, accept: "application/json, text/event-stream" },
    );
    return { status: answer.statusCode, body: answer.json<ToolResult>() };
  };
  const tool = async (name: string, args: object = {}) => {
    const { body } = await rpc("tools/call", { name, arguments: args });
    const text = body.result?.content[0]?.text ?? "";
    const isError = body.result?.isError === true;
    return {
      isError,
      text,
      data: isError ? undefined : (JSON.parse(text) as Record<string, unknown>),
    };
  };
  return { key, rpc, tool };
}
