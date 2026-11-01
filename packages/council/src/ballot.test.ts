import { okReply, testSpec } from "@pactpal/ai/testing";
import { describe, expect, it } from "vitest";
import { readBallot } from "./ballot.js";

const spec = testSpec({ name: "m" });

describe("readBallot", () => {
  it("reads a ranking, also inside a code fence", () => {
    expect(readBallot("m", okReply(spec, '{"ranking":["B","A"]}'))).toEqual({
      ok: true,
      ballot: { voter: "m", ranking: ["B", "A"] },
    });
    expect(readBallot("m", okReply(spec, '```json\n{"ranking":["A"]}\n```'))).toMatchObject({
      ok: true,
    });
  });

  it.each([
    '{"ranking":"A"}',
    '{"ranking":[1,2]}',
    '{"order":["A"]}',
    '{"ranking":["A"],"x":1}',
    "[]",
  ])("calls %s unreadable without repeating it", (text) => {
    expect(readBallot("m", okReply(spec, text))).toEqual({
      ok: false,
      kind: "unreadable",
      reason: "m: the reply is not a ranking",
    });
  });

  it("separates a failed call from an unreadable reply, and refuses a cut-off reply", () => {
    const failed = {
      ok: false,
      model: "m",
      kind: "timeout",
      message: "m: timed out",
      status: undefined,
    } as const;
    expect(readBallot("m", failed)).toEqual({
      ok: false,
      kind: "call_failed",
      reason: "m: timed out",
    });
    expect(readBallot("m", okReply(spec, "no json"))).toMatchObject({ kind: "unreadable" });
    const cut = { ...okReply(spec, '{"ranking":["A"]}'), finishReason: "length" };
    expect(readBallot("m", cut)).toMatchObject({ ok: false, kind: "unreadable" });
  });
});
