import type { ChatClient } from "@pactpal/ai";
import {
  claimAnalysisSchema,
  claimCouncilTask,
  claimLines,
  comparisonRows,
  comparisonText,
  recordLines,
  summaryCouncilTask,
  type ClaimAnalysis,
  type PacketSummary,
} from "@pactpal/claims";
import { runCouncil, type CouncilDeps, type CouncilTask } from "@pactpal/council";
import {
  failClaimAnalysis,
  finishClaimAnalysis,
  getArtifact,
  getClaimAnalysis,
  getDeal,
  getDispute,
  postgresContentStore,
  readLedger,
  type Database,
} from "@pactpal/db";
import { sha256Hex } from "@pactpal/ledger";
import { agreementLines } from "@pactpal/qa";
import { z } from "zod";
import { documentFor } from "../acceptance/document.js";
import { toCouncilRecord, toJson } from "../drafting/council-record.js";
import type { LogSink } from "../payments/payment-sync.js";
import { signedRecord } from "../payments/signed-record.js";
import { messagesOf } from "./dispute-view.js";
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

const requested = z
  .object({ requestedEvidence: z.array(z.string()).default([]) })
  .catch({ requestedEvidence: [] });

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
        requestedEvidence: requested.parse(dispute.details).requestedEvidence,
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

const ADDED_BY = { seller: "the seller", buyer: "the buyer", system: "PactPal" } as const;

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
  const base =
    analysis.basedOn === undefined ? undefined : await getClaimAnalysis(db, analysis.basedOn);
  const comparison = claimAnalysisSchema.safeParse(base?.analysis);
  if (!comparison.success) throw new NotBuilt("the comparison it is based on cannot be read");
  const record = recordLines(await readLedger(db, deal.id));
  const recordText = new Map(record.lines.map(({ n, text }) => [n, text]));
  const rows = comparisonText(comparisonRows(comparison.data, recordText));
  const choices = await packetChoices(db, postgresContentStore(db, clock), deal);
  const exhibits = choices.exhibits
    .filter((e) => e.send !== "left-out")
    .map((e) => ({
      id: e.id,
      filename: e.filename,
      addedBy: ADDED_BY[e.addedBy],
      type: e.send === "text-as-pdf" ? "text, sent as PDF" : e.mediaType,
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

/** Each job kind's name in logs and failure reasons. */
const JOB_WORDS = { claim: "comparison", summary: "summary" } as const;

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
    if (analysis.kind === "summary") {
      await runPrepared(
        deps,
        analysisId,
        what,
        await prepareSummary(db, analysis, clock, marker),
        fail,
      );
    } else {
      await runPrepared(
        deps,
        analysisId,
        what,
        await prepareClaim(db, analysis, clock, marker),
        fail,
      );
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
