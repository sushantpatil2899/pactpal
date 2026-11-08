import type { ChatMessageView } from "@pactpal/live";
import { describe, expect, it } from "vitest";
import {
  chatReducer,
  initialChat,
  lastSeenByOther,
  lastSeq,
  reconnectDelay,
  unreadCount,
  type ChatAction,
  type ChatState,
} from "./chat-state";

const message = (
  seq: number,
  role: ChatMessageView["role"],
  clientId: string | null = null,
): ChatMessageView => ({
  id: `m${String(seq)}`,
  seq,
  role,
  kind: role === "system" ? "notice" : "text",
  name: role,
  body: `message ${String(seq)}`,
  notice: null,
  clientId,
  createdAt: "2026-11-08T10:00:00.000Z",
});

const run = (...actions: ChatAction[]): ChatState => actions.reduce(chatReducer, initialChat);
const hello: ChatAction = {
  type: "frame",
  frame: {
    type: "hello",
    role: "buyer",
    online: { seller: true, buyer: true },
    read: { seller: 1, buyer: 0 },
  },
};

describe("the chat's state", () => {
  it("keeps each message once, in order, whether loaded or pushed", () => {
    const state = run(
      {
        type: "loaded",
        view: { role: "buyer", open: true, messages: [message(2, "seller"), message(1, "buyer")] },
      },
      {
        type: "frame",
        frame: { type: "messages", messages: [message(2, "seller"), message(3, "system")] },
      },
    );
    expect(state.messages.map((m) => m.seq)).toEqual([1, 2, 3]);
    expect(lastSeq(state)).toBe(3);
    expect(lastSeq(initialChat)).toBe(0);
  });

  it("shows a message being sent until the saved one arrives, and marks a failed one", () => {
    const sending = run(
      hello,
      { type: "sending", clientId: "c1", body: "hi" },
      { type: "sending", clientId: "c2", body: "yo" },
    );
    expect(sending.pending.map((p) => p.status)).toEqual(["sending", "sending"]);
    const failed = chatReducer(sending, { type: "failed", clientId: "c2" });
    expect(failed.pending.map((p) => p.status)).toEqual(["sending", "failed"]);
    const sent = chatReducer(failed, { type: "sent", message: message(1, "buyer", "c1") });
    expect(sent.pending.map((p) => p.clientId)).toEqual(["c2"]);
    const retried = chatReducer(sent, { type: "sending", clientId: "c2", body: "yo" });
    expect(retried.pending).toEqual([{ clientId: "c2", body: "yo", status: "sending" }]);
  });

  it("shows the other side typing until they write, leave or the hint expires", () => {
    const typing = run(hello, {
      type: "frame",
      frame: { type: "typing", role: "seller", typing: true },
    });
    expect(typing.otherTyping).toBe(true);
    expect(
      chatReducer(typing, {
        type: "frame",
        frame: { type: "typing", role: "buyer", typing: false },
      }).otherTyping,
    ).toBe(true);
    expect(
      chatReducer(typing, {
        type: "frame",
        frame: { type: "messages", messages: [message(1, "seller")] },
      }).otherTyping,
    ).toBe(false);
    expect(
      chatReducer(typing, {
        type: "frame",
        frame: { type: "messages", messages: [message(1, "system")] },
      }).otherTyping,
    ).toBe(true);
    expect(
      chatReducer(typing, {
        type: "frame",
        frame: { type: "presence", role: "seller", online: false },
      }),
    ).toMatchObject({
      otherTyping: false,
      online: { seller: false, buyer: true },
    });
    expect(chatReducer(typing, { type: "typing-expired" }).otherTyping).toBe(false);
    expect(chatReducer(typing, { type: "connection", connection: "offline" })).toMatchObject({
      otherTyping: false,
      connection: "offline",
    });
    expect(chatReducer(typing, { type: "connection", connection: "live" }).otherTyping).toBe(true);
  });

  it("counts unread messages and finds the last of mine the other side has read", () => {
    const state = run(
      hello,
      {
        type: "frame",
        frame: {
          type: "messages",
          messages: [
            message(1, "seller"),
            message(2, "buyer"),
            message(3, "buyer"),
            message(4, "system"),
          ],
        },
      },
      { type: "frame", frame: { type: "read", role: "seller", seq: 2 } },
      { type: "frame", frame: { type: "read", role: "seller", seq: 1 } },
      { type: "frame", frame: { type: "pong" } },
      { type: "frame", frame: { type: "notify" } },
    );
    expect(state.read.seller).toBe(2);
    expect(unreadCount(state)).toBe(2);
    expect(lastSeenByOther(state)).toBe(2);
    expect(unreadCount(initialChat)).toBe(0);
    expect(lastSeenByOther(initialChat)).toBeUndefined();
    const seller = run(
      { type: "loaded", view: { role: "seller", open: false, messages: [message(1, "seller")] } },
      { type: "frame", frame: { type: "read", role: "buyer", seq: 1 } },
    );
    expect(seller.open).toBe(false);
    expect(lastSeenByOther(seller)).toBe(1);
  });

  it("waits longer before each reconnection, up to 10 seconds", () => {
    expect([0, 1, 2, 3, 9].map(reconnectDelay)).toEqual([1000, 2000, 5000, 10_000, 10_000]);
  });
});
