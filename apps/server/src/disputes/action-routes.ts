import {
  DisputeActionNotAllowedError,
  MAX_DISPUTE_NOTE_CHARS,
  getDisputeAction,
  getPacket,
  postgresContentStore,
  resendDisputeAction,
  startDisputeAction,
  type DisputeActionRecord,
  type StoredDispute,
} from "@pactpal/db";
import { sha256Hex } from "@pactpal/ledger";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { readBody, sendRefusal, type DealLookup, type FoundDeal } from "../deals/access.js";
import {
  actionChoices,
  actionView,
  deliverAction,
  evidenceTypesFor,
  type DisputeWriter,
} from "./action-service.js";
import type { DisputeChecker } from "./checker.js";
import { sellersDispute } from "./dispute-lookup.js";
import { requestedEvidenceOf } from "./dispute-view.js";
import { PACKET_LIMITS } from "./packet.js";
import { packetUploadFiles } from "./packet-service.js";

export interface ActionRouteOptions {
  sellersDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
  /** Sends to PayPal; absent until the seller app's keys are set. */
  writer: DisputeWriter | undefined;
  /** Checks the dispute again after a send, so the page shows PayPal's new state. */
  disputes: DisputeChecker | undefined;
}

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);
/** The note the seller read and confirmed, with the fingerprint the page took of it. */
const confirmedNote = {
  note: z.string().min(1).max(MAX_DISPUTE_NOTE_CHARS),
  noteSha256: sha256,
  confirmed: z.literal(true),
};
const escalateBody = z.object(confirmedNote);
const evidenceBody = z.object({
  ...confirmedNote,
  packetId: z.uuid(),
  packetSha256: sha256,
  evidenceType: z.string().regex(/^[A-Z0-9_]{1,255}$/),
});
const resendBody = z.object({ confirmed: z.literal(true) });
const actionParams = z.object({ actionId: z.uuid() });

const REFUSALS = {
  "not-your-deal": { status: 403, error: "only the seller can do this" },
  "not-this-deal": { status: 404, error: "not found" },
  "not-this-packet": { status: 404, error: "that packet is not this dispute's" },
  "too-many": { status: 429, error: "this dispute already has the most evidence uploads allowed" },
  "already-sending": { status: 409, error: "something is being sent for this dispute; wait" },
  "not-unknown": { status: 409, error: "only a send whose outcome is unknown can be sent again" },
  "note-changed": { status: 409, error: "the note changed after you confirmed it; check it again" },
  "not-allowed": {
    status: 409,
    error: "PayPal does not allow this for the dispute now; check the dispute again",
  },
  "type-not-asked": { status: 409, error: "PayPal does not ask for that evidence type" },
  "packet-changed": { status: 409, error: "that packet is not the one you checked; review again" },
  "files-changed": {
    status: 409,
    error: "a file no longer matches its fingerprint, so nothing was sent; build a new packet",
  },
  "over-limit": { status: 413, error: "the files are over PayPal's size limits" },
} as const;
type Refusal = keyof typeof REFUSALS;

class Refused extends Error {
  constructor(readonly reason: Refusal) {
    super(reason);
  }
}

const STATUS_CODES = { sent: 201, refused: 409, unknown: 502, sending: 502 } as const;

/**
 * Escalating a dispute and sending evidence to PayPal (5g), for the seller only, and only what
 * the seller confirmed on the review screen: the note's fingerprint must match, the packet must be
 * the one shown, every file must still match its recorded fingerprint and the evidence type must
 * be one PayPal asks for. Each send is reserved first with a fixed PayPal-Request-Id; an unknown
 * outcome is never sent again without the seller's new confirmation.
 */
