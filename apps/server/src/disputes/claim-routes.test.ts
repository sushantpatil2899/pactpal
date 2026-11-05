import type { ChatRequest } from "@pactpal/ai";
import { FakeChatClient, testSpec } from "@pactpal/ai/testing";
import { getClaimAnalysis, readLedger, listArtifacts } from "@pactpal/db";
import { TEST_NOW, createPaidTestDeal, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors, dealTestApp, queuedDrafting, signedInAs } from "../deals/test-app.js";
import {
  RunnerBusyError,
  inProcessClaimRunner,
  renderClaimRunner,
  sameWorkflowTask,
  type ClaimRunner,
} from "./checker.js";
import { runClaimJob } from "./claim-job.js";
import { syncDisputes } from "./dispute-sync.js";
import { fakeDisputes, keptLog, testDispute } from "./test-support.js";

const db = useMigratedTestDatabase();

/** A careful model: quotes the claim, cites the payment entry it finds in the record, votes. */
const careful =
  (action = "escalate") =>
  (request: ChatRequest) => {
    const user = request.messages[1]?.content ?? "";
    if (request.messages[0]?.content.includes("careful reviewer") === true) {
      return JSON.stringify({ ranking: [...user.matchAll(/label="(\w+)"/g)].map((m) => m[1]) });
    }
    const payment = Number(/#(\d+) [^\n]*recorded a PayPal payment/.exec(user)?.[1]);
    return JSON.stringify({
      statements: [
        { quote: "not as described", line: 1, finding: "not-covered" },
        {
          quote: "Not the style I wanted",
          line: 2,
          finding: "covered",
          record: [payment],
          relation: "The record shows the stage was paid.",
        },
      ],
      suggestion: { action, evidenceType: null, why: "The record holds the payment." },
    });
  };

/** A paid deal with dispute PP-R-TEST-1 tied to it, and an app whose comparisons run in process. */
async function disputedDeal(
  models: ((request: ChatRequest) => string)[] = [careful(), careful(), careful("appeal")],
  options: { messages?: boolean; runner?: ClaimRunner | "none" } = {},
) {
  const deal = await createPaidTestDeal(db);
  const listed = testDispute(options.messages === false ? { messages: [] } : {});
  let ids = 900;
  await syncDisputes(
    {
      db,
      disputes: fakeDisputes([listed]).reader,
      clock: () => TEST_NOW,
      newId: () => testId(ids++),
      log: keptLog().log,
    },
    "schedule",
  );
  const clients = models.map(
    (answer, i) =>
      new FakeChatClient(testSpec({ name: ["alpha", "beta", "gamma"][i] ?? "m" }), answer),
  );
  const { runtime, settle } = queuedDrafting(clients);
  const runner =
    options.runner ??
    inProcessClaimRunner(runtime, (analysisId) =>
      runClaimJob(
        { db, clients, council: runtime.council, clock: () => TEST_NOW, log: keptLog().log },
        analysisId,
      ),
    );
  const env = dealTestApp(db, undefined, runner === "none" ? {} : { claims: runner });
  const token = await signedInAs(db, deal.seller.id);
  const url = `/api/deals/${deal.dealId}/disputes/PP-R-TEST-1/analyses`;
  return { ...deal, ...env, token, url, settle, clients };
}

interface AnalysesView {
  canCompare: boolean;
  canPaste: boolean;
  analyses: {
    id: string;
    status: string;
    failureReason: string | null;
    analysis: {
      statements: { finding: string; record: { n: number; text: string }[] }[];
      suggestion: { action: string | null };
    } | null;
    council: { needsReview: boolean; answers: unknown[] } | null;
  }[];
}

describe("claim comparisons", () => {
  it("compares the claim with the record, shows the cited entries, and logs only a fingerprint", async () => {
    const { app, call, token, url, settle, dealId, clients } = await disputedDeal();
    const before = (await call("GET", url, token)).json<AnalysesView>();
    expect(before).toEqual({ canCompare: true, canPaste: false, analyses: [] });
    const started = await call("POST", url, token, {});
    expect(started.statusCode).toBe(202);
    expect(started.json<AnalysesView>().analyses[0]?.status).toBe("running");
    expect((await call("POST", url, token, {})).statusCode).toBe(409);
    await settle();
    const view = (await call("GET", url, token)).json<AnalysesView>();
    const done = view.analyses[0];
    expect(done?.status).toBe("ready");
    expect(done?.analysis?.statements[1]?.record[0]?.text).toMatch(/recorded a PayPal payment/);
    expect(done?.analysis?.suggestion.action).toBe("escalate");
    expect(done?.council?.answers).toHaveLength(3);
    // gamma suggested an action PayPal does not allow, so the checker dropped it before the vote.
    const entry = (await readLedger(db, dealId)).at(-1);
    expect(entry).toMatchObject({
      type: "CLAIM_ANALYZED",
      actor: "system",
      payload: { disputeId: "PP-R-TEST-1", models: ["alpha", "beta", "gamma"], statements: 2 },
    });
    expect(JSON.stringify(entry?.payload)).not.toContain("style");
    // The models read the buyer's words inside the marked claim element.
    expect(clients[0]?.requests[0]?.messages[1]?.content).toContain("2: Not the style I wanted");
    await app.close();
  });

  it("lets the seller paste the claim when PayPal shows none, saved as a source file", async () => {
    const { app, call, token, url, settle, dealId } = await disputedDeal(undefined, {
      messages: false,
    });
    expect((await call("GET", url, token)).json<AnalysesView>().canPaste).toBe(true);
    const started = await call("POST", url, token, { pasted: "Not the style I wanted" });
    expect(started.statusCode).toBe(202);
    await settle();
    const files = await listArtifacts(db, dealId, "source");
    expect(files.at(-1)?.filename).toMatch(/^buyer-claim-\d{4}-\d{2}-\d{2}\.txt$/);
    expect((await call("GET", url, token)).json<AnalysesView>().analyses[0]?.status).toBe("ready");
    await app.close();
  });

  it("refuses pasting when PayPal shows the buyer's words, and is for the seller only", async () => {
    const { app, call, token, url, dealId, buyer } = await disputedDeal();
    expect((await call("POST", url, token, { pasted: "x" })).statusCode).toBe(409);
    const [paypalBuyer] = await buyerVisitors(db, dealId, buyer.id);
    expect((await call("GET", url, paypalBuyer)).statusCode).toBe(403);
    expect((await call("GET", url.replace("PP-R-TEST-1", "PP-R-NONE"), token)).statusCode).toBe(
      404,
    );
    await app.close();
  });

  it("fails plainly when no model gives a valid answer", async () => {
    const wrong = careful("appeal");
    const { app, call, token, url, settle } = await disputedDeal([wrong, wrong]);
    await call("POST", url, token, {});
    await settle();
    expect((await call("GET", url, token)).json<AnalysesView>().analyses[0]).toMatchObject({
      status: "failed",
      failureReason: "no model produced a valid comparison",
      analysis: null,
    });
    await app.close();
  });

  it("says when comparisons are off, busy or could not start", async () => {
    const off = await disputedDeal(undefined, { runner: "none" });
    expect((await off.call("GET", off.url, off.token)).json<AnalysesView>().canCompare).toBe(false);
    expect((await off.call("POST", off.url, off.token, {})).statusCode).toBe(503);
    await off.app.close();
  });

  it("marks the analysis failed when the runner is busy or down", async () => {
    let busy = true;
    const runner: ClaimRunner = {
      start: () => Promise.reject(busy ? new RunnerBusyError("full") : new Error("render down")),
    };
    const { app, call, token, url } = await disputedDeal(undefined, { runner });
    expect((await call("POST", url, token, {})).statusCode).toBe(429);
    busy = false;
    expect((await call("POST", url, token, {})).statusCode).toBe(502);
    const reasons = (await call("GET", url, token))
      .json<AnalysesView>()
      .analyses.map((a) => a.failureReason);
    expect(reasons).toEqual(["could not be started", "every council place was taken"]);
    await app.close();
  });
});

describe("claim runners", () => {
  it("starts the comparison on Render once per analysis, in the dispute check's workflow", async () => {
    expect(sameWorkflowTask("pactpal-workflows/check-disputes", "analyze-claim")).toBe(
      "pactpal-workflows/analyze-claim",
    );
    const started: unknown[] = [];
    const runner = renderClaimRunner(
      {
        startTask: (slug, input, options) => {
          started.push([slug, input, options.idempotencyKey]);
          return Promise.resolve({ taskRunId: "trn-1" });
        },
      },
      "pactpal-workflows/analyze-claim",
      keptLog().log,
    );
    await runner.start(testId(5));
    expect(started).toEqual([
      ["pactpal-workflows/analyze-claim", [testId(5)], `claim:${testId(5)}`],
    ]);
  });

  it("leaves an analysis that is no longer running alone", async () => {
    const { dealId } = await disputedDeal();
    await runClaimJob(
      {
        db,
        clients: [],
        council: { rng: () => 0.5, newMarker: () => "abcdef123456", now: () => 0 },
        clock: () => TEST_NOW,
        log: keptLog().log,
      },
      testId(999),
    );
    expect(await getClaimAnalysis(db, testId(999))).toBeUndefined();
    expect((await readLedger(db, dealId)).some((e) => e.type === "CLAIM_ANALYZED")).toBe(false);
  });
});
