import {
  DisputeActionNotAllowedError,
  MAX_DISPUTE_NOTE_CHARS,
  getDisputeAction,
  getPacket,
  postgresContentStore,
  resendDisputeAction,
  startDisputeAction,
  type ActionFile,
  type DisputeActionRecord,
  type NewDisputeAction,
  type StoredDispute,
} from "@pactpal/db";
import { sha256Hex } from "@pactpal/ledger";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { readBody, sendRefusal, type DealLookup, type FoundDeal } from "../deals/access.js";
import { actionChoices, actionView, deliverAction, evidenceTypesFor } from "./action-service.js";
import type { DisputeChecker } from "./checker.js";
import { sellersDispute } from "./dispute-lookup.js";
import { requestedEvidenceOf } from "./dispute-view.js";
import { appealGaps } from "./appeal-coverage.js";
import type { DisputeWriterLookup } from "../sellers/linked-apps.js";
import { PACKET_LIMITS } from "./packet.js";
import { packetUploadFiles } from "./packet-service.js";

export interface ActionRouteOptions {
  sellersDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
  /** Who sends a dispute's answers to PayPal: the account its stage was invoiced from (6h-5). */
  writerFor: DisputeWriterLookup;
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
/** The only offer type PactPal makes (owner's choice, 5h): a refund, with no return. */
const OFFER_TYPE = "REFUND";
const offerBody = z.object({
  ...confirmedNote,
  amount: z.object({
    minor: z.number().int().min(1),
    currency: z.string().regex(/^[A-Z]{3}$/),
  }),
});
const acceptBody = z.object({ ...confirmedNote, understandsRefund: z.literal(true) });
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
  "no-check": {
    status: 409,
    error: "run the appeal check first; it must find something that speaks to the claim",
  },
  "appeal-coverage": {
    status: 409,
    error: "the packet leaves out what the appeal relies on; build a new packet first",
  },
  "no-amount": { status: 409, error: "PayPal gave no disputed amount, so PactPal cannot do this" },
  "offer-type": { status: 409, error: "PayPal does not take a refund offer for this dispute now" },
  "offer-amount": {
    status: 409,
    error: "the offer must be in the dispute's currency and at most the disputed amount",
  },
} as const;
type Refusal = keyof typeof REFUSALS;

class Refused extends Error {
  constructor(
    readonly reason: Refusal,
    /** What exactly is missing, added to the reason for the seller. */
    readonly detail?: string,
  ) {
    super(reason);
  }
}

/** The refusal for the page, with its detail when there is one. */
const refusalOf = (error: Refused) => {
  const refusal = REFUSALS[error.reason];
  return error.detail === undefined
    ? refusal
    : { ...refusal, error: `${refusal.error}: ${error.detail}` };
};

const STATUS_CODES = { sent: 201, refused: 409, unknown: 502, sending: 502 } as const;

/**
 * Escalating a dispute and sending evidence to PayPal (5g), for the seller only, and only what
 * the seller confirmed on the review screen: the note's fingerprint must match, the packet must be
 * the one shown, every file must still match its recorded fingerprint and the evidence type must
 * be one PayPal asks for. Each send is reserved first with a fixed PayPal-Request-Id; an unknown
 * outcome is never sent again without the seller's new confirmation.
 */
