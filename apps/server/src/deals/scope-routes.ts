import {
  listArtifacts,
  DraftIntegrityError,
  ScopeNotAllowedError,
  draftFingerprint,
  getDraft,
  getLatestScope,
  saveScopeVersion,
  scopeContentSchema,
  type DraftRecord,
} from "@pactpal/db";
import type { FastifyPluginAsync } from "fastify";
import { scopeDraftSchema, type ScopeDraft } from "@pactpal/scope-draft";
import { z } from "zod";
import { compareWithDraft } from "../drafting/confirmation.js";
import { councilRecordSchema, isUnranked } from "../drafting/council-record.js";
import { readBody, type DealLookup } from "./access.js";
import { checkedContent, stagesInMinor, typedStageSchema } from "./content-input.js";
import { signedRecord } from "../payments/signed-record.js";
import { scopeView } from "./scope-view.js";

export interface ScopeRouteOptions {
  visibleDeal: DealLookup;
  sellersDeal: DealLookup;
  clock: () => Date;
}

/**
 * What the seller sends: the agreed work with each stage's amount as typed ("250.00"). The rules
 * are the stored content's own; only the amount differs, converted to minor units on the server.
 */
const scopeBody = scopeContentSchema.omit({ format: true, milestones: true }).extend({
  /** The AI draft this was made from, if any; the log then records the link. */
  draftId: z.uuid().optional(),
  /** With `draftId`: the letter of the draft the seller chose when the council could not rank them. */
  draftLabel: z.string().min(1).max(8).optional(),
  milestones: z.array(typedStageSchema).min(1).max(20),
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

/** The body as stored content, or the fields that are wrong. */
function toContent(body: ScopeBody, currency: string) {
  const { stages, fields } = stagesInMinor(body.milestones, currency, "milestones");
  return checkedContent({ ...body, format: 1, milestones: stages }, fields);
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
    // Once signed, the agreement is the signed version: a change waiting for the buyer (or one
    // declined) is shown on its own, never as the agreement.
    const record = await signedRecord(found.db, found.deal);
    const scope = record?.scope ?? (await getLatestScope(found.db, found.deal.id));
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
    // A listing's photos must be this deal's own saved files, unchanged (8e).
    const photos = content.content.listing?.photos ?? [];
    if (photos.length > 0) {
      const files = await listArtifacts(db, deal.id, "source");
      const kept = new Map(files.map((file) => [file.id, file.sha256]));
      if (photos.some((p) => kept.get(p.artifactId) !== p.sha256)) {
        return reply.code(400).send({ error: "invalid", fields: ["listing.photos"] });
      }
    }

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
