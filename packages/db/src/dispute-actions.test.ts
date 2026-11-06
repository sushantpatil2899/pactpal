import { sha256Hex } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import {
  DisputeActionNotAllowedError,
  MAX_EVIDENCE_UPLOADS_PER_DISPUTE,
  finishDisputeAction,
  getDisputeAction,
  listDisputeActions,
  postgresContentStore,
  readLedger,
  recordPacket,
  resendDisputeAction,
  startDisputeAction,
  verifyStoredLedger,
  type NewDisputeAction,
} from "./index.js";
import {
  TEST_NOW,
  createPaidTestDeal,
  linkTestDispute,
  minutesAfterTestNow,
  testId,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();
const at = minutesAfterTestNow;
const refusal = (reason: string) => new DisputeActionNotAllowedError(reason as never);
const NOTE = "The buyer approved the stage 1 sketch before the final file.";
const FILE = { exhibit: null, name: "packet.pdf", mediaType: "application/pdf", bytes: 900 };

/** A paid deal with dispute PP-R-TEST-1 and one built packet. */
async function disputed() {
  const deal = await createPaidTestDeal(db);
  await linkTestDispute(db, deal.dealId, at(1));
  const pdf = new TextEncoder().encode("%PDF-1.7 packet");
  await recordPacket(
    db,
    postgresContentStore(db, () => TEST_NOW),
    {
      id: testId(700),
      dealId: deal.dealId,
      disputeId: "PP-R-TEST-1",
      sellerId: deal.seller.id,
      packet: pdf,
      packetSha256: sha256Hex(pdf),
      exhibits: [],
      totalBytes: pdf.byteLength,
      chainEntries: 3,
      chainHead: "c".repeat(64),
    },
    at(2),
  );
  const base = {
    dealId: deal.dealId,
    disputeId: "PP-R-TEST-1",
    sellerId: deal.seller.id,
    note: NOTE,
    noteSha256: sha256Hex(NOTE),
  };
  const escalate = (n: number): NewDisputeAction => ({
    ...base,
    id: testId(800 + n),
    kind: "escalate",
  });
  const evidence = (n: number): NewDisputeAction => ({
    ...base,
    id: testId(800 + n),
    kind: "evidence",
    packetId: testId(700),
    evidenceType: "OTHER",
    files: [{ ...FILE, sha256: "a".repeat(64) }],
  });
  return { ...deal, escalate, evidence };
}

describe("dispute actions", () => {
  it("reserves an escalation with a fixed request id and logs DISPUTE_ESCALATED once when sent", async () => {
    const { escalate, dealId } = await disputed();
    const started = await startDisputeAction(db, escalate(1), at(3));
    expect(started).toMatchObject({
      status: "sending",
      requestId: `pactpal-escalate-${testId(801)}`,
    });
    await expect(startDisputeAction(db, escalate(2), at(3))).rejects.toEqual(
      refusal("already-sending"),
    );
    const { action, entry } = await finishDisputeAction(
      db,
      { actionId: started.id, outcome: { status: "sent", transport: "rest", debugId: "dbg-1" } },
      at(4),
    );
    expect(action).toMatchObject({ status: "sent", debugId: "dbg-1", ledgerSeq: entry?.seq });
    expect(entry).toMatchObject({
      type: "DISPUTE_ESCALATED",
      actor: "seller",
      payload: { actionId: started.id, noteSha256: sha256Hex(NOTE), transport: "rest" },
    });
    expect(JSON.stringify(entry?.payload)).not.toContain("sketch");
    // Settling again changes nothing and logs nothing.
    const again = await finishDisputeAction(
      db,
      { actionId: started.id, outcome: { status: "unknown", failure: "x" } },
      at(5),
    );
    expect(again).toEqual({ action });
    expect(
      (await readLedger(db, dealId)).filter((e) => e.type === "DISPUTE_ESCALATED"),
    ).toHaveLength(1);
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
  });

  it("logs an evidence upload with each file's fingerprint, and sends an unknown one again", async () => {
    const { evidence } = await disputed();
    const started = await startDisputeAction(db, evidence(1), at(3));
    expect(started).toMatchObject({ evidenceType: "OTHER", totalBytes: 900 });
    const unknown = await finishDisputeAction(
      db,
      { actionId: started.id, outcome: { status: "unknown", failure: "timed out" } },
      at(4),
    );
    expect(unknown.action).toMatchObject({ status: "unknown", failure: "timed out" });
    const resent = await resendDisputeAction(db, {
      actionId: started.id,
      sellerId: started.sellerId,
    });
    expect(resent).toMatchObject({ status: "sending", requestId: started.requestId });
    const { entry } = await finishDisputeAction(
      db,
      { actionId: started.id, outcome: { status: "sent", transport: "rest" } },
      at(5),
    );
    expect(entry).toMatchObject({
      type: "EVIDENCE_UPLOADED",
      payload: {
        packetId: testId(700),
        evidenceType: "OTHER",
        files: [{ exhibit: null, name: "packet.pdf", bytes: 900, sha256: "a".repeat(64) }],
        totalBytes: 900,
      },
    });
    await expect(
      resendDisputeAction(db, { actionId: started.id, sellerId: started.sellerId }),
    ).rejects.toEqual(refusal("not-unknown"));
    expect((await listDisputeActions(db, "PP-R-TEST-1")).map((a) => a.status)).toEqual(["sent"]);
  });

  it("refuses another person, another dispute or packet, and more uploads than the limit", async () => {
    const { escalate, evidence, buyer, seller } = await disputed();
    await expect(
      startDisputeAction(db, { ...escalate(1), sellerId: buyer.id }, at(3)),
    ).rejects.toEqual(refusal("not-your-deal"));
    await expect(
      startDisputeAction(db, { ...escalate(1), disputeId: "PP-R-NONE" }, at(3)),
    ).rejects.toEqual(refusal("not-this-deal"));
    await expect(
      startDisputeAction(db, { ...evidence(1), packetId: testId(799) } as NewDisputeAction, at(3)),
    ).rejects.toEqual(refusal("not-this-packet"));
    for (let n = 1; n <= MAX_EVIDENCE_UPLOADS_PER_DISPUTE + 1; n++) {
      const started = await startDisputeAction(db, evidence(n), at(3));
      // A refused upload does not count towards the limit.
      const status = n === 1 ? "refused" : "unknown";
      await finishDisputeAction(
        db,
        { actionId: started.id, outcome: { status, failure: "no" } },
        at(4),
      );
    }
    await expect(startDisputeAction(db, evidence(40), at(5))).rejects.toEqual(refusal("too-many"));
    const anyId = testId(805);
    await expect(resendDisputeAction(db, { actionId: anyId, sellerId: buyer.id })).rejects.toEqual(
      refusal("not-your-deal"),
    );
    await expect(
      resendDisputeAction(db, { actionId: testId(999), sellerId: seller.id }),
    ).rejects.toEqual(refusal("not-this-deal"));
    await expect(
      finishDisputeAction(
        db,
        { actionId: testId(999), outcome: { status: "refused", failure: "x" } },
        at(6),
      ),
    ).rejects.toEqual(refusal("not-this-deal"));
    expect(await getDisputeAction(db, "not-an-id")).toBeUndefined();
  });

  it("keeps what was confirmed: no edits, no removal", async () => {
    const { escalate } = await disputed();
    await startDisputeAction(db, escalate(1), at(3));
    for (const sql of [
      "UPDATE dispute_actions SET note = 'changed'",
      "UPDATE dispute_actions SET status = 'sent'",
      "DELETE FROM dispute_actions",
    ]) {
      await expect(db.query(sql)).rejects.toThrow();
    }
  });
});
