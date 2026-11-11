import type { DemoRefs } from "@pactpal/db";
import {
  addBuyer,
  answerDelivery,
  askQuestion,
  chat,
  createDeal,
  dealFromText,
  decline,
  deliver,
  draftAgreement,
  paidOrInstruction,
  saveAgreement,
  sendForSigning,
  sendInvoice,
  sign,
  upload,
  uploadTextAsPdf,
  type AgreementForm,
  type SeedContext,
} from "./actions.js";
import { needRef, type DemoStep } from "./engine.js";
import { peopleStep } from "./story-steps.js";

/** Maya, the showcase seller, and the four studios she writes for (hackathon/demo-plan.md). */
export const MAYA = "maya.lin@pact-pal.app";
const BUYERS = {
  C: { email: "chris.park@pact-pal.app", name: "Chris Park" },
  N: { email: "nora.quinn@pact-pal.app", name: "Nora Quinn" },
  E: { email: "ethan.brooks@pact-pal.app", name: "Ethan Brooks" },
  A: { email: "aisha.khan@pact-pal.app", name: "Aisha Khan" },
} as const;
type Buyer = keyof typeof BUYERS;

/** Where each book deal ends up, as the plan's table says. */
type Target =
  | "completed"
  | "in-progress"
  | "awaiting"
  | "question"
  | "declined"
  | "draft"
  | "ai-draft"
  | "intake";

interface BookDeal {
  n: number;
  title: string;
  buyer: Buyer;
  target: Target;
  /** The agreed work; absent for deals that stay drafts. */
  form?: AgreementForm;
  /** Stages the buyer pays in the demo. */
  pay?: number[];
  /**
   * Files delivered, in order, each with the buyer's answer: "approve", or the changes they ask
   * for; no answer leaves the delivery waiting for them.
   */
  deliveries?: { path: string; stage: number; answer?: string }[];
  /** A few chat messages, "C:" for the buyer and "M:" for Maya. */
  chat?: string[];
}

const one = (title: string, amount: string, dueDate?: string) => [
  { title, amount, ...(dueDate === undefined ? {} : { dueDate }) },
];

const work = (
  summary: string,
  deliverables: string[],
  milestones: AgreementForm["milestones"],
  extra: Partial<AgreementForm> = {},
): AgreementForm => ({
  summary,
  deliverables,
  exclusions: ["Translation into other languages", "Voice recording"],
  revisionsIncluded: 1,
  milestones,
  ...extra,
});

