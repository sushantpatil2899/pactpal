/**
 * The AI layer's access to models: a registry of the hosted models PactPal
 * can call, and a client for any host that speaks the OpenAI chat format.
 * Tests use the fakes in `@pactpal/ai/testing`.
 */

export type {
  ChatClient,
  ChatFailureKind,
  ChatImage,
  ChatMessage,
  ChatOutcome,
  ChatRequest,
  JsonSchema,
  ModelSpec,
  ReplyFormat,
  StructuredOutput,
  TokenUsage,
} from "./types.js";
export { STRUCTURED_OUTPUT_LEVELS } from "./types.js";
export {
  MODEL_REGISTRY,
  keyNames,
  readyModels,
  registryProblems,
  schemaEnforced,
  visionModels,
} from "./registry.js";
export { parseJsonReply, type JsonReply } from "./json-reply.js";
export { AI_RETRY_POLICY, OpenAiCompatibleClient, type ClientOptions } from "./client.js";
export { DEFAULT_MODEL, RECENT_FAILURE_MS, rankModels, type ModelRecord } from "./rank.js";
