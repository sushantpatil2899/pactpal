import {
  asStepUpdates,
  getDeal,
  listDealDisputes,
  listDealsForUser,
  listMessages,
  listNotifications,
  listStepUpdates,
  readPositions,
  scopeTotalMinor,
  type Database,
  type Deal,
} from "@pactpal/db";
import { timelineOf, timelineProgress } from "@pactpal/timeline";
import type { FastifyPluginAsync } from "fastify";
import { requireViewer } from "./access.js";
import { dealCompleteness, judgedScope } from "./completeness.js";
import { dealOverview } from "./overview.js";
import { money, stepTerms } from "./scope-view.js";
import { stageFacts } from "./timeline-routes.js";
import { canSeeDeal, roleIn, type Viewer } from "./visibility.js";

/** The most deals one answer describes: the most recently changed ones. */
export const OVERVIEW_LIMIT = 200;

export interface OverviewRouteOptions {
  database: Database | undefined;
  clock: () => Date;
  /** A deal as the deal list describes it, for this viewer. */
  describe: (db: Database, deal: Deal, viewer: Viewer) => Promise<object>;
}

/** What one deal's row on the dashboard needs, read with the deal's own tested readers. */
async function overviewOf(db: Database, deal: Deal, viewer: Viewer, today: string) {
  const role = roleIn(viewer, deal);
  const judged = await judgedScope(db, deal);
  const { scope, signed } = judged;
  const [stages, updates, disputes, positions] = await Promise.all([
    signed ? stageFacts(db, deal.id) : [],
    signed ? listStepUpdates(db, deal.id) : [],
    // The buyer deals with a dispute in PayPal; only the seller sees it here.
    role === "seller" ? listDealDisputes(db, deal.id) : [],
    readPositions(db, deal),
  ]);
  const [unread, completeness] = await Promise.all([
    listMessages(db, deal.id, positions[role]),
    role === "seller" ? dealCompleteness(db, deal, judged) : undefined,
  ]);
  const signedScope = signed ? scope : undefined;
  const steps = signedScope ? stepTerms(signedScope.content, deal.currency) : [];
  const progress = signedScope
    ? timelineProgress(timelineOf(signedScope.content), asStepUpdates(updates), stages)
    : [];
  const dispute = disputes.find((d) => d.status !== "RESOLVED");
  return {
    updatedAt: deal.updatedAt.toISOString(),
    amount: scope ? money(scopeTotalMinor(scope.content), deal.currency) : null,
    ...dealOverview({ status: deal.status, steps, progress, dispute, today }),
    /** The evidence completeness score (0 to 100), for the seller; never a prediction. */
    completeness: completeness?.score ?? null,
    unreadMessages: unread.filter((message) => message.role !== role).length,
    dispute: dispute
      ? { disputeId: dispute.disputeId, respondBy: dispute.sellerDueAt?.toISOString() ?? null }
      : null,
  };
}

/**
 * Every deal the person sells or buys in, with what a dashboard shows for each: its stage, the
 * one thing it waits for, its amount, completeness, unread chat and open dispute. Read-only: it
 * writes nothing and logs no evidence. One request replaces several per deal from the browser.
 */
export const overviewRoutes: FastifyPluginAsync<OverviewRouteOptions> = (app, options) => {
  const { database, clock, describe } = options;
  app.get("/api/deals/overview", async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "unavailable" });
    const now = clock();
    const viewer = await requireViewer(request, reply, database, now);
    if (!viewer) return reply;
    const own =
      viewer.access.method === "link"
        ? [await getDeal(database, viewer.access.dealId)].filter((d): d is Deal => d !== undefined)
        : await listDealsForUser(database, viewer.user.id);
    const deals = own
      .filter((deal) => canSeeDeal(viewer, deal))
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, OVERVIEW_LIMIT);
    const notes = await listNotifications(database, viewer.user.id);
    const today = now.toISOString().slice(0, 10);
    return reply.send({
      deals: await Promise.all(
        deals.map(async (deal) => ({
          ...(await describe(database, deal, viewer)),
          ...(await overviewOf(database, deal, viewer, today)),
          unreadNotifications: notes.filter((n) => n.dealId === deal.id && n.readAt === null)
            .length,
        })),
      ),
    });
  });
  return Promise.resolve();
};
