import type { DemoRefs } from "@pactpal/db";
import {
  draftAgreement,
  notSignedInWithPayPal,
  paidOrInstruction,
  saveAgreement,
  sendForSigning,
  sendInvoice,
  type AgreementForm,
  type SeedContext,
} from "./actions.js";
import { needRef, type DemoStep, type StepResult } from "./engine.js";
import { buildPacket, compareClaim, disputeOf, postChat, summarise } from "./story-actions.js";

/** One story step over the seed's context. */
export type Step = DemoStep<SeedContext>;

/** A buyer or seller of a story: their sign-in email and their name. */
export interface Person {
  email: string;
  name: string;
}

/**
 * The first step of every run: everyone in the story has signed in to PactPal with PayPal once
 * (sellers and buyers), so each person's account is the one tied to their sandbox PayPal account.
 */
export const peopleStep = (people: readonly Person[]): Step => ({
  id: "people",
  what: "check everyone has signed in with PayPal",
  run: async (context) => {
    const missing = await notSignedInWithPayPal(
      context,
      people.map((person) => person.email),
    );
    return missing.length === 0
      ? { status: "done" }
      : {
          status: "waiting",
          instruction: `Sign in to pact-pal.app with PayPal once as each of these sandbox accounts: ${missing.join(", ")}. Then run this story again.`,
        };
  },
});

/** A step that does its work and is done, with what it made. */
export const doStep = (
  id: string,
  what: string,
  work: (context: SeedContext, refs: DemoRefs) => Promise<DemoRefs | undefined>,
  needsAi = false,
): Step => ({
  id,
  what,
  needsAi,
  run: async (context, refs) => {
    const made = await work(context, refs);
    return made === undefined ? { status: "done" } : { status: "done", refs: made };
  },
});

/** A step that posts lines of a chat script ("who|text"), in order. */
export const chatStep = (
  id: string,
  dealKey: string,
  lines: (context: SeedContext) => string[],
  people: Readonly<Record<string, string>>,
): Step =>
  doStep(id, "post the next chat messages", async (context, refs) => {
    await postChat(context, needRef(refs, dealKey), lines(context), people);
    return undefined;
  });

/**
 * An AI draft from the deal's pasted chat (`pastedKey` names its file) or, with `"update"`, the
 * update from the in-app chat (7i); the ready draft's id is kept as `<id>Id` for the agreement.
 */
export const draftStep = (
  id: string,
  seller: string,
  dealKey: string,
  source: { pastedKey: string } | "update",
): Step => ({
  id,
  what: source === "update" ? "AI update of the agreement from the chat" : "AI draft from the chat",
  needsAi: true,
  run: async (context, refs) => {
    const draft = await draftAgreement(
      context,
      seller,
      needRef(refs, dealKey),
      source === "update" ? "update" : [needRef(refs, source.pastedKey)],
    );
    return draft.ready
      ? { status: "done", refs: { [`${id}Id`]: draft.draftId } }
      : { status: "failed", reason: draft.reason };
  },
});

/**
 * Saves the agreed work, linked to the AI draft when the draft step made one (a seller checks the
 * draft's lines and types what was agreed), then sends it to the buyer to sign.
 */
export const agreementStep = (
  id: string,
  seller: string,
  dealKey: string,
  form: AgreementForm,
  draftKey?: string,
): Step =>
  doStep(id, "save the agreement and send it to sign", async (context, refs) => {
    const dealId = needRef(refs, dealKey);
    const draftId = draftKey === undefined ? undefined : refs[draftKey];
    await saveAgreement(
      context,
      seller,
      dealId,
      draftId === undefined ? form : { ...form, draftId },
    );
    await sendForSigning(context, seller, dealId);
    return undefined;
  });

/** Sends a stage's invoice from the seller's own app, exactly as previewed. */
export const invoiceStep = (seller: string, dealKey: string, stage: number): Step =>
  doStep(
    `invoice-${String(stage)}`,
    `send the stage ${String(stage)} invoice`,
    async (context, refs) => {
      await sendInvoice(context, seller, needRef(refs, dealKey), stage);
      return undefined;
    },
  );

