import type { DraftScore } from "@pactpal/scope-draft/testing";
import { describe, expect, it } from "vitest";
import { formatEvalReport } from "./eval-report.js";
import type { AloneRecord, CouncilEvalRecord, EvalRun } from "./eval-runner.js";

const score = (value: number, wrong: "price" | null = null): DraftScore => ({
  score: value,
  fields: {
    price: wrong === "price" ? "wrong" : "right",
    dueDate: "right",
    revisions: "right",
    category: "right",
  },
  recall: { deliverables: 1, exclusions: 1, vague: 1 },
  extras: { deliverables: 0, exclusions: 0, vague: 0 },
  wrongValues: wrong === null ? 0 : 1,
  buyerProvides: { recall: 1, datesRight: value > 0.5 ? 1 : null, extras: 0 },
  marks: { right: 1, judged: 2 },
  timeline: { recall: 0.5, inOrder: 0.25 },
});

const alone = (
  caseId: string,
  model: string,
  status: AloneRecord["status"],
  value?: DraftScore,
): AloneRecord => ({
  kind: "alone",
  caseId,
  run: 1,
  model,
  status,
  ...(value === undefined ? {} : { score: value }),
  tokens: status === "failed" ? 0 : 1000,
  seconds: 2,
  ...(status === "failed" ? { failure: "rate_limited" } : {}),
  ...(status === "dropped" ? { reasons: ["timeline[1]: line 99 does not exist"] } : {}),
});

const councilRecord = (
  caseId: string,
  overrides: Partial<CouncilEvalRecord> = {},
): CouncilEvalRecord => ({
  kind: "council",
  caseId,
  run: 1,
  winner: "a",
  score: score(1),
  best: 1,
  average: 0.9,
  valid: 2,
  flagged: false,
  reviewReasons: [],
  calls: 8,
  tokens: 4000,
  seconds: 10,
  ...overrides,
});

const run = (overrides: Partial<EvalRun> = {}): EvalRun => ({
  records: [
    alone("maya", "a", "scored", score(1)),
    alone("maya", "b", "scored", score(0.8, "price")),
    alone("maya", "c", "failed"),
    alone("sunrise", "a", "dropped"),
    alone("sunrise", "b", "scored", score(0.9)),
    councilRecord("maya"),
    councilRecord("sunrise", {
      winner: "b",
      score: score(0.9),
      best: 0.9,
      average: 0.9,
      valid: 1,
      flagged: true,
      reviewReasons: ["top answers scored almost the same"],
    }),
  ],
  runs: 1,
  durationMs: 61_000,
  ...overrides,
});

describe("formatEvalReport", () => {
  const text = formatEvalReport(run());

  it("shows each model alone with failed, dropped and scored counts, the score, wrong values and cost", () => {
    expect(text).toContain("Drafting evals (2 chats, 1 run of each)");
    expect(text).toMatch(/a\s+2\s+0\s+1\s+1\s+1\.00\s+0\s+1000\s+2\.0/);
    expect(text).toMatch(/b\s+2\s+0\s+0\s+2\s+0\.85\s+1\s+1000\s+2\.0/);
    expect(text).toMatch(/c\s+1\s+1\s+0\s+0\s+-\s+0\s+-\s+-/);
    expect(text).toContain("Wrong values (model, chat: field)\n  b, maya: price");
    expect(text).toContain("Calls that failed (model: reason, count)\n  c: rate_limited (1)");
    expect(text).toContain(
      "Why drafts were dropped (model, chat: rule)\n  a, sunrise: timeline: line 99 does not exist",
    );
  });

  it("shows the council, the chats, and how often the flag and ties appeared", () => {
    expect(text).toMatch(
      /runs\s+no winner\s+score\s+wrong\s+picked best\s+flagged\s+calls\s+tokens\s+seconds/,
    );
    expect(text).toMatch(/2\s+0\s+0\.95\s+0\s+2\s+1\s+8\.0\s+4000\s+10\.0/);
    expect(text).toContain("flagged for review: 1 runs (average pick 0.90)");
    expect(text).toContain("not flagged: 1 runs (average pick 1.00)");
    expect(text).toContain("ties between the top drafts: 1");
    expect(text).toMatch(/chat\s+a\s+b\s+c\s+council\s+picked/);
    expect(text).toMatch(/maya\s+1\.00\s+0\.80\s+fail\s+1\.00\s+a/);
    expect(text).toMatch(/sunrise\s+drop\s+0\.90\s+fail\s+0\.90\s+b/);
  });

  it("shows the buyer duties, line marks and timeline apart from the score", () => {
    expect(text).toContain(
      "Buyer duties, line marks and timeline (prompt versions 3 and 4; not in the score above)",
    );
    expect(text).toContain("steps found");
    expect(text).toMatch(/council pick\s+\|?\s*\d+/);
    expect(text).toContain("of 2");
  });

  it("states the comparison and the cost multiple in plain words, and leaves the decision to the owner", () => {
    expect(text).toContain("its pick scored 0.95");
    expect(text).toContain("scored 0.90 on average");
    expect(text).toContain("would have scored 0.95");
    expect(text).toContain("about 4.0 times the tokens of one draft");
    expect(text).toContain("owner's decision");
    expect(text).toContain("61 s in all.");
  });

  it("says plainly when the council chose nothing, and when there is nothing to show", () => {
    const none = formatEvalReport(
      run({
        records: [
          alone("maya", "a", "dropped"),
          councilRecord("maya", { winner: null, valid: 0, flagged: true, calls: 1 }),
        ].map((r) =>
          r.kind === "council"
            ? { ...r, score: undefined, best: undefined, average: undefined }
            : r,
        ),
      }),
    );
    expect(none).toContain("No council pick could be scored");
    const empty = formatEvalReport(run({ records: [], runs: 3 }));
    expect(empty).toContain("(0 chats, 3 runs of each)");
    expect(empty).toContain("(none)");
  });

  it("shows only ids, model names, field names and numbers, never chat text", () => {
    expect(text).not.toMatch(/hey Maya|\$240|sketch/);
  });
});
