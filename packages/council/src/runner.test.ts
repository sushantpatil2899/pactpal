import { FakeChatClient, okReply, testSpec } from "@pactpal/ai/testing";
import type { ChatOutcome, ChatRequest, ModelSpec } from "@pactpal/ai";
import { describe, expect, it } from "vitest";
import { runCouncil, runSingleModel } from "./runner.js";
import type { CouncilDeps, CouncilTask } from "./task.js";

const failure = (model: string, kind: "timeout" | "rate_limited" = "timeout"): ChatOutcome => ({
  ok: false,
  model,
  kind,
  message: `${model}: ${kind}`,
  status: undefined,
});

/** Each member's draft says nothing about who wrote it. */
const DRAFTS: Record<string, string> = {
  alpha: "first draft",
  beta: "second draft",
  gamma: "third draft",
  delta: "fourth draft",
};

const task: CouncilTask<string> = {
  answerRequest: () => ({ messages: [{ role: "user", content: "Draft it." }] }),
  check: (outcome) => {
    if (!outcome.ok) {
      return { ok: false, validation: { valid: false, score: 0, errors: [outcome.message] } };
    }
    if (outcome.text.startsWith("BAD")) {
      return {
        ok: false,
        validation: { valid: false, score: 0.5, errors: ["a citation is wrong"] },
      };
    }
    return { ok: true, content: outcome.text, validation: { valid: true, score: 1, errors: [] } };
  },
  rank: {
    summary: "Drafts of a thing.",
    criteria: ["Be complete."],
    source: "L1| the source",
    render: (content) => JSON.stringify({ draft: content }),
  },
};

const isRankingCall = (request: ChatRequest) =>
  request.messages[0]?.content.includes("careful reviewer") === true;

/** The draft texts of a ranking request, in the order shown (labels A, B, ...). */
function shown(request: ChatRequest): { label: string; draft: string }[] {
  const user = request.messages[1]?.content ?? "";
  return [...user.matchAll(/<draft-\w+ label="(\w+)">\n\{"draft":"([^"]*)"\}/g)].map((m) => ({
    label: m[1] ?? "",
    draft: m[2] ?? "",
  }));
}

/** Replies with a ranking that puts the drafts in the order given (best first); others last. */
function ranking(request: ChatRequest, best: readonly string[]): string {
  const order = shown(request)
    .sort((a, b) => best.indexOf(a.draft) - best.indexOf(b.draft))
    .map((d) => d.label);
  return JSON.stringify({ ranking: order });
}

interface Member {
  spec: ModelSpec;
  client: FakeChatClient;
}

/** A member that drafts as `answer` and ranks by `best`; either part can be replaced. */
function member(
  name: string,
  options: {
    answer?: string | ChatOutcome;
    vote?: (request: ChatRequest) => string | ChatOutcome;
    best?: readonly string[];
    spec?: Partial<ModelSpec>;
  } = {},
): Member {
  const spec = testSpec({ name, ...options.spec });
  const client = new FakeChatClient(spec, (request) => {
    if (isRankingCall(request)) {
      return options.vote?.(request) ?? ranking(request, options.best ?? Object.values(DRAFTS));
    }
    return options.answer ?? DRAFTS[name] ?? `draft by ${name}`;
  });
  return { spec, client };
}

let tick = 0;
const deps = (overrides: Partial<CouncilDeps> = {}): CouncilDeps => {
  tick = 0;
  return {
    rng: () => 0.5,
    newMarker: () => "abcdef123456",
    now: () => (tick += 10),
    ...overrides,
  };
};

/** Runs the council over the members' clients. */
const council = (
  members: Member[],
  overrides: Partial<CouncilDeps> = {},
  options: Parameters<typeof runCouncil>[3] = {},
) =>
  runCouncil(
    task,
    members.map((m) => m.client),
    deps(overrides),
    options,
  );

/** Which label was which model. */
const labelsOf = (run: { labelled: { label: string; answer: { modelName: string } }[] }) =>
  run.labelled.map(({ label, answer }) => ({ label, modelName: answer.modelName }));

const rankingRequests = (members: Member[]) =>
  members.flatMap(({ client }) => client.requests.filter(isRankingCall));

