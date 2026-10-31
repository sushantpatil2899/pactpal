import { readLedger } from "@pactpal/db";
import { TEST_NOW, createTestDeal, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors, dealTestApp, signedInAs } from "./test-app.js";

const db = useMigratedTestDatabase();

const work = (overrides: object = {}) => ({
  summary: "A logo for a bakery",
  deliverables: ["Three concepts", "Final logo files"],
  exclusions: ["Printing"],
  revisionsIncluded: 2,
  milestones: [
    { title: "Concepts", amount: "100" },
    { title: "Final files", amount: "150.5", dueDate: "2026-11-20" },
  ],
  ...overrides,
});

/** The test deal (seller and buyer) and the app, with the seller signed in with PayPal. */
async function sellerDeal() {
  const { seller, buyer, dealId } = await createTestDeal(db);
  const env = dealTestApp(db);
  const url = `/api/deals/${dealId}/scope`;
  return { ...env, seller, buyer, dealId, url, token: await signedInAs(db, seller.id) };
}

describe("agreed work", () => {
  it("has none until the seller saves it, then shows each new version with amounts as text", async () => {
    const { app, call, url, token, dealId } = await sellerDeal();
    expect((await call("GET", url, token)).json()).toEqual({ scope: null });

    const first = await call("POST", url, token, work());
    expect(first.statusCode).toBe(201);
    expect(first.json()).toEqual({
      scope: {
        version: 1,
        contentSha256: expect.stringMatching(/^[0-9a-f]{64}$/) as unknown,
        savedAt: TEST_NOW.toISOString(),
        currency: "USD",
        summary: "A logo for a bakery",
        deliverables: ["Three concepts", "Final logo files"],
        exclusions: ["Printing"],
        revisionsIncluded: 2,
        dueDate: null,
        milestones: [
          { title: "Concepts", amount: { minor: 10_000, text: "100.00" }, dueDate: null },
          {
            title: "Final files",
            amount: { minor: 15_050, text: "150.50" },
            dueDate: "2026-11-20",
          },
        ],
        total: { minor: 25_050, text: "250.50" },
      },
    });

    await call("POST", url, token, work({ summary: "A logo and a sign" }));
    expect((await call("GET", url, token)).json()).toMatchObject({
      scope: { version: 2, summary: "A logo and a sign" },
    });
    expect((await readLedger(db, dealId)).map((e) => e.type)).toEqual([
      "DEAL_CREATED",
      "SCOPE_VERSIONED",
      "SCOPE_VERSIONED",
    ]);
    await app.close();
  });

  it("lets the buyer and a buyer-link visitor read it but not save it", async () => {
    const { app, call, url, token, buyer, dealId } = await sellerDeal();
    await call("POST", url, token, work());
    for (const visitor of await buyerVisitors(db, dealId, buyer.id)) {
      expect((await call("GET", url, visitor)).json()).toMatchObject({ scope: { version: 1 } });
      expect((await call("POST", url, visitor, work())).statusCode).toBe(403);
    }
    await app.close();
  });

  it.each([
    [
      "an amount with three decimals",
      { milestones: [{ title: "A", amount: "1.005" }] },
      ["milestones.0.amount"],
    ],
    [
      "an amount that is not a number",
      { milestones: [{ title: "A", amount: "ten" }] },
      ["milestones.0.amount"],
    ],
    ["a zero amount", { milestones: [{ title: "A", amount: "0.00" }] }, ["milestones.0.amount"]],
    [
      "an amount over the limit",
      { milestones: [{ title: "A", amount: "1000000" }] },
      ["milestones.0.amount"],
    ],
    ["no payment stages", { milestones: [] }, ["milestones"]],
    ["no deliverables", { deliverables: [] }, ["deliverables"]],
    ["an unknown field", { price: "1" }, [""]],
  ])("refuses %s and names the field", async (_name, overrides, fields) => {
    const { app, call, url, token, dealId } = await sellerDeal();
    const res = await call("POST", url, token, work(overrides));
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ error: "invalid", fields });
    expect(await readLedger(db, dealId)).toHaveLength(1);
    await app.close();
  });

  it("refuses changes once the deal is no longer a draft", async () => {
    const { app, call, url, token, dealId } = await sellerDeal();
    await db.query("UPDATE deals SET status = 'active' WHERE id = $1", [dealId]);
    const res = await call("POST", url, token, work());
    expect(res.statusCode).toBe(409);
    await app.close();
  });

  it("answers 404 for a deal that does not exist and 401 when signed out", async () => {
    const { app, call, token } = await sellerDeal();
    const missing = `/api/deals/${testId(999)}/scope`;
    expect((await call("GET", missing, token)).statusCode).toBe(404);
    expect((await call("GET", missing)).statusCode).toBe(401);
    await app.close();
  });
});
