import { useState, type CSSProperties } from "react";
import { NOT_YET, STICKERS, type StickerIcon } from "../landing-words";

/** Each trade's glyph, drawn on a 20 by 20 grid. */
const GLYPHS: Record<StickerIcon, string> = {
  pen: "M4 16l3-1 8-8-2-2-8 8zM13 5l2 2M4 16l1-3",
  film: "M3 4h14v12H3zM6 4v12M14 4v12M3 8h3M3 12h3M14 8h3M14 12h3",
  code: "M7 6l-4 4 4 4M13 6l4 4-4 4M11 4l-2 12",
  ring: "M10 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM8 3h4l1 3H7z",
  speech: "M3 4h11v8H8l-3 3v-3H3zM14 8h3v7h-2v2l-3-2H9",
  camera: "M3 7h3l2-2h4l2 2h3v9H3zM10 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  grid: "M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z",
  chart: "M3 17h14M5 14V9M9 14V5M13 14v-3M17 14V7",
  flame: "M10 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-8z",
};

/** Where each sticker floats, around the big line (desktop); how far it moves with scroll. */
const SPOTS: { x: string; y: string; r: number; depth: number }[] = [
  { x: "6%", y: "14%", r: -8, depth: 70 },
  { x: "74%", y: "9%", r: 6, depth: 110 },
  { x: "84%", y: "40%", r: -5, depth: 60 },
  { x: "3%", y: "58%", r: 7, depth: 90 },
  { x: "70%", y: "72%", r: -7, depth: 130 },
  { x: "26%", y: "80%", r: 4, depth: 80 },
  { x: "22%", y: "6%", r: 5, depth: 120 },
  { x: "48%", y: "86%", r: -3, depth: 50 },
  { x: "88%", y: "78%", r: 8, depth: 100 },
];

function Sticker({ sticker, i }: { sticker: (typeof STICKERS)[number]; i: number }) {
  const [flipped, setFlipped] = useState(false);
  const spot = SPOTS[i % SPOTS.length] ?? { x: "0", y: "0", r: 0, depth: 0 };
  return (
    <button
      type="button"
      className="pp-lp-sticker"
      aria-pressed={flipped}
      aria-label={`${sticker.trade}: ${sticker.deal}, ${sticker.amount}, ${sticker.steps}`}
      onClick={() => {
        setFlipped(!flipped);
      }}
      style={
        {
          "--x": spot.x,
          "--y": spot.y,
          "--r": `${String(spot.r)}deg`,
          "--depth": `${String(spot.depth)}px`,
          "--i": i,
        } as CSSProperties
      }
    >
      <span className="pp-lp-sticker-face" aria-hidden="true">
        <svg viewBox="0 0 20 20">
          <path d={GLYPHS[sticker.icon]} />
        </svg>
        {sticker.trade}
      </span>
      <span className="pp-lp-sticker-back" aria-hidden="true">
        <b>{sticker.deal}</b>
        <span>
          {sticker.amount} · {sticker.steps}
        </span>
      </span>
    </button>
  );
}

/**
 * Who PactPal is for, shown rather than listed: a poster line with the trades drifting around
 * it. Each sticker turns over (on hover, focus or tap) to the kind of deal that trade sends.
 */
export function Audience() {
  return (
    <section
      id="for"
      className="pp-lp-audience"
      data-string="progress"
      aria-labelledby="pp-lp-audience"
    >
      <div className="pp-lp-stickers">
        {STICKERS.map((sticker, i) => (
          <Sticker key={sticker.trade} sticker={sticker} i={i} />
        ))}
      </div>
      <div className="pp-lp-audience-copy">
        <p className="pp-lp-kicker">Who it's for</p>
        <h2 id="pp-lp-audience" className="pp-lp-display">
          Work agreed in a chat.
          <br />
          <em>Paid through PayPal.</em>
        </h2>
        <p>
          Freelancers, small studios and makers: anyone selling services, goods or digital products
          to buyers who pay through PayPal. Turn a sticker over to see the kind of deal it sends.
        </p>
        <small>Not yet supported: {NOT_YET.join(", ")}.</small>
      </div>
    </section>
  );
}
