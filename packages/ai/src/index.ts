/**
 * The AI layer's access to models: a registry of the hosted models PactPal
 * can call, and a client for any host that speaks the OpenAI chat format.
 * Tests use the fakes in `@pactpal/ai/testing`.
 */

export type {
  ChatClient,
  ChatFailureKind,
  ChatMessage,
  ChatOutcome,
  ChatRequest,
  ModelSpec,
  TokenUsage,
} from "./types.js";
export { MODEL_REGISTRY, keyNames, readyModels, registryProblems } from "./registry.js";
export { AI_RETRY_POLICY, OpenAiCompatibleClient, type ClientOptions } from "./client.js";
