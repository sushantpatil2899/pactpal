import { z } from "zod";

/** A deal's two sides, as the chat names them. */
export const PARTIES = ["seller", "buyer"] as const;
export type Party = (typeof PARTIES)[number];
const party = z.enum(PARTIES);

/** The most characters one frame from a page may have (the socket refuses larger ones). */
export const MAX_CLIENT_FRAME_BYTES = 1024;

/**
 * What a page sends on its live connection: whether its person is typing, how far they have
 * read, or a keep-alive. Messages are posted over HTTP, never through the socket, so a post is
 * saved even when the connection is down.
 */
export const clientFrameSchema = z.discriminatedUnion("type", [
  z.strictObject({ type: z.literal("typing"), typing: z.boolean() }),
  z.strictObject({ type: z.literal("read"), seq: z.number().int().min(0) }),
  z.strictObject({ type: z.literal("ping") }),
]);
export type ClientFrame = z.output<typeof clientFrameSchema>;

/** A chat card's subject, as the server stores it. */
export const noticeSchema = z.object({
  type: z.string(),
  version: z.number().int().optional(),
  step: z.number().int().optional(),
});

/** One chat message as both pages see it. */
export const chatMessageSchema = z.object({
  id: z.string(),
  seq: z.number().int(),
  role: z.enum(["seller", "buyer", "system"]),
  kind: z.enum(["text", "notice"]),
  name: z.string(),
  body: z.string(),
  notice: noticeSchema.nullable(),
  clientId: z.string().nullable(),
  createdAt: z.string(),
});
export type ChatMessageView = z.output<typeof chatMessageSchema>;

const bySide = z.object({ seller: z.number().int(), buyer: z.number().int() });
const onlineBySide = z.object({ seller: z.boolean(), buyer: z.boolean() });

/**
 * What the server sends: on opening, who the page's person is, who is online and how far each
 * side has read; then new messages, typing, presence and read changes, and (7e) a nudge that the
 * person's notifications changed.
 */
export const serverFrameSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("hello"), role: party, online: onlineBySide, read: bySide }),
  z.object({ type: z.literal("messages"), messages: z.array(chatMessageSchema) }),
  z.object({ type: z.literal("typing"), role: party, typing: z.boolean() }),
  z.object({ type: z.literal("presence"), role: party, online: z.boolean() }),
  z.object({ type: z.literal("read"), role: party, seq: z.number().int() }),
  z.object({ type: z.literal("notify") }),
  z.object({ type: z.literal("pong") }),
]);
export type ServerFrame = z.output<typeof serverFrameSchema>;

/** A frame's text as a page frame, or undefined when it is not one (or not JSON). */
export function parseClientFrame(text: string): ClientFrame | undefined {
  return parseWith(clientFrameSchema, text);
}

/** A frame's text as a server frame, or undefined when it is not one (or not JSON). */
export function parseServerFrame(text: string): ServerFrame | undefined {
  return parseWith(serverFrameSchema, text);
}

function parseWith<T>(schema: z.ZodType<T>, text: string): T | undefined {
  try {
    const parsed = schema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}

/** The other side of the deal. */
export const otherParty = (role: Party): Party => (role === "seller" ? "buyer" : "seller");
