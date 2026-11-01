import { parseJsonReply, type ChatOutcome, type ModelSpec } from "@pactpal/ai";
import { rows } from "./format.js";

/** The tiny question `pnpm ai:check` asks every model that has a key. */
export const AI_CHECK_PROMPT = 'Reply with this JSON object and nothing else: {"status":"OK"}';

/** What the check found for one model. */
export type ModelCheck =
  | { status: "skipped"; missingKey: string }
  | {
      status: "ok";
      latencyMs: number;
      /** "12 + 6 tokens" (question + answer), or undefined when the host did not say. */
      tokens: string | undefined;
      /** Whether the reply was the JSON object that was asked for. */
      jsonReply: boolean;
    }
  | { status: "failed"; error: string };

/** True when the reply is the JSON object the check asked for. */
function isStatusOk(outcome: ChatOutcome): boolean {
  const reply = parseJsonReply(outcome);
  return (
    reply.ok &&
    typeof reply.value === "object" &&
    reply.value !== null &&
    "status" in reply.value &&
    reply.value.status === "OK"
  );
}

/** Turns one model's answer into what the report shows. */
export function summarizeOutcome(outcome: ChatOutcome): ModelCheck {
  if (!outcome.ok) return { status: "failed", error: outcome.message };
  const { usage } = outcome;
  return {
    status: "ok",
    latencyMs: outcome.latencyMs,
    tokens:
      usage === undefined ? undefined : `${usage.promptTokens} + ${usage.completionTokens} tokens`,
    jsonReply: isStatusOk(outcome),
  };
}

function describe(check: ModelCheck): [string, string][] {
  switch (check.status) {
    case "skipped":
      return [["Result", `skipped: ${check.missingKey} is not set`]];
    case "failed":
      return [["Result", `failed: ${check.error}`]];
    case "ok":
      return [
        [
          "Result",
          `ok, ${(check.latencyMs / 1000).toFixed(1)} s${check.tokens === undefined ? "" : `, ${check.tokens}`}`,
        ],
        [
          "JSON reply",
          check.jsonReply ? "yes" : "no (the reply was not the JSON that was asked for)",
        ],
      ];
  }
}

/** Plain-text report, one section per model. Never shows keys, questions or answers. */
export function formatAiReport(checks: readonly { spec: ModelSpec; check: ModelCheck }[]): string {
  return checks
    .map(({ spec, check }) => `${spec.name} (${spec.model})\n${rows(describe(check))}`)
    .join("");
}
