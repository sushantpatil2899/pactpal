/** One registered council member. Any OpenAI-compatible endpoint works. */
export interface ModelSpec {
  /** Unique name used in logs and results, e.g. "llama-groq". */
  name: string;
  /** Model family, so a council can be checked for diversity, e.g. "llama". */
  family: string;
  baseUrl: string;
  /** Name of the environment variable holding the key; never the key itself. */
  apiKeyEnv: string;
  model: string;
}

/** Result of the code checks run on an answer before any model votes. */
export interface Validation {
  valid: boolean;
  /** 0..1, share of checks passed (e.g. citations that resolve to real lines). */
  score: number;
  errors: string[];
}

export interface CandidateAnswer<T = unknown> {
  modelName: string;
  content: T;
  validation: Validation;
}

export interface LabelledAnswer<T = unknown> {
  /** Anonymous label shown to voters: "A", "B", "C", ... */
  label: string;
  answer: CandidateAnswer<T>;
}

/** A voter's ranking of anonymous labels, best first. */
export interface Ballot {
  voter: string;
  ranking: string[];
}

export interface CandidateScore {
  label: string;
  modelName: string;
  /** Mean normalized Borda score, 0..1 (1 = ranked first by every counted voter). */
  score: number;
  /** Number of ballots that counted toward this candidate. */
  votes: number;
  /** Variance of the normalized positions; lower means voters were more consistent. */
  rankVariance: number;
  validationScore: number;
}

export interface CouncilResult<T = unknown> {
  winner: LabelledAnswer<T> | null;
  /** Sorted best first, after tie-breaks. */
  scores: CandidateScore[];
  /** Kendall's W over the ballots, 0 (no agreement) to 1 (identical rankings). */
  agreement: number;
  needsReview: boolean;
  reviewReasons: string[];
  /** Models whose answers failed validation and never reached the vote. */
  dropped: { modelName: string; errors: string[] }[];
  /** Ballots discarded because they did not rank every label exactly once. */
  rejectedBallots: { voter: string; reason: string }[];
}
