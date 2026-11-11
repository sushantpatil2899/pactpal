import {
  MARK_FILLS,
  MARK_GRADIENTS,
  MARK_STROKES,
  MARK_STROKE_WIDTH,
  MARK_VIEWBOX,
  type MarkPaint,
} from "@pactpal/brand";
import { useId } from "react";

/** PactPal's mark (drawn from `@pactpal/brand`, the same data the help site uses). */
export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  const paint = (name: MarkPaint) => `url(#${id}${name})`;
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} aria-hidden="true" focusable="false">
      <defs>
        {Object.entries(MARK_GRADIENTS).map(([name, [from, to]]) => (
          <linearGradient key={name} id={`${id}${name}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        ))}
      </defs>
      {MARK_FILLS.map((fill) => (
        <path key={fill.d} fill={paint(fill.paint)} d={fill.d} />
      ))}
      <g fill="none" strokeWidth={MARK_STROKE_WIDTH} strokeLinecap="round">
        {MARK_STROKES.map((stroke) => (
          <path key={stroke.d} stroke={paint(stroke.paint)} d={stroke.d} />
        ))}
      </g>
    </svg>
  );
}

/** The mark with the name, linking home. */
export function Logo() {
  return (
    <a className="pp-logo" href="/">
      <LogoMark />
      PactPal
    </a>
  );
}
