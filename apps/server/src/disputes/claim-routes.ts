import {
  CLAIM_PROMPT_VERSION,
  RESPONSE_PROMPT_VERSION,
  SUMMARY_PROMPT_VERSION,
  claimAnalysisSchema,
  packetSummarySchema,
  recordLines,
  responseDraftSchema,
} from "@pactpal/claims";
import { COUNCIL_RANK_PROMPT_VERSION } from "@pactpal/council";
import { ANSWER_OPTIONS, answerFacts } from "@pactpal/words";
import {
  AnalysisNotAllowedError,
  addArtifact,
  failClaimAnalysis,
  failStaleClaimAnalyses,
  listClaimAnalyses,
  postgresContentStore,
  readLedger,
  startClaimAnalysis,
  type AnalysisKind,
  type ClaimAnalysisRecord,
  type StoredDispute,
} from "@pactpal/db";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { readBody, sendRefusal, type DealLookup, type FoundDeal } from "../deals/access.js";
import { councilRecordSchema } from "../drafting/council-record.js";
import { RunnerBusyError, type ClaimRunner } from "./checker.js";
import { sellersDispute } from "./dispute-lookup.js";
import { disputedAmountWords, messagesOf } from "./dispute-view.js";

export interface ClaimRouteOptions {
  sellersDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
  /** Starts a comparison; absent until the AI models (or Render) are set up. */
  claims: ClaimRunner | undefined;
}

/** The seller's copy of the claim, when PayPal shows none: as long as a pasted chat may be. */
const startBody = z.object({ pasted: z.string().trim().min(1).max(20_000).optional() });

const REFUSALS: Record<AnalysisNotAllowedError["reason"], { status: number; error: string }> = {
  "not-your-deal": { status: 403, error: "only the seller can do this" },
  "not-this-deal": { status: 404, error: "not found" },
  "already-running": { status: 409, error: "a comparison is already running" },
  "too-many": { status: 429, error: "this dispute already has the most of these allowed" },
  "no-comparison": { status: 409, error: "compare the claim with the record first" },
};

/** What the council did, for the council panel; the candidates stay stored, not shown. */
const councilView = councilRecordSchema
  .extend({ candidates: z.array(z.unknown()) })
  // Undefined fields are left out of the answer, so the drafts are not sent to the page.
  .transform((record) => ({ ...record, candidates: undefined }));

/** The fields every dispute council job shows on the page, and its council record. */
const jobView = (job: ClaimAnalysisRecord) => {
  const council = councilView.safeParse(job.council);
  return {
    id: job.id,
    status: job.status,
    createdAt: job.createdAt.toISOString(),
    finishedAt: job.finishedAt?.toISOString() ?? null,
    failureReason: job.failureReason ?? null,
    council: council.success ? council.data : null,
  };
};

/** A record entry's own line, for showing a citation. */
const entryOf = (recordText: ReadonlyMap<number, string>) => (n: number) => ({
  n,
  text: recordText.get(n) ?? `#${String(n)}`,
});

/** One comparison for the page: the analysis with each cited record entry's words, and the council. */
function analysisView(analysis: ClaimAnalysisRecord, recordText: ReadonlyMap<number, string>) {
  const parsed = claimAnalysisSchema.safeParse(analysis.analysis);
  return {
    ...jobView(analysis),
    analysis: parsed.success
      ? {
          ...parsed.data,
          statements: parsed.data.statements.map((statement) => ({
            ...statement,
            record: statement.record.map(entryOf(recordText)),
          })),
        }
      : null,
  };
}

/** One packet summary for the page: sentences with their entries' words, picks, note, council. */
function summaryView(job: ClaimAnalysisRecord, recordText: ReadonlyMap<number, string>) {
  const parsed = packetSummarySchema.safeParse(job.analysis);
  return {
    ...jobView(job),
    basedOn: job.basedOn ?? null,
    summary: parsed.success
      ? {
          ...parsed.data,
          summary: parsed.data.summary.map((sentence) => ({
            text: sentence.text,
            record: sentence.record.map(entryOf(recordText)),
          })),
        }
      : null,
  };
}

