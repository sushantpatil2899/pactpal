import { describe, expect, it } from "vitest";
import {
  AGENT_CODE_LIFETIME_MS,
  MAX_WRONG_CODES,
  answerAgentRequest,
  claimAgentRequest,
  createAgentRequest,
  finishAgentRequest,
  getAgentRequest,
  listOpenAgentRequests,
  readLedger,
} from "./index.js";
import {
  TEST_NOW,
  createTestDeal,
  minutesAfterTestNow,
  testId,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();

/** The test deal with one request waiting from its seller's agent. */
async function waiting(n = 1) {
  const deal = await createTestDeal(db);
  const request = await createAgentRequest(
    db,
    {
      id: testId(900 + n),
      sellerId: deal.seller.id,
      dealId: deal.dealId,
      keyEnding: "ab12",
      kind: "send-invoice",
      path: `/api/deals/${deal.dealId}/milestones/1/invoice`,
      body: { invoiceSha256: "a".repeat(64) },
      summary: "Send the invoice for stage 1",
    },
    TEST_NOW,
  );
  return { ...deal, request };
}

describe("agent requests", () => {
  it("wait for the seller and are logged with the body's fingerprint only", async () => {
    const { seller, buyer, dealId, request } = await waiting();
    expect(request).toMatchObject({ status: "waiting", keyEnding: "ab12", kind: "send-invoice" });
    expect(request.bodySha256).toMatch(/^[0-9a-f]{64}$/);
    const entry = (await readLedger(db, dealId)).at(-1);
    expect(entry).toMatchObject({
      type: "AGENT_REQUESTED",
      actor: "seller",
      payload: { requestId: request.id, kind: "send-invoice", keyEnding: "ab12" },
    });
    expect(JSON.stringify(entry?.payload)).not.toContain("aaaa");
    expect((await listOpenAgentRequests(db, seller.id)).map((r) => r.id)).toEqual([request.id]);
    expect(await listOpenAgentRequests(db, seller.id, testId(999))).toEqual([]);
    expect(await getAgentRequest(db, buyer.id, request.id)).toBeUndefined();
  });

  it("run once with the approval's code, then record how they ended", async () => {
    const { seller, dealId, request } = await waiting();
    const claim = (code: string, at = TEST_NOW) =>
      claimAgentRequest(db, { id: request.id, sellerId: seller.id, code }, at);
    expect(await claim("whatever")).toEqual({ ok: false, reason: "not-approved" });
    const answered = await answerAgentRequest(
      db,
      { id: request.id, sellerId: seller.id, approve: true },
      TEST_NOW,
    );
    if (!answered.ok || answered.code === undefined) throw new Error("expected a code");
    expect(answered.code).toMatch(/^[A-Z2-9]{5}-[A-Z2-9]{5}$/);
    expect(answered.request.codeExpiresAt?.getTime()).toBe(
      TEST_NOW.getTime() + AGENT_CODE_LIFETIME_MS,
    );
    expect(
      await answerAgentRequest(
        db,
        { id: request.id, sellerId: seller.id, approve: false },
        TEST_NOW,
      ),
    ).toEqual({ ok: false, reason: "not-waiting" });

    expect(await claim("wrong-wrong")).toEqual({ ok: false, reason: "wrong-code" });
    // Case, spaces and the dash do not matter.
    const used = await claim(` ${answered.code.toLowerCase().replace("-", " ")} `);
    expect(used).toMatchObject({ ok: true, request: { body: { invoiceSha256: "a".repeat(64) } } });
    expect(await claim(answered.code)).toEqual({ ok: false, reason: "used" });
    expect(await listOpenAgentRequests(db, seller.id)).toEqual([]);

    const done = await finishAgentRequest(
      db,
      { id: request.id, sellerId: seller.id, ok: true, status: 200 },
      TEST_NOW,
    );
    expect(done).toMatchObject({ status: "done", resultStatus: 200 });
    expect((await readLedger(db, dealId)).map((e) => e.type).slice(-3)).toEqual([
      "AGENT_REQUESTED",
      "AGENT_REQUEST_ANSWERED",
      "AGENT_ACTED",
    ]);
    await expect(
      finishAgentRequest(
        db,
        { id: request.id, sellerId: seller.id, ok: true, status: 200 },
        TEST_NOW,
      ),
    ).rejects.toThrow("only a used approval");
    expect(await claim(answered.code)).toEqual({ ok: false, reason: "used" });
  });

  it("refuse a late code, too many wrong codes, a declined request and another seller", async () => {
    const late = await waiting(1);
    const approve = async (id: string, sellerId: string) => {
      const answered = await answerAgentRequest(db, { id, sellerId, approve: true }, TEST_NOW);
      if (!answered.ok || answered.code === undefined) throw new Error("expected a code");
      return answered.code;
    };
    const lateCode = await approve(late.request.id, late.seller.id);
    expect(
      await claimAgentRequest(
        db,
        { id: late.request.id, sellerId: late.seller.id, code: lateCode },
        minutesAfterTestNow(11),
      ),
    ).toEqual({ ok: false, reason: "expired" });
    expect(
      await claimAgentRequest(
        db,
        { id: late.request.id, sellerId: late.seller.id, code: lateCode },
        TEST_NOW,
      ),
    ).toEqual({ ok: false, reason: "expired" });

    const guessed = await createAgentRequest(
      db,
      { ...late.request, id: testId(950), body: { invoiceSha256: "b".repeat(64) } },
      TEST_NOW,
    );
    const code = await approve(guessed.id, late.seller.id);
    for (let n = 1; n < MAX_WRONG_CODES; n += 1) {
      expect(
        await claimAgentRequest(
          db,
          { id: guessed.id, sellerId: late.seller.id, code: "no" },
          TEST_NOW,
        ),
      ).toEqual({ ok: false, reason: "wrong-code" });
    }
    expect(
      await claimAgentRequest(
        db,
        { id: guessed.id, sellerId: late.seller.id, code: "no" },
        TEST_NOW,
      ),
    ).toEqual({ ok: false, reason: "wrong-code" });
    // Spent: even the right code no longer works.
    expect(
      await claimAgentRequest(db, { id: guessed.id, sellerId: late.seller.id, code }, TEST_NOW),
    ).toEqual({ ok: false, reason: "expired" });

    const declined = await createAgentRequest(
      db,
      { ...late.request, id: testId(951), body: {} },
      TEST_NOW,
    );
    expect(
      await answerAgentRequest(
        db,
        { id: declined.id, sellerId: late.buyer.id, approve: true },
        TEST_NOW,
      ),
    ).toEqual({ ok: false, reason: "not-found" });
    expect(
      await answerAgentRequest(
        db,
        { id: declined.id, sellerId: late.seller.id, approve: false },
        TEST_NOW,
      ),
    ).toMatchObject({ ok: true, request: { status: "declined" } });
    expect(
      await claimAgentRequest(db, { id: declined.id, sellerId: late.seller.id, code }, TEST_NOW),
    ).toEqual({ ok: false, reason: "used" });
    expect(
      await claimAgentRequest(db, { id: testId(999), sellerId: late.seller.id, code }, TEST_NOW),
    ).toEqual({ ok: false, reason: "not-found" });
  });
});
