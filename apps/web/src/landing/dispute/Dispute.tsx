import type { CSSProperties } from "react";
import { CLAIM, revealWords } from "../landing-words";

/** Where each loose word drifts as the claim comes apart: the same every visit. */
const drift = (i: number) =>
  ({
    "--dx": `${String(Math.round(Math.sin(i * 2.3) * 42))}vw`,
    "--dy": `${String(Math.round(Math.cos(i * 1.7) * 28 - 10))}vh`,
    "--rot": `${String(Math.round(Math.sin(i * 3.1) * 40))}deg`,
  }) as CSSProperties;

/**
 * A dispute, worked through as you scroll: the buyer's claim comes apart word by word until only
 * its three statements are left, and each lands beside what the record holds, or beside
 * "No record covers this".
 */
export function Dispute() {
  const words = revealWords(CLAIM.text);
  const partOf = (i: number) =>
    CLAIM.parts.findIndex((part) => (part.words as readonly number[]).includes(i));
  return (
    <section className="pp-lp-dispute" data-string="progress" aria-labelledby="pp-lp-dispute">
      <div className="pp-lp-dispute-pin">
        <header>
          <p className="pp-lp-kicker">
            <i /> If a buyer disputes
          </p>
          <h2 id="pp-lp-dispute" className="pp-lp-display">
            Every claim, <em>checked against the record.</em>
          </h2>
        </header>
        <blockquote className="pp-lp-claim" aria-label={`The buyer's claim: ${CLAIM.text}`}>
          {words.map(({ word, i }) => {
            const part = partOf(i);
            return (
              <span
                key={i}
                aria-hidden="true"
                data-part={part === -1 ? undefined : part}
                style={part === -1 ? drift(i) : undefined}
              >
                {word}{" "}
              </span>
            );
          })}
        </blockquote>
        <ol className="pp-lp-matches">
          {CLAIM.parts.map((part, i) => (
            <li
              key={part.said}
              style={{ "--i": i } as CSSProperties}
              data-found={part.found.length > 0}
            >
              <q>{part.said}</q>
              <span className="pp-lp-match-arrow" aria-hidden="true" />
              <div>
                {part.found.length === 0 ? (
                  <b>No record covers this</b>
                ) : (
                  part.found.map((line) => <span key={line}>{line}</span>)
                )}
              </div>
            </li>
          ))}
        </ol>
        <p className="pp-lp-dispute-foot">
          <span>Respond by 13 Nov, 18:00 · 2 days left</span>
          <span>Evidence packet · 4 exhibits · you confirm before it is sent</span>
          <span>An appeal is drafted only if there is evidence PayPal has not seen</span>
        </p>
      </div>
    </section>
  );
}
