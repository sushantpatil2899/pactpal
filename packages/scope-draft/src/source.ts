/** The most lines and characters of pasted text a draft is made from (about 15,000 tokens). */
export const MAX_SOURCE_LINES = 2000;
export const MAX_SOURCE_CHARS = 60_000;

/** One non-blank line of the pasted text, with the number models cite it by. */
export interface SourceLine {
  /** Counted from 1 over the non-blank lines only. */
  n: number;
  text: string;
}

export type NumberedSource =
  | { ok: true; lines: SourceLine[] }
  | { ok: false; reason: "empty" | "too-many-lines" | "too-long"; message: string };

/**
 * Splits pasted text into numbered lines. The same numbering is used to build the prompt and to
 * check the answer, so the two can never disagree. Text over the limits is refused, not cut.
 */
export function numberSourceLines(text: string): NumberedSource {
  if (text.length > MAX_SOURCE_CHARS) {
    return {
      ok: false,
      reason: "too-long",
      message: `The text is longer than ${String(MAX_SOURCE_CHARS)} characters.`,
    };
  }
  const lines = text
    .split(/\r\n|\r|\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line, index) => ({ n: index + 1, text: line }));
  if (lines.length === 0) return { ok: false, reason: "empty", message: "The text is empty." };
  if (lines.length > MAX_SOURCE_LINES) {
    return {
      ok: false,
      reason: "too-many-lines",
      message: `The text has more than ${String(MAX_SOURCE_LINES)} lines.`,
    };
  }
  return { ok: true, lines };
}
