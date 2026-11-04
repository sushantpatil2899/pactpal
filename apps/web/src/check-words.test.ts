import { describe, expect, it } from "vitest";
import { VERDICT_WORDS, factsWords, requirementWords, sizeWords } from "./check-words";

describe("pre-delivery check words", () => {
  it("say what code read from a file", () => {
    expect(
      factsWords({
        mediaType: "image/png",
        sizeBytes: 4_200_000,
        width: 2400,
        height: 3200,
        transparency: { kind: "transparent", corners: 4, share: 0.6 },
      }),
    ).toBe("PNG, 4.2 MB, 2400 × 3200 px, transparent background (all four corners transparent)");
    expect(
      factsWords({
        mediaType: "image/png",
        sizeBytes: 900,
        transparency: { kind: "transparent", corners: 2, share: 0.1 },
      }),
    ).toBe("PNG, 1 KB, some transparent pixels (2 of 4 corners transparent)");
    expect(
      factsWords({
        mediaType: "image/jpeg",
        sizeBytes: 310_000,
        width: 10,
        height: 20,
        transparency: { kind: "impossible" },
      }),
    ).toBe("JPEG, 310 KB, 10 × 20 px, a JPEG cannot be transparent");
    expect(
      factsWords({
        mediaType: "image/gif",
        sizeBytes: 5000,
        transparency: { kind: "not-checked" },
      }),
    ).toBe("GIF, 5 KB, transparency not checked");
    expect(
      factsWords({ mediaType: "image/png", sizeBytes: 5000, transparency: { kind: "opaque" } }),
    ).toBe("PNG, 5 KB, no transparent background");
    expect(
      factsWords({
        mediaType: "application/pdf",
        sizeBytes: 5000,
        transparency: { kind: "impossible" },
      }),
    ).toBe("PDF, 5 KB");
    expect(
      factsWords({ mediaType: "other", sizeBytes: 5000, transparency: { kind: "not-checked" } }),
    ).toBe("a type PactPal does not read, 5 KB");
    expect(sizeWords(12)).toBe("1 KB");
  });

  it("say how each requirement fared", () => {
    expect(requirementWords({ kind: "format", format: "png", result: "met", file: "a.png" })).toBe(
      "PNG ✓",
    );
    expect(requirementWords({ kind: "transparent", result: "not-met" })).toBe(
      "transparent background ✗",
    );
    expect(
      requirementWords({
        kind: "min",
        side: "height",
        px: 3000,
        result: "met",
        file: "a.png",
        value: 3200,
      }),
    ).toBe("at least 3000 px tall ✓ (3200 px)");
    expect(
      requirementWords({
        kind: "min",
        side: "width",
        px: 1200,
        result: "not-met",
        closest: { file: "s.png", value: 800 },
      }),
    ).toBe("at least 1200 px wide ✗ (widest: 800 px, s.png)");
    expect(requirementWords({ kind: "min", side: "height", px: 10, result: "not-met" })).toBe(
      "at least 10 px tall ✗",
    );
    expect(
      requirementWords({ kind: "exact", width: 1920, height: 1080, result: "not-checked" }),
    ).toBe("1920 × 1080 px not checked");
    expect(requirementWords({ kind: "unchecked-format", name: "SVG", result: "not-checked" })).toBe(
      "SVG: not checked by code",
    );
    expect(VERDICT_WORDS["not-shown"]).toContain("another stage");
  });
});
