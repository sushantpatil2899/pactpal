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

/** PayPal's answer when the app logs in with its own credentials. */
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
 * Asks PayPal's token address for a token, authenticating as the app (its id and secret).
 * Shared by the app's own login and by person sign-in ("Log in with PayPal").
 */
export async function requestToken<T>(
  credentials: PayPalAppCredentials,
  form: Record<string, string>,
  /** The answer expected: the app's login and person sign-in read different fields. */
  answer: z.ZodType<T>,
  options: {
    baseUrl: string;
    deps: HttpDeps;
    policy: RetryPolicy;
    idempotent: boolean;
    /** The token address; PayPal's general one unless given. */
    path?: string;
  },
): Promise<T> {
  const path = options.path ?? TOKEN_PATH;
  const operation = `POST ${path}`;
  const { clientId, clientSecret } = credentials;
  const response = await sendWithRetry(
    {
      operation,
      url: `${options.baseUrl}${path}`,
      init: {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret.reveal()}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams(form).toString(),
      },
      idempotent: options.idempotent,
    },
    options.deps,
    options.policy,
  );
  if (!response.ok) throw await toApiError(operation, response);
  return parseResponse(operation, response, answer);
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
    const body = await requestToken(
      this.#credentials,
      { grant_type: "client_credentials" },
      tokenResponse,
      // Logging in has no side effects, so it is safe to repeat.
      { baseUrl: this.#baseUrl, deps: this.#deps, policy: this.#policy, idempotent: true },
    );
    this.#current = {
      value: new Secret(body.access_token),
      expiresAt: startedAt + body.expires_in * 1000,
      scopes: body.scope.split(" ").filter(Boolean),
      appId: body.app_id,
    };
    return this.#current;
  }
}
