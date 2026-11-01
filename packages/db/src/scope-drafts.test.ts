import type { JsonValue } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import {
  DealNotFoundError,
  DraftIntegrityError,
  DraftNotAllowedError,
  DraftStateError,
  MAX_DRAFTS_PER_DEAL,
  addArtifact,
  createDeal,
  draftFingerprint,
  failDraft,
  failRunningDrafts,
  finishDraft,
  getDraft,
  isUniqueViolation,
  listDrafts,
  postgresContentStore,
  readLedger,
  startDraft,
  verifyStoredLedger,
  type StartDraft,
} from "./index.js";
import { TEST_NOW, createTestDeal, testDeal, testId, useMigratedTestDatabase } from "./testing.js";

const db = useMigratedTestDatabase();
const store = postgresContentStore(db, () => TEST_NOW);
const at = (minutes: number) => new Date(TEST_NOW.getTime() + minutes * 60_000);
const chatBytes = new TextEncoder().encode("Maya: logo?\nChris: yes, $200");

/** A deal with a saved chat; returns what `startDraft` needs. */
async function dealWithChat(): Promise<{ sellerId: string; dealId: string; input: StartDraft }> {
  const { seller, dealId } = await createTestDeal(db);
  const artifact = await addArtifact(
    db,
    store,
    {
      id: testId(500),
      dealId,
      kind: "source",
      filename: "chat.txt",
      bytes: chatBytes,
      addedBy: { actor: "seller", actorId: seller.id },
    },
    at(1),
  );
  return {
    sellerId: seller.id,
    dealId,
    input: {
      id: testId(900),
      dealId,
      sellerId: seller.id,
      sourceArtifactId: artifact.id,
      sourceSha256: artifact.sha256,
      draftPromptVersion: 1,
      rankPromptVersion: 1,
    },
  };
}

const draft: JsonValue = { format: 2, summary: { status: "missing" }, extra: ["a", { b: 1 }] };
const council: JsonValue = { agreement: 1, answers: [{ modelName: "m", status: "valid" }] };
const finish = (draftId: string, overrides: { draft?: JsonValue } = {}) => ({
  draftId,
  draft: overrides.draft ?? draft,
  council,
  ledgerPayload: { winnerModel: "m", needsReview: false },
});

describe("startDraft", () => {
  it("records a running draft for the seller's deal with no result yet", async () => {
    const { input } = await dealWithChat();
    const started = await startDraft(db, input, at(2));
    expect(started).toMatchObject({
      id: input.id,
      dealId: input.dealId,
      sourceArtifactId: input.sourceArtifactId,
      sourceSha256: input.sourceSha256,
      createdBy: input.sellerId,
      status: "running",
      createdAt: at(2),
      draftPromptVersion: 1,
      rankPromptVersion: 1,
    });
    expect(started.draft).toBeUndefined();
    expect(started.finishedAt).toBeUndefined();
    expect((await readLedger(db, input.dealId)).map((e) => e.type)).not.toContain("SCOPE_DRAFTED");
  });

  it("refuses anyone but the seller, a deal that is not a draft, and an unknown deal", async () => {
    const { input, dealId } = await dealWithChat();
    const buyer = testId(2);
    await expect(startDraft(db, { ...input, sellerId: buyer }, at(2))).rejects.toMatchObject({
      reason: "not-your-deal",
    });
    await expect(startDraft(db, { ...input, dealId: testId(777) }, at(2))).rejects.toThrow(
      DealNotFoundError,
    );
    await db.query("UPDATE deals SET status = 'awaiting_acceptance' WHERE id = $1", [dealId]);
    const late = await startDraft(db, input, at(2)).catch((error: unknown) => error);
    expect(late).toBeInstanceOf(DraftNotAllowedError);
    expect(late).toMatchObject({ reason: "not-draft" });
    expect(await listDrafts(db, dealId)).toEqual([]);
  });

  it("allows one running draft per deal, and another once it has finished", async () => {
    const { input, dealId } = await dealWithChat();
    await startDraft(db, input, at(2));
    await expect(startDraft(db, { ...input, id: testId(901) }, at(3))).rejects.toMatchObject({
      reason: "already-running",
    });
    await failDraft(db, { draftId: input.id, reason: "x" }, at(4));
    await startDraft(db, { ...input, id: testId(901) }, at(5));
    expect((await listDrafts(db, dealId)).map((d) => d.status)).toEqual(["running", "failed"]);
  });

  it("allows a limited number of drafts per deal", async () => {
    const { input } = await dealWithChat();
    for (let i = 0; i < MAX_DRAFTS_PER_DEAL; i++) {
      const id = testId(900 + i);
      await startDraft(db, { ...input, id }, at(2 + i));
      await failDraft(db, { draftId: id, reason: "x" }, at(2 + i));
    }
    await expect(startDraft(db, { ...input, id: testId(950) }, at(30))).rejects.toMatchObject({
      reason: "too-many",
    });
  });

  it("refuses a chat file that belongs to another deal", async () => {
    const { input, sellerId } = await dealWithChat();
    const { deal: other } = await createDeal(db, testDeal(sellerId, { id: testId(101) }), at(3));
    await expect(startDraft(db, { ...input, dealId: other.id }, at(4))).rejects.toThrow();
    expect(await listDrafts(db, other.id)).toEqual([]);
  });
});

