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
  assertMayAct,
  isUniqueViolation,
  readLedger,
  verifyStoredLedger,
} from "./ledger-store.js";
export {
  UserConflictError,
  createUser,
  findUserByEmail,
  findUserByPayPalId,
  linkPayPal,
  newUserSchema,
} from "./users.js";
export type { NewUser, User } from "./users.js";
export { DEAL_KINDS, DEAL_STATUSES, createDeal, newDealSchema } from "./deals.js";
export type { Deal, NewDeal } from "./deals.js";
export { ContentMismatchError, postgresContentStore } from "./content-store.js";
export type { ContentStore } from "./content-store.js";
export {
  ARTIFACT_KINDS,
  ARTIFACT_LIMITS,
  ArtifactIntegrityError,
  ArtifactNotFoundError,
  ArtifactRejectedError,
  addArtifact,
  getArtifact,
  listArtifacts,
  newArtifactSchema,
} from "./artifacts.js";
export type {
  Artifact,
  ArtifactKind,
  ArtifactLimits,
  ArtifactRejection,
  NewArtifact,
} from "./artifacts.js";
export { newWebhookEventSchema, recordWebhookEvent } from "./webhook-events.js";
export type { NewWebhookEvent, RecordResult } from "./webhook-events.js";
export {
  SESSION_LIFETIME_MS,
  createSession,
  deleteSession,
  findSessionUser,
  newSessionToken,
} from "./sessions.js";
export { signInWithPayPal } from "./sign-in.js";
export type { SignInResult, SignedInPerson } from "./sign-in.js";
