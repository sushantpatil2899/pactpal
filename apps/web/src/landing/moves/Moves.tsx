import type { CSSProperties, ReactNode } from "react";
import { MOVES } from "../landing-words";

const at = (i: number) => ({ "--i": i }) as CSSProperties;

/** Small product views for each move, made from the same look as the app. */
const SHOTS: Record<(typeof MOVES)[number]["id"], ReactNode> = {
  capture: (
    <div className="pp-lp-shot pp-lp-shot-capture">
      {["Pasted chat", "Screenshot", "Forwarded email", "Live chat"].map((source, i) => (
        <span key={source} style={at(i)}>
          {source}
        </span>
      ))}
      <b>Book cover · 214 messages kept</b>
    </div>
  ),
  agree: (
    <div className="pp-lp-shot pp-lp-shot-agree">
      <small>Terms to agree to · version 2</small>
      <p>
        <span>Total</span>
        <b>600.00 USD in 3 parts</b>
      </p>
      <div>
        <i>Chris Okafor</i>
        <b>I agree and sign</b>
      </div>
    </div>
  ),
  paid: (
    <div className="pp-lp-shot pp-lp-shot-paid">
      {[
        ["Deposit", "Paid"],
        ["Sketch approved", "Invoice sent"],
        ["Final files", "Reminder in 2 days"],
      ].map(([stage, state], i) => (
        <p key={stage} style={at(i)}>
          <span>{stage}</span>
          <b>{state}</b>
        </p>
      ))}
    </div>
  ),
  deliver: (
    <div className="pp-lp-shot pp-lp-shot-deliver">
      <b>cover-final.pdf</b>
      <p>
        <span>Opened</span>
        <b>2 times</b>
      </p>
      <p>
        <span>Revision rounds</span>
        <b>1 of 2 used</b>
      </p>
      <i>Approved by Chris</i>
    </div>
  ),
  protected: (
    <div className="pp-lp-shot pp-lp-shot-protected">
      <small>Dispute · not as described</small>
      <b>Respond in 2 days</b>
      <p>
        <span>“Cover is the wrong size”</span>
        <i>Covered by line 4</i>
      </p>
      <p>
        <span>“You promised a back cover”</span>
        <i data-tone="gap">No record covers this</i>
      </p>
    </div>
  ),
};

/**
 * How a deal goes, in five moves: the section holds still while the moves slide past sideways
 * (on wide screens), with their words drifting slower behind them. On phones they simply stack.
 */
export function Moves() {
  return (
    <section id="how" className="pp-lp-moves" data-string="progress" aria-labelledby="pp-lp-moves">
      <div className="pp-lp-moves-pin">
        <header>
          <p className="pp-lp-kicker">
            <i /> How it works
          </p>
          <h2 id="pp-lp-moves" className="pp-lp-display">
            Five moves, <em>one record.</em>
          </h2>
        </header>
        <p className="pp-lp-moves-words" aria-hidden="true">
          {MOVES.map((move) => move.word).join(" · ")}
        </p>
        <ol className="pp-lp-moves-track">
          {MOVES.map((move, i) => (
            <li key={move.id} id={`move-${move.id}`} style={at(i)}>
              <span className="pp-lp-move-n">
                {String(i + 1).padStart(2, "0")} · {move.word}
              </span>
              <h3>{move.title}</h3>
              <p>{move.body}</p>
              <div aria-hidden="true">{SHOTS[move.id]}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
