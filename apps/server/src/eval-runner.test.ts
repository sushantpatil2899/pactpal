import { FakeChatClient, testSpec } from "@pactpal/ai/testing";
import type { ChatOutcome } from "@pactpal/ai";
import { MAYA_DRAFT } from "@pactpal/scope-draft/testing";
import { describe, expect, it } from "vitest";
import { councilDeps, isRankingRequest } from "./council-test-support.js";
import { runEvals, type AloneRecord, type CouncilEvalRecord } from "./eval-runner.js";

/** A model that drafts as `draft` and ranks the drafts in the order shown. */
const model = (name: string, draft: object | ChatOutcome) =>
  new FakeChatClient(testSpec({ name }), (request) => {
    if (isRankingRequest(request)) {
      const user = request.messages[1]?.content ?? "";
      return JSON.stringify({ ranking: [...user.matchAll(/label="(\w+)"/g)].map((m) => m[1]) });
    }
    return "ok" in draft ? draft : JSON.stringify(draft);
  });

// The checker already refuses a price that is not on the cited line, so the wrong value is the category.
const wrongCategory = {
  ...MAYA_DRAFT,
  category: { ...MAYA_DRAFT.category, id: "web-and-software" },
};
const invented = {
  ...MAYA_DRAFT,
  exclusions: [{ text: "x", citations: [{ line: 14, quote: "invented words" }] }],
};
const down: ChatOutcome = {
  ok: false,
  model: "down",
  kind: "rate_limited",
  message: "down: HTTP 429",
  status: 429,
};

const clients = () => [
  model("good", MAYA_DRAFT),
  model("wrong", wrongCategory),
  model("liar", invented),
  model("down", down),
];

const aloneOf = (records: readonly { kind: string }[]) =>
  Object.fromEntries(
    records.filter((r): r is AloneRecord => r.kind === "alone").map((r) => [r.model, r]),
  );
const councilOf = (records: readonly { kind: string }[]) =>
  records.filter((r): r is CouncilEvalRecord => r.kind === "council");

describe("runEvals", () => {
  it("scores each model's own draft and the council's pick from the same drafts", async () => {
    const run = await runEvals(clients(), { runs: 1, caseId: "maya" }, councilDeps());
    const alone = aloneOf(run.records);
    expect(alone.good).toMatchObject({ status: "scored", score: { score: 1, wrongValues: 0 } });
    expect(alone.wrong).toMatchObject({
      status: "scored",
      score: { fields: { category: "wrong" }, wrongValues: 1 },
    });
    expect(alone.liar).toMatchObject({ status: "dropped" });
    expect(alone.liar?.score).toBeUndefined();
    expect(alone.down).toMatchObject({ status: "failed", failure: "rate_limited" });
    expect(alone.good?.tokens).toBe(15);

    const [council] = councilOf(run.records);
    expect(council).toMatchObject({ caseId: "maya", run: 1, valid: 2, best: 1 });
    expect(["good", "wrong"]).toContain(council?.winner);
    expect(council?.average).toBeCloseTo((1 + 6 / 7) / 2);
    // Four answers and the rankings of the three models whose call worked or failed alike.
    expect(council?.calls).toBe(8);
    expect(council?.tokens).toBeGreaterThan(0);
    expect(run.runs).toBe(1);
  });

  it("repeats a chat for each run, reports progress and runs every chat when none is named", async () => {
    const messages: string[] = [];
    const repeated = await runEvals(
      [model("good", MAYA_DRAFT)],
      { runs: 2, caseId: "maya" },
      councilDeps(),
      (message) => messages.push(message),
    );
    expect(councilOf(repeated.records).map((r) => r.run)).toEqual([1, 2]);
    expect(messages).toEqual(["run 1: maya done", "run 2: maya done"]);

    // On the other chats the Maya draft cites lines that do not say what it quotes, so it is dropped.
    const all = await runEvals([model("good", MAYA_DRAFT)], { runs: 1 }, councilDeps());
    expect(councilOf(all.records)).toHaveLength(11);
    const dropped = councilOf(all.records).filter((r) => r.winner === null);
    expect(dropped.length).toBe(10);
    expect(dropped.every((r) => r.score === undefined && r.best === undefined)).toBe(true);
  });

  it("gives a council with no valid draft no score, and still counts what it cost", async () => {
    const run = await runEvals([model("down", down)], { runs: 1, caseId: "maya" }, councilDeps());
    expect(councilOf(run.records)[0]).toMatchObject({
      winner: null,
      valid: 0,
      flagged: true,
      calls: 1,
    });
  });
});
