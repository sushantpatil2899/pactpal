import {
  BuyerNotAllowedError,
  DEAL_CURRENCIES,
  addBuyer,
  addBuyerSchema,
  createDeal,
  createDealLink,
  getDeal,
  getUser,
  listDealsForUser,
  newDealSchema,
  readLedger,
  verifyStoredLedger,
  type Database,
  type Deal,
} from "@pactpal/db";
import { sha256Hex } from "@pactpal/ledger";
import type { FastifyPluginAsync } from "fastify";
import { dealLinkEmail, dealLinkUrl } from "../email/deal-link-email.js";
import type { EmailSender } from "@pactpal/email";
import { dealAccess, readBody, requireViewer } from "./access.js";
import type { DraftingRuntime } from "../drafting/runtime.js";
import { draftRoutes } from "./draft-routes.js";
import { fileRoutes } from "./file-routes.js";
import { acceptanceRoutes } from "./acceptance-routes.js";
import { changeOrderRoutes } from "./change-order-routes.js";
import { completenessRoutes } from "./completeness-routes.js";
import { questionRoutes } from "./question-routes.js";
import type { InvoiceSender } from "../payments/invoice-sender.js";
import { disputeWriters, type LinkedApps } from "../sellers/linked-apps.js";
import { deliveryCheckRoutes } from "./delivery-check-routes.js";
import { deliveryRoutes } from "./delivery-routes.js";
import { messageRoutes } from "./message-routes.js";
import { milestoneRoutes } from "./milestone-routes.js";
import { categoryLabelOf, categoryLabels, nameOf, partiesOf } from "./parties.js";
import { modelMemory } from "../drafting/model-memory.js";
import { intakeRoutes } from "./intake-routes.js";
import { scopeRoutes } from "./scope-routes.js";
import { screenshotRoutes } from "./screenshot-routes.js";
import { canSeeDeal, roleIn, type Viewer } from "./visibility.js";
import type { ClaimRunner, DisputeChecker } from "../disputes/checker.js";
import { actionRoutes } from "../disputes/action-routes.js";
import type { DisputeWriter } from "../disputes/action-service.js";
import { claimRoutes } from "../disputes/claim-routes.js";
import { packetRoutes } from "../disputes/packet-routes.js";
import { disputeRoutes } from "../disputes/dispute-routes.js";
import { chatRoutes } from "../chat/chat-routes.js";
import type { ChatBus } from "../chat/bus.js";
import { LiveHub } from "../chat/live-hub.js";
import { liveRoutes } from "../chat/live-routes.js";
import { notificationRoutes } from "../chat/notification-routes.js";
import { Notifier } from "../chat/notifier.js";
import { mcpRoutes } from "../agents/mcp-routes.js";
import { agentRequestRoutes } from "../agents/request-routes.js";
import { DealCards } from "../chat/cards.js";
import { timelineRoutes } from "./timeline-routes.js";

export interface DealOptions {
  /** Undefined until `DATABASE_URL` is set. */
  database: Database | undefined;
  /** The server's clock and id maker, passed in so tests are exact. */
  clock: () => Date;
  newId: () => string;
  /** The site's own address, for buyer links; undefined until `PUBLIC_BASE_URL` is set. */
  publicBaseUrl: string | undefined;
  /** Sends buyer emails; a stand-in that sends nothing until an email service is chosen. */
  email: EmailSender;
  /** Runs the council for drafts; undefined until a database and an AI model key are set. */
  drafting?: DraftingRuntime | undefined;
  /** Whether visitors' IP addresses are known (the number of proxies is set); false by default. */
  recordIp?: boolean;
  /** PayPal invoices from the seller app; undefined until its keys are set. */
  invoices?: InvoiceSender | undefined;
  /** Sellers' own linked apps (6h-3); absent until the database and encryption key are set. */
  linked?: LinkedApps | undefined;
  /** The forwarding domain (4p-2), e.g. in.pact-pal.app; undefined while forwarding is off. */
  inboundDomain?: string | undefined;
  /** Starts dispute checks; undefined until the database and the seller app's keys are set. */
  disputes?: DisputeChecker | undefined;
  /** Starts claim comparisons (5d); undefined until AI models (or Render) are set up. */
  claims?: ClaimRunner | undefined;
  /** Escalates disputes and sends evidence (5g); undefined until the seller app is set. */
  disputeWriter?: DisputeWriter | undefined;
  /** Chat events between server copies (7c). */
  chatBus: ChatBus;
  /** This server copy's id, for chat presence. */
  serverId: string;
}

const newDealBody = newDealSchema.pick({ title: true, category: true, currency: true });
const addBuyerBody = addBuyerSchema.pick({ email: true, name: true });

const BUYER_REFUSALS: Record<BuyerNotAllowedError["reason"], { status: number; error: string }> = {
  "not-your-deal": { status: 404, error: "not found" },
  "already-has-buyer": { status: 409, error: "this deal already has a buyer" },
  "own-email": { status: 400, error: "you cannot be the buyer of your own deal" },
};

