import { describe, expect, it } from "vitest";
import { KEY_PLACEHOLDER, agentClients, mcpAddress } from "./agent-setup";

describe("connecting an AI agent", () => {
  it("points every client at this site's /mcp with the key as a bearer header", () => {
    expect(mcpAddress("https://pactpal.example/")).toBe("https://pactpal.example/mcp");
    const clients = agentClients("https://pactpal.example", "ppk_abc");
    expect(clients.map((c) => c.id)).toEqual([
      "claude-code",
      "cursor",
      "claude-desktop",
      "inspector",
    ]);
    expect(clients[0]?.code).toBe(
      'claude mcp add --transport http pactpal https://pactpal.example/mcp --header "Authorization: Bearer ppk_abc"',
    );
    for (const client of clients) {
      expect(client.code).toContain("https://pactpal.example/mcp");
      expect(client.code).toContain("Bearer ppk_abc");
    }
    expect(JSON.parse(clients[1]?.code ?? "")).toEqual({
      mcpServers: {
        pactpal: {
          url: "https://pactpal.example/mcp",
          headers: { Authorization: "Bearer ppk_abc" },
        },
      },
    });
  });

  it("shows a placeholder until a key is made", () => {
    expect(agentClients("https://pactpal.example")[0]?.code).toContain(KEY_PLACEHOLDER);
  });
});
