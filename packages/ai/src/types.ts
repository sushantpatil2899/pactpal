/** One registered model. Any host that speaks the OpenAI chat format works. */
export interface ModelSpec {
  /** Unique name used in logs and results, e.g. "gemini". */
  name: string;
  /** Model family, so a council can be checked for diversity, e.g. "qwen". */
  family: string;
  /** The host's OpenAI-style address, without a trailing slash and without `/chat/completions`. */
  baseUrl: string;
  /** Name of the environment variable holding the key; never the key itself. */
  apiKeyEnv: string;
  /** The host's own id for the model. */
  model: string;
  /** Whether the host accepts "reply with a JSON object" (`response_format`). */
  jsonMode: boolean;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  /** Upper limit on the reply, in tokens. Default 2000. */
  maxTokens?: number;
  /** Default 0.2: steady answers; the council gets its variety from different models. */
  temperature?: number;
  /** Ask for a JSON object. Sent only to models whose `jsonMode` is on. */
  json?: boolean;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
}

/** Why a call produced no usable reply. */
export type ChatFailureKind =
  /** No key is set for this model; nothing was sent. */
  | "no_key"
  | "timeout"
  | "network"
  | "rate_limited"
  /** HTTP 402, for example a key that reached its dollar limit. Never retried. */
  | "out_of_credit"
  /** HTTP 401 or 403: the key was refused. */
  | "auth"
  /** Any other 4xx: the host rejected the request itself. */
  | "rejected"
  | "server"
  /** An answer arrived but was empty or not in the expected shape. */
  | "bad_response";

export type ChatOutcome =
  | {
      ok: true;
      model: string;
      text: string;
      /** The host's reason the reply ended ("stop", "length", ...); "length" means cut off. */
      finishReason: string | undefined;
      usage: TokenUsage | undefined;
      /** Total time including retries and waits. */
      latencyMs: number;
    }
  | {
      ok: false;
      model: string;
      kind: ChatFailureKind;
      /** Safe to log: names the model, status and the host's short error code, never the prompt. */
      message: string;
      status: number | undefined;
    };

/** One model that can answer chat questions. */
export interface ChatClient {
  readonly spec: ModelSpec;
  complete(request: ChatRequest): Promise<ChatOutcome>;
}
