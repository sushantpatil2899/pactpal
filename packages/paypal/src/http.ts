import { z } from "zod";
import { PayPalApiError, PayPalNetworkError, PayPalResponseError } from "./errors.js";
import {
  sendWithRetry as sendWithRetryShared,
  type HttpDeps,
  type RetryPolicy,
  type SendOptions,
} from "@pactpal/net";

/**
 * `sendWithRetry` from the shared transport, with PayPal's own error for a
 * request that got no answer (timeout or connection failure).
 */
export function sendWithRetry(
  options: SendOptions,
  deps: HttpDeps,
  policy: RetryPolicy,
): Promise<Response> {
  return sendWithRetryShared(
    options,
    deps,
    policy,
    (timedOut, cause) => new PayPalNetworkError(options.operation, timedOut, { cause }),
  );
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
