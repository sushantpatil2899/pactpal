import type { z } from "zod";
import { SANDBOX_API_BASE_URL } from "./credentials.js";
import {
  debugIdOf,
  defaultHttpDeps,
  parseResponse,
  sendWithRetry,
  toApiError,
  type HttpDeps,
} from "./http.js";
import { DEFAULT_RETRY_POLICY, type RetryPolicy } from "./retry.js";
import type { AccessTokenProvider } from "./token.js";

type Query = Record<string, string | number | boolean>;

interface RequestBase<T> {
  path: string;
  query?: Query;
  /** Checks the response; its output type is the result type. */
  schema: z.ZodType<T>;
}

/** Reads are safe to repeat, so they carry no request id. */
export interface ReadRequest<T> extends RequestBase<T> {
  method: "GET";
}

/**
 * Writes must carry a stable PayPal-Request-Id: PayPal treats repeats with
 * the same id as one request, which is what makes retrying them safe.
 */
export type WriteRequest<T> = RequestBase<T> & {
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  requestId: string;
} & (
    | { body?: unknown; form?: never; rawJson?: never }
    /** A file upload; the same form is resent unchanged on retries. */
    | { form: FormData; body?: never; rawJson?: never }
    /** JSON text sent byte for byte, for when PayPal must see exactly what it sent us. */
    | { rawJson: string; body?: never; form?: never }
  );

export type RestRequest<T> = ReadRequest<T> | WriteRequest<T>;

export interface RestResponse<T> {
  data: T;
  status: number;
  /** PayPal-Debug-Id, for support requests. */
  debugId: string | undefined;
}

export interface RestClientOptions {
  baseUrl?: string;
  deps?: HttpDeps;
  policy?: RetryPolicy;
}

/** Sends authenticated JSON requests and file uploads to the PayPal REST API for one app. */
export class PayPalRestClient {
  readonly #tokens: AccessTokenProvider;
  readonly #baseUrl: string;
  readonly #deps: HttpDeps;
  readonly #policy: RetryPolicy;

  constructor(tokens: AccessTokenProvider, options: RestClientOptions = {}) {
    this.#tokens = tokens;
    this.#baseUrl = options.baseUrl ?? SANDBOX_API_BASE_URL;
    this.#deps = options.deps ?? defaultHttpDeps;
    this.#policy = options.policy ?? DEFAULT_RETRY_POLICY;
  }

  /**
   * Sends the request, retrying transient failures and renewing the token
   * once if PayPal rejects it. Throws PayPalApiError, PayPalNetworkError or
   * PayPalResponseError.
   */
  async request<T>(request: RestRequest<T>): Promise<RestResponse<T>> {
    const operation = `${request.method} ${request.path}`;
    const url = new URL(request.path, this.#baseUrl);
    for (const [key, value] of Object.entries(request.query ?? {})) {
      url.searchParams.set(key, String(value));
    }

    for (let renewed = false; ; renewed = true) {
      const token = await this.#tokens.get();
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token.value.reveal()}`,
        Accept: "application/json",
      };
      let body: string | FormData | undefined;
      if (request.method !== "GET") {
        headers["PayPal-Request-Id"] = request.requestId;
        // fetch sets the multipart Content-Type, including its boundary, for a form.
        if (request.form !== undefined) body = request.form;
        else if (request.rawJson !== undefined) {
          headers["Content-Type"] = "application/json";
          body = request.rawJson;
        } else if (request.body !== undefined) {
          headers["Content-Type"] = "application/json";
          body = JSON.stringify(request.body);
        }
      }

      const response = await sendWithRetry(
        {
          operation,
          url: url.toString(),
          init: { method: request.method, headers, body },
          // Reads are idempotent, and the types force every write to carry a request id.
          idempotent: true,
        },
        this.#deps,
        this.#policy,
      );

      if (response.status === 401 && !renewed) {
        await response.body?.cancel();
        this.#tokens.invalidate();
        continue;
      }
      if (!response.ok) throw await toApiError(operation, response);
      return {
        data: await parseResponse(operation, response, request.schema),
        status: response.status,
        debugId: debugIdOf(response),
      };
    }
  }
}
