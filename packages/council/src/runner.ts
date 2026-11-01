import { schemaEnforced, type ChatClient, type ChatOutcome, type TokenUsage } from "@pactpal/ai";
import { aggregate, type AggregateOptions } from "./aggregate.js";
import { anonymize } from "./anonymize.js";
import { readBallot } from "./ballot.js";
import { BALLOT_SCHEMA_NAME, ballotSchema, buildRankingMessages } from "./rank-prompt.js";
import type {
  AnswerRecord,
  CheckedAnswer,
  CouncilDeps,
  CouncilRun,
  CouncilTask,
  SingleRun,
  UsageTotals,
  VoteRecord,
} from "./task.js";
import type { Ballot, CandidateAnswer, CouncilResult, LabelledAnswer } from "./types.js";

/** Room for a ranking reply, including the thinking some models do before they answer. */
const RANK_MAX_TOKENS = 4000;
/** Tries to find a marker that does not occur in the text (it practically always works first time). */
const MARKER_TRIES = 3;

function usageOf(outcome: ChatOutcome): TokenUsage | undefined {
  return outcome.ok ? outcome.usage : undefined;
}

/** Adds up token counts; calls whose reply gave none are counted separately, not as zero. */
function totalUsage(outcomes: readonly ChatOutcome[]): UsageTotals {
  const totals: UsageTotals = {
    calls: 0,
    callsWithoutUsage: 0,
    promptTokens: 0,
    completionTokens: 0,
  };
  for (const outcome of outcomes) {
    totals.calls += 1;
    const usage = usageOf(outcome);
    if (usage === undefined) {
      totals.callsWithoutUsage += 1;
    } else {
      totals.promptTokens += usage.promptTokens;
      totals.completionTokens += usage.completionTokens;
    }
  }
  return totals;
}

function answerRecord<T>(
  modelName: string,
  outcome: ChatOutcome,
  checked: CheckedAnswer<T>,
): AnswerRecord {
  const base = { modelName, validationScore: checked.validation.score };
  if (!outcome.ok) {
    return {
      ...base,
      status: "call_failed",
      errors: [outcome.message],
      failureKind: outcome.kind,
    };
  }
  return {
    ...base,
    status: checked.ok ? "valid" : "invalid",
    errors: checked.validation.errors,
    latencyMs: outcome.latencyMs,
    ...(outcome.usage === undefined ? {} : { usage: outcome.usage }),
  };
}

/** Asks one client the task's question and checks its reply. */
async function askOne<T>(task: CouncilTask<T>, client: ChatClient) {
  const outcome = await client.complete(task.answerRequest(client.spec));
  return { modelName: client.spec.name, outcome, checked: task.check(outcome) };
}

/** Asks one model alone, checked the same way as in the council, with no vote. */
export async function runSingleModel<T>(
  task: CouncilTask<T>,
  client: ChatClient,
  deps: Pick<CouncilDeps, "now">,
): Promise<SingleRun<T>> {
  const startedAt = deps.now();
  const { modelName, outcome, checked } = await askOne(task, client);
  return {
    answer: answerRecord(modelName, outcome, checked),
    ...(checked.ok ? { content: checked.content } : {}),
    validation: checked.validation,
    usage: totalUsage([outcome]),
    durationMs: deps.now() - startedAt,
  };
}

interface VotingRound {
  ballots: Ballot[];
  votes: VoteRecord[];
  outcomes: ChatOutcome[];
}

