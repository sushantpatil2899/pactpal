/** Where an MCP client reaches PactPal: this site's address plus `/mcp`. */
export const mcpAddress = (origin: string): string => `${origin.replace(/\/$/, "")}/mcp`;

/** Shown in place of a key until a new one is made (keys are shown only once). */
export const KEY_PLACEHOLDER = "ppk_your_agent_key";

export interface AgentClient {
  id: string;
  label: string;
  /** What to do with the text below. */
  how: string;
  code: string;
}

/**
 * How to add PactPal to each MCP client the seller may use, with this site's address and the key
 * filled in: Claude Code (one command), Cursor (its MCP settings file), Claude Desktop (through
 * the `mcp-remote` bridge, which sends the key as a header) and the MCP Inspector to try it.
 */
export function agentClients(origin: string, key: string = KEY_PLACEHOLDER): AgentClient[] {
  const url = mcpAddress(origin);
  const header = `Authorization: Bearer ${key}`;
  const json = (value: unknown) => JSON.stringify(value, null, 2);
  return [
    {
      id: "claude-code",
      label: "Claude Code",
      how: "Run this once in a terminal:",
      code: `claude mcp add --transport http pactpal ${url} --header "${header}"`,
    },
    {
      id: "cursor",
      label: "Cursor",
      how: "Add this to Cursor's MCP settings (~/.cursor/mcp.json):",
      code: json({ mcpServers: { pactpal: { url, headers: { Authorization: `Bearer ${key}` } } } }),
    },
    {
      id: "claude-desktop",
      label: "Claude Desktop",
      how: "Add this to Claude Desktop's config (Settings, Developer, Edit Config), then restart it:",
      code: json({
        mcpServers: { pactpal: { command: "npx", args: ["mcp-remote", url, "--header", header] } },
      }),
    },
    {
      id: "inspector",
      label: "Try it by hand",
      how: 'Run the MCP Inspector, choose "Streamable HTTP", and enter the address and header:',
      code: `npx @modelcontextprotocol/inspector\n\nAddress: ${url}\nHeader:  ${header}`,
    },
  ];
}

/** What an agent can and cannot do, in the seller's words (docs/help/ai-agents.md). */
export const AGENT_CAN = [
  "Read your deals: terms, timeline, records score and payment stages",
  "Read your disputes: reason, deadline, what PayPal allows and drafted notes",
  "Create draft deals from pasted text, up to 30 a day",
  "Build an evidence packet for a dispute",
  "Read a product listing page for you to add",
  "Ask you to send an invoice or evidence",
] as const;

export const AGENT_CANNOT = [
  "Send anything to PayPal without your one time code",
  "Sign or accept an agreement, or act for a buyer",
  "Message buyers, make offers or appeal",
  "Take orders from what buyers write: it reads it as information",
] as const;
