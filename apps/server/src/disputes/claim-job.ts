import type { ChatClient } from "@pactpal/ai";
import {
  claimAnalysisSchema,
  claimCouncilTask,
  claimLines,
  comparisonRows,
  comparisonText,
  recordLines,
  responseCouncilTask,
  summaryCouncilTask,
  appealCheckSchema,
  appealCouncilTask,
  statementCouncilTask,
  type AppealCheck,
  type AppealStatement,
  type ClaimAnalysis,
  type PacketSummary,
  type ResponseDraft,
} from "@pactpal/claims";
import { runCouncil, type CouncilDeps, type CouncilTask } from "@pactpal/council";
import {
  failClaimAnalysis,
  finishClaimAnalysis,
  getArtifact,
  getClaimAnalysis,
  getDeal,
  getDispute,
  listClaimAnalyses,
  postgresContentStore,
  readLedger,
  type Database,
  type StoredDispute,
} from "@pactpal/db";
import { sha256Hex } from "@pactpal/ledger";
import { agreementLines } from "@pactpal/qa";
import { ANSWER_OPTIONS, answerFacts } from "@pactpal/words";
import { documentFor } from "../acceptance/document.js";
import { toCouncilRecord, toJson } from "../drafting/council-record.js";
import type { LogSink } from "../payments/payment-sync.js";
import { signedRecord } from "../payments/signed-record.js";
import { disputedAmountWords, messagesOf, requestedEvidenceOf } from "./dispute-view.js";
import { ADDED_BY, exhibitWhat } from "./packet.js";
import { appealFacts } from "./appeal-items.js";
import { packetChoices } from "./packet-service.js";

/** What one comparison needs: the database, the models with keys and the council's effects. */
export interface ClaimJobDeps {
  db: Database;
  clients: readonly ChatClient[];
  council: CouncilDeps;
  clock: () => Date;
  log: LogSink;
}

/** The Render Workflow tasks that run a comparison and a summary (`<workflow>/<task>`). */
export const CLAIM_TASK_NAME = "analyze-claim";
export const SUMMARY_TASK_NAME = "draft-summary";
export const RESPONSE_TASK_NAME = "draft-response";
export const APPEAL_TASK_NAME = "check-appeal";
export const STATEMENT_TASK_NAME = "draft-appeal";

/** A fingerprint of numbered lines as the models read them. */
const fingerprintOf = (lines: readonly { text: string }[]) =>
  sha256Hex(lines.map(({ text }) => text).join("\n"));

/** Why a job could not even be asked for; the reasons never repeat the claim. */
class NotBuilt extends Error {
  override readonly name = "NotBuilt";
}

type Analysis = NonNullable<Awaited<ReturnType<typeof getClaimAnalysis>>>;

/** One job's request to the council, prepared from the database by code. */
interface Prepared<T> {
  made: { ok: true; task: CouncilTask<T> } | { ok: false; reason: string };
  /** Fingerprints of what the models read, for the log. */
  fingerprints: { claimSha256: string; recordSha256: string; exhibitsSha256?: string };
  /** How many statements (comparison) or sentences (summary) the winner has. */
  count: (content: T) => number;
}

/** The deal and dispute of a job, or a reason the job cannot run. */
async function dealOf(db: Database, analysis: Analysis) {
  const [dispute, deal] = await Promise.all([
    getDispute(db, analysis.disputeId),
    getDeal(db, analysis.dealId),
  ]);
  if (!dispute || !deal) throw new NotBuilt("the dispute or its deal is missing");
  return { dispute, deal };
}

