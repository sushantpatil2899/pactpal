import { listNotifications, listMessages, readLedger } from "@pactpal/db";
import {
  TEST_NOW,
  createSignedTestDeal,
  testId,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { describe, expect, it, vi } from "vitest";
import { capturingEmail } from "../email/email-test-support.js";
import { memoryBus } from "./bus.js";
import { sendTimelineReminders } from "./reminders.js";

const db = useMigratedTestDatabase();

describe("timeline reminders (7l)", () => {
  it("remind whoever a step waits for, once a day, in the chat, the app and by email", async () => {
    const deal = await createSignedTestDeal(db, {
      timeline: [
        { kind: "payment", stage: 1 },
        { kind: "review", text: "Pencil sketch", dueDate: "2026-10-03" },
        { kind: "other", owner: "buyer", text: "Pick a font", dueDate: "2026-09-30" },
        { kind: "payment", stage: 2 },
        { kind: "other", owner: "buyer", text: "Later", dueDate: "2026-12-01" },
      ],
    });
    const { email, sent } = capturingEmail();
    let ids = 700;
    const log = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
    const run = () =>
      sendTimelineReminders({
        db,
        bus: memoryBus(),
        email,
        publicBaseUrl: "https://pactpal.test",
        clock: () => TEST_NOW,
        newId: () => testId(ids++),
        log,
      });

    expect(await run()).toEqual({ sent: 2 });
    const cards = (await listMessages(db, deal.dealId)).map((m) => m.body);
    expect(cards).toEqual([
      'Reminder: step 2 (Review (seller shares, buyer approves): "Pencil sketch") is due on 3 Oct 2026 and is waiting for the seller.',
      'Reminder: step 3 (Other step: "Pick a font") was due on 30 Sept 2026 and is waiting for the buyer.',
    ]);
    expect(sent.map((m) => [m.kind, m.to])).toEqual([
      ["notice-reminder", "maya@example.com"],
      ["notice-reminder", "chris@example.com"],
    ]);
    expect((await listNotifications(db, deal.buyer.id)).map((n) => n.kind)).toEqual(["reminder"]);
    const logged = (await readLedger(db, deal.dealId)).filter((e) => e.type === "REMINDER_SENT");
    expect(logged.map((e) => e.actor)).toEqual(["system", "system"]);

    // The same day again sends nothing more.
    expect(await run()).toEqual({ sent: 0 });
    expect(sent).toHaveLength(2);
    expect(log.error).not.toHaveBeenCalled();
  });

  it("skip deals that are not running, and log a deal that fails without stopping the rest", async () => {
    const deal = await createSignedTestDeal(db);
    const log = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
    const broken = {
      ...db,
      query: (sql: string, params?: readonly unknown[]) =>
        sql.includes("FROM milestones") ? Promise.reject(new Error("down")) : db.query(sql, params),
    };
    expect(
      await sendTimelineReminders({
        db: broken,
        bus: memoryBus(),
        email: capturingEmail().email,
        publicBaseUrl: undefined,
        clock: () => TEST_NOW,
        newId: () => testId(800),
        log,
      }),
    ).toEqual({ sent: 0 });
    expect(log.error).toHaveBeenCalledWith(
      { dealId: deal.dealId, err: "Error" },
      "Timeline reminders failed for a deal",
    );
  });
});
