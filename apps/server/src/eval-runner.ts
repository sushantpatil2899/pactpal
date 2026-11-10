import type { ChatClient } from "@pactpal/ai";
import { runCouncil, type AnswerRecord, type CouncilDeps } from "@pactpal/council";
import { numberSourceLines, scopeDraftCouncilTask } from "@pactpal/scope-draft";
import {
  EVAL_CASES,
  scoreDraft,
  type DraftScore,
  type EvalCase,
} from "@pactpal/scope-draft/testing";
import { draftCategories } from "./drafting/categories.js";

export interface EvalOptions {
  /** How many times each chat is run. */
  runs: number;
  /** Run only this chat. */
  caseId?: string;
}

/** One model's own draft of one chat. `dropped`: it failed the citation checker. `failed`: no usable reply came back. */
export interface AloneRecord {
  kind: "alone";
  caseId: string;
  run: number;
  model: string;
  status: "scored" | "dropped" | "failed";
  /** Only when `scored`. */
  score?: DraftScore;
  tokens: number;
  seconds: number;
  /** Why a call failed; never the model's words. */
  failure?: string;
  /** Why the checker dropped it (field, line and rule; never the chat's or the model's words). */
  reasons?: readonly string[];
}

/** The council's result on the same drafts, with what it cost for the whole chat (answers and rankings). */
export interface CouncilEvalRecord {
  kind: "council";
  caseId: string;
  run: number;
  /** The model whose draft was chosen; null when no draft was valid. */
  winner: string | null;
  /** The chosen draft's score. */
  score?: DraftScore;
  /** The best and the average score among the valid drafts the vote could choose from. */
  best?: number;
  average?: number;
  valid: number;
  flagged: boolean;
  reviewReasons: readonly string[];
  calls: number;
  tokens: number;
  seconds: number;
}

export type EvalRecord = AloneRecord | CouncilEvalRecord;

export interface EvalRun {
  records: readonly EvalRecord[];
  runs: number;
  durationMs: number;
}

const tokensOf = (answer: AnswerRecord) =>
  answer.usage === undefined ? 0 : answer.usage.promptTokens + answer.usage.completionTokens;

/** What the council's single run says about each model's own draft and about the council's pick. */
async function runCase(
  evalCase: EvalCase,
  run: number,
  clients: readonly ChatClient[],
  deps: CouncilDeps,
): Promise<EvalRecord[]> {
  const numbered = numberSourceLines(evalCase.chat);
  if (!numbered.ok) throw new Error(`the chat of case ${evalCase.id} could not be numbered`);
  const made = scopeDraftCouncilTask({
    lines: numbered.lines,
    categories: draftCategories,
    categoryIds: draftCategories.map(({ id }) => id),
    dealCurrency: evalCase.dealCurrency,
    marker: deps.newMarker(),
  });
  if (!made.ok) throw new Error(`the chat of case ${evalCase.id} was refused: ${made.reason}`);

  const council = await runCouncil(made.task, clients, deps);
  const scores = new Map(
    council.labelled.map(({ answer }) => [
      answer.modelName,
      scoreDraft(evalCase.gold, answer.content),
    ]),
  );
  const base = { caseId: evalCase.id, run };

  const alone = council.answers.map((answer): AloneRecord => {
    const common = {
      ...base,
      kind: "alone" as const,
      model: answer.modelName,
      tokens: tokensOf(answer),
      seconds: (answer.latencyMs ?? 0) / 1000,
    };
    const score = scores.get(answer.modelName);
    if (answer.status === "call_failed") {
      return { ...common, status: "failed", failure: answer.failureKind ?? "unknown" };
    }
    return score === undefined
      ? { ...common, status: "dropped", reasons: answer.errors }
      : { ...common, status: "scored", score };
  });

  const valid = [...scores.values()].map(({ score }) => score);
  const winner = council.result.winner;
  const chosen = winner === null ? undefined : scores.get(winner.answer.modelName);
  const councilRecord: CouncilEvalRecord = {
    ...base,
    kind: "council",
    winner: winner?.answer.modelName ?? null,
    ...(chosen === undefined ? {} : { score: chosen }),
    ...(valid.length === 0
      ? {}
      : {
          best: Math.max(...valid),
          average: valid.reduce((sum, value) => sum + value, 0) / valid.length,
        }),
    valid: valid.length,
    flagged: council.result.needsReview,
    reviewReasons: council.result.reviewReasons,
    calls: council.usage.calls,
    tokens: council.usage.promptTokens + council.usage.completionTokens,
    seconds: council.durationMs / 1000,
  };
  return [...alone, councilRecord];
}

/**
 * Asks every model for a draft of each right-answer chat, runs the council vote on those same
 * drafts, and scores both against the right answer. Chats run one after another so free-tier
 * limits are respected; `onProgress` hears when each ends.
 */
export async function runEvals(
  clients: readonly ChatClient[],
  options: EvalOptions,
  deps: CouncilDeps,
  onProgress: (message: string) => void = () => undefined,
): Promise<EvalRun> {
  const startedAt = deps.now();
  const records: EvalRecord[] = [];
  const cases = EVAL_CASES.filter(
    ({ id }) => options.caseId === undefined || options.caseId === id,
  );
  for (let run = 1; run <= options.runs; run++) {
    for (const evalCase of cases) {
      records.push(...(await runCase(evalCase, run, clients, deps)));
      onProgress(`run ${String(run)}: ${evalCase.id} done`);
    }
  }
  return { records, runs: options.runs, durationMs: deps.now() - startedAt };
}
