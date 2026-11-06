import { claimAnalysisSchema, packetSummarySchema, responseDraftSchema } from "@pactpal/claims";
import {
  finishDisputeAction,
  listClaimAnalyses,
  listDisputeActions,
  listPackets,
  readLedger,
  type ActionOutcome,
  type Database,
  type DisputeActionRecord,
  type StoredDispute,
} from "@pactpal/db";
import {
  DisputeActionNotAllowed,
  EvidenceFileError,
  PayPalApiError,
  type PayPalDisputes,
} from "@pactpal/paypal";
import { disputedAmountWords } from "./dispute-view.js";
import { PACKET_LIMITS, uploadFilesOf } from "./packet.js";

/** What PactPal sends PayPal for a dispute (5g); absent until the seller app's keys are set. */
export type DisputeWriter = Pick<
  PayPalDisputes,
  "escalate" | "provideEvidence" | "sendMessage" | "makeOffer" | "acceptClaim"
>;

/** The evidence types the seller may choose: those PayPal asks for, else only "OTHER". */
export const evidenceTypesFor = (requested: readonly string[]): string[] =>
  requested.length > 0 ? [...requested] : ["OTHER"];

/** The newest ready draft of a kind, read through its schema, or undefined. */
async function newestReady<T>(
  db: Database,
  disputeId: string,
  kind: "claim" | "summary" | "response",
  read: (value: unknown) => T | undefined,
): Promise<T | undefined> {
  const jobs = await listClaimAnalyses(db, disputeId, kind);
  const ready = jobs.find((job) => job.status === "ready");
  return ready === undefined ? undefined : read(ready.analysis);
}

/** One sent, refused or pending action for the page: what went, never the files' contents. */
export const actionView = (action: DisputeActionRecord) => ({
  id: action.id,
  kind: action.kind,
  status: action.status,
  evidenceType: action.evidenceType ?? null,
  offerType: action.offerType ?? null,
  amount: action.amount ?? null,
  note: action.note,
  files: action.files.map(({ exhibit, name, bytes }) => ({ exhibit, name, bytes })),
  totalBytes: action.totalBytes,
  failure: action.failure ?? null,
  createdAt: action.createdAt.toISOString(),
  finishedAt: action.finishedAt?.toISOString() ?? null,
});

/**
 * What the seller can send PayPal now, for the review screens: whether escalating or sending
 * evidence is allowed at the last check, the evidence types with the comparison's suggestion
 * (5d), the summary's draft note (5f), the newest packet's files and sizes, and past actions.
 */
export async function actionChoices(
  db: Database,
  dealId: string,
  dispute: StoredDispute,
  requested: readonly string[],
) {
  const [suggested, note, answerHelp, packets, actions, ledger] = await Promise.all([
    newestReady(
      db,
      dispute.disputeId,
      "claim",
      (value) => claimAnalysisSchema.safeParse(value).data?.suggestion.evidenceType ?? undefined,
    ),
    newestReady(
      db,
      dispute.disputeId,
      "summary",
      (value) => packetSummarySchema.safeParse(value).data?.note,
    ),
    newestReady(
      db,
      dispute.disputeId,
      "response",
      (value) => responseDraftSchema.safeParse(value).data,
    ),
    listPackets(db, dispute.disputeId),
    listDisputeActions(db, dispute.disputeId),
    readLedger(db, dealId),
  ]);
  const types = evidenceTypesFor(requested);
  const packet = packets[0];
  const files = packet === undefined ? [] : uploadFilesOf(packet);
  const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0);
  return {
    allowed: {
      escalate: dispute.allowedActions.includes("escalate"),
      evidence: dispute.allowedActions.includes("provide_evidence"),
      message: dispute.allowedActions.includes("send_message"),
      offer: dispute.allowedActions.includes("make_offer") && dispute.offerTypes.includes("REFUND"),
      accept: dispute.allowedActions.includes("accept_claim") && dispute.amountMinor !== null,
    },
    /** The disputed amount: an offer's limit and what accepting refunds. */
    disputed:
      dispute.amountMinor === null || dispute.currency === null
        ? null
        : {
            minor: dispute.amountMinor,
            currency: dispute.currency,
            words: disputedAmountWords(dispute),
          },
    /** The newest ready answer help (5h): starting points for the message and the offer note. */
    draftMessage: answerHelp?.message ?? null,
    draftOfferNote: answerHelp?.offerNote ?? null,
    evidenceTypes: types,
    suggestedType: suggested !== undefined && types.includes(suggested) ? suggested : null,
    draftNote: note ?? null,
    packet:
      packet === undefined
        ? null
        : {
            id: packet.id,
            packetSha256: packet.packetSha256,
            createdAt: packet.createdAt.toISOString(),
            // Log entries written after the packet's own entry, so the page can say so.
            newerEntries: ledger.filter((entry) => entry.seq > packet.ledgerSeq).length,
            files,
            totalBytes,
            overLimit:
              totalBytes > PACKET_LIMITS.maxTotalBytes ||
              files.some((file) => file.bytes > PACKET_LIMITS.maxFileBytes),
          },
    limits: PACKET_LIMITS,
    actions: actions.map(actionView),
  };
}

