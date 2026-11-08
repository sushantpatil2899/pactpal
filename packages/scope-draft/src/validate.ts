import { parseJsonReply, type ChatOutcome } from "@pactpal/ai";
import type { Validation } from "@pactpal/council";
import { allowedCategoryIds, UNCLEAR_CATEGORY } from "./category.js";
import { findInstructionLines } from "./instruction-lines.js";
import {
  buyerProvidesOf,
  draftTimelineOf,
  scopeDraftV4Schema,
  type Citation,
  type ScopeDraft,
} from "./schema.js";
import type { SourceLine } from "./source.js";

export interface ValidationContext {
  /** The numbered chat the draft was made from. */
  lines: readonly SourceLine[];
  /** Ids of the supported categories (from `DEAL_CATEGORIES`). */
  categoryIds: readonly string[];
  /** The deal's currency; the price must be in it. */
  dealCurrency: string;
  /**
   * Reject a draft that quotes a chat line that looks like an order to an AI. On by default; only the
   * injection check turns it off, to see how a model behaves without that protection.
   */
  rejectInstructionLines?: boolean;
}

export type ScopeDraftCheck =
  { ok: true; draft: ScopeDraft; validation: Validation } | { ok: false; validation: Validation };

/**
 * Lower-cases, joins runs of spaces and makes curly quotes and long dashes plain, so an honest
 * quote is not rejected for typography. Nothing else is forgiven.
 */
