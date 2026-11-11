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
import {
  answerChange,
  chatLines,
  checkMessage,
  downloadDelivery,
  postChat,
  proposeChange,
} from "../story-actions.js";
import {
  agreementStep,
  chatStep,
  disputeSteps,
  doStep,
  draftStep,
  paymentSteps,
  peopleStep,
  type Person,
  type Step,
} from "../story-steps.js";

/** Story 2: Daniel and Rosa; the seller did everything right and wins (hackathon/demo-plan.md). */
const DANIEL: Person = { email: "daniel.okafor@pact-pal.app", name: "Daniel Okafor" };
const ROSA: Person = { email: "rosa.alvarez@pact-pal.app", name: "Rosa Alvarez" };
const PEOPLE = { daniel: DANIEL.email, rosa: ROSA.email };
const CHAT = "chats/story2-inapp.txt";
const DEAL = "deal";
const PHOTOS = [
  "bakery-1-hero.jpg",
  "bakery-2-sourdough.jpg",
  "bakery-3-cinnamon-rolls.jpg",
  "bakery-4-counter.jpg",
  "bakery-5-cake.jpg",
];

const lines = (from: number, to: number) => (context: SeedContext) =>
  chatLines(context, CHAT, from, to);

/** A change to the signed agreement, proposed by Daniel and answered by Rosa. */
const changeStep = (
  id: string,
  change: { line: string; stage: string; amount: string; message: string },
  answer: { typedName: string } | { reason: string },
  chatAfter: [number, number],
): Step =>
  doStep(id, `propose "${change.stage}"; Rosa answers`, async (context, refs) => {
    const dealId = needRef(refs, DEAL);
    const proposed = await proposeChange(context, DANIEL.email, dealId, {
      addLines: [{ text: change.line, mark: { kind: "objective" } }],
      addStages: [{ title: change.stage, amount: change.amount }],
      message: change.message,
    });
    await postChat(context, dealId, lines(chatAfter[0], chatAfter[0])(context), PEOPLE);
    await answerChange(context, ROSA.email, dealId, proposed, answer);
    await postChat(context, dealId, lines(chatAfter[0] + 1, chatAfter[1])(context), PEOPLE);
    return undefined;
  });

