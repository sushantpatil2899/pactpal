/** One field-level problem PayPal reported, as given in an error's `details`. */
export interface PayPalErrorDetail {
  field?: string;
  issue?: string;
  description?: string;
}

/** PayPal answered with an error status. Messages never contain credentials or tokens. */
export class PayPalApiError extends Error {
  override readonly name = "PayPalApiError";

  constructor(
    /** What was called, e.g. "POST /v1/oauth2/token". */
    readonly operation: string,
    readonly status: number,
    /** PayPal's error name, e.g. "INVALID_REQUEST" or "invalid_client". */
    readonly errorName: string | undefined,
    readonly errorMessage: string | undefined,
    readonly details: readonly PayPalErrorDetail[],
    /** PayPal-Debug-Id, for support requests. */
    readonly debugId: string | undefined,
  ) {
    const reason = [errorName, errorMessage].filter(Boolean).join(": ");
    const debug = debugId === undefined ? "" : ` (debug id ${debugId})`;
    super(`${operation} failed with ${status}${reason ? ` ${reason}` : ""}${debug}`);
  }
}

/** No usable answer from PayPal: the request timed out or the connection failed. */
export class PayPalNetworkError extends Error {
  override readonly name = "PayPalNetworkError";

  constructor(
    readonly operation: string,
    readonly timedOut: boolean,
    options?: { cause?: unknown },
  ) {
    super(`${operation} ${timedOut ? "timed out" : "could not reach PayPal"}`, options);
  }
}

/** PayPal answered successfully, but not in the shape the caller expects. */
export class PayPalResponseError extends Error {
  override readonly name = "PayPalResponseError";

  constructor(
    readonly operation: string,
    /** Paths and messages of the mismatches; never the response values. */
    readonly issues: readonly string[],
    readonly debugId: string | undefined,
  ) {
    super(`${operation} returned an unexpected response: ${issues.join("; ")}`);
  }
}
