import type { ChatClient, ChatOutcome, ChatRequest, ModelSpec } from "./types.js";

/** A model spec for tests; override only what the test cares about. */
export function testSpec(overrides: Partial<ModelSpec> = {}): ModelSpec {
  return {
    name: "test-model",
    family: "test",
    baseUrl: "https://models.test/v1",
    apiKeyEnv: "TEST_API_KEY",
    model: "test-1",
    structuredOutput: "schema",
    ...overrides,
  };
}

/** A successful reply carrying `text`. */
export function okReply(spec: ModelSpec, text: string): Extract<ChatOutcome, { ok: true }> {
  return {
    ok: true,
    model: spec.name,
    text,
    finishReason: "stop",
    usage: { promptTokens: 10, completionTokens: 5 },
    latencyMs: 1,
  };
}

/**
 * A model that answers from a function and remembers every request, so tests
 * of the council and the scope drafting run without any network.
 */
export class FakeChatClient implements ChatClient {
  readonly requests: ChatRequest[] = [];

  constructor(
    readonly spec: ModelSpec,
    private readonly answer: (request: ChatRequest) => string | ChatOutcome,
  ) {}

  complete(request: ChatRequest): Promise<ChatOutcome> {
    this.requests.push(request);
    const result = this.answer(request);
    return Promise.resolve(typeof result === "string" ? okReply(this.spec, result) : result);
  }
}
