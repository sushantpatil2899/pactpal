import pg from "pg";
import type { Database, Queryable, Row } from "./database.js";

/** The slice of a `pg` connection that the adapter uses (lets tests supply a fake). */
export interface PgConnection {
  query(sql: string, params?: unknown[]): Promise<{ rows: Row[] }>;
}

export interface PgClient extends PgConnection {
  release(): void;
}

/** The slice of a `pg` pool that the adapter uses. */
export interface PgPool extends PgConnection {
  connect(): Promise<PgClient>;
  end(): Promise<void>;
  on(event: "error", listener: (error: Error) => void): unknown;
}

export interface PostgresOptions {
  /** Connection string. Never log it: it holds the password. */
  url: string;
  /** Called for errors on idle connections, which must not crash the server. */
  onError: (error: Error) => void;
  /** Most connections open at once (small hosted plans allow about 100 in total). */
  maxConnections?: number;
}

const CONNECT_TIMEOUT_MS = 10_000;
const STATEMENT_TIMEOUT_MS = 30_000;
const IDLE_TIMEOUT_MS = 30_000;

function queryOn(connection: PgConnection): Queryable["query"] {
  // `pg` sends a statement without values as a simple query, which also allows several statements at once.
  return async (sql, params) => (await connection.query(sql, params && [...params])).rows;
}

/** Wraps a pool as a `Database`. Exported so tests can pass a fake pool. */
export function databaseFromPool(pool: PgPool, onError: (error: Error) => void): Database {
  pool.on("error", onError);
  return {
    query: queryOn(pool),
    async transaction(work) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const result = await work({ query: queryOn(client) });
        await client.query("COMMIT");
        return result;
      } catch (error) {
        // A failed rollback must not hide the error that caused it.
        await client.query("ROLLBACK").catch(onError);
        throw error;
      } finally {
        client.release();
      }
    },
    close: () => pool.end(),
  };
}

/** Opens a pooled connection to Postgres. Connects lazily, on the first query. */
export function connectPostgres(options: PostgresOptions): Database {
  const pool = new pg.Pool({
    connectionString: options.url,
    max: options.maxConnections ?? 5,
    connectionTimeoutMillis: CONNECT_TIMEOUT_MS,
    idleTimeoutMillis: IDLE_TIMEOUT_MS,
    statement_timeout: STATEMENT_TIMEOUT_MS,
  });
  return databaseFromPool(pool, options.onError);
}

/** The slice of a `pg` client that listening uses (lets tests supply a fake). */
export interface PgListenClient {
  connect(): Promise<unknown>;
  query(sql: string): Promise<unknown>;
  on(
    event: "notification",
    listener: (message: { channel: string; payload?: string }) => void,
  ): unknown;
  on(event: "error", listener: (error: Error) => void): unknown;
  on(event: "end", listener: () => void): unknown;
  end(): Promise<void>;
}

export interface ListenOptions {
  /** Connection string. Never log it: it holds the password. */
  url: string;
  /** Lower-case letters and underscores only (it cannot be sent as a value). */
  channel: string;
  onNotification: (payload: string) => void;
  /** Connection problems; the listener reconnects by itself. */
  onError: (error: Error) => void;
  /** Called each time listening starts, including after a reconnection (state may be stale). */
  onListening?: () => void;
  /** Makes a client; a real `pg` client by default. */
  newClient?: (url: string) => PgListenClient;
  /** Runs `work` after `ms`; `setTimeout` by default. Returns a way to cancel it. */
  schedule?: (work: () => void, ms: number) => () => void;
}

/** Waits before each reconnection: 1 s, 2 s, 5 s, 10 s, then every 30 s. */
const RECONNECT_DELAYS_MS = [1000, 2000, 5000, 10_000, 30_000];

const defaultSchedule = (work: () => void, ms: number) => {
  const timer = setTimeout(work, ms);
  return () => {
    clearTimeout(timer);
  };
};

/**
 * Listens on a Postgres notification channel over its own connection (a pooled one cannot
 * listen), reconnecting with growing waits whenever the connection fails or ends. Notifications
 * sent while it was disconnected are lost, so callers re-read state after `onError`.
 */
export function listenPostgres(options: ListenOptions): { close(): Promise<void> } {
  if (!/^[a-z_]{1,63}$/.test(options.channel)) throw new Error("Invalid channel name");
  const newClient =
    options.newClient ??
    ((url: string): PgListenClient => new pg.Client({ connectionString: url }));
  const schedule = options.schedule ?? defaultSchedule;
  let client: PgListenClient | undefined;
  let closed = false;
  let failures = 0;
  let cancelRetry: (() => void) | undefined;

  const retry = (error: Error) => {
    options.onError(error);
    const current = client;
    client = undefined;
    current?.end().catch(() => undefined);
    if (closed || cancelRetry) return;
    const delay = RECONNECT_DELAYS_MS[Math.min(failures, RECONNECT_DELAYS_MS.length - 1)] ?? 30_000;
    failures += 1;
    cancelRetry = schedule(() => {
      cancelRetry = undefined;
      void open();
    }, delay);
  };

  async function open() {
    if (closed) return;
    const next = newClient(options.url);
    client = next;
    next.on("notification", (message) => {
      if (message.channel === options.channel && message.payload !== undefined) {
        options.onNotification(message.payload);
      }
    });
    next.on("error", (error) => {
      if (client === next) retry(error);
    });
    next.on("end", () => {
      if (client === next && !closed) retry(new Error("The listening connection ended"));
    });
    try {
      await next.connect();
      await next.query(`LISTEN ${options.channel}`);
      failures = 0;
      options.onListening?.();
    } catch (error) {
      if (client === next) retry(error instanceof Error ? error : new Error(String(error)));
    }
  }

  void open();
  return {
    async close() {
      closed = true;
      cancelRetry?.();
      const current = client;
      client = undefined;
      await current?.end();
    },
  };
}