export function story2Steps(): Step[] {
  return [
    peopleStep([DANIEL, ROSA]),
    doStep(
      "create",
      "create the bakery website deal and paste the WhatsApp chat",
      async (context) => {
        const dealId = await createDeal(context, DANIEL.email, {
          title: "Rosa's Corner Bakery website",
          category: "web-and-software",
        });
        await addBuyer(context, DANIEL.email, dealId, ROSA);
        const whatsapp = await upload(context, DANIEL.email, dealId, {
          path: "chats/story2-whatsapp.txt",
          name: "whatsapp-rosa.txt",
          kind: "source",
        });
        return { [DEAL]: dealId, whatsapp };
      },
    ),
    draftStep("draft", DANIEL.email, DEAL, { pastedKey: "whatsapp" }),
    agreementStep(
      "agreement",
      DANIEL.email,
      DEAL,
      {
        summary:
          "A five-page website for Rosa's Corner Bakery: Home, Menu, About, Visit and an order-request form.",
        deliverables: [
          "Five pages: Home, Menu (with prices), About, Visit, and a contact or order-request form",
          "Every page loads in under 2 seconds on a mid-range phone",
          "Set up on Rosa's hosting and domain with her",
        ],
        deliverableKinds: [{ kind: "objective" }, { kind: "objective" }, { kind: "process" }],
        exclusions: ["Hosting and domain fees (Rosa pays them)", "Writing the menu text"],
        buyerProvides: [
          { text: "The menu with prices", dueDate: "2026-11-10" },
          { text: "Opening hours", dueDate: "2026-11-10" },
          { text: "Photos of the bakery and the baking", dueDate: "2026-11-10" },
        ],
        revisionsIncluded: 2,
        dueDate: "2026-11-28",
        milestones: [
          { title: "Deposit", amount: "500.00", dueDate: "2026-11-05" },
          { title: "Finished site approved", amount: "500.00", dueDate: "2026-11-21" },
          { title: "Launch", amount: "500.00", dueDate: "2026-11-28" },
        ],
      },
      "draftId",
    ),
    doStep("sign", "Rosa signs and adds her menu, hours and photos", async (context, refs) => {
      const dealId = needRef(refs, DEAL);
      await sign(context, ROSA.email, dealId, ROSA.name);
      await upload(context, ROSA.email, dealId, {
        path: "chats/story2-menu.txt",
        name: "menu-and-hours.txt",
        kind: "source",
      });
      for (const photo of PHOTOS) {
        await upload(context, ROSA.email, dealId, {
          path: `images/${photo}`,
          name: photo,
          kind: "source",
        });
      }
      return undefined;
    }),
    ...paymentSteps(DANIEL.email, DEAL, 1, ROSA),
    chatStep("design-chat", DEAL, lines(1, 12), PEOPLE),
    {
      id: "message-check",
      what: "check Rosa's ordering and blog message against the agreement",
      needsAi: true,
      run: async (context, refs) => {
        const text = lines(
          11,
          12,
        )(context)
          .map((line) => line.split("|").slice(1).join("|"))
          .join("\n");
        const check = await checkMessage(context, DANIEL.email, needRef(refs, DEAL), text);
        return check.ready ? { status: "done" } : { status: "failed", reason: check.reason };
      },
    },
    chatStep("quote-chat", DEAL, lines(13, 14), PEOPLE),
    changeStep(
      "change-ordering",
      {
        line: "Online cake ordering: customers pick an item and a pickup day; orders are emailed to the bakery",
        stage: "Online ordering",
        amount: "400.00",
        message: "Online ordering, as you asked in the chat.",
      },
      { typedName: ROSA.name },
      [15, 16],
    ),
    changeStep(
      "change-blog",
      {
        line: "A recipe blog with categories and a post template",
        stage: "Recipe blog",
        amount: "350.00",
        message: "The recipe blog, as a separate change.",
      },
      { reason: "Not needed for now. Maybe next year." },
      [17, 19],
    ),
    chatStep("build-chat", DEAL, lines(20, 27), PEOPLE),
    doStep(
      "deliver-site",
      "deliver the site; Rosa downloads and approves",
      async (context, refs) => {
        const dealId = needRef(refs, DEAL);
        const site = await upload(context, DANIEL.email, dealId, {
          path: "deliverables/rosas-corner-bakery-site.html",
          name: "rosas-corner-bakery-site.html",
          kind: "deliverable",
        });
        const deliveryId = await deliver(context, DANIEL.email, dealId, {
          stage: 2,
          fileIds: [site],
          message:
            "The finished site, with online ordering. Phone test: 1.4 s on a mid-range phone.",
        });
        await postChat(context, dealId, lines(28, 29)(context), PEOPLE);
        await downloadDelivery(context, ROSA.email, dealId, deliveryId, [site]);
        await answerDelivery(context, ROSA.email, dealId, deliveryId, { approve: true });
        await postChat(context, dealId, lines(30, 33)(context), PEOPLE);
        return undefined;
      },
    ),
    ...paymentSteps(DANIEL.email, DEAL, 2, ROSA),
    chatStep("blog-chat", DEAL, lines(34, 40), PEOPLE),
    ...disputeSteps({
      seller: DANIEL.email,
      dealKey: DEAL,
      open: `In the PayPal sandbox, sign in as ${ROSA.email} and open a dispute on the stage 2 payment ($500): "Item not as described", saying "The blog was never built." Then run story 2 again.`,
      packet: true,
      decide:
        "In PactPal as Daniel: open the dispute, untick one exhibit, confirm and send the evidence. Then decide the case for the seller on the sandbox site, and run story 2 again.",
    }),
  ];
}
