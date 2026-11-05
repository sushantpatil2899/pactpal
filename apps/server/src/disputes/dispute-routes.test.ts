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
async function paidDeal(disputes?: DisputeChecker | "none") {
  const deal = await createPaidTestDeal(db);
  const paypal = fakeDisputes([testDispute()]);
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
});
