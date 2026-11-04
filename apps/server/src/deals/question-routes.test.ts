import { FakeChatClient, testSpec } from "@pactpal/ai/testing";
import type { ChatOutcome, ChatRequest } from "@pactpal/ai";
import {
  MAX_QUESTIONS_PER_DEAL,
  askQuestion,
  forwardQuestion,
  readLedger,
  redeemDealLink,
  verifyStoredLedger,
} from "@pactpal/db";
import {
  createAwaitingTestDeal,
  createSignedTestDeal,
  testId,
  useMigratedTestDatabase,
  TEST_NOW,
} from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors, dealTestApp, signedInAs, testDrafting } from "./test-app.js";

const db = useMigratedTestDatabase();

interface QuestionView {
  id: string;
  status: string;
  question: string;
  answer: { text: string; citations: { line: number; quote: string }[] } | null;
  forwardReason: string | null;
  sellerAnswer: string | null;
}
interface View {
  canAsk: boolean;
  questions: QuestionView[];
  buyerEmail?: string;
}

/** The number of the agreement line starting with `start`, as the model was shown it. */
const lineOf = (request: ChatRequest, start: string) =>
  Number(new RegExp(`^(\\d+): ${start}`, "m").exec(request.messages[1]?.content ?? "")?.[1]);

/** A reply quoting the delivered line, as a model that follows the prompt would. */
const quoting = (request: ChatRequest, quote = "transparent PNG") =>
  JSON.stringify({
    answerable: true,
    answer: "Yes, a transparent PNG is delivered.",
    citations: [{ line: lineOf(request, "Delivered"), quote }],
  });

const NOT_ANSWERABLE = JSON.stringify({ answerable: false });
const FAILED: ChatOutcome = {
  ok: false,
  model: "x",
  kind: "rate_limited",
  message: "x: rate limited",
  status: 429,
};

/** A stand-in model answering from a function of the request. */
const model = (name: string, answer: (request: ChatRequest) => string | ChatOutcome) =>
  new FakeChatClient(testSpec({ name }), answer);

/** A deal waiting for the buyer's signature, the app with these models, and both sides. */
async function awaitingDeal(clients: FakeChatClient[] | undefined, emailOff = false) {
  const deal = await createAwaitingTestDeal(db);
  const drafting = testDrafting(clients);
  const env = dealTestApp(db, drafting, { trustProxyHops: 1, emailOff });
  const seller = await signedInAs(db, deal.seller.id);
  const [, buyer = ""] = await buyerVisitors(db, deal.dealId, deal.buyer.id);
  const base = `/api/deals/${deal.dealId}/questions`;
  const sha = (await env.call("GET", `/api/deals/${deal.dealId}/acceptance`, buyer)).json<{
    documentSha256: string;
  }>().documentSha256;
  const list = async (who: string) => (await env.call("GET", base, who)).json<View>();
  const ask = (question: string, who = buyer, documentSha256 = sha) =>
    env.call("POST", base, who, { question, documentSha256 }, { "x-forwarded-for": "203.0.113.7" });
  return { ...env, dealId: deal.dealId, buyerId: deal.buyer.id, seller, buyer, base, list, ask };
}

