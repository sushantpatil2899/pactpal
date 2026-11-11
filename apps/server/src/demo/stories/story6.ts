import { SeedStepError, addBuyer, sign } from "../actions.js";
import { needRef } from "../engine.js";
import { agentFor, approveAgentRequest } from "../story-actions.js";
import {
  agreementStep,
  doStep,
  paidStep,
  peopleStep,
  type Person,
  type Step,
} from "../story-steps.js";

/** Story 6: Maya's AI agent, with Maya's approval (hackathon/demo-plan.md). */
const MAYA: Person = { email: "maya.lin@pact-pal.app", name: "Maya Lin" };
const NORA: Person = { email: "nora.quinn@pact-pal.app", name: "Nora Quinn" };
const DEAL = "deal";

const text = (value: unknown, what: string): string => {
  if (typeof value !== "string") throw new SeedStepError(`the agent's answer had no ${what}`);
  return value;
};

export function story6Steps(): Step[] {
  return [
    peopleStep([MAYA, NORA]),
    doStep(
      "agent-create",
      "the agent lists Maya's deals and drafts Nora's deal",
      async (context) => {
        const agent = await agentFor(context, MAYA.email);
        await agent("list_deals", {});
        const made = await agent("create_deal_from_text", {
          text: context.content("chats/story6-agent-text.txt").toString("utf8"),
          title: "Lighthouse keeper's letters",
        });
        const dealId = text(made.dealId, "deal id");
        await addBuyer(context, MAYA.email, dealId, NORA);
        return { [DEAL]: dealId };
      },
    ),
    agreementStep("agreement", MAYA.email, DEAL, {
      summary: "Ten short in-game letters from the lighthouse keeper for Lanternfall Games.",
      deliverables: [
        "10 letters of about 150 words each, in an old-fashioned voice",
        "Delivered as one document, first five letters first",
      ],
      deliverableKinds: [{ kind: "objective" }, { kind: "process" }],
      exclusions: ["Voice recording", "Translation into other languages"],
      revisionsIncluded: 1,
      dueDate: "2026-12-12",
      milestones: [
        { title: "Deposit and first five letters", amount: "90.00", dueDate: "2026-12-05" },
        { title: "Last five letters", amount: "90.00", dueDate: "2026-12-12" },
      ],
    }),
    doStep("sign", "Nora signs", async (context, refs) => {
      await sign(context, NORA.email, needRef(refs, DEAL), NORA.name);
      return undefined;
    }),
    doStep(
      "agent-invoice",
      "the agent asks to send the deposit invoice; Maya approves",
      async (context, refs) => {
        const dealId = needRef(refs, DEAL);
        const agent = await agentFor(context, MAYA.email);
        const asked = await agent("request_send_invoice", { dealId, stage: 1 });
        const requestId = text(asked.requestId, "request id");
        const code = await approveAgentRequest(context, MAYA.email, requestId);
        await agent("confirm_action", { requestId, code });
        return { requestId };
      },
    ),
    paidStep(MAYA.email, DEAL, 1, NORA),
  ];
}
