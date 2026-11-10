import { useId } from "react";

/**
 * PactPal's mark: two hands meeting in the shape of a heart, redrawn from the owner's sketch in
 * the product's own colours (greens for the hands, violet for the last finger).
 */
export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  const paint = (name: string) => `url(#${id}${name})`;
  return (
    <svg viewBox="55 65 875 730" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22c997" />
          <stop offset="1" stopColor="#0b8f8c" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a6b5f" />
          <stop offset="1" stopColor="#0d4f5a" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8f81ff" />
          <stop offset="1" stopColor="#6d5cf6" />
        </linearGradient>
      </defs>
      <path
        fill={paint("b")}
        d="M435 158C400 125 345 82 285 82C240 82 205 105 175 135L120 190C85 225 66 265 68 310C70 365 100 420 135 462Z"
      />
      <path
        fill={paint("a")}
        d="M845 462L650 268C625 243 590 243 565 265L440 372C415 393 380 385 362 360C345 337 350 308 370 290L590 105C625 78 665 72 705 78C745 84 775 100 800 125L885 210C905 232 915 265 915 305C915 365 885 420 845 462Z"
      />
      <path
        fill={paint("b")}
        d="M570 325C585 305 612 305 628 322L790 485C808 503 808 525 792 542L775 558C765 568 750 568 740 558L690 505C678 492 660 480 648 492C636 504 640 520 652 532L710 592C725 607 725 628 712 642L700 652C688 664 668 664 655 652L470 462C452 445 452 425 470 410Z"
      />
      <g fill="none" strokeWidth="76" strokeLinecap="round">
        <path stroke={paint("a")} d="M212 515L300 428M302 605L398 512" />
        <path stroke={paint("b")} d="M398 685L497 592" />
        <path stroke={paint("c")} d="M522 742L595 672" />
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
