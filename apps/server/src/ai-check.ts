/** `pnpm ai:check`: asks every model that has a key one tiny question and reports how it went. */
import { MODEL_REGISTRY, OpenAiCompatibleClient } from "@pactpal/ai";
import { formatErrors, loadConfig } from "./config.js";
import {
  AI_CHECK_PROMPT,
  formatAiReport,
  summarizeOutcome,
  type ModelCheck,
} from "./ai-check-report.js";

const result = loadConfig(process.env);
if (!result.ok) {
  process.stderr.write(formatErrors(result.errors));
  process.exit(1);
}

const { keys } = result.config.ai;
const checks = await Promise.all(
  MODEL_REGISTRY.map(async (spec): Promise<{ spec: typeof spec; check: ModelCheck }> => {
    const key = keys[spec.apiKeyEnv];
    if (key === undefined)
      return { spec, check: { status: "skipped", missingKey: spec.apiKeyEnv } };
    const client = new OpenAiCompatibleClient(spec, key);
    // Room to think: some models spend most of the limit on reasoning before they answer.
    const outcome = await client.complete({
      messages: [{ role: "user", content: AI_CHECK_PROMPT }],
      maxTokens: 1000,
      temperature: 0,
      json: true,
    });
    return { spec, check: summarizeOutcome(outcome) };
  }),
);

process.stdout.write(formatAiReport(checks));
if (checks.some(({ check }) => check.status === "failed")) process.exitCode = 1;
