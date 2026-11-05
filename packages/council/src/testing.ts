import type { ChatRequest } from "@pactpal/ai";
import { FakeChatClient, testSpec } from "@pactpal/ai/testing";
import type { CouncilDeps } from "./task.js";

/** Test code only: fixed council effects, so runs are exact. */
export const FIXED_COUNCIL: CouncilDeps = {
  rng: () => 0.5,
  newMarker: () => "f0e1d2c3b4a5",
  now: () => 0,
};

/**
 * Test code only: a stand-in model's answer function. Asked to answer, it replies with `answer`
 * as JSON; asked to vote, it ranks the drafts in the order the ballot shows them.
 */
export const answering = (answer: object) => (request: ChatRequest) =>
  request.messages[0]?.content.includes("careful reviewer") === true
    ? JSON.stringify({
        ranking: [...(request.messages[1]?.content ?? "").matchAll(/label="(\w+)"/g)].map(
          (m) => m[1],
        ),
      })
    : JSON.stringify(answer);

/** Test code only: one stand-in model per answer, named alpha, beta, gamma, delta. */
export const councilOf = (answers: readonly object[]): FakeChatClient[] =>
  answers.map(
    (answer, i) =>
      new FakeChatClient(
        testSpec({ name: ["alpha", "beta", "gamma", "delta"][i] ?? `m${String(i)}` }),
        answering(answer),
      ),
  );