/** The claim comparison (5d): the claim, the agreement, the record and PayPal's options. */
async function prepareClaim(
  db: Database,
  analysis: Analysis,
  clock: () => Date,
  marker: string,
): Promise<Prepared<ClaimAnalysis>> {
  const { dispute, deal } = await dealOf(db, analysis);
  const signed = await signedRecord(db, deal);
  if (!signed) throw new NotBuilt("the deal has no signed agreement");
  const { document } = await documentFor(db, deal, signed.scope);
  const pasted =
    analysis.pastedArtifactId === undefined
      ? undefined
      : new TextDecoder().decode(
          (
            await getArtifact(
              db,
              postgresContentStore(db, clock),
              analysis.pastedArtifactId,
              deal.id,
            )
          ).bytes,
        );
  const buyerMessages = (messagesOf(dispute.details) ?? [])
    .filter((m) => m.from === "BUYER")
    .map((m) => m.text);
  const claim = claimLines({
    reason: dispute.reason,
    buyerMessages,
    ...(pasted === undefined ? {} : { pasted }),
  });
  const record = recordLines(await readLedger(db, deal.id));
  return {
    made: claimCouncilTask({
      claim,
      agreement: agreementLines(document),
      record,
      paypal: {
        allowedActions: dispute.allowedActions,
        requestedEvidence: requestedEvidenceOf(dispute.details),
      },
      marker,
    }),
    fingerprints: {
      claimSha256: fingerprintOf(claim.lines),
      recordSha256: fingerprintOf(record.lines),
    },
    count: (content) => content.statements.length,
  };
}

/**
 * The packet summary (5f): the comparison it is based on, as plain rows, the record and the
 * documents that can go to PayPal.
 */
async function prepareSummary(
  db: Database,
  analysis: Analysis,
  clock: () => Date,
  marker: string,
): Promise<Prepared<PacketSummary>> {
  const { deal } = await dealOf(db, analysis);
  const record = recordLines(await readLedger(db, deal.id));
  const recordText = new Map(record.lines.map(({ n, text }) => [n, text]));
  const rows =
    analysis.basedOn === undefined
      ? undefined
      : await comparisonRowsOf(db, analysis.disputeId, recordText, analysis.basedOn);
  if (!rows) throw new NotBuilt("the comparison it is based on cannot be read");
  const choices = await packetChoices(db, postgresContentStore(db, clock), deal);
  const exhibits = choices.exhibits
    .filter((e) => e.send !== "left-out")
    .map((e) => ({
      id: e.id,
      filename: e.filename,
      addedBy: ADDED_BY[e.addedBy],
      type: exhibitWhat(e),
    }));
  return {
    made: summaryCouncilTask({ comparison: rows, record: record.lines, exhibits, marker }),
    fingerprints: {
      claimSha256: sha256Hex(rows.join("\n")),
      recordSha256: fingerprintOf(record.lines),
      exhibitsSha256: sha256Hex(JSON.stringify(exhibits)),
    },
    count: (content) => content.summary.length,
  };
}

/** The buyer's claim as PayPal shows it: the reason and the buyer's messages, as numbered lines. */
const buyersClaim = (dispute: StoredDispute) =>
  claimLines({
    reason: dispute.reason,
    buyerMessages: (messagesOf(dispute.details) ?? [])
      .filter((m) => m.from === "BUYER")
      .map((m) => m.text),
  });

/** The newest ready comparison of a dispute as plain rows, or none. */
async function comparisonRowsOf(
  db: Database,
  disputeId: string,
  recordText: ReadonlyMap<number, string>,
  basedOn?: string,
): Promise<string[] | undefined> {
  const base =
    basedOn === undefined
      ? (await listClaimAnalyses(db, disputeId, "claim")).find((c) => c.status === "ready")
      : await getClaimAnalysis(db, basedOn);
  const comparison = claimAnalysisSchema.safeParse(base?.analysis);
  return comparison.success
    ? comparisonText(comparisonRows(comparison.data, recordText))
    : undefined;
}

/**
 * Answer help (5h): the buyer's claim, the newest comparison (if any), the record and what PayPal
 * lets the seller do now, each described in fixed words by code.
 */
