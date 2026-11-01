import type { ChatFailureKind, ChatOutcome, ChatRequest, ModelSpec, TokenUsage } from "@pactpal/ai";
import type { CouncilResult, Validation } from "./types.js";

/** A model's reply after the code checks: the content when it is valid, and the check's verdict either way. */
export type CheckedAnswer<T> =
  { ok: true; content: T; validation: Validation } | { ok: false; validation: Validation };

/**
 * One kind of job the council can do (drafting a scope, matching a claim to the record, ...).
 * The runner is the same for every task; the task says what to ask, how to check a reply and
 * what the voters should look at.
 */
export interface CouncilTask<T> {
  /** The request that asks this model for an answer; may differ per model (schema in the prompt or sent to the API). */
  answerRequest(spec: ModelSpec): ChatRequest;
  /** Checks a reply in code. A failed call must come back as invalid. */
  check(outcome: ChatOutcome): CheckedAnswer<T>;
  /** What voters are shown. */
  rank: {
    /** One sentence on what the drafts are. */
    summary: string;
    /** What makes a draft better, one line each (numbered by the runner). */
    criteria: readonly string[];
    /** The source text the drafts were made from, exactly as the answering models saw it. */
    source: string;
    /** Prints one valid answer for the voters. */
    render(content: T): string;
  };
}

/** Effects the runner needs, injected so tests are exact. */
export interface CouncilDeps {
  /** Uniform in [0, 1); shuffles the answers before they are labelled. */
  rng: () => number;
  /** A fresh random marker (8 to 32 lowercase letters and digits) for each ranking request. */
  newMarker: () => string;
  /** Milliseconds since the epoch. */
  now: () => number;
}

/** What happened to one model's answer. */
export interface AnswerRecord {
  modelName: string;
  /** `call_failed`: no usable reply came back; `invalid`: it failed the code checks. */
  status: "valid" | "invalid" | "call_failed";
  /** Why it was not valid; never repeats the source text. */
  errors: string[];
  validationScore: number;
  failureKind?: ChatFailureKind;
  latencyMs?: number;
  usage?: TokenUsage;
}

/** What happened to one model's vote. */
export interface VoteRecord {
  voter: string;
  /** `ballot`: a ranking came back (it may still be rejected by the count, see `result.rejectedBallots`). */
  status: "ballot" | "call_failed" | "unreadable" | "not_asked";
  reason?: string;
  latencyMs?: number;
  usage?: TokenUsage;
}

/** Tokens used across the calls of a run. */
export interface UsageTotals {
  calls: number;
  /** Calls whose reply gave no token counts (not included in the sums). */
  callsWithoutUsage: number;
  promptTokens: number;
  completionTokens: number;
}

export interface CouncilRun<T> {
  result: CouncilResult<T>;
  answers: AnswerRecord[];
  votes: VoteRecord[];
  /** Which anonymous label was which model (never shown to voters). */
  labels: { label: string; modelName: string }[];
  usage: UsageTotals;
  durationMs: number;
}

/** One model asked alone, checked the same way, with no vote. */
export interface SingleRun<T> {
  answer: AnswerRecord;
  /** The content when the answer is valid. */
  content?: T;
  validation: Validation;
  usage: UsageTotals;
  durationMs: number;
}
