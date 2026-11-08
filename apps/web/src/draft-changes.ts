import { STEP_KIND_WORDS } from "@pactpal/timeline";
import type { DraftContent, ScopeView } from "./api";

const plain = (text: string) => text.trim().replace(/\s+/g, " ").toLowerCase();

/** What is in `after` and not in `before`, and the other way round, ignoring case and spacing. */
function listChange(before: readonly string[], after: readonly string[]) {
  const had = new Set(before.map(plain));
  const has = new Set(after.map(plain));
  return {
    added: after.filter((item) => !had.has(plain(item))),
    removed: before.filter((item) => !has.has(plain(item))),
  };
}

/**
 * What an updated draft (7i) changes against the version it started from, line by line, for
 * the seller to check before using it: the summary, what is delivered, what is not included,
 * what the buyer provides, the price, the due date, revisions and the timeline's steps. Only
 * what the draft states is compared (a field it leaves missing is not a change). Pure.
 */
export function draftChanges(draft: DraftContent, scope: ScopeView): string[] {
  const lines: string[] = [];
  const list = (label: string, before: readonly string[], after: readonly string[]) => {
    const { added, removed } = listChange(before, after);
    lines.push(...added.map((item) => `${label}, added: ${item}`));
    lines.push(...removed.map((item) => `${label}, no longer: ${item}`));
  };
  if (draft.summary.status === "found" && plain(draft.summary.value) !== plain(scope.summary)) {
    lines.push(`Summary: ${draft.summary.value}`);
  }
  list(
    "Delivered",
    scope.deliverables,
    draft.deliverables.map((item) => item.text),
  );
  list(
    "Not included",
    scope.exclusions,
    draft.exclusions.map((item) => item.text),
  );
  list(
    "The buyer provides",
    (scope.buyerProvides ?? []).map((item) => item.text),
    (draft.buyerProvides ?? []).map((item) => item.text),
  );
  if (draft.price.status === "found" && draft.price.amount !== scope.total.text) {
    lines.push(`Price: ${scope.total.text} → ${draft.price.amount} ${draft.price.currency}`);
  }
  if (draft.dueDate.status === "found" && draft.dueDate.value !== scope.dueDate) {
    lines.push(`Due date: ${scope.dueDate ?? "none"} → ${draft.dueDate.value}`);
  }
  if (
    draft.revisionsIncluded.status === "found" &&
    draft.revisionsIncluded.value !== scope.revisionsIncluded
  ) {
    lines.push(
      `Revisions included: ${String(scope.revisionsIncluded ?? "none")} → ${String(draft.revisionsIncluded.value)}`,
    );
  }
  if (draft.timeline !== undefined) {
    const words = (kind: keyof typeof STEP_KIND_WORDS, title: string) =>
      `${STEP_KIND_WORDS[kind]}: ${title}`;
    list(
      "Timeline",
      scope.steps.map((step) => words(step.kind, step.title)),
      draft.timeline.map((step) => words(step.kind, step.text)),
    );
  }
  return lines;
}