/** The 18 written-work deals of Maya's book (hackathon/demo-plan.md, "Maya's book of deals"). */
export const BOOK: readonly BookDeal[] = [
  {
    n: 1,
    title: "Wren's backstory and personality sheet",
    buyer: "C",
    target: "completed",
    form: work(
      "A one-page backstory and personality sheet for Wren",
      ["Backstory and personality sheet (PDF)"],
      one("Writing", "120.00"),
    ),
    pay: [1],
    deliveries: [{ path: "book/01-wren-backstory.txt", stage: 1, answer: "approve" }],
    chat: ["C:Could you include a signature line for her?", "M:Yes, there's one at the end."],
  },
  {
    n: 2,
    title: "Lanternlight store-page copy",
    buyer: "C",
    target: "completed",
    form: work(
      "Steam store page copy: short and long description",
      ["Short description (300 characters)", "About this game section", "Key features list"],
      one("Copy", "90.00"),
    ),
    pay: [1],
    deliveries: [{ path: "book/02-store-copy.txt", stage: 1, answer: "approve" }],
  },
  {
    n: 3,
    title: "NPC dialogue: the harbour market",
    buyer: "N",
    target: "completed",
    form: work(
      "40 lines of NPC dialogue for the harbour market",
      ["40 dialogue lines for 7 market characters and ambient barks"],
      one("Dialogue", "180.00"),
    ),
    pay: [1],
    deliveries: [{ path: "book/03-npc-dialogue.txt", stage: 1, answer: "approve" }],
    chat: ["N:The fishmonger's lines made our whole team laugh.", "M:Glad to hear it!"],
  },
  {
    n: 4,
    title: "Item descriptions: 30 relics",
    buyer: "E",
    target: "completed",
    form: work(
      "Descriptions for 30 collectible relics",
      ["30 item descriptions, one or two sentences each"],
      one("Descriptions", "150.00"),
    ),
    pay: [1],
    deliveries: [{ path: "book/04-item-descriptions.txt", stage: 1, answer: "approve" }],
  },
  {
    n: 5,
    title: "World-lore bible, part 1",
    buyer: "N",
    target: "in-progress",
    form: work(
      "Part 1 of the world-lore bible: geography, history and factions",
      ["Lore bible part 1, about 8,000 words"],
      [
        { title: "Outline and first half", amount: "300.00" },
        { title: "Second half", amount: "300.00", dueDate: "2026-11-28" },
      ],
    ),
    pay: [1],
    chat: [
      "N:Outline looks great, go ahead with the factions.",
      "M:On it. Second half by 28 November.",
    ],
  },
  {
    n: 6,
    title: "Quest text: the drowned lighthouse",
    buyer: "A",
    target: "in-progress",
    form: work(
      "Quest text for the drowned lighthouse questline",
      ["Quest journal entries and dialogue for 5 quests"],
      one("Quest text", "240.00", "2026-11-25"),
      {
        timeline: [
          {
            kind: "other",
            owner: "buyer",
            text: "Send the quest outline and level map",
            dueDate: "2026-11-06",
          },
          { kind: "delivery", stage: 1, dueDate: "2026-11-25" },
          { kind: "payment", stage: 1 },
        ],
      },
    ),
    chat: [
      "M:Hi Aisha, I'm ready to start once the quest outline arrives.",
      "M:Just checking in on the outline when you have a moment.",
    ],
  },
  {
    n: 7,
    title: "Character voice guide for 4 companions",
    buyer: "A",
    target: "in-progress",
    form: work(
      "A voice guide for the four companion characters",
      ["Voice guide: tone, vocabulary and sample lines for 4 companions"],
      one("Voice guide", "300.00", "2026-11-09"),
      {
        timeline: [
          {
            kind: "delivery",
            stage: 1,
            text: "First draft of the voice guide",
            dueDate: "2026-11-09",
          },
          { kind: "payment", stage: 1 },
        ],
      },
    ),
    chat: [
      "A:How is the voice guide going?",
      "M:Sorry Aisha, I'm a couple of days behind. Draft by Friday.",
    ],
  },
  {
    n: 8,
    title: "Steam page localisation brief",
    buyer: "E",
    target: "in-progress",
    form: work(
      "A brief for the translators of the Steam page",
      ["Localisation brief: tone, names, text limits, questions"],
      one("Brief", "80.00"),
      {
        timeline: [
          { kind: "delivery", stage: 1, text: "Draft brief", dueDate: "2026-11-14" },
          { kind: "review", text: "Ethan reviews the brief", dueDate: "2026-11-20" },
          { kind: "payment", stage: 1 },
        ],
      },
    ),
    deliveries: [{ path: "book/08-localisation-brief.txt", stage: 1 }],
  },
  {
    n: 9,
    title: "Tutorial script and tooltips",
    buyer: "C",
    target: "in-progress",
    form: work(
      "The tutorial's script and tooltips",
      ["Tutorial script for 4 scenes with tooltips"],
      one("Script", "160.00", "2026-11-24"),
    ),
    deliveries: [
      {
        path: "book/09-tutorial-v1.txt",
        stage: 1,
        answer: "Can Wren say less in scene 1? Players skip long lines.",
      },
    ],
  },
  {
    n: 10,
    title: "Art style guide (text)",
    buyer: "N",
    target: "in-progress",
    form: work(
      "A written art style guide for outsourced artists",
      ["Style guide: palette, line, lighting and character proportions"],
      [
        { title: "Deposit", amount: "110.00" },
        { title: "Style guide", amount: "110.00", dueDate: "2026-12-05" },
      ],
    ),
    pay: [1],
  },
  {
    n: 11,
    title: "Patch notes voice and template",
    buyer: "E",
    target: "awaiting",
    form: work(
      "A voice and template for patch notes",
      ["Patch notes template and voice guidelines"],
      one("Template", "60.00"),
    ),
  },
  {
    n: 12,
    title: "Boss encounter barks (60 lines)",
    buyer: "A",
    target: "question",
    form: work(
      "60 combat barks for three boss encounters",
      ["60 bark lines, 20 per boss"],
      one("Barks", "140.00"),
    ),
  },
  {
    n: 13,
    title: "Licence and usage terms sheet for fan art",
    buyer: "C",
    target: "awaiting",
    form: work(
      "A plain-language terms sheet for fan art of Lanternlight",
      ["Fan art terms sheet (1 page)"],
      one("Terms sheet", "70.00"),
    ),
  },
  { n: 14, title: "Kickstarter campaign text", buyer: "E", target: "ai-draft" },
  { n: 15, title: "Codex entries: 12 creatures", buyer: "N", target: "intake" },
  { n: 16, title: "Trailer voice-over script", buyer: "A", target: "draft" },
  {
    n: 17,
    title: "Achievement names and descriptions",
    buyer: "C",
    target: "declined",
    form: work(
      "Names and descriptions for 30 achievements",
      ["30 achievement names with one-line descriptions"],
      one("Achievements", "75.00"),
    ),
  },
  {
    n: 18,
    title: 'Press kit "about the game"',
    buyer: "E",
    target: "completed",
    form: work(
      'The "about the game" page of the press kit',
      ["About-the-game text with key facts and a quote"],
      one("Press kit", "95.00"),
    ),
    pay: [1],
    deliveries: [
      {
        path: "book/18-press-kit-v1.txt",
        stage: 1,
        answer: "Could you add a one-line pitch and a quote from me?",
      },
      { path: "book/18-press-kit-v2.txt", stage: 1, answer: "approve" },
    ],
  },
];

