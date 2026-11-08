import { DEAL_CATEGORIES, type DraftRecord } from "@pactpal/db";
import { fromPayPalMoney } from "@pactpal/paypal";
import {
  BLOCKED_CATEGORIES,
  categoryVerdict,
  findInstructionLines,
  scopeDraftSchema,
  type ScopeDraft,
  type SourceLine,
} from "@pactpal/scope-draft";
import { councilRecordSchema, isUnranked } from "./council-record.js";

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

/** One draft as the pages show it: the price also in minor units, and what the chat says was sold. */
function describeDraft(draftContent: ScopeDraft, deal: { category: string }) {
  return {
    draft: {
      ...draftContent,
      price:
        draftContent.price.status === "found"
          ? {
              ...draftContent.price,
              minor: priceMinor(draftContent.price.amount, draftContent.price.currency),
            }
          : draftContent.price,
    },
    category: {
      fromChat: draftContent.category.id,
      label: categoryLabels.get(draftContent.category.id) ?? "Unclear",
      verdict: categoryVerdict(draftContent.category.id, deal.category),
      note: draftContent.category.note,
    },
  };
}

/**
 * A draft as the seller's pages see it. The stored JSON is checked against the AI packages'
 * schemas as it is read; the winning draft's price also comes with its minor units, like agreed
 * work. The category verdict compares what the models read from the chat with the deal's category.
 * `lines` is the numbered chat the draft was made from, given only when a finished draft is read
 * on its own; `hiddenLines` then lists the numbers of the lines that were hidden from the models
 * because they look like orders to an AI (numbers only, never their text). `unranked` says the
 * council could not rank its drafts, and `candidates` then holds every valid draft in the same
 * shape as the main one, for the seller to choose from; it is empty otherwise.
 */
export function draftView(
  record: DraftRecord,
  deal: { category: string },
  lines: readonly SourceLine[] | null = null,
) {
  const draft = record.draft === undefined ? undefined : scopeDraftSchema.parse(record.draft);
  const council =
    record.council === undefined ? undefined : councilRecordSchema.parse(record.council);
  const unranked = council === undefined ? null : isUnranked(council);
  const described = draft === undefined ? undefined : describeDraft(draft, deal);
  return {
    id: record.id,
    status: record.status,
    createdAt: record.createdAt.toISOString(),
    finishedAt: record.finishedAt?.toISOString() ?? null,
    source: {
      fileId: record.sourceArtifactId,
      sha256: record.sourceSha256,
      lines,
      hiddenLines: lines === null ? null : findInstructionLines(lines),
      // 7h, 7i: how far into the in-app chat it read, and the version an update started from.
      chatThroughSeq: record.chatThroughSeq ?? null,
      basedOnVersion: record.basedOnVersion ?? null,
    },
    promptVersions: { draft: record.draftPromptVersion, rank: record.rankPromptVersion },
    failureReason: record.failureReason ?? null,
    draft: described?.draft ?? null,
    category: described?.category ?? null,
    needsReview: council?.needsReview ?? null,
    reviewReasons: council?.reviewReasons ?? [],
    unranked,
    candidates:
      council === undefined || unranked !== true
        ? []
        : council.candidates.map(({ label, modelName, draft: candidate }) => ({
            label,
            modelName,
            ...describeDraft(candidate, deal),
          })),
    council: council ?? null,
  };
}

export type DraftView = ReturnType<typeof draftView>;
