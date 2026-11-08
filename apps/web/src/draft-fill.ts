import type { LineMark } from "@pactpal/words";
import type { TimelineStep } from "@pactpal/timeline";
import type { ChatLine, Citation, DraftCandidate, DraftMark, DraftView } from "./api";
import { planFromDraft } from "./timeline-fill";

/** One wording suggestion from a draft: shown beside the form, never applied by itself. */
export interface Suggestion {
  phrase: string;
  /** `subjective`: a matter of taste, so it needs the buyer's approval. */
  kind: "subjective" | "unmeasurable";
  rewrite: string;
}

/** A drafted list item and the chat lines it was quoted from. */
export interface SourcedItem {
  text: string;
  lines: number[];
}

/** Which chat lines each drafted field came from, for the "From the chat" buttons. */
export interface FillSources {
  summary: number[];
  deliverables: SourcedItem[];
  exclusions: SourcedItem[];
  buyerProvides: SourcedItem[];
  /** Each drafted timeline step's words and chat lines, in order (7g). */
  timeline: SourcedItem[];
  revisionsIncluded: number[];
  dueDate: number[];
  price: number[];
  paymentTerms: number[];
}

/** The chat the draft was made from, numbered, with the lines hidden from the models. */
export interface FillChat {
  lines: ChatLine[];
  hidden: number[];
}

/** The distinct line numbers of some quotes, in order. */
export const linesOf = (citations: readonly Citation[]): number[] =>
  [...new Set(citations.map((citation) => citation.line))].sort((a, b) => a - b);

/** The lines behind a field the chat either states or does not. */
const statedLines = (field: { status: "found"; citations: Citation[] } | { status: "missing" }) =>
  field.status === "found" ? linesOf(field.citations) : [];

/** What "Use this draft" puts into the agreed-work form. Fields the chat did not state are left out. */
export interface DraftFill {
  draftId: string;
  /** The letter of the draft chosen when the council could not rank its drafts. */
  draftLabel?: string;
  summary?: string;
  deliverables: string[];
  /** The draft's suggested mark for each delivered line, in order (null: none suggested). */
  marks: LineMark[];
  exclusions: string[];
  /** What the buyer provides, by the draft, with the date the chat gives (if any). */
  buyerProvides: { text: string; dueDate?: string }[];
  revisionsIncluded?: number;
  dueDate?: string;
  /** One payment stage for the whole price, to be split by the seller (drafts without payments). */
  stage?: { title: string; amount: string };
  /** One stage per drafted payment, when the draft's timeline has payments (7g). */
  stages?: { title: string; amount: string; dueDate?: string }[];
  /** The drafted steps as the form's timeline (7g); absent when the draft has none. */
  timeline?: TimelineStep[];
  paymentTerms?: string;
  suggestions: Suggestion[];
  sources: FillSources;
  /** Undefined when the chat could not be read back. */
  chat: FillChat | undefined;
}

/**
 * A draft's suggested mark as the editor's mark. A matter of taste is tied to stage 1, the only
 * stage a draft makes; "unsure" (or an older draft's missing mark) is no mark.
 */
export function suggestedMark(mark: DraftMark | undefined): LineMark {
  switch (mark) {
    case "objective":
    case "process":
      return { kind: mark };
    case "subjective":
      return { kind: "subjective", approvalStage: 1 };
    case "unsure":
    case undefined:
      return null;
  }
}

/**
 * The form fill for a finished draft (or for the candidate the seller chose when the council
 * could not rank its drafts); undefined for one that has no draft.
 */
export function fillFrom(view: DraftView, candidate?: DraftCandidate): DraftFill | undefined {
  const draft = candidate?.draft ?? view.draft;
  if (draft === null) return undefined;
  const plan = planFromDraft(
    (draft.timeline ?? []).map((step) => ({ ...step, lines: linesOf(step.citations) })),
    (draft.buyerProvides ?? []).map((item) => ({
      text: item.text,
      lines: linesOf(item.citations),
      ...(item.dueDate === null ? {} : { dueDate: item.dueDate }),
    })),
    draft.price.status === "found" ? draft.price.amount : undefined,
  );
  return {
    draftId: view.id,
    ...(candidate === undefined ? {} : { draftLabel: candidate.label }),
    ...(draft.summary.status === "found" ? { summary: draft.summary.value } : {}),
    deliverables: draft.deliverables.map((item) => item.text),
    marks: draft.deliverables.map((item) => suggestedMark(item.mark)),
    exclusions: draft.exclusions.map((item) => item.text),
    buyerProvides: plan.buyerProvides,
    ...(plan.stages === undefined ? {} : { stages: plan.stages }),
    ...(plan.timeline === undefined ? {} : { timeline: plan.timeline }),
    ...(draft.revisionsIncluded.status === "found"
      ? { revisionsIncluded: draft.revisionsIncluded.value }
      : {}),
    ...(draft.dueDate.status === "found" ? { dueDate: draft.dueDate.value } : {}),
    ...(draft.price.status === "found"
      ? { stage: { title: "Payment in full", amount: draft.price.amount } }
      : {}),
    ...(draft.paymentTerms.status === "found" ? { paymentTerms: draft.paymentTerms.value } : {}),
    suggestions: draft.vagueTerms.map((term) => ({
      phrase: term.phrase,
      kind: term.kind,
      rewrite: term.suggestedRewrite,
    })),
    sources: {
      summary: statedLines(draft.summary),
      deliverables: draft.deliverables.map((item) => ({
        text: item.text,
        lines: linesOf(item.citations),
      })),
      exclusions: draft.exclusions.map((item) => ({
        text: item.text,
        lines: linesOf(item.citations),
      })),
      buyerProvides: (draft.buyerProvides ?? []).map((item) => ({
        text: item.text,
        lines: linesOf(item.citations),
      })),
      timeline: (draft.timeline ?? []).map((step) => ({
        text: step.text,
        lines: linesOf(step.citations),
      })),
      revisionsIncluded: statedLines(draft.revisionsIncluded),
      dueDate: statedLines(draft.dueDate),
      price: statedLines(draft.price),
      paymentTerms: statedLines(draft.paymentTerms),
    },
    chat:
      view.source.lines === null
        ? undefined
        : { lines: view.source.lines, hidden: view.source.hiddenLines ?? [] },
  };
}
