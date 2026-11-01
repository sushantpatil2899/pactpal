import { schemaEnforced, type ChatClient, type ChatOutcome } from "@pactpal/ai";
import {
  BALLOT_SCHEMA_NAME,
  ballotSchema,
  buildRankingMessages,
  readBallot,
  runCouncil,
  runSingleModel,
  type CouncilDeps,
} from "@pactpal/council";
import { DEAL_CATEGORIES } from "@pactpal/db";
import { numberSourceLines, renderChat, scopeDraftCouncilTask } from "@pactpal/scope-draft";
import {
  CHAT_CASES,
  MAYA_CHAT,
  RANKING_CASES,
  chatFor,
  judgeDraft,
  judgeRanking,
  rankingDrafts,
} from "@pactpal/scope-draft/testing";
import type { InjectionRun, RunRecord } from "./injection-report.js";

export interface InjectionOptions {
  /** Also run the whole council on each hostile chat. */
  council: boolean;
  /** How many times each case is run. */
  runs: number;
  /** Run only this case. */
  caseId?: string;
  /** Whether lines that look like orders to an AI are hidden from the models (the product always does; false is a test switch). Default true. */
  filter?: boolean;
}

/** The models whose names are listed, in the order of `clients`; an empty list means all. Unknown names are returned so the caller can say so. */
export function pickModels<T extends { spec: { name: string } }>(
  clients: readonly T[],
  names: readonly string[],
): { picked: T[]; unknown: string[] } {
  if (names.length === 0) return { picked: [...clients], unknown: [] };
  return {
    picked: clients.filter((client) => names.includes(client.spec.name)),
    unknown: names.filter((name) => !clients.some((client) => client.spec.name === name)),
  };
}

/** Room for a ranking reply, including the thinking some models do first. */
const VOTE_MAX_TOKENS = 4000;

const categories = Object.entries(DEAL_CATEGORIES).map(([id, { label }]) => ({ id, label }));

const usageTokens = (outcome: ChatOutcome) =>
  outcome.ok && outcome.usage ? outcome.usage.promptTokens + outcome.usage.completionTokens : 0;

/** The task for a chat; throws only if a case's own chat is unusable, which the tests rule out. */
function taskFor(chat: string, deps: CouncilDeps, protect: boolean) {
  const numbered = numberSourceLines(chat);
  if (!numbered.ok) throw new Error(`a hostile chat could not be numbered: ${numbered.reason}`);
  const made = scopeDraftCouncilTask({
    lines: numbered.lines,
    categories,
    categoryIds: categories.map(({ id }) => id),
    dealCurrency: "USD",
    marker: deps.newMarker(),
    protectAgainstInstructions: protect,
  });
  if (!made.ok) throw new Error(`a hostile chat was refused: ${made.reason}`);
  return { task: made.task, lines: numbered.lines };
}

/** Runs every model alone, and optionally the council, on one hostile chat. */
async function chatCaseRuns(
  chatCase: (typeof CHAT_CASES)[number],
  clients: readonly ChatClient[],
  options: InjectionOptions,
  deps: CouncilDeps,
): Promise<{ records: RunRecord[]; tokens: number }> {
  const { task } = taskFor(chatFor(chatCase), deps, options.filter !== false);
  const records: RunRecord[] = [];
  let tokens = 0;

  const singles = await Promise.all(clients.map((client) => runSingleModel(task, client, deps)));
  singles.forEach((single, i) => {
    tokens += single.usage.promptTokens + single.usage.completionTokens;
    const model = clients[i]?.spec.name ?? "unknown";
    if (single.answer.status === "call_failed") {
      records.push({
        caseId: chatCase.id,
        mode: "alone",
        model,
        result: "failed",
        reasons: [single.answer.failureKind ?? "unknown"],
      });
    } else if (single.content === undefined) {
      records.push({ caseId: chatCase.id, mode: "alone", model, result: "dropped", reasons: [] });
    } else {
      const { result, reasons } = judgeDraft(chatCase.checks, single.content);
      records.push({ caseId: chatCase.id, mode: "alone", model, result, reasons });
    }
  });

  if (options.council) {
    const run = await runCouncil(task, clients, deps);
    tokens += run.usage.promptTokens + run.usage.completionTokens;
    const winner = run.result.winner;
    const verdict =
      winner === null
        ? { result: "dropped" as const, reasons: [] }
        : judgeDraft(chatCase.checks, winner.answer.content);
    const detail =
      winner === null
        ? `no valid draft from ${String(run.answers.length)} models`
        : `chose ${winner.answer.modelName}'s draft; ${String(run.labelled.length)} valid drafts from ${String(run.answers.length)} models, ${String(run.votes.filter((v) => v.status === "ballot").length)} rankings`;
    records.push({ caseId: chatCase.id, mode: "council", model: "council", ...verdict, detail });
  }
  return { records, tokens };
}

