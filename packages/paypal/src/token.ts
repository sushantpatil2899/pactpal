import { z } from "zod";
import { SANDBOX_API_BASE_URL, Secret, type PayPalAppCredentials } from "./credentials.js";
import {
  defaultHttpDeps,
  parseResponse,
  sendWithRetry,
  toApiError,
  type HttpDeps,
} from "./http.js";
import { DEFAULT_RETRY_POLICY, type RetryPolicy } from "./retry.js";

const TOKEN_PATH = "/v1/oauth2/token";
const OPERATION = `POST ${TOKEN_PATH}`;

const tokenResponse = z.object({
  access_token: z.string().min(1),
  token_type: z.string(),
  expires_in: z.number().positive(),
  scope: z.string().default(""),
  app_id: z.string().optional(),
});

/** A valid access token and what PayPal said about it. */
export interface AccessToken {
  value: Secret;
  /** Milliseconds since the epoch. */
  expiresAt: number;
  /** Permission URLs granted to the app. */
  scopes: string[];
  appId: string | undefined;
}

export interface AccessTokenOptions {
  baseUrl?: string;
  deps?: HttpDeps;
  policy?: RetryPolicy;
  /** Renew this long before expiry, so a token never runs out mid-request. */
  renewBeforeMs?: number;
}

/**
 * Logs in to PayPal with an app's client credentials and caches the access
 * token in memory until shortly before it expires. Concurrent callers share
 * one login.
 */
export class AccessTokenProvider {
  readonly #credentials: PayPalAppCredentials;
  readonly #baseUrl: string;
  readonly #deps: HttpDeps;
  readonly #policy: RetryPolicy;
  readonly #renewBeforeMs: number;
  #current: AccessToken | undefined;
  #pending: Promise<AccessToken> | undefined;

  constructor(credentials: PayPalAppCredentials, options: AccessTokenOptions = {}) {
    this.#credentials = credentials;
    this.#baseUrl = options.baseUrl ?? SANDBOX_API_BASE_URL;
    this.#deps = options.deps ?? defaultHttpDeps;
    this.#policy = options.policy ?? DEFAULT_RETRY_POLICY;
    this.#renewBeforeMs = options.renewBeforeMs ?? 5 * 60_000;
  }

  /** A token valid for at least `renewBeforeMs`, logging in if needed. */
  async get(): Promise<AccessToken> {
    const current = this.#current;
    if (current && this.#deps.now() < current.expiresAt - this.#renewBeforeMs) return current;
    this.#pending ??= this.#login().finally(() => {
      this.#pending = undefined;
    });
    return this.#pending;
  }

  /** Forget the cached token, e.g. after PayPal rejected it. */
  invalidate(): void {
    this.#current = undefined;
  }

  async #login(): Promise<AccessToken> {
    const startedAt = this.#deps.now();
    const { clientId, clientSecret } = this.#credentials;
    const response = await sendWithRetry(
      {
        operation: OPERATION,
        url: `${this.#baseUrl}${TOKEN_PATH}`,
        init: {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(`${clientId}:${clientSecret.reveal()}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: "grant_type=client_credentials",
        },
        // Logging in has no side effects, so it is safe to repeat.
        idempotent: true,
      },
      this.#deps,
      this.#policy,
    );
    if (!response.ok) throw await toApiError(OPERATION, response);
    const body = await parseResponse(OPERATION, response, tokenResponse);
    this.#current = {
      value: new Secret(body.access_token),
      expiresAt: startedAt + body.expires_in * 1000,
      scopes: body.scope.split(" ").filter(Boolean),
      appId: body.app_id,
    };
    return this.#current;
  }
}
