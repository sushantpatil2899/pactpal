import { SignInButton } from "../SignInButton";
import { useEffect, useRef, type RefObject } from "react";
import { Letters } from "../Letters";
import { HERO, TICKER } from "../landing-words";
import { TradeLine } from "./TradeLine";
import type { ChainScene } from "./chain-scene";

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Mounts the 3D chain behind the hero once the page has shown: loaded on its own, running only
 * while the hero is on screen and the tab is visible, and drawn once, still, with reduced motion.
 */
function useChainScene(canvasRef: RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return;
    let scene: ChainScene | undefined;
    let gone = false;
    let seen = false;
    let frame = 0;
    const reduced = window.matchMedia(REDUCED).matches;
    const size = new ResizeObserver(() => {
      scene?.resize(canvas.clientWidth, canvas.clientHeight);
      if (reduced) scene?.still();
    });
    const run = () => {
      if (!scene || reduced) return;
      if (seen && !document.hidden) scene.play();
      else scene.stop();
    };
    const view = new IntersectionObserver(([entry]) => {
      seen = entry?.isIntersecting ?? false;
      run();
    });
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = hero.getBoundingClientRect();
        scene?.setScroll(Math.min(Math.max(-box.top / box.height, 0), 1));
      });
    };
    const onPointer = (event: PointerEvent) => {
      scene?.setPointer(
        (event.clientX / innerWidth) * 2 - 1,
        -((event.clientY / innerHeight) * 2 - 1),
      );
    };
    void import("./chain-scene").then(({ ChainScene: Scene }) => {
      if (gone) return;
      try {
        scene = new Scene(canvas);
      } catch {
        return; // No WebGL: the hero's own background stands in.
      }
      hero.dataset.scene = "ready";
      scene.resize(canvas.clientWidth, canvas.clientHeight);
      if (reduced) scene.still();
      size.observe(canvas);
      view.observe(hero);
      document.addEventListener("visibilitychange", run);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointermove", onPointer, { passive: true });
    });
    return () => {
      gone = true;
      cancelAnimationFrame(frame);
      size.disconnect();
      view.disconnect();
      document.removeEventListener("visibilitychange", run);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      scene?.dispose();
    };
  }, [canvasRef]);
}

/** The ledger's newest entries, running past at the foot of the hero. */
function Ticker() {
  const rows = [...TICKER, ...TICKER];
  return (
    <div className="pp-lp-ticker" aria-hidden="true">
      <div>
        {rows.map((row, i) => (
          <span key={i}>
            <i />
            <b>#{String(398 + (i % TICKER.length)).padStart(4, "0")}</b> {row.event}
            <small>{row.detail}</small>
            <code>{row.hash}</code>
          </span>
        ))}
      </div>
    </div>
  );
}

/** The hero: the promise, one action, and the chain being forged behind them. */
export function Hero({ problem }: { problem?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useChainScene(canvas);
  return (
    <section className="pp-lp-hero pp-scope-dark" aria-labelledby="pp-lp-title">
      <canvas ref={canvas} className="pp-lp-canvas" aria-hidden="true" />
      <div className="pp-lp-hero-copy">
        {problem !== undefined && (
          <p role="alert" data-tone="problem">
            {problem}
          </p>
        )}
        <p className="pp-lp-kicker">
          <i /> Agreements, payments and proof for every deal
        </p>
        <h1 id="pp-lp-title" aria-label="AI that seals the deal.">
          <Letters text="AI that" from={0} />{" "}
          <span className="pp-lp-mark">
            <Letters text="seals" from={7} />
          </span>
          <br />
          <Letters text="the deal." from={12} />
        </h1>
        <TradeLine />
        <p className="pp-lp-lede">{HERO.lede}</p>
        <div className="pp-lp-actions">
          <SignInButton large />
        </div>
      </div>
      <ul className="pp-lp-tags" aria-hidden="true">
        <li data-tone="ai">Council voting · 5 models</li>
        <li>Sealed · SHA-256</li>
        <li data-tone="money">Invoice paid · PayPal</li>
      </ul>
      <Ticker />
    </section>
  );
}
