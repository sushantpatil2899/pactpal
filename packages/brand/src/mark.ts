/**
 * PactPal's mark: two hands meeting in the shape of a heart, redrawn from the owner's sketch in
 * the product's own colours (greens for the hands, violet for the last finger). Kept as data so
 * the website (React) and the help site (static HTML) draw the same mark.
 */
export const MARK_VIEWBOX = "55 65 875 730";

export type MarkPaint = "a" | "b" | "c";

export const MARK_GRADIENTS: Record<MarkPaint, readonly [string, string]> = {
  a: ["#22c997", "#0b8f8c"],
  b: ["#0a6b5f", "#0d4f5a"],
  c: ["#8f81ff", "#6d5cf6"],
};

/** The palm shapes, filled. */
export const MARK_FILLS: readonly { paint: MarkPaint; d: string }[] = [
  {
    paint: "b",
    d: "M435 158C400 125 345 82 285 82C240 82 205 105 175 135L120 190C85 225 66 265 68 310C70 365 100 420 135 462Z",
  },
  {
    paint: "a",
    d: "M845 462L650 268C625 243 590 243 565 265L440 372C415 393 380 385 362 360C345 337 350 308 370 290L590 105C625 78 665 72 705 78C745 84 775 100 800 125L885 210C905 232 915 265 915 305C915 365 885 420 845 462Z",
  },
  {
    paint: "b",
    d: "M570 325C585 305 612 305 628 322L790 485C808 503 808 525 792 542L775 558C765 568 750 568 740 558L690 505C678 492 660 480 648 492C636 504 640 520 652 532L710 592C725 607 725 628 712 642L700 652C688 664 668 664 655 652L470 462C452 445 452 425 470 410Z",
  },
];

/** The fingers, drawn as thick round strokes. */
export const MARK_STROKES: readonly { paint: MarkPaint; d: string }[] = [
  { paint: "a", d: "M212 515L300 428M302 605L398 512" },
  { paint: "b", d: "M398 685L497 592" },
  { paint: "c", d: "M522 742L595 672" },
];

export const MARK_STROKE_WIDTH = 76;

/** The mark as SVG markup, for pages written without React. `id` keeps gradient ids unique. */
export function markSvg(id = "pp-mark"): string {
  const paint = (name: MarkPaint) => `url(#${id}${name})`;
  const gradients = Object.entries(MARK_GRADIENTS)
    .map(
      ([name, [from, to]]) =>
        `<linearGradient id="${id}${name}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>`,
    )
    .join("");
  const fills = MARK_FILLS.map((f) => `<path fill="${paint(f.paint)}" d="${f.d}"/>`).join("");
  const strokes = MARK_STROKES.map((s) => `<path stroke="${paint(s.paint)}" d="${s.d}"/>`).join("");
  return `<svg viewBox="${MARK_VIEWBOX}" aria-hidden="true" focusable="false"><defs>${gradients}</defs>${fills}<g fill="none" stroke-width="${String(MARK_STROKE_WIDTH)}" stroke-linecap="round">${strokes}</g></svg>`;
}
