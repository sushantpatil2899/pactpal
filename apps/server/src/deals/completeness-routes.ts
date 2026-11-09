import { timelineOf } from "@pactpal/timeline";
import { getLatestScope, readLedger } from "@pactpal/db";
import { completenessScore } from "@pactpal/score";
import type { FastifyPluginAsync } from "fastify";
import { signedRecord } from "../payments/signed-record.js";
import type { DealLookup } from "./access.js";

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
    const [entries, record] = await Promise.all([readLedger(db, deal.id), signedRecord(db, deal)]);
    const scope = record?.scope ?? (await getLatestScope(db, deal.id));
    return reply.send(
      completenessScore({
        entries,
        agreement: scope && {
          version: scope.version,
          stages: scope.content.milestones.length,
          exclusions: scope.content.exclusions.length,
          lines: scope.content.deliverables.length,
          markedLines: (scope.content.deliverableKinds ?? []).filter((mark) => mark !== null)
            .length,
          signed: record !== undefined,
          // Steps people record (7k); payments and deliveries have items of their own.
          manualSteps: timelineOf(scope.content).flatMap((step, i) =>
            step.kind === "payment" || step.kind === "delivery" ? [] : [i + 1],
          ),
        },
      }),
    );
  });
  return Promise.resolve();
};
