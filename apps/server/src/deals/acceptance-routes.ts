import {
  AcceptanceNotAllowedError,
  acceptTerms,
  declineReasonSchema,
  declineTerms,
  getDeal,
  getLatestAcceptance,
  getLatestScope,
  getUser,
  readLedger,
  requestAcceptance,
  typedNameSchema,
  withdrawAcceptance,
  type Database,
  type Deal,
} from "@pactpal/db";
import type { FastifyPluginAsync, FastifyReply } from "fastify";
import { z } from "zod";
import {
  ACCEPTANCE_NOTICE_VERSION,
  acceptanceDocument,
  fingerprinted,
} from "../acceptance/document.js";
import { requestOrigin, type RequestOrigin } from "../request-origin.js";
import { readBody, type DealLookup, type FoundDeal } from "./access.js";
import { nameOf } from "./parties.js";
import { roleIn } from "./visibility.js";

export interface AcceptanceRouteOptions {
  visibleDeal: DealLookup;
  sellersDeal: DealLookup;
  buyersDeal: DealLookup;
  clock: () => Date;
  /** Whether visitors' IP addresses are known (the number of proxies is set). */
  recordIp: boolean;
}

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);
const requestBody = z.object({ version: z.number().int().min(1), documentSha256: sha256 });
const acceptBody = z.object({ documentSha256: sha256, typedName: typedNameSchema });
const declineBody = z.object({ documentSha256: sha256, reason: declineReasonSchema.optional() });

const REFUSALS: Record<AcceptanceNotAllowedError["reason"], { status: number; error: string }> = {
  "not-your-deal": { status: 403, error: "you cannot do this on this deal" },
  "wrong-status": { status: 409, error: "the deal is not at this stage any more; reload the page" },
  "no-buyer": { status: 409, error: "add the buyer first" },
  "no-scope": { status: 409, error: "save the agreed work first" },
  stale: { status: 409, error: "the terms changed; reload the page" },
};

const refuse = (reply: FastifyReply, reason: AcceptanceNotAllowedError["reason"]) => {
  const { status, error } = REFUSALS[reason];
  return reply.code(status).send({ error, reason });
};

/** The steps that change whether the deal is waiting, signed or back to draft. */
const ACCEPTANCE_EVENTS = new Set([
  "ACCEPTANCE_REQUESTED",
  "ACCEPTANCE_WITHDRAWN",
  "ACCEPTED",
  "DECLINED",
]);

/** The acceptance document for the newest version as it would be shown now, or undefined. */
async function currentDocument(db: Database, deal: Deal) {
  const scope = await getLatestScope(db, deal.id);
  if (!scope) return undefined;
  const sellerName = nameOf(await getUser(db, deal.sellerId), "Seller");
  return { scope, ...fingerprinted(acceptanceDocument({ deal, sellerName, scope })) };
}

/** When the buyer last declined, if that is the latest acceptance step: what the seller sees. */
async function lastDecline(db: Database, dealId: string) {
  const steps = (await readLedger(db, dealId)).filter((entry) => ACCEPTANCE_EVENTS.has(entry.type));
  const last = steps.at(-1);
  if (last?.type !== "DECLINED") return null;
  const parsed = z.object({ reason: z.string().optional() }).safeParse(last.payload);
  return { at: last.serverTime, reason: parsed.success ? (parsed.data.reason ?? null) : null };
}

/**
 * The acceptance as the pages see it. While waiting, both sides see the document for the newest
 * version; in a draft only the seller does (as a preview). Once signed, both see the stored
 * document exactly as it was signed, with the typed name and time.
 */
async function acceptanceView(db: Database, deal: Deal, role: "seller" | "buyer") {
  const accepted = await getLatestAcceptance(db, deal.id);
  const signed = accepted !== undefined && deal.status !== "draft";
  const current =
    !signed && (deal.status === "awaiting_acceptance" || role === "seller")
      ? await currentDocument(db, deal)
      : undefined;
  return {
    status: deal.status,
    document: signed ? accepted.document : (current?.document ?? null),
    documentSha256: signed ? accepted.documentSha256 : (current?.documentSha256 ?? null),
    accepted: signed
      ? {
          version: accepted.version,
          typedName: accepted.typedName,
          at: accepted.createdAt.toISOString(),
        }
      : null,
    lastDecline:
      role === "seller" && deal.status === "draft" ? await lastDecline(db, deal.id) : null,
  };
}

/**
 * Sending for acceptance, withdrawing, signing and declining. Each step checks that the page the
 * person acted on still shows the newest terms (by the document's fingerprint), so nobody signs
 * or sends terms they did not see.
 */