describe("buyer questions", () => {
  it("are answered from the agreement when every quote is on its line", async () => {
    const qwen = model("qwen-groq", (request) => quoting(request));
    const env = await awaitingDeal([qwen]);
    const res = await env.ask("Is the background transparent?");
    expect(res.statusCode).toBe(200);
    const [question] = res.json<View>().questions;
    expect(question).toMatchObject({
      status: "answered",
      question: "Is the background transparent?",
      answer: { text: "Yes, a transparent PNG is delivered." },
      forwardReason: null,
    });
    expect(JSON.stringify(question)).not.toContain("qwen");
    expect(qwen.requests[0]).toMatchObject({ temperature: 0, reply: "json" });
    expect(qwen.requests[0]?.messages[1]?.content).toContain(
      "<question-abcdef123456>\nIs the background transparent?\n</question-abcdef123456>",
    );
    // The seller sees it too; the buyer can still ask the seller instead.
    expect((await env.list(env.seller)).questions[0]?.status).toBe("answered");
    const forwarded = await env.call(
      "POST",
      `${env.base}/${question?.id ?? ""}/forward`,
      env.buyer,
    );
    expect(forwarded.json<View>().questions[0]).toMatchObject({
      status: "forwarded",
      forwardReason: "buyer-asked",
      answer: { text: "Yes, a transparent PNG is delivered." },
    });
    const entries = await readLedger(db, env.dealId);
    expect(entries.map((e) => e.type).slice(-3)).toEqual([
      "BUYER_QUESTION",
      "AI_ANSWER_SHOWN",
      "QUESTION_FORWARDED",
    ]);
    expect(entries.at(-3)).toMatchObject({ ip: "203.0.113.7" });
    expect(entries.at(-2)?.payload).toMatchObject({ model: "qwen-groq", promptVersion: 1 });
    expect((await verifyStoredLedger(db, env.dealId)).valid).toBe(true);
    // The question's words stay out of the server's own logs.
    expect(env.logs.join("\n")).not.toContain("background transparent");
  });

  it("go to the seller when the agreement does not answer them, and the seller answers", async () => {
    const env = await awaitingDeal([model("qwen-groq", () => NOT_ANSWERABLE)]);
    const [question] = (await env.ask("Can you also make a banner?")).json<View>().questions;
    expect(question).toMatchObject({ status: "forwarded", forwardReason: "not-in-agreement" });
    const url = `${env.base}/${question?.id ?? ""}/answer`;
    expect((await env.call("POST", url, env.buyer, { answer: "Yes" })).statusCode).toBe(403);
    const answered = await env.call("POST", url, env.seller, { answer: "Yes, for 60 USD more." });
    expect(answered.json<View>().questions[0]).toMatchObject({
      status: "seller-answered",
      sellerAnswer: "Yes, for 60 USD more.",
    });
    const again = await env.call("POST", url, env.seller, { answer: "Again" });
    expect(again.statusCode).toBe(409);
    expect(env.logs.join("\n")).not.toContain("60 USD");
  });

  it("try the next model when a quote is not on its line, then go to the seller", async () => {
    const first = model("qwen-groq", (request) => quoting(request, "a banner"));
    const second = model("mistral", (request) => quoting(request, "watercolour"));
    const env = await awaitingDeal([first, second]);
    const [question] = (await env.ask("Is it a PNG?")).json<View>().questions;
    expect(question).toMatchObject({ status: "forwarded", forwardReason: "quote-not-found" });
    expect([first.requests.length, second.requests.length]).toEqual([1, 1]);
  });

  it("are answered by the second model when the first fails, and it is tried first next", async () => {
    const first = model("qwen-groq", () => FAILED);
    const second = model("mistral", (request) => quoting(request));
    const env = await awaitingDeal([first, second]);
    const [question] = (await env.ask("Is it a PNG?")).json<View>().questions;
    expect(question?.status).toBe("answered");
    expect((await readLedger(db, env.dealId)).at(-1)?.payload).toMatchObject({ model: "mistral" });
    // The failure is remembered: the next question goes to the model that worked.
    await env.ask("Is it transparent?");
    expect([first.requests.length, second.requests.length]).toEqual([1, 2]);
  });

  it.each([
    [
      "no model can answer",
      () => [model("qwen-groq", () => "not json"), model("mistral", () => FAILED)],
    ],
    [
      "a model throws",
      () => [
        model("qwen-groq", () => {
          throw new Error("socket closed");
        }),
      ],
    ],
    ["no model has a key", () => undefined],
  ])("go to the seller when %s", async (_, clients: () => FakeChatClient[] | undefined) => {
    const env = await awaitingDeal(clients());
    const [question] = (await env.ask("Is it a PNG?")).json<View>().questions;
    expect(question).toMatchObject({ status: "forwarded", forwardReason: "no-model" });
  });

  it("are asked only by the buyer, about the terms on the page, while signing is awaited", async () => {
    const env = await awaitingDeal([model("qwen-groq", () => NOT_ANSWERABLE)]);
    expect((await env.list(env.buyer)).canAsk).toBe(true);
    expect((await env.list(env.seller)).canAsk).toBe(false);
    expect((await env.ask("Hi", env.seller)).statusCode).toBe(403);
    const stale = await env.ask("Hi", env.buyer, "0".repeat(64));
    expect(stale.statusCode).toBe(409);
    expect(stale.json()).toEqual({ error: "the terms changed; reload the page" });
    expect((await env.ask("   ")).statusCode).toBe(400);
    expect((await env.call("GET", env.base, undefined)).statusCode).toBe(401);
    const missing = await env.call("POST", `${env.base}/${testId(999)}/forward`, env.buyer);
    expect(missing.statusCode).toBe(404);
  });

  it("are not taken once the buyer has signed", async () => {
    const signed = await createSignedTestDeal(db);
    const { call } = dealTestApp(db);
    const [, buyer = ""] = await buyerVisitors(db, signed.dealId, signed.buyer.id);
    const late = await call("POST", `/api/deals/${signed.dealId}/questions`, buyer, {
      question: "Hi",
      documentSha256: "0".repeat(64),
    });
    expect(late.statusCode).toBe(409);
    expect((await call("GET", `/api/deals/${signed.dealId}/questions`, buyer)).json()).toEqual({
      canAsk: false,
      questions: [],
    });
  });

  it(`stop at ${String(MAX_QUESTIONS_PER_DEAL)} per deal`, async () => {
    const env = await awaitingDeal([model("qwen-groq", () => NOT_ANSWERABLE)]);
    for (let n = 1; n <= MAX_QUESTIONS_PER_DEAL; n++) {
      const step = { dealId: env.dealId, questionId: testId(800 + n) };
      await askQuestion(
        db,
        {
          ...step,
          id: step.questionId,
          buyerId: env.buyerId,
          version: 1,
          documentSha256: "d".repeat(64),
          question: `Q${String(n)}`,
        },
        TEST_NOW,
      );
      await forwardQuestion(db, { ...step, reason: "no-model" }, TEST_NOW);
    }
    expect((await env.list(env.buyer)).canAsk).toBe(false);
    const res = await env.ask("One more?");
    expect(res.statusCode).toBe(429);
    expect(res.json()).toEqual({ error: "this deal already has 20 questions" });
  });
});

