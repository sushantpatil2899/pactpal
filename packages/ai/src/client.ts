import {
  defaultHttpDeps,
  sendWithRetry,
  type HttpDeps,
  type RetryPolicy,
  type Secret,
} from "@pactpal/net";
import { z } from "zod";
import type {
  ChatClient,
  ChatFailureKind,
  ChatMessage,
  ChatOutcome,
  ChatRequest,
  ModelSpec,
  ReplyFormat,
  TokenUsage,
} from "./types.js";

/**
 * Models are slow, so each try may take a minute. Repeating a question has no
 * effect except its cost, so every call may be retried when the failure is
 * temporary (network, 429, 5xx).
 */
export const AI_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 8000,
  timeoutMs: 60_000,
  // A host that says "try again in 20 seconds" is obeyed; one that asks for more than this is not waited for.
  maxRetryAfterMs: 30_000,
};

const DEFAULT_MAX_TOKENS = 2000;
const DEFAULT_TEMPERATURE = 0.2;

const reply = z.looseObject({
  choices: z
    .array(
      z.looseObject({
        message: z.looseObject({ content: z.string().nullish() }),
        finish_reason: z.string().nullish(),
      }),
    )
    .min(1),
  usage: z
    .looseObject({ prompt_tokens: z.number().optional(), completion_tokens: z.number().optional() })
    .optional(),
});

/** What a host's error answer may carry that is safe to show: a short code, never its message. */
const errorBody = z.looseObject({
  error: z
    .union([
      z.string(),
      z.looseObject({
        code: z.union([z.string(), z.number()]).optional(),
        type: z.string().optional(),
        status: z.string().optional(),
      }),
    ])
    .optional(),
});
const SHORT_CODE = /^[\w.-]{1,64}$/;

class ModelNetworkError extends Error {
  constructor(readonly timedOut: boolean) {
    super(timedOut ? "timed out" : "could not reach the host");
  }
}

function failure(
  spec: ModelSpec,
  kind: ChatFailureKind,
  detail: string,
  status?: number,
): ChatOutcome {
  return { ok: false, model: spec.name, kind, message: `${spec.name}: ${detail}`, status };
}

function kindOfStatus(status: number): ChatFailureKind {
  if (status === 401 || status === 403) return "auth";
  if (status === 402) return "out_of_credit";
  if (status === 429) return "rate_limited";
  return status >= 500 ? "server" : "rejected";
}

/** The host's short error code, if its error answer has one; otherwise undefined. */
function providerCode(text: string): string | undefined {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return undefined;
  }
  // Google wraps its error in a one-item list.
  const parsed = errorBody.safeParse(Array.isArray(json) ? json[0] : json);
  const error = parsed.success ? parsed.data.error : undefined;
  if (error === undefined || typeof error === "string") return undefined;
  const code = [error.code, error.type, error.status]
    .map((value) => (value === undefined ? undefined : String(value)))
    .find((value) => value !== undefined && SHORT_CODE.test(value));
  return code;
}

function usageOf(parsed: z.infer<typeof reply>): TokenUsage | undefined {
  const { prompt_tokens: promptTokens, completion_tokens: completionTokens } = parsed.usage ?? {};
  return promptTokens === undefined || completionTokens === undefined
    ? undefined
    : { promptTokens, completionTokens };
}

/** The `response_format` to send, or nothing when the model cannot be given one. */
function responseFormat(spec: ModelSpec, reply: ReplyFormat | undefined): object | undefined {
  if (reply === undefined || spec.structuredOutput === "none") return undefined;
  if (reply === "json" || spec.structuredOutput === "json-object") return { type: "json_object" };
  return {
    type: "json_schema",
    json_schema: {
      name: reply.name,
      schema: reply.schema,
      ...(spec.structuredOutput === "strict-schema" ? { strict: true } : {}),
    },
  };
}

export interface ClientOptions {
  deps?: HttpDeps;
  policy?: RetryPolicy;
}