export const acceptanceRoutes: FastifyPluginAsync<AcceptanceRouteOptions> = (app, options) => {
  const { visibleDeal, sellersDeal, buyersDeal, clock, recordIp } = options;

  /** Answers with the deal's acceptance as it is now, for the person asking. */
  const answer = async (reply: FastifyReply, { db, deal, viewer }: FoundDeal) => {
    const fresh = (await getDeal(db, deal.id)) ?? deal;
    return reply.send(await acceptanceView(db, fresh, roleIn(viewer, fresh)));
  };

  /**
   * The document the step is about, after checking the deal is at `status` and that the person's
   * page showed this document (and version, when given); or undefined after answering 409.
   */
  async function checkedDocument(
    reply: FastifyReply,
    { db, deal }: FoundDeal,
    status: Deal["status"],
    seen: { documentSha256: string; version?: number },
  ) {
    if (deal.status !== status) {
      await refuse(reply, "wrong-status");
      return undefined;
    }
    const current = await currentDocument(db, deal);
    if (!current) {
      await refuse(reply, "no-scope");
      return undefined;
    }
    const versionDiffers = seen.version !== undefined && seen.version !== current.scope.version;
    if (versionDiffers || seen.documentSha256 !== current.documentSha256) {
      await refuse(reply, "stale");
      return undefined;
    }
    return current;
  }

  /** Runs a step, turning a refusal from the database into its answer. */
  async function step(reply: FastifyReply, found: FoundDeal, work: () => Promise<unknown>) {
    try {
      await work();
    } catch (error) {
      if (!(error instanceof AcceptanceNotAllowedError)) throw error;
      return refuse(reply, error.reason);
    }
    return answer(reply, found);
  }

  app.get("/api/deals/:id/acceptance", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    return found ? answer(reply, found) : reply;
  });

  app.post("/api/deals/:id/acceptance/request", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const body = await readBody(requestBody, request, reply);
    if (!body) return reply;
    const current = await checkedDocument(reply, found, "draft", body);
    if (!current) return reply;
    return step(reply, found, async () => {
      await requestAcceptance(
        found.db,
        {
          dealId: found.deal.id,
          sellerId: found.viewer.user.id,
          version: current.scope.version,
          contentSha256: current.scope.contentSha256,
          documentSha256: current.documentSha256,
        },
        clock(),
      );
      request.log.info({ dealId: found.deal.id }, "Acceptance requested");
    });
  });

  app.post("/api/deals/:id/acceptance/withdraw", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    return step(reply, found, async () => {
      await withdrawAcceptance(
        found.db,
        { dealId: found.deal.id, sellerId: found.viewer.user.id },
        clock(),
      );
      request.log.info({ dealId: found.deal.id }, "Acceptance request withdrawn");
    });
  });

  /**
   * A buyer's answer (sign or decline): checks the page they saw still shows the newest terms,
   * then runs the step with the deal, buyer and version filled in and where they connected from.
   */
  function buyerStep<T extends { documentSha256: string }>(
    name: "accept" | "decline",
    schema: z.ZodType<T>,
    logLine: string,
    work: (
      body: T,
      common: RequestOrigin & { dealId: string; buyerId: string; version: number },
      context: {
        current: NonNullable<Awaited<ReturnType<typeof currentDocument>>>;
        db: Database;
        access: "link" | "paypal";
      },
    ) => Promise<unknown>,
  ) {
    app.post(`/api/deals/:id/acceptance/${name}`, async (request, reply) => {
      const found = await buyersDeal(request, reply);
      if (!found) return reply;
      const body = await readBody(schema, request, reply);
      if (!body) return reply;
      const current = await checkedDocument(reply, found, "awaiting_acceptance", body);
      if (!current) return reply;
      const common = {
        dealId: found.deal.id,
        buyerId: found.viewer.user.id,
        version: current.scope.version,
        ...requestOrigin(request, recordIp),
      };
      return step(reply, found, async () => {
        await work(body, common, { current, db: found.db, access: found.viewer.access.method });
        // What the buyer typed (name, reason) stays out of the server's logs; the evidence log has it.
        request.log.info({ dealId: found.deal.id }, logLine);
      });
    });
  }

  buyerStep("accept", acceptBody, "Terms accepted", (body, common, { current, db, access }) =>
    acceptTerms(
      db,
      {
        ...common,
        contentSha256: current.scope.contentSha256,
        document: current.document,
        noticeVersion: ACCEPTANCE_NOTICE_VERSION,
        typedName: body.typedName,
        access,
      },
      clock(),
    ),
  );

  buyerStep("decline", declineBody, "Terms declined", (body, common, { current, db }) =>
    declineTerms(
      db,
      {
        ...common,
        documentSha256: current.documentSha256,
        ...(body.reason === undefined ? {} : { reason: body.reason }),
      },
      clock(),
    ),
  );

  return Promise.resolve();
};
