import {
  latestDisputeCheck,
  listDealDisputes,
  type DisputeCheck,
  type StoredDispute,
} from "@pactpal/db";
import type { FastifyPluginAsync } from "fastify";
import type { DealLookup } from "../deals/access.js";
import { CHECK_INTERVAL_MS } from "../deals/milestone-routes.js";
import { money } from "../deals/scope-view.js";
import type { DisputeChecker } from "./checker.js";

export interface DisputeRouteOptions {
  sellersDeal: DealLookup;
  clock: () => Date;
  /** Starts a dispute check; absent until the database and the seller app's PayPal keys are set. */
  disputes: DisputeChecker | undefined;
}

/** One dispute as the seller's page sees it: PayPal's words, the amount and the respond-by date. */
const disputeView = (dispute: StoredDispute) => ({
  disputeId: dispute.disputeId,
  stage: dispute.stage,
  reason: dispute.reason,
  status: dispute.status,
  paypalStage: dispute.stageName,
  amount:
    dispute.amountMinor === null || dispute.currency === null
      ? null
      : { ...money(dispute.amountMinor, dispute.currency), currency: dispute.currency },
  sellerDueAt: dispute.sellerDueAt?.toISOString() ?? null,
  outcome: dispute.outcome,
  firstSeenAt: dispute.firstSeenAt.toISOString(),
});

/** The newest check, without its id: when, what started it, and how it went. */
const checkView = (check: DisputeCheck | undefined) =>
  check === undefined
    ? null
    : {
        source: check.source,
        startedAt: check.startedAt.toISOString(),
        finishedAt: check.finishedAt?.toISOString() ?? null,
        ok: check.finishedAt === null ? null : check.failure === null,
      };

/**
 * A deal's disputes, for its seller only (the buyer deals with disputes in PayPal). "Check now"
 * starts a check of the seller's PayPal disputes at most once a deal every 30 seconds.
 */
export const disputeRoutes: FastifyPluginAsync<DisputeRouteOptions> = (app, options) => {
  const { sellersDeal, clock, disputes } = options;
  /** When each deal last asked for a check (this server only; enough for one instance). */
  const lastAsked = new Map<string, number>();

  app.get("/api/deals/:id/disputes", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const [rows, check] = await Promise.all([
      listDealDisputes(found.db, found.deal.id),
      latestDisputeCheck(found.db),
    ]);
    return reply.send({
      disputes: rows.map(disputeView),
      lastCheck: checkView(check),
      canCheck: disputes !== undefined,
    });
  });

  app.post("/api/deals/:id/disputes/check", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    if (!disputes) return reply.code(503).send({ error: "dispute checks are not set up" });
    const dealId = found.deal.id;
    const now = clock().getTime();
    const last = lastAsked.get(dealId);
    if (last !== undefined && now - last < CHECK_INTERVAL_MS) {
      return reply.code(429).send({ error: "checked a moment ago; try again in a few seconds" });
    }
    lastAsked.set(dealId, now);
    try {
      await disputes.start({ kind: "button", dealId });
    } catch (error) {
      request.log.warn(
        { dealId, err: error instanceof Error ? error.name : "unknown" },
        "Dispute check not started",
      );
      return reply.code(502).send({ error: "the check could not be started; try again" });
    }
    return reply.code(202).send({ started: true });
  });

  return Promise.resolve();
};
