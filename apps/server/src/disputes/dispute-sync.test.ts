import {
  latestDisputeCheck,
  listDealDisputes,
  readLedger,
  getDispute,
  type Database,
} from "@pactpal/db";
import { TEST_NOW, createPaidTestDeal, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { PayPalApiError } from "@pactpal/paypal";
import { describe, expect, it } from "vitest";
import { failureCode, syncDisputes } from "./dispute-sync.js";
import { fakeDisputes, keptLog, testDispute } from "./test-support.js";

const db = useMigratedTestDatabase();

/** A check against these disputes, with fixed ids, a kept log and a clock (the test clock by default). */
function checker(
  paypal: Pick<ReturnType<typeof fakeDisputes>, "reader">,
  database: Database = db,
  clock: () => Date = () => TEST_NOW,
) {
  let ids = 500;
  const { log, lines } = keptLog();
  const run = () =>
    syncDisputes(
      {
        db: database,
        disputes: paypal.reader,
        clock,
        newId: () => testId(ids++),
        log,
      },
      "schedule",
    );
  return { run, lines };
}

const disputeTypes = async (dealId: string) =>
  (await readLedger(db, dealId)).flatMap((e) => (e.type.startsWith("DISPUTE_") ? [e.type] : []));

describe("dispute checks", () => {
  it("ties a dispute to its deal by the payment's transaction id and logs it once", async () => {
    const { dealId } = await createPaidTestDeal(db);
    const paypal = fakeDisputes([testDispute()]);
    const { run, lines } = checker(paypal);
    expect(await run()).toEqual({
      ok: true,
      listed: 1,
      readInFull: 1,
      matched: 1,
      unmatched: 0,
      newEntries: 1,
    });
    expect(await disputeTypes(dealId)).toEqual(["DISPUTE_OPENED"]);
    expect(await listDealDisputes(db, dealId)).toMatchObject([
      { disputeId: "PP-R-TEST-1", stage: 1, matchedBy: "transaction", stageName: "INQUIRY" },
    ]);
    // Nothing changed at PayPal: no full read, nothing logged.
    expect(await run()).toMatchObject({ readInFull: 0, matched: 1, newEntries: 0 });
    expect(paypal.state.reads).toBe(1);
    expect(await disputeTypes(dealId)).toEqual(["DISPUTE_OPENED"]);
    expect(await latestDisputeCheck(db)).toMatchObject({ source: "schedule", listed: 1 });
    // The buyer's words are kept with the dispute but never written to the log lines.
    expect(lines.join("\n")).not.toContain("style");
  });

  it("compares PayPal's change times to the second, as its list gives them", async () => {
    await createPaidTestDeal(db);
    const paypal = fakeDisputes([testDispute({ updatedAt: "2026-11-05T19:02:04.997Z" })]);
    // The list rounds to whole seconds; the full dispute keeps milliseconds (live, 5k-2).
    const reader = {
      ...paypal.reader,
      list: async () => {
        const listed = await paypal.reader.list();
        const disputes = listed.data.disputes.map((d) => ({
          ...d,
          updatedAt: d.updatedAt?.replace(/\.\d+Z$/, ".000Z"),
        }));
        return { ...listed, data: { ...listed.data, disputes } };
      },
    };
    const { run } = checker({ reader });
    await run();
    expect(await run()).toMatchObject({ readInFull: 0, newEntries: 0 });
    expect(paypal.state.reads).toBe(1);
  });

  it("reads once more a dispute last read within a minute of PayPal's change", async () => {
    await createPaidTestDeal(db);
    const paypal = fakeDisputes([testDispute()]);
    let now = new Date("2026-11-05T19:02:20.000Z"); // 16 seconds after PayPal's change
    const { run } = checker(paypal, db, () => now);
    await run();
    now = new Date("2026-11-05T19:07:20.000Z");
    expect(await run()).toMatchObject({ readInFull: 1, newEntries: 0 });
    expect(await run()).toMatchObject({ readInFull: 0, newEntries: 0 });
    expect(paypal.state.reads).toBe(2);
  });

  it("reads a copy stored the older way once again, logging nothing new", async () => {
    const { dealId } = await createPaidTestDeal(db);
    const paypal = fakeDisputes([testDispute()]);
    const { run } = checker(paypal);
    await run();
    await db.query(`UPDATE disputes SET details = details - 'readVersion'`);
    expect(await run()).toMatchObject({ readInFull: 1, newEntries: 0 });
    expect(await run()).toMatchObject({ readInFull: 0, newEntries: 0 });
    expect(paypal.state.reads).toBe(2);
    expect(await disputeTypes(dealId)).toEqual(["DISPUTE_OPENED"]);
    expect((await getDispute(db, "PP-R-TEST-1"))?.details).toMatchObject({ readVersion: 2 });
  });

  it("reads a dispute again when PayPal changed it and logs the change and the decision", async () => {
    const { dealId } = await createPaidTestDeal(db);
    const paypal = fakeDisputes([testDispute()]);
    const { run } = checker(paypal);
    await run();
    paypal.disputes[0] = testDispute({
      status: "RESOLVED",
      stage: "CHARGEBACK",
      updatedAt: "2026-11-06T10:00:00.000Z",
      outcome: "RESOLVED_SELLER_FAVOUR",
    });
    expect(await run()).toMatchObject({ readInFull: 1, newEntries: 2 });
    expect(await disputeTypes(dealId)).toEqual([
      "DISPUTE_OPENED",
      "DISPUTE_UPDATED",
      "DISPUTE_RESOLVED",
    ]);
  });

  it("matches by the invoice the dispute names, which PayPal gives as the invoice id", async () => {
    const { dealId } = await createPaidTestDeal(db, { transactionId: "TX-OTHER" });
    const paypal = fakeDisputes([
      testDispute({
        transactions: [
          {
            sellerTransactionId: "TX-UNKNOWN",
            buyerTransactionId: undefined,
            invoiceNumber: "INV2-TEST-PAID",
          },
        ],
      }),
    ]);
    await checker(paypal).run();
    expect(await getDispute(db, "PP-R-TEST-1")).toMatchObject({
      dealId,
      matchedBy: "invoice-number",
    });
  });

  it("keeps a dispute that matches no deal, and ties it once its payment is recorded", async () => {
    const paypal = fakeDisputes([testDispute()]);
    const { run, lines } = checker(paypal);
    expect(await run()).toMatchObject({ matched: 0, unmatched: 1, newEntries: 0 });
    expect(lines.join("\n")).toContain("no-paid-stage");
    const { dealId } = await createPaidTestDeal(db);
    // PayPal has not changed it, so it is matched from the stored copy without reading it again.
    expect(await run()).toMatchObject({ readInFull: 0, matched: 1, unmatched: 0, newEntries: 1 });
    expect(paypal.state.reads).toBe(1);
    expect(await disputeTypes(dealId)).toEqual(["DISPUTE_OPENED"]);
    expect((await getDispute(db, "PP-R-TEST-1"))?.details).toMatchObject({
      messages: [{ content: "Not the style I wanted" }],
    });
  });

  it("records a failed check with PayPal's status only, and throws so the run is retried", async () => {
    const paypal = fakeDisputes([testDispute()]);
    paypal.state.down = true;
    const { run } = checker(paypal);
    await expect(run()).rejects.toThrow();
    expect(await latestDisputeCheck(db)).toMatchObject({
      failure: "PayPal did not answer in time",
      listed: null,
    });
  });
});

describe("failureCode", () => {
  it("names PayPal's status and error, never its text", () => {
    const refused = new PayPalApiError("GET", 403, "NOT_AUTHORIZED", "secret words", [], "dbg");
    expect(failureCode(refused)).toBe("PayPal answered 403 NOT_AUTHORIZED");
    expect(failureCode(new PayPalApiError("GET", 500, undefined, undefined, [], undefined))).toBe(
      "PayPal answered 500",
    );
    expect(failureCode(new Error("boom"))).toBe("the check failed inside PactPal");
  });
});
