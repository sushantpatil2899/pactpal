import { visionModels, type ChatMessage, type ChatOutcome } from "@pactpal/ai";
import type { Database } from "@pactpal/db";
import type { FastifyBaseLogger } from "fastify";
import { z } from "zod";
import type { ModelMemory } from "./model-memory.js";
import type { DraftingRuntime } from "./runtime.js";

/** Models tried per image: the first may fail or give a reply that fails its check. */
export const MODELS_PER_IMAGE = 2;

/** The browser's smaller copy of one image, under 3 MB as base64 (Groq takes 4 MB per image). */
export const MAX_COPY_CHARS = 3_000_000;

/** One image copy as a request body carries it. */
export const imageCopySchema = z.object({
  fileId: z.uuid(),
  mediaType: z.enum(["image/png", "image/jpeg"]),
  base64: z
    .string()
    .min(1)
    .max(MAX_COPY_CHARS)
    .regex(/^[A-Za-z0-9+/]+={0,2}$/),
});

/**
 * Asks the models that read images, in the order their recent records suggest, at most
 * `MODELS_PER_IMAGE`; the first reply `read` accepts wins. Each outcome is remembered for the next
 * choice. Undefined when none answered; an unexpected error is logged by name only, never thrown.
 */
export async function askImageModels<T>(input: {
  db: Database;
  drafting: DraftingRuntime | undefined;
  models: ModelMemory;
  /** The messages for one try; undefined when they cannot be built (for example a bad marker). */
  messages: () => ChatMessage[] | undefined;
  read: (outcome: ChatOutcome) => T | undefined;
  log: FastifyBaseLogger;
  /** Names the step in the log, e.g. "Looking at a delivered image". */
  what: string;
  dealId: string;
}): Promise<{ model: string; value: T } | undefined> {
  const { db, drafting, models, log } = input;
  try {
    const order = await models.order(db, visionModels(drafting?.clients ?? []), MODELS_PER_IMAGE);
    for (const client of order) {
      const messages = input.messages();
      if (!messages) return undefined;
      const outcome = await client.complete({
        messages,
        maxTokens: 2000,
        temperature: 0,
        reply: "json",
      });
      const value = input.read(outcome);
      models.remember(
        client.spec.name,
        value !== undefined,
        outcome.ok ? outcome.latencyMs : undefined,
      );
      if (value !== undefined) return { model: client.spec.name, value };
    }
  } catch (error) {
    log.error(
      { dealId: input.dealId, err: error instanceof Error ? error.name : "unknown" },
      `${input.what} failed`,
    );
  }
  return undefined;
}
