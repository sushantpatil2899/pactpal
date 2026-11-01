import type { JsonValue } from "@pactpal/ledger";
import type { CouncilRun } from "@pactpal/council";
import { scopeDraftSchema, type ScopeDraft } from "@pactpal/scope-draft";
import { z } from "zod";

const usage = z.strictObject({ promptTokens: z.number(), completionTokens: z.number() });

/**
 * What the council did for one draft, as stored with it (and shown on the council panel): each
 * model's result, the votes, which label was which model, every valid draft, the scores and the
 * agreement. Safe error texts only; never the chat. The winning draft is stored beside it.
 */
export const councilRecordSchema = z.strictObject({
  answers: z.array(
    z.strictObject({
      modelName: z.string(),
      status: z.enum(["valid", "invalid", "call_failed"]),
      errors: z.array(z.string()),
      validationScore: z.number(),
      failureKind: z.string().optional(),
      latencyMs: z.number().optional(),
      usage: usage.optional(),
    }),
  ),
  votes: z.array(
    z.strictObject({
      voter: z.string(),
      status: z.enum(["ballot", "call_failed", "unreadable", "not_asked"]),
      reason: z.string().optional(),
      latencyMs: z.number().optional(),
      usage: usage.optional(),
    }),
  ),
  labels: z.array(z.strictObject({ label: z.string(), modelName: z.string() })),
  candidates: z.array(
    z.strictObject({ label: z.string(), modelName: z.string(), draft: scopeDraftSchema }),
  ),
  scores: z.array(
    z.strictObject({
      label: z.string(),
      modelName: z.string(),
      score: z.number(),
      votes: z.number(),
      rankVariance: z.number(),
      validationScore: z.number(),
    }),
  ),
  agreement: z.number(),
  needsReview: z.boolean(),
  reviewReasons: z.array(z.string()),
  rejectedBallots: z.array(z.strictObject({ voter: z.string(), reason: z.string() })),
  dropped: z.array(z.strictObject({ modelName: z.string(), errors: z.array(z.string()) })),
  usage: z.strictObject({
    calls: z.number(),
    callsWithoutUsage: z.number(),
    promptTokens: z.number(),
    completionTokens: z.number(),
  }),
  durationMs: z.number(),
});
export type CouncilRecord = z.output<typeof councilRecordSchema>;

/** The record of a finished council run. */
export function toCouncilRecord(run: CouncilRun<ScopeDraft>): CouncilRecord {
  const { result } = run;
  return {
    answers: run.answers,
    votes: run.votes,
    labels: run.labelled.map(({ label, answer }) => ({ label, modelName: answer.modelName })),
    candidates: run.labelled.map(({ label, answer }) => ({
      label,
      modelName: answer.modelName,
      draft: answer.content,
    })),
    scores: result.scores,
    agreement: result.agreement,
    needsReview: result.needsReview,
    reviewReasons: result.reviewReasons,
    rejectedBallots: result.rejectedBallots,
    dropped: result.dropped,
    usage: run.usage,
    durationMs: run.durationMs,
  };
}

/** A value as plain JSON, the way the database stores it (undefined fields drop out). */
export function toJson(value: unknown): JsonValue {
  return z.json().parse(JSON.parse(JSON.stringify(value)));
}
