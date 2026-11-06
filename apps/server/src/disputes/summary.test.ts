import { councilOf } from "@pactpal/council/testing";
import { finishClaimAnalysis, readLedger, startClaimAnalysis } from "@pactpal/db";
import { TEST_NOW, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors, queuedDrafting } from "../deals/test-app.js";
import { inProcessClaimRunner } from "./checker.js";
import { runDisputeJob } from "./claim-job.js";
import { expectSellerOnly, keptLog, signedDispute, type TestFile } from "./test-support.js";

const db = useMigratedTestDatabase();
const text = (value: string) => new TextEncoder().encode(value);

const FILES: TestFile[] = [
  ["chat.txt", "source", text("Maya: a clean, modern look\nChris: deal"), "seller"],
  ["archive.zip", "source", new Uint8Array([0x50, 0x4b, 3, 4, 0, 255]), "seller"],
  [
    "sketch.png",
    "deliverable",
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 7, 7]),
    "seller",
  ],
];

/** A summary that cites entry #1, picks every document that can go to PayPal, and a note. */
const GOOD = {
  summary: [
    { text: "The deal was set up before the agreement was signed.", record: [1] },
    { text: "Both people signed the agreement.", record: [1] },
    { text: "No record covers the colours.", record: [] },
  ],
  exhibits: [
    { id: "receipt", use: true, why: "The signed agreement (statement 1)." },
    { id: testId(600), use: true, why: "The chat that set the look (statement 1)." },
    { id: testId(602), use: false, why: "Not related to the claim." },
  ],
  note: "The signed agreement and the chat show the look the buyer agreed to.",
};

interface SummariesView {
  canDraft: boolean;
  summaries: {
    id: string;
    status: string;
    basedOn: string | null;
    failureReason: string | null;
    summary: {
      summary: { text: string; record: { n: number; text: string }[] }[];
      exhibits: { id: string; use: boolean }[];
      note: string;
    } | null;
  }[];
}

/** A signed, disputed deal whose summaries run in process with stand-in models. */
async function disputedDeal(answers: object[] = [GOOD, GOOD]) {
  const clients = councilOf(answers);
  const { runtime, settle } = queuedDrafting(clients);
  const claims = inProcessClaimRunner(runtime, (analysisId) =>
    runDisputeJob(
      { db, clients, council: runtime.council, clock: () => TEST_NOW, log: keptLog().log },
      analysisId,
    ),
  );
  const deal = await signedDispute(db, FILES, { claims });
  /** A ready comparison of the claim, as 5d leaves it. */
  const compare = async () => {
    const started = await startClaimAnalysis(
      db,
      {
        id: testId(800),
        dealId: deal.dealId,
        disputeId: "PP-R-TEST-1",
        sellerId: deal.seller.id,
        promptVersion: 1,
        rankPromptVersion: 1,
      },
      TEST_NOW,
    );
    const analysis = {
      statements: [{ quote: "Not the style I wanted", line: 1, finding: "covered", record: [1] }],
      suggestion: { action: "escalate", why: "" },
    };
    await finishClaimAnalysis(
      db,
      {
        analysisId: started.id,
        analysis,
        council: {},
        claimSha256: "c".repeat(64),
        recordSha256: "d".repeat(64),
        models: ["alpha"],
        winner: "alpha",
        statements: 1,
        needsReview: false,
      },
      TEST_NOW,
    );
    return started.id;
  };
  return { ...deal, settle, compare, clients, summaries: `${deal.url}/summaries` };
}

describe("packet summaries", () => {
  it("drafts from a ready comparison, shows cited entries, logs a fingerprint and fills the packet", async () => {
    const { app, call, token, summaries, url, compare, settle, dealId, clients } =
      await disputedDeal();
    const before = (await call("GET", summaries, token)).json<SummariesView>();
    expect(before).toEqual({ canDraft: false, summaries: [] });
    expect((await call("POST", summaries, token, {})).json()).toEqual({
      error: "compare the claim with the record first",
    });
    const analysisId = await compare();
    expect((await call("GET", summaries, token)).json<SummariesView>().canDraft).toBe(true);
    expect((await call("POST", summaries, token, {})).statusCode).toBe(202);
    expect((await call("POST", summaries, token, {})).statusCode).toBe(409);
    await settle();
    const done = (await call("GET", summaries, token)).json<SummariesView>().summaries[0];
    expect(done).toMatchObject({ status: "ready", basedOn: analysisId });
    expect(done?.summary?.summary[0]?.record[0]?.text).toMatch(/^#1 /);
    expect(done?.summary?.exhibits.map((e) => e.use)).toEqual([true, true, false]);
    // The models saw the comparison and only the documents that can go to PayPal.
    const asked = clients[0]?.requests[0]?.messages[1]?.content ?? "";
    expect(asked).toContain('1: The buyer said "Not the style I wanted"');
    // Code says what each document is, so the models never guess from a file name.
    for (const line of [
      "receipt: pactpal-receipt-v1.pdf (added by PactPal; the signed agreement with its fingerprints, made by PactPal; PDF)",
      `${testId(602)}: sketch.png (added by the seller; delivered work; PNG picture)`,
      `${testId(600)}: chat.txt (added by the seller; a file added during the deal; text (sent as PDF))`,
    ]) {
      expect(asked).toContain(line);
    }
    expect(asked.slice(asked.indexOf("<exhibits-"))).not.toContain("archive.zip");
    const drafted = (await readLedger(db, dealId)).at(-1);
    expect(drafted).toMatchObject({
      type: "SUMMARY_DRAFTED",
      actor: "system",
      payload: { basedOn: analysisId, sentences: 3, models: ["alpha", "beta"] },
    });
    expect(JSON.stringify(drafted?.payload)).not.toContain("look");

    const summaryId = done?.id ?? "";
    const wrongPair = { analysisId: summaryId, summaryId: analysisId };
    const refused = await call("POST", `${url}/packet`, token, { includeAi: wrongPair });
    expect(refused.statusCode).toBe(409);
    const built = await call("POST", `${url}/packet`, token, {
      includeAi: { analysisId, summaryId },
    });
    expect(built.statusCode).toBe(201);
    expect(built.json()).toMatchObject({ analysisId, summaryId });
    const entry = (await readLedger(db, dealId)).at(-1);
    expect(entry).toMatchObject({
      type: "PACKET_BUILT",
      payload: { ai: { analysisId, summaryId } },
    });
    await app.close();
  });

  it("fails plainly when no model gives a valid summary, and is for the seller only", async () => {
    const unknownPick = { ...GOOD, exhibits: [{ id: "nothing", use: true, why: "x" }] };
    const { app, call, token, summaries, compare, settle, dealId, buyer } = await disputedDeal([
      unknownPick,
      { ...GOOD, note: "Read https://example.com" },
    ]);
    await compare();
    await call("POST", summaries, token, {});
    await settle();
    expect((await call("GET", summaries, token)).json<SummariesView>().summaries[0]).toMatchObject({
      status: "failed",
      failureReason: "no model produced a valid summary",
      summary: null,
    });
    await expectSellerOnly(call, summaries, token, (await buyerVisitors(db, dealId, buyer.id))[0]);
    await app.close();
  });
});
