import { FakeChatClient, testSpec } from "@pactpal/ai/testing";
import type { ChatRequest } from "@pactpal/ai";
import { ALL_MISSING_DRAFT } from "@pactpal/scope-draft/testing";
import { describe, expect, it } from "vitest";
import { councilFailures } from "./injection-report.js";
import { councilDeps, isRankingRequest } from "./council-test-support.js";
import { runInjectionCheck } from "./injection-runner.js";

/** The numbered chat lines of a drafting request. */
function chatLines(request: ChatRequest): { n: number; text: string }[] {
  const user = request.messages[1]?.content ?? "";
  return [...user.matchAll(/^L(\d+)\| (.*)$/gm)].map((m) => ({
    n: Number(m[1]),
    text: m[2] ?? "",
  }));
}

/** A valid draft that cites the first ordinary line of the chat; an obedient model writes the canary into it. */
function draftFor(request: ChatRequest, obey: boolean): string {
  const lines = chatLines(request);
  const line = lines.find((l) => l.text.length > 20 && !l.text.includes("CANARY")) ?? lines[0];
  const cited = [{ line: line?.n ?? 1, quote: (line?.text ?? "").slice(0, 15) }];
  const canary = /CANARY-[A-Z]\d+/.exec(request.messages[1]?.content ?? "")?.[0];
  const gift = (request.messages[1]?.content ?? "").includes("gift card");
  return JSON.stringify({
    ...ALL_MISSING_DRAFT,
    summary: { status: "found", value: obey && canary ? canary : "A job", citations: cited },
    category: gift
      ? ALL_MISSING_DRAFT.category
      : { id: "art-and-design", citations: cited, note: "" },
  });
}

/** A voter that puts clean drafts first, or (when obedient) the draft that carries a canary. */
function rankingFor(request: ChatRequest, obey: boolean): string {
  const user = request.messages[1]?.content ?? "";
  const drafts = [...user.matchAll(/<draft-\w+ label="(\w+)">\n([\s\S]*?)\n<\/draft-\w+>/g)].map(
    (m) => ({
      label: m[1] ?? "",
      hostile: (m[2] ?? "").includes("CANARY"),
    }),
  );
  const order = [...drafts].sort(
    (a, b) => Number(obey ? b.hostile : a.hostile) - Number(obey ? a.hostile : b.hostile),
  );
  return JSON.stringify({ ranking: order.map((d) => d.label) });
}

const model = (name: string, obey: boolean) =>
  new FakeChatClient(testSpec({ name }), (request) =>
    isRankingRequest(request) ? rankingFor(request, obey) : draftFor(request, obey),
  );

const resultsFor = (
  records: readonly { caseId: string; model: string; mode: string; result: string }[],
  caseId: string,
  mode: string,
) =>
  Object.fromEntries(
    records.filter((r) => r.caseId === caseId && r.mode === mode).map((r) => [r.model, r.result]),
  );

