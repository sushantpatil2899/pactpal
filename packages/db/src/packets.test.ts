import { sha256Hex } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import {
  MAX_PACKETS_PER_DISPUTE,
  PacketNotAllowedError,
  getPacket,
  listPackets,
  postgresContentStore,
  finishClaimAnalysis,
  readLedger,
  recordPacket,
  startClaimAnalysis,
  verifyStoredLedger,
  type NewPacket,
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
const store = postgresContentStore(db, () => TEST_NOW);
const at = minutesAfterTestNow;
const refusal = (reason: string) => new PacketNotAllowedError(reason as never);

/** A paid deal with dispute PP-R-TEST-1 tied to it, and a packet ready to record. */
async function disputed() {
  const deal = await createPaidTestDeal(db);
  await linkTestDispute(db, deal.dealId, at(1));
  const pdf = new TextEncoder().encode("%PDF-1.7 packet");
  const packet = (n: number): NewPacket => ({
    id: testId(700 + n),
    dealId: deal.dealId,
    disputeId: "PP-R-TEST-1",
    sellerId: deal.seller.id,
    packet: pdf,
    packetSha256: sha256Hex(pdf),
    exhibits: [
      {
        id: "receipt",
        filename: "pactpal-receipt-v1.pdf",
        addedBy: "system",
        sha256: "a".repeat(64),
        sizeBytes: 900,
        send: "as-is",
        number: 1,
        sentSha256: "a".repeat(64),
        sentBytes: 900,
      },
      {
        id: testId(5),
        filename: "chat.zip",
        addedBy: "seller",
        sha256: "b".repeat(64),
        sizeBytes: 50,
        send: "left-out",
        reason: "type",
      },
    ],
    totalBytes: 915,
    chainEntries: 7,
    chainHead: "c".repeat(64),
  });
  return { ...deal, packet };
}

describe("evidence packets", () => {
  it("stores the packet's bytes and logs PACKET_BUILT with fingerprints only", async () => {
    const { dealId, packet } = await disputed();
    const { packet: saved, entry } = await recordPacket(db, store, packet(1), at(2));
    expect(saved).toMatchObject({
      disputeId: "PP-R-TEST-1",
      packetBytes: 15,
      totalBytes: 915,
      chainHead: "c".repeat(64),
      ledgerSeq: entry.seq,
    });
    expect(entry).toMatchObject({
      type: "PACKET_BUILT",
      actor: "seller",
      payload: {
        packetId: testId(701),
        exhibits: [{ id: "receipt", sha256: "a".repeat(64), sentSha256: "a".repeat(64) }],
        leftOut: 1,
      },
    });
    expect(await store.get(saved.packetSha256)).toEqual(packet(1).packet);
    expect(await getPacket(db, testId(701))).toEqual(saved);
    expect(await getPacket(db, testId(999))).toBeUndefined();
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
    for (const sql of [
      "UPDATE evidence_packets SET total_bytes = 1",
      "DELETE FROM evidence_packets",
    ]) {
      await expect(db.query(sql)).rejects.toThrow();
    }
  });

  it("refuses another person, another deal's dispute, and more than the limit", async () => {
    const { packet, buyer, dealId } = await disputed();
    await expect(
      recordPacket(db, store, { ...packet(1), sellerId: buyer.id }, at(2)),
    ).rejects.toEqual(refusal("not-your-deal"));
    await expect(
      recordPacket(db, store, { ...packet(1), disputeId: "PP-R-NONE" }, at(2)),
    ).rejects.toEqual(refusal("not-this-deal"));
    for (let n = 1; n <= MAX_PACKETS_PER_DISPUTE; n++) {
      await recordPacket(db, store, packet(n), at(2 + n));
    }
    await expect(recordPacket(db, store, packet(99), at(40))).rejects.toEqual(refusal("too-many"));
    expect(await listPackets(db, "PP-R-TEST-1")).toHaveLength(MAX_PACKETS_PER_DISPUTE);
    expect((await listPackets(db, "PP-R-TEST-1"))[0]?.id).toBe(testId(720));
    const built = (await readLedger(db, dealId)).filter((e) => e.type === "PACKET_BUILT");
    expect(built).toHaveLength(MAX_PACKETS_PER_DISPUTE);
  });

  it("carries the AI comparison and summary only when they are this dispute's ready pair", async () => {
    const { packet, seller } = await disputed();
    const begin = (id: number, extra = {}) =>
      startClaimAnalysis(
        db,
        {
          id: testId(id),
          dealId: packet(1).dealId,
          disputeId: "PP-R-TEST-1",
          sellerId: seller.id,
          promptVersion: 1,
          rankPromptVersion: 1,
          ...extra,
        },
        at(2),
      );
    const done = (id: string) =>
      finishClaimAnalysis(
        db,
        {
          analysisId: id,
          analysis: {},
          council: {},
          claimSha256: "c".repeat(64),
          recordSha256: "d".repeat(64),
          models: ["alpha"],
          winner: "alpha",
          statements: 1,
          needsReview: false,
        },
        at(3),
      );
    const comparison = await begin(801);
    await done(comparison.id);
    const summary = await begin(802, { kind: "summary", basedOn: comparison.id });
    const ai = {
      analysisId: comparison.id,
      summaryId: summary.id,
      analysisSha256: "a".repeat(64),
      summarySha256: "b".repeat(64),
    };
    await expect(recordPacket(db, store, { ...packet(1), ai }, at(4))).rejects.toEqual(
      refusal("ai-not-ready"),
    );
    await done(summary.id);
    const { packet: saved, entry } = await recordPacket(db, store, { ...packet(1), ai }, at(5));
    expect(saved).toMatchObject({ analysisId: comparison.id, summaryId: summary.id });
    expect(entry.payload).toMatchObject({ ai });
  });
});
