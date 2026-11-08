import { z } from "zod";
import type { Queryable } from "./database.js";

/** The Postgres notification channel that carries chat events between server copies. */
export const CHAT_CHANNEL = "pactpal_chat";

const party = z.enum(["seller", "buyer"]);

/**
 * What one copy of the server (or the background worker) tells the others about a deal's chat:
 * new messages to read from the database (never the text itself), someone typing, a page
 * opening or closing, how far someone has read, or (7e) a person's notifications changing.
 */
export const chatEventSchema = z.discriminatedUnion("type", [
  z.strictObject({ type: z.literal("messages"), dealId: z.uuid() }),
  z.strictObject({
    type: z.literal("typing"),
    dealId: z.uuid(),
    role: party,
    typing: z.boolean(),
  }),
  z.strictObject({
    type: z.literal("presence"),
    dealId: z.uuid(),
    role: party,
    online: z.boolean(),
    /** Which server copy the page is connected to, so each copy keeps its own count. */
    server: z.string().min(1).max(64),
  }),
  z.strictObject({ type: z.literal("read"), dealId: z.uuid(), role: party, seq: z.number().int() }),
  z.strictObject({ type: z.literal("notify"), userId: z.uuid() }),
]);
export type ChatEvent = z.output<typeof chatEventSchema>;

/**
 * Announces a chat event to every copy of the server listening on `CHAT_CHANNEL`. Call it after
 * the change it announces is committed; inside a transaction Postgres sends it at commit.
 */
export async function publishChatEvent(q: Queryable, event: ChatEvent): Promise<void> {
  await q.query("SELECT pg_notify($1, $2)", [
    CHAT_CHANNEL,
    JSON.stringify(chatEventSchema.parse(event)),
  ]);
}

/** A received notification's text as an event, or undefined when it is not one. */
export function parseChatEvent(payload: string): ChatEvent | undefined {
  try {
    const event = chatEventSchema.safeParse(JSON.parse(payload));
    return event.success ? event.data : undefined;
  } catch {
    return undefined;
  }
}
