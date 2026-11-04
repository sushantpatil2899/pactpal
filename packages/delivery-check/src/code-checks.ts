import type { ImageFacts } from "./image.js";
import { lineRequirements, type CheckedFormat, type Requirement } from "./requirements.js";

/** One delivered line the check looks at: its number among the agreement's lines, and its text. */
export interface CheckLine {
  n: number;
  text: string;
}

/** One delivered file and what code read from it. */
export interface CheckedFile {
  fileId: string;
  filename: string;
  facts: ImageFacts;
}

/**
 * How one requirement fared against the files: met (by the named file), not met, or not
 * checkable by code. `closest` names the file that came nearest when a size was not met.
 */
export type RequirementResult = Requirement &
  (
    | { result: "met"; file: string; value?: number }
    | { result: "not-met"; closest?: { file: string; value: number } }
    | { result: "not-checked" }
  );

export interface LineCodeResult {
  line: number;
  results: RequirementResult[];
}

const MEDIA_TYPES: Record<CheckedFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  gif: "image/gif",
  pdf: "application/pdf",
};

/** The file with the largest value, for "closest" when a size is not met. */
function largest(files: readonly CheckedFile[], value: (f: ImageFacts) => number | undefined) {
  let best: { file: string; value: number } | undefined;
  for (const { filename, facts } of files) {
    const v = value(facts);
    if (v !== undefined && (best === undefined || v > best.value))
      best = { file: filename, value: v };
  }
  return best;
}

function judge(requirement: Requirement, files: readonly CheckedFile[]): RequirementResult {
  const first = (test: (f: ImageFacts) => boolean) => files.find((f) => test(f.facts))?.filename;
  switch (requirement.kind) {
    case "format": {
      const file = first((f) => f.mediaType === MEDIA_TYPES[requirement.format]);
      return file === undefined
        ? { ...requirement, result: "not-met" }
        : { ...requirement, result: "met", file };
    }
    case "transparent": {
      const file = first(
        (f) => f.transparency.kind === "transparent" && f.transparency.corners === 4,
      );
      if (file !== undefined) return { ...requirement, result: "met", file };
      const unread = files.some((f) => f.facts.transparency.kind === "not-checked");
      return unread
        ? { ...requirement, result: "not-checked" }
        : { ...requirement, result: "not-met" };
    }
    case "min": {
      const side = (f: ImageFacts) => (requirement.side === "height" ? f.height : f.width);
      const best = largest(files, side);
      return best !== undefined && best.value >= requirement.px
        ? { ...requirement, result: "met", file: best.file, value: best.value }
        : { ...requirement, result: "not-met", ...(best ? { closest: best } : {}) };
    }
    case "exact": {
      const file = first((f) => f.width === requirement.width && f.height === requirement.height);
      return file === undefined
        ? { ...requirement, result: "not-met" }
        : { ...requirement, result: "met", file };
    }
    case "unchecked-format":
      return { ...requirement, result: "not-checked" };
  }
}

/**
 * The code checks: for each line, what it asks for that code can check, and whether at least one
 * file meets it. Pure; the same files and lines always give the same result.
 */
export function codeChecks(
  lines: readonly CheckLine[],
  files: readonly CheckedFile[],
): LineCodeResult[] {
  return lines.map(({ n, text }) => ({
    line: n,
    results: lineRequirements(text).map((requirement) => judge(requirement, files)),
  }));
}
