import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SIGN_IN_PATH } from "../api";
import { ButtonLink } from "../design/parts";
import { Logo } from "../design/Logo";
import { Footer } from "../shell/layouts";
import { AUDIENCE, FAQ, HERO, LIMITS, STORY, TAGLINE, revealWords } from "./landing-words";
import { HeroScene, SCENES } from "./scenes";
import { useScrollStory } from "./useScrollStory";
import "../deal/deal.css";
import "./landing.css";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#get", label: "What you get" },
  { href: "#trust", label: "Trust and limits" },
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
        <section className="pp-lp-hero" aria-labelledby="pp-lp-title">
          <div>
            {problem !== undefined && (
              <p role="alert" data-tone="problem">
                {problem}
              </p>
            )}
            <h1 id="pp-lp-title">
              {HERO.title[0]}
              <br />
              {HERO.title[1]}
            </h1>
            <p className="pp-lp-lede">{HERO.lede}</p>
            <div className="pp-lp-actions">{signIn(true)}</div>
            <ul className="pp-lp-facts">
              {HERO.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
          <HeroScene />
        </section>

        <div className="pp-lp-story" data-string="progress">
          <span className="pp-lp-thread" aria-hidden="true" />
          {STORY.map((step) => {
            const Scene = SCENES[step.id];
            return (
              <section
                key={step.id}
                id={step.anchor}
                className="pp-lp-step"
                data-scene={step.id}
                data-string="progress"
                aria-labelledby={`pp-lp-${step.id}`}
              >
                <div className="pp-lp-text" data-reveal>
                  <p className="pp-lp-eyebrow">{step.eyebrow}</p>
                  <h2 id={`pp-lp-${step.id}`}>{step.title}</h2>
                  <p>{step.body}</p>
                  {step.points && (
                    <ul>
                      {step.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="pp-lp-stage" data-reveal>
                  <Scene />
                </div>
              </section>
            );
          })}
        </div>

        <Tagline />

        <section className="pp-lp-band" aria-labelledby="pp-lp-who" data-reveal>
          <h2 id="pp-lp-who">Made for work agreed in a conversation</h2>
          <ul className="pp-lp-chips">
            {AUDIENCE.fits.map((fit) => (
              <li key={fit}>{fit}</li>
            ))}
          </ul>
          <p>
            <b>Not supported yet:</b> {AUDIENCE.notYet.join(", ").toLowerCase()}.
          </p>
        </section>

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
