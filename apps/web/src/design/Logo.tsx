/**
 * PactPal's mark: two hands meeting in the shape of a heart, redrawn from the owner's sketch in
 * the product's own colours. The left hand and the last finger take the text colour, so the mark
 * also works on dark grounds.
 */
export function LogoMark() {
  return (
    <svg viewBox="55 65 875 730" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M435 158C400 125 345 82 285 82C240 82 205 105 175 135L120 190C85 225 66 265 68 310C70 365 100 420 135 462Z"
      />
      <path
        fill="var(--color-tape)"
        d="M845 462L650 268C625 243 590 243 565 265L440 372C415 393 380 385 362 360C345 337 350 308 370 290L590 105C625 78 665 72 705 78C745 84 775 100 800 125L885 210C905 232 915 265 915 305C915 365 885 420 845 462Z"
      />
      <path
        fill="var(--color-tape-deep)"
        d="M570 325C585 305 612 305 628 322L790 485C808 503 808 525 792 542L775 558C765 568 750 568 740 558L690 505C678 492 660 480 648 492C636 504 640 520 652 532L710 592C725 607 725 628 712 642L700 652C688 664 668 664 655 652L470 462C452 445 452 425 470 410Z"
      />
      <g fill="none" strokeWidth="76" strokeLinecap="round">
        <path stroke="var(--color-tape)" d="M212 515L300 428M302 605L398 512" />
        <path stroke="var(--color-tape-deep)" d="M398 685L497 592" />
        <path stroke="currentColor" d="M522 742L595 672" />
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
