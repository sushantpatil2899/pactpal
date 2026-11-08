import { describe, expect, it } from "vitest";
import { otherParty, parseClientFrame, parseServerFrame } from "./index.js";

describe("live frames", () => {
  it("reads a page's frames and refuses anything else", () => {
    expect(parseClientFrame('{"type":"typing","typing":true}')).toEqual({
      type: "typing",
      typing: true,
    });
    expect(parseClientFrame('{"type":"read","seq":4}')).toEqual({ type: "read", seq: 4 });
    expect(parseClientFrame('{"type":"ping"}')).toEqual({ type: "ping" });
    expect(parseClientFrame('{"type":"read","seq":-1}')).toBeUndefined();
    expect(parseClientFrame('{"type":"ping","extra":1}')).toBeUndefined();
    expect(parseClientFrame('{"type":"message","body":"hi"}')).toBeUndefined();
    expect(parseClientFrame("not json")).toBeUndefined();
  });

  it("reads the server's frames", () => {
    const hello = {
      type: "hello",
      role: "buyer",
      online: { seller: true, buyer: true },
      read: { seller: 2, buyer: 0 },
    };
    expect(parseServerFrame(JSON.stringify(hello))).toEqual(hello);
    const message = {
      id: "m1",
      seq: 1,
      role: "system",
      kind: "notice",
      name: "PactPal",
      body: "Version 2 is ready",
      notice: { type: "review-requested", version: 2 },
      clientId: null,
      createdAt: "2026-11-08T10:00:00.000Z",
    };
    expect(parseServerFrame(JSON.stringify({ type: "messages", messages: [message] }))).toEqual({
      type: "messages",
      messages: [message],
    });
    expect(parseServerFrame('{"type":"presence","role":"admin","online":true}')).toBeUndefined();
  });

  it("names the other side", () => {
    expect(otherParty("seller")).toBe("buyer");
    expect(otherParty("buyer")).toBe("seller");
  });
});
