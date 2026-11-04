import { describe, expect, it } from "vitest";
import {
  MAX_QUESTIONS_PER_DEAL,
  failDraft,
  startDraft,
  answerQuestion,
  askQuestion,
  forwardInterruptedQuestions,
  forwardQuestion,
  listQuestions,
  readLedger,
  recentModelRecords,
  recordAiAnswer,
  verifyStoredLedger,
} from "./index.js";
import {
  TEST_NOW,
  createAwaitingTestDeal,
  createTestDealWithChat,
  testId,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();
const at = (minutes: number) => new Date(TEST_NOW.getTime() + minutes * 60_000);
const SHA = "d".repeat(64);

const refusal = (reason: string) =>
  expect.objectContaining({ name: "QuestionNotAllowedError", reason }) as unknown;

/** A deal waiting for the buyer's signature, and a way to ask a question about its page. */
async function awaiting() {
  const deal = await createAwaitingTestDeal(db);
  const ask = (n: number, question = "Can I put this on t-shirts?") =>
    askQuestion(
      db,
      {
        id: testId(700 + n),
        dealId: deal.dealId,
        buyerId: deal.buyer.id,
        version: 1,
        documentSha256: SHA,
        question,
        ip: "198.51.100.9",
      },
      at(n),
    );
  return { ...deal, ask };
}

const ANSWER = {
  text: "No. The agreement lists merchandise use as not included.",
  citations: [{ line: 6, quote: "No merchandise use" }],
  model: "qwen-groq",
  promptVersion: 1,
};

describe("buyer questions", () => {
  it("are asked by the buyer and logged with their words", async () => {
    const deal = await awaiting();
    const { question, entry } = await deal.ask(1, "  Can I put this on t-shirts? ");
    expect(question).toMatchObject({
      status: "asked",
      question: "Can I put this on t-shirts?",
      version: 1,
      aiAnswer: null,
    });
    expect(entry).toMatchObject({
      type: "BUYER_QUESTION",
      actor: "buyer",
      ip: "198.51.100.9",
      payload: { questionId: testId(701), version: 1, question: "Can I put this on t-shirts?" },
    });
  });

  it("show a checked automatic answer, logging only its fingerprint, model and lines", async () => {
    const deal = await awaiting();
    await deal.ask(1);
    const { question, entry } = await recordAiAnswer(
      db,
      { dealId: deal.dealId, questionId: testId(701), answer: ANSWER },
      at(2),
    );
    expect(question).toMatchObject({ status: "answered", aiAnswer: ANSWER });
    expect(entry).toMatchObject({
      type: "AI_ANSWER_SHOWN",
      actor: "system",
      payload: { questionId: testId(701), model: "qwen-groq", promptVersion: 1, citedLines: [6] },
    });
    expect(JSON.stringify(entry.payload)).not.toContain("merchandise");
    // The buyer can still ask the seller instead.
    const forwarded = await forwardQuestion(
      db,
      {
        dealId: deal.dealId,
        questionId: testId(701),
        reason: "buyer-asked",
        buyerId: deal.buyer.id,
      },
      at(3),
    );
    expect(forwarded.entry).toMatchObject({ actor: "buyer", payload: { reason: "buyer-asked" } });
    expect(forwarded.question.aiAnswer).toEqual(ANSWER);
  });

  it("go to the seller, who answers once", async () => {
    const deal = await awaiting();
    await deal.ask(1, "Can you also make a banner?");
    const step = { dealId: deal.dealId, questionId: testId(701) };
    const { entry } = await forwardQuestion(db, { ...step, reason: "not-in-agreement" }, at(2));
    expect(entry).toMatchObject({ type: "QUESTION_FORWARDED", actor: "system" });
    await expect(
      answerQuestion(db, { ...step, sellerId: deal.buyer.id, answer: "Yes" }, at(3)),
    ).rejects.toEqual(refusal("not-your-deal"));
    const answered = await answerQuestion(
      db,
      { ...step, sellerId: deal.seller.id, answer: " A banner would be 60 USD extra. " },
      at(3),
    );
    expect(answered.question).toMatchObject({
      status: "seller-answered",
      sellerAnswer: "A banner would be 60 USD extra.",
      forwardReason: "not-in-agreement",
    });
    expect(answered.entry).toMatchObject({
      type: "QUESTION_ANSWERED",
      actor: "seller",
      payload: { answer: "A banner would be 60 USD extra." },
    });
    await expect(
      answerQuestion(db, { ...step, sellerId: deal.seller.id, answer: "Again" }, at(4)),
    ).rejects.toEqual(refusal("wrong-question"));
    expect((await listQuestions(db, deal.dealId)).map((q) => q.status)).toEqual([
      "seller-answered",
    ]);
    expect((await verifyStoredLedger(db, deal.dealId)).valid).toBe(true);
  });

  it("are refused from the seller, while another is answered, and past the limit", async () => {
    const deal = await awaiting();
    await expect(
      askQuestion(
        db,
        {
          id: testId(799),
          dealId: deal.dealId,
          buyerId: deal.seller.id,
          version: 1,
          documentSha256: SHA,
          question: "Hi",
        },
        at(1),
      ),
    ).rejects.toEqual(refusal("not-your-deal"));
    await deal.ask(1);
    await expect(deal.ask(2)).rejects.toEqual(refusal("busy"));
    await forwardQuestion(
      db,
      { dealId: deal.dealId, questionId: testId(701), reason: "no-model" },
      at(2),
    );
    for (let n = 2; n <= MAX_QUESTIONS_PER_DEAL; n++) {
      await deal.ask(n);
      await forwardQuestion(
        db,
        { dealId: deal.dealId, questionId: testId(700 + n), reason: "no-model" },
        at(n),
      );
    }
    await expect(deal.ask(30)).rejects.toEqual(refusal("too-many"));
  });

  it("still being answered at a restart go to the seller", async () => {
    const deal = await awaiting();
    await deal.ask(1);
    expect(await forwardInterruptedQuestions(db, at(5))).toBe(1);
    expect((await listQuestions(db, deal.dealId))[0]).toMatchObject({
      status: "forwarded",
      forwardReason: "no-model",
    });
    expect(await forwardInterruptedQuestions(db, at(6))).toBe(0);
  });

  it("are only asked while the buyer is asked to sign", async () => {
    const deal = await awaiting();
    await db.query("UPDATE deals SET status = 'active' WHERE id = $1", [deal.dealId]);
    await expect(deal.ask(1)).rejects.toEqual(refusal("not-awaiting"));
  });

  it("keep what they recorded: no going back, no edits, no removal", async () => {
    const deal = await awaiting();
    await deal.ask(1);
    await recordAiAnswer(
      db,
      { dealId: deal.dealId, questionId: testId(701), answer: ANSWER },
      at(2),
    );
    await expect(
      recordAiAnswer(db, { dealId: deal.dealId, questionId: testId(701), answer: ANSWER }, at(3)),
    ).rejects.toEqual(refusal("wrong-question"));
    await expect(db.query("UPDATE buyer_questions SET status = 'asked'")).rejects.toThrow(
      /append-only/,
    );
    await expect(db.query("UPDATE buyer_questions SET question = 'Else'")).rejects.toThrow(
      /append-only/,
    );
    await expect(db.query("DELETE FROM buyer_questions")).rejects.toThrow(/append-only/);
    const types = (await readLedger(db, deal.dealId)).map((e) => e.type).slice(-2);
    expect(types).toEqual(["BUYER_QUESTION", "AI_ANSWER_SHOWN"]);
  });
});

describe("recent model records", () => {
  it("read each model's answers from the newest finished council runs", async () => {
    const { seller, dealId, file } = await createTestDealWithChat(db, at(1));
    await startDraft(
      db,
      {
        id: testId(800),
        dealId,
        sellerId: seller.id,
        sourceArtifactId: file.id,
        sourceSha256: file.sha256,
        draftPromptVersion: 2,
        rankPromptVersion: 1,
      },
      at(2),
    );
    await failDraft(
      db,
      {
        draftId: testId(800),
        reason: "no valid draft",
        council: {
          answers: [
            { modelName: "qwen-groq", status: "valid", latencyMs: 900 },
            { modelName: "gemini", status: "call_failed" },
          ],
        },
      },
      at(3),
    );
    expect(await recentModelRecords(db)).toEqual([
      { model: "qwen-groq", ok: true, latencyMs: 900, at: at(3) },
      { model: "gemini", ok: false, at: at(3) },
    ]);
  });
});
