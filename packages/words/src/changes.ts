import { markWords, type LineMark } from "./marks.js";

/** A date (YYYY-MM-DD) as people read it, the same on every page, email and receipt: "20 Nov 2026". */
export const dayWords = (isoDate: string): string =>
  new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-GB", {
    dateStyle: "medium",
    timeZone: "UTC",
  });

/** What a change order adds or changes, as the pages and emails describe it. */
export interface ChangeFacts {
  addedLines: readonly { text: string; mark: LineMark }[];
  addedExclusions: readonly string[];
  addedBuyerProvides: readonly { text: string; dueDate: string | null }[];
  addedStages: readonly {
    stage: number;
    title: string;
    amount: { text: string };
    dueDate: string | null;
  }[];
  dueDate: { from: string | null; to: string | null } | null;
  revisionsIncluded: { from: number; to: number } | null;
  total: { from: { text: string }; to: { text: string } };
}

const dayOrNone = (isoDate: string | null) => (isoDate === null ? "none" : dayWords(isoDate));

/**
 * "What changes", one line each, the same on the deal page and in the email to the buyer.
 * `stages` are the new version's payment stages, which a matter of taste may name.
 */
export function changeLines(
  change: ChangeFacts,
  currency: string,
  stages: readonly { title: string }[],
): string[] {
  return [
    ...change.addedLines.map((line) => {
      const words = markWords(line.mark, stages);
      return `Added: ${line.text}${words === "" ? "" : ` ${words}`}`;
    }),
    ...change.addedExclusions.map((text) => `Added to "not included": ${text}`),
    ...change.addedBuyerProvides.map(
      (item) =>
        `The buyer also provides: ${item.text}${item.dueDate === null ? "" : ` (by ${dayWords(item.dueDate)})`}`,
    ),
    ...change.addedStages.map(
      (stage) =>
        `Added payment stage ${String(stage.stage)}: ${stage.title}, ${stage.amount.text} ${currency}${stage.dueDate === null ? "" : ` (due ${dayWords(stage.dueDate)})`}`,
    ),
    ...(change.dueDate === null
      ? []
      : [`Due date: ${dayOrNone(change.dueDate.from)} → ${dayOrNone(change.dueDate.to)}`]),
    ...(change.revisionsIncluded === null
      ? []
      : [
          `Revisions included: ${String(change.revisionsIncluded.from)} → ${String(change.revisionsIncluded.to)}`,
        ]),
    `Total: ${change.total.from.text} → ${change.total.to.text} ${currency}`,
  ];
}