describe("finishDraft", () => {
  it("marks the draft ready and records one SCOPE_DRAFTED entry by the system, in one go", async () => {
    const { input, dealId } = await dealWithChat();
    await startDraft(db, input, at(2));
    const { draft: ready, entry } = await finishDraft(db, finish(input.id), at(3));

    expect(ready).toMatchObject({
      status: "ready",
      finishedAt: at(3),
      draft,
      council,
      draftSha256: draftFingerprint(draft),
      ledgerSeq: entry.seq,
    });
    expect(entry).toMatchObject({ type: "SCOPE_DRAFTED", actor: "system" });
    expect(entry.actorId).toBeUndefined();
    expect(entry.payload).toEqual({
      winnerModel: "m",
      needsReview: false,
      draftId: input.id,
      draftSha256: draftFingerprint(draft),
    });
    expect(JSON.stringify(entry.payload)).not.toContain("missing");
    expect(await verifyStoredLedger(db, dealId)).toMatchObject({ valid: true });
    expect(await getDraft(db, dealId, input.id)).toEqual(ready);
  });

  it("cannot finish a draft twice, a failed draft or one that does not exist, and writes nothing then", async () => {
    const { input, dealId } = await dealWithChat();
    await startDraft(db, input, at(2));
    await finishDraft(db, finish(input.id), at(3));
    const entries = (await readLedger(db, dealId)).length;
    await expect(finishDraft(db, finish(input.id), at(4))).rejects.toThrow(DraftStateError);
    await expect(finishDraft(db, finish(testId(999)), at(4))).rejects.toThrow(DraftStateError);
    expect((await readLedger(db, dealId)).length).toBe(entries);

    await startDraft(db, { ...input, id: testId(901) }, at(5));
    await failDraft(db, { draftId: testId(901), reason: "x" }, at(6));
    await expect(finishDraft(db, finish(testId(901)), at(7))).rejects.toThrow(DraftStateError);
  });
});