/** What a started job is, for its prompt versions, log lines and refusals. */
const JOBS = {
  claim: { promptVersion: CLAIM_PROMPT_VERSION, words: "Claim comparison", noun: "comparison" },
  summary: { promptVersion: SUMMARY_PROMPT_VERSION, words: "Packet summary", noun: "summary" },
  response: { promptVersion: RESPONSE_PROMPT_VERSION, words: "Answer help", noun: "answer help" },
} as const;

/**
 * One answer help draft for the page (5h): the message, each option with its fixed facts (by
 * code) and the AI's sentences with their entries' words, the offer note and the council.
 */
function responseView(
  job: ClaimAnalysisRecord,
  recordText: ReadonlyMap<number, string>,
  amount: string | null,
) {
  const parsed = responseDraftSchema.safeParse(job.analysis);
  return {
    ...jobView(job),
    draft: parsed.success
      ? {
          message: parsed.data.message,
          offerNote: parsed.data.offerNote,
          options: parsed.data.options.map((option) => ({
            code: option.code,
            facts: answerFacts(option.code, amount),
            fits: option.fits,
            record: option.record.map(entryOf(recordText)),
          })),
        }
      : null,
  };
}

/**
 * Comparing a dispute claim with the record (5d), drafting the packet summary from it (5f) and
 * answer help (5h), for the seller only. All are drafts by a council of AI models, kept apart
 * from the evidence; the log gets their fingerprints only.
 */
