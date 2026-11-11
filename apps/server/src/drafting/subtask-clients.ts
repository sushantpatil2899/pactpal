import type { ChatClient, ChatOutcome, ChatRequest, ModelSpec } from "@pactpal/ai";
import { z } from "zod";

/** Asks one model, by name, somewhere else (on Render: a run of the `ask-model` task). */
export type ModelCall = (modelName: string, request: ChatRequest) => Promise<ChatOutcome>;

/**
 * Council members whose answers come through `call` (9R-1): the council is unchanged, but on
 * Render each model call becomes its own task run, side by side, each with its own time limit.
 * Pure.
 */
export const subtaskClients = (specs: readonly ModelSpec[], call: ModelCall): ChatClient[] =>
  specs.map((spec) => ({ spec, complete: (request) => call(spec.name, request) }));

/**
 * The shape of a model request crossing between tasks: checked before it reaches a model. The
 * request comes from PactPal's own parent task; the check stops anything else.
 */
const requestSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["system", "user", "assistant"]), content: z.unknown() }))
    .min(1),
  maxTokens: z.number().int().positive().optional(),
  temperature: z.number().min(0).max(2).optional(),
  reply: z.unknown().optional(),
});

/**
 * One model call made in its own task run: the named council member answers the request. An
 * unknown model or a request of the wrong shape answers "rejected", never a crash.
 */
export async function askModel(
  clients: readonly ChatClient[],
  modelName: unknown,
  request: unknown,
): Promise<ChatOutcome> {
  const name = typeof modelName === "string" ? modelName : "unknown";
  const client = clients.find((c) => c.spec.name === name);
  const parsed = requestSchema.safeParse(request);
  if (!client || !parsed.success) {
    return {
      ok: false,
      model: name,
      kind: "rejected",
      message: client ? `${name}: the request was not a model request` : `${name}: no such model`,
      status: undefined,
    };
  }
  // Checked by shape above; the messages' contents are the council's own prompt parts.
  return client.complete(parsed.data as ChatRequest);
}
