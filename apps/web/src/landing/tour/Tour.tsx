import type { CSSProperties } from "react";
import { BUYER_STEPS, TOUR } from "../landing-words";
import { useActiveStep } from "../useActiveStep";
import buyer from "./shots/buyer.webp";
import dashboard from "./shots/dashboard.webp";
import deadlines from "./shots/deadlines.webp";
import deal from "./shots/deal.webp";
import deals from "./shots/deals.webp";
import dispute from "./shots/dispute.webp";
import insights from "./shots/insights.webp";
import messages from "./shots/messages.webp";
import reminders from "./shots/reminders.webp";

const SHOTS: Record<(typeof TOUR)[number]["id"], string> = {
  dashboard,
  deal,
  messages,
  reminders,
  deadlines,
  dispute,
  deals,
  insights,
};

/**
 * The product itself: real screens of the app (with invented deals), in a window that settles
 * from a tilt as you arrive. The list on the left scrolls; the window holds still and changes
 * screen as each item crosses the middle, with notes pointing at what matters.
 */
export function Tour() {
  const { active, track } = useActiveStep(TOUR.length);
  const stop = TOUR[active] ?? TOUR[0];
  return (
    <>
      <section
        id="app"
        className="pp-lp-tour pp-scope-dark"
        data-string="progress"
        aria-labelledby="pp-lp-tour"
      >
        <div className="pp-lp-tour-list">
          <header>
            <p className="pp-lp-kicker">
              <i /> The product
            </p>
            <h2 id="pp-lp-tour" className="pp-lp-display">
              One place <em>for every deal.</em>
            </h2>
          </header>
          {TOUR.map((item, i) => (
            <article key={item.id} ref={track(i)} data-active={i === active}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <img
                className="pp-lp-tour-inline"
                src={SHOTS[item.id]}
                alt={`The ${item.title} screen`}
                loading="lazy"
                width={1440}
                height={900}
              />
            </article>
          ))}
        </div>
        <div className="pp-lp-tour-stage">
          <figure className="pp-lp-window" aria-label={`The ${stop.title} screen`}>
            <div className="pp-lp-window-bar" aria-hidden="true">
              <i />
              <i />
              <i />
              <span>{stop.url}</span>
            </div>
            <div className="pp-lp-window-screen">
              {TOUR.map((item, i) => (
                <img
                  key={item.id}
                  src={SHOTS[item.id]}
                  alt=""
                  data-active={i === active}
                  loading="lazy"
                  width={1440}
                  height={900}
                />
              ))}
              {TOUR.map((item, i) =>
                item.notes.map((note, n) => (
                  <span
                    key={`${item.id}-${note.text}`}
                    className="pp-lp-note"
                    data-active={i === active}
                    aria-hidden="true"
                    style={
                      {
                        "--x": `${String(note.x)}%`,
                        "--y": `${String(note.y)}%`,
                        "--n": n,
                      } as CSSProperties
                    }
                  >
                    {note.text}
                  </span>
                )),
              )}
            </div>
          </figure>
        </div>
      </section>
      <section id="buyer" className="pp-lp-buyer" aria-labelledby="pp-lp-buyer">
        <div className="pp-lp-phone" aria-hidden="true">
          <div>
            <img src={buyer} alt="" loading="lazy" width={390} height={3070} />
          </div>
        </div>
        <div data-reveal>
          <p className="pp-lp-kicker">For your buyer</p>
          <h2 id="pp-lp-buyer" className="pp-lp-display">
            No account. <em>One link.</em>
          </h2>
          <ol>
            {BUYER_STEPS.map((step, i) => (
              <li key={step} style={{ "--i": i } as CSSProperties}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
