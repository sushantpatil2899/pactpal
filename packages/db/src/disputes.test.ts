import { describe, expect, it } from "vitest";
import {
  disputeChanges,
  findPaidStages,
  finishDisputeCheck,
  getDispute,
  latestDisputeCheck,
  listDealDisputes,
  readLedger,
  recordDispute,
  startDisputeCheck,
  verifyStoredLedger,
  type DisputeLink,
  type DisputeSnapshot,
} from "./index.js";
import {
  createPaidTestDeal,
  minutesAfterTestNow,
  testId,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();
const at = minutesAfterTestNow;

/** A dispute as read from PayPal, ready to override. */
const snapshot = (overrides: Partial<DisputeSnapshot> = {}): DisputeSnapshot => ({
  disputeId: "PP-R-TEST-1",
  reason: "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED",
  status: "WAITING_FOR_SELLER_RESPONSE",
  state: "REQUIRED_ACTION",
  stageName: "INQUIRY",
  amount: { minor: 12_000, currency: "USD" },
  sellerDueAt: new Date("2026-11-25T18:58:40.000Z"),
  allowedActions: ["escalate", "accept_claim", "send_message", "make_offer"],
  offerTypes: ["REFUND"],
  paypalCreatedAt: new Date("2026-11-05T18:58:40.000Z"),
  paypalUpdatedAt: new Date("2026-11-05T19:02:04.000Z"),
  details: { messages: [{ postedBy: "BUYER", content: "Not the style I wanted" }] },
  ...overrides,
});

const linkTo = (dealId: string): DisputeLink => ({
  dealId,
  stage: 1,
  invoiceId: "INV2-TEST-PAID",
  matchedBy: "transaction",
});

const types = async (dealId: string) => (await readLedger(db, dealId)).map((e) => e.type);

describe("disputes", () => {
  it("logs a matched dispute's opening once, without the buyer's words", async () => {
    const { dealId } = await createPaidTestDeal(db);
    const first = await recordDispute(db, snapshot(), linkTo(dealId), at(1));
    expect(first.entries.map((e) => e.type)).toEqual(["DISPUTE_OPENED"]);
    expect(first.entries[0]).toMatchObject({
      actor: "system",
      payload: {
        disputeId: "PP-R-TEST-1",
        reason: "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED",
        status: "WAITING_FOR_SELLER_RESPONSE",
        paypalStage: "INQUIRY",
        amountMinor: 12_000,
        currency: "USD",
        sellerDueAt: "2026-11-25T18:58:40.000Z",
        stage: 1,
        invoiceId: "INV2-TEST-PAID",
        matchedBy: "transaction",
      },
    });
    expect(JSON.stringify(first.entries[0]?.payload)).not.toContain("style");
    expect(first.dispute).toMatchObject({
      dealId,
      stage: 1,
      openedSeq: first.entries[0]?.seq,
      resolvedSeq: null,
      allowedActions: ["escalate", "accept_claim", "send_message", "make_offer"],
      firstSeenAt: at(1),
      checkedAt: at(1),
    });
    // Read again with nothing new: nothing more is logged, and the row is only re-checked.
    const again = await recordDispute(db, snapshot(), linkTo(dealId), at(2));
    expect(again.entries).toEqual([]);
    expect(again.dispute).toMatchObject({ checkedAt: at(2), firstSeenAt: at(1) });
    expect(await types(dealId)).toEqual(expect.arrayContaining(["DISPUTE_OPENED"]));
    expect((await types(dealId)).filter((t) => t.startsWith("DISPUTE"))).toHaveLength(1);
    expect(await listDealDisputes(db, dealId)).toEqual([again.dispute]);
  });

  it("logs a change of stage, status or due date, and the decision once", async () => {
    const { dealId } = await createPaidTestDeal(db);
    await recordDispute(db, snapshot(), linkTo(dealId), at(1));
    // Only what the seller may do changed: kept on the row, not logged.
    const actions = await recordDispute(
      db,
      snapshot({ allowedActions: ["accept_claim"] }),
      undefined,
      at(2),
    );
    expect(actions.entries).toEqual([]);
    expect(actions.dispute.allowedActions).toEqual(["accept_claim"]);
    const escalated = await recordDispute(
      db,
      snapshot({ stageName: "CHARGEBACK", sellerDueAt: new Date("2026-11-30T00:00:00.000Z") }),
      undefined,
      at(3),
    );
    expect(escalated.entries.map((e) => e.payload)).toEqual([
      {
        disputeId: "PP-R-TEST-1",
        changes: {
          paypalStage: { from: "INQUIRY", to: "CHARGEBACK" },
          sellerDueAt: { from: "2026-11-25T18:58:40.000Z", to: "2026-11-30T00:00:00.000Z" },
        },
      },
    ]);
    const decided = snapshot({
      stageName: "CHARGEBACK",
      sellerDueAt: new Date("2026-11-30T00:00:00.000Z"),
      status: "RESOLVED",
      outcome: "RESOLVED_SELLER_FAVOUR",
    });
    const resolved = await recordDispute(db, decided, undefined, at(4));
    expect(resolved.entries.map((e) => [e.type, e.payload])).toEqual([
      [
        "DISPUTE_UPDATED",
        {
          disputeId: "PP-R-TEST-1",
          changes: { status: { from: "WAITING_FOR_SELLER_RESPONSE", to: "RESOLVED" } },
        },
      ],
      [
        "DISPUTE_RESOLVED",
        { disputeId: "PP-R-TEST-1", outcome: "RESOLVED_SELLER_FAVOUR", status: "RESOLVED" },
      ],
    ]);
    expect(resolved.dispute.resolvedSeq).toBe(resolved.entries[1]?.seq);
    expect((await recordDispute(db, decided, undefined, at(5))).entries).toEqual([]);
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
  });

  it("saves a dispute that matches no deal without logging, and links it once it matches", async () => {
    const unmatched = await recordDispute(db, snapshot(), undefined, at(1));
    expect(unmatched).toMatchObject({ entries: [], dispute: { dealId: null, openedSeq: null } });
    const { dealId } = await createPaidTestDeal(db);
    const decided = snapshot({ status: "RESOLVED", outcome: "RESOLVED_BUYER_FAVOUR" });
    const linked = await recordDispute(db, decided, linkTo(dealId), at(2));
    expect(linked.entries.map((e) => e.type)).toEqual(["DISPUTE_OPENED", "DISPUTE_RESOLVED"]);
    // A linked dispute keeps its deal: a later, different match is ignored.
    const other = await recordDispute(db, decided, linkTo(testId(999)), at(3));
    expect(other).toMatchObject({ entries: [], dispute: { dealId } });
  });

  it("refuses to move, unlink or remove a linked dispute", async () => {
    const { dealId } = await createPaidTestDeal(db);
    await recordDispute(db, snapshot(), linkTo(dealId), at(1));
    for (const sql of [
      "UPDATE disputes SET deal_id = NULL, stage = NULL, matched_by = NULL, opened_seq = NULL",
      "UPDATE disputes SET stage = 2",
      "UPDATE disputes SET first_seen_at = now()",
      "DELETE FROM disputes",
      "TRUNCATE disputes",
    ]) {
      await expect(db.query(sql)).rejects.toThrow();
    }
    expect(await getDispute(db, "PP-R-TEST-1")).toMatchObject({ dealId, stage: 1 });
    expect(await getDispute(db, "PP-R-NONE")).toBeUndefined();
  });

  it("finds paid stages by PayPal transaction id or invoice number", async () => {
    const { dealId } = await createPaidTestDeal(db, {
      transactionId: "TX-1",
      invoiceNumber: "0042",
    });
    const stage = { dealId, stage: 1, invoiceId: "INV2-TEST-PAID" };
    expect(await findPaidStages(db, { transactionIds: ["TX-1"], invoiceNumbers: [] })).toEqual([
      { ...stage, transactionId: "TX-1", invoiceNumber: "0042" },
    ]);
    expect(await findPaidStages(db, { transactionIds: [], invoiceNumbers: ["0042"] })).toHaveLength(
      1,
    );
    expect(await findPaidStages(db, { transactionIds: ["TX-2"], invoiceNumbers: ["9"] })).toEqual(
      [],
    );
    expect(await findPaidStages(db, { transactionIds: [], invoiceNumbers: [] })).toEqual([]);
    // A dispute's invoice_number holds the invoice id (seen in the sandbox on 5 Nov 2026).
    expect(
      await findPaidStages(db, { transactionIds: [], invoiceNumbers: ["INV2-TEST-PAID"] }),
    ).toHaveLength(1);
  });

  it("records each check and how it ended", async () => {
    expect(await latestDisputeCheck(db)).toBeUndefined();
    await startDisputeCheck(db, { id: testId(1), source: "schedule" }, at(1));
    await finishDisputeCheck(
      db,
      testId(1),
      { ok: true, listed: 2, readInFull: 1, matched: 1, unmatched: 1, newEntries: 1 },
      at(2),
    );
    expect(await latestDisputeCheck(db)).toEqual({
      id: testId(1),
      source: "schedule",
      startedAt: at(1),
      finishedAt: at(2),
      listed: 2,
      readInFull: 1,
      matched: 1,
      unmatched: 1,
      newEntries: 1,
      failure: null,
    });
    await startDisputeCheck(db, { id: testId(2), source: "button" }, at(3));
    await finishDisputeCheck(db, testId(2), { ok: false, failure: "x".repeat(300) }, at(4));
    expect(await latestDisputeCheck(db)).toMatchObject({
      source: "button",
      listed: null,
      failure: "x".repeat(200),
    });
  });
});

describe("disputeChanges", () => {
  it("logs nothing for a dispute that matches no deal", () => {
    expect(
      disputeChanges(undefined, { ...snapshot(), allowedActions: [], offerTypes: [] }, undefined),
    ).toEqual({
      link: undefined,
      events: [],
    });
  });
});
