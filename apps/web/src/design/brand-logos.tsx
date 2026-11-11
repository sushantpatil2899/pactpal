import { siClaude, siCursor, siPaypal } from "simple-icons";

/**
 * Other companies' logos, from simple-icons (CC0), used factually: PayPal, which sellers are paid
 * through, and the AI assistants that connect to PactPal (owner, 11 Nov 2026).
 */
const LOGOS = { claude: siClaude, cursor: siCursor, paypal: siPaypal } as const;

export type BrandName = keyof typeof LOGOS;

/** A company's logo in its own colour, or in `color` (such as "currentColor" on a button). */
export function BrandLogo({
  name,
  color,
  className,
  title = false,
}: {
  name: BrandName;
  color?: string;
  className?: string;
  /** Name it for screen readers; otherwise it is decoration beside words that say it. */
  title?: boolean;
}) {
  const logo = LOGOS[name];
  return (
    <svg
      viewBox="0 0 24 24"
      className={["pp-brand-logo", className].filter(Boolean).join(" ")}
      {...(title ? { role: "img", "aria-label": logo.title } : { "aria-hidden": true })}
      focusable="false"
    >
      <path d={logo.path} fill={color ?? `#${logo.hex}`} />
    </svg>
  );
}
