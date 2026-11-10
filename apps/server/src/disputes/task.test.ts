import {
  createTestDatabase,
  createPaidTestDeal,
  createTestDeal,
  testId,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import {
  addArtifact,
  getClaimAnalysis,
  getDraft,
  postgresContentStore,
  readLedger,
  startClaimAnalysis,
  startDraft,
  type Database,
} from "@pactpal/db";
import { MAYA_CHAT } from "@pactpal/scope-draft/testing";
import { PROMPT_VERSIONS } from "../drafting/draft-job.js";
import { askModel, subtaskClients } from "../drafting/subtask-clients.js";
import { standInMember } from "../deals/test-app.js";
import { describe, expect, it } from "vitest";
import type { TaskStarter } from "./checker.js";
import {
  jsonLines,
  runAskModel,
  runClaimTask,
  runDraftTask,
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

describe("the scope draft task (9R-1)", () => {
  const NOW = new Date("2026-11-05T17:00:00.000Z");

  /** The test deal with a chat file (`bytes`) and a draft of it waiting. */
  async function waitingDraft(bytes: Uint8Array = new TextEncoder().encode(MAYA_CHAT)) {
    const deal = await createTestDeal(db);
    const file = await addArtifact(
      db,
      postgresContentStore(db, () => NOW),
      {
        id: testId(500),
        dealId: deal.dealId,
        kind: "source",
        filename: "chat.txt",
        bytes,
        addedBy: { actor: "seller", actorId: deal.seller.id },
      },
      NOW,
    );
    const draft = await startDraft(
      db,
      {
        id: testId(501),
        dealId: deal.dealId,
        sellerId: deal.seller.id,
        sourceArtifactId: file.id,
        sourceSha256: file.sha256,
        draftPromptVersion: PROMPT_VERSIONS.draft,
        rankPromptVersion: PROMPT_VERSIONS.rank,
      },
      NOW,
    );
    return { ids: { dealId: deal.dealId, draftId: draft.id } };
  }

  /** Two stand-in members whose every call goes through a recorded "task run". */
  function treeOfRuns() {
    const members = [standInMember("m1"), standInMember("m2")];
    const runs: string[] = [];
    const clientsFor = () =>
      subtaskClients(
        members.map((m) => m.spec),
        (name, request) => {
          runs.push(name);
          return askModel(members, name, request);
        },
      );
    return { runs, clientsFor };
  }

  it("runs the drafting council with one model run per member and round", async () => {
    const { ids } = await waitingDraft();
    const { runs, clientsFor } = treeOfRuns();
    await runDraftTask(env, ids, { ...wiring().wired, clientsFor });
    expect(await getDraft(db, ids.dealId, ids.draftId)).toMatchObject({ status: "ready" });
    // Each member drafts once and ranks once: four runs.
    expect(runs.sort()).toEqual(["m1", "m1", "m2", "m2"]);
    // Asked again (a retried run), a finished draft is left alone.
    await runDraftTask(env, ids, { ...wiring().wired, clientsFor });
    expect(runs).toHaveLength(4);
  });

  it("fails a draft whose chat cannot be read, and refuses bad input", async () => {
    const { ids } = await waitingDraft(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0]));
    const { clientsFor } = treeOfRuns();
    await runDraftTask(env, ids, { ...wiring().wired, clientsFor });
    expect(await getDraft(db, ids.dealId, ids.draftId)).toMatchObject({
      status: "failed",
      failureReason: "the chat could not be read",
    });
    await expect(
      runDraftTask(env, { dealId: "x" }, { ...wiring().wired, clientsFor }),
    ).rejects.toThrow();
    await expect(runDraftTask({}, ids, { ...wiring().wired, clientsFor })).rejects.toThrow(
      /DATABASE_URL/,
    );
  });

  it("answers one model call with the members whose keys are set", async () => {
    const outcome = await runAskModel(
      { GROQ_API_KEY: "gsk_test" },
      "nobody",
      { messages: [{ role: "user", content: "hi" }] },
      (keys) => {
        expect(Object.keys(keys)).toEqual(["GROQ_API_KEY"]);
        return [];
      },
    );
    expect(outcome).toMatchObject({ ok: false, kind: "rejected" });
  });
});
