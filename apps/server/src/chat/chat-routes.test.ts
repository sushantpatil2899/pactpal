import { addArtifact, createUser, postgresContentStore, readLedger } from "@pactpal/db";
import {
  TEST_NOW,
  addTestFile,
  createTestDeal,
  testId,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors, dealTestApp, signedInAs } from "../deals/test-app.js";
import { CHAT_TRANSCRIPT_PREFIX } from "./chat-routes.js";

const db = useMigratedTestDatabase();

interface MessageBody {
  seq: number;
  role: string;
  name: string;
  body: string;
}

async function chatDeal() {
  const deal = await createTestDeal(db);
  const [, buyerLinkToken] = await buyerVisitors(db, deal.dealId, deal.buyer.id);
  return {
    ...deal,
    sellerToken: await signedInAs(db, deal.seller.id),
    buyerLinkToken: buyerLinkToken ?? "",
    url: `/api/deals/${deal.dealId}/chat`,
  };
}

describe("the deal chat", () => {
  it("lets both sides post and read, naming each by display name or role, and logs each message", async () => {
    const deal = await chatDeal();
    const { app, call } = dealTestApp(db);
    const first = await call("POST", deal.url, deal.sellerToken, { body: "Hi! Two concepts?" });
    expect(first.statusCode).toBe(201);
    expect(first.json()).toMatchObject({
      seq: 1,
      role: "seller",
      name: "Maya Seller",
      kind: "text",
    });

    const second = await call("POST", deal.url, deal.buyerLinkToken, {
      body: "Yes please",
      clientId: "page-1-abcdef",
    });
    expect(second.json()).toMatchObject({ seq: 2, role: "buyer", name: "Buyer" });

    const read = await call("GET", `${deal.url}?after=1`, deal.buyerLinkToken);
    expect(read.json<{ role: string; open: boolean; messages: MessageBody[] }>()).toMatchObject({
      role: "buyer",
      open: true,
      messages: [{ seq: 2, body: "Yes please" }],
    });
    const types = (await readLedger(db, deal.dealId)).map((entry) => entry.type);
    expect(types.filter((type) => type === "MESSAGE_SENT")).toHaveLength(2);
    await app.close();
  });

  it("answers a retried post with the same message", async () => {
    const deal = await chatDeal();
    const { app, call } = dealTestApp(db);
    const post = () =>
      call("POST", deal.url, deal.sellerToken, { body: "Hi", clientId: "same-id-123" });
    const first = await post();
    const again = await post();
    expect(again.statusCode).toBe(200);
    expect(again.json()).toEqual(first.json());
    await app.close();
  });

  it("refuses empty or long messages, strangers, a seller by link, and floods", async () => {
    const deal = await chatDeal();
    const { app, call } = dealTestApp(db);
    expect((await call("POST", deal.url, deal.sellerToken, { body: "  " })).json()).toEqual({
      error: "invalid",
      fields: ["body"],
    });
    expect(
      (await call("POST", deal.url, deal.sellerToken, { body: "x".repeat(4001) })).statusCode,
    ).toBe(400);
    expect((await call("GET", `${deal.url}?after=-1`, deal.sellerToken)).statusCode).toBe(400);
    expect((await call("POST", deal.url, undefined, { body: "Hi" })).statusCode).toBe(401);
    await createUser(db, { id: testId(9), email: "x@example.com" }, TEST_NOW);
    const stranger = await signedInAs(db, testId(9));
    expect((await call("GET", deal.url, stranger)).statusCode).toBe(404);

    const answers = [];
    for (let n = 0; n < 21; n++) {
      answers.push(
        (await call("POST", deal.url, deal.buyerLinkToken, { body: `m${String(n)}` })).statusCode,
      );
    }
    expect(answers.at(-1)).toBe(429);
    expect(answers.filter((status) => status === 201)).toHaveLength(20);
    await app.close();
  });

  it("closes the chat of a cancelled deal", async () => {
    const deal = await chatDeal();
    await db.query("UPDATE deals SET status = 'cancelled' WHERE id = $1", [deal.dealId]);
    const { app, call } = dealTestApp(db);
    const res = await call("POST", deal.url, deal.sellerToken, { body: "Hi" });
    expect(res.statusCode).toBe(409);
    expect((await call("GET", deal.url, deal.sellerToken)).json()).toMatchObject({ open: false });
    await app.close();
  });

  it("shows both sides the pasted chats, not the buyer's files or PactPal's own transcripts", async () => {
    const deal = await chatDeal();
    const text = (words: string) => new TextEncoder().encode(words);
    await addTestFile(
      db,
      deal,
      {
        id: testId(300),
        kind: "source",
        filename: "whatsapp.txt",
        bytes: text("Maya: hi\nChris: hello"),
      },
      TEST_NOW,
    );
    await addTestFile(
      db,
      deal,
      {
        id: testId(301),
        kind: "source",
        filename: `${CHAT_TRANSCRIPT_PREFIX}1.txt`,
        bytes: text("x"),
      },
      TEST_NOW,
    );
    await addArtifact(
      db,
      postgresContentStore(db, () => TEST_NOW),
      {
        id: testId(302),
        dealId: deal.dealId,
        kind: "source",
        filename: "notes.txt",
        bytes: text("buyer notes"),
        addedBy: { actor: "buyer", actorId: deal.buyer.id },
      },
      TEST_NOW,
    );
    const { app, call } = dealTestApp(db);
    const res = await call("GET", `${deal.url}/pasted`, deal.buyerLinkToken);
    expect(res.json()).toEqual({
      chats: [
        {
          id: testId(300),
          filename: "whatsapp.txt",
          addedBy: "seller",
          addedAt: TEST_NOW.toISOString(),
          text: "Maya: hi\nChris: hello",
        },
      ],
    });
    await app.close();
  });
});
