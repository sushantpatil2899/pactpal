/**
 * PactPal's design tokens (docs/DESIGN.md), declared once. They reach the stylesheets as CSS
 * custom properties (`--color-ink`), written to the page before anything is drawn.
 */
export const TOKENS = {
  "color-label": "#f3f4ef",
  "color-label-white": "#ffffff",
  "color-kraft": "#b98e5e",
  "color-kraft-deep": "#7a5830",
  "color-ink": "#0b0c0a",
  "color-ink-soft": "#4a4e47",
  "color-rule": "#c9ccc2",
  "color-tape": "#0b8f5c",
  "color-tape-deep": "#086b45",
  "color-void": "#ff5a1f",
  "color-void-deep": "#b93a0c",
  "color-amber": "#8a5a00",
  "color-amber-wash": "#fbe9b8",
  "font-text": '"Archivo Variable", "Helvetica Neue", Arial, sans-serif',
  "font-mono": '"Martian Mono Variable", ui-monospace, Menlo, monospace',
  "text-13": "0.8125rem",
  "text-15": "0.9375rem",
  "text-17": "1.0625rem",
  "text-20": "1.25rem",
  "text-24": "1.5rem",
  "text-32": "2rem",
  "text-44": "2.75rem",
  "text-64": "4rem",
  "text-96": "6rem",
  "space-4": "0.25rem",
  "space-8": "0.5rem",
  "space-12": "0.75rem",
  "space-16": "1rem",
  "space-24": "1.5rem",
  "space-32": "2rem",
  "space-48": "3rem",
  "space-64": "4rem",
  "space-96": "6rem",
  "space-128": "8rem",
  "rule-label": "3px",
  "rule-thin": "1px",
  "radius-work": "2px",
  "shadow-overlay": "0 8px 24px rgb(11 12 10 / 0.16)",
  "time-fast": "120ms",
  "time-base": "200ms",
  "time-slow": "320ms",
  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export type TokenName = keyof typeof TOKENS;

/** A token as a CSS value, for the few styles set from code: `token("color-tape")`. */
export const token = (name: TokenName): string => `var(--${name})`;

/** Every token as one `:root` rule. */
export function tokenCss(): string {
  const lines = Object.entries(TOKENS).map(([name, value]) => `--${name}:${value};`);
  return `:root{${lines.join("")}}`;
}

/** Writes the tokens to the page; call once, before the first render. */
export function applyTokens(page: Document): void {
  const style = page.createElement("style");
  style.dataset.tokens = "";
  style.textContent = tokenCss();
  page.head.append(style);
}
