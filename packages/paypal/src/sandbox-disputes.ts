import { PayPalDisputes, type DisputeAnswer } from "./disputes.js";
import type { PayPalResult } from "./types.js";

/** Which side a sandbox step favours or asks. */
export type DisputeParty = "seller" | "buyer";

const EVIDENCE_FROM: Record<DisputeParty, string> = {
  seller: "SELLER_EVIDENCE",
  buyer: "BUYER_EVIDENCE",
};

const OUTCOME_FOR: Record<DisputeParty, string> = {
  seller: "SELLER_FAVOR",
  buyer: "BUYER_FAVOR",
};

/**
 * Sandbox-only steps that stand in for PayPal's own staff, so a test dispute
 * can be taken to a verdict. Kept out of `PayPalDisputes` so product code
 * cannot call them; PayPal refuses them outside the sandbox anyway.
 *
 * Both need the dispute to be under PayPal's review and the matching link on
 * the dispute, and go through the same check-and-queue path as real answers.
 */
export class PayPalSandboxDisputes extends PayPalDisputes {
  /** Asks one side for evidence, which lets that side provide it. */
  async requireEvidence(
    disputeId: string,
    from: DisputeParty,
    requestId: string,
  ): Promise<PayPalResult<DisputeAnswer>> {
    const body = { action: EVIDENCE_FROM[from] };
    return this.answer(disputeId, "require_evidence", undefined, () =>
      this.restOnly(this.post(disputeId, "require-evidence", requestId, { body })),
    );
  }

  /** Settles the dispute in one side's favour, as PayPal's staff would. */
  async adjudicate(
    disputeId: string,
    winner: DisputeParty,
    requestId: string,
  ): Promise<PayPalResult<DisputeAnswer>> {
    const body = { adjudication_outcome: OUTCOME_FOR[winner] };
    return this.answer(disputeId, "adjudicate", undefined, () =>
      this.restOnly(this.post(disputeId, "adjudicate", requestId, { body })),
    );
  }
}
