import { sha256Hex } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import {
  listMessages,
  listStepUpdates,
  readLedger,
  recordReminder,
  recordStepUpdate,
  runningDealIds,
  verifyStoredLedger,
} from "./index.js";
import {
  TEST_NOW,
  addTestFile,
  createAwaitingTestDeal,
  createSignedTestDeal,
  minutesAfterTestNow,
  refusalMatching,
  testId,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();
const refusal = (reason: string) => refusalMatching("StepNotAllowedError", reason);

/** A signed deal whose timeline is: deposit, sketch review, a buyer step, final payment. */
async function runningDeal() {
  const deal = await createSignedTestDeal(db, {
    timeline: [
      { kind: "payment", stage: 1 },
      { kind: "review", text: "Pencil sketch" },
      { kind: "other", owner: "buyer", text: "Confirm the print size" },
      { kind: "payment", stage: 2 },
    ],
  });
  let n = 900;
  const update = (
    who: { id: string },
    step: number,
    status: "submitted" | "approved" | "changes" | "done",
    extra: { note?: string; fileIds?: string[] } = {},
  ) =>
    recordStepUpdate(
      db,
      { id: testId(n++), dealId: deal.dealId, actorId: who.id, step, status, ...extra },
      minutesAfterTestNow(n - 900),
    );
  return { ...deal, update };
}

describe("timeline step updates", () => {
  it("records a review shared, sent back, shared again and approved, each in the log", async () => {
    const deal = await runningDeal();
    const file = await addTestFile(
      db,
      deal,
      {
        id: testId(300),
        kind: "source",
        filename: "sketch.png",
        bytes: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
      },
      TEST_NOW,
    );
    const shared = await deal.update(deal.seller, 2, "submitted", {
      note: "Two poses",
      fileIds: [file.id],
    });
    expect(shared.entry).toMatchObject({
      type: "STEP_SUBMITTED",
      actor: "seller",
      payload: {
        version: 1,
        step: 2,
        kind: "review",
        files: [{ id: file.id, sha256: file.sha256 }],
        noteSha256: sha256Hex("Two poses"),
      },
    });
    await deal.update(deal.buyer, 2, "changes", { note: "Smile, please" });
    await deal.update(deal.seller, 2, "submitted");
    const approved = await deal.update(deal.buyer, 2, "approved");
    expect(approved.entry.type).toBe("STEP_APPROVED");
    await deal.update(deal.buyer, 3, "done");

    const updates = await listStepUpdates(db, deal.dealId);
    expect(updates.map((u) => [u.step, u.status, u.actor, u.note])).toEqual([
      [2, "submitted", "seller", "Two poses"],
      [2, "changes", "buyer", "Smile, please"],
      [2, "submitted", "seller", null],
      [2, "approved", "buyer", null],
      [3, "done", "buyer", null],
    ]);
    expect(updates[0]?.files).toEqual([
      { id: file.id, filename: "sketch.png", sha256: file.sha256 },
    ]);
    const types = (await readLedger(db, deal.dealId)).map((e) => e.type);
    expect(types.filter((t) => t.startsWith("STEP_"))).toEqual([
      "STEP_SUBMITTED",
      "STEP_CHANGES_REQUESTED",
      "STEP_SUBMITTED",
      "STEP_APPROVED",
      "STEP_DONE",
    ]);
    expect((await verifyStoredLedger(db, deal.dealId)).valid).toBe(true);
  });

  it("refuses the wrong side, the wrong moment, payments, unknown steps and other deals' files", async () => {
    const deal = await runningDeal();
    await expect(deal.update(deal.buyer, 2, "submitted")).rejects.toEqual(refusal("not-allowed"));
    await expect(deal.update(deal.buyer, 2, "approved")).rejects.toEqual(refusal("not-allowed"));
    await expect(deal.update(deal.seller, 3, "done")).rejects.toEqual(refusal("not-allowed"));
    await expect(deal.update(deal.buyer, 1, "done")).rejects.toEqual(refusal("not-allowed"));
    await expect(deal.update(deal.seller, 9, "done")).rejects.toEqual(refusal("no-step"));
    await expect(deal.update({ id: testId(9) }, 2, "submitted")).rejects.toEqual(
      refusal("not-your-deal"),
    );
    await expect(
      deal.update(deal.seller, 2, "submitted", { fileIds: [testId(999)] }),
    ).rejects.toEqual(refusal("no-file"));
    await deal.update(deal.buyer, 3, "done");
    await expect(deal.update(deal.buyer, 3, "done")).rejects.toEqual(refusal("not-allowed"));
  });

  it("waits for the signature", async () => {
    const deal = await createAwaitingTestDeal(db);
    await expect(
      recordStepUpdate(
        db,
        { id: testId(900), dealId: deal.dealId, actorId: deal.seller.id, step: 1, status: "done" },
        TEST_NOW,
      ),
    ).rejects.toEqual(refusal("not-running"));
  });
});

describe("timeline reminders", () => {
  it("are recorded once per step and day, logged from the system, with a card in the chat", async () => {
    const deal = await runningDeal();
    const remind = (day: string, cardId: number) =>
      recordReminder(
        db,
        {
          dealId: deal.dealId,
          step: 2,
          to: "seller",
          kind: "soon",
          dueDate: "2026-10-03",
          day,
          cardId: testId(cardId),
          words: "Reminder: step 2 is due on 3 Oct 2026.",
        },
        TEST_NOW,
      );
    expect(await remind("2026-10-02", 950)).toEqual({ created: true });
    expect(await remind("2026-10-02", 951)).toEqual({ created: false });
    expect(await remind("2026-10-03", 952)).toEqual({ created: true });
    const entries = (await readLedger(db, deal.dealId)).filter((e) => e.type === "REMINDER_SENT");
    expect(entries.map((e) => [e.actor, e.payload])).toEqual([
      ["system", { step: 2, to: "seller", kind: "soon", dueDate: "2026-10-03", day: "2026-10-02" }],
      ["system", { step: 2, to: "seller", kind: "soon", dueDate: "2026-10-03", day: "2026-10-03" }],
    ]);
    const cards = await listMessages(db, deal.dealId);
    expect(cards.map((m) => [m.role, m.notice])).toEqual([
      ["system", { type: "reminder", step: 2 }],
      ["system", { type: "reminder", step: 2 }],
    ]);
    expect(await runningDealIds(db)).toEqual([deal.dealId]);
  });
});
