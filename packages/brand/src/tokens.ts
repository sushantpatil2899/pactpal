/**
 * PactPal's design tokens (docs/DESIGN.md), declared once. They reach the stylesheets as CSS
 * custom properties (`--color-ink`), written to the page before anything is drawn. Colours come
 * in a light and a dark set; everything else is shared.
 */
export const LIGHT = {
  "color-bg": "#f4f6f8",
  "color-bg-sunk": "#eceff3",
  "color-surface": "#ffffff",
  "color-surface-2": "#f8fafb",
  "color-line": "rgb(15 23 32 / 0.08)",
  "color-line-strong": "rgb(15 23 32 / 0.16)",
  "color-ink": "#0d1219",
  "color-ink-2": "#4a5564",
  "color-ink-3": "#5f6b7c",
  // Bright greens draw progress and marks; the strong pair carries text on buttons.
  "color-accent": "#0fa97a",
  "color-accent-2": "#0b8f8c",
  "color-accent-strong": "#088060",
  "color-accent-strong-2": "#07727a",
  "color-on-accent": "#ffffff",
  "color-accent-ink": "#087a58",
  // Violet marks what the AI drafted.
  "color-ai": "#6d5cf6",
  "color-on-ai": "#ffffff",
  "color-ai-ink": "#5343d6",
  "color-wait-ink": "#8a5a00",
  "color-wait": "#d99724",
  "color-alert": "#c93a25",
  "color-on-alert": "#ffffff",
  "color-alert-ink": "#b3311f",
  "shadow-1": "0 1px 2px rgb(15 23 32 / 0.04), 0 8px 24px -6px rgb(15 23 32 / 0.08)",
  "shadow-2": "0 2px 4px rgb(15 23 32 / 0.05), 0 18px 44px -12px rgb(15 23 32 / 0.16)",
} as const;

export type ColorToken = keyof typeof LIGHT;

export const DARK: Record<ColorToken, string> = {
  "color-bg": "#0a0c10",
  "color-bg-sunk": "#0e1116",
  "color-surface": "#12161c",
  "color-surface-2": "#171c24",
  "color-line": "rgb(255 255 255 / 0.07)",
  "color-line-strong": "rgb(255 255 255 / 0.15)",
  "color-ink": "#eef2f6",
  "color-ink-2": "#a3adba",
  "color-ink-3": "#8892a0",
  "color-accent": "#22c997",
  "color-accent-2": "#17b3b0",
  "color-accent-strong": "#22c997",
  "color-accent-strong-2": "#17b3b0",
  "color-on-accent": "#04130e",
  "color-accent-ink": "#4fdcb0",
  "color-ai": "#8f81ff",
  "color-on-ai": "#0d0a24",
  "color-ai-ink": "#b3a9ff",
  "color-wait-ink": "#e6b450",
  "color-wait": "#e6b450",
  "color-alert": "#ff7a66",
  "color-on-alert": "#2a0803",
  "color-alert-ink": "#ff9484",
  "shadow-1": "0 1px 0 rgb(255 255 255 / 0.03) inset, 0 10px 30px -10px rgb(0 0 0 / 0.6)",
  "shadow-2": "0 1px 0 rgb(255 255 255 / 0.05) inset, 0 24px 60px -16px rgb(0 0 0 / 0.75)",
};

export const SHARED = {
  "font-text": '"Geist Variable", system-ui, -apple-system, "Segoe UI", sans-serif',
  "font-mono": '"Geist Mono Variable", ui-monospace, Menlo, monospace',
  "text-12": "0.75rem",
  "text-13": "0.8125rem",
  "text-15": "0.9375rem",
  "text-17": "1.0625rem",
  "text-20": "1.25rem",
  "text-24": "1.5rem",
  "text-32": "2rem",
  "text-44": "2.75rem",
  "text-64": "4rem",
  "space-4": "0.25rem",
  "space-8": "0.5rem",
  "space-12": "0.75rem",
  "space-16": "1rem",
  "space-24": "1.5rem",
  "space-32": "2rem",
  "space-48": "3rem",
  "space-64": "4rem",
  "space-96": "6rem",
  "radius-card": "16px",
  "radius-box": "12px",
  "radius-control": "10px",
  "radius-pill": "999px",
  "time-fast": "120ms",
  "time-base": "200ms",
  "time-slow": "320ms",
  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export type TokenName = ColorToken | keyof typeof SHARED;

/** A token as a CSS value, for the few styles set from code: `token("color-accent")`. */
export const token = (name: TokenName): string => `var(--${name})`;

const declarations = (tokens: Record<string, string>): string =>
  Object.entries(tokens)
    .map(([name, value]) => `--${name}:${value};`)
    .join("");

/**
 * Every token as CSS. The dark colours apply when the device asks for dark and the person has not
 * chosen light (`data-theme="light"`), or when they chose dark (`data-theme="dark"`).
 */
export function tokenCss(): string {
  const dark = declarations(DARK);
  return [
    `:root{color-scheme:light;${declarations(SHARED)}${declarations(LIGHT)}}`,
    `@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){color-scheme:dark;${dark}}}`,
    `:root[data-theme="dark"]{color-scheme:dark;${dark}}`,
    // A part of a page that is always dark, whatever the theme (the landing page's vault).
    `.pp-scope-dark{color-scheme:dark;${dark}}`,
  ].join("");
}
