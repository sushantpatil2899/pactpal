import { parseJsonReply, type ChatOutcome } from "@pactpal/ai";
import type { Validation } from "@pactpal/council";
import { quoteOnLine, withoutLinePrefix, type AgreementLine } from "@pactpal/qa";
import { normalizeForMatch, type SourceLine } from "@pactpal/scope-draft";
import { z } from "zod";
import type { PayPalOptions } from "./prompt.js";
import type { RecordLine } from "./record.js";

/** At most this many statements in one analysis. */
export const MAX_STATEMENTS = 15;

const text = (max: number) => z.string().trim().min(1).max(max);

export const claimAnalysisSchema = z.object({
  statements: z
    .array(
      z.object({
        quote: text(300),
        line: z.number().int().min(1),
        finding: z.enum(["covered", "not-covered"]),
        agreement: z
          .array(z.object({ line: z.number().int().min(1), quote: text(300) }))
          .max(8)
          .default([]),
        record: z.array(z.number().int().min(1)).max(12).default([]),
        relation: z.string().trim().max(400).default(""),
      }),
    )
    .min(1)
    .max(MAX_STATEMENTS),
  suggestion: z.object({
    action: z.string().trim().min(1).max(60).nullable(),
    evidenceType: z.string().trim().min(1).max(60).nullable().default(null),
    why: z.string().trim().max(400).default(""),
  }),
});

/** A model's comparison of the claim with the record, after the checks: a draft for the seller. */
export type ClaimAnalysis = z.output<typeof claimAnalysisSchema>;

/** What an answer is checked against. */
export interface ClaimContext {
  claim: readonly SourceLine[];
  hidden: readonly number[];
  agreement: readonly AgreementLine[];
  record: readonly RecordLine[];
  paypal: PayPalOptions;
}

const invalid = (errors: string[]) => ({
  ok: false as const,
  validation: { valid: false, score: 0, errors },
});

/**
 * Checks an analysis against what the models were given: each statement quotes the claim line it
 * names (never a hidden one), each agreement citation is on its line, each record number exists,
 * a covered statement cites something and an uncovered one cites nothing, and the suggestion
 * names an allowed action and a requested evidence type (or none). The score is the share of
 * quotes and citations found. Error messages name statements and lines, never the words. Pure.
 */
export function checkAnalysis(
  value: unknown,
  context: ClaimContext,
):
  | { ok: true; analysis: ClaimAnalysis; validation: Validation }
  | { ok: false; validation: Validation } {
  const parsed = claimAnalysisSchema.safeParse(value);
  if (!parsed.success) return invalid(["the reply is not in the expected shape"]);
  const analysis: ClaimAnalysis = {
    ...parsed.data,
    statements: parsed.data.statements.map((s) => ({
      ...s,
      agreement: s.agreement.map((c) => ({ line: c.line, quote: withoutLinePrefix(c.quote) })),
    })),
  };
  const recordNumbers = new Set(context.record.map(({ n }) => n));
  const errors: string[] = [];
  let checked = 0;
  let found = 0;
  analysis.statements.forEach((statement, i) => {
    const which = `statement ${String(i + 1)}`;
    checked += 1;
    const line = context.claim.find(({ n }) => n === statement.line);
    const quote = normalizeForMatch(statement.quote);
    if (context.hidden.includes(statement.line)) {
      errors.push(`${which}: cites claim line ${String(statement.line)}, which was hidden`);
    } else if (
      line !== undefined &&
      quote.length > 0 &&
      normalizeForMatch(line.text).includes(quote)
    ) {
      found += 1;
    } else {
      errors.push(`${which}: its quote is not on claim line ${String(statement.line)}`);
    }
    for (const citation of statement.agreement) {
      checked += 1;
      if (quoteOnLine(context.agreement, citation)) found += 1;
      else errors.push(`${which}: a citation is not on agreement line ${String(citation.line)}`);
    }
    for (const n of statement.record) {
      checked += 1;
      if (recordNumbers.has(n)) found += 1;
      else errors.push(`${which}: record entry #${String(n)} is not in the record`);
    }
    const cites = statement.agreement.length + statement.record.length;
    if (statement.finding === "covered" && cites === 0) {
      errors.push(`${which}: covered without citing the agreement or the record`);
    }
    if (statement.finding === "not-covered" && cites > 0) {
      errors.push(`${which}: not covered but cites the agreement or the record`);
    }
  });
  const { action, evidenceType } = analysis.suggestion;
  const { allowedActions, requestedEvidence } = context.paypal;
  if (action === null ? allowedActions.length > 0 : !allowedActions.includes(action)) {
    errors.push("the suggested action is not one PayPal allows now");
  }
  if (evidenceType !== null && !requestedEvidence.includes(evidenceType)) {
    errors.push("the suggested evidence type is not one PayPal asks for");
  }
  const validation = { valid: errors.length === 0, score: found / checked, errors };
  return validation.valid ? { ok: true, analysis, validation } : { ok: false, validation };
}

/** Reads a model's outcome: a failed call or a reply that is not JSON is invalid, never thrown. */
export function readAnalysis(
  outcome: ChatOutcome,
  context: ClaimContext,
): ReturnType<typeof checkAnalysis> {
  const parsed = parseJsonReply(outcome);
  if (!parsed.ok) return invalid([`no usable reply (${parsed.kind})`]);
  return checkAnalysis(parsed.value, context);
}