export const claimRoutes: FastifyPluginAsync<ClaimRouteOptions> = (app, options) => {
  const { sellersDeal, clock, newId, claims } = options;
  const dispute = "/api/deals/:id/disputes/:disputeId";

  /** The dispute's comparisons or summaries, with what the page may offer. */
  async function answer(
    reply: FastifyReply,
    found: FoundDeal,
    stored: StoredDispute,
    kind: AnalysisKind,
  ) {
    await failStaleClaimAnalyses(found.db, clock());
    const [jobs, ledger, comparisons] = await Promise.all([
      listClaimAnalyses(found.db, stored.disputeId, kind),
      readLedger(found.db, found.deal.id),
      listClaimAnalyses(found.db, stored.disputeId, "claim"),
    ]);
    const recordText = new Map(recordLines(ledger).lines.map(({ n, text }) => [n, text]));
    if (kind === "response") {
      const amount = disputedAmountWords(stored);
      return reply.send({
        canDraft:
          claims !== undefined &&
          ANSWER_OPTIONS.some((code) => stored.allowedActions.includes(code)),
        responses: jobs.map((job) => responseView(job, recordText, amount)),
      });
    }
    if (kind === "summary") {
      return reply.send({
        canDraft: claims !== undefined && comparisons.some((c) => c.status === "ready"),
        summaries: jobs.map((job) => summaryView(job, recordText)),
      });
    }
    const buyerSpoke = (messagesOf(stored.details) ?? []).some((m) => m.from === "BUYER");
    return reply.send({
      canCompare: claims !== undefined,
      canPaste: !buyerSpoke,
      analyses: jobs.map((job) => analysisView(job, recordText)),
    });
  }

  /**
   * Records a running job and starts it (a Render Workflow run, or in this server); a job that
   * cannot be started is marked failed with the reason, never left running.
   */
  async function startJob(
    request: FastifyRequest,
    reply: FastifyReply,
    both: { found: FoundDeal; dispute: StoredDispute },
    job: { kind: AnalysisKind; basedOn?: string; pastedArtifactId?: string },
  ) {
    const { found } = both;
    const { db, deal, viewer } = found;
    if (!claims) return reply.code(503).send({ error: "no AI model is configured" });
    const what = JOBS[job.kind];
    let analysisId: string | undefined;
    try {
      const started = await startClaimAnalysis(
        db,
        {
          id: newId(),
          dealId: deal.id,
          disputeId: both.dispute.disputeId,
          sellerId: viewer.user.id,
          kind: job.kind,
          ...(job.basedOn === undefined ? {} : { basedOn: job.basedOn }),
          ...(job.pastedArtifactId === undefined ? {} : { pastedArtifactId: job.pastedArtifactId }),
          promptVersion: what.promptVersion,
          rankPromptVersion: COUNCIL_RANK_PROMPT_VERSION,
        },
        clock(),
      );
      analysisId = started.id;
      await claims.start(started.id, job.kind);
      request.log.info({ dealId: deal.id, analysisId }, `${what.words} started`);
      return await answer(reply.code(202), found, both.dispute, job.kind);
    } catch (error) {
      if (error instanceof AnalysisNotAllowedError) {
        return sendRefusal(reply, REFUSALS[error.reason]);
      }
      if (analysisId === undefined) throw error;
      const busy = error instanceof RunnerBusyError;
      await failClaimAnalysis(
        db,
        { analysisId, reason: busy ? "every council place was taken" : "could not be started" },
        clock(),
      );
      request.log.warn(
        { dealId: deal.id, analysisId, err: error instanceof Error ? error.name : "unknown" },
        `${what.words} not started`,
      );
      return busy
        ? reply.code(429).send({ error: "busy, try again in a minute" })
        : reply.code(502).send({ error: `the ${what.noun} could not be started; try again` });
    }
  }

  app.get(`${dispute}/analyses`, async (request, reply) => {
    const both = await sellersDispute(sellersDeal, request, reply);
    return both ? answer(reply, both.found, both.dispute, "claim") : reply;
  });

  app.post(`${dispute}/analyses`, async (request, reply) => {
    const both = await sellersDispute(sellersDeal, request, reply);
    if (!both) return reply;
    const body = await readBody(startBody, request, reply);
    if (!body) return reply;
    if (!claims) return reply.code(503).send({ error: "no AI model is configured" });
    const { db, deal, viewer } = both.found;
    if (
      body.pasted !== undefined &&
      (messagesOf(both.dispute.details) ?? []).some((m) => m.from === "BUYER")
    ) {
      return reply
        .code(409)
        .send({ error: "PayPal shows the buyer's messages, so there is nothing to paste" });
    }
    // The pasted claim is the buyer's words as the seller received them: a source file.
    const pasted =
      body.pasted === undefined
        ? undefined
        : await addArtifact(
            db,
            postgresContentStore(db, clock),
            {
              id: newId(),
              dealId: deal.id,
              kind: "source",
              filename: `buyer-claim-${clock().toISOString().slice(0, 10)}.txt`,
              bytes: new TextEncoder().encode(body.pasted),
              addedBy: { actor: "seller", actorId: viewer.user.id },
            },
            clock(),
          );
    return startJob(request, reply, both, {
      kind: "claim",
      ...(pasted === undefined ? {} : { pastedArtifactId: pasted.id }),
    });
  });

  app.get(`${dispute}/responses`, async (request, reply) => {
    const both = await sellersDispute(sellersDeal, request, reply);
    return both ? answer(reply, both.found, both.dispute, "response") : reply;
  });

  // Answer help reads the newest comparison when there is one, but does not need it.
  app.post(`${dispute}/responses`, async (request, reply) => {
    const both = await sellersDispute(sellersDeal, request, reply);
    if (!both) return reply;
    if (!ANSWER_OPTIONS.some((code) => both.dispute.allowedActions.includes(code))) {
      return reply.code(409).send({ error: "PayPal allows no answer for this dispute now" });
    }
    return startJob(request, reply, both, { kind: "response" });
  });

  app.get(`${dispute}/summaries`, async (request, reply) => {
    const both = await sellersDispute(sellersDeal, request, reply);
    return both ? answer(reply, both.found, both.dispute, "summary") : reply;
  });

  // The summary is drafted from the newest ready comparison of the dispute.
  app.post(`${dispute}/summaries`, async (request, reply) => {
    const both = await sellersDispute(sellersDeal, request, reply);
    if (!both) return reply;
    const comparisons = await listClaimAnalyses(both.found.db, both.dispute.disputeId, "claim");
    const ready = comparisons.find((c) => c.status === "ready");
    if (!ready) return sendRefusal(reply, REFUSALS["no-comparison"]);
    return startJob(request, reply, both, { kind: "summary", basedOn: ready.id });
  });

  return Promise.resolve();
};
