import { listDisputeNotices, type StoredDispute } from "@pactpal/db";
import { TEST_NOW, createPaidTestDeal, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import type { EmailMessage, EmailSender } from "@pactpal/email";
import { describe, expect, it } from "vitest";
import { capturingEmail } from "../email/email-test-support.js";
import { syncDisputes } from "./dispute-sync.js";
import { doneKeys, eventNotice, reminderNotice } from "./notices.js";
import { fakeDisputes, keptLog, testDispute } from "./test-support.js";

const db = useMigratedTestDatabase();
const HOUR = 3_600_000;
const later = (hours: number) => new Date(TEST_NOW.getTime() + hours * HOUR);

describe("which dispute emails are due", () => {
  const dispute = (dueInHours: number | null) =>
    ({
      disputeId: "PP-1",
      dealId: testId(1),
      sellerDueAt: dueInHours === null ? null : later(dueInHours),
    }) as StoredDispute;

  it("reminds at the nearest mark reached: 72, 24 or 6 hours, never before or after", () => {
    const mark = (hours: number | null) => {
      const notice = reminderNotice(dispute(hours), TEST_NOW);
      return notice?.kind === "reminder" ? notice.mark : undefined;
    };
    expect([mark(80), mark(70), mark(23), mark(5), mark(-1), mark(null)]).toEqual([
      undefined,
      72,
      24,
      6,
      undefined,
      undefined,
    ]);
    const six = reminderNotice(dispute(5), TEST_NOW);
    expect(six?.key).toBe(`dispute-reminder:PP-1:${later(5).toISOString()}:6h`);
    // Sending at 6 hours makes the earlier marks pointless; a moved date has its own keys.
    expect(six && doneKeys(six)).toEqual([six?.key]);
    const day = reminderNotice(dispute(23), TEST_NOW);
    expect(day && doneKeys(day).map((key) => key.split(":").at(-1))).toEqual(["24h", "6h"]);
    expect(reminderNotice(dispute(22), TEST_NOW)?.key).not.toBe(day?.key);
  });

  it("emails each dispute entry once, by deal and entry number", () => {
    const entry = { dealId: testId(1), seq: 9, serverTime: TEST_NOW, payload: {} };
    expect(
      eventNotice({ ...entry, type: "DISPUTE_UPDATED", payload: { disputeId: "PP-1" } }),
    ).toMatchObject({
      key: `dispute-entry:${testId(1)}:9`,
      kind: "changed",
    });
    expect(eventNotice({ ...entry, type: "DISPUTE_OPENED" })).toBeUndefined();
  });
});

describe("sending dispute emails after a check", () => {
  /** A paid deal with a dispute PayPal reads as waiting for the seller, due 20 hours after now. */
  async function disputed(email: EmailSender) {
    const deal = await createPaidTestDeal(db);
    const paypal = fakeDisputes([testDispute({ sellerResponseDueDate: later(20).toISOString() })]);
    let now = TEST_NOW;
    let ids = 900;
    const check = () =>
      syncDisputes(
        {
          db,
          disputes: paypal.reader,
          clock: () => now,
          newId: () => testId(ids++),
          log: keptLog().log,
          notices: { email, publicBaseUrl: "https://pactpal.test" },
        },
        "schedule",
      );
    const at = (hours: number) => {
      now = later(hours);
    };
    return { ...deal, paypal, check, at };
  }

  it("sends the new dispute and the nearest reminder once, then the change, decision and 6-hour reminder", async () => {
    const { email, sent } = capturingEmail();
    const { check, paypal, at, dealId, seller } = await disputed(email);
    await check();
    expect(sent.map((m) => m.kind)).toEqual(["dispute-opened", "dispute-reminder"]);
    const [opened, reminder] = sent;
    expect(opened).toMatchObject({
      to: seller.email,
      subject: `PayPal dispute on "${opened?.subject.split('"')[1] ?? ""}": respond by 3 Oct 2026, 06:00`,
      idempotencyKey: expect.stringMatching(/^dispute-entry:/) as string,
    });
    expect(opened?.text).toContain("The buyer opened a PayPal dispute about stage 1 of");
    expect(opened?.text).toContain("Reason given to PayPal: not as described.");
    expect(opened?.text).toContain("- Escalate: ask PayPal to decide the case.");
    expect(opened?.text).toContain("Respond by 3 Oct 2026, 06:00 UTC (20 hours left).");
    expect(opened?.text).toContain(`https://pactpal.test/deals/${dealId}/disputes/PP-R-TEST-1`);
    // The subject says the time actually left (20 hours), not the mark (24).
    expect(reminder?.subject).toMatch(/^20 hours left to answer the PayPal dispute on "/);
    // A second check sends nothing new.
    await check();
    expect(sent).toHaveLength(2);
    Object.assign(paypal.disputes[0] ?? {}, {
      stage: "CHARGEBACK",
      updatedAt: later(1).toISOString(),
      sellerResponseDueDate: later(22).toISOString(),
    });
    at(1);
    await check();
    const changed = sent.at(-2);
    expect(changed?.text).toContain(
      "PayPal stage now chargeback; respond-by date now 3 Oct 2026, 08:00 UTC",
    );
    expect(sent.at(-1)?.subject).toMatch(/^21 hours left/);
    at(17);
    await check();
    expect(sent.at(-1)?.subject).toMatch(/^5 hours left/);
    Object.assign(paypal.disputes[0] ?? {}, {
      status: "RESOLVED",
      outcome: "RESOLVED_BUYER_FAVOUR",
      updatedAt: later(18).toISOString(),
    });
    at(18);
    await check();
    expect(sent.at(-1)?.text).toContain("PayPal decided dispute PP-R-TEST-1 on");
    // No separate "status now resolved" email: the decision says it.
    expect(sent.at(-2)?.kind).toBe("dispute-reminder");
    expect(sent.at(-1)?.text).toContain("the appeal check on the dispute page");
    const kinds = (await listDisputeNotices(db, "PP-R-TEST-1")).map((n) => n.kind).sort();
    expect(kinds).toEqual(["changed", "decided", "opened", "reminder", "reminder", "reminder"]);
  });

  it("retries after a failure, never after a refusal, and sends nothing with email off", async () => {
    const tries: EmailMessage[] = [];
    let answer: "server" | "rejected" = "server";
    const flaky: EmailSender = {
      live: true,
      send: (message) => {
        tries.push(message);
        return Promise.resolve({ ok: false, reason: answer, detail: "no" });
      },
    };
    const { check } = await disputed(flaky);
    await check();
    expect(tries).toHaveLength(2);
    answer = "rejected";
    await check();
    expect(tries).toHaveLength(4);
    await check();
    expect(tries).toHaveLength(4);
    expect(
      (await listDisputeNotices(db, "PP-R-TEST-1")).every((n) => n.failure === "rejected"),
    ).toBe(true);
  });

  it("sends nothing with the stand-in email", async () => {
    const off: EmailSender = { live: false, send: () => Promise.reject(new Error("never")) };
    const { check } = await disputed(off);
    await expect(check()).resolves.toMatchObject({ ok: true });
    expect(await listDisputeNotices(db, "PP-R-TEST-1")).toEqual([]);
  });
});