/** Shows the labelled drafts to every client and collects their rankings. */
async function collectBallots<T>(
  task: CouncilTask<T>,
  clients: readonly ChatClient[],
  labelled: readonly LabelledAnswer<T>[],
  deps: CouncilDeps,
): Promise<VotingRound> {
  const drafts = labelled.map(({ label, answer }) => ({
    label,
    text: task.rank.render(answer.content),
  }));
  const schema = ballotSchema(labelled.map(({ label }) => label));
  const input = { ...task.rank, drafts };

  // Marker problems are practically impossible; if they persist nobody is asked.
  let markers = 0;
  let marker = deps.newMarker();
  let plain = buildRankingMessages({ ...input, marker });
  while (!plain.ok && plain.reason === "marker-in-text" && ++markers < MARKER_TRIES) {
    marker = deps.newMarker();
    plain = buildRankingMessages({ ...input, marker });
  }
  const withSchema = buildRankingMessages({ ...input, marker, replySchema: schema });
  if (!plain.ok || !withSchema.ok) {
    const reason = `the ranking request could not be built (${plain.ok ? "marker" : plain.reason})`;
    return {
      ballots: [],
      votes: clients.map((client) => ({
        voter: client.spec.name,
        status: "not_asked",
        reason,
      })),
      outcomes: [],
    };
  }

  const replies = await Promise.all(
    clients.map(async (client) => {
      const prompt = schemaEnforced(client.spec) ? plain : withSchema;
      const outcome = await client.complete({
        messages: prompt.messages,
        maxTokens: RANK_MAX_TOKENS,
        reply: { name: BALLOT_SCHEMA_NAME, schema },
      });
      return { voter: client.spec.name, outcome, reading: readBallot(client.spec.name, outcome) };
    }),
  );

  const ballots: Ballot[] = [];
  const votes: VoteRecord[] = replies.map(({ voter, outcome, reading }) => {
    const usage = usageOf(outcome);
    const timing = {
      ...(outcome.ok ? { latencyMs: outcome.latencyMs } : {}),
      ...(usage === undefined ? {} : { usage }),
    };
    if (reading.ok) {
      ballots.push(reading.ballot);
      return { voter, status: "ballot", ...timing };
    }
    return { voter, status: reading.kind, reason: reading.reason, ...timing };
  });
  return { ballots, votes, outcomes: replies.map(({ outcome }) => outcome) };
}

/**
 * Runs the whole council for one task: every client answers, code drops answers that fail the
 * task's check, the rest are anonymized in a random order, every client ranks them, and the
 * Borda count (`aggregate`) picks one whole answer. With no valid answer there is no winner;
 * with one, it wins flagged for review. In both cases nobody is asked to vote.
 */
export async function runCouncil<T>(
  task: CouncilTask<T>,
  clients: readonly ChatClient[],
  deps: CouncilDeps,
  options: AggregateOptions = {},
): Promise<CouncilRun<T>> {
  const startedAt = deps.now();
  const replies = await Promise.all(clients.map((client) => askOne(task, client)));

  const answers = replies.map(({ modelName, outcome, checked }) =>
    answerRecord(modelName, outcome, checked),
  );
  const valid: CandidateAnswer<T>[] = [];
  const dropped: CouncilResult<T>["dropped"] = [];
  for (const { modelName, checked, outcome } of replies) {
    if (checked.ok)
      valid.push({ modelName, content: checked.content, validation: checked.validation });
    else
      dropped.push({
        modelName,
        errors: outcome.ok ? checked.validation.errors : [outcome.message],
      });
  }

  const labelled = anonymize(valid, deps.rng);
  // A vote can only change the outcome when there are at least two answers to choose between.
  const round: VotingRound =
    labelled.length > 1
      ? await collectBallots(task, clients, labelled, deps)
      : {
          ballots: [],
          votes: clients.map((client) => ({
            voter: client.spec.name,
            status: "not_asked",
            reason: "fewer than two valid answers, so there was nothing to rank",
          })),
          outcomes: [],
        };

  const counted = aggregate(labelled, round.ballots, options);
  return {
    result: { ...counted, dropped },
    answers,
    votes: round.votes,
    labels: labelled.map(({ label, answer }) => ({ label, modelName: answer.modelName })),
    usage: totalUsage([...replies.map(({ outcome }) => outcome), ...round.outcomes]),
    durationMs: deps.now() - startedAt,
  };
}
