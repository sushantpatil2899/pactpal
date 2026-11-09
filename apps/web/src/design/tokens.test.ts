import { describe, expect, it } from "vitest";
import { TOKENS, token, tokenCss } from "./tokens";

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

describe("design tokens", () => {
  it("writes every token as a custom property", () => {
    const css = tokenCss();
    expect(css.startsWith(":root{")).toBe(true);
    expect(css).toContain("--color-ink:#0b0c0a;");
    expect(css.split(";").length - 1).toBe(Object.keys(TOKENS).length);
    expect(token("color-tape")).toBe("var(--color-tape)");
  });

  // The pairings docs/DESIGN.md allows for body-size text.
  it.each([
    ["color-ink", "color-label"],
    ["color-ink-soft", "color-label"],
    ["color-ink", "color-kraft"],
    ["color-ink", "color-tape"],
    ["color-label", "color-tape-deep"],
    ["color-ink", "color-void"],
    ["color-void-deep", "color-label"],
    ["color-amber", "color-amber-wash"],
    ["color-tape-deep", "color-label"],
  ] as const)("%s on %s is readable (4.5:1)", (text, ground) => {
    expect(contrast(TOKENS[text], TOKENS[ground])).toBeGreaterThanOrEqual(4.5);
  });
});
