import type { CSSProperties } from "react";
import { RAILS } from "../landing-words";

const at = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * PayPal and PactPal, side by side: money moves on PayPal's rails, and every event lands in the
 * record. A light runs node to node along the rail, lighting each in turn.
 */
export function Rails() {
  return (
    <section id="paypal" className="pp-lp-rails pp-scope-dark" aria-labelledby="pp-lp-rails">
      <header data-reveal>
        <p className="pp-lp-kicker">
          <i /> Built on PayPal
        </p>
        <h2 id="pp-lp-rails" className="pp-lp-display">
          PayPal moves the money.
          <br />
          <em>PactPal keeps the proof.</em>
        </h2>
        <p>
          No new wallet and no middleman. Your buyers pay the way they already do, into your own
          PayPal account, and every payment and dispute becomes an entry in the deal&apos;s record.
        </p>
      </header>
      <ol className="pp-lp-rail" data-reveal>
        {RAILS.map((rail, i) => (
          <li key={rail.step} style={at(i)} data-side={i < 3 ? "paypal" : "pactpal"}>
            <span className="pp-lp-rail-node">
              <b>{String(i + 1).padStart(2, "0")}</b>
              {rail.step}
            </span>
            <h3>{rail.title}</h3>
            <p>{rail.body}</p>
          </li>
        ))}
      </ol>
      <p className="pp-lp-rail-legend" data-reveal>
        <span data-side="paypal">On PayPal</span>
        <span data-side="pactpal">In PactPal&apos;s record</span>
        <small>Every call tries PayPal&apos;s own MCP tools first, then its REST API.</small>
      </p>
    </section>
  );
}
