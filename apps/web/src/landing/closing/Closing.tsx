import type { CSSProperties } from "react";
import { SIGN_IN_PATH } from "../../api";
import { ButtonLink } from "../../design/parts";
import { LogoMark } from "../../design/Logo";
import { CONTACT } from "../../shell/contact";
import { FAQ, LIMITS, TAGLINE, revealWords } from "../landing-words";

const at = (i: number) => ({ "--i": i }) as CSSProperties;

/** A glyph for each of the limits, on a 20 by 20 grid. */
const LIMIT_GLYPHS = [
  "M10 2l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V5z", // record keeper: a shield
  "M10 3l1.6 4.4L16 9l-4.4 1.6L10 15l-1.6-4.4L4 9l4.4-1.6z", // AI drafts: a spark
  "M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM5 5l10 10", // no promises: a ban
  "M3 5h14v10H3zM6 9h4M6 12h6M13 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z", // an account: a card
  "M5 9h10v8H5zM7 9V6a3 3 0 0 1 6 0v3", // only the data it needs: a lock
  "M8 3h4M9 3v5l-5 8h12l-5-8V3", // test mode: a flask
];

/** The tagline, each word brightening in turn as it crosses the window. */
function Tagline() {
  const words = revealWords(TAGLINE);
  return (
    <section
      className="pp-lp-tagline pp-scope-dark"
      data-string="progress"
      aria-label="What PactPal promises"
    >
      <p style={{ "--n": words.length } as CSSProperties}>
        {words.map(({ word, i }) => (
          <span key={i} style={at(i)}>
            {word}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}

/**
 * The end of the page: the promise, what PactPal is and is not, the questions sellers ask, one
 * last sign in, and the wordmark. All in the vault, so the page closes as it opened.
 */
export function Closing() {
  return (
    <>
      <Tagline />
      <section id="trust" className="pp-lp-trust pp-scope-dark" aria-labelledby="pp-lp-trust">
        <header data-reveal>
          <p className="pp-lp-kicker">
            <i /> Trust and limits
          </p>
          <h2 id="pp-lp-trust" className="pp-lp-display">
            What PactPal is, <em>and what it is not.</em>
          </h2>
        </header>
        <ul className="pp-lp-limits">
          {LIMITS.map((limit, i) => (
            <li key={limit.title} data-reveal style={at(i)}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d={LIMIT_GLYPHS[i] ?? ""} />
              </svg>
              <h3>{limit.title}</h3>
              <p>{limit.body}</p>
            </li>
          ))}
        </ul>
      </section>
      <section id="faq" className="pp-lp-faq pp-scope-dark" aria-labelledby="pp-lp-faq">
        <header data-reveal>
          <p className="pp-lp-kicker">
            <i /> Questions
          </p>
          <h2 id="pp-lp-faq" className="pp-lp-display">
            Questions <em>sellers ask.</em>
          </h2>
          <p>
            Something else? Write to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </p>
        </header>
        <div className="pp-lp-faq-list">
          {FAQ.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="pp-lp-end pp-scope-dark" aria-labelledby="pp-lp-end">
        <div data-reveal>
          <h2 id="pp-lp-end" className="pp-lp-display">
            Keep the proof <em>from the first message.</em>
          </h2>
          <p>Sign in with the PayPal account you are paid through. Your buyers need no account.</p>
          <div className="pp-lp-actions">
            <ButtonLink look="primary" large href={SIGN_IN_PATH}>
              Sign in with PayPal
            </ButtonLink>
          </div>
        </div>
        <p className="pp-lp-wordmark" aria-hidden="true">
          <LogoMark className="pp-lp-wordmark-mark" />
          PactPal
        </p>
      </section>
    </>
  );
}
