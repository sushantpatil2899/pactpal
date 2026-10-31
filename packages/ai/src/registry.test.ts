import { Secret } from "@pactpal/net";
import { describe, expect, it } from "vitest";
import { MODEL_REGISTRY, keyNames, readyModels, registryProblems } from "./registry.js";
import { testSpec } from "./testing.js";

describe("MODEL_REGISTRY", () => {
  it("is valid and has several families", () => {
    expect(registryProblems(MODEL_REGISTRY)).toEqual([]);
    expect(new Set(MODEL_REGISTRY.map((spec) => spec.family)).size).toBeGreaterThanOrEqual(4);
  });

  it("names the keys that .env.example documents", () => {
    expect(keyNames(MODEL_REGISTRY)).toEqual([
      "GEMINI_API_KEY",
      "GROQ_API_KEY",
      "MISTRAL_API_KEY",
      "OPENROUTER_API_KEY",
    ]);
  });
});

describe("registryProblems", () => {
  it("accepts a well-formed model", () => {
    expect(registryProblems([testSpec()])).toEqual([]);
  });

  it("names every problem found", () => {
    const problems = registryProblems([
      testSpec({ name: "a" }),
      testSpec({ name: "a", apiKeyEnv: "lower", baseUrl: "http://models.test/", model: "" }),
      testSpec({ name: "b", baseUrl: "https://models.test/v1/" }),
    ]);
    expect(problems).toEqual([
      "a: name used twice",
      "a: key name is not a variable name",
      "a: address must be https:// with no trailing slash",
      "a: model id is empty",
      "b: address must be https:// with no trailing slash",
    ]);
  });
});

describe("keyNames and readyModels", () => {
  const first = testSpec({ name: "one", apiKeyEnv: "ONE_KEY" });
  const second = testSpec({ name: "two", apiKeyEnv: "ONE_KEY" });
  const third = testSpec({ name: "three", apiKeyEnv: "THREE_KEY" });

  it("lists each key once", () => {
    expect(keyNames([first, second, third])).toEqual(["ONE_KEY", "THREE_KEY"]);
  });

  it("keeps only the models whose key is set", () => {
    const keys = { ONE_KEY: new Secret("k"), THREE_KEY: undefined };
    expect(readyModels([first, second, third], keys).map((spec) => spec.name)).toEqual([
      "one",
      "two",
    ]);
    expect(readyModels([first, third], {})).toEqual([]);
  });
});
