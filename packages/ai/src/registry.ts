import type { Secret } from "@pactpal/net";
import type { ModelSpec } from "./types.js";

/**
 * The models PactPal can call, all through hosted APIs (nothing runs on our
 * own server). A model takes part only when its key is set. Model ids are
 * checked against each host's own model list with `pnpm ai:check`; changing
 * one is a one-line edit here.
 */
export const MODEL_REGISTRY: readonly ModelSpec[] = [
  {
    name: "gemini",
    family: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKeyEnv: "GEMINI_API_KEY",
    model: "gemini-3.6-flash",
    structuredOutput: "schema",
    vision: true,
  },
  {
    name: "qwen-groq",
    family: "qwen",
    baseUrl: "https://api.groq.com/openai/v1",
    apiKeyEnv: "GROQ_API_KEY",
    model: "qwen/qwen3.8-27b",
    structuredOutput: "schema",
    vision: true,
  },
  {
    name: "gpt-oss-groq",
    family: "gpt-oss",
    baseUrl: "https://api.groq.com/openai/v1",
    apiKeyEnv: "GROQ_API_KEY",
    model: "openai/gpt-oss-120b",
    structuredOutput: "strict-schema",
  },
  {
    name: "mistral",
    family: "mistral",
    baseUrl: "https://api.mistral.ai/v1",
    apiKeyEnv: "MISTRAL_API_KEY",
    model: "ministral-14b-latest",
    structuredOutput: "schema",
    // Reads images, but misjudged a simple figure in the 4l live check; not used for images.
  },
  {
    name: "nemotron-openrouter",
    family: "nemotron",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    // The paid tier (from 11 Nov 2026): the free one gave empty replies and timed out in the demo.
    model: "nvidia/nemotron-3-ultra-550b-a55b",
    structuredOutput: "none",
  },
];

/** The clients whose model also reads images. */
export const visionModels = <T extends { spec: ModelSpec }>(clients: readonly T[]): T[] =>
  clients.filter((client) => client.spec.vision === true);

/** True when the host itself makes the reply fit the schema, so the prompt need not describe it. */
export function schemaEnforced(spec: ModelSpec): boolean {
  return spec.structuredOutput === "strict-schema" || spec.structuredOutput === "schema";
}

const KEY_NAME = /^[A-Z][A-Z0-9_]*$/;

/** Problems that make a registry unusable; empty when it is fine. */
export function registryProblems(specs: readonly ModelSpec[]): string[] {
  const problems: string[] = [];
  const names = new Set<string>();
  for (const spec of specs) {
    if (names.has(spec.name)) problems.push(`${spec.name}: name used twice`);
    names.add(spec.name);
    if (!KEY_NAME.test(spec.apiKeyEnv))
      problems.push(`${spec.name}: key name is not a variable name`);
    if (!/^https:\/\/[^/]+(\/\S*)?$/.test(spec.baseUrl) || spec.baseUrl.endsWith("/")) {
      problems.push(`${spec.name}: address must be https:// with no trailing slash`);
    }
    if (spec.model === "") problems.push(`${spec.name}: model id is empty`);
  }
  return problems;
}

/** Every key variable the registry uses, once each, in registry order. */
export function keyNames(specs: readonly ModelSpec[]): string[] {
  return [...new Set(specs.map((spec) => spec.apiKeyEnv))];
}

/** The models whose key is present. `keys` is keyed by variable name. */
export function readyModels(
  specs: readonly ModelSpec[],
  keys: Readonly<Record<string, Secret | undefined>>,
): ModelSpec[] {
  return specs.filter((spec) => keys[spec.apiKeyEnv] !== undefined);
}
