import { randomBytes, timingSafeEqual } from "node:crypto";
import {
  createSession,
  deleteSession,
  findSessionUser,
  newSessionToken,
  signInWithPayPal,
  SESSION_LIFETIME_MS,
  type Database,
  type User,
} from "@pactpal/db";
import type { PayPalLogin } from "@pactpal/paypal";
// Adds `request.cookies`, `reply.setCookie` and `reply.clearCookie` (registered in app.ts).
import type {} from "@fastify/cookie";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const SESSION_COOKIE = "__Host-pactpal_session";
export const STATE_COOKIE = "__Host-pactpal_signin_state";
export const START_PATH = "/auth/paypal/start";
export const CALLBACK_PATH = "/auth/paypal/callback";
export const LOGOUT_PATH = "/auth/logout";
export const ME_PATH = "/api/me";

const STATE_LIFETIME_S = 10 * 60;

export interface SignInOptions {
  /** PayPal sign-in for the app; undefined until the seller app keys are set. */
  login: Pick<PayPalLogin, "authorizeUrl" | "identify"> | undefined;
  /** Undefined until `DATABASE_URL` is set. */
  database: Database | undefined;
  /** The site's own address; undefined until `PUBLIC_BASE_URL` is set. */
  publicBaseUrl: string | undefined;
  /** The server's clock and id maker, passed in so tests are exact. */
  clock: () => Date;
  newId: () => string;
  /** Random values for the sign-in state; injectable for tests. */
  newState?: () => string;
}

/** Why a sign-in did not finish, as shown to the person on the home page. */
export type SignInProblem =
  "unavailable" | "cancelled" | "expired" | "failed" | "email-taken" | "no-email";

// HttpOnly: page scripts cannot read it. Secure: HTTPS only. SameSite=Lax: not sent with other
// sites' form posts, but sent when PayPal sends the person back. `__Host-` needs Secure and Path=/.
const cookieRules = { path: "/", httpOnly: true, secure: true, sameSite: "lax" } as const;

const callbackQuery = z.object({
  code: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  error: z.string().optional(),
});

/** Compares secrets in constant time, so the comparison does not leak how much matched. */
function sameSecret(a: string | undefined, b: string | undefined): boolean {
  if (a === undefined || b === undefined) return false;
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

const backHome = (reply: FastifyReply, problem: SignInProblem) =>
  reply.redirect(`/?signin=${problem}`);

/**
 * The signed-in user for this request, or undefined. Used by every route that needs to know
 * who is acting.
 */
export async function currentUser(
  request: FastifyRequest,
  database: Database,
  now: Date,
): Promise<User | undefined> {
  const token = request.cookies[SESSION_COOKIE];
  return token === undefined ? undefined : findSessionUser(database, token, now);
}

/**
 * Sign in with PayPal, sign out, and "who am I". The server talks to PayPal; the browser only
 * holds a session cookie. PayPal's token for the person is used once and dropped. Problems send
 * the person home with a short reason; logs carry reason codes and PayPal debug ids, never
 * personal data.
 */
export const signInRoutes: FastifyPluginAsync<SignInOptions> = (app, options) => {
  const { login, database, publicBaseUrl, clock, newId } = options;
  const newState = options.newState ?? (() => randomBytes(32).toString("base64url"));
  const ready = login && database && publicBaseUrl !== undefined;
  const redirectUri = `${publicBaseUrl ?? ""}${CALLBACK_PATH}`;

  app.get(START_PATH, (request, reply) => {
    if (!ready) {
      request.log.warn("Sign-in refused: not configured");
      return backHome(reply, "unavailable");
    }
    const state = newState();
    reply.setCookie(STATE_COOKIE, state, { ...cookieRules, maxAge: STATE_LIFETIME_S });
    return reply.redirect(login.authorizeUrl(state, redirectUri));
  });

  app.get(CALLBACK_PATH, async (request, reply) => {
    if (!ready) return backHome(reply, "unavailable");
    const expected = request.cookies[STATE_COOKIE];
    reply.clearCookie(STATE_COOKIE, cookieRules);
    const query = callbackQuery.safeParse(request.query);
    if (!query.success) return backHome(reply, "failed");
    const { code, state, error } = query.data;
    if (error !== undefined) return backHome(reply, "cancelled");
    if (!sameSecret(state, expected)) {
      request.log.warn("Sign-in refused: state missing or not matching");
      return backHome(reply, "expired");
    }
    if (code === undefined) return backHome(reply, "failed");

    let identity;
    try {
      identity = await login.identify(code);
    } catch (err) {
      request.log.error({ err }, "Sign-in failed: PayPal did not identify the person");
      return backHome(reply, "failed");
    }
    const now = clock();
    const result = await signInWithPayPal(
      database,
      {
        paypalUserId: identity.userId,
        paypalPayerId: identity.payerId,
        email: identity.email,
        emailVerified: identity.emailVerified,
        name: identity.name,
      },
      newId,
      now,
    );
    if (!result.ok) {
      request.log.warn({ reason: result.reason }, "Sign-in refused");
      return backHome(reply, result.reason);
    }
    // A fresh token on every sign-in, so an old cookie can never be reused for a new session.
    const session = await createSession(database, result.user.id, now, newSessionToken());
    reply.setCookie(SESSION_COOKIE, session.token, {
      ...cookieRules,
      maxAge: SESSION_LIFETIME_MS / 1000,
    });
    request.log.info({ userId: result.user.id, created: result.created }, "Signed in");
    return reply.redirect("/");
  });

  app.post(LOGOUT_PATH, async (request, reply) => {
    const token = request.cookies[SESSION_COOKIE];
    if (token !== undefined && database) await deleteSession(database, token);
    reply.clearCookie(SESSION_COOKIE, cookieRules);
    return reply.code(204).send();
  });

  app.get(ME_PATH, async (request, reply) => {
    const user = database && (await currentUser(request, database, clock()));
    if (!user) return reply.code(401).send({ error: "signed out" });
    return reply.send({
      id: user.id,
      email: user.email,
      displayName: user.displayName ?? null,
      paypalLinked: user.paypalUserId !== undefined,
    });
  });

  return Promise.resolve();
};
