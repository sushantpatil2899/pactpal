import { useEffect, useState } from "react";
import { getDealOptions, type DealOptions } from "../api";
import { Icon } from "../design/icons";
import { CopyButton, useSecrets } from "../IntakePanel";
import { helpPage } from "../shell/contact";
import { AGENT_CAN, AGENT_CANNOT, agentClients, mcpAddress } from "./agent-setup";
import { CanCannot } from "./CanCannot";

/** The key, its setup for the chosen client, and what an agent can and cannot do. */
function AgentKey({ options }: { options: DealOptions }) {
  const { view, shown, problem, part } = useSecrets(options);
  const [client, setClient] = useState("claude-code");
  if (!view) return null;
  const key = shown?.kind === "agent" ? shown.secret : undefined;
  const clients = agentClients(window.location.origin, key);
  const chosen = clients.find((c) => c.id === client) ?? clients[0];
  return (
    <>
      {problem && (
        <p role="alert" data-tone="problem">
          {problem}
        </p>
      )}
      <div className="pp-agent-step">
        <h3>
          <span>1</span> Make an agent key
        </h3>
        <p>
          It is shown once, so copy it then. A new key turns the old one off.{" "}
          <strong>Keep it secret: anyone with it can read your deals and make drafts.</strong>
        </p>
        {part("agent")}
      </div>
      <div className="pp-agent-step">
        <h3>
          <span>2</span> Add PactPal to your assistant
        </h3>
        <div className="pp-agent-clients" role="tablist" aria-label="Your assistant">
          {clients.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={c.id === chosen?.id}
              onClick={() => {
                setClient(c.id);
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
        {chosen && (
          <div role="tabpanel" aria-label={chosen.label}>
            <p>{chosen.how}</p>
            <div className="pp-agent-code">
              <pre>{chosen.code}</pre>
              <CopyButton text={chosen.code} />
            </div>
            {key === undefined && (
              <p className="pp-agent-note">
                Make a key above and it appears here in place of <code>ppk_your_agent_key</code>.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

/**
 * "Connect your AI agent" (8a–8c): PactPal is an MCP server at `/mcp`, so an assistant the
 * seller already uses can work their deals with an agent key. Anything it asks to send to PayPal
 * waits on the deal for the seller's approval and a one time code.
 */
export function AgentPanel() {
  const [options, setOptions] = useState<DealOptions>();
  useEffect(() => {
    getDealOptions().then(setOptions, () => undefined);
  }, []);
  // Arriving from "Connect your AI agent" elsewhere scrolls here.
  useEffect(() => {
    if (window.location.hash === "#agent") {
      document.getElementById("agent")?.scrollIntoView({ block: "start" });
    }
  }, [options]);
  return (
    <section id="agent" className="pp-agent" aria-labelledby="pp-agent-title">
      <header>
        <span className="pp-agent-icon" aria-hidden="true">
          <Icon name="chat" />
        </span>
        <div>
          <h2 id="pp-agent-title">Connect your AI agent</h2>
          <p>
            Let Claude, Cursor or another MCP assistant work your deals at{" "}
            <code>{mcpAddress(window.location.origin)}</code>.{" "}
            <a href={helpPage("ai-agents")} target="_blank" rel="noopener">
              Read the guide
            </a>
          </p>
        </div>
      </header>
      {options && <AgentKey options={options} />}
      <CanCannot className="pp-agent-limits" can={AGENT_CAN} cannot={AGENT_CANNOT} />
      <p className="pp-agent-note">
        When your agent asks to send an invoice or evidence, the request waits on the deal with its
        exact wording. Approve it there to get a one time code (10 minutes, once) to give your
        agent. Everything it does is in the deal&apos;s evidence log with the last four characters
        of its key.
      </p>
    </section>
  );
}
