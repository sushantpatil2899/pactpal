import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BrandLogo } from "../../design/brand-logos";
import { helpPage } from "../../shell/contact";
import { CanCannot } from "../../agent/CanCannot";
import { AGENT_CAN, AGENT_CANNOT, AGENT_CLIENTS, AGENT_RUN } from "../landing-words";
import { sceneOf } from "./agent-scene";
import "./agents.css";

const TYPE_MS = 26;
const ANSWER_MS = 420;
const NEXT_MS = 1150;
/** How long the run waits at the gate for the visitor before approving by itself. */
const GATE_MS = 5200;
const END_MS = 4200;
const CODE = "482 913";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const at = (i: number) => ({ "--i": i }) as CSSProperties;

type Side = "n" | "e" | "s" | "w";

/** A cube standing on the deck: six faces, a label on top, and anything on its sides. */
function Cube({
  className,
  label,
  sides = {},
}: {
  className: string;
  label?: string;
  sides?: Partial<Record<Side, ReactNode>>;
}) {
  return (
    <div className={`pp-lp-cube ${className}`}>
      <i className="top">{label && <b>{label}</b>}</i>
      {(["n", "s", "e", "w"] as const).map((side) => (
        <i key={side} className={side}>
          {sides[side]}
        </i>
      ))}
      <i className="bottom" />
    </div>
  );
}

/** The assistants on the AI cube's sides, turning past as it spins. */
const AI_SIDES: Partial<Record<Side, ReactNode>> = {
  n: <BrandLogo name="claude" />,
  e: <BrandLogo name="cursor" color="#eef2f6" />,
  s: <BrandLogo name="claude" />,
  w: <b className="pp-lp-cube-word">MCP</b>,
};

const PAYPAL_SIDES: Partial<Record<Side, ReactNode>> = {
  n: <BrandLogo name="paypal" />,
  e: <BrandLogo name="paypal" />,
  s: <BrandLogo name="paypal" />,
  w: <BrandLogo name="paypal" />,
};

/**
 * The agent's run, played when the section comes into view and again after a pause: calls typed
 * out, PactPal's answers, and the stop at the gate until the visitor approves (or the timer does).
 * With reduced motion the whole run shows at once, finished.
 */
function useRun(stage: React.RefObject<HTMLElement | null>) {
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [done, setDone] = useState(still ? AGENT_RUN.length : 0);
  const [typing, setTyping] = useState<{ step: number; chars: number } | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [code, setCode] = useState(false);
  const approve = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el || still) return;
    // Changed by the clean-up while the run is awaiting, so it is read through a function.
    const run = { stopped: false };
    const going = () => !run.stopped;
    let seen = false;
    const play = async () => {
      while (going()) {
        setDone(0);
        setCode(false);
        await wait(700);
        for (let step = 0; step < AGENT_RUN.length && going(); step++) {
          const call = AGENT_RUN[step]?.call ?? "";
          for (let n = 1; n <= call.length && going(); n++) {
            setTyping({ step, chars: n });
            await wait(TYPE_MS);
          }
          await wait(ANSWER_MS);
          setTyping(null);
          if (AGENT_RUN[step]?.kind === "gate") {
            setDone(step + 1);
            setWaiting(true);
            await Promise.race([
              wait(GATE_MS),
              new Promise<void>((resolve) => {
                approve.current = resolve;
              }),
            ]);
            approve.current = null;
            setWaiting(false);
            setCode(true);
            await wait(900);
            continue;
          }
          setDone(step + 1);
          await wait(NEXT_MS);
        }
        await wait(END_MS);
      }
    };
    const watch = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !seen) {
          seen = true;
          void play();
        }
      },
      { threshold: 0.35 },
    );
    watch.observe(el);
    return () => {
      run.stopped = true;
      watch.disconnect();
    };
  }, [stage, still]);

  return {
    done,
    typing,
    waiting,
    code,
    approve: () => approve.current?.(),
  };
}

/**
 * Your own AI agent: PactPal is an MCP server, so the assistant a seller already uses can work
 * their deals. The scene plays one run on a dispute: reads pass straight through, the packet is
 * built, and the request to send it stops at PactPal's gate until the seller approves and the
 * agent gives the one time code; then it goes to PayPal and is sealed. A tool that does not
 * exist (making an offer) is refused. Separate from the AI council, which drafts.
 */
