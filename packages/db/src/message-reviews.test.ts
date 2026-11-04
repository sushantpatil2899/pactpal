import { describe, expect, it } from "vitest";
import {
  MAX_REVIEWS_PER_DEAL,
  failMessageReview,
  failRunningMessageReviews,
  finishMessageReview,
  listMessageReviews,
  readLedger,
  recentModelRecords,
  startMessageReview,
} from "./index.js";
import {
  addTestFile,
  createAwaitingTestDeal,
  createSignedTestDeal,
  minutesAfterTestNow,
  refusalMatching,
  testId,
  useMigratedTestDatabase,
  type TestDealMaker,
} from "./testing.js";

const db = useMigratedTestDatabase();
const at = minutesAfterTestNow;

const refusal = (reason: string) => refusalMatching("ReviewNotAllowedError", reason);

/** A deal with the buyer's message saved as a source file (test id 600), and a way to review it. */
async function withMessage(make: TestDealMaker = createSignedTestDeal) {
  const deal = await make(db);
  const file = await addTestFile(
    db,
    deal,
    {
      id: testId(600),
      kind: "source",
      filename: "buyer-message-2026-10-02.txt",
      bytes: new TextEncoder().encode("Could we add a blog?"),
    },
    at(1),
  );
  const start = (n: number, sellerId = deal.seller.id) =>
    startMessageReview(
      db,
      {
        id: testId(700 + n),
        dealId: deal.dealId,
        sellerId,
        version: 1,
        sourceArtifactId: file.id,
        sourceSha256: file.sha256,
        promptVersion: 1,
        rankPromptVersion: 1,
      },
      at(2 + n),
    );
  return { ...deal, file, start };
}

const COUNCIL = { answers: [{ modelName: "qwen-groq", status: "valid", latencyMs: 800 }] };

describe("message reviews", () => {
  it("run, then finish once with the winner, never logged", async () => {
    const deal = await withMessage();
    const logged = (await readLedger(db, deal.dealId)).length;
    expect(await deal.start(1)).toMatchObject({ status: "running", version: 1 });
    await expect(deal.start(2)).rejects.toEqual(refusal("already-running"));
    const done = await finishMessageReview(
      db,
      { reviewId: testId(701), review: { requests: [] }, council: COUNCIL },
      at(5),
    );
    expect(done).toMatchObject({ status: "ready", review: { requests: [] }, finishedAt: at(5) });
    expect(
      await finishMessageReview(db, { reviewId: testId(701), review: {}, council: {} }, at(6)),
    ).toBeUndefined();
    expect(
      await failMessageReview(db, { reviewId: testId(701), reason: "x" }, at(6)),
    ).toBeUndefined();
    expect(await readLedger(db, deal.dealId)).toHaveLength(logged);
    // Its council counts when choosing models.
    expect(await recentModelRecords(db)).toContainEqual({
      model: "qwen-groq",
      ok: true,
      latencyMs: 800,
      at: at(5),
    });
  });

  it("fail with a reason, and running ones fail at a restart", async () => {
    const deal = await withMessage();
    await deal.start(1);
    expect(
      await failMessageReview(
        db,
        { reviewId: testId(701), reason: "no valid review", council: COUNCIL },
        at(4),
      ),
    ).toMatchObject({ status: "failed", failureReason: "no valid review" });
    await deal.start(2);
    expect(await failRunningMessageReviews(db, "the server restarted", at(5))).toBe(1);
    expect((await listMessageReviews(db, deal.dealId)).map((r) => [r.id, r.status])).toEqual([
      [testId(702), "failed"],
      [testId(701), "failed"],
    ]);
  });

  it("are refused from the buyer, before signing, and past the limit", async () => {
    const deal = await withMessage();
    await expect(deal.start(1, deal.buyer.id)).rejects.toEqual(refusal("not-your-deal"));
    for (let n = 1; n <= MAX_REVIEWS_PER_DEAL; n++) {
      await deal.start(n);
      await failMessageReview(db, { reviewId: testId(700 + n), reason: "x" }, at(n));
    }
    await expect(deal.start(40)).rejects.toEqual(refusal("too-many"));
  });

  it("need a signed deal", async () => {
    const deal = await withMessage(createAwaitingTestDeal);
    await expect(deal.start(1)).rejects.toEqual(refusal("not-signed"));
  });

  it("keep what they recorded", async () => {
    const deal = await withMessage();
    await deal.start(1);
    await failMessageReview(db, { reviewId: testId(701), reason: "x" }, at(4));
    await expect(db.query("UPDATE message_reviews SET status = 'ready'")).rejects.toThrow(
      /append-only/,
    );
    await expect(db.query("DELETE FROM message_reviews")).rejects.toThrow(/append-only/);
    await expect(db.query("TRUNCATE message_reviews")).rejects.toThrow(/append-only/);
  });
});
