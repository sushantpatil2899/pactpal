import { FakeChatClient, testSpec } from "@pactpal/ai/testing";
import type { ChatRequest } from "@pactpal/ai";
import { readLedger } from "@pactpal/db";
import {
  createAwaitingTestDeal,
  createSignedTestDeal,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors, dealTestApp, signedInAs, queuedDrafting } from "./test-app.js";

const db = useMigratedTestDatabase();

interface ReviewView {
  status: string;
  file: { filename: string };
  message: string;
  review: {
    requests: { quote: string; label: string }[];
    reply: string;
    changeLines: string[];
  } | null;
  needsReview: boolean;
  failureReason: string | null;
}
interface View {
  canCheck: boolean;
  reviews: ReviewView[];
}

const MESSAGE = "Thanks for the sketch!\nCan you also make a banner?\nIs the PNG transparent?";

const isRanking = (request: ChatRequest) =>
  request.messages[0]?.content.includes("careful reviewer") === true;

/** A careful review of `MESSAGE`, citing the agreement line the model was shown. */
function review(request: ChatRequest) {
  const user = request.messages[1]?.content ?? "";
  const line = Number(/^(\d+): Delivered: /m.exec(user)?.[1]);
  return {
    requests: [
      { quote: "make a banner", label: "out-of-scope", why: "No banner in the agreement." },
      {
        quote: "Is the PNG transparent?",
        label: "within-scope",
        citations: [{ line, quote: "transparent PNG" }],
        why: "The delivered line says so.",
      },
    ],
    reply:
      "Hi Chris, the PNG is transparent as agreed. A banner is not in our agreement; I can send a change.",
    changeLines: ["A banner"],
  };
}

/** A council member answering with `answer` (a review, or anything else) and ranking in order. */
const member = (name: string, answer: (r: ChatRequest) => unknown = review) =>
  new FakeChatClient(testSpec({ name }), (request) => {
    if (isRanking(request)) {
      const labels = [...(request.messages[1]?.content ?? "").matchAll(/label="(\w+)"/g)];
      return JSON.stringify({ ranking: labels.map((m) => m[1]) });
    }
    return JSON.stringify(answer(request));
  });

async function signedDeal(
  clients: FakeChatClient[] | undefined,
  make: typeof createAwaitingTestDeal | typeof createSignedTestDeal = createSignedTestDeal,
  maxConcurrent = 2,
) {
  const deal = await make(db);
  const run = clients ? queuedDrafting(clients, maxConcurrent) : undefined;
  const env = dealTestApp(db, run?.runtime);
  const seller = await signedInAs(db, deal.seller.id);
  const url = `/api/deals/${deal.dealId}/messages`;
  const send = (text = MESSAGE, who = seller) => env.call("POST", url, who, { text });
  const list = async () => (await env.call("GET", url, seller)).json<View>();
  return {
    ...env,
    ...deal,
    seller,
    url,
    send,
    list,
    settle: run?.settle ?? (() => Promise.resolve()),
  };
}

describe("buyer messages", () => {
  it("are saved as a deal file and reviewed by the council, for the seller only", async () => {
    const models = [member("alpha"), member("beta"), member("gamma")];
    const env = await signedDeal(models);
    const res = await env.send();
    expect(res.statusCode).toBe(202);
    expect(res.json<View>().reviews[0]).toMatchObject({ status: "running", message: MESSAGE });
    const entries = await readLedger(db, env.dealId);
    expect(entries.at(-1)).toMatchObject({
      type: "SOURCE_ADDED",
      payload: { filename: "buyer-message-2026-10-02.txt" },
    });

    await env.settle();
    const view = await env.list();
    expect(view.canCheck).toBe(true);
    expect(view.reviews[0]).toMatchObject({
      status: "ready",
      file: { filename: "buyer-message-2026-10-02.txt" },
      review: {
        changeLines: ["A banner"],
        requests: [{ label: "out-of-scope" }, { label: "within-scope" }],
      },
      failureReason: null,
    });
    expect(JSON.stringify(view)).not.toMatch(/alpha|beta|gamma/);
    // The models read the agreement, the record counted by code and the numbered message.
    const asked = models[0]?.requests[0]?.messages[1]?.content ?? "";
    expect(asked).toContain(
      "<record-abcdef123456>\nSigned version: 1\nStages delivered: none yet\n",
    );
    expect(asked).toContain(
      "<message-abcdef123456>\n1: Thanks for the sketch!\n2: Can you also make a banner?",
    );
    // Nothing about the review is logged; the buyer cannot see it.
    expect(await readLedger(db, env.dealId)).toHaveLength(entries.length);
    const [, buyer = ""] = await buyerVisitors(db, env.dealId, env.buyer.id);
    expect((await env.call("GET", env.url, buyer)).statusCode).toBe(403);
    expect((await env.send(MESSAGE, buyer)).statusCode).toBe(403);
    expect(env.logs.join("\n")).not.toMatch(/banner|Thanks for the sketch/);
  });

  it("fail when no model gives a valid review, keeping the message", async () => {
    const priced = (r: ChatRequest) => ({ ...review(r), reply: "A banner is $60." });
    const env = await signedDeal([member("alpha", priced), member("beta", () => ({ nope: 1 }))]);
    await env.send();
    await env.settle();
    expect((await env.list()).reviews[0]).toMatchObject({
      status: "failed",
      review: null,
      failureReason: "no model produced a valid review",
      message: MESSAGE,
    });
  });

  it("are refused while one is checked", async () => {
    const env = await signedDeal([member("alpha")]);
    await env.send();
    const files = (await readLedger(db, env.dealId)).length;
    const again = await env.send();
    expect(again.statusCode).toBe(409);
    expect(await readLedger(db, env.dealId)).toHaveLength(files);
    expect((await env.send("   ")).statusCode).toBe(400);
    await env.settle();
  });

  it("need a model with a key", async () => {
    const none = await signedDeal(undefined, createAwaitingTestDeal);
    expect((await none.send()).statusCode).toBe(503);
  });

  it("need a signed deal", async () => {
    const env = await signedDeal([member("alpha")], createAwaitingTestDeal);
    expect((await env.send()).statusCode).toBe(409);
    expect((await env.list()).canCheck).toBe(false);
  });

  it("wait for a free place when two councils run", async () => {
    const env = await signedDeal([member("alpha")], createSignedTestDeal, 0);
    expect((await env.send()).statusCode).toBe(429);
  });
});
