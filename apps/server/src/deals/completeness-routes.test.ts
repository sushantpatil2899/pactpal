import { saveScopeVersion } from "@pactpal/db";
import {
  TEST_NOW,
  createSignedTestDeal,
  createTestDeal,
  testId,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import type { Completeness } from "@pactpal/score";
import { describe, expect, it } from "vitest";
import { buyerVisitors, dealTestApp, signedInAs } from "./test-app.js";

const db = useMigratedTestDatabase();

const item = (result: Completeness, id: string) => result.items.find((i) => i.id === id);

describe("evidence completeness route", () => {
  it("scores a signed deal from its signed version, for the seller only", async () => {
    const deal = await createSignedTestDeal(db);
    const { app, call } = dealTestApp(db);
    const seller = await signedInAs(db, deal.seller.id);
    const url = `/api/deals/${deal.dealId}/completeness`;
    const res = await call("GET", url, seller);
    expect(res.statusCode).toBe(200);
    const result = res.json<Completeness>();
    expect(result).toMatchObject({ score: 10, measurable: 81 });
    expect(item(result, "acceptance")).toMatchObject({
      earned: 10,
      status: "missing",
      fix: "Email the receipt again from the Agreement section.",
    });
    expect(item(result, "exclusions")?.fix).toContain("only a new signed version");
    expect(item(result, "approvals")?.detail).toBe("0 of 2 stages");

    const [buyerPayPal = "", buyerLink = ""] = await buyerVisitors(db, deal.dealId, deal.buyer.id);
    expect((await call("GET", url, buyerPayPal)).statusCode).toBe(403);
    expect((await call("GET", url, buyerLink)).statusCode).toBe(403);
    expect((await call("GET", url)).statusCode).toBe(401);
    expect((await call("GET", `/api/deals/${testId(999)}/completeness`, seller)).statusCode).toBe(
      404,
    );
    await app.close();
  });

  it("scores a draft from its newest version, and a deal with no agreed work as 0", async () => {
    const { seller, dealId } = await createTestDeal(db);
    const { app, call } = dealTestApp(db);
    const token = await signedInAs(db, seller.id);
    const url = `/api/deals/${dealId}/completeness`;
    const empty = (await call("GET", url, token)).json<Completeness>();
    expect(empty.score).toBe(0);
    expect(item(empty, "exclusions")?.fix).toBe("Save the agreed work first.");

    await saveScopeVersion(
      db,
      {
        dealId,
        sellerId: seller.id,
        content: {
          format: 1,
          summary: "A logo",
          deliverables: ["Logo files"],
          exclusions: ["No merchandise use"],
          milestones: [{ title: "All", amountMinor: 10_000 }],
        },
      },
      TEST_NOW,
    );
    const draft = (await call("GET", url, token)).json<Completeness>();
    expect(draft.score).toBe(8);
    expect(item(draft, "exclusions")?.status).toBe("helping");
    expect(item(draft, "acceptance")?.fix).toBe("Send the agreed work to the buyer to sign.");
    expect(item(draft, "approvals")?.detail).toBe("0 of 1 stage");
    await app.close();
  });
});
