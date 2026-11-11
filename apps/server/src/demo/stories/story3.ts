import {
  addBuyer,
  answerDelivery,
  createDeal,
  deliver,
  sign,
  upload,
  type SeedContext,
} from "../actions.js";
import { needRef } from "../engine.js";
import { chatLines, postChat } from "../story-actions.js";
import {
  agreementStep,
  chatStep,
  disputeSteps,
  doStep,
  paymentSteps,
  type Person,
  type Step,
} from "../story-steps.js";

/** Story 3: Priya and Tom; the seller got it wrong and PactPal says so (hackathon/demo-plan.md). */
const PRIYA: Person = { email: "priya.raman@pact-pal.app", name: "Priya Raman" };
const TOM: Person = { email: "tom.becker.allowappeal@pact-pal.app", name: "Tom Becker" };
const PEOPLE = { priya: PRIYA.email, tom: TOM.email };
const CHAT = "chats/story3-inapp.txt";
const DEAL = "deal";
const RAW = [
  "candle-1-jar.jpg",
  "candle-2-tins.jpg",
  "candle-3-pillar.jpg",
  "candle-4-gift-box.jpg",
  "candle-5-lavender.jpg",
  "candle-6-ceramic.jpg",
];
/** What Priya delivers late: two finished, two still with shadows, two missing. */
const DELIVERED = [
  "priya-candle-1-jar.jpg",
  "priya-candle-2-tins.jpg",
  "priya-candle-3-pillar.jpg",
  "priya-candle-5-lavender.jpg",
];

const lines = (from: number, to: number) => (context: SeedContext) =>
  chatLines(context, CHAT, from, to);

export function story3Steps(): Step[] {
  return [
    doStep(
      "create",
      "create the candle photo deal; Tom and Priya talk it through",
      async (context) => {
        const dealId = await createDeal(context, PRIYA.email, {
          title: "Ember & Wick: 6 product photos",
          category: "video-and-photo",
        });
        await addBuyer(context, PRIYA.email, dealId, TOM);
        await postChat(context, dealId, lines(1, 12)(context), PEOPLE);
        return { [DEAL]: dealId };
      },
    ),
    agreementStep("agreement", PRIYA.email, DEAL, {
      summary: "Retouching 6 candle product photos for the Ember & Wick shop.",
      deliverables: [
        "6 retouched product photos on a clean white background, table and shadows removed",
        "Colour-corrected JPEGs, 2000 px on the long side, ready for the shop",
      ],
      deliverableKinds: [{ kind: "objective" }, { kind: "objective" }],
      exclusions: ["New photography", "Lifestyle or background scenes"],
      buyerProvides: [{ text: "The 6 raw product photos", dueDate: "2026-11-02" }],
      revisionsIncluded: 2,
      dueDate: "2026-11-07",
      milestones: [{ title: "Six retouched photos", amount: "180.00", dueDate: "2026-11-07" }],
    }),
    doStep("sign", "Tom signs", async (context, refs) => {
      await sign(context, TOM.email, needRef(refs, DEAL), TOM.name);
      return undefined;
    }),
    ...paymentSteps(PRIYA.email, DEAL, 1, TOM),
    doStep("raw-photos", "Tom adds his 6 raw photos", async (context, refs) => {
      const dealId = needRef(refs, DEAL);
      await postChat(context, dealId, lines(13, 13)(context), PEOPLE);
      for (const photo of RAW) {
        await upload(context, TOM.email, dealId, {
          path: `images/${photo}`,
          name: photo,
          kind: "source",
        });
      }
      await postChat(context, dealId, lines(14, 15)(context), PEOPLE);
      return undefined;
    }),
    chatStep("late-chat", DEAL, lines(16, 22), PEOPLE),
    doStep(
      "late-delivery",
      "Priya delivers 4 of 6, late; Tom asks for changes",
      async (context, refs) => {
        const dealId = needRef(refs, DEAL);
        const fileIds: string[] = [];
        for (const photo of DELIVERED) {
          fileIds.push(
            await upload(context, PRIYA.email, dealId, {
              path: `deliverables/${photo}`,
              name: photo.replace("priya-", ""),
              kind: "deliverable",
            }),
          );
        }
        const deliveryId = await deliver(context, PRIYA.email, dealId, { stage: 1, fileIds });
        await postChat(context, dealId, lines(23, 24)(context), PEOPLE);
        await answerDelivery(context, TOM.email, dealId, deliveryId, {
          changes:
            "Only four of the six photos, and the pillar and lavender ones still show the table shadows. Please finish all six on clean white, as agreed.",
        });
        return undefined;
      },
    ),
    chatStep("quiet-chat", DEAL, lines(25, 33), PEOPLE),
    ...disputeSteps({
      seller: PRIYA.email,
      dealKey: DEAL,
      open: `In the PayPal sandbox, sign in as ${TOM.email} and open a dispute on the $180 payment: "Item not as described", saying "Only 4 of the 6 photos, late, two still with shadows." Then run story 3 again.`,
      packet: false,
      decide:
        "In PactPal as Priya: read the comparison, then offer a partial refund ($90) from the dispute page. In the sandbox, decline the offer as Tom, then decide the case for the buyer. Run story 3 again after; the appeal check then shows there is nothing new to send.",
    }),
  ];
}
