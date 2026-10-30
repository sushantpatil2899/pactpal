import { createHash } from "node:crypto";
import type { Database, Queryable } from "./database.js";

/** One forward-only change to the database structure. Never edit a migration once it has been released. */
export interface Migration {
  /** Four digits, then a short name: `0001_append_only_guard`. Ids must be unique and in order. */
  id: string;
  sql: string;
}

export class MigrationError extends Error {
  override readonly name = "MigrationError";
}

export type MigrationStatus =
  { upToDate: true; applied: number } | { upToDate: false; applied: number; pending: string[] };

const ID_FORMAT = /^\d{4}_[a-z0-9_]+$/;
// An arbitrary constant shared by every runner so that only one applies migrations at a time.
const LOCK_KEY = 7_431_926_005;

const checksumOf = (migration: Migration): string =>
  createHash("sha256").update(migration.sql).digest("hex");

function assertWellFormed(migrations: readonly Migration[]): void {
  let previous = "";
  for (const { id } of migrations) {
    if (!ID_FORMAT.test(id)) throw new MigrationError(`Migration id "${id}" is not NNNN_name`);
    if (id <= previous) {
      throw new MigrationError(`Migration "${id}" must come after "${previous}" and appear once`);
    }
    previous = id;
  }
}

const createTable = `CREATE TABLE IF NOT EXISTS schema_migrations (
  id text PRIMARY KEY,
  checksum text NOT NULL,
  applied_at timestamptz NOT NULL DEFAULT now()
)`;

async function readApplied(db: Queryable): Promise<Map<string, string>> {
  const rows = await db.query("SELECT id, checksum FROM schema_migrations");
  return new Map(rows.map((row) => [String(row.id), String(row.checksum)]));
}

/** Refuses a database whose recorded migrations were edited after they were applied. */
function assertUnchanged(migrations: readonly Migration[], applied: Map<string, string>): void {
  for (const migration of migrations) {
    const recorded = applied.get(migration.id);
    if (recorded !== undefined && recorded !== checksumOf(migration)) {
      throw new MigrationError(
        `Migration "${migration.id}" was changed after it was applied; add a new migration instead`,
      );
    }
  }
}

/** Applies the migrations not yet applied, oldest first, and returns the ids it applied. */
export async function migrate(db: Database, migrations: readonly Migration[]): Promise<string[]> {
  assertWellFormed(migrations);
  const done: string[] = [];
  for (;;) {
    // Each step re-reads the state under the lock, so two runners at once never apply the same one.
    const next = await db.transaction(async (tx) => {
      await tx.query("SELECT pg_advisory_xact_lock($1)", [LOCK_KEY]);
      await tx.query(createTable);
      const applied = await readApplied(tx);
      assertUnchanged(migrations, applied);
      const pending = migrations.find(({ id }) => !applied.has(id));
      if (!pending) return undefined;
      await tx.query(pending.sql);
      await tx.query("INSERT INTO schema_migrations (id, checksum) VALUES ($1, $2)", [
        pending.id,
        checksumOf(pending),
      ]);
      return pending.id;
    });
    if (next === undefined) return done;
    done.push(next);
  }
}

/** Reads, without changing anything, whether the database has every migration. */
export async function migrationStatus(
  db: Database,
  migrations: readonly Migration[],
): Promise<MigrationStatus> {
  const tables = await db.query(
    "SELECT 1 FROM information_schema.tables WHERE table_schema = current_schema() AND table_name = 'schema_migrations'",
  );
  const applied = tables.length === 0 ? new Map<string, string>() : await readApplied(db);
  assertUnchanged(migrations, applied);
  const pending = migrations.filter(({ id }) => !applied.has(id)).map(({ id }) => id);
  return pending.length === 0
    ? { upToDate: true, applied: applied.size }
    : { upToDate: false, applied: applied.size, pending };
}
