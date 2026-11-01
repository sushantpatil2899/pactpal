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
  getUser,
  linkPayPal,
  newUserSchema,
} from "./users.js";
export type { NewUser, User } from "./users.js";
export {
  DEAL_CATEGORIES,
  DEAL_CURRENCIES,
  DEAL_KINDS,
  DEAL_STATUSES,
  BuyerNotAllowedError,
  addBuyer,
  addBuyerSchema,
  createDeal,
  getDeal,
  listDealsForUser,
  newDealSchema,
} from "./deals.js";
export type { AddBuyer, BuyerRefusal, Deal, DealCategory, NewDeal } from "./deals.js";
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
  findSession,
  newSessionToken,
} from "./sessions.js";
export type { SessionAccess } from "./sessions.js";
export { LINK_LIFETIME_MS, LinkNotAllowedError, createDealLink, redeemDealLink } from "./links.js";
export type { RedeemResult } from "./links.js";
export {
  MAX_MILESTONE_MINOR,
  ScopeIntegrityError,
  ScopeNotAllowedError,
  getLatestScope,
  getScopeVersion,
  saveScopeSchema,
  saveScopeVersion,
  scopeContentSchema,
  scopeFingerprint,
  scopeTotalMinor,
} from "./scope.js";
export type {
  SaveScope,
  ScopeContent,
  ScopeContentInput,
  ScopeRefusal,
  ScopeVersion,
} from "./scope.js";
export { signInWithPayPal } from "./sign-in.js";
export type { SignInResult, SignedInPerson } from "./sign-in.js";
export {
  DraftIntegrityError,
  DraftNotAllowedError,
  DraftStateError,
  MAX_DRAFTS_PER_DEAL,
  draftFingerprint,
  failDraft,
  failRunningDrafts,
  finishDraft,
  getDraft,
  listDrafts,
  startDraft,
  startDraftSchema,
} from "./scope-drafts.js";
export type { DraftRecord, DraftRefusal, FinishDraft, StartDraft } from "./scope-drafts.js";
export {
  AcceptanceIntegrityError,
  AcceptanceNotAllowedError,
  acceptTerms,
  acceptTermsSchema,
  declineReasonSchema,
  declineTerms,
  documentFingerprint,
  getLatestAcceptance,
  requestAcceptance,
  typedNameSchema,
  withdrawAcceptance,
} from "./acceptance.js";
export type {
  AcceptTerms,
  Acceptance,
  AcceptanceRefusal,
  DeclineTerms,
  RequestAcceptance,
  WithdrawAcceptance,
} from "./acceptance.js";
