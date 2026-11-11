import {
  TEST_NOW,
  createSignedTestDeal,
  createTestDeal,
  linkTestDispute,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors, dealTestApp, signedInAs } from "./test-app.js";

const db = useMigratedTestDatabase();
const URL = "/api/deals/overview";

interface Row {
  id: string;
  role: string;
  stage: string;
  next: { text: string; waitingOn: string; step: number | null } | null;
  amount: { minor: number; text: string } | null;
  completeness: number | null;
  unreadMessages: number;
  unreadNotifications: number;
  stepsTotal: number;
  dispute: { disputeId: string; respondBy: string | null } | null;
  updatedAt: string;
}
const rows = (res: { json: () => unknown }) => (res.json() as { deals: Row[] }).deals;

describe("deals overview route", () => {
  it("describes a draft with nothing agreed yet", async () => {
    const { seller, dealId } = await createTestDeal(db);
    const { app, call } = dealTestApp(db);
    const res = await call("GET", URL, await signedInAs(db, seller.id));
    expect(res.statusCode).toBe(200);
    expect(rows(res)).toMatchObject([
      {
        id: dealId,
        role: "seller",
        stage: "drafting",
        next: { waitingOn: "seller", step: null },
        amount: null,
        completeness: 0,
        unreadMessages: 0,
        unreadNotifications: 0,
        stepsTotal: 0,
        dispute: null,
      },
    ]);
    expect((await call("GET", URL)).statusCode).toBe(401);
    await app.close();
  });

  it("follows a signed deal's timeline, and keeps the score and disputes for the seller", async () => {
    const deal = await createSignedTestDeal(db);
    const { app, call } = dealTestApp(db);
    const seller = await signedInAs(db, deal.seller.id);
    const [mine] = rows(await call("GET", URL, seller));
    expect(mine).toMatchObject({
      id: deal.dealId,
      stage: "in_progress",
      next: { waitingOn: "seller", step: 1 },
      completeness: 14,
      dispute: null,
    });
    expect(mine?.next?.text).toContain("Send the PayPal invoice");
    expect(mine?.amount?.minor).toBeGreaterThan(0);
    expect(mine?.stepsTotal).toBeGreaterThan(0);
    expect(Date.parse(mine?.updatedAt ?? "")).not.toBeNaN();

    await linkTestDispute(db, deal.dealId, TEST_NOW);
    const [disputed] = rows(await call("GET", URL, seller));
    expect(disputed?.stage).toBe("disputed");
    expect(disputed?.dispute?.disputeId).toEqual(expect.any(String));

    const [buyerPayPal = "", buyerLink = ""] = await buyerVisitors(db, deal.dealId, deal.buyer.id);
    for (const token of [buyerPayPal, buyerLink]) {
      const [theirs] = rows(await call("GET", URL, token));
      expect(theirs).toMatchObject({
        id: deal.dealId,
        role: "buyer",
        stage: "in_progress",
        completeness: null,
        dispute: null,
      });
    }
    await app.close();
  });

  it("answers 503 without a database", async () => {
    const { app, call } = dealTestApp(undefined);
    expect((await call("GET", URL)).statusCode).toBe(503);
    await app.close();
  });
});
