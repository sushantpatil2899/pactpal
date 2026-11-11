import { createClient } from "redis";
import type { LogSink } from "./payments/payment-sync.js";

/**
 * A small store shared by every copy of the server (9R-2): counters for limits, and JSON values
 * that expire. On Render it is Key Value; without it, this copy's memory.
 */
export interface SharedStore {
  /** Counts one more hit on `key`, whose count starts again after `windowSeconds`; the count. */
  hit(key: string, windowSeconds: number): Promise<number>;
  /** The value kept under `key`, or undefined (also when it has expired). */
  getJson(key: string): Promise<unknown>;
  /** Keeps `value` under `key` for `ttlSeconds`. */
  setJson(key: string, value: unknown, ttlSeconds: number): Promise<void>;
  close(): Promise<void>;
}

/** The store in this copy's memory (`now` in milliseconds): for one copy, local runs and tests. */
export function memoryStore(now: () => number = Date.now): SharedStore {
  const counts = new Map<string, { count: number; until: number }>();
  const values = new Map<string, { json: string; until: number }>();
  const live = <T extends { until: number }>(map: Map<string, T>, key: string) => {
    const entry = map.get(key);
    if (entry && entry.until <= now()) map.delete(key);
    return entry && entry.until > now() ? entry : undefined;
  };
  return {
    hit(key, windowSeconds) {
      const entry = live(counts, key) ?? { count: 0, until: now() + windowSeconds * 1000 };
      entry.count += 1;
      counts.set(key, entry);
      return Promise.resolve(entry.count);
    },
    getJson(key) {
      const entry = live(values, key);
      return Promise.resolve(entry === undefined ? undefined : (JSON.parse(entry.json) as unknown));
    },
    setJson(key, value, ttlSeconds) {
      values.set(key, { json: JSON.stringify(value), until: now() + ttlSeconds * 1000 });
      return Promise.resolve();
    },
    close: () => Promise.resolve(),
  };
}

/** The slice of a Redis client the store uses (node-redis), so tests can stand in for it. */
export interface RedisCommands {
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number, mode?: "NX"): Promise<unknown>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options: { EX: number }): Promise<unknown>;
  close(): Promise<unknown>;
}

/**
 * The store in Render Key Value (Redis-compatible). A failure never breaks a request: a count
 * that cannot be made answers 0 (so nothing is refused for it), a value that cannot be read is
 * missing, and one that cannot be kept is skipped; each is logged by name.
 */
export function keyValueStore(redis: RedisCommands, log: LogSink): SharedStore {
  const failed = (what: string, error: unknown) => {
    log.error({ err: error instanceof Error ? error.name : "unknown" }, `Key Value ${what} failed`);
  };
  return {
    async hit(key, windowSeconds) {
      try {
        const count = await redis.incr(key);
        // Only the first hit starts the window; later ones leave its end where it is.
        await redis.expire(key, windowSeconds, "NX");
        return count;
      } catch (error) {
        failed("count", error);
        return 0;
      }
    },
    async getJson(key) {
      try {
        const text = await redis.get(key);
        return text === null ? undefined : (JSON.parse(text) as unknown);
      } catch (error) {
        failed("read", error);
        return undefined;
      }
    },
    async setJson(key, value, ttlSeconds) {
      try {
        await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
      } catch (error) {
        failed("write", error);
      }
    },
    async close() {
      await redis.close().catch(() => undefined);
    },
  };
}

/** Connects to Key Value at `url` (Render's internal address); the client reconnects by itself. */
export async function connectKeyValue(url: string, log: LogSink): Promise<SharedStore> {
  const client = createClient({ url, socket: { connectTimeout: 5_000 } });
  client.on("error", (error: unknown) => {
    log.error(
      { err: error instanceof Error ? error.name : "unknown" },
      "Key Value connection error",
    );
  });
  await client.connect();
  return keyValueStore(client, log);
}