const key = (deal: BookDeal) => `deal${String(deal.n)}`;
const buyerOf = (deal: BookDeal) => BUYERS[deal.buyer];

/** Creates the deal, adds its buyer and posts its chat. */
function createStep(deal: BookDeal): DemoStep<SeedContext> {
  return {
    id: `deal-${String(deal.n)}-create`,
    what: `create "${deal.title}" for ${buyerOf(deal).name}`,
    run: async (context) => {
      if (deal.target === "intake") {
        const text = context.content("chats/book15-order-form.txt").toString("utf8");
        const dealId = await dealFromText(context, MAYA, text, deal.title);
        await addBuyer(context, MAYA, dealId, buyerOf(deal));
        return { status: "done", refs: { [key(deal)]: dealId } };
      }
      const dealId = await createDeal(context, MAYA, {
        title: deal.title,
        category: "writing-and-translation",
      });
      await addBuyer(context, MAYA, dealId, buyerOf(deal));
      for (const line of deal.chat ?? []) {
        await chat(
          context,
          line.startsWith("M:") ? MAYA : buyerOf(deal).email,
          dealId,
          line.slice(2),
        );
      }
      return { status: "done", refs: { [key(deal)]: dealId } };
    },
  };
}

/** Writes the agreement, sends it, and has the buyer sign, decline or ask, as the deal needs. */
function agreementStep(deal: BookDeal, form: AgreementForm): DemoStep<SeedContext> {
  return {
    id: `deal-${String(deal.n)}-agreement`,
    what: `agree "${deal.title}" (${deal.target})`,
    needsAi: deal.target === "question",
    run: async (context, refs) => {
      const dealId = needRef(refs, key(deal));
      const buyer = buyerOf(deal);
      await saveAgreement(context, MAYA, dealId, form);
      await sendForSigning(context, MAYA, dealId);
      if (deal.target === "declined")
        await decline(context, buyer.email, dealId, "Not this month, sorry. Maybe in spring.");
      else if (deal.target === "question") {
        await askQuestion(
          context,
          buyer.email,
          dealId,
          "Are the barks recorded too, or only written?",
        );
      } else if (deal.target !== "awaiting") await sign(context, buyer.email, dealId, buyer.name);
      return { status: "done" };
    },
  };
}

