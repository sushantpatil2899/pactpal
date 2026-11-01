import type { ChatRequest } from "@pactpal/ai";

/** Council settings for tests: no shuffling, a fixed marker and a clock that moves 10 ms at each reading. */
export function councilDeps() {
  let tick = 0;
  return { rng: () => 0.5, newMarker: () => "abcdef123456", now: () => (tick += 10) };
}

/** Whether a request asks a model to rank drafts (rather than to write one). */
export const isRankingRequest = (request: ChatRequest) =>
  request.messages[0]?.content.includes("careful reviewer") === true;
