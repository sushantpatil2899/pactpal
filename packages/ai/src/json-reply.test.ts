import { describe, expect, it } from "vitest";
import { parseJsonReply } from "./json-reply.js";
import { okReply, testSpec } from "./testing.js";

const spec = testSpec({ name: "m" });

describe("parseJsonReply", () => {
  it.each([
    ['{"a":1}', { a: 1 }],
    ['  {"a": 1}\n', { a: 1 }],
    ['```json\n{"a":1}\n```', { a: 1 }],
    ['```\n{"a":1}\n```', { a: 1 }],
    ['Here is the JSON:\n{"a":{"b":[1,2]}}\nHope that helps!', { a: { b: [1, 2] } }],
    ["[1,2]", [1, 2]],
  ])("reads %j", (text, value) => {
    expect(parseJsonReply(okReply(spec, text))).toEqual({ ok: true, value });
  });

  it("refuses a reply that was cut off, even when what is left parses", () => {
    const cut = { ...okReply(spec, '{"a":1}'), finishReason: "length" };
    expect(parseJsonReply(cut)).toEqual({
      ok: false,
      kind: "cut_off",
      message: "m: reply was cut off by the length limit",
    });
  });

  it("reports text with no JSON without repeating it", () => {
    const result = parseJsonReply(okReply(spec, "Sorry, I cannot help with that private chat"));
    expect(result).toEqual({ ok: false, kind: "not_json", message: "m: reply is not JSON" });
    expect(parseJsonReply(okReply(spec, "{ not json }"))).toMatchObject({ kind: "not_json" });
  });

  it("passes a failed call through", () => {
    const failed = {
      ok: false,
      model: "m",
      kind: "timeout",
      message: "m: timed out",
      status: undefined,
    } as const;
    expect(parseJsonReply(failed)).toEqual({
      ok: false,
      kind: "call_failed",
      message: "m: timed out",
    });
  });
});
