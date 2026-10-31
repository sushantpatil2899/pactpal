import { z } from "zod";
import { SANDBOX_API_BASE_URL, type PayPalAppCredentials } from "./credentials.js";
import type { PayPalApiError } from "./errors.js";
import {
  defaultHttpDeps,
  parseResponse,
  sendWithRetry,
  toApiError,
  type HttpDeps,
} from "./http.js";
import { DEFAULT_RETRY_POLICY, type RetryPolicy } from "./retry.js";
import { requestToken } from "./token.js";

/** Where a person approves sign-in. Sandbox only, like the API address (docs/scope.md). */
export const SANDBOX_LOGIN_URL = "https://www.sandbox.paypal.com/connect";

/** What PactPal asks to know: name, email, and the PayPal account id with verification status. */
export const LOGIN_SCOPES = [
  "openid",
  "profile",
  "email",
  "https://uri.paypal.com/services/paypalattributes",
] as const;

/**
 * Where to ask who the person is. PayPal's sign-in guide names the first; its API reference
 * names the second. Live, the second refused a person's token (401), so it is only a fallback.
 */
const USERINFO_ADDRESSES = [
  { path: "/v1/identity/oauth2/userinfo", schema: "paypalv1.1" },
  { path: "/v1/identity/openidconnect/userinfo", schema: "openid" },
] as const;

/** Answers that mean "not with this token here", so the other address is worth asking. */
const REFUSED = new Set([401, 403, 404]);

/** Who signed in, as PayPal describes them. */
export interface PayPalIdentity {
  /** PayPal's id for this person's sign-in; the same person always gets the same id. */
  userId: string;
  /** The PayPal account id used by other PayPal APIs, when PayPal shares it. */
  payerId: string | undefined;
  email: string | undefined;
  /** True only when PayPal says the email is confirmed. */
  emailVerified: boolean;
  name: string | undefined;
}

const flag = z.union([
  z.boolean(),
  z.enum(["true", "false"]).transform((value) => value === "true"),
]);

// PayPal documents two shapes (OpenID `sub`/`email`, and the older `user_id`/`emails`), so both are read.
const userInfo = z
  .looseObject({
    user_id: z.string().min(1).optional(),
    sub: z.string().min(1).optional(),
    payer_id: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    email: z.string().min(1).optional(),
    email_verified: flag.optional(),
    emails: z
      .array(
        z.looseObject({
          value: z.string().min(1),
          primary: flag.optional(),
          confirmed: flag.optional(),
        }),
      )
      .optional(),
  })
  .refine((info) => info.user_id !== undefined || info.sub !== undefined, {
    message: "user_id or sub is required",
    path: ["user_id"],
  })
  .transform((info): PayPalIdentity => {
    const listed = info.emails?.find((e) => e.primary === true) ?? info.emails?.[0];
    return {
      userId: info.user_id ?? info.sub ?? "",
      payerId: info.payer_id,
      email: info.email ?? listed?.value,
      emailVerified: info.email_verified ?? listed?.confirmed ?? false,
      name: info.name,
    };
  });

/** PayPal refused the person's token at every "who is this" address; each refusal is kept. */
export class PayPalLoginRefusedError extends Error {
  override readonly name = "PayPalLoginRefusedError";

  constructor(readonly refusals: readonly PayPalApiError[]) {
    super(`PayPal refused the person's token: ${refusals.map((e) => e.message).join("; ")}`);
  }
}

export interface PayPalLoginOptions {
  baseUrl?: string;
  loginUrl?: string;
  deps?: HttpDeps;
  policy?: RetryPolicy;
}

/**
 * "Log in with PayPal" for one app: builds the address that sends a person to PayPal, then
 * turns the one-time code PayPal returns into who that person is. PayPal's token for the person
 * is used once and dropped; PactPal keeps only the identity.
 */
export class PayPalLogin {
  readonly #credentials: PayPalAppCredentials;
  readonly #baseUrl: string;
  readonly #loginUrl: string;
  readonly #deps: HttpDeps;
  readonly #policy: RetryPolicy;

  constructor(credentials: PayPalAppCredentials, options: PayPalLoginOptions = {}) {
    this.#credentials = credentials;
    this.#baseUrl = options.baseUrl ?? SANDBOX_API_BASE_URL;
    this.#loginUrl = options.loginUrl ?? SANDBOX_LOGIN_URL;
    this.#deps = options.deps ?? defaultHttpDeps;
    this.#policy = options.policy ?? DEFAULT_RETRY_POLICY;
  }

  /**
   * Where to send the browser. `state` is a one-time random value the caller checks on return;
   * `redirectUri` must match the return address registered for the app exactly.
   */
  authorizeUrl(state: string, redirectUri: string): string {
    const query = new URLSearchParams({
      flowEntry: "static",
      client_id: this.#credentials.clientId,
      response_type: "code",
      scope: LOGIN_SCOPES.join(" "),
      redirect_uri: redirectUri,
      state,
    });
    return `${this.#loginUrl}?${query.toString()}`;
  }

  /** Who signed in, from the one-time code PayPal returned. */
  async identify(code: string): Promise<PayPalIdentity> {
    const { access_token: personToken } = await requestToken(
      this.#credentials,
      { grant_type: "authorization_code", code },
      // A code works once: a repeat after a lost answer would fail, so it is not retried.
      { baseUrl: this.#baseUrl, deps: this.#deps, policy: this.#policy, idempotent: false },
    );

    const refusals: PayPalApiError[] = [];
    for (const { path, schema } of USERINFO_ADDRESSES) {
      const lookup = `GET ${path}`;
      const reply = await sendWithRetry(
        {
          operation: lookup,
          url: `${this.#baseUrl}${path}?schema=${schema}`,
          init: {
            method: "GET",
            headers: { Authorization: `Bearer ${personToken}`, Accept: "application/json" },
          },
          idempotent: true,
        },
        this.#deps,
        this.#policy,
      );
      if (reply.ok) return parseResponse(lookup, reply, userInfo);
      const error = await toApiError(lookup, reply);
      if (!REFUSED.has(reply.status)) throw error;
      refusals.push(error);
    }
    throw new PayPalLoginRefusedError(refusals);
  }
}