/** The AI draft of a deal made from a pasted email thread (book #14). */
function aiDraftStep(deal: BookDeal): DemoStep<SeedContext> {
  return {
    id: `deal-${String(deal.n)}-ai-draft`,
    what: `AI draft for "${deal.title}" from the pasted thread`,
    needsAi: true,
    run: async (context, refs) => {
      const dealId = needRef(refs, key(deal));
      const fileId = await upload(context, MAYA, dealId, {
        path: "chats/book14-kickstarter.txt",
        name: "email-thread.txt",
        kind: "source",
      });
      const draft = await draftAgreement(context, MAYA, dealId, [fileId]);
      return draft.ready
        ? { status: "done", refs: { [`${key(deal)}Draft`]: draft.draftId } }
        : { status: "failed", reason: draft.reason };
    },
  };
}

/** Sends every invoice the book's deals need, from Maya's own PayPal app. */
const invoicesStep: DemoStep<SeedContext> = {
  id: "invoices",
  what: "send the PayPal invoices the book needs",
  run: async (context, refs) => {
    for (const deal of BOOK) {
      for (const stage of deal.pay ?? [])
        await sendInvoice(context, MAYA, needRef(refs, key(deal)), stage);
    }
    return { status: "done" };
  },
};

/** Waits until the buyers have paid every invoice, listing all that are still unpaid at once. */
const paymentsStep: DemoStep<SeedContext> = {
  id: "payments",
  what: "wait for the buyers to pay in the PayPal sandbox",
  run: async (context, refs) => {
    const unpaid: string[] = [];
    for (const deal of BOOK) {
      for (const stage of deal.pay ?? []) {
        const todo = await paidOrInstruction(
          context,
          MAYA,
          needRef(refs, key(deal)),
          stage,
          buyerOf(deal).email,
        );
        if (todo !== undefined) unpaid.push(`#${String(deal.n)} "${deal.title}": ${todo}`);
      }
    }
    return unpaid.length === 0
      ? { status: "done" }
      : {
          status: "waiting",
          instruction: `${String(unpaid.length)} invoice(s) to pay:\n${unpaid.join("\n")}`,
        };
  },
};

/** Delivers a deal's documents in order and has the buyer answer each, as the plan says. */
function deliveriesStep(deal: BookDeal): DemoStep<SeedContext> {
  return {
    id: `deal-${String(deal.n)}-deliveries`,
    what: `deliver "${deal.title}"`,
    run: async (context, refs: DemoRefs) => {
      const dealId = needRef(refs, key(deal));
      for (const [i, item] of (deal.deliveries ?? []).entries()) {
        const fileId = await uploadTextAsPdf(context, MAYA, dealId, {
          path: item.path,
          name: `${deal.title
            .replace(/[^A-Za-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .toLowerCase()}-v${String(i + 1)}.pdf`,
          kind: "deliverable",
        });
        const deliveryId = await deliver(context, MAYA, dealId, {
          stage: item.stage,
          fileIds: [fileId],
        });
        if (item.answer === undefined) continue;
        await answerDelivery(
          context,
          buyerOf(deal).email,
          dealId,
          deliveryId,
          item.answer === "approve" ? { approve: true } : { changes: item.answer },
        );
      }
      return { status: "done" };
    },
  };
}

/**
 * Maya's book as steps: every deal created and agreed first, then the invoices, one pause for all
 * the payments, then the deliveries and answers.
 */
export function bookSteps(): DemoStep<SeedContext>[] {
  const steps: DemoStep<SeedContext>[] = [
    peopleStep([{ email: MAYA, name: "Maya Lin" }, ...Object.values(BUYERS)]),
    ...BOOK.map(createStep),
  ];
  for (const deal of BOOK) {
    if (deal.form) steps.push(agreementStep(deal, deal.form));
    if (deal.target === "ai-draft") steps.push(aiDraftStep(deal));
  }
  steps.push(invoicesStep, paymentsStep);
  for (const deal of BOOK) if (deal.deliveries) steps.push(deliveriesStep(deal));
  return steps;
}
