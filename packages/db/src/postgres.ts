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
