import { createPaidTestDeal, testId, useMigratedTestDatabase, TEST_NOW } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors, dealTestApp, signedInAs } from "../deals/test-app.js";
import { inProcessChecker, type DisputeChecker } from "./checker.js";
import { syncDisputes } from "./dispute-sync.js";
import { fakeDisputes, keptLog, testDispute } from "./test-support.js";

const db = useMigratedTestDatabase();

interface DisputesView {
  disputes: { disputeId: string; reason: string; paypalStage: string; sellerDueAt: string }[];
  lastCheck: { source: string; ok: boolean | null } | null;
  canCheck: boolean;
}

/** A paid deal, its seller's session and an app whose checks run in process on a fake PayPal. */
async function paidDeal(disputes?: DisputeChecker | "none", listed = [testDispute()]) {
  const deal = await createPaidTestDeal(db);
  const paypal = fakeDisputes(listed);
  let ids = 900;
  const checker =
    disputes ??
    inProcessChecker((source) =>
      syncDisputes(
        {
          db,
          disputes: paypal.reader,
          clock: () => TEST_NOW,
          newId: () => testId(ids++),
          log: keptLog().log,
        },
        source,
      ),
    );
  const env = dealTestApp(db, undefined, checker === "none" ? {} : { disputes: checker });
  const token = await signedInAs(db, deal.seller.id);
  const base = `/api/deals/${deal.dealId}/disputes`;
  return { ...deal, ...env, paypal, token, base };
}

describe("dispute routes", () => {
  it("shows the seller no disputes, then the dispute after Check now", async () => {
    const { app, call, token, base } = await paidDeal();
    const before = (await call("GET", base, token)).json<DisputesView>();
    expect(before).toEqual({ disputes: [], lastCheck: null, canCheck: true });
    const pressed = await call("POST", `${base}/check`, token);
    expect(pressed.statusCode).toBe(202);
    const after = (await call("GET", base, token)).json<DisputesView>();
    expect(after.disputes).toMatchObject([
      {
        disputeId: "PP-R-TEST-1",
        reason: "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED",
        paypalStage: "INQUIRY",
        sellerDueAt: "2026-11-25T18:58:40.000Z",
        stage: 1,
        amount: { minor: 12_000, currency: "USD" },
      },
    ]);
    expect(after.lastCheck).toMatchObject({ source: "button", ok: true });
    // The buyer's words are not part of this view.
    expect(JSON.stringify(after)).not.toContain("style");
    // A second press within 30 seconds is refused.
    expect((await call("POST", `${base}/check`, token)).statusCode).toBe(429);
    await app.close();
  });

  it("is for the seller only", async () => {
    const { app, call, base, dealId, buyer } = await paidDeal();
    for (const visitor of await buyerVisitors(db, dealId, buyer.id)) {
      expect((await call("GET", base, visitor)).statusCode).toBe(403);
      expect((await call("POST", `${base}/check`, visitor)).statusCode).toBe(403);
    }
    expect((await call("GET", base)).statusCode).toBe(401);
    await app.close();
  });

  it("says when checks are not set up", async () => {
    const off = await paidDeal("none");
    expect((await off.call("GET", off.base, off.token)).json<DisputesView>().canCheck).toBe(false);
    expect((await off.call("POST", `${off.base}/check`, off.token)).statusCode).toBe(503);
    await off.app.close();
  });

  it("says when a check could not be started", async () => {
    const broken = await paidDeal({ start: () => Promise.reject(new Error("render down")) });
    const pressed = await broken.call("POST", `${broken.base}/check`, broken.token);
    expect(pressed.statusCode).toBe(502);
    expect(broken.logs.join("")).toContain("Dispute check not started");
    await broken.app.close();
  });

  it("shows one dispute's page: the buyer's words, what PayPal allows, its log and files since", async () => {
    const opened = testDispute({ createdAt: "2026-10-01T00:00:00.000Z" });
    const unmatched = testDispute({
      disputeId: "PP-R-OTHER-2",
      transactions: [
        {
          sellerTransactionId: "TX-NOT-OURS",
          buyerTransactionId: undefined,
          invoiceNumber: undefined,
        },
      ],
    });
    const { app, call, token, base, buyer, dealId } = await paidDeal(undefined, [
      opened,
      unmatched,
    ]);
    expect((await call("POST", `${base}/check`, token)).statusCode).toBe(202);
    const [paypalBuyer = ""] = await buyerVisitors(db, dealId, buyer.id);
    const brief = Buffer.from("%PDF-1.4\nreference\n%%EOF\n");
    await call("POST", `/api/deals/${dealId}/files`, paypalBuyer, brief, {
      "content-type": "application/octet-stream",
      "x-file-name": "brief.pdf",
    });
    const page = await call("GET", `${base}/PP-R-TEST-1`, token);
    expect(page.statusCode).toBe(200);
    expect(page.json()).toMatchObject({
      disputeId: "PP-R-TEST-1",
      reason: "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED",
      paypalStage: "INQUIRY",
      invoiceId: "INV2-TEST-PAID",
      openedAt: "2026-10-01T00:00:00.000Z",
      allowedActions: ["escalate", "accept_claim", "send_message", "make_offer"],
      offerTypes: ["REFUND"],
      messagesReadable: true,
      messages: [{ from: "BUYER", postedAt: null, text: "Not the style I wanted" }],
      events: [{ type: "DISPUTE_OPENED", payload: { disputeId: "PP-R-TEST-1" } }],
      filesSince: [{ filename: "brief.pdf", addedBy: "buyer" }],
      lastCheck: { source: "button", ok: true },
      canCheck: true,
    });
    // The buyer sees no dispute pages; disputes on no deal, or unknown ones, are not found.
    expect((await call("GET", `${base}/PP-R-TEST-1`, paypalBuyer)).statusCode).toBe(403);
    expect((await call("GET", `${base}/PP-R-OTHER-2`, token)).statusCode).toBe(404);
    expect((await call("GET", `${base}/PP-R-NONE`, token)).statusCode).toBe(404);
    await app.close();
  });

  it("shows no messages for a dispute opened through PayPal's API, and says when they cannot be read", async () => {
    const { app, call, token, base } = await paidDeal(undefined, [testDispute({ messages: [] })]);
    await call("POST", `${base}/check`, token);
    const page = async () =>
      (await call("GET", `${base}/PP-R-TEST-1`, token)).json<{
        messages: unknown[];
        messagesReadable: boolean;
        filesSince: unknown[];
      }>();
    expect(await page()).toMatchObject({ messages: [], messagesReadable: true, filesSince: [] });
    await db.query(`UPDATE disputes SET details = '{"messages": "not a list"}'::jsonb`);
    expect(await page()).toMatchObject({ messages: [], messagesReadable: false });
    await app.close();
  });
});
