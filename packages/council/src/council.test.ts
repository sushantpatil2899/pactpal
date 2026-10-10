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

function answer(modelName: string, score = 1, valid = true, errors: string[] = []): CandidateAnswer<string> {
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
    const result = anonymize([answer("llama"), answer("mistral"), answer("qwen")], () => seq[i++ % seq.length]!);
    expect(result.map((r) => r.label)).toEqual(["A", "B", "C"]);
    expect(result.map((r) => r.answer.modelName).sort()).toEqual(["llama", "mistral", "qwen"]);
    expect(result.map((r) => r.answer.modelName)).not.toEqual(["llama", "mistral", "qwen"]);
  });
});

describe("kendallW", () => {
  it("is 1 for identical rankings and 0 for opposite ones", () => {
    expect(kendallW([["A", "B", "C"], ["A", "B", "C"], ["A", "B", "C"]])).toBeCloseTo(1);
    expect(kendallW([["A", "B", "C"], ["C", "B", "A"]])).toBeCloseTo(0);
  });
});

describe("aggregate", () => {
  it("picks the clear winner and does not flag it", () => {
    const ballots: Ballot[] = [
      { voter: "llama", ranking: ["B", "A", "C"] },
      { voter: "mistral", ranking: ["B", "A", "C"] },
      { voter: "qwen", ranking: ["B", "A", "C"] },
    ];
    const result = aggregate(council, ballots);
    expect(result.winner?.answer.modelName).toBe("mistral");
    expect(result.agreement).toBeCloseTo(1);
    expect(result.needsReview).toBe(false);
  });

  it("ignores a model's vote for its own answer", () => {
    // llama ranks itself first; the other two prefer mistral.
    const ballots: Ballot[] = [
      { voter: "llama", ranking: ["A", "B", "C"] },
      { voter: "mistral", ranking: ["A", "B", "C"] },
      { voter: "qwen", ranking: ["B", "A", "C"] },
    ];
    const result = aggregate(council, ballots);
    expect(result.winner?.answer.modelName).toBe("mistral");
    const llama = result.scores.find((s) => s.modelName === "llama")!;
    expect(llama.votes).toBe(2);
  });

  it("lets a steady second place beat split first places", () => {
    const ballots: Ballot[] = [
      { voter: "v1", ranking: ["A", "B", "C"] },
      { voter: "v2", ranking: ["A", "B", "C"] },
      { voter: "v3", ranking: ["C", "B", "A"] },
      { voter: "v4", ranking: ["C", "B", "A"] },
      { voter: "v5", ranking: ["B", "A", "C"] },
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
    const ballots: Ballot[] = [
      { voter: "v1", ranking: ["A", "B", "C"] },
      { voter: "v2", ranking: ["B", "C", "A"] },
      { voter: "v3", ranking: ["C", "A", "B"] },
    ];
    const result = aggregate(withScores, ballots);
    expect(result.winner?.answer.modelName).toBe("mistral");
    expect(result.agreement).toBeCloseTo(0);
    expect(result.needsReview).toBe(true);
    expect(result.reviewReasons.join(" ")).toMatch(/low agreement/);
  });

  it("falls back to the default model when everything else ties", () => {
    const ballots: Ballot[] = [
      { voter: "v1", ranking: ["A", "B", "C"] },
      { voter: "v2", ranking: ["B", "C", "A"] },
      { voter: "v3", ranking: ["C", "A", "B"] },
    ];
    const result = aggregate(council, ballots, { defaultModel: "qwen" });
    expect(result.winner?.answer.modelName).toBe("qwen");
  });

  it("rejects ballots that skip or repeat a label", () => {
    const ballots: Ballot[] = [
      { voter: "llama", ranking: ["B", "C"] },
      { voter: "mistral", ranking: ["A", "A", "C"] },
      { voter: "qwen", ranking: ["B", "A", "C"] },
      { voter: "v4", ranking: ["B", "A", "C"] },
    ];
    const result = aggregate(council, ballots);
    expect(result.rejectedBallots.map((r) => r.voter)).toEqual(["llama", "mistral"]);
    expect(result.winner?.answer.modelName).toBe("mistral");
  });

  it("returns no winner when nothing passed validation", () => {
    const result = aggregate([], []);
    expect(result.winner).toBeNull();
    expect(result.needsReview).toBe(true);
  });

  it("flags a single surviving answer because nothing cross-checked it", () => {
    const result = aggregate(labelled(["A", answer("llama")]), [{ voter: "mistral", ranking: ["A"] }]);
    expect(result.winner?.answer.modelName).toBe("llama");
    expect(result.needsReview).toBe(true);
  });
});
