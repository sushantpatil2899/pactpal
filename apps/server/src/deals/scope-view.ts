import { scopeTotalMinor, type ScopeContent, type ScopeVersion } from "@pactpal/db";
import { toPayPalMoney } from "@pactpal/paypal";

/** An amount for the pages: whole minor units, and the same as text in PayPal's format. */
export const money = (minor: number, currency: string) => ({
  minor,
  text: toPayPalMoney({ minor, currency }).value,
});

/** The terms of a version, with amounts in minor units and as text: what both sides read. */
export function scopeTerms(scope: ScopeVersion, currency: string) {
  const { content } = scope;
  return {
    version: scope.version,
    contentSha256: scope.contentSha256,
    currency,
    summary: content.summary,
    deliverables: content.deliverables,
    exclusions: content.exclusions,
    revisionsIncluded: content.revisionsIncluded ?? null,
    dueDate: content.dueDate ?? null,
    milestones: content.milestones.map((stage) => ({
      title: stage.title,
      amount: money(stage.amountMinor, currency),
      dueDate: stage.dueDate ?? null,
    })),
    total: money(scopeTotalMinor(content), currency),
    // Each only when the version has it, so documents for older versions are rebuilt byte for byte.
    ...(content.deliverableKinds === undefined
      ? {}
      : { deliverableKinds: content.deliverableKinds }),
    ...(content.buyerProvides === undefined
      ? {}
      : {
          buyerProvides: content.buyerProvides.map((item) => ({
            text: item.text,
            dueDate: item.dueDate ?? null,
          })),
        }),
  };
}

/** A version as the pages see it: its terms and when it was saved. */
export const scopeView = (scope: ScopeVersion, currency: string) => ({
  ...scopeTerms(scope, currency),
  savedAt: scope.createdAt.toISOString(),
});

/** The delivered lines marked as matters of taste settled when the buyer approves this stage. */
export const mattersOfTaste = (content: ScopeContent, stage: number): string[] =>
  content.deliverables.filter((_, n) => {
    const mark = content.deliverableKinds?.[n];
    return mark?.kind === "subjective" && mark.approvalStage === stage;
  });
