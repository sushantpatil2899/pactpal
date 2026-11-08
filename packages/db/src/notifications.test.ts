import { describe, expect, it } from "vitest";
import {
  addNotification,
  listNotifications,
  markNotificationsRead,
  type NotificationKind,
} from "./index.js";
import {
  TEST_NOW,
  createTestDeal,
  minutesAfterTestNow,
  testId,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();

/** The test deal, and a way to add notification `n` for its buyer at a given minute. */
async function buyerNotes() {
  const deal = await createTestDeal(db);
  const add = (n: number, kind: NotificationKind, text: string, minutes = 0) =>
    addNotification(
      db,
      {
        id: testId(800 + n),
        userId: deal.buyer.id,
        dealId: deal.dealId,
        kind,
        tab: kind === "message" ? "chat" : "scope",
        text,
      },
      minutesAfterTestNow(minutes),
    );
  return { ...deal, add };
}

describe("notifications", () => {
  it("lists a person's notifications, unread first, newest first", async () => {
    const { buyer, seller, add } = await buyerNotes();
    expect(await add(1, "review-requested", "note 1", 0)).toEqual({ created: true });
    expect(await add(2, "message", "note 2", 1)).toEqual({ created: true });
    // A second message while one is unread folds into it.
    expect(await add(3, "message", "note 3", 2)).toEqual({ created: false });
    const readAt = minutesAfterTestNow(3);
    expect(await markNotificationsRead(db, buyer.id, { ids: [testId(801)] }, readAt)).toBe(1);

    const listed = await listNotifications(db, buyer.id);
    expect(listed.map((n) => [n.text, n.readAt?.toISOString() ?? null])).toEqual([
      ["note 2", null],
      ["note 1", readAt.toISOString()],
    ]);
    expect(await listNotifications(db, seller.id)).toEqual([]);
    expect(await listNotifications(db, buyer.id, testId(999))).toEqual([]);
  });

  it("marks one deal's notifications read, optionally of one kind, and stops folding once read", async () => {
    const { buyer, dealId, add } = await buyerNotes();
    await add(1, "message", "a");
    await add(2, "step", "b");
    const read = (kind?: NotificationKind) =>
      markNotificationsRead(db, buyer.id, kind ? { dealId, kind } : { dealId }, TEST_NOW);
    expect(await read("message")).toBe(1);
    expect(await read("message")).toBe(0);
    expect(await add(3, "message", "c")).toEqual({ created: true });
    expect(await read()).toBe(2);
  });

  it("cuts long words to 300 characters", async () => {
    const { buyer, add } = await buyerNotes();
    await add(1, "message", "x".repeat(400));
    const [note] = await listNotifications(db, buyer.id);
    expect(note?.text).toHaveLength(300);
    expect(note?.text.endsWith("…")).toBe(true);
  });
});
