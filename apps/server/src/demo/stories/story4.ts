import { addBuyer, createDeal, deliver, sign, upload } from "../actions.js";
import { needRef } from "../engine.js";
import { downloadDelivery, screenshotToChat } from "../story-actions.js";
import {
  agreementStep,
  disputeSteps,
  doStep,
  draftStep,
  paymentSteps,
  peopleStep,
  type Person,
  type Step,
} from "../story-steps.js";

/** Story 4: Jun and Alex, "never received" against a download log (hackathon/demo-plan.md). */
const JUN: Person = { email: "jun.tanaka@pact-pal.app", name: "Jun Tanaka" };
const ALEX: Person = { email: "alex.morgan@pact-pal.app", name: "Alex Morgan" };
const DEAL = "deal";
const SCREENSHOT = "chats/story4-marketplace-thread.png";
const SHEETS = ["jun-budget-planner.xlsx", "jun-invoice-tracker.xlsx", "jun-content-calendar.xlsx"];

export function story4Steps(): Step[] {
  return [
    peopleStep([JUN, ALEX]),
    doStep(
      "create",
      "create the spreadsheet pack deal and add the marketplace screenshot",
      async (context) => {
        const dealId = await createDeal(context, JUN.email, {
          title: "Small business spreadsheet pack",
          category: "digital-products",
        });
        await addBuyer(context, JUN.email, dealId, ALEX);
        const screenshot = await upload(context, JUN.email, dealId, {
          path: SCREENSHOT,
          name: "marketplace-thread.png",
          kind: "source",
        });
        return { [DEAL]: dealId, screenshot };
      },
    ),
    {
      id: "read-screenshot",
      what: "read the marketplace screenshot into a chat",
      needsAi: true,
      run: async (context, refs) => {
        const read = await screenshotToChat(context, JUN.email, needRef(refs, DEAL), {
          fileId: needRef(refs, "screenshot"),
          path: SCREENSHOT,
          name: "marketplace-thread.txt",
        });
        return read.ok
          ? { status: "done", refs: { transcript: read.fileId } }
          : { status: "failed", reason: read.reason };
      },
    },
    draftStep("draft", JUN.email, DEAL, { pastedKey: "transcript" }),
    agreementStep(
      "agreement",
      JUN.email,
      DEAL,
      {
        summary:
          "Three spreadsheet templates for a freelance bookkeeper: budget planner, invoice tracker and content calendar.",
        deliverables: [
          "Budget planner (.xlsx) with monthly totals",
          "Invoice tracker (.xlsx) with paid and overdue status",
          "Content calendar (.xlsx) for 12 months",
          "Delivered as a download in PactPal right after payment",
        ],
        deliverableKinds: [
          { kind: "objective" },
          { kind: "objective" },
          { kind: "objective" },
          { kind: "process" },
        ],
        exclusions: ["Custom changes to the templates", "Google Sheets versions"],
        revisionsIncluded: 0,
        milestones: [{ title: "Spreadsheet pack", amount: "45.00" }],
      },
      "draftId",
    ),
    doStep("sign", "Alex signs", async (context, refs) => {
      await sign(context, ALEX.email, needRef(refs, DEAL), ALEX.name);
      return undefined;
    }),
    ...paymentSteps(JUN.email, DEAL, 1, ALEX),
    doStep("deliver", "deliver the 3 spreadsheets; Alex downloads each", async (context, refs) => {
      const dealId = needRef(refs, DEAL);
      const fileIds: string[] = [];
      for (const sheet of SHEETS) {
        fileIds.push(
          await upload(context, JUN.email, dealId, {
            path: `deliverables/${sheet}`,
            name: sheet.replace("jun-", ""),
            kind: "deliverable",
          }),
        );
      }
      const deliveryId = await deliver(context, JUN.email, dealId, {
        stage: 1,
        fileIds,
        message: "Your three templates. Thanks for buying!",
      });
      await downloadDelivery(context, ALEX.email, dealId, deliveryId, fileIds);
      return undefined;
    }),
    ...disputeSteps({
      seller: JUN.email,
      dealKey: DEAL,
      open: `In the PayPal sandbox, sign in as ${ALEX.email} and open a dispute on the $45 payment: "Item not received". Then run story 4 again.`,
      packet: true,
      decide:
        "In PactPal as Jun: open the dispute, check the packet (the download record is the key exhibit), confirm and send it. Then decide the case for the seller on the sandbox site, and run story 4 again.",
    }),
  ];
}
