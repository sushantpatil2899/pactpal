import {
  ChangeOrderNotAllowedError,
  acceptChangeOrder,
  declineChangeOrder,
  declineReasonSchema,
  getUser,
  listChangeOrders,
  proposeChangeOrder,
  readLedger,
  scopeContentSchema,
  typedNameSchema,
  withdrawChangeOrder,
  type Database,
  type Deal,
  type ScopeChange,
  type ScopeContent,
  type ScopeVersion,
} from "@pactpal/db";
import type { EmailSender } from "@pactpal/email";
import type { FastifyPluginAsync, FastifyReply } from "fastify";
import { z } from "zod";
import {
  ACCEPTANCE_NOTICE_VERSION,
  acceptanceDocument,
  fingerprinted,
} from "../acceptance/document.js";
import { emailReceiptQuietly } from "../acceptance/receipt-mail.js";
import { signedRecord } from "../payments/signed-record.js";
import { requestOrigin } from "../request-origin.js";
import { readBody, type DealLookup, type FoundDeal } from "./access.js";
import { checkedContent, stagesInMinor, typedStageSchema } from "./content-input.js";
import { nameOf } from "./parties.js";
import { money } from "./scope-view.js";
import { roleIn } from "./visibility.js";

export interface ChangeOrderRouteOptions {
  visibleDeal: DealLookup;
  sellersDeal: DealLookup;
  buyersDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
  recordIp: boolean;
  /** Sends the receipt of the new version to both sides once the buyer signs a change. */
  email: EmailSender;
}

const { deliverables, deliverableKinds, exclusions, buyerProvides } = scopeContentSchema.shape;

/** What the seller adds: each part only adds to the signed agreement. */
const proposeBody = z.object({
  addLines: z
    .array(z.object({ text: deliverables.element, mark: deliverableKinds.unwrap().element }))
    .max(50)
    .default([]),
  addExclusions: z.array(exclusions.element).max(50).default([]),
  addBuyerProvides: z.array(buyerProvides.unwrap().element).max(20).default([]),
  addStages: z.array(typedStageSchema).max(20).default([]),
  dueDate: z.iso.date().optional(),
  revisionsIncluded: z.number().int().min(0).max(20).optional(),
  message: z.string().trim().min(1).max(1000).optional(),
});
type ProposeBody = z.output<typeof proposeBody>;

const changeParams = z.object({ changeId: z.uuid() });
const sha256 = z.string().regex(/^[0-9a-f]{64}$/);
const acceptBody = z.object({ documentSha256: sha256, typedName: typedNameSchema });
const declineBody = z.object({ reason: declineReasonSchema.optional() });

const REFUSALS: Record<ChangeOrderNotAllowedError["reason"], { status: number; error: string }> = {
  "not-your-deal": { status: 403, error: "you cannot do this on this deal" },
  "not-signed": { status: 409, error: "the deal is not signed" },
  "already-waiting": { status: 409, error: "a change is already waiting for the buyer" },
  "not-an-addition": { status: 400, error: "invalid" },
  "not-waiting": { status: 409, error: "this change is not waiting any more; reload the page" },
  stale: { status: 409, error: "the change shown is out of date; reload the page" },
};

/**
 * The signed content with the seller's additions after it, or the fields that are wrong, named as
 * the seller's form names them (`addStages.0.amount`, `addLines.1.mark.approvalStage`).
 */
function proposedContent(signed: ScopeContent, body: ProposeBody, currency: string) {
  const { stages, fields } = stagesInMinor(body.addStages, currency, "addStages");
  const lines = signed.deliverables.length;
  const kinds = [
    ...signed.deliverables.map((_, n) => signed.deliverableKinds?.[n] ?? null),
    ...body.addLines.map((line) => line.mark),
  ];
  const dueDate = body.dueDate ?? signed.dueDate;
  const revisions = body.revisionsIncluded ?? signed.revisionsIncluded;
  const raw = {
    ...signed,
    deliverables: [...signed.deliverables, ...body.addLines.map((line) => line.text)],
    deliverableKinds: kinds,
    exclusions: [...signed.exclusions, ...body.addExclusions],
    buyerProvides: [...(signed.buyerProvides ?? []), ...body.addBuyerProvides],
    milestones: [...signed.milestones, ...stages],
    ...(dueDate === undefined ? {} : { dueDate }),
    ...(revisions === undefined ? {} : { revisionsIncluded: revisions }),
  };
  const checked = checkedContent(raw, fields);
  if (checked.ok) return checked;
  // Refusals of added parts are named by their place among the additions.
  const shift = (name: string, form: string, before: number, rest: string[]) => {
    const index = Number(rest[0]) - before;
    return [form, String(index), ...rest.slice(1)].join(".");
  };
  const named = checked.fields.map((field) => {
    const [name = "", ...rest] = field.split(".");
    switch (name) {
      case "deliverables":
        return shift(name, "addLines", lines, [...rest, "text"]);
      case "deliverableKinds":
        return rest.length === 0
          ? "addLines"
          : shift(name, "addLines", lines, [rest[0] ?? "", "mark", ...rest.slice(1)]);
      case "milestones":
        return shift(name, "addStages", signed.milestones.length, rest);
      case "exclusions":
        return shift(name, "addExclusions", signed.exclusions.length, rest);
      case "buyerProvides":
        return shift(name, "addBuyerProvides", signed.buyerProvides?.length ?? 0, rest);
      default:
        return field;
    }
  });
  return { ok: false as const, fields: [...new Set(named)] };
}

