import type { Ballot, CandidateScore, CouncilResult, LabelledAnswer } from "./types.js";

export interface AggregateOptions {
  /** Skip each voter's ranking of its own answer when scoring. Default true. */
  ignoreSelfVotes?: boolean;
  /** Model preferred when every other tie-break is equal. */
  defaultModel?: string;
  /** Below this agreement the result is flagged for human review. Default 0.5. */
  minAgreement?: number;
  /** If the top two scores are closer than this, flag for review. Default 0.05. */
  minMargin?: number;
}

function validateBallot(ballot: Ballot, labels: Set<string>): string | null {
  if (ballot.ranking.length !== labels.size) {
    return `ranked ${ballot.ranking.length} of ${labels.size} answers`;
  }
  const seen = new Set<string>();
  for (const label of ballot.ranking) {
    if (!labels.has(label)) return `unknown label "${label}"`;
    if (seen.has(label)) return `label "${label}" ranked twice`;
    seen.add(label);
  }
  return null;
}

/**
 * Kendall's coefficient of concordance for complete rankings.
 * 1 = every voter produced the same order, 0 = no agreement at all.
 */
export function kendallW(rankings: string[][]): number {
  const m = rankings.length;
  const n = rankings[0]?.length ?? 0;
  if (m < 2 || n < 2) return 1;
  const rankSums = new Map<string, number>();
  for (const ranking of rankings) {
    ranking.forEach((label, pos) => rankSums.set(label, (rankSums.get(label) ?? 0) + pos + 1));
  }
  const mean = (m * (n + 1)) / 2;
  let s = 0;
  for (const sum of rankSums.values()) s += (sum - mean) ** 2;
  return (12 * s) / (m * m * (n ** 3 - n));
}

/**
 * Combines the council's ballots into a single winner using a normalized
 * Borda count. Winner is always one whole answer; answers are never merged.
 * Tie-breaks, in order: Borda score, validation score, rank consistency,
 * default model, then label for a deterministic result.
 */
export function aggregate<T>(
  labelled: LabelledAnswer<T>[],
  ballots: Ballot[],
  options: AggregateOptions = {},
): Omit<CouncilResult<T>, "dropped"> {
  const { ignoreSelfVotes = true, defaultModel, minAgreement = 0.5, minMargin = 0.05 } = options;
  const reviewReasons: string[] = [];

  if (labelled.length === 0) {
    return {
      winner: null,
      scores: [],
      agreement: 0,
      needsReview: true,
      reviewReasons: ["no answer passed validation"],
      rejectedBallots: [],
    };
  }

  const labels = new Set(labelled.map((l) => l.label));
  const byLabel = new Map(labelled.map((l) => [l.label, l]));
  const ownLabel = new Map(labelled.map((l) => [l.answer.modelName, l.label]));

  const rejectedBallots: { voter: string; reason: string }[] = [];
  const accepted: Ballot[] = [];
  for (const ballot of ballots) {
    const problem = validateBallot(ballot, labels);
    if (problem) rejectedBallots.push({ voter: ballot.voter, reason: problem });
    else accepted.push(ballot);
  }

  const positions = new Map<string, number[]>(labelled.map((l) => [l.label, []]));
  for (const ballot of accepted) {
    const counted = ignoreSelfVotes
      ? ballot.ranking.filter((label) => label !== ownLabel.get(ballot.voter))
      : ballot.ranking;
    if (counted.length < 2) continue;
    counted.forEach((label, pos) => {
      // Normalized so 1 = first place and 0 = last, whatever the ballot length.
      positions.get(label)?.push(1 - pos / (counted.length - 1));
    });
  }

  const scores: CandidateScore[] = labelled.map(({ label, answer }) => {
    const points = positions.get(label) ?? [];
    const votes = points.length;
    const score = votes ? points.reduce((a, b) => a + b, 0) / votes : 0;
    const rankVariance = votes ? points.reduce((a, p) => a + (p - score) ** 2, 0) / votes : 0;
    return {
      label,
      modelName: answer.modelName,
      score,
      votes,
      rankVariance,
      validationScore: answer.validation.score,
    };
  });

  scores.sort(
    (a, b) =>
      b.score - a.score ||
      b.validationScore - a.validationScore ||
      a.rankVariance - b.rankVariance ||
      Number(b.modelName === defaultModel) - Number(a.modelName === defaultModel) ||
      a.label.localeCompare(b.label),
  );

  const agreement = kendallW(accepted.map((b) => b.ranking));

  if (labelled.length === 1)
    reviewReasons.push("only one answer passed validation, so nothing was cross-checked");
  if (accepted.length < 2 && labelled.length > 1)
    reviewReasons.push("fewer than two valid ballots");
  if (labelled.length > 1 && accepted.length >= 2 && agreement < minAgreement) {
    reviewReasons.push(`low agreement between voters (${agreement.toFixed(2)})`);
  }
  const [first, second] = scores;
  if (first && second && first.score - second.score < minMargin) {
    reviewReasons.push("top answers scored almost the same");
  }

  return {
    winner: first ? (byLabel.get(first.label) ?? null) : null,
    scores,
    agreement,
    needsReview: reviewReasons.length > 0,
    reviewReasons,
    rejectedBallots,
  };
}
