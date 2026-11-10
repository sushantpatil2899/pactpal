import {
  dayWords,
  listingLines,
  markedLine,
  stepLine,
  type LineMark,
  type ListingFacts,
  type StepFacts,
} from "@pactpal/words";

/** The page the buyer signs, as far as its lines go (the acceptance document's shape). */
export interface AgreementPage {
  title: string;
  sellerName: string;
  terms: {
    currency: string;
    summary: string;
    deliverables: readonly string[];
    deliverableKinds?: readonly LineMark[];
    exclusions: readonly string[];
    buyerProvides?: readonly { text: string; dueDate: string | null }[];
    revisionsIncluded: number | null;
    dueDate: string | null;
    milestones: readonly { title: string; amount: { text: string }; dueDate: string | null }[];
    total: { text: string };
    /** The signed steps in order, when the version lists them (7f). */
    timeline?: readonly StepFacts[];
    /** The product as listed, when the version has one (8e). */
    listing?: ListingFacts;
  };
}

/** One numbered line of the agreement, as the model reads it and as answers cite it. */
export interface AgreementLine {
  n: number;
  text: string;
}

/**
 * The agreement as numbered lines, built from exactly the page the buyer sees: title, seller,
 * summary, each delivered line with its mark, what is not included, what the buyer provides,
 * revisions, due date, each payment stage, the total and the timeline (when it lists one).
 */
export function agreementLines(page: AgreementPage): AgreementLine[] {
  const { terms } = page;
  const texts = [
    `Title: ${page.title}`,
    `Seller: ${page.sellerName}`,
    `Summary: ${terms.summary}`,
    ...terms.deliverables.map(
      (line, n) => `Delivered: ${markedLine(line, terms.deliverableKinds?.[n], terms.milestones)}`,
    ),
    ...terms.exclusions.map((line) => `Not included: ${line}`),
    ...(terms.buyerProvides ?? []).map(
      (item) =>
        `The buyer provides: ${item.text}${item.dueDate === null ? "" : ` (by ${dayWords(item.dueDate)})`}`,
    ),
    ...(terms.revisionsIncluded === null
      ? []
      : [`Revisions included: ${String(terms.revisionsIncluded)}`]),
    ...(terms.dueDate === null ? [] : [`Due date: ${dayWords(terms.dueDate)}`]),
    ...terms.milestones.map(
      (stage, n) =>
        `Payment stage ${String(n + 1)}: ${stage.title}, ${stage.amount.text} ${terms.currency}${stage.dueDate === null ? "" : ` (due ${dayWords(stage.dueDate)})`}`,
    ),
    `Total: ${terms.total.text} ${terms.currency}`,
    ...(terms.timeline ?? []).map((step) => `Timeline step ${stepLine(step, terms.currency)}`),
    ...(terms.listing === undefined ? [] : listingLines(terms.listing)),
  ];
  return texts.map((text, i) => ({ n: i + 1, text }));
}

/** Numbered lines as a model reads them, one per line: "4: Delivered: …". */
export const numberedText = (lines: readonly { n: number; text: string }[]): string =>
  lines.map(({ n, text }) => `${String(n)}: ${text}`).join("\n");