describe("question emails", () => {
  /** A model that answers questions about the PNG from the agreement, and no others. */
  const pngOnly = () =>
    model("qwen-groq", (request) =>
      request.messages[1]?.content.includes("PNG?") === true ? quoting(request) : NOT_ANSWERABLE,
    );

  it("tell the seller of each question sent to them, and the buyer of the answer", async () => {
    const env = await awaitingDeal([pngOnly()]);
    const kinds = () => env.sent.map((m) => `${m.kind} ${m.to}`);
    const [shown] = (await env.ask("Is it a PNG?")).json<View>().questions;
    expect(shown?.status).toBe("answered");
    expect(env.sent).toEqual([]);

    await env.call("POST", `${env.base}/${shown?.id ?? ""}/forward`, env.buyer);
    const [banner] = (await env.ask("Can you also make a banner?")).json<View>().questions;
    expect(kinds()).toEqual(["question-asked maya@example.com", "question-asked maya@example.com"]);
    expect(env.sent[0]).toMatchObject({ idempotencyKey: `question-asked:${shown?.id ?? ""}` });
    expect(env.sent[0]?.text).toContain('"Is it a PNG?"');
    expect(env.sent[0]?.text).toContain("and the buyer asked for your answer.");
    expect(env.sent[0]?.text).not.toContain("transparent PNG is delivered");
    expect(env.sent[1]?.text).toContain("The agreement does not answer it, so it was sent to you.");

    const url = `${env.base}/${banner?.id ?? ""}/answer`;
    const answered = await env.call("POST", url, env.seller, { answer: "Yes, 60 USD more." });
    expect(answered.json<View>().buyerEmail).toBe("sent");
    const mail = env.sent[2];
    expect(mail).toMatchObject({
      kind: "question-answered",
      to: "chris@example.com",
      subject: 'Answer from Maya Seller: "Logo design"',
    });
    expect(mail?.text).toContain('Their answer: "Yes, 60 USD more."');
    expect(mail?.idempotencyKey).toMatch(
      new RegExp(`^question-answered:${banner?.id ?? ""}:[0-9a-f]{16}$`),
    );
    // The emailed link opens this deal for the buyer.
    const token = /\/link#t=([\w-]{43})/.exec(mail?.text ?? "")?.[1] ?? "";
    const redeemed = await redeemDealLink(db, token, TEST_NOW);
    expect(redeemed).toMatchObject({ ok: true, dealId: env.dealId, userId: env.buyerId });
    expect(env.sent).toHaveLength(3);
    expect(env.logs.join("\n")).not.toMatch(/banner|60 USD|chris@example/);
  });

  it("keep the answer when the buyer's email fails, and say so", async () => {
    const env = await awaitingDeal([pngOnly()]);
    env.failEmailTo.add("chris@example.com");
    const [question] = (await env.ask("Can you also make a banner?")).json<View>().questions;
    const url = `${env.base}/${question?.id ?? ""}/answer`;
    const answered = (await env.call("POST", url, env.seller, { answer: "No." })).json<View>();
    expect(answered.buyerEmail).toBe("failed");
    expect(answered.questions[0]?.status).toBe("seller-answered");
  });

  it("are not sent while email is off", async () => {
    const env = await awaitingDeal([pngOnly()], true);
    const [question] = (await env.ask("Can you also make a banner?")).json<View>().questions;
    expect(question?.status).toBe("forwarded");
    const url = `${env.base}/${question?.id ?? ""}/answer`;
    const answered = (await env.call("POST", url, env.seller, { answer: "No." })).json<View>();
    expect(answered.buyerEmail).toBe("off");
  });
});
