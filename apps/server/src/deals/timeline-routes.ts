import {
  StepNotAllowedError,
  asStepUpdates,
  deliveryAnswers,
  getScopeVersion,
  listDeliveries,
  listMilestones,
  listStepUpdates,
  recordStepUpdate,
  stepUpdateSchema,
  type Database,
  type Deal,
} from "@pactpal/db";
import {
  STEP_KIND_WORDS,
  allowedUpdates,
  timelineOf,
  timelineProgress,
  type StageFacts,
  type StepUpdateStatus,
} from "@pactpal/timeline";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import type { DealCards } from "../chat/cards.js";
import { chatNames } from "../chat/chat-routes.js";
import type { PartyNotice } from "../chat/notifier.js";
import { signedRecord } from "../payments/signed-record.js";
import { requestOrigin } from "../request-origin.js";
import { readBody, sendRefusal, type DealLookup } from "./access.js";
import { stepTerms } from "./scope-view.js";
import { roleIn } from "./visibility.js";

export interface TimelineRouteOptions {
  visibleDeal: DealLookup;
  clock: () => Date;
  newId: () => string;
  recordIp: boolean;
  cards?: DealCards | undefined;
}

const stepParams = z.object({ step: z.coerce.number().int().min(1).max(60) });
const updateBody = stepUpdateSchema.pick({ status: true, note: true, fileIds: true });

const REFUSALS: Record<StepNotAllowedError["reason"], { status: number; error: string }> = {
  "not-your-deal": { status: 403, error: "only the seller and the buyer can do this" },
  "not-running": { status: 409, error: "the timeline runs once the buyer has signed" },
  "no-step": { status: 404, error: "the signed timeline has no such step" },
  "not-allowed": { status: 409, error: "that is not the next thing for you on this step" },
  "no-file": { status: 404, error: "a file named is not a file of this deal" },
};

/** What the invoice and delivery records say about each payment stage (any signed version). */
export async function stageFacts(db: Database, dealId: string): Promise<StageFacts[]> {
  const [milestones, deliveries, answers] = await Promise.all([
    listMilestones(db, dealId),
    listDeliveries(db, dealId),
    deliveryAnswers(db, dealId),
  ]);
  const stageOfDelivery = new Map(deliveries.map((d) => [d.id, d.stage]));
  const stages = new Set([...milestones.map((m) => m.stage), ...deliveries.map((d) => d.stage)]);
  return [...stages].map((stage) => {
    const forStage = answers.filter((a) => stageOfDelivery.get(a.deliveryId) === stage);
    const lastAnswer = forStage.at(-1);
    const invoices = milestones.filter((m) => m.stage === stage);
    return {
      stage,
      invoiced: invoices.some((m) => m.status === "sent" || m.status === "paid"),
      paid: invoices.some((m) => m.status === "paid"),
      delivered: deliveries.some((d) => d.stage === stage),
      approved: forStage.some((a) => a.kind === "approved"),
      changesAsked: lastAnswer?.kind === "changes",
    };
  });
}

/** How each update reads in the chat and in the other side's notification. */
const UPDATE_WORDS: Record<StepUpdateStatus, (who: string, step: string) => string> = {
  submitted: (who, step) => `${who} shared ${step} for review.`,
  approved: (who, step) => `${who} approved ${step}.`,
  changes: (who, step) => `${who} asked for changes to ${step}.`,
  done: (who, step) => `${who} marked ${step} as done.`,
};

/**
 * The signed timeline as it runs (7k), for both sides: each step with where it stands, who it
 * waits for, what each side may do now, and its recorded updates. Each side records its own
 * manual steps; payments and deliveries follow their own records. Every update is logged, and
 * a card in the chat tells the other side.
 */
export const timelineRoutes: FastifyPluginAsync<TimelineRouteOptions> = (app, options) => {
  const { visibleDeal, clock, newId, recordIp, cards } = options;

  async function view(db: Database, deal: Deal, role: "seller" | "buyer") {
    const record = await signedRecord(db, deal);
    if (!record) return { signed: false, version: null, currency: deal.currency, steps: [] };
    const { scope } = record;
    const { version } = scope;
    const steps = timelineOf(scope.content);
    const records = await listStepUpdates(db, deal.id);
    const progress = timelineProgress(steps, asStepUpdates(records), await stageFacts(db, deal.id));
    const terms = stepTerms(scope.content, deal.currency);
    return {
      signed: true,
      version,
      currency: deal.currency,
      steps: steps.map((step, i) => {
        const state = progress[i];
        return {
          ...terms[i],
          state: state?.state ?? "open",
          waitingOn: state?.waitingOn ?? null,
          next: state?.next ?? "",
          canDo: deal.status === "active" && state ? allowedUpdates(step, state.state, role) : [],
          updates: records
            .filter((r) => r.step === i + 1)
            .map((r) => ({
              status: r.status,
              actor: r.actor,
              at: r.createdAt.toISOString(),
              note: r.note,
              files: r.files,
            })),
        };
      }),
    };
  }

  app.get("/api/deals/:id/timeline", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    if (!found) return reply;
    return reply.send(await view(found.db, found.deal, roleIn(found.viewer, found.deal)));
  });

  app.post("/api/deals/:id/timeline/:step", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    if (!found) return reply;
    const { db, deal, viewer } = found;
    const role = roleIn(viewer, deal);
    if (role === "seller" && viewer.access.method !== "paypal") {
      return reply.code(403).send({ error: "only the seller can do this" });
    }
    const params = stepParams.safeParse(request.params);
    if (!params.success)
      return reply.code(404).send({ error: "the signed timeline has no such step" });
    const body = await readBody(updateBody, request, reply);
    if (!body) return reply;
    let recorded;
    try {
      recorded = await recordStepUpdate(
        db,
        {
          id: newId(),
          dealId: deal.id,
          actorId: viewer.user.id,
          step: params.data.step,
          ...body,
          ...requestOrigin(request, recordIp),
        },
        clock(),
      );
    } catch (error) {
      if (!(error instanceof StepNotAllowedError)) throw error;
      return sendRefusal(reply, REFUSALS[error.reason]);
    }
    request.log.info(
      { dealId: deal.id, step: params.data.step, status: body.status },
      "Step updated",
    );
    if (cards) {
      const names = await chatNames(db, deal);
      const scope = await getScopeVersion(db, deal.id, recorded.version);
      const step = scope
        ? stepTerms(scope.content, deal.currency)[params.data.step - 1]
        : undefined;
      const stepWords = `step ${String(params.data.step)}${step ? ` (${STEP_KIND_WORDS[step.kind]}: "${step.title}")` : ""}`;
      const other = role === "seller" ? "buyer" : "seller";
      // The other side is emailed when the step now waits for them.
      const needsThem = body.status === "submitted" || body.status === "changes";
      const notification: Omit<PartyNotice, "text"> = {
        kind: "step",
        tab: "timeline",
        ...(needsThem
          ? {
              email: {
                subject: `Timeline update: "${deal.title}"`,
                lines: [
                  UPDATE_WORDS[body.status](names[role], stepWords),
                  "It is waiting for you: open the deal's timeline to see it.",
                ],
              },
            }
          : {}),
      };
      await cards.post(deal, {
        to: other,
        body: UPDATE_WORDS[body.status](names[role], stepWords),
        notice: { type: "step", step: params.data.step },
        ledgerSeq: recorded.entry.seq,
        notification,
      });
    }
    return reply.send(await view(db, deal, role));
  });

  return Promise.resolve();
};