/**
 * How a failed send ended, in the seller's words: a clear refusal (PayPal said no, does not allow
 * it now, or would not take a file; nothing was sent) or an unknown outcome (no proper answer;
 * PayPal may have it). PayPal's own descriptions are never shown, only its issue code.
 */
export function failedOutcome(error: unknown): Exclude<ActionOutcome, { status: "sent" }> {
  if (error instanceof DisputeActionNotAllowed) {
    return { status: "refused", failure: "PayPal does not allow this for the dispute right now" };
  }
  if (error instanceof EvidenceFileError) {
    return { status: "refused", failure: "PayPal would not accept one of the files" };
  }
  if (error instanceof PayPalApiError && error.status < 500) {
    const code = error.details[0]?.issue ?? error.errorName;
    return { status: "refused", failure: `PayPal refused it${code ? ` (${code})` : ""}` };
  }
  return { status: "unknown", failure: "PayPal did not answer properly; it may have received it" };
}

/** The PayPal call for one reserved action, with its fixed request id. */
function send(
  writer: DisputeWriter,
  action: DisputeActionRecord,
  files: readonly { name: string; content: Uint8Array }[],
) {
  const { disputeId, note, requestId } = action;
  switch (action.kind) {
    case "escalate":
      return writer.escalate(disputeId, { note, requestId });
    case "message":
      return writer.sendMessage(disputeId, { message: note, requestId });
    case "offer":
      return writer.makeOffer(disputeId, {
        offerType: action.offerType ?? "REFUND",
        amount: action.amount ?? { minor: 0, currency: "USD" },
        note,
        requestId,
      });
    case "accept":
      // A full refund: PayPal refunds the disputed amount (no partial amount is sent).
      return writer.acceptClaim(disputeId, { note, requestId });
    case "evidence":
      return writer.provideEvidence(disputeId, {
        evidenceType: action.evidenceType ?? "OTHER",
        notes: note,
        files: files.map(({ name, content }) => ({ filename: name, bytes: content })),
        requestId,
      });
  }
}

/**
 * Sends one reserved action with its fixed request id and settles it: sent (logged), refused or
 * unknown. Never throws for PayPal's answer; the settled action says what happened.
 */
export async function deliverAction(
  deps: { db: Database; writer: DisputeWriter; clock: () => Date },
  action: DisputeActionRecord,
  files: readonly { name: string; content: Uint8Array }[],
): Promise<DisputeActionRecord> {
  const { db, writer, clock } = deps;
  let outcome: ActionOutcome;
  try {
    const result = await send(writer, action, files);
    outcome = { status: "sent", transport: result.transport, debugId: result.debugId };
  } catch (error) {
    outcome = failedOutcome(error);
  }
  return (await finishDisputeAction(db, { actionId: action.id, outcome }, clock())).action;
}
