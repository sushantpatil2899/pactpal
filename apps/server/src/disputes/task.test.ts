import {
  createTestDatabase,
  createPaidTestDeal,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { getClaimAnalysis, readLedger, startClaimAnalysis, type Database } from "@pactpal/db";
import { describe, expect, it } from "vitest";
import type { TaskStarter } from "./checker.js";
import {
  jsonLines,
  runClaimTask,
  runDisputeTask,
  startScheduledCheck,
  type TaskWiring,
} from "./task.js";
import { fakeDisputes, keptLog, testDispute } from "./test-support.js";

const db = useMigratedTestDatabase();

const env = {
  DATABASE_URL: "postgres://pactpal@db.internal:5432/pactpal",
  PAYPAL_SELLER_CLIENT_ID: "seller-id",
  PAYPAL_SELLER_CLIENT_SECRET: "seller-secret",
};

/** Wiring onto a test database; the task closes what it opens, so closing here does nothing. */
function wiring(database: Database = db) {
  const paypal = fakeDisputes([testDispute()]);
  const urls: string[] = [];
  let ids = 700;
  const wired: TaskWiring = {
    connect: (url) => {
      urls.push(url);
      return { ...database, close: () => Promise.resolve() };
    },
    disputesFor: () => paypal.reader,
    clock: () => new Date("2026-11-05T17:00:00.000Z"),
    newId: () => `00000000-0000-4000-8000-${String(ids++).padStart(12, "0")}`,
    log: keptLog().log,
  };
  return { wired, urls, paypal };
}

describe("the dispute check task", () => {
  it("connects with the settings, checks the migrations and runs one check", async () => {
    const { dealId } = await createPaidTestDeal(db);
    const { wired, urls } = wiring();
    expect(await runDisputeTask(env, "schedule", wired)).toMatchObject({ ok: true, matched: 1 });
    expect(urls).toEqual([env.DATABASE_URL]);
    expect((await readLedger(db, dealId)).at(-1)?.type).toBe("DISPUTE_OPENED");
  });

  it("refuses an unknown source, missing settings and a database still waiting for migrations", async () => {
    await expect(runDisputeTask(env, "anything", wiring().wired)).rejects.toThrow();
    await expect(runDisputeTask({}, "schedule", wiring().wired)).rejects.toThrow(/DATABASE_URL/);
    await expect(
      runDisputeTask({ ...env, PAYPAL_SELLER_CLIENT_ID: "has space" }, "schedule", wiring().wired),
    ).rejects.toThrow(/PAYPAL_SELLER_CLIENT_ID/);
    const empty = await createTestDatabase();
    try {
      await expect(runDisputeTask(env, "schedule", wiring(empty).wired)).rejects.toThrow(
        /waiting for migrations/,
      );
    } finally {
      await empty.close();
    }
  }, 60_000);
});

describe("the claim comparison task", () => {
  it("runs one comparison with the models that have keys, and refuses a bad id", async () => {
    const deal = await createPaidTestDeal(db);
    const { wired } = wiring();
    await runDisputeTask(env, "schedule", wired);
    const analysisId = "00000000-0000-4000-8000-000000000777";
    await startClaimAnalysis(
      db,
      {
        id: analysisId,
        dealId: deal.dealId,
        disputeId: "PP-R-TEST-1",
        sellerId: deal.seller.id,
        promptVersion: 1,
        rankPromptVersion: 1,
      },
      new Date("2026-11-05T17:00:00.000Z"),
    );
    const keys: string[][] = [];
    const claimWiring = {
      ...wired,
      clientsFor: (given: Readonly<Record<string, unknown>>) => {
        keys.push(Object.keys(given));
        return [];
      },
    };
    await runClaimTask({ ...env, GROQ_API_KEY: "gsk_test" }, analysisId, claimWiring);
    expect(keys).toEqual([["GROQ_API_KEY"]]);
    expect(await getClaimAnalysis(db, analysisId)).toMatchObject({
      status: "failed",
      failureReason: "no AI model is configured",
    });
    await expect(runClaimTask(env, "not-an-id", claimWiring)).rejects.toThrow();
    await expect(runClaimTask({}, analysisId, claimWiring)).rejects.toThrow(/DATABASE_URL/);
  });
});

describe("the scheduled start", () => {
  const renderEnv = {
    RENDER_API_KEY: "rnd_test",
    DISPUTE_TASK_SLUG: "pactpal-workflows/check-disputes",
  };

  it("starts one scheduled run with Render's key", async () => {
    const keys: string[] = [];
    const started: unknown[][] = [];
    const starterFor = (apiKey: string): TaskStarter => {
      keys.push(apiKey);
      return {
        startTask: (_slug, input) => {
          started.push(input);
          return Promise.resolve({ taskRunId: "trn-1" });
        },
      };
    };
    const { log } = keptLog();
    const wired = { clock: () => new Date("2026-11-05T17:00:00.000Z"), log };
    expect(await startScheduledCheck(renderEnv, starterFor, wired)).toBe(true);
    expect(keys).toEqual(["rnd_test"]);
    expect(started).toEqual([["schedule"]]);
    expect(await startScheduledCheck({}, starterFor, wired)).toBe(false);
    await expect(
      startScheduledCheck({ ...renderEnv, DISPUTE_TASK_SLUG: "no-slash" }, starterFor, wired),
    ).rejects.toThrow(/DISPUTE_TASK_SLUG/);
  });
});

describe("jsonLines", () => {
  it("writes one JSON line per entry with its level", () => {
    const lines: string[] = [];
    const log = jsonLines((line) => lines.push(line));
    log.info({ a: 1 }, "hello");
    log.warn({}, "careful");
    log.error({}, "bad");
    expect(lines.map((line) => JSON.parse(line) as { level: number; msg: string })).toMatchObject([
      { level: 30, msg: "hello", a: 1 },
      { level: 40, msg: "careful" },
      { level: 50, msg: "bad" },
    ]);
    expect(lines.every((line) => line.endsWith("\n"))).toBe(true);
  });
});
