import { documentFingerprint, type Deal, type ScopeVersion } from "@pactpal/db";
import { categoryLabelOf } from "../deals/parties.js";
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

/**
 * The acceptance document: everything the buyer's page shows, as plain data. The page draws only
 * from it, so what is fingerprinted is what is shown. Built the same way every time from the same
 * deal, seller name and version, so the server can rebuild it and compare fingerprints.
 */
export function acceptanceDocument(input: { deal: Deal; sellerName: string; scope: ScopeVersion }) {
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
export type AcceptanceDocument = ReturnType<typeof acceptanceDocument>;

/** The document with its fingerprint (SHA-256 of its canonical JSON). */
export function fingerprinted(document: AcceptanceDocument) {
  return { document, documentSha256: documentFingerprint(document) };
}
