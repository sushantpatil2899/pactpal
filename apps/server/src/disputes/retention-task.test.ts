import { createPaidTestDeal, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import type { TaskStarter } from "./checker.js";
import { runRetentionTask, startScheduledRetention } from "./task.js";
import { keptLog } from "./test-support.js";

const db = useMigratedTestDatabase();
const settingsFor = { DATABASE_URL: "postgres://pactpal@db.internal:5432/pactpal" };
/** 211 days after the test deals' moment (2 Oct 2026), so they are due. */
const late = new Date("2027-05-01T03:17:00.000Z");

const wiredAt = (now: Date) => {
  const { log, lines } = keptLog();
  return {
    lines,
    wired: {
      connect: () => ({ ...db, close: () => Promise.resolve() }),
      clock: () => now,
      newId: () => "00000000-0000-4000-8000-000000000990",
      log,
    },
  };
};

describe("the retention clean-up task (9c)", () => {
  it("counts in a dry run, then removes the due deal, logging counts only", async () => {
    const { dealId } = await createPaidTestDeal(db);
    const dry = wiredAt(late);
    expect(await runRetentionTask(settingsFor, { dryRun: true }, dry.wired)).toMatchObject({
      deals: 1,
    });
    expect(await db.query("SELECT id FROM deals")).toHaveLength(1);
    await db.query("DELETE FROM retention_runs");
    const real = wiredAt(late);
    expect(await runRetentionTask(settingsFor, undefined, real.wired)).toMatchObject({ deals: 1 });
    expect(await db.query("SELECT id FROM deals")).toEqual([]);
    expect(real.lines.join("\n")).not.toContain(dealId);
    expect(real.lines.at(-1)).toContain("Retention clean-up finished");
  });

  it("refuses bad input and a missing database setting", async () => {
    const { wired } = wiredAt(late);
    await expect(runRetentionTask(settingsFor, { dryRun: "yes" }, wired)).rejects.toThrow();
    await expect(runRetentionTask({}, undefined, wired)).rejects.toThrow(/DATABASE_URL/);
  });

  it("is started by its Cron Job once a day, with Render's key", async () => {
    const calls: { key: string; slug: string; input: unknown[]; idempotencyKey: string }[] = [];
    const starterFor = (key: string): TaskStarter => ({
      startTask: (slug, input, options) => {
        calls.push({ key, slug, input, idempotencyKey: options.idempotencyKey });
        return Promise.resolve({ taskRunId: "trn-9" });
      },
    });
    const env = {
      RENDER_API_KEY: "rnd_test",
      RETENTION_TASK_SLUG: "pactpal-workflows/retention-sweep",
    };
    const { wired } = wiredAt(late);
    expect(await startScheduledRetention(env, starterFor, wired)).toBe(true);
    expect(calls).toEqual([
      {
        key: "rnd_test",
        slug: "pactpal-workflows/retention-sweep",
        input: [{ dryRun: false }],
        idempotencyKey: "retention:2027-05-01",
      },
    ]);
    expect(await startScheduledRetention({ RENDER_API_KEY: "rnd_test" }, starterFor, wired)).toBe(
      false,
    );
    await expect(
      startScheduledRetention({ ...env, RETENTION_TASK_SLUG: "no-slash" }, starterFor, wired),
    ).rejects.toThrow(/RETENTION_TASK_SLUG/);
  });
});
