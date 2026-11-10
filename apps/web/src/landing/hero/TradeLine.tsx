import { useEffect, useState } from "react";
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
 * "For the logo designer paid through PayPal": the trade changes every few seconds, its letters
 * scrambling into the next one. Screen readers get one plain sentence instead.
 */
export function TradeLine() {
  const [shown, setShown] = useState<string>(TRADES[0]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 0;
    let frame = 0;
    const timer = window.setInterval(() => {
      n = (n + 1) % TRADES.length;
      const to = TRADES[n] ?? TRADES[0];
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
        For freelancers, studios and makers who are paid through PayPal.
      </span>
      <span aria-hidden="true">
        For the <b>{shown}</b> paid through PayPal.
      </span>
    </p>
  );
}
