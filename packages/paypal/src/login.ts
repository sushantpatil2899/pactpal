import { z } from "zod";
import { SANDBOX_API_BASE_URL, type PayPalAppCredentials } from "./credentials.js";
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
 * The documented ways to ask who the person is, tried in order. Live, PayPal declined a person's
 * token at the first (400) and third (401); this list is a temporary diagnostic step, to be cut
 * down to the way that works (docs/sandbox-notes.md).
 */
const USERINFO_WAYS = [
  { path: "/v1/identity/oauth2/userinfo", schema: "paypalv1.1" },
  { path: "/v1/identity/oauth2/userinfo", schema: "openid" },
  { path: "/v1/identity/openidconnect/userinfo", schema: "openid" },
] as const;

/** PayPal's answer to the code exchange; any other fields are kept so their names can be logged. */
const personTokenAnswer = z.looseObject({
  access_token: z.string().min(1),
  id_token: z.string().min(1).optional(),
  scope: z.string().optional(),
});

/** One "who is this" way that PayPal declined, as plain data so it can be logged. */
export interface Refusal {
  way: string;
  status: number;
  errorName: string | undefined;
  debugId: string | undefined;
}

/** What the sign-in learned and how; names and codes only, so all of it can be logged. */
export interface SignInDiagnostics {
  /** Field names in PayPal's code-exchange answer (never their values). */
  tokenFields: string[];
  /** Permissions PayPal granted for this sign-in. */
  scopes: string[];
  refusals: Refusal[];
  /** Claim names in PayPal's ID token, or why it could not be used. */
  idToken: { claims: string[] } | { unusable: string };
}

export interface SignInOutcome {
  identity: PayPalIdentity;
  /** Which way told us who the person is. */
  via: string;
  diagnostics: SignInDiagnostics;
}

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

/** Every way of learning who signed in failed; `diagnostics` says what PayPal answered at each. */
export class PayPalLoginRefusedError extends Error {
  override readonly name = "PayPalLoginRefusedError";

  constructor(readonly diagnostics: SignInDiagnostics) {
    const refusals = diagnostics.refusals
      .map(
        (r) =>
          `${r.way} ${r.status}${r.errorName ? ` ${r.errorName}` : ""} (debug id ${r.debugId ?? "none"})`,
      )
      .join("; ");
    super(`PayPal did not say who signed in: ${refusals}`);
  }
}

// ID token claims; the OpenID standard lets PayPal send email and its verification as a claim.
const idTokenClaims = z.looseObject({
  iss: z.string(),
  aud: z.union([z.string(), z.array(z.string())]),
  exp: z.number(),
  sub: z.string().min(1),
  email: z.string().min(1).optional(),
  email_verified: flag.optional(),
  name: z.string().min(1).optional(),
  payer_id: z.string().min(1).optional(),
});

/**
 * Reads PayPal's ID token. Its signature is not checked: the OpenID Connect standard (3.1.3.7)
 * allows that when the token comes straight from the token address over HTTPS, authenticated
 * with the app's credentials, as here. Issuer, audience and expiry are checked.
 */
function readIdToken(
  token: string,
  clientId: string,
  nowMs: number,
): { ok: true; claims: z.infer<typeof idTokenClaims> } | { ok: false; reason: string } {
  const payload = token.split(".")[1];
  if (payload === undefined) return { ok: false, reason: "not a JWT" };
  let json: unknown;
  try {
    json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return { ok: false, reason: "payload is not JSON" };
  }
  const parsed = idTokenClaims.safeParse(json);
  if (!parsed.success) {
    return {
      ok: false,
      reason: `missing ${parsed.error.issues.map((i) => i.path.join(".")).join(", ")}`,
    };
  }
  const claims = parsed.data;
  const issuer = URL.canParse(claims.iss) ? new URL(claims.iss) : undefined;
  if (issuer?.protocol !== "https:" || !/(^|\.)paypal\.com$/.test(issuer.hostname)) {
    return { ok: false, reason: "issuer is not PayPal" };
  }
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audiences.includes(clientId)) return { ok: false, reason: "issued for another app" };
  if (claims.exp * 1000 <= nowMs) return { ok: false, reason: "expired" };
  return { ok: true, claims };
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

  /**
   * Who signed in, from the one-time code PayPal returned: tries each documented "who is this"
   * way, then PayPal's ID token. Throws `PayPalLoginRefusedError` (with what PayPal answered)
   * when none works, or the HTTP error if PayPal itself is failing.
   */
  async identify(code: string): Promise<SignInOutcome> {
    const answer = await requestToken(
      this.#credentials,
      { grant_type: "authorization_code", code },
      personTokenAnswer,
      // A code works once: a repeat after a lost answer would fail, so it is not retried.
      { baseUrl: this.#baseUrl, deps: this.#deps, policy: this.#policy, idempotent: false },
    );
    const diagnostics: SignInDiagnostics = {
      tokenFields: Object.keys(answer).sort(),
      scopes: (answer.scope ?? "").split(" ").filter(Boolean),
      refusals: [],
      idToken: { unusable: "not sent" },
    };

    for (const { path, schema } of USERINFO_WAYS) {
      const way = `GET ${path}?schema=${schema}`;
      const reply = await sendWithRetry(
        {
          operation: way,
          url: `${this.#baseUrl}${path}?schema=${schema}`,
          init: {
            method: "GET",
            headers: { Authorization: `Bearer ${answer.access_token}`, Accept: "application/json" },
          },
          idempotent: true,
        },
        this.#deps,
        this.#policy,
      );
      if (reply.ok) {
        return { identity: await parseResponse(way, reply, userInfo), via: way, diagnostics };
      }
      const error = await toApiError(way, reply);
      // A 5xx means PayPal is failing (already retried), not that this way is wrong.
      if (reply.status >= 500) throw error;
      diagnostics.refusals.push({
        way,
        status: reply.status,
        errorName: error.errorName,
        debugId: error.debugId,
      });
    }

    if (answer.id_token !== undefined) {
      const read = readIdToken(answer.id_token, this.#credentials.clientId, this.#deps.now());
      if (read.ok) {
        const { claims } = read;
        diagnostics.idToken = { claims: Object.keys(claims).sort() };
        return {
          identity: {
            userId: claims.sub,
            payerId: claims.payer_id,
            email: claims.email,
            emailVerified: claims.email_verified ?? false,
            name: claims.name,
          },
          via: "id_token",
          diagnostics,
        };
      }
      diagnostics.idToken = { unusable: read.reason };
    }
    throw new PayPalLoginRefusedError(diagnostics);
  }
}
