/**
 * Transport pieces shared by every package that calls an outside service
 * (PayPal, the AI hosts): secret values that cannot leak into logs, injected
 * effects (network, clock, sleep, randomness), and retry with backoff.
 */

export { Secret } from "./secret.js";
export {
  defaultHttpDeps,
  sendWithRetry,
  type HttpDeps,
  type NetworkErrorFactory,
  type SendOptions,
} from "./http.js";
export {
  DEFAULT_RETRY_POLICY,
  backoffDelay,
  isRetryable,
  type AttemptOutcome,
  type RetryPolicy,
} from "./retry.js";
