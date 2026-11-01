import { COUNCIL_RANK_PROMPT_VERSION, runCouncil } from "@pactpal/council";
import { DEAL_CATEGORIES, failDraft, finishDraft, type Database, type Deal } from "@pactpal/db";
import {
  SCOPE_DRAFT_PROMPT_VERSION,
  categoryVerdict,
  scopeDraftCouncilTask,
  type SourceLine,
} from "@pactpal/scope-draft";
import { toCouncilRecord, toJson } from "./council-record.js";
import type { DraftingRuntime } from "./runtime.js";

export const PROMPT_VERSIONS = {
  draft: SCOPE_DRAFT_PROMPT_VERSION,
  rank: COUNCIL_RANK_PROMPT_VERSION,
};

/** The categories the models may choose from, as the draft prompt wants them. */
const categories = Object.entries(DEAL_CATEGORIES).map(([id, { label }]) => ({ id, label }));

export interface DraftJob {
  draftId: string;
  deal: Pick<Deal, "id" | "category" | "currency">;
  sellerId: string;
  source: { artifactId: string; sha256: string; lines: readonly SourceLine[] };
}

/** The slice of the server's logger the job uses; it is only given ids, names and numbers. */
export interface JobLog {
  info(fields: object, message: string): void;
  error(fields: object, message: string): void;
}

/**
 * Runs the council for one draft and saves the outcome: a ready draft with its ledger entry, or a
 * failed draft with the reason. Never throws, because it runs in the background; anything
 * unexpected is logged by name and the draft is marked failed.
 */
export async function runDraftJob(
  db: Database,
  runtime: DraftingRuntime,
  job: DraftJob,
  clock: () => Date,
  log: JobLog,
): Promise<void> {
  const { draftId, deal, sellerId, source } = job;
  try {
    const made = scopeDraftCouncilTask({
      lines: source.lines,
      categories,
      categoryIds: categories.map(({ id }) => id),
      dealCurrency: deal.currency,
      marker: runtime.council.newMarker(),
    });
    if (!made.ok) {
      await failDraft(
        db,
        { draftId, reason: `the request could not be built (${made.reason})` },
        clock(),
      );
      log.error({ dealId: deal.id, draftId, reason: made.reason }, "Draft request not built");
      return;
    }

    const run = await runCouncil(made.task, runtime.clients, runtime.council);
    const record = toJson(toCouncilRecord(run));
    const winner = run.result.winner;
    if (winner === null) {
      await failDraft(
        db,
        { draftId, reason: "no model produced a valid draft", council: record },
        clock(),
      );
      log.info(
        { dealId: deal.id, draftId, durationMs: run.durationMs },
        "Draft failed: no valid answer",
      );
      return;
    }

    const verdict = categoryVerdict(winner.answer.content.category.id, deal.category);
    await finishDraft(
      db,
      {
        draftId,
        draft: toJson(winner.answer.content),
        council: record,
        ledgerPayload: {
          requestedBy: sellerId,
          sourceArtifactId: source.artifactId,
          sourceSha256: source.sha256,
          draftPromptVersion: PROMPT_VERSIONS.draft,
          rankPromptVersion: PROMPT_VERSIONS.rank,
          models: runtime.clients.map((client) => client.spec.name),
          winnerModel: winner.answer.modelName,
          validDrafts: run.labelled.length,
          needsReview: run.result.needsReview,
          categoryVerdict: verdict,
        },
      },
      clock(),
    );
    log.info(
      {
        dealId: deal.id,
        draftId,
        winner: winner.answer.modelName,
        validDrafts: run.labelled.length,
        needsReview: run.result.needsReview,
        durationMs: run.durationMs,
        tokens: run.usage.promptTokens + run.usage.completionTokens,
      },
      "Draft ready",
    );
  } catch (error) {
    log.error(
      { dealId: deal.id, draftId, err: error instanceof Error ? error.name : "unknown" },
      "Draft job failed unexpectedly",
    );
    // The reason holds no detail: the error may mention the chat. A second failure here is only logged.
    await failDraft(db, { draftId, reason: "the draft failed unexpectedly" }, clock()).catch(
      (second: unknown) => {
        log.error(
          { dealId: deal.id, draftId, err: second instanceof Error ? second.name : "unknown" },
          "Draft could not be marked failed",
        );
      },
    );
  }
}
