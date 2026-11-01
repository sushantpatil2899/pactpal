import type { DraftView } from "./api";

/** One wording suggestion from a draft: shown beside the form, never applied by itself. */
export interface Suggestion {
  phrase: string;
  /** `subjective`: a matter of taste, so it needs the buyer's approval. */
  kind: "subjective" | "unmeasurable";
  rewrite: string;
}

/** What "Use this draft" puts into the agreed-work form. Fields the chat did not state are left out. */
export interface DraftFill {
  draftId: string;
  summary?: string;
  deliverables: string[];
  exclusions: string[];
  revisionsIncluded?: number;
  dueDate?: string;
  /** One payment stage for the whole price, to be split by the seller. */
  stage?: { title: string; amount: string };
  paymentTerms?: string;
  suggestions: Suggestion[];
}

/** The form fill for a finished draft; undefined for one that has no draft. */
export function fillFrom(view: DraftView): DraftFill | undefined {
  const { draft } = view;
  if (draft === null) return undefined;
  return {
    draftId: view.id,
    ...(draft.summary.status === "found" ? { summary: draft.summary.value } : {}),
    deliverables: draft.deliverables.map((item) => item.text),
    exclusions: draft.exclusions.map((item) => item.text),
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
  };
}
