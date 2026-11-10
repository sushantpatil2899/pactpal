import { describe, expect, it } from "vitest";
import { lastMessages, postMessage } from "./index.js";
import {
  createTwoTestDeals,
  minutesAfterTestNow,
  testId,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();

describe("each deal's newest message", () => {
  it("reads the newest message of several deals at once and leaves out deals with none", async () => {
    const { seller, buyer, dealId, secondId } = await createTwoTestDeals(db);
    const say = (n: number, authorId: string, body: string, minutes: number) =>
      postMessage(
        db,
        { id: testId(500 + n), dealId, authorId, body },
        minutesAfterTestNow(minutes),
      );
    await say(0, seller.id, "Logo by Friday?", 0);
    await say(1, buyer.id, "Yes, two concepts please", 5);

    const newest = await lastMessages(db, [dealId, secondId]);

    expect([...newest.keys()]).toEqual([dealId]);
    expect(newest.get(dealId)).toMatchObject({
      seq: 2,
      role: "buyer",
      body: "Yes, two concepts please",
    });
  });

  it("reads nothing for no deals", async () => {
    expect((await lastMessages(db, [])).size).toBe(0);
  });
});
