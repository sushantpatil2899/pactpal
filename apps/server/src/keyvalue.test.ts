import { describe, expect, it } from "vitest";
import { keyValueStore, memoryStore, type RedisCommands } from "./keyvalue.js";
import { keptLog } from "./disputes/test-support.js";

/** A stand-in for Redis kept in a map, which can be told to fail. */
function fakeRedis() {
  const data = new Map<string, string>();
  const expiries = new Map<string, number>();
  let down = false;
  const guard = () => {
    if (down) return Promise.reject(new Error("ECONNREFUSED"));
    return Promise.resolve();
  };
  const redis: RedisCommands = {
    incr: async (key) => {
      await guard();
      const next = Number(data.get(key) ?? "0") + 1;
      data.set(key, String(next));
      return next;
    },
    expire: async (key, seconds, mode) => {
      await guard();
      if (mode !== "NX" || !expiries.has(key)) expiries.set(key, seconds);
      return 1;
    },
    get: async (key) => {
      await guard();
      return data.get(key) ?? null;
    },
    set: async (key, value, { EX }) => {
      await guard();
      data.set(key, value);
      expiries.set(key, EX);
      return "OK";
    },
    close: () => Promise.resolve(),
  };
  return { redis, expiries, fail: () => (down = true) };
}

describe("the shared store (9R-2)", () => {
  it("counts hits per window and keeps values until they expire, in memory", async () => {
    let now = 0;
    const store = memoryStore(() => now);
    expect([await store.hit("a", 60), await store.hit("a", 60), await store.hit("b", 60)]).toEqual([
      1, 2, 1,
    ]);
    now = 60_000;
    expect(await store.hit("a", 60)).toBe(1);
    await store.setJson("k", { x: 1 }, 10);
    expect(await store.getJson("k")).toEqual({ x: 1 });
    now = 70_000;
    expect(await store.getJson("k")).toBeUndefined();
    await store.close();
  });

  it("uses Key Value: one window per counter, values with their time to live", async () => {
    const { redis, expiries } = fakeRedis();
    const store = keyValueStore(redis, keptLog().log);
    expect([await store.hit("agent:1", 60), await store.hit("agent:1", 30)]).toEqual([1, 2]);
    expect(expiries.get("agent:1")).toBe(60);
    await store.setJson("listing:x", { title: "Tote" }, 3600);
    expect(expiries.get("listing:x")).toBe(3600);
    expect(await store.getJson("listing:x")).toEqual({ title: "Tote" });
    expect(await store.getJson("missing")).toBeUndefined();
  });

  it("never breaks a request when Key Value is down", async () => {
    const { redis, fail } = fakeRedis();
    const { log, lines } = keptLog();
    const store = keyValueStore(redis, log);
    fail();
    expect(await store.hit("agent:1", 60)).toBe(0);
    expect(await store.getJson("k")).toBeUndefined();
    await store.setJson("k", 1, 10);
    expect(JSON.stringify(lines)).toContain("Key Value count failed");
    await store.close();
  });
});
