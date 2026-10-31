import { deleteSession, redeemDealLink, type Database } from "@pactpal/db";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { currentSession, setSessionCookie } from "./sign-in.js";

export const REDEEM_PATH = "/api/links/redeem";

export interface LinkOptions {
  /** Undefined until `DATABASE_URL` is set. */
  database: Database | undefined;
  /** The server's clock, passed in so tests are exact. */
  clock: () => Date;
}

const redeemBody = z.object({ token: z.string().max(200) });

/**
 * `POST /api/links/redeem`: lets the holder of a buyer link in for that one deal. The page sends
 * the secret in the body after the person presses "Continue", because mail scanners open links
 * but do not press buttons. The secret is never logged.
 */
export const linkRoutes: FastifyPluginAsync<LinkOptions> = (app, { database, clock }) => {
  app.post(REDEEM_PATH, async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "unavailable" });
    const body = redeemBody.safeParse(request.body);
    if (!body.success) return reply.code(400).send({ error: "unknown" });
    const now = clock();
    const prior = await currentSession(request, database, now);
    const result = await redeemDealLink(database, body.data.token, now);
    if (!result.ok) {
      request.log.info({ reason: result.reason }, "Buyer link refused");
      return reply.code(400).send({ error: result.reason });
    }
    if (prior?.access.method === "paypal" && prior.user.id === result.userId) {
      // Already signed in with PayPal as this buyer: keep that session instead of a narrower one.
      await deleteSession(database, result.session.token);
    } else {
      setSessionCookie(reply, result.session.token);
    }
    request.log.info({ dealId: result.dealId }, "Buyer link used");
    return reply.send({ dealId: result.dealId });
  });
  return Promise.resolve();
};
