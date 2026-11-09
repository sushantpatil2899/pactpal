import { postMessage, readLedger, recordStepUpdate } from "@pactpal/db";
import {
  TEST_NOW,
  createSignedTestDeal,
  testId,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { verifyChain } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import { recordEntries } from "./record-entries.js";

const db = useMigratedTestDatabase();

describe("the deal's record for disputes (7m)", () => {
  it("fills in chat words and step notes, leaving every position and the stored log as they are", async () => {
    const deal = await createSignedTestDeal(db, {
      timeline: [
        { kind: "payment", stage: 1 },
        { kind: "review", text: "Sketch" },
        { kind: "payment", stage: 2 },
      ],
    });
    await postMessage(
      db,
      { id: testId(500), dealId: deal.dealId, authorId: deal.buyer.id, body: "Looks great" },
      TEST_NOW,
    );
    await recordStepUpdate(
      db,
      {
        id: testId(501),
        dealId: deal.dealId,
        actorId: deal.seller.id,
        step: 2,
        status: "submitted",
        note: "Pose A",
      },
      TEST_NOW,
    );
    const filled = await recordEntries(db, deal.dealId);
    const stored = await readLedger(db, deal.dealId);
    expect(filled.map((e) => e.seq)).toEqual(stored.map((e) => e.seq));
    expect(filled.find((e) => e.type === "MESSAGE_SENT")?.payload).toMatchObject({
      message: "Looks great",
    });
    expect(filled.find((e) => e.type === "STEP_SUBMITTED")?.payload).toMatchObject({
      note: "Pose A",
    });
    // The stored log still verifies; the words are added for reading only.
    expect(verifyChain(stored).valid).toBe(true);
    expect(stored.find((e) => e.type === "MESSAGE_SENT")?.payload).not.toHaveProperty("message");
  });
});
