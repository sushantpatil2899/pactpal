import type { CheckLine } from "./code-checks.js";

/** A delivered line's mark, as the agreement stores it (`@pactpal/words` has the words). */
type Mark = { kind: "objective" } | { kind: "process" } | { kind: "subjective" } | null;

/**
 * The delivered lines a check looks at, numbered as in the agreement (1 = its first delivered
 * line): those marked "can be checked" and those not marked. A step in the work or a matter of
 * taste is never judged.
 */
export function checkableLines(
  deliverables: readonly string[],
  marks: readonly Mark[] | undefined,
): CheckLine[] {
  return deliverables.flatMap((text, i) => {
    const mark = marks?.[i] ?? null;
    return mark === null || mark.kind === "objective" ? [{ n: i + 1, text }] : [];
  });
}