/** What a change adds or changes, as the pages show it (amounts in minor units and as text). */
function changeView(change: ScopeChange, from: ScopeVersion, currency: string) {
  const firstNew = from.content.milestones.length + 1;
  return {
    addedLines: change.addedLines,
    addedExclusions: change.addedExclusions,
    addedBuyerProvides: change.addedBuyerProvides.map((item) => ({
      text: item.text,
      dueDate: item.dueDate ?? null,
    })),
    addedStages: change.addedStages.map((stage, n) => ({
      stage: firstNew + n,
      title: stage.title,
      amount: money(stage.amountMinor, currency),
      dueDate: stage.dueDate ?? null,
    })),
    dueDate: change.dueDate ?? null,
    revisionsIncluded: change.revisionsIncluded ?? null,
    total: {
      from: money(change.totalMinor.from, currency),
      to: money(change.totalMinor.to, currency),
    },
  };
}

/** The page the buyer signs for a change: the full new agreement, built as for the first one. */
async function changeDocument(db: Database, deal: Deal, to: ScopeVersion) {
  const sellerName = nameOf(await getUser(db, deal.sellerId), "Seller");
  return fingerprinted(acceptanceDocument({ deal, sellerName, scope: to }));
}

/**
 * Change orders: on a signed deal the seller proposes a change that only adds to the agreement,
 * and the buyer signs it (it becomes the signed version) or declines it; the seller can withdraw
 * a change still waiting. Both sides see every change and its answer.
 */
