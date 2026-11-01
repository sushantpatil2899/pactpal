import { DEAL_CATEGORIES, type DraftRecord } from "@pactpal/db";
import { fromPayPalMoney } from "@pactpal/paypal";
import {
  BLOCKED_CATEGORIES,
  categoryVerdict,
  scopeDraftSchema,
  type SourceLine,
} from "@pactpal/scope-draft";
import { councilRecordSchema } from "./council-record.js";

const categoryLabels = new Map<string, string>([
  ...Object.entries(DEAL_CATEGORIES).map(([id, { label }]): [string, string] => [id, label]),
  ...BLOCKED_CATEGORIES.map(({ id, label }): [string, string] => [id, label]),
]);

/** The price as whole minor units, or null when the amount does not fit the currency's format. */
function priceMinor(amount: string, currency: string): number | null {
  try {
    return fromPayPalMoney({ currency_code: currency, value: amount }).minor;
  } catch {
    return null;
  }
}

/**
 * A draft as the seller's pages see it. The stored JSON is checked against the AI packages'
 * schemas as it is read; the winning draft's price also comes with its minor units, like agreed
 * work. The category verdict compares what the models read from the chat with the deal's category.
 * `lines` is the numbered chat the draft was made from, given only when a finished draft is read
 * on its own.
 */
export function draftView(
  record: DraftRecord,
  deal: { category: string },
  lines: readonly SourceLine[] | null = null,
) {
  const draft = record.draft === undefined ? undefined : scopeDraftSchema.parse(record.draft);
  const council =
    record.council === undefined ? undefined : councilRecordSchema.parse(record.council);
  return {
    id: record.id,
    status: record.status,
    createdAt: record.createdAt.toISOString(),
    finishedAt: record.finishedAt?.toISOString() ?? null,
    source: { fileId: record.sourceArtifactId, sha256: record.sourceSha256, lines },
    promptVersions: { draft: record.draftPromptVersion, rank: record.rankPromptVersion },
    failureReason: record.failureReason ?? null,
    draft:
      draft === undefined
        ? null
        : {
            ...draft,
            price:
              draft.price.status === "found"
                ? {
                    ...draft.price,
                    minor: priceMinor(draft.price.amount, draft.price.currency),
                  }
                : draft.price,
          },
    category:
      draft === undefined
        ? null
        : {
            fromChat: draft.category.id,
            label: categoryLabels.get(draft.category.id) ?? "Unclear",
            verdict: categoryVerdict(draft.category.id, deal.category),
            note: draft.category.note,
          },
    needsReview: council?.needsReview ?? null,
    reviewReasons: council?.reviewReasons ?? [],
    council: council ?? null,
  };
}

export type DraftView = ReturnType<typeof draftView>;
