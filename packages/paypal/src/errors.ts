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
    // Field names and issue codes only: PayPal's descriptions can echo submitted values.
    const issues = details
      .map(({ field, issue }) => [field, issue].filter(Boolean).join(" "))
      .filter(Boolean);
    const listed = issues.length === 0 ? "" : ` [${issues.join("; ")}]`;
    const debug = debugId === undefined ? "" : ` (debug id ${debugId})`;
    super(`${operation} failed with ${status}${reason ? ` ${reason}` : ""}${listed}${debug}`);
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

/**
 * A PayPal MCP call did not succeed. `outcome` says whether PayPal could have
 * done the work anyway: "failed" means it certainly did not (no connection, or
 * PayPal answered with an error); "unknown" means the call was sent but no
 * usable answer came back, so a write may have happened.
 */
export class PayPalMcpError extends Error {
  override readonly name = "PayPalMcpError";

  constructor(
    /** The MCP tool, e.g. "list_invoices". */
    readonly tool: string,
    /** PayPal's error code, or CONNECT_FAILED / NO_ANSWER / TOOL_ERROR. */
    readonly code: string,
    readonly outcome: "failed" | "unknown",
    detail: string,
    options?: { cause?: unknown },
  ) {
    super(`MCP ${tool} failed: ${code}: ${detail}`, options);
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

/** PayPal does not currently allow this answer on the dispute; nothing was sent. */
export class DisputeActionNotAllowed extends Error {
  override readonly name = "DisputeActionNotAllowed";

  constructor(
    readonly disputeId: string,
    /** e.g. "make_offer", or "make_offer REFUND" for an offer type. */
    readonly action: string,
    /** What PayPal allows instead. */
    readonly allowed: readonly string[],
  ) {
    super(
      `PayPal does not allow ${action} on dispute ${disputeId} right now; allowed: ${allowed.length === 0 ? "none" : allowed.join(", ")}`,
    );
  }
}

/** An evidence or appeal file was rejected before upload; nothing was sent. */
export class EvidenceFileError extends Error {
  override readonly name = "EvidenceFileError";

  constructor(
    readonly filename: string,
    reason: string,
  ) {
    super(`${filename}: ${reason}`);
  }
}
