import { chatMessageSchema, type ChatMessageView } from "@pactpal/live";
import { isObject, postStep, readChecked } from "./api";

/** The deal's chat as the server answers it: whose page this is, whether it is open, messages. */
export interface ChatView {
  role: "seller" | "buyer";
  open: boolean;
  messages: ChatMessageView[];
}

/** A chat pasted by the seller (or brought in by email), readable by both sides. */
export interface PastedChat {
  id: string;
  filename: string;
  addedBy: "seller" | "system";
  addedAt: string;
  text: string;
}

const isMessage = (value: unknown): value is ChatMessageView =>
  chatMessageSchema.safeParse(value).success;

const isChat = (value: unknown): value is ChatView =>
  isObject(value) &&
  (value.role === "seller" || value.role === "buyer") &&
  typeof value.open === "boolean" &&
  Array.isArray(value.messages) &&
  value.messages.every(isMessage);

const isPasted = (value: unknown): value is PastedChat =>
  isObject(value) &&
  typeof value.id === "string" &&
  typeof value.filename === "string" &&
  (value.addedBy === "seller" || value.addedBy === "system") &&
  typeof value.addedAt === "string" &&
  typeof value.text === "string";

const chatUrl = (dealId: string) => `/api/deals/${encodeURIComponent(dealId)}/chat`;

/** The messages after position `after` (at most 200 per answer). */
export async function getChat(dealId: string, after: number): Promise<ChatView> {
  return readChecked(
    await fetch(`${chatUrl(dealId)}?after=${String(after)}`),
    isChat,
    "load the chat",
  );
}

/** Posts a message; `clientId` makes a retry return the same message instead of a second. */
export async function postChat(
  dealId: string,
  body: string,
  clientId: string,
): Promise<ChatMessageView> {
  return postStep(chatUrl(dealId), { body, clientId }, "send the message", isMessage);
}

export async function getPastedChats(dealId: string): Promise<PastedChat[]> {
  const body = await readChecked(
    await fetch(`${chatUrl(dealId)}/pasted`),
    (b): b is { chats: unknown[] } => isObject(b) && Array.isArray(b.chats),
    "load the pasted chats",
  );
  return body.chats.filter(isPasted);
}

/** The live connection's address on this site (wss on https). */
export function liveUrl(
  location: { protocol: string; host: string },
  dealId: string,
  after: number,
) {
  const scheme = location.protocol === "https:" ? "wss:" : "ws:";
  return `${scheme}//${location.host}/api/deals/${encodeURIComponent(dealId)}/live?after=${String(after)}`;
}
