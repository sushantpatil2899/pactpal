import { COUNCIL_RANK_PROMPT_VERSION, runCouncil } from "@pactpal/council";
import { failMessageReview, finishMessageReview, type Database } from "@pactpal/db";
import type { AgreementLine } from "@pactpal/qa";
import type { SourceLine } from "@pactpal/scope-draft";
import {
  MESSAGE_PROMPT_VERSION,
  messageReviewCouncilTask,
  type WorkRecord,
} from "@pactpal/watcher";
import { toCouncilRecord, toJson } from "./council-record.js";
import type { JobLog } from "./draft-job.js";
import type { DraftingRuntime } from "./runtime.js";

export const MESSAGE_PROMPT_VERSIONS = {
  review: MESSAGE_PROMPT_VERSION,
  rank: COUNCIL_RANK_PROMPT_VERSION,
};

export interface MessageJob {
  reviewId: string;
  dealId: string;
  agreement: readonly AgreementLine[];
  record: WorkRecord;
  message: readonly SourceLine[];
}

/**
 * Runs the council for one buyer message and saves the outcome: the winning review with the
 * council record, or a failure with the reason. Never throws, because it runs in the
 * background; anything unexpected is logged by name and the review is marked failed.
 */
export async function runMessageJob(
  db: Database,
  runtime: DraftingRuntime,
  job: MessageJob,
  clock: () => Date,
  log: JobLog,
): Promise<void> {
  const { reviewId, dealId } = job;
  try {
    const made = messageReviewCouncilTask({ ...job, marker: runtime.council.newMarker() });
    if (!made.ok) {
      await failMessageReview(
        db,
        { reviewId, reason: `the request could not be built (${made.reason})` },
        clock(),
      );
      log.error({ dealId, reviewId, reason: made.reason }, "Message review request not built");
      return;
    }
    const run = await runCouncil(made.task, runtime.clients, runtime.council);
    const council = toJson(toCouncilRecord(run));
    const winner = run.result.winner;
    if (winner === null) {
      await failMessageReview(
        db,
        { reviewId, reason: "no model produced a valid review", council },
        clock(),
      );
      log.info(
        { dealId, reviewId, durationMs: run.durationMs },
        "Message review failed: no valid answer",
      );
      return;
    }
    await finishMessageReview(
      db,
      { reviewId, review: toJson(winner.answer.content), council },
      clock(),
    );
    log.info(
      {
        dealId,
        reviewId,
        winner: winner.answer.modelName,
        validReviews: run.labelled.length,
        needsReview: run.result.needsReview,
        durationMs: run.durationMs,
        tokens: run.usage.promptTokens + run.usage.completionTokens,
      },
      "Message review ready",
    );
  } catch (error) {
    log.error(
      { dealId, reviewId, err: error instanceof Error ? error.name : "unknown" },
      "Message review failed unexpectedly",
    );
    // The reason holds no detail: the error may mention the message. A second failure is only logged.
    await failMessageReview(
      db,
      { reviewId, reason: "the review failed unexpectedly" },
      clock(),
    ).catch((second: unknown) => {
      log.error(
        { dealId, reviewId, err: second instanceof Error ? second.name : "unknown" },
        "Message review could not be marked failed",
      );
    });
  }
}
