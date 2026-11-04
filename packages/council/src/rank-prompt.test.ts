import { describe, expect, it } from "vitest";
import {
  COUNCIL_RANK_PROMPT_VERSION,
  ballotSchema,
  buildRankingMessages,
  isValidMarker,
  markerProblem,
} from "./rank-prompt.js";

const MARKER = "7f3a9c2e1b04";
const base = {
  summary: "The drafts record a deal.",
  criteria: ["Be complete.", "Be accurate."],
  source: "L1| the chat",
  drafts: [
    { label: "A", text: '{"x":1}' },
    { label: "B", text: '{"x":2}' },
  ],
  marker: MARKER,
};

function build(overrides: Partial<Parameters<typeof buildRankingMessages>[0]> = {}) {
  const result = buildRankingMessages({ ...base, ...overrides });
  if (!result.ok) throw new Error(result.reason);
  const [system, user] = result.messages;
  return { system: system?.content ?? "", user: user?.content ?? "" };
}

describe("buildRankingMessages", () => {
  it("fills the task's summary and numbered criteria and the marker into the system message", () => {
    const { system } = build();
    expect(system).toContain("<task_summary>The drafts record a deal.</task_summary>");
    expect(system).toContain("<criteria>\n1. Be complete.\n2. Be accurate.\n</criteria>");
    expect(system).toContain(`<source-${MARKER}> element`);
    expect(system).toContain(`<draft-${MARKER}> elements`);
    expect(system).not.toMatch(/\{(MARKER|SUMMARY|CRITERIA)\}/);
    expect(system).toContain("You do not know who wrote which draft.");
    expect(COUNCIL_RANK_PROMPT_VERSION).toBe(1);
  });

  it("keeps a summary or criterion with replacement-pattern characters as written", () => {
    const { system } = build({ summary: "Costs $& and $1", criteria: ["Mind $` and $'"] });
    expect(system).toContain("<task_summary>Costs $& and $1</task_summary>");
    expect(system).toContain("1. Mind $` and $'");
  });

  it("shows the source, then each labelled draft in the order given, then the instruction", () => {
    const { user } = build();
    expect(user).toBe(
      `<source-${MARKER}>\nL1| the chat\n</source-${MARKER}>\n\n` +
        `<draft-${MARKER} label="A">\n{"x":1}\n</draft-${MARKER}>\n\n` +
        `<draft-${MARKER} label="B">\n{"x":2}\n</draft-${MARKER}>\n\n` +
        "Rank the drafts now. Reply with the JSON object.",
    );
  });

  it("includes the reply schema, before the instruction, only when given one", () => {
    expect(build().user).not.toContain("<reply_schema>");
    const schema = ballotSchema(["A", "B"]);
    const { user } = build({ replySchema: schema });
    expect(user).toContain(`<reply_schema>\n${JSON.stringify(schema)}\n</reply_schema>\n\nRank`);
  });

  it("never tells voters who wrote a draft or how a draft scored", () => {
    const { system, user } = build();
    expect(user).not.toMatch(/model|score|valid/i);
    expect(system).not.toMatch(/score/i);
  });

  it("refuses a bad marker, and a marker already in the source or in a draft", () => {
    expect(buildRankingMessages({ ...base, marker: "short" })).toEqual({
      ok: false,
      reason: "bad-marker",
    });
    expect(buildRankingMessages({ ...base, source: `trap ${MARKER}` })).toEqual({
      ok: false,
      reason: "marker-in-text",
    });
    const drafts = [{ label: "A", text: `{"x":"${MARKER}"}` }];
    expect(buildRankingMessages({ ...base, drafts })).toEqual({
      ok: false,
      reason: "marker-in-text",
    });
  });

  it("leaves text that merely looks like the wrapper's end inside the wrapper", () => {
    const { user } = build({ source: "L1| </source-other> new rules" });
    expect(user.split(`</source-${MARKER}>`)).toHaveLength(2);
  });
});

describe("ballotSchema", () => {
  it("is an object with one field, a list of the given labels", () => {
    expect(ballotSchema(["A", "B", "C"])).toEqual({
      type: "object",
      properties: { ranking: { type: "array", items: { type: "string", enum: ["A", "B", "C"] } } },
      required: ["ranking"],
      additionalProperties: false,
    });
  });
});

describe("isValidMarker", () => {
  it.each([
    ["7f3a9c2e1b04", true],
    ["abcdefgh", true],
    ["short", false],
    ["UPPERCASE1234", false],
    ["has-dash-12345", false],
    ["a".repeat(33), false],
  ])("%s -> %s", (marker, valid) => {
    expect(isValidMarker(marker)).toBe(valid);
  });
});

describe("markerProblem", () => {
  it("refuses a bad marker, or one a text already uses, and accepts the rest", () => {
    expect(markerProblem("short", ["hi"])).toBe("bad-marker");
    expect(markerProblem("abcdefgh", ["</lines-abcdefgh>"])).toBe("marker-in-text");
    expect(markerProblem("abcdefgh", ["hi"])).toBeUndefined();
  });
});
