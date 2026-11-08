import { describe, expect, it, vi } from "vitest";
import { listenPostgres, type PgListenClient } from "./postgres.js";

type Handler = (...args: never[]) => void;

/** A stand-in `pg` client: records what was sent and lets the test fire its events. */
function fakeClient(options: { failConnect?: boolean } = {}) {
  const handlers = new Map<string, Handler>();
  const sent: string[] = [];
  const client = {
    connect: vi.fn(() =>
      options.failConnect === true ? Promise.reject(new Error("refused")) : Promise.resolve(),
    ),
    query: vi.fn((sql: string) => {
      sent.push(sql);
      return Promise.resolve();
    }),
    on: (event: string, handler: Handler) => {
      handlers.set(event, handler);
      return client;
    },
    end: vi.fn(() => Promise.resolve()),
  };
  const fire = (event: string, ...args: unknown[]) => {
    (handlers.get(event) as ((...a: unknown[]) => void) | undefined)?.(...args);
  };
  return { client: client as unknown as PgListenClient, raw: client, sent, fire };
}

function setup(clients: ReturnType<typeof fakeClient>[]) {
  const made: ReturnType<typeof fakeClient>[] = [];
  const scheduled: { work: () => void; ms: number; cancelled: boolean }[] = [];
  const received: string[] = [];
  const errors: string[] = [];
  let listening = 0;
  const listener = listenPostgres({
    onListening: () => {
      listening += 1;
    },
    url: "postgres://example",
    channel: "pactpal_chat",
    onNotification: (payload) => received.push(payload),
    onError: (error) => errors.push(error.message),
    newClient: () => {
      const next = clients.shift() ?? fakeClient();
      made.push(next);
      return next.client;
    },
    schedule: (work, ms) => {
      const item = { work, ms, cancelled: false };
      scheduled.push(item);
      return () => {
        item.cancelled = true;
      };
    },
  });
  return { listener, made, scheduled, received, errors, listening: () => listening };
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("listening for notifications", () => {
  it("listens on the channel and passes on only its notifications", async () => {
    const { listener, made, received } = setup([fakeClient()]);
    await settle();
    expect(made[0]?.sent).toEqual(["LISTEN pactpal_chat"]);
    made[0]?.fire("notification", { channel: "pactpal_chat", payload: "a" });
    made[0]?.fire("notification", { channel: "other", payload: "b" });
    made[0]?.fire("notification", { channel: "pactpal_chat" });
    expect(received).toEqual(["a"]);
    await listener.close();
    expect(made[0]?.raw.end).toHaveBeenCalled();
  });

  it("reconnects after a failure with growing waits, and resets the wait once connected", async () => {
    const { listener, made, scheduled, errors, listening } = setup([
      fakeClient({ failConnect: true }),
      fakeClient({ failConnect: true }),
      fakeClient(),
    ]);
    await settle();
    expect(errors).toEqual(["refused"]);
    expect(scheduled.map((s) => s.ms)).toEqual([1000]);
    scheduled[0]?.work();
    await settle();
    expect(scheduled.map((s) => s.ms)).toEqual([1000, 2000]);
    scheduled[1]?.work();
    await settle();
    expect(made[2]?.sent).toEqual(["LISTEN pactpal_chat"]);
    expect(listening()).toBe(1);

    made[2]?.fire("error", new Error("lost"));
    made[2]?.fire("end");
    expect(errors).toEqual(["refused", "refused", "lost"]);
    expect(scheduled.map((s) => s.ms)).toEqual([1000, 2000, 1000]);
    await listener.close();
    expect(scheduled[2]?.cancelled).toBe(true);
  });

  it("treats an ended connection as a failure and stops retrying once closed", async () => {
    const { listener, made, scheduled, errors } = setup([fakeClient()]);
    await settle();
    made[0]?.fire("end");
    expect(errors).toEqual(["The listening connection ended"]);
    await listener.close();
    scheduled[0]?.work();
    await settle();
    expect(made).toHaveLength(1);
  });

  it("refuses a channel name that would need quoting", () => {
    expect(() =>
      listenPostgres({
        url: "x",
        channel: "bad; DROP",
        onNotification: () => undefined,
        onError: () => undefined,
      }),
    ).toThrow("Invalid channel name");
  });
});
