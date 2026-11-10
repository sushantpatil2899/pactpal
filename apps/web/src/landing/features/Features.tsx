import type { CSSProperties, ReactNode } from "react";
import { FEATURES } from "../landing-words";

const at = (i: number) => ({ "--i": i }) as CSSProperties;
const dots = (n: number, className: string) =>
  Array.from({ length: n }, (_, i) => <i key={i} className={className} style={at(i)} />);

/** A small moving picture for each feature tile. */
const ART: Record<(typeof FEATURES)[number]["id"], ReactNode> = {
  chat: (
    <span className="pp-lp-art-chat">
      <b>Can you do it by Friday?</b>
      <span>{dots(3, "pp-lp-dot")}</span>
    </span>
  ),
  remind: (
    <span className="pp-lp-art-remind">
      {["72 h", "24 h", "6 h"].map((label, i) => (
        <b key={label} style={at(i)}>
          {label}
        </b>
      ))}
    </span>
  ),
  switch: (
    <span className="pp-lp-art-keys">
      <kbd>⌘</kbd>
      <kbd>K</kbd>
      <span>logo re|</span>
    </span>
  ),
  screenshot: (
    <span className="pp-lp-art-scan">
      {dots(4, "pp-lp-line")}
      <i className="pp-lp-scanbar" />
    </span>
  ),
  forward: (
    <span className="pp-lp-art-mail">
      <i />
      <b>deal-7f3c@in.pact-pal.app</b>
    </span>
  ),
  check: (
    <span className="pp-lp-art-check">
      {["6 × 9 in", "300 dpi", "CMYK PDF"].map((label, i) => (
        <b key={label} style={at(i)}>
          {label}
        </b>
      ))}
    </span>
  ),
  change: (
    <span className="pp-lp-art-change">
      <s>v1 · 2 revisions</s>
      <b>v2 · 3 revisions, +40 USD</b>
    </span>
  ),
  qa: (
    <span className="pp-lp-art-qa">
      <span>Is the source file included?</span>
      <b>Yes · agreement line 3</b>
    </span>
  ),
  agents: (
    <span className="pp-lp-art-agent">
      <code>request_send_invoice</code>
      <b>waiting for your code</b>
    </span>
  ),
  score: (
    <span className="pp-lp-art-score">
      <i />
      <b>84</b>
    </span>
  ),
};

/** Everything else in the box, one small moving tile each. */
export function Features() {
  return (
    <section id="features" className="pp-lp-features" aria-labelledby="pp-lp-features">
      <header data-reveal>
        <p className="pp-lp-kicker">Also in the box</p>
        <h2 id="pp-lp-features" className="pp-lp-display">
          The details <em>that save an afternoon.</em>
        </h2>
      </header>
      <ul>
        {FEATURES.map((feature, i) => (
          <li key={feature.id} data-feature={feature.id} data-reveal style={at(i)}>
            <span className="pp-lp-art" aria-hidden="true">
              {ART[feature.id]}
            </span>
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
