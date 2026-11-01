import type { EvalGold } from "./eval-cases.js";
import type { ScopeDraft } from "./schema.js";

/**
 * How a draft's value compares with the right answer. `right`: the same value (or correctly left
 * missing). `missed`: the chat states it and the draft left it missing. `wrong`: the draft states
 * a different value, or states one the chat does not give. `wrong` is the worst: a seller could
 * save it by mistake.
 */
export type FieldVerdict = "right" | "missed" | "wrong";

export const SCORED_FIELDS = ["price", "dueDate", "revisions", "category"] as const;
export const SCORED_LISTS = ["deliverables", "exclusions", "vague"] as const;

export interface DraftScore {
  /** The mean of the four field verdicts (right = 1) and the three list recalls, from 0 to 1. */
  score: number;
  fields: Record<(typeof SCORED_FIELDS)[number], FieldVerdict>;
  /** The share of right-answer items the draft covers (1 when the chat has none). */
  recall: Record<(typeof SCORED_LISTS)[number], number>;
  /** Items the draft lists that match no right-answer item; shown, not counted against the score. */
  extras: Record<(typeof SCORED_LISTS)[number], number>;
  /** How many of the four fields are `wrong`. */
  wrongValues: number;
}

/** Compares a stated value with the right one; `statedValue` is undefined when the draft says missing. */
function verdict<T>(
  statedValue: T | undefined,
  right: T | null,
  same: (a: T, b: T) => boolean,
): FieldVerdict {
  if (statedValue === undefined) return right === null ? "right" : "missed";
  return right !== null && same(statedValue, right) ? "right" : "wrong";
}

const strictlyEqual = <T>(a: T, b: T) => a === b;

function priceVerdict(draft: ScopeDraft, gold: EvalGold): FieldVerdict {
  const stated = draft.price.status === "found" ? draft.price : undefined;
  return verdict<{ amount: string; currency: string }>(
    stated,
    gold.price,
    (a, b) => Number(a.amount) === Number(b.amount) && a.currency === b.currency,
  );
}

function categoryVerdict(draft: ScopeDraft, gold: EvalGold): FieldVerdict {
  const { id } = draft.category;
  if (gold.category.includes(id)) return "right";
  return id === "unclear" ? "missed" : "wrong";
}

const lineSet = (groups: readonly (readonly number[])[]) => new Set(groups.flat());

/** Recall of right-answer groups and the count of listed items that cite none of their lines. */
function listScore(
  groups: readonly (readonly number[])[],
  items: readonly { citations: readonly { line: number }[] }[],
) {
  const cited = new Set(items.flatMap(({ citations }) => citations.map(({ line }) => line)));
  const covered = groups.filter((group) => group.some((line) => cited.has(line))).length;
  const known = lineSet(groups);
  return {
    recall: groups.length === 0 ? 1 : covered / groups.length,
    extras: items.filter(({ citations }) => !citations.some(({ line }) => known.has(line))).length,
  };
}

const normal = (text: string) => text.toLowerCase().replace(/\s+/g, " ").trim();

/** Whether a phrase the draft listed is one of the wordings of a right-answer phrase. */
const sameWording = (phrase: string, wording: string) => {
  const a = normal(phrase);
  const b = normal(wording);
  // A short draft phrase only counts when it is a whole wording, so "by" cannot match "by friday".
  return a.includes(b) || (a.length >= 4 && b.includes(a));
};

function vagueScore(gold: EvalGold, draft: ScopeDraft) {
  const phrases = draft.vagueTerms.map(({ phrase }) => phrase);
  const found = gold.vague.filter((wordings) =>
    wordings.some((wording) => phrases.some((phrase) => sameWording(phrase, wording))),
  ).length;
  const known = gold.vague.flat();
  return {
    recall: gold.vague.length === 0 ? 1 : found / gold.vague.length,
    extras: phrases.filter((phrase) => !known.some((wording) => sameWording(phrase, wording)))
      .length,
  };
}

/**
 * Scores a draft that passed the checker against the right answer. Plain code only (never an AI):
 * values are compared exactly, lists by the chat lines the draft cites, so it works in any language.
 */
export function scoreDraft(gold: EvalGold, draft: ScopeDraft): DraftScore {
  const fields = {
    price: priceVerdict(draft, gold),
    dueDate: verdict(
      draft.dueDate.status === "found" ? draft.dueDate.value : undefined,
      gold.dueDate,
      strictlyEqual,
    ),
    revisions: verdict(
      draft.revisionsIncluded.status === "found" ? draft.revisionsIncluded.value : undefined,
      gold.revisions,
      strictlyEqual,
    ),
    category: categoryVerdict(draft, gold),
  };
  const deliverables = listScore(gold.deliverables, draft.deliverables);
  const exclusions = listScore(gold.exclusions, draft.exclusions);
  const vague = vagueScore(gold, draft);
  const verdicts = Object.values(fields);
  const total =
    verdicts.filter((v) => v === "right").length +
    deliverables.recall +
    exclusions.recall +
    vague.recall;
  return {
    score: total / (verdicts.length + SCORED_LISTS.length),
    fields,
    recall: {
      deliverables: deliverables.recall,
      exclusions: exclusions.recall,
      vague: vague.recall,
    },
    extras: {
      deliverables: deliverables.extras,
      exclusions: exclusions.extras,
      vague: vague.extras,
    },
    wrongValues: verdicts.filter((v) => v === "wrong").length,
  };
}