/**
 * A deal as the pages see it, with the asking person's role and the other side: the seller sees
 * the buyer's name and email (they entered it); the buyer sees only the seller's name.
 */
const dealView = (
  deal: Deal,
  viewer: Viewer,
  { seller, buyer }: Awaited<ReturnType<typeof partiesOf>>,
) => ({
  id: deal.id,
  title: deal.title,
  kind: deal.kind,
  category: deal.category,
  categoryLabel: categoryLabelOf(deal),
  currency: deal.currency,
  status: deal.status,
  createdAt: deal.createdAt.toISOString(),
  hasBuyer: deal.buyerId !== undefined,
  role: roleIn(viewer, deal),
  ...(roleIn(viewer, deal) === "seller"
    ? { buyer: buyer ? { name: buyer.displayName ?? null, email: buyer.email } : null }
    : { seller: { name: nameOf(seller, "Seller") } }),
});

/** A deal answer, loading its parties. */
const describe = async (db: Database, deal: Deal, viewer: Viewer) =>
  dealView(deal, viewer, await partiesOf(db, deal));

/**
 * Deal routes: create and list deals, open one, and read and check its evidence log. A person
 * sees only deals they sell or buy in; a buyer-link visitor only the link's deal. Any other deal
 * answers 404, so its existence is not revealed.
 */
