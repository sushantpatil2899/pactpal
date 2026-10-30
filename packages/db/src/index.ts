/** Database access for PactPal: the `Database` interface, the Postgres adapter and migrations. */
export type { Database, Queryable, Row } from "./database.js";
export { connectPostgres, databaseFromPool } from "./postgres.js";
export type { PgClient, PgConnection, PgPool, PostgresOptions } from "./postgres.js";
export { MigrationError, migrate, migrationStatus } from "./migrate.js";
export type { Migration, MigrationStatus } from "./migrate.js";
export { MIGRATIONS } from "./migrations.js";
export {
  DealNotFoundError,
  LedgerActorError,
  LedgerConflictError,
  appendLedgerEvent,
  isUniqueViolation,
  readLedger,
  verifyStoredLedger,
} from "./ledger-store.js";
export { UserConflictError, createUser, newUserSchema } from "./users.js";
export type { NewUser, User } from "./users.js";
export { DEAL_KINDS, DEAL_STATUSES, createDeal, newDealSchema } from "./deals.js";
export type { Deal, NewDeal } from "./deals.js";