export const actionRoutes: FastifyPluginAsync<ActionRouteOptions> = (app, options) => {
  const { sellersDeal, clock, newId, writerFor, disputes } = options;
  const dispute = "/api/deals/:id/disputes/:disputeId";

  /** Sends a reserved action, checks the dispute again when it went, and answers the page. */
  async function send(
    request: FastifyRequest,
    reply: FastifyReply,
    found: FoundDeal,
    stored: StoredDispute,
    reserve: () => Promise<{
      action: DisputeActionRecord;
      files: readonly { name: string; content: Uint8Array }[];
    }>,
  ) {
    const writer = await writerFor(found.db, stored);
    if (!writer) return reply.code(503).send({ error: "sending to PayPal is not set up" });
    let reserved;
    try {
      reserved = await reserve();
    } catch (error) {
      if (error instanceof Refused) return sendRefusal(reply, refusalOf(error));
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
      postgresContentStore(both.found.db, clock),
      both.found.deal,
      both.dispute,
      requestedEvidenceOf(both.dispute.details),
    );
    const writer = await writerFor(both.found.db, both.dispute);
    return reply.send({ canSend: writer !== undefined, ...choices });
  });

  /** A confirmed send's own fields, before ids, and the files it uploads (none for a note). */
  interface Prepared {
    fields: Omit<NewDisputeAction, "id" | "dealId" | "disputeId" | "sellerId">;
    files: readonly (ActionFile & { content: Uint8Array })[];
  }

  /**
   * A send the seller confirmed: reads the body, checks the note's fingerprint and that PayPal
   * allows the action, runs the kind's own checks (`prepare`), then reserves and sends it.
   */
  function confirmedSend<T extends { note: string; noteSha256: string }>(
    path: string,
    schema: z.ZodType<T>,
    paypalAction: string,
    prepare: (body: T, stored: StoredDispute, found: FoundDeal) => Promise<Prepared> | Prepared,
  ) {
    app.post(`${dispute}/${path}`, async (request, reply) => {
      const both = await sellersDispute(sellersDeal, request, reply);
      if (!both) return reply;
      const body = await readBody(schema, request, reply);
      if (!body) return reply;
      const { found, dispute: stored } = both;
      return send(request, reply, found, stored, async () => {
        checkNote(body);
        allows(stored, paypalAction);
        const { fields, files } = await prepare(body, stored, found);
        const action = await startDisputeAction(
          found.db,
          {
            ...fields,
            id: newId(),
            dealId: found.deal.id,
            disputeId: stored.disputeId,
            sellerId: found.viewer.user.id,
          } as NewDisputeAction,
          clock(),
        );
        return { action, files };
      });
    });
  }

  /** A send with a note and no files (escalate, message, offer, accept). */
  function noteSend<T extends { note: string; noteSha256: string }>(
    path: string,
    schema: z.ZodType<T>,
    paypalAction: string,
    reserve: (body: T, stored: StoredDispute) => Prepared["fields"],
  ) {
    confirmedSend(path, schema, paypalAction, (body, stored) => ({
      fields: reserve(body, stored),
      files: [],
    }));
  }

  /** The disputed amount, for an offer's limit and an accepted claim's full refund. */
  const disputedOf = (stored: StoredDispute) => {
    if (stored.amountMinor === null || stored.currency === null) throw new Refused("no-amount");
    return { minor: stored.amountMinor, currency: stored.currency };
  };

  noteSend("escalate", escalateBody, "escalate", (body) => ({
    kind: "escalate",
    note: body.note,
    noteSha256: body.noteSha256,
  }));
  noteSend("message", escalateBody, "send_message", (body) => ({
    kind: "message",
    note: body.note,
    noteSha256: body.noteSha256,
  }));
  // A refund offer of the seller's amount: above 0, at most the disputed amount, its currency.
  noteSend("offer", offerBody, "make_offer", (body, stored) => {
    if (!stored.offerTypes.includes(OFFER_TYPE)) throw new Refused("offer-type");
    const disputed = disputedOf(stored);
    if (body.amount.currency !== disputed.currency || body.amount.minor > disputed.minor) {
      throw new Refused("offer-amount");
    }
    return {
      kind: "offer",
      note: body.note,
      noteSha256: body.noteSha256,
      offerType: OFFER_TYPE,
      amount: body.amount,
    };
  });
  // Accepting refunds the whole disputed amount; the second tick says the seller knows it.
  noteSend("accept", acceptBody, "accept_claim", (body, stored) => ({
    kind: "accept",
    note: body.note,
    noteSha256: body.noteSha256,
    amount: disputedOf(stored),
  }));

  /**
   * An upload of the newest packet with a type and a note: evidence (5g) or an appeal (5i-2). An
   * appeal must also carry every item the appeal check found speaking to the claim.
   */
  function uploadSend(path: string, kind: "evidence" | "appeal", paypalAction: string) {
    confirmedSend(path, evidenceBody, paypalAction, async (body, stored, found) => {
      if (!evidenceTypesFor(requestedEvidenceOf(stored.details)).includes(body.evidenceType)) {
        throw new Refused("type-not-asked");
      }
      const files = await filesOf(found, stored, body.packetId, body.packetSha256);
      if (kind === "appeal") await checkCoverage(found, stored, body.packetId);
      return {
        fields: {
          kind,
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
        files,
      };
    });
  }

  /** Refuses an appeal whose packet leaves out an item the appeal check relies on. */
  async function checkCoverage(found: FoundDeal, stored: StoredDispute, packetId: string) {
    const packet = await getPacket(found.db, packetId);
    if (!packet) throw new Refused("packet-changed");
    const gaps = await appealGaps(
      found.db,
      postgresContentStore(found.db, clock),
      found.deal,
      stored.disputeId,
      packet,
    );
    if (!gaps) throw new Refused("no-check");
    if (gaps.missing.length > 0) throw new Refused("appeal-coverage", gaps.missing.join(", "));
  }

  uploadSend("evidence", "evidence", "provide_evidence");
  uploadSend("appeal/send", "appeal", "appeal");

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
    return send(request, reply, found, stored, async () => {
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