export function normalizeForMatch(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[‐-―−]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

/** Models sometimes copy the "L12| " prefix into the quote. */
const withoutLinePrefix = (quote: string) => quote.replace(/^\s*L\d+\|\s*/, "");

/** A citation to check, and where in the draft it was found (for error messages). */
interface Located {
  where: string;
  citation: Citation;
}

function listCitations(
  where: string,
  items: readonly { citations: readonly Citation[] }[],
): Located[] {
  return items.flatMap((item, index) =>
    item.citations.map((citation) => ({ where: `${where}[${String(index)}]`, citation })),
  );
}

/** A field the chat either states, with citations, or does not. */
type Stated = { status: "found"; citations: readonly Citation[] } | { status: "missing" };

const ofField = (where: string, field: Stated): Located[] =>
  field.status === "found" ? field.citations.map((citation) => ({ where, citation })) : [];

/** Every citation in the draft, in reading order. */
function collectCitations(draft: ScopeDraft): Located[] {
  return [
    ...ofField("summary", draft.summary),
    ...listCitations("deliverables", draft.deliverables),
    ...listCitations("exclusions", draft.exclusions),
    ...listCitations("buyerProvides", buyerProvidesOf(draft)),
    ...ofField("price", draft.price),
    ...ofField("paymentTerms", draft.paymentTerms),
    ...ofField("dueDate", draft.dueDate),
    ...ofField("revisionsIncluded", draft.revisionsIncluded),
    ...listCitations("vagueTerms", draft.vagueTerms),
    ...listCitations("timeline", draftTimelineOf(draft)),
    ...draft.category.citations.map((citation) => ({ where: "category", citation })),
  ];
}

/** Why a citation fails, or undefined when the quote is on the line. Never repeats the quote. */
function citationProblem(
  { where, citation }: Located,
  byNumber: ReadonlyMap<number, string>,
  instructionLines: ReadonlySet<number>,
): string | undefined {
  const line = byNumber.get(citation.line);
  if (line === undefined) return `${where}: line ${String(citation.line)} does not exist`;
  if (instructionLines.has(citation.line)) {
    return `${where}: line ${String(citation.line)} gives orders to an AI and cannot be quoted`;
  }
  const quote = normalizeForMatch(withoutLinePrefix(citation.quote));
  if (quote.length < 3 || !line.includes(quote)) {
    return `${where}: the quote is not on line ${String(citation.line)}`;
  }
  return undefined;
}

/** The whole-number part of an amount such as "1,240.50", as digits. */
const wholePart = (amount: string) => (amount.split(".")[0] ?? "").replace(/^0+(?=\d)/, "");

/**
 * Whether an amount's whole part is in the quotes cited for it. Digits only, commas ignored:
 * "1,240" in the chat supports "1240".
 */
function amountQuoted(amount: string, citations: readonly Citation[]): boolean {
  const digits = citations
    .map((c) => normalizeForMatch(withoutLinePrefix(c.quote)))
    .join(" ")
    .replaceAll(",", "");
  return new RegExp(`(?<![\\d.])${wholePart(amount)}(?!\\d)`).test(digits);
}

function priceProblems(draft: ScopeDraft, context: ValidationContext): string[] {
  const { price } = draft;
  if (price.status === "missing") return [];
  const problems: string[] = [];
  if (price.currency.toUpperCase() !== context.dealCurrency.toUpperCase()) {
    problems.push("price: the currency is not the deal's currency");
  }
  if (Number(price.amount) <= 0) problems.push("price: the amount is not above zero");
  if (!amountQuoted(price.amount, price.citations)) {
    problems.push("price: the amount does not appear in the quotes cited for it");
  }
  return problems;
}

/** Whole minor units of a decimal string such as "120.5", without floating point. */
const minorOf = (amount: string) => {
  const [whole = "0", fraction = ""] = amount.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
};

/**
 * A payment step's amount must be above zero and its digits must be in its quotes; no other
 * step has an amount; and when the price and every payment are stated, they add up.
 */
function timelineProblems(draft: ScopeDraft): string[] {
  const steps = draftTimelineOf(draft);
  const problems = steps.flatMap((step, index) => {
    const where = `timeline[${String(index)}]`;
    if (step.kind !== "payment") {
      return step.amount === null ? [] : [`${where}: only a payment has an amount`];
    }
    if (step.amount === null) return [];
    if (minorOf(step.amount) <= 0) return [`${where}: the amount is not above zero`];
    return amountQuoted(step.amount, step.citations)
      ? []
      : [`${where}: the amount does not appear in the quotes cited for it`];
  });
  const payments = steps.filter((step) => step.kind === "payment");
  const amounts = payments.map((step) => step.amount);
  if (
    draft.price.status === "found" &&
    payments.length > 0 &&
    amounts.every((amount) => amount !== null) &&
    amounts.reduce((sum, amount) => sum + minorOf(amount), 0) !== minorOf(draft.price.amount)
  ) {
    problems.push("timeline: the payments do not add up to the price");
  }
  return problems;
}

function categoryProblems(draft: ScopeDraft, context: ValidationContext): string[] {
  const { id, citations } = draft.category;
  const problems: string[] = [];
  if (!allowedCategoryIds(context.categoryIds).includes(id)) {
    problems.push("category: the id is not in the lists given");
  } else if (id !== UNCLEAR_CATEGORY && citations.length === 0) {
    problems.push("category: no citation for a category that is not unclear");
  }
  return problems;
}

function vagueTermProblems(draft: ScopeDraft, byNumber: ReadonlyMap<number, string>): string[] {
  return draft.vagueTerms.flatMap((term, index) => {
    const phrase = normalizeForMatch(term.phrase);
    const found = term.citations.some((c) => byNumber.get(c.line)?.includes(phrase) === true);
    return found ? [] : [`vagueTerms[${String(index)}]: the phrase is not on a cited line`];
  });
}

const invalid = (errors: string[]): ScopeDraftCheck => ({
  ok: false,
  validation: { valid: false, score: 0, errors },
});

/**
 * Checks a model's draft in code. The shape is checked first. Then every citation must name a
 * real line and a quote that is on it; the price must be in the deal's currency and its digits
 * must be in the quotes cited for it; a vague phrase must be on a cited line; the category must
 * be one of the ids given; payments in the timeline must quote their amounts and add up to the
 * price; and no quote may come from a line that gives orders to an AI. Dates and revision counts
 * are checked only for a real citation, because chats write them in too many ways. Any failure makes the draft invalid (the council
 * drops it); the score is the share of citations that passed. Messages name fields and lines,
 * never the quoted words, because the chat holds personal details.
 */
export function validateScopeDraft(value: unknown, context: ValidationContext): ScopeDraftCheck {
  const parsed = scopeDraftV4Schema.safeParse(value);
  if (!parsed.success) {
    return invalid(
      parsed.error.issues.map((issue) =>
        `${issue.path.join(".") || "(root)"}: ${issue.message}`.slice(0, 200),
      ),
    );
  }
  const draft = parsed.data;
  const byNumber = new Map(context.lines.map(({ n, text }) => [n, normalizeForMatch(text)]));

  const located = collectCitations(draft);
  const instructionLines = new Set(
    context.rejectInstructionLines === false ? [] : findInstructionLines(context.lines),
  );
  const citationErrors = located
    .map((item) => citationProblem(item, byNumber, instructionLines))
    .filter((problem): problem is string => problem !== undefined);
  const errors = [
    ...citationErrors,
    ...priceProblems(draft, context),
    ...vagueTermProblems(draft, byNumber),
    ...timelineProblems(draft),
    ...categoryProblems(draft, context),
  ];
  const score =
    located.length === 0 ? 1 : (located.length - citationErrors.length) / located.length;
  const validation: Validation = { valid: errors.length === 0, score, errors };
  return validation.valid ? { ok: true, draft, validation } : { ok: false, validation };
}

/** Reads a model's reply as JSON and checks it. A failed call or unreadable reply is invalid. */
export function readScopeDraft(outcome: ChatOutcome, context: ValidationContext): ScopeDraftCheck {
  const reply = parseJsonReply(outcome);
  return reply.ok ? validateScopeDraft(reply.value, context) : invalid([reply.message]);
}
