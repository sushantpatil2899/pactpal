import { parseJsonReply, type ChatOutcome } from "@pactpal/ai";
import { z } from "zod";
import type { Ballot } from "./types.js";

const ballotReply = z.strictObject({ ranking: z.array(z.string()) });

export type BallotReading =
  | { ok: true; ballot: Ballot }
  /** `call_failed`: no reply; `unreadable`: a reply that is not a ranking. */
  | { ok: false; kind: "call_failed" | "unreadable"; reason: string };

/**
 * Reads a model's reply as a ballot. Whether it ranks every label exactly once is checked by
 * `aggregate`, which records the reason when it does not. Reasons never repeat the reply.
 */
export function readBallot(voter: string, outcome: ChatOutcome): BallotReading {
  const reply = parseJsonReply(outcome);
  if (!reply.ok) {
    return {
      ok: false,
      kind: reply.kind === "call_failed" ? "call_failed" : "unreadable",
      reason: reply.message,
    };
  }
  const parsed = ballotReply.safeParse(reply.value);
  if (!parsed.success) {
    return { ok: false, kind: "unreadable", reason: `${voter}: the reply is not a ranking` };
  }
  return { ok: true, ballot: { voter, ranking: parsed.data.ranking } };
}
