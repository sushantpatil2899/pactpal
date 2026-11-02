import {
  DeliveryNotAllowedError,
  MAX_DELIVERY_FILES,
  createDealLink,
  getUser,
  listDeliveries,
  postgresContentStore,
  readLedger,
  recordDeliveryDownloaded,
  recordDeliveryEmailed,
  recordDeliveryViewed,
  sendDelivery,
  type Database,
  type Deal,
  type Delivery,
} from "@pactpal/db";
import type { EmailSender } from "@pactpal/email";
import { sha256Hex, type LedgerEntry } from "@pactpal/ledger";
import type { FastifyBaseLogger, FastifyPluginAsync, FastifyReply } from "fastify";
import { z } from "zod";
import { deliveryEmail } from "../email/delivery-email.js";
import { dealLinkUrl } from "../email/deal-link-email.js";
import { invoiceFor, stageFacts } from "../payments/invoice-text.js";
import { signedRecord } from "../payments/signed-record.js";
import { requestOrigin } from "../request-origin.js";
import { readBody, type DealLookup, type FoundDeal } from "./access.js";
import { sendCheckedFile } from "./download.js";
import { nameOf } from "./parties.js";
import { roleIn } from "./visibility.js";

export interface DeliveryRouteOptions {
  database: Database | undefined;
  visibleDeal: DealLookup;
  sellersDeal: DealLookup;
  buyersDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
  /** The site's own address, for the private link in the email; undefined until set. */
  publicBaseUrl: string | undefined;
  email: EmailSender;
  /** Whether visitors' IP addresses are known (the number of proxies is set). */
  recordIp: boolean;
}

/** A delivery's email is sent at most this many times (the first and the resends). */
export const MAX_DELIVERY_EMAILS = 3;

const sendBody = z.object({
  stage: z.number().int().min(1).max(20),
  message: z.string().max(1000).optional(),
  fileIds: z.array(z.uuid()).min(1).max(MAX_DELIVERY_FILES),
});
const deliveryParams = z.object({ deliveryId: z.uuid() });
const fileParams = deliveryParams.extend({ fileId: z.uuid() });

const REFUSALS: Record<DeliveryNotAllowedError["reason"], { status: number; error: string }> = {
  "not-your-deal": { status: 403, error: "only the seller can do this" },
  "not-signed": { status: 409, error: "the deal is not signed yet" },
  "no-stage": { status: 400, error: "the agreement has no such payment stage" },
  "bad-files": { status: 400, error: "those files are not this deal's delivered files" },
  "not-found": { status: 404, error: "not found" },
};

const deliveryId = z.object({ deliveryId: z.string() });
const download = deliveryId.extend({ artifactId: z.string() });

/** Who saw what, from the evidence log: emails, openings and downloads per delivery. */
export function accessSummary(entries: readonly LedgerEntry[], id: string) {
  const mine = entries.filter(
    (entry) => deliveryId.safeParse(entry.payload).data?.deliveryId === id,
  );
  const ofType = (type: LedgerEntry["type"]) => mine.filter((entry) => entry.type === type);
  const emails = ofType("DELIVERY_EMAILED");
  const opened = ofType("DELIVERY_VIEWED");
  const downloads: Record<string, { count: number; lastAt: string }> = {};
  for (const entry of ofType("DELIVERY_DOWNLOADED")) {
    const file = download.safeParse(entry.payload).data?.artifactId;
    if (file === undefined) continue;
    downloads[file] = { count: (downloads[file]?.count ?? 0) + 1, lastAt: entry.serverTime };
  }
  return {
    emailedAt: emails.at(-1)?.serverTime ?? null,
    emailCount: emails.length,
    opened: { count: opened.length, lastAt: opened.at(-1)?.serverTime ?? null },
    downloads,
  };
}

/**
 * Deliveries of a signed deal: the seller sends files for a stage (emailed to the buyer with a
 * private link), the buyer opens the delivery and downloads the files, and each step is logged.
 * Delivered files are only reachable here, so every buyer download is in the evidence log.
 */