/** A message as the host reads it: plain text, or text then images as content parts. */
function wireMessage({ role, content, images }: ChatMessage) {
  if (images === undefined || images.length === 0) return { role, content };
  return {
    role,
    content: [
      { type: "text", text: content },
      ...images.map((image) => ({
        type: "image_url",
        image_url: { url: `data:${image.mediaType};base64,${image.base64}` },
      })),
    ],
  };
}

/**
 * Talks to one model over the OpenAI chat format. Failures come back as
 * values, not exceptions. The key is sent only in the request header; error
 * messages hold the model name, status and the host's short error code, never
 * the question, the answer or the host's own wording (which can echo them).
 */
export class OpenAiCompatibleClient implements ChatClient {
  readonly #key: Secret | undefined;
  readonly #deps: HttpDeps;
  readonly #policy: RetryPolicy;

  constructor(
    readonly spec: ModelSpec,
    key: Secret | undefined,
    options: ClientOptions = {},
  ) {
    this.#key = key;
    this.#deps = options.deps ?? defaultHttpDeps;
    this.#policy = options.policy ?? AI_RETRY_POLICY;
  }

  async complete(request: ChatRequest): Promise<ChatOutcome> {
    const { spec } = this;
    if (this.#key === undefined) {
      return failure(spec, "no_key", `no key set (${spec.apiKeyEnv})`);
    }
    const format = responseFormat(spec, request.reply);
    const body = {
      model: spec.model,
      messages: request.messages.map(wireMessage),
      max_tokens: request.maxTokens ?? DEFAULT_MAX_TOKENS,
      temperature: request.temperature ?? DEFAULT_TEMPERATURE,
      ...(format === undefined ? {} : { response_format: format }),
    };
    const startedAt = this.#deps.now();

    let response: Response;
    try {
      response = await sendWithRetry(
        {
          operation: `POST ${spec.name}`,
          url: `${spec.baseUrl}/chat/completions`,
          init: {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.#key.reveal()}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          },
          idempotent: true,
        },
        this.#deps,
        this.#policy,
        (timedOut) => new ModelNetworkError(timedOut),
      );
    } catch (error) {
      if (error instanceof ModelNetworkError) {
        return failure(spec, error.timedOut ? "timeout" : "network", error.message);
      }
      throw error;
    }

    // The time limit also covers reading the body, so a slow host can fail here, after its headers.
    let text: string;
    try {
      text = await response.text();
    } catch (error) {
      const timedOut = error instanceof Error && error.name === "TimeoutError";
      return failure(
        spec,
        timedOut ? "timeout" : "network",
        timedOut ? "timed out" : "the reply was cut short",
      );
    }
    if (!response.ok) {
      const code = providerCode(text);
      const kind = kindOfStatus(response.status);
      return failure(
        spec,
        kind,
        `HTTP ${response.status} (${kind})${code === undefined ? "" : `, code ${code}`}`,
        response.status,
      );
    }

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return failure(spec, "bad_response", "reply is not JSON", response.status);
    }
    const parsed = reply.safeParse(json);
    if (!parsed.success) {
      const where = parsed.error.issues.map((issue) => issue.path.join(".") || "(root)").join(", ");
      return failure(
        spec,
        "bad_response",
        `reply has the wrong shape at ${where}`,
        response.status,
      );
    }
    const choice = parsed.data.choices[0];
    const content = choice?.message.content ?? "";
    if (content.trim() === "") {
      const cut = choice?.finish_reason === "length" ? " (cut off by the length limit)" : "";
      return failure(spec, "bad_response", `reply is empty${cut}`, response.status);
    }
    return {
      ok: true,
      model: spec.name,
      text: content,
      finishReason: choice?.finish_reason ?? undefined,
      usage: usageOf(parsed.data),
      latencyMs: this.#deps.now() - startedAt,
    };
  }
}