async function prepareResponse(
  db: Database,
  analysis: Analysis,
  marker: string,
): Promise<Prepared<ResponseDraft>> {
  const { dispute, deal } = await dealOf(db, analysis);
  const record = recordLines(await readLedger(db, deal.id));
  const recordText = new Map(record.lines.map(({ n, text }) => [n, text]));
  const comparison = (await comparisonRowsOf(db, dispute.disputeId, recordText)) ?? [];
  const claim = buyersClaim(dispute);
  const amount = disputedAmountWords(dispute);
  const options = ANSWER_OPTIONS.filter((code) => dispute.allowedActions.includes(code)).map(
    (code) => ({ code, words: answerFacts(code, amount) }),
  );
  if (options.length === 0) throw new NotBuilt("PayPal allows no answer right now");
  return {
    made: responseCouncilTask({
      claim: claim.modelView,
      comparison,
      record: record.lines,
      options,
      marker,
    }),
    fingerprints: {
      claimSha256: fingerprintOf(claim.lines),
      recordSha256: fingerprintOf(record.lines),
    },
    count: (content) => content.options.length,
  };
}

/**
 * The appeal check (5i): the buyer's claim, PayPal's decision, what was sent and the record, and
 * the items code found that were not sent before, which the models judge.
 */
async function prepareAppeal(
  db: Database,
  analysis: Analysis,
  clock: () => Date,
  marker: string,
): Promise<Prepared<AppealCheck>> {
  const { dispute, deal } = await dealOf(db, analysis);
  const facts = await appealFacts(db, postgresContentStore(db, clock), deal, dispute);
  if (facts.items.length === 0) throw new NotBuilt("nothing new to check");
  const record = recordLines(await readLedger(db, deal.id));
  const claim = buyersClaim(dispute);
  return {
    made: appealCouncilTask({
      claim: claim.modelView,
      decision: facts.decision,
      sent: facts.sent,
      record: record.lines,
      items: facts.items,
      marker,
    }),
    fingerprints: {
      claimSha256: fingerprintOf(claim.lines),
      recordSha256: fingerprintOf(record.lines),
      exhibitsSha256: sha256Hex(JSON.stringify(facts.items)),
    },
    count: (content) => content.items.filter((item) => item.answers).length,
  };
}

/**
 * The appeal statement (5i-2): the appeal check's facts, with only the new items the check it is
 * based on found speaking to the claim, each with the check's reason.
 */
async function prepareStatement(
  db: Database,
  analysis: Analysis,
  clock: () => Date,
  marker: string,
): Promise<Prepared<AppealStatement>> {
  const { dispute, deal } = await dealOf(db, analysis);
  const base =
    analysis.basedOn === undefined ? undefined : await getClaimAnalysis(db, analysis.basedOn);
  const check = appealCheckSchema.safeParse(base?.analysis);
  if (!check.success) throw new NotBuilt("the appeal check it is based on cannot be read");
  const facts = await appealFacts(db, postgresContentStore(db, clock), deal, dispute);
  const reasons = new Map(check.data.items.filter((i) => i.answers).map((i) => [i.id, i.why]));
  const items = facts.items.flatMap((item) => {
    const why = reasons.get(item.id);
    return why === undefined
      ? []
      : [{ id: item.id, words: `${item.words}. Why it speaks to the claim: ${why}` }];
  });
  if (items.length === 0) throw new NotBuilt("no new item speaks to the claim");
  const record = recordLines(await readLedger(db, deal.id));
  const claim = buyersClaim(dispute);
  return {
    made: statementCouncilTask({
      claim: claim.modelView,
      decision: facts.decision,
      sent: facts.sent,
      record: record.lines,
      items,
      marker,
    }),
    fingerprints: {
      claimSha256: fingerprintOf(claim.lines),
      recordSha256: fingerprintOf(record.lines),
      exhibitsSha256: sha256Hex(JSON.stringify(items)),
    },
    count: (content) => content.statement.length,
  };
}

