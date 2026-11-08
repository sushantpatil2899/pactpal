import type { ScopeContent } from "@pactpal/db";
import { fromPayPalMoney } from "@pactpal/paypal";
import { buyerProvidesOf, draftTimelineOf, type ScopeDraft } from "@pactpal/scope-draft";
import { resolveTimeline } from "@pactpal/timeline";

/** What the seller did with one field of an AI draft. */
export type FieldChange = "unchanged" | "changed" | "added" | "removed";

/** Trimmed, Unicode-normalised, with runs of spaces joined. Case and wording are not forgiven. */
const plain = (text: string) => text.normalize("NFKC").trim().replace(/\s+/g, " ");

/** How a field of the saved work compares with the draft's; undefined when neither has it. */
function compare(
  drafted: readonly string[] | undefined,
  saved: readonly string[] | undefined,
): FieldChange | undefined {
  const before = drafted ?? [];
  const after = saved ?? [];
  if (before.length === 0 && after.length === 0) return undefined;
  if (before.length === 0) return "added";
  if (after.length === 0) return "removed";
  const same =
    before.length === after.length &&
    before.every((item, i) => plain(item) === plain(after[i] ?? ""));
  return same ? "unchanged" : "changed";
}

/** A buyer-provides item as one comparable string: its text and date. */
const provided = (item: { text: string; dueDate?: string | null }) =>
  `${item.text} | ${item.dueDate ?? ""}`;

/**
 * The draft's suggested marks against the saved ones, line by line ("unsure" counts as no mark).
 * A matter of taste is the same mark whatever stage settles it.
 */
function compareMarks(draft: Extract<ScopeDraft, { format: 3 | 4 }>, content: ScopeContent) {
  const suggested = draft.deliverables.map(({ mark }) => (mark === "unsure" ? "none" : mark));
  const saved = content.deliverables.map((_, i) => content.deliverableKinds?.[i]?.kind ?? "none");
  return compare(suggested, saved);
}

/** The draft's price in minor units, or undefined when it is missing or not a valid amount. */
function draftedPriceMinor(draft: ScopeDraft, currency: string): number | undefined {
  if (draft.price.status !== "found") return undefined;
  try {
    return fromPayPalMoney({ currency_code: currency, value: draft.price.amount }).minor;
  } catch {
    return undefined;
  }
}

/**
 * Compares the agreed work the seller saved with the AI draft it came from, field by field:
 * summary, what is delivered, what is not included, what the buyer provides, the line marks,
 * the timeline, revisions, due date and total price. Plain code, no AI. Only fields that either side has
 * appear (marks only for a draft that suggested them). The draft's payment-terms text is not
 * compared, because the seller builds the payment stages by hand.
 */
export function compareWithDraft(
  draft: ScopeDraft,
  content: ScopeContent,
  currency: string,
): Record<string, FieldChange> {
  const total = content.milestones.reduce((sum, stage) => sum + stage.amountMinor, 0);
  const drafted = draftedPriceMinor(draft, currency);
  const price: FieldChange | undefined =
    draft.price.status === "found" ? (drafted === total ? "unchanged" : "changed") : "added";
  const changes: [string, FieldChange | undefined][] = [
    [
      "summary",
      compare(draft.summary.status === "found" ? [draft.summary.value] : [], [content.summary]),
    ],
    [
      "deliverables",
      compare(
        draft.deliverables.map((item) => item.text),
        content.deliverables,
      ),
    ],
    [
      "exclusions",
      compare(
        draft.exclusions.map((item) => item.text),
        content.exclusions,
      ),
    ],
    [
      "buyerProvides",
      compare(buyerProvidesOf(draft).map(provided), content.buyerProvides?.map(provided)),
    ],
    ["deliverableMarks", draft.format === 2 ? undefined : compareMarks(draft, content)],
    // The steps' kinds and words in order (7g); only for a draft that has a timeline.
    [
      "timeline",
      draft.format === 4
        ? compare(
            draftTimelineOf(draft).map((step) => `${step.kind} | ${step.text}`),
            resolveTimeline(content).map((step) => `${step.kind} | ${step.title}`),
          )
        : undefined,
    ],
    [
      "revisionsIncluded",
      compare(
        draft.revisionsIncluded.status === "found" ? [String(draft.revisionsIncluded.value)] : [],
        content.revisionsIncluded === undefined ? [] : [String(content.revisionsIncluded)],
      ),
    ],
    [
      "dueDate",
      compare(
        draft.dueDate.status === "found" ? [draft.dueDate.value] : [],
        content.dueDate === undefined ? [] : [content.dueDate],
      ),
    ],
    ["totalPrice", price],
  ];
  return Object.fromEntries(
    changes.filter((entry): entry is [string, FieldChange] => entry[1] !== undefined),
  );
}
