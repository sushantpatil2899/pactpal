import { lastMessages, type Database } from "@pactpal/db";
import type { FastifyPluginAsync } from "fastify";
import { requireViewer } from "./access.js";
import { visibleDeals } from "./overview-routes.js";

/** How much of the newest message a conversation list shows. */
export const PREVIEW_CHARS = 160;

/** The start of a message for a list: one line, cut at a word where it can be. */
export function preview(body: string, limit = PREVIEW_CHARS): string {
  const line = body.replace(/\s+/g, " ").trim();
  if (line.length <= limit) return line;
  const cut = line.slice(0, limit);
  const space = cut.lastIndexOf(" ");
  return `${(space > limit * 0.6 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

export interface ConversationRouteOptions {
  database: Database | undefined;
  clock: () => Date;
}

/**
 * The newest message in each deal's chat, for the Messages page. Each deal keeps its own chat
 * (the agreement is drafted from it and the evidence log cites it); this only lists them.
 * Read-only: it moves no one's read position, writes nothing and logs no evidence.
 */
export const conversationRoutes: FastifyPluginAsync<ConversationRouteOptions> = (app, options) => {
  const { database, clock } = options;
  app.get("/api/conversations", async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "unavailable" });
    const viewer = await requireViewer(request, reply, database, clock());
    if (!viewer) return reply;
    const deals = await visibleDeals(database, viewer);
    const newest = await lastMessages(
      database,
      deals.map((deal) => deal.id),
    );
    return reply.send({
      conversations: deals.map((deal) => {
        const last = newest.get(deal.id);
        return {
          dealId: deal.id,
          last: last
            ? {
                seq: last.seq,
                role: last.role,
                kind: last.kind,
                text: preview(last.body),
                at: last.createdAt.toISOString(),
              }
            : null,
        };
      }),
    });
  });
  return Promise.resolve();
};
