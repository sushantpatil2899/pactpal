import { FakeChatClient, testSpec } from "@pactpal/ai/testing";
import { describe, expect, it } from "vitest";
import { modelNames, pickModels } from "./cli-models.js";

describe("modelNames", () => {
  it("splits a comma-separated list, trims it, and means all models when it is absent", () => {
    expect(modelNames(undefined)).toEqual([]);
    expect(modelNames("a, b ,c")).toEqual(["a", "b", "c"]);
  });
});

describe("pickModels", () => {
  const clients = ["a", "b", "c"].map((name) => new FakeChatClient(testSpec({ name }), () => "ok"));

  it("keeps all models when none are named, and only the named ones otherwise", () => {
    expect(pickModels(clients, []).picked).toHaveLength(3);
    const some = pickModels(clients, ["c", "a"]);
    expect(some.picked.map((c) => c.spec.name)).toEqual(["a", "c"]);
    expect(some.unknown).toEqual([]);
  });

  it("reports names that are not configured", () => {
    const some = pickModels(clients, ["b", "nope"]);
    expect(some.picked.map((c) => c.spec.name)).toEqual(["b"]);
    expect(some.unknown).toEqual(["nope"]);
  });
});