describe("runCouncil", () => {
  it("runs answers, labels, votes and the count, and picks the draft the voters prefer", async () => {
    const members = ["alpha", "beta", "gamma", "delta"].map((name) =>
      member(name, { best: ["third draft", "first draft", "fourth draft", "second draft"] }),
    );
    const run = await runCouncil(
      task,
      members.map((m) => m.client),
      deps(),
    );

    expect(run.result.winner?.answer).toMatchObject({ modelName: "gamma", content: "third draft" });
    expect(run.result.agreement).toBe(1);
    expect(run.result.needsReview).toBe(false);
    expect(run.result.dropped).toEqual([]);
    // rng 0.5 for everyone keeps the order, so labels follow the member order.
    expect(labelsOf(run)).toEqual([
      { label: "A", modelName: "alpha" },
      { label: "B", modelName: "beta" },
      { label: "C", modelName: "gamma" },
      { label: "D", modelName: "delta" },
    ]);
    expect(run.answers.map((a) => a.status)).toEqual(["valid", "valid", "valid", "valid"]);
    expect(run.votes.map((v) => v.status)).toEqual(["ballot", "ballot", "ballot", "ballot"]);
    // Eight calls of 10 + 5 tokens each, and a clock that moves 10 ms at a time.
    expect(run.usage).toEqual({
      calls: 8,
      callsWithoutUsage: 0,
      promptTokens: 80,
      completionTokens: 40,
    });
    expect(run.durationMs).toBe(10);
  });

  it("gives every voter the same drafts and the source, never a model name", async () => {
    const members = ["alpha", "beta", "gamma"].map((name) => member(name));
    await runCouncil(
      task,
      members.map((m) => m.client),
      deps(),
    );
    const requests = rankingRequests(members);
    expect(requests).toHaveLength(3);
    for (const request of requests) {
      const text = request.messages.map((m) => m.content).join("\n");
      expect(text).not.toMatch(/alpha|beta|gamma/);
      expect(text).toContain("L1| the source");
      expect(shown(request).map((d) => d.draft)).toEqual([
        "first draft",
        "second draft",
        "third draft",
      ]);
      expect(request.reply).toMatchObject({ name: "council_ranking" });
    }
  });

  it("shuffles with the injected random numbers", async () => {
    const members = ["alpha", "beta", "gamma"].map((name) => member(name));
    const values = [0.9, 0.5, 0.1];
    let i = 0;
    const run = await runCouncil(
      task,
      members.map((m) => m.client),
      deps({ rng: () => values[i++ % values.length] ?? 0 }),
    );
    expect(labelsOf(run).map((l) => l.modelName)).toEqual(["gamma", "beta", "alpha"]);
  });

  it("drops an invalid draft before the vote, but its model still votes", async () => {
    const members = [
      member("alpha"),
      member("beta", { answer: "BAD draft", best: ["third draft", "first draft"] }),
      member("gamma"),
    ];
    const run = await runCouncil(
      task,
      members.map((m) => m.client),
      deps(),
    );
    expect(run.result.dropped).toEqual([{ modelName: "beta", errors: ["a citation is wrong"] }]);
    expect(run.answers[1]).toMatchObject({
      status: "invalid",
      errors: ["a citation is wrong"],
      validationScore: 0.5,
    });
    expect(labelsOf(run).map((l) => l.modelName)).toEqual(["alpha", "gamma"]);
    expect(run.votes.map((v) => v.voter)).toEqual(["alpha", "beta", "gamma"]);
    for (const request of rankingRequests(members)) {
      expect(shown(request).map((d) => d.draft)).toEqual(["first draft", "third draft"]);
    }
    expect(run.result.winner?.answer.modelName).toBe("gamma");
  });

  it("records a failed answer call and carries on without it", async () => {
    const members = [
      member("alpha"),
      member("beta"),
      member("gamma"),
      member("delta", { answer: failure("delta", "rate_limited") }),
    ];
    const run = await runCouncil(
      task,
      members.map((m) => m.client),
      deps(),
    );
    expect(run.answers[3]).toEqual({
      modelName: "delta",
      status: "call_failed",
      errors: ["delta: rate_limited"],
      validationScore: 0,
      failureKind: "rate_limited",
    });
    expect(run.result.dropped).toEqual([{ modelName: "delta", errors: ["delta: rate_limited"] }]);
    expect(run.votes.map((v) => v.status)).toEqual(["ballot", "ballot", "ballot", "ballot"]);
    expect(run.result.winner).not.toBeNull();
  });

  it("does not ask anyone to vote when only one answer is valid, and flags it", async () => {
    const members = [
      member("alpha"),
      member("beta", { answer: "BAD" }),
      member("gamma", { answer: failure("gamma") }),
    ];
    const run = await runCouncil(
      task,
      members.map((m) => m.client),
      deps(),
    );
    expect(rankingRequests(members)).toEqual([]);
    expect(run.result.winner?.answer.modelName).toBe("alpha");
    expect(run.result.needsReview).toBe(true);
    expect(run.result.reviewReasons).toEqual([
      "only one answer passed validation, so nothing was cross-checked",
    ]);
    expect(run.votes.every((v) => v.status === "not_asked")).toBe(true);
    expect(run.usage.calls).toBe(3);
  });

  it("has no winner and asks nobody when no answer is valid", async () => {
    const members = [
      member("alpha", { answer: "BAD" }),
      member("beta", { answer: failure("beta") }),
    ];
    const run = await runCouncil(
      task,
      members.map((m) => m.client),
      deps(),
    );
    expect(run.result).toMatchObject({
      winner: null,
      needsReview: true,
      reviewReasons: ["no answer passed validation"],
    });
    expect(run.result.dropped).toHaveLength(2);
    expect(rankingRequests(members)).toEqual([]);
    expect(labelsOf(run)).toEqual([]);
  });

  it("records a ballot that failed, one that is unreadable and one that ranks a wrong label", async () => {
    const members = [
      member("alpha"),
      member("beta", { vote: () => failure("beta") }),
      member("gamma", { vote: () => "I would rather not say" }),
      member("delta", { vote: () => JSON.stringify({ ranking: ["A", "A", "Z", "A"] }) }),
    ];
    const run = await runCouncil(
      task,
      members.map((m) => m.client),
      deps(),
    );
    expect(run.votes.map(({ voter, status }) => [voter, status])).toEqual([
      ["alpha", "ballot"],
      ["beta", "call_failed"],
      ["gamma", "unreadable"],
      ["delta", "ballot"],
    ]);
    expect(run.votes[1]?.reason).toBe("beta: timeout");
    expect(run.votes[2]?.reason).toBe("gamma: reply is not JSON");
    expect(run.result.rejectedBallots).toEqual([
      { voter: "delta", reason: 'label "A" ranked twice' },
    ]);
    expect(run.result.needsReview).toBe(true);
    expect(run.result.reviewReasons).toContain("fewer than two valid ballots");
  });

  it("does not count a voter's ranking of its own draft", async () => {
    // Two valid drafts. Alpha and beta each put their own first; gamma (whose draft was dropped) picks beta.
    const members = [
      member("alpha", { best: ["first draft", "second draft"] }),
      member("beta", { best: ["second draft", "first draft"] }),
      member("gamma", { answer: "BAD", best: ["second draft", "first draft"] }),
    ];
    const run = await runCouncil(
      task,
      members.map((m) => m.client),
      deps(),
    );
    expect(run.result.scores.map(({ modelName, votes }) => [modelName, votes])).toEqual([
      ["beta", 1],
      ["alpha", 1],
    ]);
    expect(run.result.winner?.answer.modelName).toBe("beta");
  });

  it("flags voters who disagree", async () => {
    const orders = [
      ["first draft", "second draft", "third draft", "fourth draft"],
      ["fourth draft", "third draft", "second draft", "first draft"],
      ["second draft", "fourth draft", "first draft", "third draft"],
      ["third draft", "first draft", "fourth draft", "second draft"],
    ];
    const members = ["alpha", "beta", "gamma", "delta"].map((name, i) =>
      member(name, { best: orders[i] ?? [] }),
    );
    const run = await runCouncil(
      task,
      members.map((m) => m.client),
      deps(),
    );
    expect(run.result.needsReview).toBe(true);
    expect(run.result.reviewReasons.join(" ")).toMatch(/low agreement/);
  });

  it("puts the schema in the ranking prompt only for models whose host does not enforce it", async () => {
    const members = [
      member("alpha", { spec: { structuredOutput: "strict-schema" } }),
      member("beta", { spec: { structuredOutput: "schema" } }),
      member("gamma", { spec: { structuredOutput: "json-object" } }),
      member("delta", { spec: { structuredOutput: "none" } }),
    ];
    await runCouncil(
      task,
      members.map((m) => m.client),
      deps(),
    );
    const hasSchema = members.map(({ client }) =>
      (client.requests.find(isRankingCall)?.messages[1]?.content ?? "").includes("<reply_schema>"),
    );
    expect(hasSchema).toEqual([false, false, true, true]);
    const schema = members[0]?.client.requests.find(isRankingCall)?.reply;
    expect(schema).toMatchObject({
      schema: { properties: { ranking: { items: { enum: ["A", "B", "C", "D"] } } } },
    });
  });

  it("asks again with a new marker when the first one is in a draft, and gives up after three", async () => {
    const trapped = (marker: string) => member("alpha", { answer: `see ${marker}` });
    const markers = ["abcdef123456", "bbbbbbbb2222", "cccccccc3333"];

    let i = 0;
    const second = [trapped("abcdef123456"), member("beta"), member("gamma")];
    const run = await runCouncil(
      task,
      second.map((m) => m.client),
      deps({ newMarker: () => markers[i++] ?? "" }),
    );
    expect(run.votes.every((v) => v.status === "ballot")).toBe(true);
    expect(rankingRequests(second)[0]?.messages[1]?.content).toContain("<source-bbbbbbbb2222>");

    // Alpha's draft holds all three markers.
    const all = markers.join(" ");
    let j = 0;
    const stuck = [member("alpha", { answer: all }), member("beta"), member("gamma")];
    const failed = await runCouncil(
      task,
      stuck.map((m) => m.client),
      deps({ newMarker: () => markers[j++] ?? "" }),
    );
    expect(failed.votes.every((v) => v.status === "not_asked")).toBe(true);
    expect(failed.votes[0]?.reason).toContain("marker-in-text");
    expect(rankingRequests(stuck)).toEqual([]);
    expect(failed.result.winner).not.toBeNull();
    expect(failed.result.needsReview).toBe(true);
  });

  it("does not ask anyone to vote when the marker is not usable", async () => {
    const members = ["alpha", "beta"].map((name) => member(name));
    const run = await council(members, { newMarker: () => "BAD" });
    expect(run.votes[0]).toMatchObject({ status: "not_asked" });
    expect(run.votes[0]?.reason).toContain("bad-marker");
  });

  it("counts calls whose reply has no token counts separately from the sums", async () => {
    const spec = testSpec({ name: "alpha" });
    const quiet = new FakeChatClient(spec, (request) =>
      isRankingCall(request)
        ? { ...okReply(spec, ranking(request, [])), usage: undefined }
        : { ...okReply(spec, "first draft"), usage: undefined },
    );
    const other = member("beta");
    const run = await runCouncil(task, [quiet, other.client], deps());
    expect(run.usage).toEqual({
      calls: 4,
      callsWithoutUsage: 2,
      promptTokens: 20,
      completionTokens: 10,
    });
    expect(run.answers[0]).not.toHaveProperty("usage");
  });

  it("passes the vote options on to the count", async () => {
    const members = ["alpha", "beta"].map((name) => member(name));
    const run = await council(members, {}, { minMargin: 2 });
    expect(run.result.reviewReasons).toContain("top answers scored almost the same");
  });
});

describe("runSingleModel", () => {
  it("returns a valid answer with its content and usage, and asks nobody to vote", async () => {
    const alpha = member("alpha");
    const run = await runSingleModel(task, alpha.client, deps());
    expect(run).toMatchObject({
      content: "first draft",
      validation: { valid: true, score: 1 },
      answer: { modelName: "alpha", status: "valid" },
      usage: { calls: 1, promptTokens: 10, completionTokens: 5 },
      durationMs: 10,
    });
    expect(alpha.client.requests).toHaveLength(1);
  });

  it("returns an invalid answer or a failed call without content", async () => {
    const bad = await runSingleModel(task, member("alpha", { answer: "BAD" }).client, deps());
    expect(bad).toMatchObject({ answer: { status: "invalid" }, validation: { valid: false } });
    expect(bad).not.toHaveProperty("content");
    const lost = await runSingleModel(
      task,
      member("beta", { answer: failure("beta") }).client,
      deps(),
    );
    expect(lost.answer).toMatchObject({ status: "call_failed", failureKind: "timeout" });
    expect(lost.usage).toMatchObject({ calls: 1, callsWithoutUsage: 1 });
  });
});
