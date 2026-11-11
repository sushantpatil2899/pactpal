import { createSession, deleteSession, type Database } from "@pactpal/db";
import type { FastifyInstance } from "fastify";
import { SESSION_COOKIE } from "./auth/sign-in.js";
import type { RouteCaller } from "./agents/tools.js";

/**
 * Calls PactPal's own routes for one agent request as the key's seller, through a session made
 * for this request alone (never given out). Every check, refusal and log entry of the routes
 * applies unchanged.
 */
export function routeCaller(app: FastifyInstance, token: string): RouteCaller {
  return async (method, url, body, headers) => {
    const answer = await app.inject({
      method,
      url,
      cookies: { [SESSION_COOKIE]: token },
      ...(headers === undefined ? {} : { headers }),
      ...(body === undefined ? {} : { payload: body }),
    });
    let parsed: unknown = null;
    try {
      parsed = answer.body === "" ? null : (JSON.parse(answer.body) as unknown);
    } catch {
      parsed = null;
    }
    return { status: answer.statusCode, body: parsed };
  };
}

/**
 * Runs `work` as one person through PactPal's own routes (8c agents, 9b-2 demo seed), with a
 * session made for this work alone and ended afterwards, whatever happens.
 */
export async function actingAs<T>(
  app: FastifyInstance,
  db: Database,
  userId: string,
  now: Date,
  work: (call: RouteCaller) => Promise<T>,
): Promise<T> {
  const { token } = await createSession(db, userId, now);
  try {
    return await work(routeCaller(app, token));
  } finally {
    await deleteSession(db, token);
  }
}
