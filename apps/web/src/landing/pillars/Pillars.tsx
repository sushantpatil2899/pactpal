import { BrandLogo } from "../../design/brand-logos";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PILLARS } from "../landing-words";
import { WarpGrid } from "../WarpGrid";

const at = (i: number) => ({ "--i": i }) as CSSProperties;

/** Chat lines on the left; a light is drawn from each to the term it became. */
function Draft() {
  return (
    <div className="pp-lp-v-draft">
      <ol>
        <li>L1 Cover by the 28th?</li>
        <li>L2 Two revisions, 600 in parts</li>
        <li>L3 Square version too</li>
      </ol>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 2 16 C 50 16, 50 16, 98 16" style={at(0)} />
        <path d="M 2 50 C 50 50, 50 50, 98 50" style={at(1)} />
        <path d="M 2 50 C 50 50, 50 84, 98 84" style={at(2)} />
      </svg>
      <ul>
        <li style={at(0)}>
          Due 28 Nov <b>L1</b>
        </li>
        <li style={at(1)}>
          2 revisions <b>L2</b>
        </li>
        <li style={at(2)}>
          600.00 USD <b>L2</b>
        </li>
      </ul>
    </div>
  );
}

/** A PayPal invoice for one stage, stamped paid, and the stages filling. */
function Paid() {
  return (
    <div className="pp-lp-v-paid">
      <p>
        <span>
          <BrandLogo name="paypal" color="#179bd7" /> PayPal invoice · stage 2 of 3
        </span>
        <b>200.00 USD</b>
      </p>
      <div className="pp-lp-v-status">
        <span>Sent</span>
        <span>Paid</span>
      </div>
      <i className="pp-lp-v-stamp">Paid</i>
      <ol>
        {[0, 1, 2].map((n) => (
          <li key={n} style={at(n)} />
        ))}
      </ol>
      <small>Recorded · PAYMENT_RECEIVED · e219…a7d3</small>
    </div>
  );
}

/** Blocks arriving one by one and locking onto the chain. */
function Sealed() {
  return (
    <div className="pp-lp-v-sealed">
      <ol>
        {["SIGNED", "PAID", "DELIVERED", "APPROVED"].map((event, i) => (
          <li key={event} style={at(i)}>
            <b>#{String(415 + i)}</b>
            <span>{event}</span>
          </li>
        ))}
      </ol>
      <small>sha256 c04d…5be8 ✓ chain intact</small>
    </div>
  );
}

const DEADLINE_S = 2 * 86_400 + 14 * 3600 + 3 * 60 + 59;

/** The respond-by countdown, ticking while it is on screen. */
function Countdown() {
  const [left, setLeft] = useState(DEADLINE_S);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setLeft((s) => (s > 0 ? s - 1 : DEADLINE_S));
    }, 1000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);
  const two = (n: number) => String(n).padStart(2, "0");
  return (
    <b>
      {Math.floor(left / 86_400)}d {two(Math.floor(left / 3600) % 24)}:
      {two(Math.floor(left / 60) % 60)}:{two(left % 60)}
    </b>
  );
}

/** A dispute's deadline counting down while the evidence packet stacks up. */
function Dispute() {
  return (
    <div className="pp-lp-v-dispute">
      <p>
        <span>Respond to PayPal in</span>
        <Countdown />
      </p>
      <ol>
        {["Signed agreement", "Approved cut list", "Delivery receipt"].map((name, i) => (
          <li key={name} style={at(i)}>
            <small>Exhibit {i + 1}</small>
            {name}
          </li>
        ))}
      </ol>
      <span className="pp-lp-v-ready">Packet ready · you confirm before it is sent</span>
    </div>
  );
}

const VISUALS: Record<(typeof PILLARS)[number]["id"], ReactNode> = {
  draft: <Draft />,
  paid: <Paid />,
  sealed: <Sealed />,
  dispute: <Dispute />,
  agent: <Agent />,
};

/** The agent asking, then waiting at the gate for the seller's code. */
function Agent() {
  return (
    <div className="pp-lp-v-agent">
      <small>
        <BrandLogo name="claude" />
        <BrandLogo name="cursor" color="#eef2f6" />
        your assistant
      </small>
      <code>
        <b>›</b> list_deals <span>7 deals</span>
      </code>
      <code>
        <b>›</b> draft_evidence_packet <span>built</span>
      </code>
      <code>
        <b>›</b> request_send_evidence <span>waiting</span>
      </code>
      <p>
        <i />
        Waiting for your code
      </p>
    </div>
  );
}

/**
 * The five things PactPal gives, each shown working, before anything is explained: one row on
 * wide screens, a row that scrolls card by card on narrower ones.
 */
export function Pillars() {
  const row = useRef<HTMLDivElement>(null);
  // Which ends of the row can still be scrolled to; both false when all five fit.
  const [ends, setEnds] = useState({ back: false, on: false });
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const measure = () => {
      setEnds({
        back: el.scrollLeft > 4,
        on: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      });
    };
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const sized = new ResizeObserver(measure);
    sized.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      sized.disconnect();
    };
  }, []);
  const step = (direction: 1 | -1) => {
    const el = row.current;
    const card = el?.querySelector<HTMLElement>(".pp-lp-pillar");
    if (!el || !card) return;
    el.scrollBy({ left: direction * (card.offsetWidth + 24), behavior: "smooth" });
  };
  return (
    <section id="get" className="pp-lp-pillars pp-scope-dark" aria-labelledby="pp-lp-pillars">
      <header data-reveal>
        <p className="pp-lp-kicker">
          <i /> What you get
        </p>
        <h2 id="pp-lp-pillars" className="pp-lp-display">
          Five things, <em>from the first message.</em>
        </h2>
      </header>
      <div className="pp-lp-pillar-rail" data-back={ends.back} data-on={ends.on}>
        <button
          type="button"
          className="pp-lp-pillar-step"
          data-dir="back"
          aria-label="Previous cards"
          disabled={!ends.back}
          onClick={() => {
            step(-1);
          }}
        >
          ←
        </button>
        <button
          type="button"
          className="pp-lp-pillar-step"
          data-dir="on"
          aria-label="Next cards"
          disabled={!ends.on}
          onClick={() => {
            step(1);
          }}
        >
          →
        </button>
        <div ref={row} className="pp-lp-pillar-grid">
          {PILLARS.map((pillar, i) => (
            <a
              key={pillar.id}
              href={pillar.link}
              className="pp-lp-pillar"
              data-pillar={pillar.id}
              data-reveal
              style={at(i)}
            >
              <div className="pp-lp-pillar-frame" aria-hidden="true">
                <WarpGrid />
                <div className="pp-lp-pillar-screen">{VISUALS[pillar.id]}</div>
              </div>
              <span className="pp-lp-pillar-n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
              <span className="pp-lp-pillar-more">See how it works →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
