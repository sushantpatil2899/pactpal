import type { ChatRequest } from "@pactpal/ai";
import type { ScopeDraft } from "@pactpal/scope-draft";
import type { CouncilRecord } from "./drafting/council-record.js";

/** Council settings for tests: no shuffling, a fixed marker and a clock that moves 10 ms at each reading. */
export function councilDeps() {
  let tick = 0;
  return { rng: () => 0.5, newMarker: () => "abcdef123456", now: () => (tick += 10) };
}

/** Whether a request asks a model to rank drafts (rather than to write one). */
export const isRankingRequest = (request: ChatRequest) =>
  request.messages[0]?.content.includes("careful reviewer") === true;

/**
 * A stored council record for tests: the given valid drafts under the letters A, B, ...; each was
 * ranked by `votes` voters, or by nobody (`votes: 0`, as when only two drafts are valid).
 */
export function councilRecordOf(
  drafts: readonly { modelName: string; draft: ScopeDraft }[],
  votes: number,
): CouncilRecord {
  const label = (i: number) => String.fromCharCode(65 + i);
  return {
    answers: drafts.map(({ modelName }) => ({
      modelName,
      status: "valid",
      errors: [],
      validationScore: 1,
    })),
    votes: [],
    labels: drafts.map(({ modelName }, i) => ({ label: label(i), modelName })),
    candidates: drafts.map(({ modelName, draft }, i) => ({ label: label(i), modelName, draft })),
    scores: drafts.map(({ modelName }, i) => ({
      label: label(i),
      modelName,
      score: votes === 0 ? 0 : 1 - i / drafts.length,
      votes,
      rankVariance: 0,
      validationScore: 1,
    })),
    agreement: 1,
    needsReview: votes === 0,
    reviewReasons: votes === 0 ? ["fewer than two valid ballots"] : [],
    rejectedBallots: [],
    dropped: [],
    usage: { calls: 1, callsWithoutUsage: 0, promptTokens: 1, completionTokens: 1 },
    durationMs: 1,
  };
}
