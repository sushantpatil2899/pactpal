import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SIGN_IN_PATH } from "../api";
import { ButtonLink } from "../design/parts";
import { Logo } from "../design/Logo";
import { Footer } from "../shell/layouts";
import { Council } from "./council/Council";
import { Hero } from "./hero/Hero";
import { FAQ, LIMITS, TAGLINE, revealWords } from "./landing-words";
import { Ledger } from "./ledger/Ledger";
import { Audience } from "./audience/Audience";
import { Moves } from "./moves/Moves";
import { Pillars } from "./pillars/Pillars";
import { useScrollStory } from "./useScrollStory";
import "../deal/deal.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./landing.css";
import "./slice.css";
import "./slice2.css";

const NAV = [
  { href: "#get", label: "What you get" },
  { href: "#how", label: "How it works" },
  { href: "#council", label: "AI council" },
  { href: "#trust", label: "Trust" },
  { href: "#faq", label: "FAQ" },
];

const signIn = (large = false) => (
  <ButtonLink look="primary" large={large} href={SIGN_IN_PATH}>
    Sign in with PayPal
  </ButtonLink>
);

/** The bar that floats over the page, shrinking once the hero has scrolled away. */
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const top = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const marker = top.current;
    if (!marker) return;
    const watch = new IntersectionObserver(([entry]) => {
      setScrolled(entry?.isIntersecting === false);
    });
    watch.observe(marker);
    return () => {
      watch.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const close = () => {
    setOpen(false);
  };
  return (
    <>
      <span ref={top} className="pp-lp-top" aria-hidden="true" />
      <header className="pp-lp-nav" data-scrolled={scrolled} data-open={open}>
        <Logo />
        <nav aria-label="Sections" id="pp-lp-menu">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={close}
              style={{ "--i": i } as CSSProperties}
            >
              {item.label}
            </a>
          ))}
        </nav>
        {signIn()}
        <button
          type="button"
          className="pp-lp-toggle"
          aria-expanded={open}
          aria-controls="pp-lp-menu"
          aria-label={open ? "Close the menu" : "Open the menu"}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <i />
          <i />
        </button>
      </header>
    </>
  );
}

/** The tagline, each word brightening in turn as it scrolls through the window. */
function Tagline() {
  const words = revealWords(TAGLINE);
  return (
    <section className="pp-lp-tagline" data-string="progress" aria-label="What PactPal promises">
      <p style={{ "--n": words.length } as CSSProperties}>
        {words.map(({ word, i }) => (
          <span key={i} style={{ "--i": i } as CSSProperties}>
            {word}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}

/**
 * The public landing page (`/` when signed out): one story, told as one deal unfolding down the
 * page, with one action: sign in with PayPal. Loaded only for visitors who are signed out.
 */
export function Landing({ problem }: { problem?: string }) {
  useScrollStory();
  return (
    <div className="pp-lp">
      <a className="pp-skip" href="#content">
        Skip to the content
      </a>
      <Nav />
      <main id="content">
        <Hero problem={problem} />
        <Pillars />
        <Audience />
        <Moves />
        <Council />
        <Ledger />

        <Tagline />

        <section id="trust" className="pp-lp-band" aria-labelledby="pp-lp-trust" data-reveal>
          <h2 id="pp-lp-trust">What PactPal is, and what it is not</h2>
          <div className="pp-lp-limits">
            {LIMITS.map((limit) => (
              <div key={limit.title}>
                <h3>{limit.title}</h3>
                <p>{limit.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="pp-lp-band" aria-labelledby="pp-lp-faq">
          <h2 id="pp-lp-faq">Questions sellers ask</h2>
          <div className="pp-lp-faq">
            {FAQ.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="pp-lp-end" aria-labelledby="pp-lp-end" data-reveal>
          <h2 id="pp-lp-end">Keep the proof from the first message.</h2>
          <p>Sign in with the PayPal account you are paid through. Your buyers need no account.</p>
          {signIn(true)}
        </section>
      </main>
      <Footer links />
    </div>
  );
}
