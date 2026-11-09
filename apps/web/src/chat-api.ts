import { chatMessageSchema, type ChatMessageView } from "@pactpal/live";
import type { StepUpdateStatus } from "@pactpal/timeline";
import { isObject, postStep, readChecked, type StepView } from "./api";

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

/** Something that needs the person, as the server lists it. */
export interface NotificationView {
  id: string;
  dealId: string;
  kind: string;
  tab: string;
  text: string;
  createdAt: string;
  read: boolean;
}

const isNotification = (value: unknown): value is NotificationView =>
  isObject(value) &&
  typeof value.id === "string" &&
  typeof value.dealId === "string" &&
  typeof value.kind === "string" &&
  typeof value.tab === "string" &&
  typeof value.text === "string" &&
  typeof value.createdAt === "string" &&
  typeof value.read === "boolean";

/** The person's notifications, all deals or one. */
export async function getNotifications(dealId?: string): Promise<NotificationView[]> {
  const query = dealId === undefined ? "" : `?dealId=${encodeURIComponent(dealId)}`;
  const body = await readChecked(
    await fetch(`/api/notifications${query}`),
    (b): b is { notifications: unknown[] } => isObject(b) && Array.isArray(b.notifications),
    "load your notifications",
  );
  return body.notifications.filter(isNotification);
}

/** Marks notifications read: some by id, or all of one deal's. */
export async function markNotificationsRead(
  which: { ids: string[] } | { dealId: string },
): Promise<void> {
  await postStep(
    "/api/notifications/read",
    which,
    "mark notifications read",
    (b): b is { changed: number } => isObject(b) && typeof b.changed === "number",
  );
}

/** A file recorded with a timeline update. */
export interface StepFileView {
  id: string;
  filename: string;
  sha256: string;
}

/** One step of the running timeline (7k), as the server answers it. */
export interface RunningStepView extends StepView {
  state: "open" | "submitted" | "changes" | "done";
  waitingOn: "seller" | "buyer" | null;
  next: string;
  /** The updates this person may record now. */
  canDo: StepUpdateStatus[];
  updates: {
    status: StepUpdateStatus;
    actor: "seller" | "buyer";
    at: string;
    note: string | null;
    files: StepFileView[];
  }[];
}

export interface TimelineView {
  signed: boolean;
  version: number | null;
  currency: string;
  steps: RunningStepView[];
}

const isRunningStep = (value: unknown): value is RunningStepView =>
  isObject(value) &&
  typeof value.n === "number" &&
  typeof value.kind === "string" &&
  typeof value.title === "string" &&
  typeof value.state === "string" &&
  typeof value.next === "string" &&
  Array.isArray(value.canDo) &&
  Array.isArray(value.updates);

const isTimeline = (value: unknown): value is TimelineView =>
  isObject(value) &&
  typeof value.signed === "boolean" &&
  typeof value.currency === "string" &&
  Array.isArray(value.steps) &&
  value.steps.every(isRunningStep);

const timelineUrl = (dealId: string) => `/api/deals/${encodeURIComponent(dealId)}/timeline`;

export async function getTimeline(dealId: string): Promise<TimelineView> {
  return readChecked(await fetch(timelineUrl(dealId)), isTimeline, "load the timeline");
}

/** Records an update of a step (7k) and returns the timeline as it now stands. */
export async function updateStep(
  dealId: string,
  step: number,
  input: { status: StepUpdateStatus; note?: string; fileIds?: string[] },
): Promise<TimelineView> {
  return postStep(`${timelineUrl(dealId)}/${String(step)}`, input, "update the step", isTimeline);
}
