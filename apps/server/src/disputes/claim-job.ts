import type { ChatClient } from "@pactpal/ai";
import { claimCouncilTask, claimLines, recordLines } from "@pactpal/claims";
import { runCouncil, type CouncilDeps } from "@pactpal/council";
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

/** What one comparison needs: the database, the models with keys and the council's effects. */
export interface ClaimJobDeps {
  db: Database;
  clients: readonly ChatClient[];
  council: CouncilDeps;
  clock: () => Date;
  log: LogSink;
}

/** The Render Workflow task that runs a comparison; started as `<workflow>/analyze-claim`. */
export const CLAIM_TASK_NAME = "analyze-claim";

const requested = z
  .object({ requestedEvidence: z.array(z.string()).default([]) })
  .catch({ requestedEvidence: [] });

/** A fingerprint of numbered lines as the models read them. */
const fingerprintOf = (lines: readonly { text: string }[]) =>
  sha256Hex(lines.map(({ text }) => text).join("\n"));

/** Why a comparison could not even be asked for; the reasons never repeat the claim. */
class NotBuilt extends Error {
  override readonly name = "NotBuilt";
}

/** Everything the council reads, gathered from the database by code. */
async function inputsFor(db: Database, analysisId: string, clock: () => Date) {
  const analysis = await getClaimAnalysis(db, analysisId);
  if (analysis?.status !== "running") return undefined;
  const [dispute, deal] = await Promise.all([
    getDispute(db, analysis.disputeId),
    getDeal(db, analysis.dealId),
  ]);
  if (!dispute || !deal) throw new NotBuilt("the dispute or its deal is missing");
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
  return {
    analysis,
    claim: claimLines({
      reason: dispute.reason,
      buyerMessages,
      ...(pasted === undefined ? {} : { pasted }),
    }),
    agreement: agreementLines(document),
    record: recordLines(await readLedger(db, deal.id)),
    paypal: {
      allowedActions: dispute.allowedActions,
      requestedEvidence: requested.parse(dispute.details).requestedEvidence,
    },
  };
}

/**
 * Runs the council for one comparison and saves the outcome: the winning analysis with the council
 * record and a `CLAIM_ANALYZED` log entry, or a failure with a reason. Never throws (it runs in the
 * background); anything unexpected is logged by name and the analysis is marked failed. An
 * analysis that is no longer running (finished, or failed for taking too long) is left alone.
 */
export async function runClaimJob(deps: ClaimJobDeps, analysisId: string): Promise<void> {
  const { db, clients, council, clock, log } = deps;
  const fail = (reason: string, record?: unknown) =>
    failClaimAnalysis(
      db,
      { analysisId, reason, ...(record === undefined ? {} : { council: toJson(record) }) },
      clock(),
    );
  try {
    const inputs = await inputsFor(db, analysisId, clock);
    if (!inputs) return;
    if (clients.length === 0) {
      await fail("no AI model is configured");
      return;
    }
    const made = claimCouncilTask({ ...inputs, marker: council.newMarker() });
    if (!made.ok) {
      await fail(`the request could not be built (${made.reason})`);
      return;
    }
    const run = await runCouncil(made.task, clients, council);
    const record = toCouncilRecord(run);
    const winner = run.result.winner;
    if (winner === null) {
      await fail("no model produced a valid comparison", record);
      log.info({ analysisId, durationMs: run.durationMs }, "Claim comparison: no valid answer");
      return;
    }
    await finishClaimAnalysis(
      db,
      {
        analysisId,
        analysis: toJson(winner.answer.content),
        council: toJson(record),
        claimSha256: fingerprintOf(inputs.claim.lines),
        recordSha256: fingerprintOf(inputs.record.lines),
        models: clients.map((client) => client.spec.name),
        winner: winner.answer.modelName,
        statements: winner.answer.content.statements.length,
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
      "Claim comparison ready",
    );
  } catch (error) {
    const reason = error instanceof NotBuilt ? error.message : "the comparison failed unexpectedly";
    log.error(
      { analysisId, err: error instanceof Error ? error.name : "unknown" },
      "Claim comparison failed",
    );
    try {
      await fail(reason);
    } catch {
      // Already logged; a second failure (the database is down, say) only leaves it running,
      // and an analysis running too long is taken as failed when next read.
    }
  }
}