export const dealRoutes: FastifyPluginAsync<DealOptions> = (app, options) => {
  const {
    database,
    clock,
    newId,
    publicBaseUrl,
    email,
    drafting,
    recordIp = false,
    invoices,
    linked,
    disputes,
    claims,
    disputeWriter,
  } = options;
  app.get("/api/deal-options", (_request, reply) =>
    reply.send({
      categories: [...categoryLabels].map(([id, label]) => ({ id, label })),
      currencies: DEAL_CURRENCIES,
    }),
  );

  const { visibleDeal, sellersDeal, buyersDeal } = dealAccess(database, clock);
  // The chat (7b–7e): a live hub per server copy, notifications and PactPal's cards in the chat.
  const { chatBus } = options;
  const hub =
    database &&
    new LiveHub({ db: database, bus: chatBus, serverId: options.serverId, clock, log: app.log });
  const notifier =
    database &&
    new Notifier({
      db: database,
      bus: chatBus,
      email,
      clock,
      newId,
      log: app.log,
      publicBaseUrl,
      isOnline: (dealId, role) => hub?.isOnline(dealId, role) ?? false,
    });
  const cards =
    database &&
    notifier &&
    new DealCards({ db: database, bus: chatBus, notifier, clock, newId, log: app.log });
  void app.register(scopeRoutes, { visibleDeal, sellersDeal, clock });
  void app.register(timelineRoutes, { visibleDeal, clock, newId, recordIp, cards });
  void app.register(acceptanceRoutes, {
    visibleDeal,
    sellersDeal,
    buyersDeal,
    clock,
    recordIp,
    email,
    cards,
  });
  void app.register(milestoneRoutes, {
    visibleDeal,
    sellersDeal,
    clock,
    invoices,
    linked,
    email,
  });
  void app.register(disputeRoutes, { sellersDeal, clock, disputes });
  void app.register(claimRoutes, { sellersDeal, clock, newId, claims });
  void app.register(packetRoutes, { sellersDeal, clock, newId });
  void app.register(actionRoutes, {
    sellersDeal,
    clock,
    newId,
    writerFor: disputeWriters(disputeWriter, linked),
    disputes,
  });
  void app.register(deliveryRoutes, {
    database,
    visibleDeal,
    sellersDeal,
    buyersDeal,
    clock,
    newId,
    publicBaseUrl,
    email,
    recordIp,
  });
  void app.register(fileRoutes, { database, visibleDeal, clock, newId, recordIp, email });
  void app.register(draftRoutes, { database, drafting, sellersDeal, clock, newId });
  void app.register(completenessRoutes, { sellersDeal });
  // One record of recent model outcomes for every feature that chooses a model.
  const models = modelMemory(clock);
  void app.register(questionRoutes, {
    visibleDeal,
    sellersDeal,
    buyersDeal,
    clock,
    newId,
    recordIp,
    drafting,
    email,
    publicBaseUrl,
    models,
  });
  void app.register(deliveryCheckRoutes, { sellersDeal, clock, newId, drafting, models });
  void app.register(intakeRoutes, {
    database,
    clock,
    newId,
    publicBaseUrl,
    inboundDomain: options.inboundDomain,
  });
  // The MCP server for agents (8a-8c) and the seller's answers to what an agent asks.
  void app.register(mcpRoutes, { database, clock, newId, notifier });
  void app.register(agentRequestRoutes, { database, clock });
  void app.register(screenshotRoutes, { sellersDeal, clock, drafting, models });
  void app.register(messageRoutes, { sellersDeal, clock, newId, drafting });
  void app.register(chatRoutes, {
    visibleDeal,
    clock,
    newId,
    recordIp,
    onPosted: async (deal, message, names) => {
      await chatBus.publish({ type: "messages", dealId: deal.id });
      if (message.role === "system") return;
      const sender = names[message.role];
      await notifier?.notify(deal, message.role === "seller" ? "buyer" : "seller", {
        kind: "message",
        tab: "chat",
        text: `${sender}: ${message.body}`,
        email: {
          subject: `New message: "${deal.title}"`,
          lines: [
            `${sender} sent you a message in "${deal.title}".`,
            "Open the chat to read and answer it.",
          ],
        },
      });
    },
  });
  void app.register(notificationRoutes, { database, clock, bus: chatBus });
  if (hub) {
    app.addHook("onClose", (_instance, done) => {
      hub.close();
      done();
    });
    void app.register(liveRoutes, { visibleDeal, hub, clock, publicBaseUrl });
  }
  void app.register(changeOrderRoutes, {
    visibleDeal,
    sellersDeal,
    buyersDeal,
    clock,
    newId,
    recordIp,
    email,
    publicBaseUrl,
  });

  app.post("/api/deals", async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "unavailable" });
    const viewer = await requireViewer(request, reply, database, clock());
    if (!viewer) return reply;
    if (viewer.access.method !== "paypal") {
      return reply.code(403).send({ error: "sign in with PayPal to create deals" });
    }
    const body = await readBody(newDealBody, request, reply);
    if (!body) return reply;
    const { deal } = await createDeal(
      database,
      { ...body, id: newId(), sellerId: viewer.user.id },
      clock(),
    );
    request.log.info({ dealId: deal.id }, "Deal created");
    return reply.code(201).send(await describe(database, deal, viewer));
  });

  app.get("/api/deals", async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "unavailable" });
    const viewer = await requireViewer(request, reply, database, clock());
    if (!viewer) return reply;
    const deals =
      viewer.access.method === "link"
        ? [await getDeal(database, viewer.access.dealId)].filter((d): d is Deal => d !== undefined)
        : await listDealsForUser(database, viewer.user.id);
    const visible = deals.filter((deal) => canSeeDeal(viewer, deal));
    return reply.send({
      deals: await Promise.all(visible.map((deal) => describe(database, deal, viewer))),
    });
  });

  app.get("/api/deals/:id", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    return found ? reply.send(await describe(found.db, found.deal, found.viewer)) : reply;
  });

  app.post("/api/deals/:id/buyer", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const body = await readBody(addBuyerBody, request, reply);
    if (!body) return reply;
    try {
      const { deal } = await addBuyer(
        found.db,
        { ...body, dealId: found.deal.id, sellerId: found.viewer.user.id },
        clock(),
        newId,
      );
      request.log.info({ dealId: deal.id }, "Buyer added");
      return await reply.send(await describe(found.db, deal, found.viewer));
    } catch (error) {
      if (!(error instanceof BuyerNotAllowedError)) throw error;
      const { status, error: message } = BUYER_REFUSALS[error.reason];
      return reply.code(status).send({ error: message });
    }
  });

  app.post("/api/deals/:id/buyer-link", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const { deal, db, viewer } = found;
    if (publicBaseUrl === undefined) return reply.code(503).send({ error: "unavailable" });
    const buyer = deal.buyerId === undefined ? undefined : await getUser(db, deal.buyerId);
    if (!buyer) return reply.code(409).send({ error: "add the buyer first" });

    const { token, expiresAt } = await createDealLink(
      db,
      { dealId: deal.id, userId: buyer.id },
      clock(),
    );
    const sent = await email.send({
      ...dealLinkEmail({
        publicBaseUrl,
        to: buyer.email,
        token,
        dealTitle: deal.title,
        sellerName: nameOf(viewer.user, "Seller"),
        expiresAt,
      }),
      // A repeat of the same link is one email; the key holds only the link's fingerprint.
      idempotencyKey: `deal-link:${sha256Hex(token)}`,
    });
    if (sent.ok)
      request.log.info({ dealId: deal.id, providerMessageId: sent.id }, "Buyer link emailed");
    else if (email.live) {
      request.log.warn(
        { dealId: deal.id, reason: sent.reason, detail: sent.detail },
        "Buyer link email not sent",
      );
    }
    request.log.info({ dealId: deal.id }, "Buyer link made");
    return reply.send({
      url: dealLinkUrl(publicBaseUrl, token),
      expiresAt: expiresAt.toISOString(),
      emailed: sent.ok,
    });
  });

  app.get("/api/deals/:id/ledger", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    if (!found) return reply;
    const { deal, db } = found;
    const { seller, buyer } = await partiesOf(db, deal);
    const people = new Map<string, string>([[deal.sellerId, nameOf(seller, "Seller")]]);
    if (deal.buyerId !== undefined) people.set(deal.buyerId, nameOf(buyer, "Buyer"));
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
