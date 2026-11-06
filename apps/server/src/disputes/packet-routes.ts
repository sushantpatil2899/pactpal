import {
  PacketNotAllowedError,
  getPacket,
  listPackets,
  postgresContentStore,
  type EvidencePacket,
} from "@pactpal/db";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { readBody, sendRefusal, type DealLookup } from "../deals/access.js";
import { sendDownload } from "../deals/download.js";
import { sellersDispute } from "./dispute-lookup.js";
import {
  PacketBuildError,
  buildPacket,
  packetChoices,
  packetExhibitFile,
  storedPacketPdf,
} from "./packet-service.js";
import { packetFilename } from "./packet.js";

export interface PacketRouteOptions {
  sellersDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
}

const buildBody = z.object({
  leaveOut: z.array(z.string().min(1).max(100)).max(100).default([]),
  /** The checked AI comparison and summary to put in the packet (5f). */
  includeAi: z.object({ analysisId: z.uuid(), summaryId: z.uuid() }).optional(),
});
const packetParams = z.object({ packetId: z.uuid() });
const exhibitParams = packetParams.extend({ n: z.coerce.number().int().min(1).max(100) });

const REFUSALS = {
  "not-your-deal": { status: 403, error: "only the seller can do this" },
  "not-this-deal": { status: 404, error: "not found" },
  "too-many": { status: 429, error: "this dispute already has the most packets allowed" },
  "chain-broken": { status: 409, error: "the deal's log failed its check, so no packet was built" },
  "ai-not-ready": {
    status: 409,
    error: "the AI comparison and summary must both be ready before they go in the packet",
  },
  "receipt-broken": {
    status: 409,
    error: "the signed copy failed its check, so no packet was built",
  },
  "over-limit": { status: 413, error: "the files are over PayPal's total size; untick some" },
} as const;

/** A built packet for the page: fingerprints, sizes and what went in, never file contents. */
const packetView = (packet: EvidencePacket) => ({
  id: packet.id,
  createdAt: packet.createdAt.toISOString(),
  packetSha256: packet.packetSha256,
  packetBytes: packet.packetBytes,
  totalBytes: packet.totalBytes,
  chainHead: packet.chainHead,
  exhibits: packet.exhibits,
  analysisId: packet.analysisId ?? null,
  summaryId: packet.summaryId ?? null,
});

/**
 * The evidence packet for one dispute (5e), for the seller only: the documents to choose from with
 * PayPal's size limits, building a packet (stored, logged `PACKET_BUILT`), and downloading it and
 * each exhibit as PayPal would get it. Nothing is sent to PayPal here.
 */
export const packetRoutes: FastifyPluginAsync<PacketRouteOptions> = (app, options) => {
  const { sellersDeal, clock, newId } = options;
  const base = "/api/deals/:id/disputes/:disputeId/packet";

  app.get(base, async (request, reply) => {
    const both = await sellersDispute(sellersDeal, request, reply);
    if (!both) return reply;
    const { db, deal } = both.found;
    const store = postgresContentStore(db, clock);
    try {
      const [choices, packets] = await Promise.all([
        packetChoices(db, store, deal),
        listPackets(db, both.dispute.disputeId),
      ]);
      return await reply.send({ ...choices, packets: packets.map(packetView) });
    } catch (error) {
      if (error instanceof PacketBuildError) return sendRefusal(reply, REFUSALS[error.reason]);
      throw error;
    }
  });

  app.post(base, async (request, reply) => {
    const both = await sellersDispute(sellersDeal, request, reply);
    if (!both) return reply;
    const body = await readBody(buildBody, request, reply);
    if (!body) return reply;
    const { db, deal, viewer } = both.found;
    try {
      const { packet } = await buildPacket(
        { db, store: postgresContentStore(db, clock), clock, newId },
        {
          deal,
          dispute: both.dispute,
          sellerId: viewer.user.id,
          leaveOut: new Set(body.leaveOut),
          ...(body.includeAi === undefined ? {} : { includeAi: body.includeAi }),
        },
      );
      request.log.info({ dealId: deal.id, packetId: packet.id }, "Evidence packet built");
      return await reply.code(201).send(packetView(packet));
    } catch (error) {
      if (error instanceof PacketNotAllowedError || error instanceof PacketBuildError) {
        return sendRefusal(reply, REFUSALS[error.reason]);
      }
      throw error;
    }
  });

  app.get(`${base}/:packetId/file`, async (request, reply) => {
    const both = await sellersDispute(sellersDeal, request, reply);
    if (!both) return reply;
    const { db } = both.found;
    const params = packetParams.safeParse(request.params);
    const packet = params.success ? await getPacket(db, params.data.packetId) : undefined;
    if (packet?.disputeId !== both.dispute.disputeId) {
      return reply.code(404).send({ error: "not found" });
    }
    const bytes = await storedPacketPdf(postgresContentStore(db, clock), packet);
    if (bytes === undefined) {
      request.log.error({ packetId: packet.id }, "Stored packet failed its fingerprint check");
      return reply.code(409).send({ error: "the stored packet failed its fingerprint check" });
    }
    return sendDownload(reply, {
      mediaType: "application/pdf",
      filename: packetFilename(packet.disputeId),
      bytes,
    });
  });

  app.get(`${base}/:packetId/exhibits/:n`, async (request, reply) => {
    const both = await sellersDispute(sellersDeal, request, reply);
    if (!both) return reply;
    const { db, deal } = both.found;
    const params = exhibitParams.safeParse(request.params);
    if (!params.success) return reply.code(404).send({ error: "not found" });
    const packet = await getPacket(db, params.data.packetId);
    const recorded =
      packet?.disputeId === both.dispute.disputeId
        ? packet.exhibits.find((e) => e.number === params.data.n)
        : undefined;
    if (!recorded) return reply.code(404).send({ error: "not found" });
    const file = await packetExhibitFile(db, postgresContentStore(db, clock), deal, recorded);
    if (!file) {
      request.log.error({ dealId: deal.id, exhibit: recorded.id }, "Exhibit no longer matches");
      return reply.code(409).send({ error: "this exhibit no longer matches its fingerprint" });
    }
    return sendDownload(reply, {
      mediaType: file.mediaType,
      filename: file.filename,
      bytes: file.bytes,
    });
  });

  return Promise.resolve();
};
