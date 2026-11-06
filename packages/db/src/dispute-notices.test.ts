import { describe, expect, it } from "vitest";
import {
  listDisputeEntriesSince,
  listDisputeNotices,
  listDisputesDueBy,
  noticeKeysTaken,
  recordDispute,
  recordDisputeNotice,
} from "./index.js";
import {
  createPaidTestDeal,
  linkTestDispute,
  minutesAfterTestNow,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();
const at = minutesAfterTestNow;

describe("dispute notices", () => {
  it("records each email key once, refused or sent, and lists a dispute's emails", async () => {
    const { dealId } = await createPaidTestDeal(db);
    await linkTestDispute(db, dealId, at(1));
    const base = { dealId, disputeId: "PP-R-TEST-1", kind: "opened" as const, ledgerSeq: 7 };
    await recordDisputeNotice(db, { ...base, key: "k1", outcome: { emailId: "em-1" } }, at(2));
    await recordDisputeNotice(db, { ...base, key: "k1", outcome: { emailId: "em-2" } }, at(3));
    await recordDisputeNotice(
      db,
      { ...base, key: "k2", kind: "reminder", outcome: { failure: "rejected" } },
      at(4),
    );
    expect(await noticeKeysTaken(db, ["k1", "k2", "k3"])).toEqual(new Set(["k1", "k2"]));
    expect(await noticeKeysTaken(db, [])).toEqual(new Set());
    expect(await listDisputeNotices(db, "PP-R-TEST-1")).toMatchObject([
      { key: "k2", kind: "reminder", failure: "rejected" },
      { key: "k1", emailId: "em-1", ledgerSeq: 7 },
    ]);
    await expect(db.query("DELETE FROM dispute_notices")).rejects.toThrow();
  });

  it("lists recent dispute entries and the disputes due soon that wait for the seller", async () => {
    const { dealId } = await createPaidTestDeal(db);
    await linkTestDispute(db, dealId, at(1));
    expect((await listDisputeEntriesSince(db, at(0))).map((e) => e.type)).toEqual([
      "DISPUTE_OPENED",
    ]);
    expect(await listDisputeEntriesSince(db, at(60))).toEqual([]);
    await recordDispute(
      db,
      {
        disputeId: "PP-R-TEST-1",
        status: "WAITING_FOR_SELLER_RESPONSE",
        sellerDueAt: at(600),
        allowedActions: ["escalate"],
        offerTypes: [],
        details: {},
      },
      undefined,
      at(2),
    );
    expect((await listDisputesDueBy(db, at(2), at(700))).map((d) => d.disputeId)).toEqual([
      "PP-R-TEST-1",
    ]);
    expect(await listDisputesDueBy(db, at(2), at(500))).toEqual([]);
    expect(await listDisputesDueBy(db, at(601), at(2000))).toEqual([]);
  });
});