export const actionRoutes: FastifyPluginAsync<ActionRouteOptions> = (app, options) => {
  const { sellersDeal, clock, newId, writer, disputes } = options;
  const dispute = "/api/deals/:id/disputes/:disputeId";

  /** Sends a reserved action, checks the dispute again when it went, and answers the page. */
  async function send(
    request: FastifyRequest,
    reply: FastifyReply,
    found: FoundDeal,
    reserve: () => Promise<{
      action: DisputeActionRecord;
      files: readonly { name: string; content: Uint8Array }[];
    }>,
  ) {
    if (!writer) return reply.code(503).send({ error: "sending to PayPal is not set up" });
    let reserved;
    try {
      reserved = await reserve();
    } catch (error) {
      if (error instanceof Refused) return sendRefusal(reply, REFUSALS[error.reason]);
      if (error instanceof DisputeActionNotAllowedError) {
        return sendRefusal(reply, REFUSALS[error.reason]);
      }
      throw error;
    }
    const action = await deliverAction(
      { db: found.db, writer, clock },
      reserved.action,
      reserved.files,
    );
    request.log.info(
      { dealId: found.deal.id, actionId: action.id, kind: action.kind, status: action.status },
      "Dispute action settled",
    );
    if (action.status === "sent" && disputes) {
      await disputes.start({ kind: "button", dealId: found.deal.id }).catch((error: unknown) => {
        request.log.warn(
          { dealId: found.deal.id, err: error instanceof Error ? error.name : "unknown" },
          "Dispute check after a send not started",
        );
      });
    }
    return reply
      .code(STATUS_CODES[action.status])
      .send(
        action.status === "sent"
          ? { action: actionView(action) }
          : { error: action.failure ?? "not sent", action: actionView(action) },
      );
  }

  /** The note must be the one whose fingerprint the page took when the seller ticked the box. */
  const checkNote = (body: { note: string; noteSha256: string }) => {
    if (sha256Hex(body.note) !== body.noteSha256) throw new Refused("note-changed");
  };
  const allows = (stored: StoredDispute, action: string) => {
    if (!stored.allowedActions.includes(action)) throw new Refused("not-allowed");
  };

  /** The files of a packet for upload, each checked again; refuses a packet that changed. */
  async function filesOf(found: FoundDeal, stored: StoredDispute, packetId: string, sha?: string) {
    const packet = await getPacket(found.db, packetId);
    if (packet?.disputeId !== stored.disputeId) throw new Refused("packet-changed");
    if (sha !== undefined && packet.packetSha256 !== sha) throw new Refused("packet-changed");
    const files = await packetUploadFiles(
      found.db,
      postgresContentStore(found.db, clock),
      found.deal,
      packet,
    );
    if (!files) throw new Refused("files-changed");
    const total = files.reduce((sum, file) => sum + file.bytes, 0);
    if (
      total > PACKET_LIMITS.maxTotalBytes ||
      files.some((file) => file.bytes > PACKET_LIMITS.maxFileBytes)
    ) {
      throw new Refused("over-limit");
    }
    return files;
  }

  app.get(`${dispute}/actions`, async (request, reply) => {
    const both = await sellersDispute(sellersDeal, request, reply);
    if (!both) return reply;
    const choices = await actionChoices(
      both.found.db,
      both.found.deal.id,
      both.dispute,
      requestedEvidenceOf(both.dispute.details),
    );
    return reply.send({ canSend: writer !== undefined, ...choices });
  });

  app.post(`${dispute}/escalate`, async (request, reply) => {
    const both = await sellersDispute(sellersDeal, request, reply);
    if (!both) return reply;
    const body = await readBody(escalateBody, request, reply);
    if (!body) return reply;
    const { found, dispute: stored } = both;
    return send(request, reply, found, async () => {
      checkNote(body);
      allows(stored, "escalate");
      const action = await startDisputeAction(
        found.db,
        {
          id: newId(),
          kind: "escalate",
          dealId: found.deal.id,
          disputeId: stored.disputeId,
          sellerId: found.viewer.user.id,
          note: body.note,
          noteSha256: body.noteSha256,
        },
        clock(),
      );
      return { action, files: [] };
    });
  });

  app.post(`${dispute}/evidence`, async (request, reply) => {
    const both = await sellersDispute(sellersDeal, request, reply);
    if (!both) return reply;
    const body = await readBody(evidenceBody, request, reply);
    if (!body) return reply;
    const { found, dispute: stored } = both;
    return send(request, reply, found, async () => {
      checkNote(body);
      allows(stored, "provide_evidence");
      if (!evidenceTypesFor(requestedEvidenceOf(stored.details)).includes(body.evidenceType)) {
        throw new Refused("type-not-asked");
      }
      const files = await filesOf(found, stored, body.packetId, body.packetSha256);
      const action = await startDisputeAction(
        found.db,
        {
          id: newId(),
          kind: "evidence",
          dealId: found.deal.id,
          disputeId: stored.disputeId,
          sellerId: found.viewer.user.id,
          note: body.note,
          noteSha256: body.noteSha256,
          packetId: body.packetId,
          evidenceType: body.evidenceType,
          files: files.map(({ exhibit, name, mediaType, bytes, sha256: fileSha }) => ({
            exhibit,
            name,
            mediaType,
            bytes,
            sha256: fileSha,
          })),
        },
        clock(),
      );
      return { action, files };
    });
  });

  // An unknown outcome sent again: the same request id and content, after a new confirmation.
  app.post(`${dispute}/actions/:actionId/resend`, async (request, reply) => {
    const both = await sellersDispute(sellersDeal, request, reply);
    if (!both) return reply;
    const params = actionParams.safeParse(request.params);
    const existing = params.success
      ? await getDisputeAction(both.found.db, params.data.actionId)
      : undefined;
    if (existing?.disputeId !== both.dispute.disputeId) {
      return reply.code(404).send({ error: "not found" });
    }
    if (!(await readBody(resendBody, request, reply))) return reply;
    const { found, dispute: stored } = both;
    return send(request, reply, found, async () => {
      const files =
        existing.packetId === undefined ? [] : await filesOf(found, stored, existing.packetId);
      // The files must still be exactly the ones confirmed the first time.
      const same =
        files.length === existing.files.length &&
        files.every((file, i) => file.sha256 === existing.files[i]?.sha256);
      if (!same) throw new Refused("files-changed");
      const action = await resendDisputeAction(found.db, {
        actionId: existing.id,
        sellerId: found.viewer.user.id,
      });
      return { action, files };
    });
  });

  return Promise.resolve();
};
