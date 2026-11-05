import { z } from "zod";

/**
 * The columns every council job table shares (message reviews, claim comparisons): a job moves
 * once from `running` to `ready` or `failed`, with the prompt versions, the council record and
 * the times.
 */
export const councilJobColumns = {
  status: z.enum(["running", "ready", "failed"]),
  prompt_version: z.number().int(),
  rank_prompt_version: z.number().int(),
  council: z.json().nullable(),
  failure_reason: z.string().nullable(),
  requested_by: z.string(),
  created_at: z.date(),
  finished_at: z.date().nullable(),
};

/** Those columns as a record's fields; empty values become undefined. */
export const councilJobFields = (row: z.output<z.ZodObject<typeof councilJobColumns>>) => ({
  status: row.status,
  promptVersion: row.prompt_version,
  rankPromptVersion: row.rank_prompt_version,
  council: row.council ?? undefined,
  failureReason: row.failure_reason ?? undefined,
  requestedBy: row.requested_by,
  createdAt: row.created_at,
  finishedAt: row.finished_at ?? undefined,
});
