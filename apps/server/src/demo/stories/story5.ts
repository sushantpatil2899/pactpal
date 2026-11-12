import {
  addBuyer,
  dealFromText,
  saveAgreement,
  sendForSigning,
  sign,
  updateStep,
  upload,
} from "../actions.js";
import { needRef } from "../engine.js";
import { listingFor } from "../story-actions.js";
import {
  disputeSteps,
  doStep,
  paymentSteps,
  peopleStep,
  type Person,
  type Step,
} from "../story-steps.js";

/** Story 5: Lena and Sam, physical goods and the listing as evidence (hackathon/demo-plan.md). */
const LENA: Person = { email: "lena.fischer@pact-pal.app", name: "Lena Fischer" };
const SAM: Person = { email: "sam.patel@pact-pal.app", name: "Sam Patel" };
const DEAL = "deal";
/** The camera's product page, chosen before the run (a page Channel3 knows). */
export const LISTING_URL_FILE = "chats/story5-listing-url.txt";

export function story5Steps(): Step[] {
  return [
    peopleStep([LENA, SAM]),
    doStep("create", "make the camera deal from Lena's order form", async (context) => {
      const text = context.content("chats/story5-order-form.txt").toString("utf8");
      const dealId = await dealFromText(
        context,
        LENA.email,
        text,
        "Pentax K1000 film camera",
        "handmade-goods",
      );
      await addBuyer(context, LENA.email, dealId, SAM);
      await upload(context, LENA.email, dealId, {
        path: "images/camera-1-listing.jpg",
        name: "camera-listing.jpg",
        kind: "source",
      });
      return { [DEAL]: dealId };
    }),
    doStep(
      "agreement",
      "add the product page with Channel3 and send the agreement",
      async (context, refs) => {
        const dealId = needRef(refs, DEAL);
        const url = context.content(LISTING_URL_FILE).toString("utf8").trim();
        const listing = await listingFor(context, LENA.email, dealId, url);
        await upload(context, LENA.email, dealId, {
          path: "images/camera-2-rear-haze.jpg",
          name: "rear-element-haze.jpg",
          kind: "source",
        });
        await saveAgreement(context, LENA.email, dealId, {
          summary:
            "A Pentax K1000 35mm SLR (1970s) with its Pentax-A 50mm f/2 lens, sold as listed.",
          deliverables: [
            "The Pentax K1000 and Pentax-A 50mm f/2 lens as listed: fully working, light meter works",
            "Slight haze on the rear lens element, as shown in the photos; sold as is",
            "Sold for $185, below the listed price of $299.99, as is because of the haze on the rear lens element",
            "Shipped tracked within 3 days of payment, well packed",
          ],
          deliverableKinds: [
            { kind: "objective" },
            { kind: "objective" },
            { kind: "objective" },
            { kind: "process" },
          ],
          exclusions: [
            "Returns for the rear-element haze described in the listing",
            "Film and batteries",
          ],
          milestones: [{ title: "Camera with tracked shipping", amount: "185.00" }],
          timeline: [
            { kind: "payment", stage: 1 },
            {
              kind: "other",
              owner: "seller",
              text: "Ship the camera with a tracking number",
              dueDate: "2026-11-20",
            },
            { kind: "other", owner: "buyer", text: "Receive the camera", dueDate: "2026-11-27" },
          ],
          listing,
        });
        await sendForSigning(context, LENA.email, dealId);
        return undefined;
      },
    ),
    doStep("sign", "Sam signs", async (context, refs) => {
      await sign(context, SAM.email, needRef(refs, DEAL), SAM.name);
      return undefined;
    }),
    ...paymentSteps(LENA.email, DEAL, 1, SAM),
    doStep("ship", "Lena ships with a tracking number; Sam receives it", async (context, refs) => {
      const dealId = needRef(refs, DEAL);
      const packed = await upload(context, LENA.email, dealId, {
        path: "images/camera-3-packed.jpg",
        name: "packed-for-shipping.jpg",
        kind: "source",
      });
      await updateStep(context, LENA.email, dealId, 2, {
        status: "done",
        note: "Shipped tracked: 9400 1118 9922 3344 5566 77",
        fileIds: [packed],
      });
      await updateStep(context, SAM.email, dealId, 3, { status: "done", note: "Arrived today." });
      return undefined;
    }),
    ...disputeSteps({
      seller: LENA.email,
      dealKey: DEAL,
      open: `In the PayPal sandbox, sign in as ${SAM.email} and open a dispute on the $185 payment: "Item not as described", saying "There is haze on the lens." Then run story 5 again.`,
      packet: true,
      decide:
        "In PactPal as Lena: open the dispute, escalate it, check the packet (the signed agreement quotes the haze), confirm and send it. Then run story 5 again, and the seed asks PayPal's sandbox to decide.",
      winner: "seller",
    }),
  ];
}
