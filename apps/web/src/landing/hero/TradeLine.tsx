import { useEffect, useRef, useState } from "react";
import { TRADES } from "../landing-words";

const HOLD_MS = 2400;
const SCRAMBLE_MS = 520;
const GLYPHS = "abcdefghijklmnopqrstuvwxyz";

/** `to` with its letters still being found: settled letters from the left, the rest random. */
function scrambled(to: string, progress: number): string {
  const settled = Math.floor(to.length * progress);
  return Array.from(to, (char, i) =>
    i < settled || char === " "
      ? char
      : (GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? char),
  ).join("");
}

/**
 * "Paid through PayPal, built for the logo designer": the trade changes every few seconds, its
 * letters scrambling into the next one. The trade ends the line so nothing after it moves, and its
 * box eases to the new word's width, measured on a hidden copy, instead of following each
 * scrambled frame. Screen readers get one plain sentence instead.
 */
export function TradeLine() {
  const [shown, setShown] = useState<string>(TRADES[0]);
  const [target, setTarget] = useState<string>(TRADES[0]);
  const [width, setWidth] = useState<number | null>(null);
  const ghost = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ghost.current;
    if (!el) return;
    const measure = new ResizeObserver(() => {
      setWidth(el.getBoundingClientRect().width);
    });
    measure.observe(el);
    return () => {
      measure.disconnect();
    };
  }, []);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 0;
    let frame = 0;
    const timer = window.setInterval(() => {
      n = (n + 1) % TRADES.length;
      const to = TRADES[n] ?? TRADES[0];
      setTarget(to);
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / SCRAMBLE_MS, 1);
        setShown(progress < 1 ? scrambled(to, progress) : to);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, HOLD_MS);
    return () => {
      window.clearInterval(timer);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <p className="pp-lp-for">
      <span className="pp-hidden">
        Paid through PayPal, built for freelancers, studios and makers.
      </span>
      <span aria-hidden="true">
        Paid through PayPal, built for the{" "}
        <b style={width === null ? undefined : { width }}>
          <span>{shown}</span>
        </b>
        <b ref={ghost} className="pp-lp-for-ghost">
          {target}
        </b>
      </span>
    </p>
  );
}
