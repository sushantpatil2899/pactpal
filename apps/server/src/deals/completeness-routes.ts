import type { FastifyPluginAsync } from "fastify";
import type { DealLookup } from "./access.js";
import { dealCompleteness, judgedScope } from "./completeness.js";

export interface CompletenessRouteOptions {
  sellersDeal: DealLookup;
}

/**
 * The deal's evidence completeness score, for its seller only: worked out from the evidence log
 * and the signed version (or, before signing, the newest version) on every request; never stored.
 */
export const completenessRoutes: FastifyPluginAsync<CompletenessRouteOptions> = (
  app,
  { sellersDeal },
) => {
  app.get("/api/deals/:id/completeness", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const { db, deal } = found;
    return reply.send(await dealCompleteness(db, deal, await judgedScope(db, deal)));
  });
  return Promise.resolve();
};
