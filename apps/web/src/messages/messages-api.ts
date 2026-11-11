import { isObject, readChecked } from "../api";

/** The newest message in one deal's chat, as the conversation list shows it. */
export interface LastMessage {
  seq: number;
  role: "seller" | "buyer" | "system";
  kind: "text" | "notice";
  /** The start of the message, on one line. */
  text: string;
  at: string;
}

export interface Conversation {
  dealId: string;
  last: LastMessage | null;
}

const isLast = (value: unknown): value is LastMessage =>
  isObject(value) &&
  typeof value.seq === "number" &&
  typeof value.role === "string" &&
  typeof value.kind === "string" &&
  typeof value.text === "string" &&
  typeof value.at === "string";

const isConversation = (value: unknown): value is Conversation =>
  isObject(value) &&
  typeof value.dealId === "string" &&
  (value.last === null || isLast(value.last));

/** The newest message of each of the person's deals (read-only; marks nothing read). */
export async function listConversations(): Promise<Conversation[]> {
  const body = await readChecked(
    await fetch("/api/conversations"),
    (b): b is { conversations: unknown[] } => isObject(b) && Array.isArray(b.conversations),
    "load your conversations",
  );
  return body.conversations.filter(isConversation);
}
