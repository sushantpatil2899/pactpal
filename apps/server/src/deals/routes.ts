import {
  DEAL_CATEGORIES,
  DEAL_CURRENCIES,
  createDeal,
  getDeal,
  getUser,
  listDealsForUser,
  newDealSchema,
  readLedger,
  verifyStoredLedger,
  type Database,
  type Deal,
} from "@pactpal/db";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { canSeeDeal, requireViewer, roleIn, type Viewer } from "./access.js";

export interface DealOptions {
  /** Undefined until `DATABASE_URL` is set. */
  database: Database | undefined;
  /** The server's clock and id maker, passed in so tests are exact. */
  clock: () => Date;
  newId: () => string;
}

const newDealBody = newDealSchema.pick({ title: true, category: true, currency: true });
const dealParams = z.object({ id: z.uuid() });

const categoryLabels = new Map<string, string>(
  Object.entries(DEAL_CATEGORIES).map(([id, { label }]) => [id, label]),
);

/** A deal as the pages see it, with the asking person's role. */
const dealView = (deal: Deal, viewer: Viewer) => ({
  id: deal.id,
  title: deal.title,
  kind: deal.kind,
  category: deal.category,
  categoryLabel: categoryLabels.get(deal.category) ?? deal.category,
  currency: deal.currency,
  status: deal.status,
  createdAt: deal.createdAt.toISOString(),
  hasBuyer: deal.buyerId !== undefined,
  role: roleIn(viewer, deal),
});

const notFound = (reply: FastifyReply) => reply.code(404).send({ error: "not found" });

/**
 * Deal routes: create and list deals, open one, and read and check its evidence log. A person
 * sees only deals they sell or buy in; a buyer-link visitor only the link's deal. Any other deal
 * answers 404, so its existence is not revealed.
 */
export const dealRoutes: FastifyPluginAsync<DealOptions> = (app, { database, clock, newId }) => {
  app.get("/api/deal-options", (_request, reply) =>
    reply.send({
      categories: [...categoryLabels].map(([id, label]) => ({ id, label })),
      currencies: DEAL_CURRENCIES,
    }),
  );

  /** The deal behind `:id` if this person may see it; otherwise the answer is already sent. */
  async function visibleDeal(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<{ viewer: Viewer; deal: Deal; db: Database } | undefined> {
    if (!database) {
      await reply.code(503).send({ error: "unavailable" });
      return undefined;
    }
    const viewer = await requireViewer(request, reply, database, clock());
    if (!viewer) return undefined;
    const params = dealParams.safeParse(request.params);
    const deal = params.success ? await getDeal(database, params.data.id) : undefined;
    if (!deal || !canSeeDeal(viewer, deal)) {
      await notFound(reply);
      return undefined;
    }
    return { viewer, deal, db: database };
  }

  app.post("/api/deals", async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "unavailable" });
    const viewer = await requireViewer(request, reply, database, clock());
    if (!viewer) return reply;
    if (viewer.access.method !== "paypal") {
      return reply.code(403).send({ error: "sign in with PayPal to create deals" });
    }
    const body = newDealBody.safeParse(request.body);
    if (!body.success) {
      return reply.code(400).send({
        error: "invalid",
        fields: body.error.issues.map((issue) => issue.path.join(".")),
      });
    }
    const { deal } = await createDeal(
      database,
      { ...body.data, id: newId(), sellerId: viewer.user.id },
      clock(),
    );
    request.log.info({ dealId: deal.id }, "Deal created");
    return reply.code(201).send(dealView(deal, viewer));
  });

  app.get("/api/deals", async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "unavailable" });
    const viewer = await requireViewer(request, reply, database, clock());
    if (!viewer) return reply;
    const deals =
      viewer.access.method === "link"
        ? [await getDeal(database, viewer.access.dealId)].filter((d): d is Deal => d !== undefined)
        : await listDealsForUser(database, viewer.user.id);
    return reply.send({
      deals: deals.filter((deal) => canSeeDeal(viewer, deal)).map((d) => dealView(d, viewer)),
    });
  });

  app.get("/api/deals/:id", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    return found ? reply.send(dealView(found.deal, found.viewer)) : reply;
  });

  app.get("/api/deals/:id/ledger", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    if (!found) return reply;
    const { deal, db } = found;
    // People are named by their display name or role; emails are not shown to the other side.
    const people = new Map<string, string>();
    for (const [id, role] of [
      [deal.sellerId, "Seller"],
      [deal.buyerId, "Buyer"],
    ] as const) {
      if (id !== undefined) people.set(id, (await getUser(db, id))?.displayName ?? role);
    }
    const entries = await readLedger(db, deal.id);
    return reply.send({
      entries: entries.map((entry) => ({
        seq: entry.seq,
        type: entry.type,
        actor: entry.actor,
        actorName: entry.actorId === undefined ? null : (people.get(entry.actorId) ?? null),
        serverTime: entry.serverTime,
        payload: entry.payload,
        entryHash: entry.entryHash,
        prevHash: entry.prevHash,
      })),
    });
  });

  app.get("/api/deals/:id/ledger/check", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    if (!found) return reply;
    const result = await verifyStoredLedger(found.db, found.deal.id);
    return reply.send(
      result.valid
        ? { status: "unchanged", entries: result.length, latestFingerprint: result.head }
        : { status: "changed", atEntry: result.brokenAt, reason: result.reason },
    );
  });

  return Promise.resolve();
};
