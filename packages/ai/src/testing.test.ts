import { describe, expect, it } from "vitest";
import { FakeChatClient, okReply, testSpec } from "./testing.js";

describe("FakeChatClient", () => {
  it("answers from the function and remembers each request", async () => {
    const spec = testSpec({ name: "fake" });
    const client = new FakeChatClient(spec, (request) => `got ${request.messages.length}`);
    const outcome = await client.complete({ messages: [{ role: "user", content: "hi" }] });
    expect(outcome).toEqual(okReply(spec, "got 1"));
    expect(client.requests).toHaveLength(1);
  });

  it("can return a failure as it is", async () => {
    const spec = testSpec();
    const failure = {
      ok: false,
      model: spec.name,
      kind: "timeout",
      message: "x",
      status: undefined,
    } as const;
    const client = new FakeChatClient(spec, () => failure);
    expect(await client.complete({ messages: [] })).toEqual(failure);
  });
});