export function Agents() {
  const stage = useRef<HTMLDivElement>(null);
  const { done, typing, waiting, code, approve } = useRun(stage);
  const scene = sceneOf(done, waiting);
  // The newest answered call decides what the packet on the deck does.
  const kind = AGENT_RUN[done - 1]?.kind;

  return (
    <section id="agents" className="pp-lp-agents pp-scope-dark" aria-labelledby="pp-lp-agents">
      <div className="pp-lp-agents-copy" data-reveal>
        <p className="pp-lp-kicker">
          <i /> Your own AI agent
        </p>
        <h2 id="pp-lp-agents" className="pp-lp-display">
          Your AI works your deals. <em>You hold the key.</em>
        </h2>
        <p>
          PactPal is an MCP server. Connect the assistant you already use with a key from your
          settings, and it can read your deals and disputes, draft new deals from a chat and build
          evidence packets. Anything it wants to send to PayPal stops at a gate that only your one
          time code opens.
        </p>
        <ul className="pp-lp-agents-clients" aria-label="Works with">
          {AGENT_CLIENTS.map((client) => (
            <li key={client}>{client}</li>
          ))}
        </ul>
        <CanCannot className="pp-lp-agents-lists" can={AGENT_CAN} cannot={AGENT_CANNOT} />
        <a className="pp-lp-agents-guide" href={helpPage("ai-agents")}>
          How to connect your agent →
        </a>
      </div>

      <div
        ref={stage}
        className="pp-lp-agents-stage"
        data-gate={scene.gate}
        data-kind={kind}
        data-packet={scene.packet}
        data-sent={scene.sent}
      >
        <div className="pp-lp-console" role="log" aria-label="An agent working a dispute">
          <header>
            <span aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            your assistant · pactpal (MCP)
          </header>
          <ol>
            {AGENT_RUN.slice(0, done).map((step) => (
              <li key={step.call} data-kind={step.kind}>
                <code>
                  <b>›</b> {step.call}
                </code>
                <span>{step.answer}</span>
              </li>
            ))}
            {typing && (
              <li data-kind="typing">
                <code>
                  <b>›</b> {AGENT_RUN[typing.step]?.call.slice(0, typing.chars)}
                  <i className="pp-lp-caret" />
                </code>
              </li>
            )}
          </ol>
        </div>

        <div className="pp-lp-deck-wrap" aria-hidden="true">
          <div className="pp-lp-deck">
            <div className="pp-lp-lane" />
            <Cube className="pp-lp-cube-ai" label="Your AI" sides={AI_SIDES} />
            <div className="pp-lp-gate">
              <Cube className="pp-lp-post pp-lp-post-a" />
              <Cube className="pp-lp-post pp-lp-post-b" />
              <div className="pp-lp-barrier" />
              <div className="pp-lp-lock">
                <i />
              </div>
            </div>
            <Cube className="pp-lp-cube-paypal" label="PayPal" sides={PAYPAL_SIDES} />
            {scene.packet && <Cube className="pp-lp-cube-packet" label="Packet" />}
            {done > 0 && (
              <Cube
                key={`p${String(done)}`}
                className={`pp-lp-packet pp-lp-packet-${kind ?? "read"}`}
              />
            )}
            <div className="pp-lp-log">
              {[0, 1].map((n) => (
                <Cube key={n} className="pp-lp-log-block" label={`#${String(429 + n)}`} />
              ))}
              {scene.sent && <Cube className="pp-lp-log-block pp-lp-log-new" label="#431" />}
            </div>
          </div>
        </div>

        <div className="pp-lp-approve" data-show={waiting || code}>
          {waiting ? (
            <>
              <p>
                <small>PactPal · Podcast edit, episode 12</small>
                Your agent asks to send evidence to PayPal.
              </p>
              <button type="button" className="pp-button pp-button-primary" onClick={approve}>
                Approve
              </button>
            </>
          ) : (
            <p>
              <small>One time code · 10 minutes, once</small>
              <b>{CODE}</b>
            </p>
          )}
        </div>

        <ul className="pp-lp-agents-legend" aria-hidden="true">
          {["Reads pass", "Sends wait for you", "Every call is logged"].map((word, i) => (
            <li key={word} style={at(i)}>
              {word}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
