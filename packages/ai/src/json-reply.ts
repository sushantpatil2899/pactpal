import type { ChatOutcome } from "./types.js";

/** A model's reply read as JSON, or the reason it could not be. */
export type JsonReply =
  | { ok: true; value: unknown }
  | {
      ok: false;
      /** The call failed, the reply was cut off by the length limit, or it holds no JSON. */
      kind: "call_failed" | "cut_off" | "not_json";
      /** Safe to log: never repeats the reply. */
      message: string;
    };

function tryParse(text: string): { value: unknown } | undefined {
  try {
    return { value: JSON.parse(text) as unknown };
  } catch {
    return undefined;
  }
}

/** The candidates to try, most likely first: the text as is, without a code fence, and the outermost {...}. */
function candidates(text: string): string[] {
  const trimmed = text.trim();
  const unfenced = trimmed.replace(/^```[a-z]*\s*/i, "").replace(/\s*```$/, "");
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  const braces = first >= 0 && last > first ? trimmed.slice(first, last + 1) : "";
  return [trimmed, unfenced, braces].filter((candidate) => candidate !== "");
}

/**
 * Reads a model's reply as JSON. Models often add a code fence or a sentence around the JSON even
 * when told not to; both are tolerated. A reply cut off by the length limit is refused, because
 * JSON that ends early may still parse as something smaller than what was meant.
 */
export function parseJsonReply(outcome: ChatOutcome): JsonReply {
  if (!outcome.ok) return { ok: false, kind: "call_failed", message: outcome.message };
  if (outcome.finishReason === "length") {
    return {
      ok: false,
      kind: "cut_off",
      message: `${outcome.model}: reply was cut off by the length limit`,
    };
  }
  for (const candidate of candidates(outcome.text)) {
    const parsed = tryParse(candidate);
    if (parsed !== undefined) return { ok: true, value: parsed.value };
  }
  return { ok: false, kind: "not_json", message: `${outcome.model}: reply is not JSON` };
}
