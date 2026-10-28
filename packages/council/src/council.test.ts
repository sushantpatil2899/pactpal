import { describe, expect, it } from "vitest";
import {
  aggregate,
  anonymize,
  filterValid,
  kendallW,
  type Ballot,
  type CandidateAnswer,
  type LabelledAnswer,
} from "./index.js";

function answer(
  modelName: string,
  score = 1,
  valid = true,
  errors: string[] = [],
): CandidateAnswer<string> {
  return { modelName, content: `answer from ${modelName}`, validation: { valid, score, errors } };
}

function labelled(...pairs: [string, CandidateAnswer<string>][]): LabelledAnswer<string>[] {
  return pairs.map(([label, a]) => ({ label, answer: a }));
}

const council = labelled(["A", answer("llama")], ["B", answer("mistral")], ["C", answer("qwen")]);

describe("filterValid", () => {
  it("drops answers that failed the code checks before any vote", () => {
    const { valid, dropped } = filterValid([
      answer("llama"),
      answer("mistral", 0.4, false, ["citation L99 does not exist"]),
      answer("qwen"),
    ]);
    expect(valid.map((a) => a.modelName)).toEqual(["llama", "qwen"]);
    expect(dropped).toEqual([{ modelName: "mistral", errors: ["citation L99 does not exist"] }]);
  });
});

describe("anonymize", () => {
  it("labels every answer once, in shuffled order", () => {
    const seq = [0.9, 0.1, 0.5];
    let i = 0;
    const result = anonymize(
      [answer("llama"), answer("mistral"), answer("qwen")],
      () => seq[i++ % seq.length]!,
    );
    expect(result.map((r) => r.label)).toEqual(["A", "B", "C"]);
    expect(result.map((r) => r.answer.modelName).sort()).toEqual(["llama", "mistral", "qwen"]);
    expect(result.map((r) => r.answer.modelName)).not.toEqual(["llama", "mistral", "qwen"]);
  });

  it("keeps the original order when random keys tie", () => {
    const result = anonymize([answer("llama"), answer("mistral")], () => 0.5);
    expect(result.map((r) => r.answer.modelName)).toEqual(["llama", "mistral"]);
  });
});

describe("kendallW", () => {
  it("is 1 for identical rankings and 0 for opposite ones", () => {
    expect(
      kendallW([
        ["A", "B", "C"],
        ["A", "B", "C"],
        ["A", "B", "C"],
      ]),
    ).toBeCloseTo(1);
    expect(
      kendallW([
        ["A", "B", "C"],
        ["C", "B", "A"],
      ]),
    ).toBeCloseTo(0);
  });
});

const vote = (voter: string, ...ranking: string[]): Ballot => ({ voter, ranking });

/** Three voters who each prefer a different answer: A>B>C, B>C>A, C>A>B. */
const cycle = [vote("v1", "A", "B", "C"), vote("v2", "B", "C", "A"), vote("v3", "C", "A", "B")];

describe("aggregate", () => {
  it("picks the clear winner and does not flag it", () => {
    const ballots = ["llama", "mistral", "qwen"].map((voter) => vote(voter, "B", "A", "C"));
    const result = aggregate(council, ballots);
    expect(result.winner?.answer.modelName).toBe("mistral");
    expect(result.agreement).toBeCloseTo(1);
    expect(result.needsReview).toBe(false);
  });

  it("ignores a model's vote for its own answer", () => {
    // llama ranks itself first; the other two prefer mistral.
    const ballots = [
      vote("llama", "A", "B", "C"),
      vote("mistral", "A", "B", "C"),
      vote("qwen", "B", "A", "C"),
    ];
    const result = aggregate(council, ballots);
    expect(result.winner?.answer.modelName).toBe("mistral");
    const llama = result.scores.find((s) => s.modelName === "llama")!;
    expect(llama.votes).toBe(2);
  });

  it("lets a steady second place beat split first places", () => {
    const ballots = [
      vote("v1", "A", "B", "C"),
      vote("v2", "A", "B", "C"),
      vote("v3", "C", "B", "A"),
      vote("v4", "C", "B", "A"),
      vote("v5", "B", "A", "C"),
    ];
    const result = aggregate(council, ballots);
    expect(result.winner?.label).toBe("B");
    expect(result.scores[0]!.score).toBeCloseTo(0.6);
  });

  it("resolves a three-way cycle by validation score and flags it", () => {
    const withScores = labelled(
      ["A", answer("llama", 0.8)],
      ["B", answer("mistral", 0.9)],
      ["C", answer("qwen", 0.8)],
    );
    const result = aggregate(withScores, cycle);
    expect(result.winner?.answer.modelName).toBe("mistral");
    expect(result.agreement).toBeCloseTo(0);
    expect(result.needsReview).toBe(true);
    expect(result.reviewReasons.join(" ")).toMatch(/low agreement/);
  });

  it("falls back to the default model when everything else ties", () => {
    const result = aggregate(council, cycle, { defaultModel: "qwen" });
    expect(result.winner?.answer.modelName).toBe("qwen");
  });

  it("rejects ballots that skip or repeat a label", () => {
    const ballots = [
      vote("llama", "B", "C"),
      vote("mistral", "A", "A", "C"),
      vote("qwen", "B", "A", "C"),
      vote("v4", "B", "A", "C"),
    ];
    const result = aggregate(council, ballots);
    expect(result.rejectedBallots.map((r) => r.voter)).toEqual(["llama", "mistral"]);
    expect(result.winner?.answer.modelName).toBe("mistral");
  });

  it("skips a ballot left with one answer once its own vote is removed", () => {
    const pair = labelled(["A", answer("llama")], ["B", answer("mistral")]);
    const result = aggregate(pair, [vote("llama", "A", "B"), vote("mistral", "A", "B")]);
    expect(result.scores.every((s) => s.votes === 0)).toBe(true);
    expect(result.needsReview).toBe(true);
  });

  it("returns no winner when nothing passed validation", () => {
    const result = aggregate([], []);
    expect(result.winner).toBeNull();
    expect(result.needsReview).toBe(true);
  });

  it("flags a single surviving answer because nothing cross-checked it", () => {
    const result = aggregate(labelled(["A", answer("llama")]), [vote("mistral", "A")]);
    expect(result.winner?.answer.modelName).toBe("llama");
    expect(result.needsReview).toBe(true);
  });
});
