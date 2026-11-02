import type { Acceptance, Deal, ScopeVersion } from "@pactpal/db";
import { canonicalJson, sha256Hex } from "@pactpal/ledger";
import { invoiceNote, toPayPalMoney } from "@pactpal/paypal";
import type { StageFacts } from "../email/common.js";

/** Everything PayPal will show the buyer for one stage, and its fingerprint. */
export interface StageInvoice {
  stage: number;
  stageCount: number;
  title: string;
  dueDate: string | null;
  amount: { minor: number; currency: string; text: string };
  itemName: string;
  description: string;
  /** Passed to PayPal, which writes it as "Agreed scope: …" (`note` below). */
  scopeReference: string;
  note: string;
  /** Fixed per deal, version and stage, so every retry reaches PayPal as the same request. */
  requestId: string;
  /** SHA-256 of the item name, description, note and amount, as the seller confirmed them. */
  invoiceSha256: string;
}

const day = (at: Date) => at.toLocaleDateString("en-GB", { dateStyle: "medium", timeZone: "UTC" });

/**
 * The invoice for one payment stage (1-based) of the signed version, with the wording approved by
 * the owner (4d), or undefined if the version has no such stage. Built only from the signed
 * record, so the same signed deal always gives the same invoice.
 */
export function invoiceFor(input: {
  deal: Deal;
  scope: ScopeVersion;
  acceptance: Pick<Acceptance, "typedName" | "createdAt">;
  stage: number;
}): StageInvoice | undefined {
  const { deal, scope, acceptance, stage } = input;
  const stages = scope.content.milestones;
  const milestone = stages[stage - 1];
  if (milestone === undefined || stage < 1) return undefined;
  const itemName = `Stage ${String(stage)} of ${String(stages.length)}: ${milestone.title}`;
  const scopeReference =
    `"${deal.title}", version ${String(scope.version)}, signed by ${acceptance.typedName} on ` +
    `${day(acceptance.createdAt)}. Fingerprint (SHA-256): ${scope.contentSha256}. ` +
    `Record kept by PactPal, deal ${deal.id}.`;
  const amount = {
    minor: milestone.amountMinor,
    currency: deal.currency,
    text: toPayPalMoney({ minor: milestone.amountMinor, currency: deal.currency }).value,
  };
  const note = invoiceNote(scopeReference);
  return {
    stage,
    stageCount: stages.length,
    title: milestone.title,
    dueDate: milestone.dueDate ?? null,
    amount,
    itemName,
    description: deal.title,
    scopeReference,
    note,
    requestId: `pp-${deal.id}-v${String(scope.version)}-s${String(stage)}`,
    invoiceSha256: sha256Hex(
      canonicalJson({
        itemName,
        description: deal.title,
        note,
        amountMinor: amount.minor,
        currency: amount.currency,
      }),
    ),
  };
}

/** What emails about this stage say: the deal, which stage of how many, and the amount. */
export const stageFacts = (invoice: StageInvoice): StageFacts => ({
  dealTitle: invoice.description,
  stage: invoice.stage,
  stageCount: invoice.stageCount,
  stageTitle: invoice.title,
  amountText: invoice.amount.text,
  currency: invoice.amount.currency,
});
