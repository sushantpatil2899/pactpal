import { createDeal, createUser, postMessage, readPositions } from "@pactpal/db";
import {
  TEST_NOW,
  createTestDeal,
  createTwoTestDeals,
  minutesAfterTestNow,
  testDeal,
  testId,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { preview } from "./conversation-routes.js";
import { buyerVisitors, dealTestApp, signedInAs } from "./test-app.js";

const db = useMigratedTestDatabase();
const URL = "/api/conversations";

interface Conversation {
  dealId: string;
  last: { seq: number; role: string; kind: string; text: string; at: string } | null;
}
const list = (res: { json: () => unknown }) =>
  (res.json() as { conversations: Conversation[] }).conversations;

describe("conversations route", () => {
  it("lists the newest message of each of the person's deals, and moves no read position", async () => {
    const { seller, buyer, dealId, secondId } = await createTwoTestDeals(db);
    await postMessage(
      db,
      { id: testId(500), dealId, authorId: buyer.id, body: "Can you do it by Friday?" },
      minutesAfterTestNow(2),
    );
    const { app, call } = dealTestApp(db);

    const res = await call("GET", URL, await signedInAs(db, seller.id));

    expect(res.statusCode).toBe(200);
    const rows = list(res);
    expect(rows.map((row) => row.dealId).sort()).toEqual([dealId, secondId].sort());
    expect(rows.find((row) => row.dealId === dealId)?.last).toEqual({
      seq: 1,
      role: "buyer",
      kind: "text",
      text: "Can you do it by Friday?",
      at: minutesAfterTestNow(2).toISOString(),
    });
    expect(rows.find((row) => row.dealId === secondId)?.last).toBeNull();
    expect(await readPositions(db, { id: dealId, sellerId: seller.id, buyerId: buyer.id })).toEqual(
      { seller: 0, buyer: 0 },
    );
    await app.close();
  });

  it("shows a buyer link only its own deal, someone else nothing, no one signed out, and 503 offline", async () => {
    const { seller, buyer, dealId } = await createTestDeal(db);
    await createDeal(db, testDeal(seller.id, { id: testId(101), title: "Banner" }), TEST_NOW);
    const stranger = await createUser(db, { id: testId(9), email: "sam@example.com" }, TEST_NOW);
    const { app, call } = dealTestApp(db);

    const [, linkToken = ""] = await buyerVisitors(db, dealId, buyer.id);
    expect(list(await call("GET", URL, linkToken)).map((row) => row.dealId)).toEqual([dealId]);
    expect(list(await call("GET", URL, await signedInAs(db, stranger.id)))).toEqual([]);
    expect((await call("GET", URL)).statusCode).toBe(401);
    await app.close();

    const offline = dealTestApp(undefined);
    expect((await offline.call("GET", URL, linkToken)).statusCode).toBe(503);
    await offline.app.close();
  });
});

describe("a message preview", () => {
  it("keeps a short message whole, on one line", () => {
    expect(preview("  Logo by\n\nFriday?  ")).toBe("Logo by Friday?");
  });

  it("cuts a long message at a word and marks the cut", () => {
    expect(preview("one two three four five six", 15)).toBe("one two three…");
    expect(preview("x".repeat(30), 10)).toBe(`${"x".repeat(10)}…`);
  });
});
