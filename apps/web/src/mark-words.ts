import type { Suggestion } from "./draft-fill";

/** The kinds a seller can choose for a delivered line, in the order the form offers them. */
export const KIND_CHOICES = [
  { value: "", label: "Not marked" },
  { value: "objective", label: "Can be checked (format, size, count…)" },
  { value: "process", label: "A step in the work" },
  { value: "subjective", label: "A matter of taste" },
] as const;

/** What the draft said about wording in this line, as hints beside the line's mark. */
export function draftHints(line: string, suggestions: readonly Suggestion[]): string[] {
  const text = line.toLowerCase();
  return suggestions
    .filter((suggestion) => text.includes(suggestion.phrase.toLowerCase()))
    .map((suggestion) =>
      suggestion.kind === "subjective"
        ? `The draft calls “${suggestion.phrase}” a matter of taste.`
        : `The draft says “${suggestion.phrase}” could be measured but is not.`,
    );
}