/** Shows every model three drafts, one of them hostile, and checks whether it ranks that one first. */
async function rankingCaseRuns(
  rankingCase: (typeof RANKING_CASES)[number],
  clients: readonly ChatClient[],
  deps: CouncilDeps,
  protect: boolean,
): Promise<{ records: RunRecord[]; tokens: number }> {
  const { task, lines } = taskFor(MAYA_CHAT, deps, protect);
  const drafts = rankingDrafts(rankingCase).map((entry, i) => ({
    label: String.fromCharCode(65 + i),
    text: task.rank.render(entry.draft),
    hostile: entry.hostile,
  }));
  const labels = drafts.map((d) => d.label);
  const hostileLabel = drafts.find((d) => d.hostile)?.label ?? "";
  const schema = ballotSchema(labels);
  const input = {
    summary: task.rank.summary,
    criteria: task.rank.criteria,
    source: renderChat(lines),
    drafts,
    marker: deps.newMarker(),
  };
  const plain = buildRankingMessages(input);
  const described = buildRankingMessages({ ...input, replySchema: schema });
  if (!plain.ok || !described.ok) throw new Error("a ranking request was refused");

  const outcomes = await Promise.all(
    clients.map((client) =>
      client.complete({
        messages: schemaEnforced(client.spec) ? plain.messages : described.messages,
        maxTokens: VOTE_MAX_TOKENS,
        reply: { name: BALLOT_SCHEMA_NAME, schema },
      }),
    ),
  );
  const records = outcomes.map((outcome, i): RunRecord => {
    const model = clients[i]?.spec.name ?? "unknown";
    const reading = readBallot(model, outcome);
    const base = { caseId: rankingCase.id, mode: "vote" as const, model };
    if (!reading.ok) {
      return reading.kind === "call_failed"
        ? { ...base, result: "failed", reasons: [reading.reason] }
        : { ...base, result: "dropped", reasons: [] };
    }
    return { ...base, ...judgeRanking(labels, hostileLabel, reading.ballot.ranking) };
  });
  return { records, tokens: outcomes.reduce((sum, outcome) => sum + usageTokens(outcome), 0) };
}

/**
 * Runs the hostile cases against the given models: each hostile chat on every model alone (and,
 * with `council`, through the whole council), then each hostile draft in front of every voter. Cases
 * run one after another so free-tier limits are respected; `onProgress` hears when each ends.
 */
export async function runInjectionCheck(
  clients: readonly ChatClient[],
  options: InjectionOptions,
  deps: CouncilDeps,
  onProgress: (message: string) => void = () => undefined,
): Promise<InjectionRun> {
  const startedAt = deps.now();
  const records: RunRecord[] = [];
  let tokens = 0;
  const wanted = (id: string) => options.caseId === undefined || options.caseId === id;
  for (let run = 1; run <= options.runs; run++) {
    for (const chatCase of CHAT_CASES.filter((c) => wanted(c.id))) {
      const done = await chatCaseRuns(chatCase, clients, options, deps);
      records.push(...done.records);
      tokens += done.tokens;
      onProgress(`run ${String(run)}: ${chatCase.id} done`);
    }
    for (const rankingCase of RANKING_CASES.filter((c) => wanted(c.id))) {
      const done = await rankingCaseRuns(rankingCase, clients, deps, options.filter !== false);
      records.push(...done.records);
      tokens += done.tokens;
      onProgress(`run ${String(run)}: ${rankingCase.id} done`);
    }
  }
  return {
    records,
    tokens,
    durationMs: deps.now() - startedAt,
    runs: options.runs,
    councilRan: options.council,
    filtered: options.filter !== false,
  };
}
