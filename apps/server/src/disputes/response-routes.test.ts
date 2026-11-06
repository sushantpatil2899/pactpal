import { readLedger } from "@pactpal/db";
import { useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors } from "../deals/test-app.js";
import { councilDispute, expectSellerOnly, paypalState } from "./test-support.js";

const db = useMigratedTestDatabase();

/** Answer help that describes the four options PayPal allows in these tests. */
const GOOD = {
  message:
    "Thank you for writing. The agreement was signed before the work began. What would help?",
  options: [
    {
      code: "send_message",
      fits: "A message can ask what would resolve the concern.",
      record: [1],
    },
    { code: "make_offer", fits: "An offer is possible while the case is an inquiry.", record: [] },
    { code: "accept_claim", fits: "Accepting would end the case.", record: [] },
    { code: "escalate", fits: "Escalating asks PayPal to decide.", record: [] },
  ],
  offerNote: "We would like to resolve this with a partial refund.",
};

interface ResponsesView {
  canDraft: boolean;
  responses: {
    status: string;
    failureReason: string | null;
    draft: {
      message: string;
      offerNote: string;
      options: {
        code: string;
        facts: string;
        fits: string;
        record: { n: number; text: string }[];
      }[];
    } | null;
  }[];
}

/** A signed, disputed deal whose answer help runs in process with stand-in models. */
async function disputedDeal(answers: object[] = [GOOD, GOOD]) {
  const deal = await councilDispute(db, answers);
  return { ...deal, responses: `${deal.url}/responses` };
}

describe("answer help", () => {
  it("drafts a message and option notes beside code-written facts, logging a fingerprint", async () => {
    const { app, call, token, responses, settle, dealId, clients } = await disputedDeal();
    expect((await call("GET", responses, token)).json<ResponsesView>().canDraft).toBe(false);
    expect((await call("POST", responses, token, {})).statusCode).toBe(409);
    await paypalState(db, dealId, {
      allowedActions: ["escalate", "accept_claim", "send_message", "make_offer", "appeal_x"],
      buyerSays: "This is not the style I wanted.",
    });
    expect((await call("POST", responses, token, {})).statusCode).toBe(202);
    await settle();
    const done = (await call("GET", responses, token)).json<ResponsesView>().responses[0];
    expect(done?.status).toBe("ready");
    expect(done?.draft?.options.map((o) => o.code)).toEqual([
      "send_message",
      "make_offer",
      "accept_claim",
      "escalate",
    ]);
    expect(done?.draft?.options[2]?.facts).toBe(
      "PayPal refunds the buyer 120.00 USD from your PayPal account and closes the case in the buyer's favour. This cannot be undone.",
    );
    expect(done?.draft?.options[0]?.record[0]?.text).toMatch(/^#1 /);
    const asked = clients[0]?.requests[0]?.messages[1]?.content ?? "";
    expect(asked).toContain("2: This is not the style I wanted.");
    expect(asked).toContain("No comparison was made.");
    expect(asked).toContain(
      "make_offer: PayPal shows the buyer your refund offer, up to 120.00 USD.",
    );
    expect(asked).not.toContain("appeal_x");
    const entry = (await readLedger(db, dealId)).at(-1);
    expect(entry).toMatchObject({
      type: "RESPONSE_DRAFTED",
      actor: "system",
      payload: { options: 4 },
    });
    expect(JSON.stringify(entry?.payload)).not.toContain("What would help");
    await app.close();
  });

  it("fails plainly when every draft names an amount, and is for the seller only", async () => {
    const priced = { ...GOOD, message: "I can refund $60." };
    const { app, call, token, responses, settle, dealId, buyer } = await disputedDeal([
      priced,
      priced,
    ]);
    await paypalState(db, dealId, {
      allowedActions: ["escalate", "accept_claim", "send_message", "make_offer"],
    });
    await call("POST", responses, token, {});
    await settle();
    expect((await call("GET", responses, token)).json<ResponsesView>().responses[0]).toMatchObject({
      status: "failed",
      failureReason: "no model produced a valid answer help",
      draft: null,
    });
    await expectSellerOnly(call, responses, token, (await buyerVisitors(db, dealId, buyer.id))[0]);
    await app.close();
  });
});
