import {
  backoffDelay,
  isRetryable,
  retryAfterMs,
  type AttemptOutcome,
  type RetryPolicy,
} from "./retry.js";

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

/** Builds the caller's own error for a request that got no answer at all. */
export type NetworkErrorFactory = (timedOut: boolean, cause: unknown) => Error;

/**
 * Sends one request with a per-try time limit, retrying transient failures
 * of idempotent requests with backoff. Resolves with the last response, which
 * may be an error status; rejects (with the error `networkError` builds) only
 * when no response arrived at all.
 */
export async function sendWithRetry(
  options: SendOptions,
  deps: HttpDeps,
  policy: RetryPolicy,
  networkError: NetworkErrorFactory,
): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    let outcome: AttemptOutcome;
    // Set when a host asked how long to wait before the next try.
    let asked: number | undefined;
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
      asked =
        policy.maxRetryAfterMs === undefined
          ? undefined
          : retryAfterMs(response.headers.get("retry-after"), deps.now());
      // A host that wants a longer wait than we allow gets its answer back, not a long wait.
      if (
        asked !== undefined &&
        policy.maxRetryAfterMs !== undefined &&
        asked > policy.maxRetryAfterMs
      ) {
        return response;
      }
      // Release the connection held by the unread body before trying again.
      await response.body?.cancel();
    } catch (error) {
      outcome = { kind: "network" };
      if (attempt >= policy.maxAttempts || !isRetryable(outcome, options.idempotent)) {
        const timedOut = error instanceof Error && error.name === "TimeoutError";
        throw networkError(timedOut, error);
      }
    }
    await deps.sleep(Math.max(backoffDelay(attempt, policy, deps.random), asked ?? 0));
  }
}