/** Each job kind's name in logs and failure reasons. */
const JOB_WORDS = {
  claim: "comparison",
  summary: "summary",
  response: "answer help",
  appeal: "appeal check",
  statement: "appeal statement",
} as const;

/** Runs the council on a prepared request and saves the result or the failure. */
async function runPrepared<T>(
  deps: ClaimJobDeps,
  analysisId: string,
  what: string,
  prepared: Prepared<T>,
  fail: (reason: string, record?: unknown) => Promise<unknown>,
) {
  const { db, clients, council, clock, log } = deps;
  const { made } = prepared;
  if (!made.ok) {
    await fail(`the request could not be built (${made.reason})`);
    return;
  }
  const run = await runCouncil(made.task, clients, council);
  const record = toCouncilRecord(run);
  const winner = run.result.winner;
  if (winner === null) {
    await fail(`no model produced a valid ${what}`, record);
    log.info({ analysisId, durationMs: run.durationMs }, `Dispute ${what}: no valid answer`);
    return;
  }
  await finishClaimAnalysis(
    db,
    {
      analysisId,
      analysis: toJson(winner.answer.content),
      council: toJson(record),
      ...prepared.fingerprints,
      models: clients.map((client) => client.spec.name),
      winner: winner.answer.modelName,
      statements: prepared.count(winner.answer.content),
      needsReview: run.result.needsReview,
    },
    clock(),
  );
  log.info(
    {
      analysisId,
      winner: winner.answer.modelName,
      valid: run.labelled.length,
      needsReview: run.result.needsReview,
      durationMs: run.durationMs,
      tokens: run.usage.promptTokens + run.usage.completionTokens,
    },
    `Dispute ${what} ready`,
  );
}

/**
 * Runs the council for one dispute job (a claim comparison or a packet summary) and saves the
 * outcome: the winner with the council record and its log entry, or a failure with a reason.
 * Never throws (it runs in the background); anything unexpected is logged by name and the job is
 * marked failed. A job that is no longer running (finished, or failed for taking too long) is
 * left alone.
 */
export async function runDisputeJob(deps: ClaimJobDeps, analysisId: string): Promise<void> {
  const { db, clients, council, clock, log } = deps;
  const fail = (reason: string, record?: unknown) =>
    failClaimAnalysis(
      db,
      { analysisId, reason, ...(record === undefined ? {} : { council: toJson(record) }) },
      clock(),
    );
  let what: string = JOB_WORDS.claim;
  try {
    const analysis = await getClaimAnalysis(db, analysisId);
    if (analysis?.status !== "running") return;
    what = JOB_WORDS[analysis.kind];
    if (clients.length === 0) {
      await fail("no AI model is configured");
      return;
    }
    const marker = council.newMarker();
    switch (analysis.kind) {
      case "summary":
        await runPrepared(
          deps,
          analysisId,
          what,
          await prepareSummary(db, analysis, clock, marker),
          fail,
        );
        break;
      case "response":
        await runPrepared(
          deps,
          analysisId,
          what,
          await prepareResponse(db, analysis, marker),
          fail,
        );
        break;
      case "appeal":
        await runPrepared(
          deps,
          analysisId,
          what,
          await prepareAppeal(db, analysis, clock, marker),
          fail,
        );
        break;
      case "statement":
        await runPrepared(
          deps,
          analysisId,
          what,
          await prepareStatement(db, analysis, clock, marker),
          fail,
        );
        break;
      case "claim":
        await runPrepared(
          deps,
          analysisId,
          what,
          await prepareClaim(db, analysis, clock, marker),
          fail,
        );
        break;
    }
  } catch (error) {
    const reason = error instanceof NotBuilt ? error.message : `the ${what} failed unexpectedly`;
    log.error(
      { analysisId, err: error instanceof Error ? error.name : "unknown" },
      `Dispute ${what} failed`,
    );
    try {
      await fail(reason);
    } catch {
      // Already logged; a second failure (the database is down, say) only leaves it running,
      // and a job running too long is taken as failed when next read.
    }
  }
}