/** Waits until the buyer has paid the stage's invoice in the PayPal sandbox. */
export const paidStep = (seller: string, dealKey: string, stage: number, buyer: Person): Step => ({
  id: `paid-${String(stage)}`,
  what: `wait for ${buyer.name} to pay stage ${String(stage)}`,
  run: async (context, refs): Promise<StepResult> => {
    const todo = await paidOrInstruction(
      context,
      seller,
      needRef(refs, dealKey),
      stage,
      buyer.email,
    );
    return todo === undefined ? { status: "done" } : { status: "waiting", instruction: todo };
  },
});

/** Sends a stage's invoice, then waits until the buyer has paid it. */
export const paymentSteps = (seller: string, dealKey: string, stage: number, buyer: Person) => [
  invoiceStep(seller, dealKey, stage),
  paidStep(seller, dealKey, stage, buyer),
];

/** What a story's dispute needs from the person running the seed. */
export interface DisputePlan {
  seller: string;
  dealKey: string;
  /** How the owner opens the dispute as the buyer in the sandbox. */
  open: string;
  /** Whether the seed builds the packet (with the AI summary) for the seller to send. */
  packet: boolean;
  /** What the seller does in PactPal (send the evidence, an offer) before PayPal can decide. */
  decide: string;
  /** Who PayPal's sandbox decides for, once it allows a decision. */
  winner: "seller" | "buyer";
}

/**
 * A dispute's steps (5a–5g): wait until the buyer's dispute is seen, compare the claim with the
 * record, summarise and build the packet; then wait for the seller to send it and PayPal to decide.
 */
export function disputeSteps(plan: DisputePlan): Step[] {
  const { seller, dealKey } = plan;
  const disputeId = (refs: DemoRefs) => needRef(refs, "disputeId");
  const steps: Step[] = [
    {
      id: "dispute-opened",
      what: "wait for the buyer's dispute",
      run: async (context, refs) => {
        const found = await disputeOf(context, seller, needRef(refs, dealKey));
        return found
          ? { status: "done", refs: { disputeId: found.disputeId } }
          : { status: "waiting", instruction: plan.open };
      },
    },
    {
      id: "dispute-compare",
      what: "compare the claim with the record",
      needsAi: true,
      run: async (context, refs) => {
        const job = await compareClaim(context, seller, needRef(refs, dealKey), disputeId(refs));
        return job.ready
          ? { status: "done", refs: { analysisId: job.id } }
          : { status: "failed", reason: job.reason };
      },
    },
  ];
  if (plan.packet) {
    steps.push(
      {
        id: "dispute-summary",
        what: "summarise the dispute",
        needsAi: true,
        run: async (context, refs) => {
          const job = await summarise(context, seller, needRef(refs, dealKey), disputeId(refs));
          return job.ready
            ? { status: "done", refs: { summaryId: job.id } }
            : { status: "failed", reason: job.reason };
        },
      },
      doStep("dispute-packet", "build the evidence packet", async (context, refs) => {
        const packetId = await buildPacket(context, seller, needRef(refs, dealKey), {
          disputeId: disputeId(refs),
          analysisId: needRef(refs, "analysisId"),
          summaryId: needRef(refs, "summaryId"),
        });
        return { packetId };
      }),
    );
  }
  steps.push({
    id: "dispute-decided",
    what: `have PayPal's sandbox decide for the ${plan.winner}`,
    run: async (context, refs) => {
      const found = await disputeOf(context, seller, needRef(refs, dealKey));
      if (found?.outcome) return { status: "done" };
      if (!context.settle) return { status: "waiting", instruction: plan.decide };
      const asked = await context.settle(disputeId(refs), plan.winner);
      switch (asked.kind) {
        case "asked":
          return {
            status: "waiting",
            instruction: `PayPal's sandbox is deciding the case for the ${plan.winner}; run this story again in a few minutes.`,
          };
        case "not-allowed":
          return { status: "waiting", instruction: plan.decide };
        case "failed":
          return { status: "failed", reason: `PayPal's sandbox could not decide: ${asked.reason}` };
      }
    },
  });
  return steps;
}
