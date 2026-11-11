import { describe, expect, it } from "vitest";
import { DARK, LIGHT, SHARED, token, tokenCss, type ColorToken } from "./tokens.js";

/** Relative luminance of a `#rrggbb` colour (WCAG 2). */
function luminance(hex: string): number {
  const channel = (at: number) => {
    const value = parseInt(hex.slice(at, at + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light! + 0.05) / (dark! + 0.05);
}

// The text-on-ground pairings docs/DESIGN.md allows for body-size text.
const PAIRS: [ColorToken, ColorToken][] = [
  ["color-ink", "color-bg"],
  ["color-ink", "color-surface"],
  ["color-ink-2", "color-bg"],
  ["color-ink-2", "color-surface"],
  ["color-ink-3", "color-surface"],
  ["color-ink-3", "color-bg-sunk"],
  ["color-on-accent", "color-accent-strong"],
  ["color-on-accent", "color-accent-strong-2"],
  ["color-accent-ink", "color-surface"],
  ["color-on-ai", "color-ai"],
  ["color-ai-ink", "color-surface"],
  ["color-wait-ink", "color-surface"],
  ["color-on-alert", "color-alert"],
  ["color-alert-ink", "color-surface"],
];

describe("design tokens", () => {
  it("writes the shared tokens once and the colours for both themes", () => {
    const css = tokenCss();
    expect(css.startsWith(":root{color-scheme:light;")).toBe(true);
    expect(css).toContain(`--color-ink:${LIGHT["color-ink"]};`);
    expect(css).toContain(`:root[data-theme="dark"]{color-scheme:dark;--color-bg:#0a0c10;`);
    expect(css).toContain(`@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){`);
    expect(css.split("--font-text:").length - 1).toBe(1);
    expect(Object.keys(SHARED).length).toBeGreaterThan(20);
    expect(token("color-accent")).toBe("var(--color-accent)");
  });

  it("gives the dark theme every colour the light theme has", () => {
    expect(Object.keys(DARK).sort()).toEqual(Object.keys(LIGHT).sort());
  });

  describe.each([
    ["light", LIGHT],
    ["dark", DARK],
  ] as const)("%s theme", (_name, theme) => {
    it.each(PAIRS)("%s on %s is readable (4.5:1)", (text, ground) => {
      expect(contrast(theme[text], theme[ground])).toBeGreaterThanOrEqual(4.5);
    });
  });
});
