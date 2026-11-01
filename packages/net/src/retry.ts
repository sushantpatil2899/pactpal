/** Request settings shared by the token provider and the REST client. */
export interface RetryPolicy {
  /** Total tries, including the first. */
  maxAttempts: number;
  /** Wait before the first retry; doubles each time. */
  baseDelayMs: number;
  /** Upper bound on any single wait. */
  maxDelayMs: number;
  /** Per-try time limit. */
  timeoutMs: number;
  /**
   * When set, a retry waits as long as the host's `Retry-After` asks, and gives up at once if the
   * host asks for more than this. When absent, `Retry-After` is ignored.
   */
  maxRetryAfterMs?: number;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 3,
  baseDelayMs: 500,
  maxDelayMs: 4000,
  timeoutMs: 15_000,
};

/** How a single try ended, as far as retrying is concerned. */
export type AttemptOutcome = { kind: "status"; status: number } | { kind: "network" };

/**
 * Whether a failed try may be repeated: only transient failures (network,
 * 429, 5xx), and only for requests that cannot do the work twice (reads,
 * logins, and writes that carry a PayPal-Request-Id).
 */
export function isRetryable(outcome: AttemptOutcome, idempotent: boolean): boolean {
  const transient = outcome.kind === "network" || outcome.status === 429 || outcome.status >= 500;
  return transient && idempotent;
}

/**
 * Wait before retry number `retry` (1 for the first retry): exponential and
 * capped, then spread between half and the full value so that many clients
 * retrying together do not hit PayPal at the same instant.
 */
export function backoffDelay(retry: number, policy: RetryPolicy, random: () => number): number {
  const ceiling = Math.min(policy.maxDelayMs, policy.baseDelayMs * 2 ** (retry - 1));
  return Math.round(ceiling / 2 + (ceiling / 2) * random());
}

/**
 * How long a `Retry-After` header asks to wait, in milliseconds: a number of seconds, or a date
 * (counted from `now`). Undefined when the header is absent or not understood.
 */
export function retryAfterMs(header: string | null, now: number): number | undefined {
  if (header === null) return undefined;
  const text = header.trim();
  if (/^\d+(\.\d+)?$/.test(text)) return Math.round(Number(text) * 1000);
  // HTTP dates all start with a weekday name; this keeps Date.parse from reading odd strings as dates.
  const date = /^[A-Za-z]{3,}/.test(text) ? Date.parse(text) : Number.NaN;
  return Number.isNaN(date) ? undefined : Math.max(0, date - now);
}