export const changeOrderRoutes: FastifyPluginAsync<ChangeOrderRouteOptions> = (app, options) => {
  const { visibleDeal, sellersDeal, buyersDeal, clock, newId, recordIp, email } = options;

  async function view(db: Database, deal: Deal, seller: boolean) {
    const [record, orders, entries] = await Promise.all([
      signedRecord(db, deal),
      listChangeOrders(db, deal.id),
      readLedger(db, deal.id),
    ]);
    // Who signed an accepted change: the typed name its log entry records.
    const signedBy = (seq: number | null) => {
      const payload = entries.find((entry) => entry.seq === seq)?.payload;
      const parsed = z.object({ typedName: z.string() }).safeParse(payload);
      return parsed.success ? parsed.data.typedName : null;
    };
    const waiting = orders.find((entry) => entry.order.status === "proposed");
    return {
      signed: record !== undefined,
      signedVersion: record?.scope.version ?? null,
      canPropose: seller && record !== undefined && waiting === undefined,
      orders: await Promise.all(
        orders.map(async ({ order, from, to, change }) => ({
          id: order.id,
          status: order.status,
          fromVersion: order.fromVersion,
          toVersion: order.toVersion,
          message: order.message,
          reason: order.reason,
          proposedAt: order.createdAt.toISOString(),
          answeredAt: order.answeredAt?.toISOString() ?? null,
          acceptedBy: order.status === "accepted" ? signedBy(order.answeredSeq) : null,
          change: changeView(change, from, deal.currency),
          // Only the change waiting has a page to sign.
          ...(order.status === "proposed" ? await changeDocument(db, deal, to) : {}),
        })),
      ),
    };
  }

  const answer = async (reply: FastifyReply, { db, deal, viewer }: FoundDeal) =>
    reply.send(await view(db, deal, roleIn(viewer, deal) === "seller"));

  /** Runs a step, turning a refusal from the database into its answer. */
  async function step(reply: FastifyReply, found: FoundDeal, work: () => Promise<unknown>) {
    try {
      await work();
    } catch (error) {
      if (!(error instanceof ChangeOrderNotAllowedError)) throw error;
      const { status, error: message } = REFUSALS[error.reason];
      return reply
        .code(status)
        .send(
          error.reason === "not-an-addition"
            ? { error: message, fields: error.problems }
            : { error: message },
        );
    }
    return answer(reply, found);
  }

  app.get("/api/deals/:id/change-orders", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    return found ? answer(reply, found) : reply;
  });

  app.post("/api/deals/:id/change-orders", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const body = await readBody(proposeBody, request, reply);
    if (!body) return reply;
    const record = await signedRecord(found.db, found.deal);
    if (!record) return reply.code(409).send({ error: REFUSALS["not-signed"].error });
    const content = proposedContent(record.scope.content, body, found.deal.currency);
    if (!content.ok) return reply.code(400).send({ error: "invalid", fields: content.fields });
    return step(reply, found, async () => {
      await proposeChangeOrder(
        found.db,
        {
          id: newId(),
          dealId: found.deal.id,
          sellerId: found.viewer.user.id,
          content: content.content,
          ...(body.message === undefined ? {} : { message: body.message }),
        },
        clock(),
      );
      request.log.info({ dealId: found.deal.id }, "Change order proposed");
    });
  });

  /** The waiting change named in the path with its versions, or undefined after answering. */
  async function waitingChange(found: FoundDeal, params: unknown, reply: FastifyReply) {
    const parsed = changeParams.safeParse(params);
    const orders = parsed.success ? await listChangeOrders(found.db, found.deal.id) : [];
    const named = orders.find(
      (entry) => entry.order.id === (parsed.success ? parsed.data.changeId : ""),
    );
    if (!named) {
      await reply.code(404).send({ error: "not found" });
      return undefined;
    }
    if (named.order.status !== "proposed") {
      await reply.code(409).send({ error: REFUSALS["not-waiting"].error });
      return undefined;
    }
    return named;
  }

  app.post("/api/deals/:id/change-orders/:changeId/accept", async (request, reply) => {
    const found = await buyersDeal(request, reply);
    if (!found) return reply;
    const body = await readBody(acceptBody, request, reply);
    if (!body) return reply;
    const named = await waitingChange(found, request.params, reply);
    if (!named) return reply;
    const { document, documentSha256 } = await changeDocument(found.db, found.deal, named.to);
    if (documentSha256 !== body.documentSha256) {
      return reply.code(409).send({ error: REFUSALS.stale.error });
    }
    return step(reply, found, async () => {
      await acceptChangeOrder(
        found.db,
        {
          dealId: found.deal.id,
          buyerId: found.viewer.user.id,
          changeOrderId: named.order.id,
          version: named.to.version,
          contentSha256: named.to.contentSha256,
          document,
          noticeVersion: ACCEPTANCE_NOTICE_VERSION,
          typedName: body.typedName,
          access: found.viewer.access.method,
          ...requestOrigin(request, recordIp),
        },
        clock(),
      );
      request.log.info({ dealId: found.deal.id }, "Change order accepted");
      await emailReceiptQuietly({ db: found.db, email, clock, log: request.log }, found.deal.id);
    });
  });

  app.post("/api/deals/:id/change-orders/:changeId/decline", async (request, reply) => {
    const found = await buyersDeal(request, reply);
    if (!found) return reply;
    const body = await readBody(declineBody, request, reply);
    if (!body) return reply;
    const named = await waitingChange(found, request.params, reply);
    if (!named) return reply;
    return step(reply, found, async () => {
      await declineChangeOrder(
        found.db,
        {
          dealId: found.deal.id,
          buyerId: found.viewer.user.id,
          changeOrderId: named.order.id,
          ...(body.reason === undefined ? {} : { reason: body.reason }),
          ...requestOrigin(request, recordIp),
        },
        clock(),
      );
      // The reason stays out of the server's logs; the evidence log has it.
      request.log.info({ dealId: found.deal.id }, "Change order declined");
    });
  });

  app.post("/api/deals/:id/change-orders/:changeId/withdraw", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const named = await waitingChange(found, request.params, reply);
    if (!named) return reply;
    return step(reply, found, async () => {
      await withdrawChangeOrder(
        found.db,
        { dealId: found.deal.id, sellerId: found.viewer.user.id, changeOrderId: named.order.id },
        clock(),
      );
      request.log.info({ dealId: found.deal.id }, "Change order withdrawn");
    });
  });

  return Promise.resolve();
};
