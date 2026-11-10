import { DEAL_TABS, listNotifications, markNotificationsRead, type Database } from "@pactpal/db";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { readBody, requireViewer } from "../deals/access.js";
import type { ChatBus } from "./bus.js";

export interface NotificationRouteOptions {
  database: Database | undefined;
  clock: () => Date;
  bus: ChatBus;
}

const listQuery = z.object({ dealId: z.uuid().optional() });
const readRequest = z.union([
  z.strictObject({ ids: z.array(z.uuid()).min(1).max(50) }),
  z.strictObject({ dealId: z.uuid() }),
  /** A tab was opened: its news is settled (7o). */
  z.strictObject({ dealId: z.uuid(), tab: z.enum(DEAL_TABS) }),
]);

/**
 * The signed-in person's notifications (7e): list them (all deals, or one) and mark them read.
 * A buyer-link visitor sees only their link's deal.
 */
export const notificationRoutes: FastifyPluginAsync<NotificationRouteOptions> = (app, options) => {
  const { database, clock, bus } = options;

  app.get("/api/notifications", async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "unavailable" });
    const viewer = await requireViewer(request, reply, database, clock());
    if (!viewer) return reply;
    const query = listQuery.safeParse(request.query);
    if (!query.success) return reply.code(400).send({ error: "invalid", fields: ["dealId"] });
    const linkDeal = viewer.access.method === "link" ? viewer.access.dealId : undefined;
    if (
      linkDeal !== undefined &&
      query.data.dealId !== undefined &&
      query.data.dealId !== linkDeal
    ) {
      return reply.send({ notifications: [] });
    }
    const notifications = await listNotifications(
      database,
      viewer.user.id,
      linkDeal ?? query.data.dealId,
    );
    return reply.send({
      notifications: notifications.map((n) => ({
        id: n.id,
        dealId: n.dealId,
        kind: n.kind,
        tab: n.tab,
        text: n.text,
        createdAt: n.createdAt.toISOString(),
        read: n.readAt !== null,
      })),
    });
  });

  app.post("/api/notifications/read", async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "unavailable" });
    const viewer = await requireViewer(request, reply, database, clock());
    if (!viewer) return reply;
    const body = await readBody(readRequest, request, reply);
    if (!body) return reply;
    if (
      viewer.access.method === "link" &&
      "dealId" in body &&
      body.dealId !== viewer.access.dealId
    ) {
      return reply.code(404).send({ error: "not found" });
    }
    // Only the person's own notifications change, whatever ids are sent.
    const changed = await markNotificationsRead(database, viewer.user.id, body, clock());
    if (changed > 0) await bus.publish({ type: "notify", userId: viewer.user.id });
    return reply.send({ changed });
  });

  return Promise.resolve();
};
