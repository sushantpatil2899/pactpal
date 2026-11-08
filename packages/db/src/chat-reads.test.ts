import { describe, expect, it } from "vitest";
import {
  READ_LOG_INTERVAL_MS,
  markRead,
  parseChatEvent,
  postMessage,
  publishChatEvent,
  readLedger,
  readPositions,
} from "./index.js";
import {
  TEST_NOW,
  createTestDeal,
  refusalMatching,
  testId,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();
const later = (ms: number) => new Date(TEST_NOW.getTime() + ms);

async function dealWithMessages(count: number) {
  const deal = await createTestDeal(db);
  for (let n = 0; n < count; n++) {
    await postMessage(
      db,
      { id: testId(500 + n), dealId: deal.dealId, authorId: deal.seller.id, body: `m${String(n)}` },
      TEST_NOW,
    );
  }
  return deal;
}

const readEntries = async (dealId: string) =>
  (await readLedger(db, dealId)).filter((entry) => entry.type === "MESSAGES_READ");

describe("reading the chat", () => {
  it("moves forward only, never past the last message, and logs at most once a minute", async () => {
    const { buyer, seller, dealId } = await dealWithMessages(5);
    const read = (seq: number, ms: number, flush = false) =>
      markRead(db, { dealId, userId: buyer.id, seq, flush }, later(ms));

    expect(await read(2, 0)).toMatchObject({ readSeq: 2, moved: true, entry: { actor: "buyer" } });
    expect(await read(4, 1000)).toEqual({ readSeq: 4, moved: true });
    expect(await read(1, 2000)).toEqual({ readSeq: 4, moved: false });
    expect(await read(99, READ_LOG_INTERVAL_MS)).toMatchObject({
      readSeq: 5,
      entry: { payload: { upToSeq: 5 } },
    });
    expect(await read(5, READ_LOG_INTERVAL_MS + 1, true)).toEqual({ readSeq: 5, moved: false });
    expect((await readEntries(dealId)).map((entry) => entry.payload)).toEqual([
      { upToSeq: 2 },
      { upToSeq: 5 },
    ]);
    expect(await readPositions(db, { id: dealId, sellerId: seller.id, buyerId: buyer.id })).toEqual(
      {
        seller: 0,
        buyer: 5,
      },
    );
  });

  it("logs the last position when the page closes, even within the minute", async () => {
    const { seller, dealId } = await dealWithMessages(3);
    await markRead(db, { dealId, userId: seller.id, seq: 1 }, TEST_NOW);
    await markRead(db, { dealId, userId: seller.id, seq: 3 }, later(1000));
    const closing = await markRead(
      db,
      { dealId, userId: seller.id, seq: 3, flush: true },
      later(2000),
    );
    expect(closing.entry?.payload).toEqual({ upToSeq: 3 });
    expect(await readEntries(dealId)).toHaveLength(2);
  });

  it("refuses anyone who is not a party, and reads 0 for a deal without a buyer", async () => {
    const { seller, dealId } = await dealWithMessages(1);
    await expect(markRead(db, { dealId, userId: testId(9), seq: 1 }, TEST_NOW)).rejects.toEqual(
      refusalMatching("ChatNotAllowedError", "not-your-deal"),
    );
    expect(await readPositions(db, { id: dealId, sellerId: seller.id })).toEqual({
      seller: 0,
      buyer: 0,
    });
  });
});

describe("chat events", () => {
  it("are checked before they are sent and when they arrive", async () => {
    await publishChatEvent(db, { type: "messages", dealId: testId(100) });
    await expect(
      publishChatEvent(db, { type: "messages", dealId: "not-a-deal" }),
    ).rejects.toThrow();
    expect(
      parseChatEvent(JSON.stringify({ type: "read", dealId: testId(1), role: "buyer", seq: 3 })),
    ).toEqual({
      type: "read",
      dealId: testId(1),
      role: "buyer",
      seq: 3,
    });
    expect(parseChatEvent("{")).toBeUndefined();
    expect(parseChatEvent(JSON.stringify({ type: "typing", dealId: testId(1) }))).toBeUndefined();
  });
});
