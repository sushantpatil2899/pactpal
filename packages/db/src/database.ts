/** One row of a query result. Callers validate the fields they read (for example with zod). */
export type Row = Record<string, unknown>;

/** Anything that can run a SQL statement. Use `$1`, `$2`, ... for values; never build SQL from input. */
export interface Queryable {
  query(sql: string, params?: readonly unknown[]): Promise<Row[]>;
}

/**
 * The only way the rest of PactPal talks to Postgres. Adapters: `connectPostgres`
 * (production) and `createTestDatabase` from `@pactpal/db/testing` (tests).
 */
export interface Database extends Queryable {
  /** Runs `work` in one transaction: all its statements are saved together or none are. */
  transaction<T>(work: (tx: Queryable) => Promise<T>): Promise<T>;
  /** Releases every connection. Call once, when the server stops. */
  close(): Promise<void>;
}
