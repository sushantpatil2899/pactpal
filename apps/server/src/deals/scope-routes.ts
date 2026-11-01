import {
  DraftIntegrityError,
  ScopeNotAllowedError,
  draftFingerprint,
  getDraft,
  getLatestScope,
  saveScopeVersion,
  scopeContentSchema,
  type DraftRecord,
  type ScopeContent,
} from "@pactpal/db";
import { fromPayPalMoney } from "@pactpal/paypal";
import type { FastifyPluginAsync } from "fastify";
import { scopeDraftSchema, type ScopeDraft } from "@pactpal/scope-draft";
import { z } from "zod";
import { compareWithDraft } from "../drafting/confirmation.js";
import { councilRecordSchema, isUnranked } from "../drafting/council-record.js";
import { readBody, type DealLookup } from "./access.js";
import { scopeView } from "./scope-view.js";

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
  /** The AI draft this was made from, if any; the log then records the link. */
  draftId: z.uuid().optional(),
  /** With `draftId`: the letter of the draft the seller chose when the council could not rank them. */
  draftLabel: z.string().min(1).max(8).optional(),
  milestones: z
    .array(
      milestones.element
        .omit({ amountMinor: true })
        .extend({ amount: z.string().trim().min(1).max(20) }),
    )
    .min(1)
    .max(20),
});
type ScopeBody = Omit<z.output<typeof scopeBody>, "draftId" | "draftLabel">;

/**
 * The draft a save is made from: the stored winner, or, when the council could not rank its
 * drafts and a letter is given, that valid draft. Undefined for a letter that does not belong:
 * a ranked council has one answer, so its other drafts cannot be picked.
 */
function chosenDraft(
  record: DraftRecord,
  label: string | undefined,
): { draft: ScopeDraft; label?: string } | undefined {
  const winner = scopeDraftSchema.parse(record.draft);
  if (label === undefined) return { draft: winner };
  const council = councilRecordSchema.safeParse(record.council);
  const candidate =
    council.success && isUnranked(council.data)
      ? council.data.candidates.find((entry) => entry.label === label)
      : undefined;
  return candidate === undefined ? undefined : { draft: candidate.draft, label };
}

const SCOPE_REFUSALS: Record<ScopeNotAllowedError["reason"], { status: number; error: string }> = {
  "not-your-deal": { status: 403, error: "only the seller can do this" },
  "not-draft": { status: 409, error: "the agreed work can only change while the deal is a draft" },
  "bad-draft": { status: 400, error: "invalid" },
};

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
    const parsed = await readBody(scopeBody, request, reply);
    if (!parsed) return reply;
    const { draftId, draftLabel, ...body } = parsed;
    const { deal, db, viewer } = found;
    const content = toContent(body, deal.currency);
    if (!content.ok) return reply.code(400).send({ error: "invalid", fields: content.fields });

    // A version made from an AI draft records the link, with what the seller kept and changed.
    let confirmedFrom;
    if (draftId !== undefined) {
      try {
        const record = await getDraft(db, deal.id, draftId);
        if (record?.status !== "ready" || record.draft === undefined || !record.draftSha256) {
          return await reply.code(400).send({ error: "invalid", fields: ["draftId"] });
        }
        const used = chosenDraft(record, draftLabel);
        if (used === undefined) {
          return await reply.code(400).send({ error: "invalid", fields: ["draftLabel"] });
        }
        confirmedFrom = {
          draftId,
          draftSha256: record.draftSha256,
          ...(used.label === undefined
            ? {}
            : { usedCandidate: { label: used.label, sha256: draftFingerprint(used.draft) } }),
          fields: compareWithDraft(used.draft, content.content, deal.currency),
        };
      } catch (error) {
        if (!(error instanceof DraftIntegrityError)) throw error;
        request.log.error({ dealId: deal.id, draftId }, "Draft failed its fingerprint check");
        return reply.code(409).send({ error: "this draft failed its check and was not used" });
      }
    }
    try {
      const { scope } = await saveScopeVersion(
        db,
        {
          dealId: deal.id,
          sellerId: viewer.user.id,
          content: content.content,
          ...(confirmedFrom ? { confirmedFrom } : {}),
        },
        clock(),
      );
      request.log.info({ dealId: deal.id, version: scope.version }, "Agreed work saved");
      return await reply.code(201).send({ scope: scopeView(scope, deal.currency) });
    } catch (error) {
      if (!(error instanceof ScopeNotAllowedError)) throw error;
      const { status, error: message } = SCOPE_REFUSALS[error.reason];
      return reply
        .code(status)
        .send(
          error.reason === "bad-draft"
            ? { error: message, fields: ["draftId"] }
            : { error: message },
        );
    }
  });

  return Promise.resolve();
};
