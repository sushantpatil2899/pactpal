import { scopeTotalMinor, type ScopeContent, type ScopeVersion } from "@pactpal/db";
import { toPayPalMoney } from "@pactpal/paypal";
import { resolveTimeline, timelineOf } from "@pactpal/timeline";

/** An amount for the pages: whole minor units, and the same as text in PayPal's format. */
export const money = (minor: number, currency: string) => ({
  minor,
  text: toPayPalMoney({ minor, currency }).value,
});

/** Every step of a version's timeline (its own, or the one it implies), as both sides read it. */
export const stepTerms = (content: ScopeContent, currency: string) =>
  resolveTimeline(content).map((step) => ({
    n: step.n,
    kind: step.kind,
    owner: step.owner,
    title: step.title,
    dueDate: step.dueDate,
    stage: step.stage,
    amount: step.amountMinor === null ? null : money(step.amountMinor, currency),
  }));

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
    // Only a version that lists its steps signs them (7f), so earlier documents stay the same.
    ...(content.timeline === undefined ? {} : { timeline: stepTerms(content, currency) }),
  };
}

/** A version as the pages see it: its terms and when it was saved. */
export const scopeView = (scope: ScopeVersion, currency: string) => ({
  ...scopeTerms(scope, currency),
  savedAt: scope.createdAt.toISOString(),
  // Every version has steps to show and edit: its own, or the ones it implies.
  steps: stepTerms(scope.content, currency),
  timelineSteps: timelineOf(scope.content),
  ownTimeline: scope.content.timeline !== undefined,
});

/** The delivered lines marked as matters of taste settled when the buyer approves this stage. */
export const mattersOfTaste = (content: ScopeContent, stage: number): string[] =>
  content.deliverables.filter((_, n) => {
    const mark = content.deliverableKinds?.[n];
    return mark?.kind === "subjective" && mark.approvalStage === stage;
  });
