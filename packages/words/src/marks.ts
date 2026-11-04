/** How a delivered line can be judged (4i-2); `null` when the seller did not mark it. */
export type LineMark =
  | { kind: "objective" }
  | { kind: "process" }
  | { kind: "subjective"; approvalStage: number }
  | null;

/**
 * A delivered line's mark in words, the same on every page and in the receipt PDF:
 * "(can be checked)", "(a step in the work)" or "(a matter of taste: settled when the buyer
 * approves stage 1, Sketch)"; empty when not marked.
 */
export function markWords(
  mark: LineMark | undefined,
  milestones: readonly { title: string }[],
): string {
  if (mark === undefined || mark === null) return "";
  switch (mark.kind) {
    case "objective":
      return "(can be checked)";
    case "process":
      return "(a step in the work)";
    case "subjective": {
      const title = milestones[mark.approvalStage - 1]?.title;
      const stage = `stage ${String(mark.approvalStage)}${title === undefined ? "" : `, ${title}`}`;
      return `(a matter of taste: settled when the buyer approves ${stage})`;
    }
  }
}

/** A delivered line followed by its mark in words, or the line alone when it is not marked. */
export function markedLine(
  line: string,
  mark: LineMark | undefined,
  milestones: readonly { title: string }[],
): string {
  const words = markWords(mark, milestones);
  return words === "" ? line : `${line} ${words}`;
}
