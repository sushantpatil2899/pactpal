import { describe, expect, it } from "vitest";
import {
  AnalysisNotAllowedError,
  MAX_ANALYSES_PER_DISPUTE,
  failClaimAnalysis,
  finishClaimAnalysis,
  getClaimAnalysis,
  listClaimAnalyses,
  readLedger,
  recordDispute,
  startClaimAnalysis,
  verifyStoredLedger,
  type StartClaimAnalysis,
} from "./index.js";
import {
  createPaidTestDeal,
  minutesAfterTestNow,
  testId,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();
const at = minutesAfterTestNow;
const refusal = (reason: string) => new AnalysisNotAllowedError(reason as never);

/** A paid deal with dispute PP-R-TEST-1 tied to it, and the start of an analysis. */
async function disputed() {
  const deal = await createPaidTestDeal(db);
  await recordDispute(
    db,
    {
      disputeId: "PP-R-TEST-1",
      status: "WAITING_FOR_SELLER_RESPONSE",
      allowedActions: [],
      offerTypes: [],
      details: {},
    },
    { dealId: deal.dealId, stage: 1, invoiceId: "INV2-TEST-PAID", matchedBy: "transaction" },
    at(1),
  );
  const start = (n: number): StartClaimAnalysis => ({
    id: testId(800 + n),
    dealId: deal.dealId,
    disputeId: "PP-R-TEST-1",
    sellerId: deal.seller.id,
    promptVersion: 1,
    rankPromptVersion: 1,
  });
  return { ...deal, start };
}

const finished = (analysisId: string) => ({
  analysisId,
  analysis: { statements: [{ quote: "Not the style I wanted" }] },
  council: { members: [] },
  claimSha256: "c".repeat(64),
  recordSha256: "d".repeat(64),
  models: ["alpha", "beta"],
  winner: "alpha",
  statements: 1,
  needsReview: false,
});

describe("claim analyses", () => {
  it("runs one at a time per dispute, and logs a ready one by fingerprint only", async () => {
    const { dealId, start } = await disputed();
    const running = await startClaimAnalysis(db, start(1), at(2));
    expect(running).toMatchObject({ status: "running", disputeId: "PP-R-TEST-1" });
    await expect(startClaimAnalysis(db, start(2), at(3))).rejects.toEqual(
      refusal("already-running"),
    );
    const done = await finishClaimAnalysis(db, finished(running.id), at(4));
    expect(done?.analysis).toMatchObject({
      status: "ready",
      ledgerSeq: done?.entry.seq,
      claimSha256: "c".repeat(64),
    });
    expect(done?.entry).toMatchObject({
      type: "CLAIM_ANALYZED",
      actor: "system",
      payload: {
        analysisId: running.id,
        disputeId: "PP-R-TEST-1",
        models: ["alpha", "beta"],
        winner: "alpha",
        statements: 1,
        needsReview: false,
      },
    });
    // The AI's words never reach the log.
    expect(JSON.stringify(done?.entry.payload)).not.toContain("style");
    expect(await finishClaimAnalysis(db, finished(running.id), at(5))).toBeUndefined();
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
  });

  it("fails with a reason, keeps the council record, and refuses to move again", async () => {
    const { start } = await disputed();
    const running = await startClaimAnalysis(db, start(1), at(2));
    const failed = await failClaimAnalysis(
      db,
      { analysisId: running.id, reason: "no model produced a valid answer", council: { x: 1 } },
      at(3),
    );
    expect(failed).toMatchObject({ status: "failed", council: { x: 1 } });
    expect(await failClaimAnalysis(db, { analysisId: running.id, reason: "again" }, at(4))).toBe(
      undefined,
    );
    for (const sql of [
      "UPDATE claim_analyses SET status = 'running', finished_at = NULL, failure_reason = NULL",
      "DELETE FROM claim_analyses",
      "TRUNCATE claim_analyses",
    ]) {
      await expect(db.query(sql)).rejects.toThrow();
    }
    expect(await getClaimAnalysis(db, running.id)).toMatchObject({ status: "failed" });
    expect(await getClaimAnalysis(db, testId(999))).toBeUndefined();
  });

  it("takes one still running after 15 minutes as failed, so the next can start", async () => {
    const { start } = await disputed();
    await startClaimAnalysis(db, start(1), at(2));
    await expect(startClaimAnalysis(db, start(2), at(10))).rejects.toEqual(
      refusal("already-running"),
    );
    const next = await startClaimAnalysis(db, start(2), at(18));
    expect(next.status).toBe("running");
    expect((await listClaimAnalyses(db, "PP-R-TEST-1")).map((a) => a.status)).toEqual([
      "running",
      "failed",
    ]);
    expect((await getClaimAnalysis(db, testId(801)))?.failureReason).toBe("did not finish in time");
  });

  it("refuses another person, another deal's dispute and more than the limit", async () => {
    const { start, buyer, dealId } = await disputed();
    await expect(
      startClaimAnalysis(db, { ...start(1), sellerId: buyer.id }, at(2)),
    ).rejects.toEqual(refusal("not-your-deal"));
    await expect(
      startClaimAnalysis(db, { ...start(1), disputeId: "PP-R-NONE" }, at(2)),
    ).rejects.toEqual(refusal("not-this-deal"));
    for (let n = 1; n <= MAX_ANALYSES_PER_DISPUTE; n++) {
      const running = await startClaimAnalysis(db, start(n), at(2 + n));
      await failClaimAnalysis(db, { analysisId: running.id, reason: "x" }, at(2 + n));
    }
    await expect(startClaimAnalysis(db, start(99), at(30))).rejects.toEqual(refusal("too-many"));
    expect((await readLedger(db, dealId)).some((e) => e.type === "CLAIM_ANALYZED")).toBe(false);
  });

  it("runs a summary only on a ready comparison, one per kind at a time, and logs SUMMARY_DRAFTED", async () => {
    const { start } = await disputed();
    const summary = (n: number, basedOn: string) => ({
      ...start(n),
      kind: "summary" as const,
      basedOn,
    });
    const comparison = await startClaimAnalysis(db, start(1), at(2));
    // Not ready yet: no summary.
    await expect(startClaimAnalysis(db, summary(2, comparison.id), at(3))).rejects.toEqual(
      refusal("no-comparison"),
    );
    await finishClaimAnalysis(db, finished(comparison.id), at(4));
    const drafting = await startClaimAnalysis(db, summary(2, comparison.id), at(5));
    expect(drafting).toMatchObject({ kind: "summary", basedOn: comparison.id });
    // A comparison and a summary may run side by side; two summaries may not.
    await startClaimAnalysis(db, start(3), at(5));
    await expect(startClaimAnalysis(db, summary(4, comparison.id), at(5))).rejects.toEqual(
      refusal("already-running"),
    );
    const done = await finishClaimAnalysis(
      db,
      { ...finished(drafting.id), exhibitsSha256: "e".repeat(64), statements: 3 },
      at(6),
    );
    expect(done?.entry).toMatchObject({
      type: "SUMMARY_DRAFTED",
      payload: {
        basedOn: comparison.id,
        comparisonSha256: "c".repeat(64),
        exhibitsSha256: "e".repeat(64),
        sentences: 3,
      },
    });
    expect((await listClaimAnalyses(db, "PP-R-TEST-1", "summary")).map((a) => a.id)).toEqual([
      drafting.id,
    ]);
  });

  it("drafts an appeal statement only from a ready appeal check, and logs APPEAL_DRAFTED", async () => {
    const { start } = await disputed();
    const check = await startClaimAnalysis(db, { ...start(1), kind: "appeal" }, at(2));
    const statement = { ...start(2), kind: "statement" as const, basedOn: check.id };
    await expect(startClaimAnalysis(db, statement, at(3))).rejects.toEqual(refusal("no-check"));
    const checked = await finishClaimAnalysis(
      db,
      { ...finished(check.id), exhibitsSha256: "e".repeat(64), statements: 2 },
      at(4),
    );
    expect(checked?.entry).toMatchObject({
      type: "APPEAL_CHECKED",
      payload: { itemsSha256: "e".repeat(64), speaking: 2 },
    });
    const drafting = await startClaimAnalysis(db, statement, at(5));
    const done = await finishClaimAnalysis(db, { ...finished(drafting.id), statements: 4 }, at(6));
    expect(done?.entry).toMatchObject({
      type: "APPEAL_DRAFTED",
      payload: { basedOn: check.id, sentences: 4 },
    });
  });
});