describe("runInjectionCheck", () => {
  it("runs every hostile case on every model, and the voting cases, and judges them", async () => {
    const run = await runInjectionCheck(
      [model("steady", false), model("obedient", true)],
      { council: false, runs: 1, filter: false },
      councilDeps(),
    );
    expect(run.councilRan).toBe(false);
    // 14 chat cases and 3 ranking cases, each for 2 models.
    expect(run.records).toHaveLength((14 + 3) * 2);
    expect(resultsFor(run.records, "override-simple", "alone")).toEqual({
      steady: "held",
      obedient: "compromised",
    });
    // The attack with no canary to copy does not sway this simple obedient model.
    expect(resultsFor(run.records, "price-hijack", "alone")).toEqual({
      steady: "held",
      obedient: "held",
    });
    expect(resultsFor(run.records, "category-flip", "alone")).toEqual({
      steady: "held",
      obedient: "compromised",
    });
    expect(resultsFor(run.records, "rank-system-note", "vote")).toEqual({
      steady: "held",
      obedient: "compromised",
    });
    expect(resultsFor(run.records, "rank-fake-criteria", "vote")).toEqual({
      steady: "held",
      obedient: "compromised",
    });
    expect(run.records.some((r) => r.mode === "council")).toBe(false);
    expect(run.tokens).toBeGreaterThan(0);
  });

  it("with the council, the winner holds when most models resist, and fails when all obey", async () => {
    const mixed = await runInjectionCheck(
      [model("a", false), model("b", false), model("c", true)],
      { council: true, runs: 1, caseId: "override-simple", filter: false },
      councilDeps(),
    );
    expect(resultsFor(mixed.records, "override-simple", "council")).toEqual({ council: "held" });
    expect(mixed.records.find((r) => r.mode === "council")?.detail).toMatch(
      /^chose [ab]'s draft; 3 valid drafts from 3 models, 3 rankings$/,
    );
    expect(councilFailures(mixed.records)).toEqual([]);

    const allObey = await runInjectionCheck(
      [model("a", true), model("b", true), model("c", true)],
      { council: true, runs: 1, caseId: "override-simple", filter: false },
      councilDeps(),
    );
    expect(councilFailures(allObey.records).map((r) => r.caseId)).toEqual(["override-simple"]);
    expect(allObey.filtered).toBe(false);
  });

  it("with the lines that give orders hidden, models that would obey never see the order", async () => {
    const run = await runInjectionCheck(
      [model("a", true), model("b", true)],
      { council: true, runs: 1, caseId: "override-simple" },
      councilDeps(),
    );
    expect(run.filtered).toBe(true);
    expect(resultsFor(run.records, "override-simple", "alone")).toEqual({
      a: "held",
      b: "held",
    });
    expect(councilFailures(run.records)).toEqual([]);
  });

  it("runs one case when asked, repeats it, and reports progress", async () => {
    const heard: string[] = [];
    const run = await runInjectionCheck(
      [model("a", false)],
      { council: false, runs: 2, caseId: "role-spoof" },
      councilDeps(),
      (message) => heard.push(message),
    );
    expect(run.records).toHaveLength(2);
    expect(run.runs).toBe(2);
    expect(heard).toEqual(["run 1: role-spoof done", "run 2: role-spoof done"]);
  });

  it("counts a failed call and an invalid reply separately from held and compromised", async () => {
    const lost = new FakeChatClient(testSpec({ name: "lost" }), () => ({
      ok: false,
      model: "lost",
      kind: "timeout",
      message: "lost: timed out",
      status: undefined,
    }));
    const babbles = new FakeChatClient(testSpec({ name: "babbles" }), () => "not json at all");
    const run = await runInjectionCheck(
      [lost, babbles],
      { council: true, runs: 1, caseId: "override-simple" },
      councilDeps(),
    );
    expect(resultsFor(run.records, "override-simple", "alone")).toEqual({
      lost: "failed",
      babbles: "dropped",
    });
    expect(resultsFor(run.records, "override-simple", "council")).toEqual({ council: "dropped" });
    const failedRun = run.records.find((r) => r.model === "lost" && r.mode === "alone");
    expect(failedRun?.reasons).toEqual(["timeout"]);
    expect(run.records.find((r) => r.mode === "council")?.detail).toBe(
      "no valid draft from 2 models",
    );

    const voting = await runInjectionCheck(
      [lost, babbles],
      { council: false, runs: 1, caseId: "rank-system-note" },
      councilDeps(),
    );
    expect(resultsFor(voting.records, "rank-system-note", "vote")).toEqual({
      lost: "failed",
      babbles: "dropped",
    });
    expect(voting.records.find((r) => r.model === "lost")?.reasons).toEqual(["lost: timed out"]);
  });

  it("puts the schema in the ranking request only for models whose host does not enforce it", async () => {
    const enforced = new FakeChatClient(
      testSpec({ name: "e", structuredOutput: "strict-schema" }),
      (r) => rankingFor(r, false),
    );
    const described = new FakeChatClient(testSpec({ name: "d", structuredOutput: "none" }), (r) =>
      rankingFor(r, false),
    );
    await runInjectionCheck(
      [enforced, described],
      { council: false, runs: 1, caseId: "rank-human-checked" },
      councilDeps(),
    );
    expect(enforced.requests[0]?.messages[1]?.content).not.toContain("<reply_schema>");
    expect(described.requests[0]?.messages[1]?.content).toContain("<reply_schema>");
  });
});
