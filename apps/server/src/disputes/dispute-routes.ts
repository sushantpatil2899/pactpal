import {
  getDispute,
  latestDisputeCheck,
  listArtifacts,
  listDealDisputes,
  readLedger,
  type DisputeCheck,
} from "@pactpal/db";
import { z } from "zod";
import type { FastifyPluginAsync } from "fastify";
import type { DealLookup } from "../deals/access.js";
import { CHECK_INTERVAL_MS } from "../deals/milestone-routes.js";
import type { DisputeChecker } from "./checker.js";
import { disputePageView, disputeSummaryView } from "./dispute-view.js";

const disputeParams = z.object({ disputeId: z.string().min(1).max(100) });

export interface DisputeRouteOptions {
  sellersDeal: DealLookup;
  clock: () => Date;
  /** Starts a dispute check; absent until the database and the seller app's PayPal keys are set. */
  disputes: DisputeChecker | undefined;
}

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
      disputes: rows.map(disputeSummaryView),
      lastCheck: checkView(check),
      canCheck: disputes !== undefined,
    });
  });

  // One dispute's page (5c): only a dispute tied to this deal; anything else is not found.
  app.get("/api/deals/:id/disputes/:disputeId", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const params = disputeParams.safeParse(request.params);
    const dispute = params.success ? await getDispute(found.db, params.data.disputeId) : undefined;
    if (dispute?.dealId !== found.deal.id) return reply.code(404).send({ error: "not found" });
    const [ledger, files, check] = await Promise.all([
      readLedger(found.db, found.deal.id),
      listArtifacts(found.db, found.deal.id, "source"),
      latestDisputeCheck(found.db),
    ]);
    return reply.send({
      ...disputePageView(dispute, found.deal, ledger, files),
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
