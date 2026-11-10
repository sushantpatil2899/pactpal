import { STEP_KIND_WORDS } from "@pactpal/timeline";
import type { DraftContent, ScopeView } from "./api";

const plain = (text: string) => text.trim().replace(/\s+/g, " ").toLowerCase();

/** Words too common to show that two lines say the same thing. */
const FILLER = new Set(["a", "an", "and", "the", "of", "for", "to", "in", "on", "with", "or"]);

/** How much two lines must share (shared words over the longer line's words) to be a rewording. */
export const REWORDED_OVERLAP = 0.6;

const wordsOf = (text: string) =>
  new Set(
    text
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter((word) => word !== "" && !FILLER.has(word)),
  );

/** Shared words over the longer line's words, from 0 (nothing shared) to 1. */
function overlap(a: string, b: string): number {
  const one = wordsOf(a);
  const two = wordsOf(b);
  const longer = Math.max(one.size, two.size);
  if (longer === 0) return 0;
  return [...one].filter((word) => two.has(word)).length / longer;
}

/** A line of a list; lines are only paired as a rewording within the same `group`. */
interface Item {
  text: string;
  group?: string;
  /** The words compared for a rewording, when not the whole text. */
  words?: string;
}

/**
 * What is in `after` and not in `before`, and the other way round, ignoring case and spacing.
 * A removed line and an added line of the same group that share most of their words are one
 * line reworded (the models often rephrase what did not change); each line pairs at most once,
 * best match first.
 */
function listChange(before: readonly Item[], after: readonly Item[]) {
  const had = new Set(before.map((item) => plain(item.text)));
  const has = new Set(after.map((item) => plain(item.text)));
  const added = after.filter((item) => !had.has(plain(item.text)));
  const removed = before.filter((item) => !has.has(plain(item.text)));
  const pairs = removed
    .flatMap((old, r) =>
      added.map((now, a) => ({
        r,
        a,
        score: old.group === now.group ? overlap(old.words ?? old.text, now.words ?? now.text) : 0,
      })),
    )
    .filter((pair) => pair.score >= REWORDED_OVERLAP)
    .sort((x, y) => y.score - x.score);
  const usedRemoved = new Set<number>();
  const usedAdded = new Set<number>();
  const reworded: { from: Item; to: Item }[] = [];
  for (const { r, a } of pairs) {
    const from = removed[r];
    const to = added[a];
    if (from === undefined || to === undefined || usedRemoved.has(r) || usedAdded.has(a)) continue;
    usedRemoved.add(r);
    usedAdded.add(a);
    reworded.push({ from, to });
  }
  return {
    added: added.filter((_, a) => !usedAdded.has(a)),
    removed: removed.filter((_, r) => !usedRemoved.has(r)),
    reworded,
  };
}

const items = (texts: readonly string[]): Item[] => texts.map((text) => ({ text }));

/**
 * What an updated draft (7i) changes against the version it started from, line by line, for
 * the seller to check before using it: the summary, what is delivered, what is not included,
 * what the buyer provides, the price, the due date, revisions and the timeline's steps. Only
 * what the draft states is compared (a field it leaves missing is not a change); a line that is
 * only reworded shows once, as reworded. Pure.
 */
export function draftChanges(draft: DraftContent, scope: ScopeView): string[] {
  const lines: string[] = [];
  const list = (label: string, before: readonly Item[], after: readonly Item[]) => {
    const { added, removed, reworded } = listChange(before, after);
    lines.push(...reworded.map(({ from, to }) => `${label}, reworded: ${from.text} → ${to.text}`));
    lines.push(...added.map((item) => `${label}, added: ${item.text}`));
    lines.push(...removed.map((item) => `${label}, no longer: ${item.text}`));
  };
  if (draft.summary.status === "found" && plain(draft.summary.value) !== plain(scope.summary)) {
    lines.push(`Summary: ${draft.summary.value}`);
  }
  list("Delivered", items(scope.deliverables), items(draft.deliverables.map((item) => item.text)));
  list("Not included", items(scope.exclusions), items(draft.exclusions.map((item) => item.text)));
  list(
    "The buyer provides",
    items((scope.buyerProvides ?? []).map((item) => item.text)),
    items((draft.buyerProvides ?? []).map((item) => item.text)),
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
    // Steps pair as reworded only with a step of the same kind, compared on their own words.
    const step = (kind: keyof typeof STEP_KIND_WORDS, title: string): Item => ({
      text: `${STEP_KIND_WORDS[kind]}: ${title}`,
      group: kind,
      words: title,
    });
    list(
      "Timeline",
      scope.steps.map((s) => step(s.kind, s.title)),
      draft.timeline.map((s) => step(s.kind, s.text)),
    );
  }
  return lines;
}
