import type { ChatMessageView, Party, ServerFrame } from "@pactpal/live";
import type { ChatView } from "./chat-api";

/** A message this page is sending: shown at once, then replaced by the saved one. */
export interface PendingMessage {
  clientId: string;
  body: string;
  status: "sending" | "failed";
}

export type Connection = "connecting" | "live" | "offline";

/** Everything the chat shows, built only by `chatReducer`. */
export interface ChatState {
  role: Party | undefined;
  open: boolean;
  /** Saved messages, in order, each once. */
  messages: ChatMessageView[];
  pending: PendingMessage[];
  online: Record<Party, boolean>;
  read: Record<Party, number>;
  /** Whether the other side is typing right now. */
  otherTyping: boolean;
  connection: Connection;
}

export const initialChat: ChatState = {
  role: undefined,
  open: true,
  messages: [],
  pending: [],
  online: { seller: false, buyer: false },
  read: { seller: 0, buyer: 0 },
  otherTyping: false,
  connection: "connecting",
};

export type ChatAction =
  | { type: "loaded"; view: ChatView }
  | { type: "frame"; frame: ServerFrame }
  | { type: "connection"; connection: Connection }
  | { type: "sending"; clientId: string; body: string }
  | { type: "sent"; message: ChatMessageView }
  | { type: "failed"; clientId: string }
  | { type: "typing-expired" };

/** Adds messages, keeping one of each position, in order; drops the pending ones they settle. */
function withMessages(state: ChatState, added: readonly ChatMessageView[]): ChatState {
  const bySeq = new Map(state.messages.map((message) => [message.seq, message]));
  for (const message of added) bySeq.set(message.seq, message);
  const settled = new Set(added.map((message) => message.clientId).filter((id) => id !== null));
  return {
    ...state,
    messages: [...bySeq.values()].sort((a, b) => a.seq - b.seq),
    pending: state.pending.filter((p) => !settled.has(p.clientId)),
  };
}

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "loaded":
      return {
        ...withMessages(state, action.view.messages),
        role: action.view.role,
        open: action.view.open,
      };
    case "connection":
      return {
        ...state,
        connection: action.connection,
        ...(action.connection === "live" ? {} : { otherTyping: false }),
      };
    case "sending":
      return {
        ...state,
        pending: [
          ...state.pending.filter((p) => p.clientId !== action.clientId),
          { clientId: action.clientId, body: action.body, status: "sending" },
        ],
      };
    case "sent":
      return withMessages(state, [action.message]);
    case "failed":
      return {
        ...state,
        pending: state.pending.map((p) =>
          p.clientId === action.clientId ? { ...p, status: "failed" } : p,
        ),
      };
    case "typing-expired":
      return { ...state, otherTyping: false };
    case "frame":
      return onFrame(state, action.frame);
  }
}

function onFrame(state: ChatState, frame: ServerFrame): ChatState {
  const mine = (role: Party) => role === state.role;
  switch (frame.type) {
    case "hello":
      return { ...state, role: frame.role, online: frame.online, read: frame.read };
    case "messages": {
      const next = withMessages(state, frame.messages);
      // A message from the other side ends their typing.
      const theyWrote = frame.messages.some((m) => m.role !== "system" && m.role !== state.role);
      return theyWrote ? { ...next, otherTyping: false } : next;
    }
    case "typing":
      return mine(frame.role) ? state : { ...state, otherTyping: frame.typing };
    case "presence":
      return {
        ...state,
        online: { ...state.online, [frame.role]: frame.online },
        ...(mine(frame.role) || frame.online ? {} : { otherTyping: false }),
      };
    case "read":
      return {
        ...state,
        read: { ...state.read, [frame.role]: Math.max(state.read[frame.role], frame.seq) },
      };
    case "notify":
    case "pong":
      return state;
  }
}

/** The last saved position this page has (0 for none). */
export const lastSeq = (state: ChatState): number => state.messages.at(-1)?.seq ?? 0;

/** Messages from the other side or PactPal after what this person has read. */
export function unreadCount(state: ChatState): number {
  const { role } = state;
  if (role === undefined) return 0;
  return state.messages.filter((m) => m.role !== role && m.seq > state.read[role]).length;
}

/** The newest message this person wrote that the other side has read, if any. */
export function lastSeenByOther(state: ChatState): number | undefined {
  const { role } = state;
  if (role === undefined) return undefined;
  const other = role === "seller" ? "buyer" : "seller";
  return state.messages.filter((m) => m.role === role && m.seq <= state.read[other]).at(-1)?.seq;
}

/** Waits before reconnecting: 1 s, 2 s, 5 s, then 10 s. */
export const reconnectDelay = (attempt: number): number => [1000, 2000, 5000][attempt] ?? 10_000;
