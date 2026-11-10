import {
  agreementListingSchema,
  deliverableKindSchema,
  documentFingerprint,
  getLatestScope,
  getUser,
  type Database,
  type Deal,
  type ScopeVersion,
} from "@pactpal/db";
import { z } from "zod";
import { categoryLabelOf, nameOf } from "../deals/parties.js";
import { scopeTerms } from "../deals/scope-view.js";

/** Changes whenever the notice wording changes; recorded with every acceptance. */
export const ACCEPTANCE_NOTICE_VERSION = 1;

/** What the buyer is told before signing (notice version 1, approved by the owner). */
export const ACCEPTANCE_NOTICE = {
  version: ACCEPTANCE_NOTICE_VERSION,
  title: "Before you sign",
  lines: [
    "Signing records the name you type, the content of this page and its fingerprint, the time (UTC), your browser and your IP address.",
    "A typed name and an IP address are not proof of identity.",
    "Payments are made through PayPal invoices, one per payment stage. PactPal does not hold money.",
    "This record is shared with the seller and may be used as evidence if there is a dispute about this deal.",
    "Demo: this runs on the PayPal sandbox; no real money moves.",
  ],
} as const;

/** Changes whenever the document's shape changes, so stored documents keep their meaning. */
export const ACCEPTANCE_DOCUMENT_FORMAT = 1;

const money = z.object({ minor: z.number().int(), text: z.string() });

/**
 * The acceptance document, format 1: everything the buyer's page shows, as plain data. The page
 * draws only from it, so what is fingerprinted is what is shown. Stored documents are read back
 * through this schema (for the receipt), and the builder below must produce exactly this shape.
 */
export const acceptanceDocumentSchema = z.strictObject({
  format: z.literal(ACCEPTANCE_DOCUMENT_FORMAT),
  dealId: z.string(),
  title: z.string(),
  category: z.string(),
  sellerName: z.string(),
  terms: z.strictObject({
    version: z.number().int(),
    contentSha256: z.string(),
    currency: z.string(),
    summary: z.string(),
    deliverables: z.array(z.string()),
    exclusions: z.array(z.string()),
    revisionsIncluded: z.number().int().nullable(),
    dueDate: z.string().nullable(),
    milestones: z.array(
      z.strictObject({ title: z.string(), amount: money, dueDate: z.string().nullable() }),
    ),
    total: money,
    /** One mark per delivered line; absent when no line is marked (and before 4i-2). */
    deliverableKinds: z.array(deliverableKindSchema).optional(),
    /** What the buyer provides; absent for versions without it (and documents made before 4i). */
    buyerProvides: z
      .array(z.strictObject({ text: z.string(), dueDate: z.string().nullable() }))
      .optional(),
    /** The agreed steps in order; absent for versions without their own timeline (before 7f). */
    timeline: z
      .array(
        z.strictObject({
          n: z.number().int(),
          kind: z.string(),
          owner: z.enum(["seller", "buyer"]),
          title: z.string(),
          dueDate: z.string().nullable(),
          stage: z.number().int().nullable(),
          amount: money.nullable(),
        }),
      )
      .optional(),
    /** The product as listed (8e); absent for versions without one. */
    listing: agreementListingSchema.optional(),
  }),
  notice: z.strictObject({
    version: z.number().int(),
    title: z.string(),
    lines: z.array(z.string()),
  }),
});
export type AcceptanceDocument = z.infer<typeof acceptanceDocumentSchema>;

/**
 * Builds the acceptance document the same way every time from the same deal, seller name and
 * version, so the server can rebuild it and compare fingerprints.
 */
export function acceptanceDocument(input: {
  deal: Deal;
  sellerName: string;
  scope: ScopeVersion;
}): AcceptanceDocument {
  const { deal, sellerName, scope } = input;
  return {
    format: ACCEPTANCE_DOCUMENT_FORMAT,
    dealId: deal.id,
    title: deal.title,
    category: categoryLabelOf(deal),
    sellerName,
    terms: scopeTerms(scope, deal.currency),
    notice: { ...ACCEPTANCE_NOTICE, lines: [...ACCEPTANCE_NOTICE.lines] },
  };
}

/** The document with its fingerprint (SHA-256 of its canonical JSON). */
export function fingerprinted(document: AcceptanceDocument) {
  return { document, documentSha256: documentFingerprint(document) };
}

/** The page the buyer signs for a version, with its fingerprint (the seller's name read now). */
export async function documentFor(db: Database, deal: Deal, scope: ScopeVersion) {
  const sellerName = nameOf(await getUser(db, deal.sellerId), "Seller");
  return fingerprinted(acceptanceDocument({ deal, sellerName, scope }));
}

/** The acceptance document for the newest version as it would be shown now, or undefined. */
export async function currentDocument(db: Database, deal: Deal) {
  const scope = await getLatestScope(db, deal.id);
  return scope ? { scope, ...(await documentFor(db, deal, scope)) } : undefined;
}
