import { describe, expect, it } from "vitest";
import { MAX_SOURCE_CHARS, MAX_SOURCE_LINES, numberSourceLines } from "./source.js";

describe("numberSourceLines", () => {
  it("numbers the non-blank lines from 1 and trims them", () => {
    expect(numberSourceLines("  first  \r\n\r\n\nsecond\rthird\n   \n")).toEqual({
      ok: true,
      lines: [
        { n: 1, text: "first" },
        { n: 2, text: "second" },
        { n: 3, text: "third" },
      ],
    });
  });

  it("refuses empty text", () => {
    expect(numberSourceLines(" \n \n")).toMatchObject({ ok: false, reason: "empty" });
    expect(numberSourceLines("")).toMatchObject({ ok: false, reason: "empty" });
  });

  it("refuses text with too many lines or too many characters instead of cutting it", () => {
    const many = Array.from({ length: MAX_SOURCE_LINES + 1 }, () => "a").join("\n");
    expect(numberSourceLines(many)).toMatchObject({ ok: false, reason: "too-many-lines" });
    expect(numberSourceLines("a\n".repeat(MAX_SOURCE_LINES))).toMatchObject({ ok: true });
    expect(numberSourceLines("a".repeat(MAX_SOURCE_CHARS + 1))).toMatchObject({
      ok: false,
      reason: "too-long",
    });
  });
});
