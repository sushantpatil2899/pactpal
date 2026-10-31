import {
  ScopeNotAllowedError,
  getLatestScope,
  saveScopeVersion,
  scopeContentSchema,
  scopeTotalMinor,
  type ScopeContent,
  type ScopeVersion,
} from "@pactpal/db";
import { fromPayPalMoney, toPayPalMoney } from "@pactpal/paypal";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { readBody, type DealLookup } from "./access.js";

export interface ScopeRouteOptions {
  visibleDeal: DealLookup;
  sellersDeal: DealLookup;
  clock: () => Date;
}

const { milestones } = scopeContentSchema.shape;

/**
 * What the seller sends: the agreed work with each stage's amount as typed ("250.00"). The rules
 * are the stored content's own; only the amount differs, converted to minor units on the server.
 */
const scopeBody = scopeContentSchema.omit({ format: true, milestones: true }).extend({
  milestones: z
    .array(
      milestones.element
        .omit({ amountMinor: true })
        .extend({ amount: z.string().trim().min(1).max(20) }),
    )
    .min(1)
    .max(20),
});
type ScopeBody = z.output<typeof scopeBody>;

const SCOPE_REFUSALS: Record<ScopeNotAllowedError["reason"], { status: number; error: string }> = {
  "not-your-deal": { status: 403, error: "only the seller can do this" },
  "not-draft": { status: 409, error: "the agreed work can only change while the deal is a draft" },
};

/** An amount for the pages: whole minor units, and the same as text in PayPal's format. */
const money = (minor: number, currency: string) => ({
  minor,
  text: toPayPalMoney({ minor, currency }).value,
});

/**
 * The body as stored content, converting each typed amount without floating point; or the
 * fields that are wrong (an amount that is not a number of the currency's format, zero, or too large).
 */
function toContent(
  body: ScopeBody,
  currency: string,
): { ok: true; content: ScopeContent } | { ok: false; fields: string[] } {
  const fields: string[] = [];
  const stages = body.milestones.map(({ amount, ...stage }, n) => {
    try {
      return {
        ...stage,
        amountMinor: fromPayPalMoney({ currency_code: currency, value: amount }).minor,
      };
    } catch {
      fields.push(`milestones.${String(n)}.amount`);
      return { ...stage, amountMinor: 0 };
    }
  });
  const content = scopeContentSchema.safeParse({ ...body, format: 1, milestones: stages });
  if (content.success && fields.length === 0) return { ok: true, content: content.data };
  const issues = content.success ? [] : content.error.issues;
  for (const issue of issues) {
    const field = issue.path.join(".").replace(/amountMinor$/, "amount");
    if (!fields.includes(field)) fields.push(field);
  }
  return { ok: false, fields };
}

/** A version as the pages see it, with amounts in minor units and as text. */
function scopeView(scope: ScopeVersion, currency: string) {
  const { content } = scope;
  return {
    version: scope.version,
    contentSha256: scope.contentSha256,
    savedAt: scope.createdAt.toISOString(),
    currency,
    summary: content.summary,
    deliverables: content.deliverables,
    exclusions: content.exclusions,
    revisionsIncluded: content.revisionsIncluded ?? null,
    dueDate: content.dueDate ?? null,
    milestones: content.milestones.map((stage) => ({
      title: stage.title,
      amount: money(stage.amountMinor, currency),
      dueDate: stage.dueDate ?? null,
    })),
    total: money(scopeTotalMinor(content), currency),
  };
}

/**
 * The agreed work of a deal: both sides read the newest version; only the seller saves a new one,
 * while the deal is a draft. Each save is a new numbered version that is never changed.
 */
export const scopeRoutes: FastifyPluginAsync<ScopeRouteOptions> = (app, options) => {
  const { visibleDeal, sellersDeal, clock } = options;

  app.get("/api/deals/:id/scope", async (request, reply) => {
    const found = await visibleDeal(request, reply);
    if (!found) return reply;
    const scope = await getLatestScope(found.db, found.deal.id);
    return reply.send({ scope: scope ? scopeView(scope, found.deal.currency) : null });
  });

  app.post("/api/deals/:id/scope", async (request, reply) => {
    const found = await sellersDeal(request, reply);
    if (!found) return reply;
    const body = await readBody(scopeBody, request, reply);
    if (!body) return reply;
    const { deal, db, viewer } = found;
    const content = toContent(body, deal.currency);
    if (!content.ok) return reply.code(400).send({ error: "invalid", fields: content.fields });
    try {
      const { scope } = await saveScopeVersion(
        db,
        { dealId: deal.id, sellerId: viewer.user.id, content: content.content },
        clock(),
      );
      request.log.info({ dealId: deal.id, version: scope.version }, "Agreed work saved");
      return await reply.code(201).send({ scope: scopeView(scope, deal.currency) });
    } catch (error) {
      if (!(error instanceof ScopeNotAllowedError)) throw error;
      const { status, error: message } = SCOPE_REFUSALS[error.reason];
      return reply.code(status).send({ error: message });
    }
  });

  return Promise.resolve();
};
