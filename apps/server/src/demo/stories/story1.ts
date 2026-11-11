import {
  addBuyer,
  answerDelivery,
  askQuestion,
  callAs,
  createDeal,
  deliver,
  sign,
  upload,
  type AgreementForm,
  type SeedContext,
} from "../actions.js";
import { needRef } from "../engine.js";
import { chatLines, deliveryCheck, downloadDelivery, postChat } from "../story-actions.js";
import {
  agreementStep,
  chatStep,
  doStep,
  draftStep,
  paymentSteps,
  peopleStep,
  type Person,
  type Step,
} from "../story-steps.js";

/** Story 1: Maya and Chris, a clean deal where nothing goes wrong (hackathon/demo-plan.md). */
const MAYA: Person = { email: "maya.lin@pact-pal.app", name: "Maya Lin" };
const CHRIS: Person = { email: "chris.park@pact-pal.app", name: "Chris Park" };
const PEOPLE = { maya: MAYA.email, chris: CHRIS.email };
const CHAT = "chats/story1-inapp.txt";
const DEAL = "deal";

const agreement = (revisionsIncluded: number): AgreementForm => ({
  summary:
    "A full-body character illustration of Wren, the lantern-keeper, for the Lanternlight store page and trailer.",
  deliverables: [
    "Full-body illustration of Wren holding her lantern, transparent PNG, at least 1200 px tall",
    "A pencil sketch of the pose for Chris to approve before colour",
    "A clean, modern look that matches the game's art",
  ],
  deliverableKinds: [
    { kind: "objective" },
    { kind: "process" },
    { kind: "subjective", approvalStage: 1 },
  ],
  exclusions: [
    "Merchandise use, such as T-shirts (a separate licence)",
    "Animation or extra poses",
  ],
  revisionsIncluded,
  dueDate: "2026-11-27",
  milestones: [
    { title: "Deposit and sketch approval", amount: "120.00", dueDate: "2026-11-14" },
    { title: "Final art", amount: "120.00", dueDate: "2026-11-27" },
  ],
});

/** A sketch or the final art: uploaded, delivered for its stage; its delivery and file ids. */
async function deliverImage(
  context: SeedContext,
  dealId: string,
  image: { path: string; name: string; stage: number; message: string },
) {
  const fileId = await upload(context, MAYA.email, dealId, {
    path: image.path,
    name: image.name,
    kind: "deliverable",
  });
  const deliveryId = await deliver(context, MAYA.email, dealId, {
    stage: image.stage,
    fileIds: [fileId],
    message: image.message,
  });
  return { fileId, deliveryId };
}

export function story1Steps(): Step[] {
  const lines = (from: number, to: number) => (context: SeedContext) =>
    chatLines(context, CHAT, from, to);
  return [
    peopleStep([MAYA, CHRIS]),
    doStep("create", "create Wren's deal and paste the Discord chat", async (context) => {
      const dealId = await createDeal(context, MAYA.email, {
        title: "Wren, the lantern-keeper",
        category: "art-and-design",
      });
      await addBuyer(context, MAYA.email, dealId, CHRIS);
      const discord = await upload(context, MAYA.email, dealId, {
        path: "chats/story1-discord.txt",
        name: "discord-commissions.txt",
        kind: "source",
      });
      return { [DEAL]: dealId, discord };
    }),
    draftStep("draft", MAYA.email, DEAL, { pastedKey: "discord" }),
    agreementStep("agreement-1", MAYA.email, DEAL, agreement(1), "draftId"),
    chatStep("review-chat", DEAL, lines(1, 3), PEOPLE),
    doStep("withdraw", "Maya takes the agreement back to change it", async (context, refs) => {
      await callAs(context, MAYA.email, {
        method: "POST",
        path: `/api/deals/${needRef(refs, DEAL)}/acceptance/withdraw`,
      });
      return undefined;
    }),
    draftStep("update", MAYA.email, DEAL, "update"),
    agreementStep("agreement-2", MAYA.email, DEAL, agreement(2), "updateId"),
    doStep(
      "question",
      "Chris asks about T-shirts on the signing page",
      async (context, refs) => {
        await askQuestion(
          context,
          CHRIS.email,
          needRef(refs, DEAL),
          "Can I print Wren on T-shirts?",
        );
        return undefined;
      },
      true,
    ),
    doStep("sign", "Chris signs", async (context, refs) => {
      await sign(context, CHRIS.email, needRef(refs, DEAL), CHRIS.name);
      return undefined;
    }),
    chatStep("deposit-chat", DEAL, lines(4, 4), PEOPLE),
    ...paymentSteps(MAYA.email, DEAL, 1, CHRIS),
    chatStep("work-chat", DEAL, lines(5, 11), PEOPLE),
    doStep(
      "sketch-1",
      "deliver the first sketch; Chris asks for a new pose",
      async (context, refs) => {
        const dealId = needRef(refs, DEAL);
        const { deliveryId } = await deliverImage(context, dealId, {
          path: "images/maya-sketch-1.png",
          name: "wren-sketch-lantern-low.png",
          stage: 1,
          message: 'The "lantern low" pose.',
        });
        await postChat(context, dealId, lines(12, 12)(context), PEOPLE);
        await answerDelivery(context, CHRIS.email, dealId, deliveryId, {
          changes: "Could she walk forward with the lantern raised high instead?",
        });
        return undefined;
      },
    ),
    chatStep("revision-chat", DEAL, lines(13, 14), PEOPLE),
    doStep("sketch-2", "deliver the revised sketch; Chris approves", async (context, refs) => {
      const dealId = needRef(refs, DEAL);
      const { deliveryId } = await deliverImage(context, dealId, {
        path: "images/maya-sketch-2.png",
        name: "wren-sketch-lantern-raised.png",
        stage: 1,
        message: "Mid-stride, lantern up.",
      });
      await postChat(context, dealId, lines(15, 15)(context), PEOPLE);
      await answerDelivery(context, CHRIS.email, dealId, deliveryId, { approve: true });
      return undefined;
    }),
    chatStep("colour-chat", DEAL, lines(16, 21), PEOPLE),
    doStep(
      "final-check",
      "check the final art before delivering it",
      async (context, refs) => {
        const dealId = needRef(refs, DEAL);
        const finalFile = await upload(context, MAYA.email, dealId, {
          path: "images/maya-final.png",
          name: "wren-final.png",
          kind: "deliverable",
        });
        await deliveryCheck(context, MAYA.email, dealId, {
          stage: 2,
          files: [{ fileId: finalFile, path: "images/maya-final.png" }],
        });
        return { finalFile };
      },
      true,
    ),
    doStep(
      "final",
      "deliver the final art; Chris downloads and approves",
      async (context, refs) => {
        const dealId = needRef(refs, DEAL);
        const finalFile = needRef(refs, "finalFile");
        const deliveryId = await deliver(context, MAYA.email, dealId, {
          stage: 2,
          fileIds: [finalFile],
          message: "Final art: transparent PNG, 3000 px tall.",
        });
        await postChat(context, dealId, lines(22, 22)(context), PEOPLE);
        await downloadDelivery(context, CHRIS.email, dealId, deliveryId, [finalFile]);
        await answerDelivery(context, CHRIS.email, dealId, deliveryId, { approve: true });
        return undefined;
      },
    ),
    chatStep("approved-chat", DEAL, lines(23, 25), PEOPLE),
    ...paymentSteps(MAYA.email, DEAL, 2, CHRIS),
    chatStep("thanks-chat", DEAL, lines(26, 28), PEOPLE),
  ];
}
