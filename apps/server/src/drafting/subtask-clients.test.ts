import type { ChatOutcome, ChatRequest } from "@pactpal/ai";
import { FakeChatClient, testSpec } from "@pactpal/ai/testing";
import { describe, expect, it } from "vitest";
import { askModel, subtaskClients } from "./subtask-clients.js";

const REQUEST: ChatRequest = { messages: [{ role: "user", content: "hello" }], maxTokens: 10 };
const answer = (model: string): ChatOutcome => ({
  ok: true,
  model,
  text: "{}",
  finishReason: "stop",
  usage: undefined,
  latencyMs: 5,
});

describe("council members answering through task runs (9R-1)", () => {
  it("sends each member's call, by its model's name, through the given call", async () => {
    const calls: [string, ChatRequest][] = [];
    const members = subtaskClients(
      [testSpec({ name: "a" }), testSpec({ name: "b" })],
      (name, req) => {
        calls.push([name, req]);
        return Promise.resolve(answer(name));
      },
    );
    expect(members.map((m) => m.spec.name)).toEqual(["a", "b"]);
    expect(await members[1]?.complete(REQUEST)).toMatchObject({ ok: true, model: "b" });
    expect(calls).toEqual([["b", REQUEST]]);
  });

  it("lets the named member answer a model request, and refuses anything else", async () => {
    const seen: ChatRequest[] = [];
    const clients = [
      new FakeChatClient(testSpec({ name: "a" }), (request) => {
        seen.push(request);
        return "{}";
      }),
    ];
    expect(await askModel(clients, "a", REQUEST)).toMatchObject({ ok: true, text: "{}" });
    expect(seen).toEqual([REQUEST]);
    expect(await askModel(clients, "z", REQUEST)).toMatchObject({
      ok: false,
      kind: "rejected",
      message: "z: no such model",
    });
    expect(await askModel(clients, "a", { messages: [] })).toMatchObject({
      ok: false,
      message: "a: the request was not a model request",
    });
    expect(await askModel(clients, 7, REQUEST)).toMatchObject({ ok: false, model: "unknown" });
  });
});
