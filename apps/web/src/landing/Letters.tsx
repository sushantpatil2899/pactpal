import type { CSSProperties } from "react";

/**
 * Text split into letters for a staggered entrance; `from` continues the count across pieces of
 * one heading. Screen readers get the heading's own label, so the letters are hidden from them.
 */
export function Letters({ text, from }: { text: string; from: number }) {
  return (
    <span className="pp-lp-letters" aria-hidden="true">
      {Array.from(text).map((letter, i) => (
        <span key={i} style={{ "--i": from + i } as CSSProperties}>
          {letter === " " ? "\u00a0" : letter}
        </span>
      ))}
    </span>
  );
}