export const deliveryRoutes: FastifyPluginAsync<DeliveryRouteOptions> = (app, options) => {
  const { database, visibleDeal, sellersDeal, buyersDeal, clock, newId, publicBaseUrl, email } =
    options;
  const store = database && postgresContentStore(database, clock);

  async function answer(reply: FastifyReply, { db, deal, viewer }: FoundDeal) {
    const record = await signedRecord(db, deal);
    if (!record)
      return reply.send({ signed: false, emailOn: email.live, stages: [], deliveries: [] });
    const [deliveries, entries] = await Promise.all([
      listDeliveries(db, deal.id),
      readLedger(db, deal.id),
    ]);
    const stages = record.scope.content.milestones.map((stage, n) => ({
      stage: n + 1,
      title: stage.title,
    }));
    return reply.send({
      signed: true,
      emailOn: email.live,
      // The seller picks a stage from these; the buyer sees them as names.
      stages: roleIn(viewer, deal) === "seller" ? stages : [],
      deliveries: deliveries.map((delivery) => ({
        id: delivery.id,
        stage: delivery.stage,
        stageTitle: stages[delivery.stage - 1]?.title ?? `Stage ${String(delivery.stage)}`,
        message: delivery.message ?? null,
        sentAt: delivery.createdAt.toISOString(),
        files: delivery.files.map((file) => ({
          id: file.artifactId,
          filename: file.filename,
          mediaType: file.mediaType,
          sizeBytes: file.sizeBytes,
          sha256: file.sha256,
        })),
        access: accessSummary(entries, delivery.id),
      })),
    });
  }

  /**
   * Emails the buyer a fresh private link to the deal for this delivery (a new link cancels the
   * older ones, as for every buyer link) and logs `DELIVERY_EMAILED` if the email service accepted
   * it. A failure is logged without the address and never undoes the delivery.
   */
  async function emailDelivery(
    db: Database,
    deal: Deal,
    delivery: Delivery,
    log: FastifyBaseLogger,
  ) {
    if (publicBaseUrl === undefined || deal.buyerId === undefined) return false;
    try {
      const record = await signedRecord(db, deal);
      const [buyer, seller] = await Promise.all([
        getUser(db, deal.buyerId),
        getUser(db, deal.sellerId),
      ]);
      const invoice = record && invoiceFor({ deal, ...record, stage: delivery.stage });
      if (!buyer || !invoice) return false;
      const link = await createDealLink(db, { dealId: deal.id, userId: buyer.id }, clock());
      const sent = await email.send(
        deliveryEmail({
          to: buyer.email,
          sellerName: nameOf(seller, "Seller"),
          facts: stageFacts(invoice),
          fileCount: delivery.files.length,
          message: delivery.message,
          link: dealLinkUrl(publicBaseUrl, link.token),
          linkExpiresAt: link.expiresAt,
          // One key per link: a retry of this email is one email, a resend is a new one.
          idempotencyKey: `delivery:${delivery.id}:${sha256Hex(link.token).slice(0, 16)}`,
        }),
      );
      if (!sent.ok) {
        if (email.live)
          log.warn({ dealId: deal.id, reason: sent.reason }, "Delivery email not sent");
        return false;
      }
      await recordDeliveryEmailed(
        db,
        {
          dealId: deal.id,
          deliveryId: delivery.id,
          email: buyer.email,
          providerMessageId: sent.id,
        },
        clock(),
      );
      log.info({ dealId: deal.id, deliveryId: delivery.id }, "Delivery emailed");
      return true;
    } catch (error) {
      log.error(
        { dealId: deal.id, err: error instanceof Error ? error.name : "unknown" },
        "Delivery email failed",
      );
      return false;
    }
  }

  /** Runs a step, turning a refusal from the database into its answer. */
  async function step(reply: FastifyReply, found: FoundDeal, work: () => Promise<unknown>) {
    try {
      await work();
    } catch (error) {
      if (!(error instanceof DeliveryNotAllowedError)) throw error;
      const { status, error: message } = REFUSALS[error.reason];
      return reply.code(status).send({ error: message });
    }
    return answer(reply, found);
  }

  app.get("/api/deals/:id/deliveries", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    return found ? answer(reply, found) : reply;
  });

  app.post("/api/deals/:id/deliveries", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const body = await readBody(sendBody, request, reply);
    if (!body) return reply;
    const { db, deal, viewer } = found;
    const record = await signedRecord(db, deal);
    if (!record) return reply.code(409).send({ error: "the deal is not signed yet" });
    return step(reply, found, async () => {
      const { delivery } = await sendDelivery(
        db,
        {
          id: newId(),
          dealId: deal.id,
          sellerId: viewer.user.id,
          version: record.scope.version,
          stage: body.stage,
          ...(body.message === undefined ? {} : { message: body.message }),
          artifactIds: body.fileIds,
        },
        clock(),
      );
      request.log.info({ dealId: deal.id, deliveryId: delivery.id }, "Delivery sent");
      await emailDelivery(db, deal, delivery, request.log);
    });
  });

  app.post("/api/deals/:id/deliveries/:deliveryId/email", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const params = deliveryParams.safeParse(request.params);
    const delivery = params.success
      ? (await listDeliveries(found.db, found.deal.id)).find((d) => d.id === params.data.deliveryId)
      : undefined;
    if (!delivery) return reply.code(404).send({ error: "not found" });
    if (!email.live) return reply.code(503).send({ error: "email is not set up" });
    const { emailCount } = accessSummary(await readLedger(found.db, found.deal.id), delivery.id);
    if (emailCount >= MAX_DELIVERY_EMAILS) {
      return reply
        .code(429)
        .send({ error: `this delivery was already emailed ${String(MAX_DELIVERY_EMAILS)} times` });
    }
    if (!(await emailDelivery(found.db, found.deal, delivery, request.log))) {
      return reply.code(502).send({ error: "the email was not sent; try again later" });
    }
    return answer(reply, found);
  });

  app.post("/api/deals/:id/deliveries/:deliveryId/open", async (request, reply) => {
    const found = await buyersDeal(request, reply);
    if (!found) return reply;
    const params = deliveryParams.safeParse(request.params);
    if (!params.success) return reply.code(404).send({ error: "not found" });
    return step(reply, found, () =>
      recordDeliveryViewed(
        found.db,
        {
          dealId: found.deal.id,
          deliveryId: params.data.deliveryId,
          buyerId: found.viewer.user.id,
          access: found.viewer.access.method,
          ...requestOrigin(request, options.recordIp),
        },
        clock(),
      ),
    );
  });

  app.get("/api/deals/:id/deliveries/:deliveryId/files/:fileId", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    if (!found || !store) return reply;
    const params = fileParams.safeParse(request.params);
    const delivery = params.success
      ? (await listDeliveries(found.db, found.deal.id)).find((d) => d.id === params.data.deliveryId)
      : undefined;
    const fileId = params.data?.fileId;
    if (!delivery || fileId === undefined || !delivery.files.some((f) => f.artifactId === fileId)) {
      return reply.code(404).send({ error: "not found" });
    }
    const isBuyer = roleIn(found.viewer, found.deal) === "buyer";
    return sendCheckedFile(
      reply,
      request.log,
      { db: found.db, store, dealId: found.deal.id, fileId, kind: "deliverable" },
      // The buyer's downloads are evidence; the seller's own are not logged.
      isBuyer
        ? () =>
            recordDeliveryDownloaded(
              found.db,
              {
                dealId: found.deal.id,
                deliveryId: delivery.id,
                artifactId: fileId,
                buyerId: found.viewer.user.id,
                ...requestOrigin(request, options.recordIp),
              },
              clock(),
            )
        : undefined,
    );
  });

  return Promise.resolve();
};
