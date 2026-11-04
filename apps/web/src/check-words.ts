import type { ImageFacts, LookVerdict, RequirementResult } from "@pactpal/delivery-check";

const TYPE_WORDS: Record<ImageFacts["mediaType"], string> = {
  "image/png": "PNG",
  "image/jpeg": "JPEG",
  "image/gif": "GIF",
  "application/pdf": "PDF",
  other: "a type PactPal does not read",
};

const FORMAT_WORDS = { png: "PNG", jpeg: "JPEG", gif: "GIF", pdf: "PDF" } as const;

/** e.g. "4.2 MB" or "310 KB". */
export function sizeWords(bytes: number): string {
  return bytes >= 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)} MB`
    : `${String(Math.max(1, Math.round(bytes / 1000)))} KB`;
}

/** What code read from one file, e.g. "PNG, 4.2 MB, 2400 × 3200 px, transparent background (...)". */
export function factsWords(facts: ImageFacts): string {
  const parts = [TYPE_WORDS[facts.mediaType], sizeWords(facts.sizeBytes)];
  if (facts.width !== undefined && facts.height !== undefined) {
    parts.push(`${String(facts.width)} × ${String(facts.height)} px`);
  }
  const t = facts.transparency;
  if (t.kind === "transparent") {
    parts.push(
      t.corners === 4
        ? "transparent background (all four corners transparent)"
        : `some transparent pixels (${String(t.corners)} of 4 corners transparent)`,
    );
  } else if (t.kind === "opaque") parts.push("no transparent background");
  else if (t.kind === "not-checked" && facts.mediaType !== "other") {
    parts.push("transparency not checked");
  } else if (t.kind === "impossible" && facts.mediaType === "image/jpeg") {
    parts.push("a JPEG cannot be transparent");
  }
  return parts.join(", ");
}

const MARKS = { met: "✓", "not-met": "✗", "not-checked": "not checked" } as const;

/** One requirement and how it fared, e.g. "at least 3000 px tall ✓ (3200 px)". */
export function requirementWords(r: RequirementResult): string {
  const mark = MARKS[r.result];
  switch (r.kind) {
    case "format":
      return `${FORMAT_WORDS[r.format]} ${mark}`;
    case "transparent":
      return `transparent background ${mark}`;
    case "min": {
      const what = `at least ${String(r.px)} px ${r.side === "height" ? "tall" : "wide"} ${mark}`;
      if (r.result === "met" && r.value !== undefined) return `${what} (${String(r.value)} px)`;
      if (r.result === "not-met" && r.closest) {
        const most = r.side === "height" ? "tallest" : "widest";
        return `${what} (${most}: ${String(r.closest.value)} px, ${r.closest.file})`;
      }
      return what;
    }
    case "exact":
      return `${String(r.width)} × ${String(r.height)} px ${mark}`;
    case "unchecked-format":
      return `${r.name}: not checked by code`;
  }
}

/** A model's verdict on one line, in the seller's words. */
export const VERDICT_WORDS: Record<LookVerdict, string> = {
  shown: "shown",
  "not-shown": "not in this file (fine if it belongs to another stage)",
  contradicted: "looks different from this line",
  "cannot-tell": "can't tell by looking",
};
