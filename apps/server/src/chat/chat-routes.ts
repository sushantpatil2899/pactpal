import {
  ChatNotAllowedError,
  listArtifacts,
  listMessages,
  getArtifact,
  newMessageSchema,
  postMessage,
  postgresContentStore,
  type ChatMessage,
  type Database,
  type Deal,
} from "@pactpal/db";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { readBody, sendRefusal, type DealLookup } from "../deals/access.js";
import { addedByRole } from "../deals/file-routes.js";
import { nameOf, partiesOf } from "../deals/parties.js";
import { roleIn } from "../deals/visibility.js";
import { requestOrigin } from "../request-origin.js";
import { rateLimiter } from "./rate-limit.js";

/** Files PactPal makes from the in-app chat for the AI (7h) start with this; not pasted chats. */
export const CHAT_TRANSCRIPT_PREFIX = "pactpal-chat-";

export interface ChatRouteOptions {
  visibleDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
  recordIp: boolean;
  /** Told after a message is saved, so open pages get it at once (7c). */
  onPosted?: (dealId: string) => Promise<void>;
}

/** At most this many messages per person in `POST_WINDOW_MS`. */
const POSTS_PER_WINDOW = 20;
const POST_WINDOW_MS = 10_000;

const postBody = newMessageSchema.pick({ body: true, clientId: true });
const afterQuery = z.object({ after: z.coerce.number().int().min(0).default(0) });

const REFUSALS: Record<ChatNotAllowedError["reason"], { status: number; error: string }> = {
  "not-your-deal": { status: 403, error: "only the seller and the buyer can write here" },
  closed: { status: 409, error: "this deal was cancelled; its chat is closed" },
  "too-many": { status: 429, error: "this chat already has the most messages allowed" },
};

/** The names each side is shown by: display names or roles, never emails. */
export async function chatNames(db: Database, deal: Deal) {
  const { seller, buyer } = await partiesOf(db, deal);
  return { seller: nameOf(seller, "Seller"), buyer: nameOf(buyer, "Buyer"), system: "PactPal" };
}
export type ChatNames = Awaited<ReturnType<typeof chatNames>>;

/** A message as both pages see it. */
export const messageView = (message: ChatMessage, names: ChatNames) => ({
  id: message.id,
  seq: message.seq,
  role: message.role,
  kind: message.kind,
  name: names[message.role],
  body: message.body,
  notice: message.notice,
  clientId: message.clientId,
  createdAt: message.createdAt.toISOString(),
});

/**
 * The deal's chat (7b), for its seller and its buyer (signed in or by their link): read the
 * messages after a position, post one, and read the pasted chats (text sources the seller or
 * PactPal added), which both sides could already download. Every message is logged.
 */
export const chatRoutes: FastifyPluginAsync<ChatRouteOptions> = (app, options) => {
  const { visibleDeal, clock, newId, recordIp, onPosted } = options;
  const allowPost = rateLimiter(POSTS_PER_WINDOW, POST_WINDOW_MS, clock);

  app.get("/api/deals/:id/chat", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    if (!found) return reply;
    const query = afterQuery.safeParse(request.query);
    if (!query.success) return reply.code(400).send({ error: "invalid", fields: ["after"] });
    const { db, deal, viewer } = found;
    const [messages, names] = await Promise.all([
      listMessages(db, deal.id, query.data.after),
      chatNames(db, deal),
    ]);
    return reply.send({
      role: roleIn(viewer, deal),
      open: deal.status !== "cancelled",
      messages: messages.map((message) => messageView(message, names)),
    });
  });

  app.post("/api/deals/:id/chat", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    if (!found) return reply;
    const { db, deal, viewer } = found;
    // The seller writes signed in with PayPal; the buyer also by their private link.
    if (roleIn(viewer, deal) === "seller" && viewer.access.method !== "paypal") {
      return reply.code(403).send({ error: "only the seller can do this" });
    }
    const body = await readBody(postBody, request, reply);
    if (!body) return reply;
    if (!allowPost(viewer.user.id)) {
      return reply.code(429).send({ error: "too many messages at once; wait a few seconds" });
    }
    try {
      const { message, created } = await postMessage(
        db,
        {
          id: newId(),
          dealId: deal.id,
          authorId: viewer.user.id,
          ...body,
          ...requestOrigin(request, recordIp),
        },
        clock(),
      );
      if (created) {
        request.log.info({ dealId: deal.id, seq: message.seq }, "Chat message posted");
        await onPosted?.(deal.id);
      }
      return await reply
        .code(created ? 201 : 200)
        .send(messageView(message, await chatNames(db, deal)));
    } catch (error) {
      if (!(error instanceof ChatNotAllowedError)) throw error;
      return sendRefusal(reply, REFUSALS[error.reason]);
    }
  });

  app.get("/api/deals/:id/chat/pasted", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    if (!found) return reply;
    const { db, deal } = found;
    const store = postgresContentStore(db, clock);
    const pasted = (await listArtifacts(db, deal.id, "source")).filter(
      (file) =>
        file.mediaType === "text/plain" &&
        addedByRole(file, deal) !== "buyer" &&
        !file.filename.startsWith(CHAT_TRANSCRIPT_PREFIX),
    );
    const chats = await Promise.all(
      pasted.map(async (file) => {
        const { bytes } = await getArtifact(db, store, file.id, deal.id, "source");
        return {
          id: file.id,
          filename: file.filename,
          addedBy: addedByRole(file, deal),
          addedAt: file.createdAt.toISOString(),
          text: new TextDecoder().decode(bytes),
        };
      }),
    );
    return reply.send({ chats });
  });

  return Promise.resolve();
};
