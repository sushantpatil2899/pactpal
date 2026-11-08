import { sha256Hex } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import {
  MAX_MESSAGES_PER_DEAL,
  MESSAGE_PAGE_SIZE,
  listMessages,
  postMessage,
  postNotice,
  readLedger,
  verifyStoredLedger,
} from "./index.js";
import {
  TEST_NOW,
  createTestDeal,
  minutesAfterTestNow,
  refusalMatching,
  testId,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();
const refusal = (reason: string) => refusalMatching("ChatNotAllowedError", reason);

describe("deal chat", () => {
  it("saves messages from both sides in order, each with a log entry holding its fingerprint", async () => {
    const { seller, buyer, dealId } = await createTestDeal(db);
    const first = await postMessage(
      db,
      { id: testId(500), dealId, authorId: seller.id, body: "  Hi Chris, logo by Friday?  " },
      TEST_NOW,
    );
    const second = await postMessage(
      db,
      {
        id: testId(501),
        dealId,
        authorId: buyer.id,
        body: "Yes, two concepts please",
        ip: "198.51.100.7",
        userAgent: "Test browser",
      },
      minutesAfterTestNow(1),
    );

    expect(first.message).toMatchObject({
      seq: 1,
      role: "seller",
      body: "Hi Chris, logo by Friday?",
    });
    expect(second.message).toMatchObject({ seq: 2, role: "buyer", kind: "text", notice: null });
    const entry = (await readLedger(db, dealId)).at(-1);
    expect(entry).toMatchObject({
      type: "MESSAGE_SENT",
      actor: "buyer",
      actorId: buyer.id,
      ip: "198.51.100.7",
      userAgent: "Test browser",
      payload: {
        messageId: testId(501),
        seq: 2,
        bodySha256: sha256Hex("Yes, two concepts please"),
        chars: 24,
      },
    });
    expect(second.message.ledgerSeq).toBe(entry?.seq);
    expect((await listMessages(db, dealId)).map((m) => m.seq)).toEqual([1, 2]);
    expect((await listMessages(db, dealId, 1)).map((m) => m.id)).toEqual([testId(501)]);
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
  });

  it("returns the same message for a repeated client id and writes nothing more", async () => {
    const { buyer, dealId } = await createTestDeal(db);
    const post = (id: number) =>
      postMessage(
        db,
        { id: testId(id), dealId, authorId: buyer.id, body: "Hello", clientId: "page-abc-123" },
        TEST_NOW,
      );
    const first = await post(500);
    const again = await post(501);
    expect(first.created).toBe(true);
    expect(again).toEqual({ message: first.message, created: false });
    expect(await listMessages(db, dealId)).toHaveLength(1);
  });

  it("refuses people outside the deal, closed deals and a full chat", async () => {
    const { seller, dealId } = await createTestDeal(db);
    await expect(
      postMessage(db, { id: testId(500), dealId, authorId: testId(9), body: "Hi" }, TEST_NOW),
    ).rejects.toEqual(refusal("not-your-deal"));

    await db.query("UPDATE deals SET status = 'cancelled' WHERE id = $1", [dealId]);
    await expect(
      postMessage(db, { id: testId(501), dealId, authorId: seller.id, body: "Hi" }, TEST_NOW),
    ).rejects.toEqual(refusal("closed"));
  });

  it("refuses a message once the deal has the most allowed", async () => {
    const { seller, dealId } = await createTestDeal(db);
    await db.query(
      `INSERT INTO deal_messages (id, deal_id, seq, role, kind, body, body_sha256, notice, created_at)
       SELECT gen_random_uuid(), $1, n, 'system', 'notice', 'x', $2, '{"type":"step"}', $3
         FROM generate_series(1, $4::int) AS n`,
      [dealId, sha256Hex("x"), TEST_NOW, MAX_MESSAGES_PER_DEAL],
    );
    await expect(
      postMessage(db, { id: testId(500), dealId, authorId: seller.id, body: "Hi" }, TEST_NOW),
    ).rejects.toEqual(refusal("too-many"));
    expect(await listMessages(db, dealId)).toHaveLength(MESSAGE_PAGE_SIZE);
  });

  it("posts PactPal's cards inside the caller's transaction, pointing at the entry they announce", async () => {
    const { seller, dealId } = await createTestDeal(db);
    await postMessage(db, { id: testId(500), dealId, authorId: seller.id, body: "Hi" }, TEST_NOW);
    const card = await db.transaction((tx) =>
      postNotice(
        tx,
        {
          id: testId(501),
          dealId,
          body: "Version 2 is ready for your review.",
          notice: { type: "review-requested", version: 2 },
          ledgerSeq: 0,
        },
        TEST_NOW,
      ),
    );
    expect(card).toMatchObject({
      seq: 2,
      role: "system",
      kind: "notice",
      authorId: null,
      notice: { type: "review-requested", version: 2 },
      ledgerSeq: 0,
    });
  });

  it("keeps messages unchangeable and refuses one whose text no longer matches", async () => {
    const { seller, dealId } = await createTestDeal(db);
    await postMessage(db, { id: testId(500), dealId, authorId: seller.id, body: "Hi" }, TEST_NOW);
    await expect(db.query("UPDATE deal_messages SET body = 'Bye'")).rejects.toThrow(/append-only/);
    await expect(db.query("DELETE FROM deal_messages")).rejects.toThrow(/append-only/);

    // Bypassing the guard, as someone with database access could, is caught when read.
    await db.query("ALTER TABLE deal_messages DISABLE TRIGGER deal_messages_append_only");
    await db.query("UPDATE deal_messages SET body = 'Bye'");
    await expect(listMessages(db, dealId)).rejects.toThrow(/does not match its fingerprint/);
  });
});
