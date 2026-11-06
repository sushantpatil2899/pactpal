import type { Artifact, Deal, StoredDispute } from "@pactpal/db";
import type { LedgerEntry } from "@pactpal/ledger";
import { z } from "zod";
import { addedByRole } from "../deals/file-routes.js";
import { money } from "../deals/scope-view.js";

/** One message in the dispute, as PayPal shows it; the buyer's words are theirs, not ours. */
export interface DisputeMessageView {
  from: string;
  postedAt: string | null;
  text: string;
}

const storedMessages = z.object({
  messages: z.array(
    z.object({
      postedBy: z.string(),
      postedAt: z.string().optional(),
      content: z.string(),
    }),
  ),
});

/** The messages kept from PayPal's answer, or undefined when they cannot be read. */
export function messagesOf(details: StoredDispute["details"]): DisputeMessageView[] | undefined {
  const parsed = storedMessages.safeParse(details ?? { messages: [] });
  if (!parsed.success) return undefined;
  return parsed.data.messages.map((m) => ({
    from: m.postedBy,
    postedAt: m.postedAt ?? null,
    text: m.content,
  }));
}

const keptFields = z
  .object({
    requestedEvidence: z.array(z.string()).default([]),
    decisionReasons: z.array(z.string()).default([]),
    sellerEvidence: z
      .array(z.object({ type: z.string().optional(), documents: z.array(z.string()).default([]) }))
      .default([]),
  })
  .catch({ requestedEvidence: [], decisionReasons: [], sellerEvidence: [] });

/**
 * What PactPal keeps from PayPal's answer about a dispute (empty when unreadable): the evidence
 * types PayPal asks the seller for, its decision reason codes (5i) and the evidence the seller
 * sent as PayPal lists it, with document names.
 */
export const disputeFieldsOf = (details: StoredDispute["details"]) => keptFields.parse(details);

/** The evidence types PayPal asks the seller for, kept from its answer (none when unreadable). */
export const requestedEvidenceOf = (details: StoredDispute["details"]): string[] =>
  disputeFieldsOf(details).requestedEvidence;

/** The seller's answers to PayPal that the dispute's history lists, besides `DISPUTE_` entries. */
const SELLER_ANSWERS = new Set(["EVIDENCE_UPLOADED", "OFFER_MADE", "CLAIM_ACCEPTED"]);

/** The disputed amount in words with its currency ("120.00 USD"), or null when PayPal gave none. */
export const disputedAmountWords = (dispute: StoredDispute): string | null =>
  dispute.amountMinor === null || dispute.currency === null
    ? null
    : `${money(dispute.amountMinor, dispute.currency).text} ${dispute.currency}`;

/** One dispute as the seller's page lists it: PayPal's words, the amount and the respond-by date. */
export const disputeSummaryView = (dispute: StoredDispute) => ({
  disputeId: dispute.disputeId,
  stage: dispute.stage,
  reason: dispute.reason,
  status: dispute.status,
  paypalStage: dispute.stageName,
  amount:
    dispute.amountMinor === null || dispute.currency === null
      ? null
      : { ...money(dispute.amountMinor, dispute.currency), currency: dispute.currency },
  sellerDueAt: dispute.sellerDueAt?.toISOString() ?? null,
  outcome: dispute.outcome,
  firstSeenAt: dispute.firstSeenAt.toISOString(),
});

/** When the dispute began: when the buyer opened it at PayPal, else when PactPal first saw it. */
const openedAt = (dispute: StoredDispute): Date => dispute.paypalCreatedAt ?? dispute.firstSeenAt;

/**
 * The whole dispute for its page (5c): the summary, the buyer's messages, what PayPal allowed
 * at the last check, this dispute's evidence-log entries, and the deal's files added since the
 * buyer opened it, each with who added it. Pure.
 */
export function disputePageView(
  dispute: StoredDispute,
  deal: Deal,
  ledger: readonly LedgerEntry[],
  files: readonly Artifact[],
) {
  const since = openedAt(dispute).getTime();
  const messages = messagesOf(dispute.details);
  return {
    ...disputeSummaryView(dispute),
    invoiceId: dispute.invoiceId,
    buyerDueAt: dispute.buyerDueAt?.toISOString() ?? null,
    openedAt: openedAt(dispute).toISOString(),
    checkedAt: dispute.checkedAt.toISOString(),
    allowedActions: dispute.allowedActions,
    offerTypes: dispute.offerTypes,
    messages: messages ?? [],
    messagesReadable: messages !== undefined,
    events: ledger
      .filter(
        (entry) =>
          (entry.type.startsWith("DISPUTE_") || SELLER_ANSWERS.has(entry.type)) &&
          typeof entry.payload === "object" &&
          entry.payload !== null &&
          !Array.isArray(entry.payload) &&
          entry.payload.disputeId === dispute.disputeId,
      )
      .map((entry) => ({
        seq: entry.seq,
        type: entry.type,
        at: entry.serverTime,
        payload: entry.payload,
      })),
    filesSince: files
      .filter((file) => file.createdAt.getTime() >= since)
      .map((file) => ({
        id: file.id,
        filename: file.filename,
        addedBy: addedByRole(file, deal),
        addedAt: file.createdAt.toISOString(),
      })),
  };
}
