import { z } from "zod";
import { PayPalApiError, PayPalNetworkError, PayPalResponseError } from "./errors.js";
import { backoffDelay, isRetryable, type AttemptOutcome, type RetryPolicy } from "./retry.js";

/** Effects the HTTP layer needs, injected so tests control network, time and randomness. */
export interface HttpDeps {
  fetch: typeof fetch;
  /** Milliseconds since the epoch. */
  now: () => number;
  sleep: (ms: number) => Promise<void>;
  /** Uniform in [0, 1). */
  random: () => number;
}

export const defaultHttpDeps: HttpDeps = {
  fetch: (input, init) => fetch(input, init),
  now: () => Date.now(),
  sleep: (ms) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    }),
  random: () => Math.random(),
};

export interface SendOptions {
  /** Shown in errors, e.g. "GET /v1/customer/disputes". */
  operation: string;
  url: string;
  init: Omit<RequestInit, "signal">;
  /** Safe to repeat without doing the work twice. */
  idempotent: boolean;
}

/**
 * Sends one request with a per-try time limit, retrying transient failures
 * of idempotent requests with backoff. Resolves with the last response, which
 * may be an error status; rejects only when no response arrived at all.
 */
export async function sendWithRetry(
  options: SendOptions,
  deps: HttpDeps,
  policy: RetryPolicy,
): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    let outcome: AttemptOutcome;
    try {
      const response = await deps.fetch(options.url, {
        ...options.init,
        signal: AbortSignal.timeout(policy.timeoutMs),
      });
      if (response.ok) return response;
      outcome = { kind: "status", status: response.status };
      if (attempt >= policy.maxAttempts || !isRetryable(outcome, options.idempotent)) {
        return response;
      }
      // Release the connection held by the unread body before trying again.
      await response.body?.cancel();
    } catch (error) {
      outcome = { kind: "network" };
      if (attempt >= policy.maxAttempts || !isRetryable(outcome, options.idempotent)) {
        const timedOut = error instanceof Error && error.name === "TimeoutError";
        throw new PayPalNetworkError(options.operation, timedOut, { cause: error });
      }
    }
    await deps.sleep(backoffDelay(attempt, policy, deps.random));
  }
}

export function debugIdOf(response: Response): string | undefined {
  return response.headers.get("paypal-debug-id") ?? undefined;
}

// REST errors use name/message/details; the OAuth endpoint uses error/error_description.
const errorBody = z.looseObject({
  name: z.string().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
  debug_id: z.string().optional(),
  details: z
    .array(
      z.looseObject({
        field: z.string().optional(),
        issue: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),
});

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/** Builds the typed error for a non-success response, reading PayPal's error body if present. */
export async function toApiError(operation: string, response: Response): Promise<PayPalApiError> {
  const parsed = errorBody.safeParse(parseJson(await response.text()));
  const body = parsed.success ? parsed.data : {};
  return new PayPalApiError(
    operation,
    response.status,
    body.name ?? body.error,
    body.message ?? body.error_description,
    (body.details ?? []).map(({ field, issue, description }) => ({ field, issue, description })),
    debugIdOf(response) ?? body.debug_id,
  );
}

/** Reads a success response and checks it against `schema`. An empty body is read as `undefined`. */
export async function parseResponse<T>(
  operation: string,
  response: Response,
  schema: z.ZodType<T>,
): Promise<T> {
  const text = await response.text();
  const debugId = debugIdOf(response);
  let json: unknown;
  if (text !== "") {
    json = parseJson(text);
    if (json === undefined) throw new PayPalResponseError(operation, ["body is not JSON"], debugId);
  }
  const result = schema.safeParse(json);
  if (!result.success) throw new PayPalResponseError(operation, issueList(result.error), debugId);
  return result.data;
}

/** Paths and messages of a schema mismatch; zod messages name types, never the values. */
export function issueList(error: z.ZodError): string[] {
  return error.issues.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`);
}
