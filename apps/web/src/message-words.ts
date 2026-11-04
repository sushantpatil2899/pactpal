import type { RequestLabel } from "@pactpal/watcher";

/** A request's label in the seller's words. */
export const LABEL_WORDS: Record<RequestLabel, string> = {
  "within-scope": "In the agreement",
  "extra-revision": "A change to delivered work",
  "out-of-scope": "Not in the agreement",
  unclear: "Not clear; ask the buyer",
};

/** Where a change to delivered work would stand against the revisions included. */
export function revisionNote(revisions: { used: number; included: number | null }): string {
  const next = revisions.used + 1;
  if (revisions.included === null) {
    return `If asked for on a delivery, this would be revision ${String(next)}; the agreement states no limit.`;
  }
  return next > revisions.included
    ? `If asked for on a delivery, this would be revision ${String(next)}, beyond the ${String(revisions.included)} included.`
    : `If asked for on a delivery, this would be revision ${String(next)} of the ${String(revisions.included)} included.`;
}