describe("failDraft and failRunningDrafts", () => {
  it("marks a running draft failed with a reason and the council's record, with no ledger entry", async () => {
    const { input, dealId } = await dealWithChat();
    await startDraft(db, input, at(2));
    const failed = await failDraft(
      db,
      { draftId: input.id, reason: "no model produced a valid draft", council },
      at(3),
    );
    expect(failed).toMatchObject({
      status: "failed",
      finishedAt: at(3),
      failureReason: "no model produced a valid draft",
      council,
    });
    expect(failed?.draft).toBeUndefined();
    expect((await readLedger(db, dealId)).map((e) => e.type)).not.toContain("SCOPE_DRAFTED");
  });

  it("does nothing to a draft that is not running", async () => {
    const { input } = await dealWithChat();
    await startDraft(db, input, at(2));
    await failDraft(db, { draftId: input.id, reason: "first" }, at(3));
    expect(await failDraft(db, { draftId: input.id, reason: "second" }, at(4))).toBeUndefined();
    expect((await getDraft(db, input.dealId, input.id))?.failureReason).toBe("first");
  });

  it("sweeps every running draft at once and leaves finished ones alone", async () => {
    const { input } = await dealWithChat();
    await startDraft(db, input, at(2));
    await finishDraft(db, finish(input.id), at(3));
    await startDraft(db, { ...input, id: testId(901) }, at(4));
    expect(await failRunningDrafts(db, "interrupted by a restart", at(5))).toBe(1);
    expect(await failRunningDrafts(db, "interrupted by a restart", at(6))).toBe(0);
    const statuses = (await listDrafts(db, input.dealId)).map((d) => [d.id, d.status]);
    expect(statuses).toEqual([
      [testId(901), "failed"],
      [input.id, "ready"],
    ]);
  });
});

describe("reading drafts", () => {
  it("lists newest first, hides other deals' drafts and returns undefined for an unknown draft", async () => {
    const { input, dealId } = await dealWithChat();
    await startDraft(db, input, at(2));
    await failDraft(db, { draftId: input.id, reason: "x" }, at(3));
    await startDraft(db, { ...input, id: testId(901) }, at(4));
    expect((await listDrafts(db, dealId)).map((d) => d.id)).toEqual([testId(901), input.id]);
    expect(await getDraft(db, testId(777), input.id)).toBeUndefined();
    expect(await getDraft(db, dealId, testId(999))).toBeUndefined();
  });

  it("reports a ready draft whose content no longer matches its fingerprint", async () => {
    const { input, dealId } = await dealWithChat();
    await startDraft(db, input, at(2));
    await finishDraft(db, finish(input.id), at(3));
    await db.query(`UPDATE scope_drafts SET draft = '{"changed":true}'::jsonb WHERE id = $1`, [
      input.id,
    ]);
    await expect(getDraft(db, dealId, input.id)).rejects.toThrow(DraftIntegrityError);
    await expect(listDrafts(db, dealId)).rejects.toThrow(DraftIntegrityError);
  });
});

describe("draftFingerprint", () => {
  it("does not depend on key order", () => {
    expect(draftFingerprint({ a: 1, b: { c: 2, d: 3 } })).toBe(
      draftFingerprint({ b: { d: 3, c: 2 }, a: 1 }),
    );
    expect(draftFingerprint({ a: 1 })).not.toBe(draftFingerprint({ a: 2 }));
  });
});

describe("the database's own rules", () => {
  it("refuses a ready row without its ledger entry, and a second running row for a deal", async () => {
    const { input, dealId } = await dealWithChat();
    await startDraft(db, input, at(2));
    await db.query(
      "UPDATE scope_drafts SET status = 'failed', finished_at = $2, failure_reason = 'x' WHERE id = $1",
      [input.id, at(3)],
    );

    await expect(
      db.query(
        `UPDATE scope_drafts SET status = 'ready', draft = '{}'::jsonb, council = '{}'::jsonb WHERE id = $1`,
        [input.id],
      ),
    ).rejects.toThrow();
    await db.query(
      `INSERT INTO scope_drafts (id, deal_id, source_artifact_id, source_sha256, created_by, status, created_at, draft_prompt_version, rank_prompt_version)
       VALUES ($1, $2, $3, $4, $5, 'running', $6, 1, 1)`,
      [testId(901), dealId, input.sourceArtifactId, input.sourceSha256, input.sellerId, at(4)],
    );
    const second = await db
      .query(
        `INSERT INTO scope_drafts (id, deal_id, source_artifact_id, source_sha256, created_by, status, created_at, draft_prompt_version, rank_prompt_version)
         VALUES ($1, $2, $3, $4, $5, 'running', $6, 1, 1)`,
        [testId(902), dealId, input.sourceArtifactId, input.sourceSha256, input.sellerId, at(5)],
      )
      .catch((error: unknown) => error);
    expect(isUniqueViolation(second)).toBe(true);
  });
});
