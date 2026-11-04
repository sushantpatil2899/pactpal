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
  checkedScopeContentSchema,
  type DeliverableKind,
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
  receiptSentSchema,
  recordReceiptSent,
  requestAcceptance,
  typedNameSchema,
  withdrawAcceptance,
} from "./acceptance.js";
export type {
  AcceptTerms,
  Acceptance,
  AcceptanceRefusal,
  DeclineTerms,
  ReceiptSent,
  RequestAcceptance,
  WithdrawAcceptance,
} from "./acceptance.js";
export {
  MILESTONE_STATUSES,
  MilestoneNotAllowedError,
  dropFailedInvoice,
  findMilestoneByInvoice,
  invoicePaidSchema,
  invoiceSentSchema,
  listMilestones,
  markInvoicePaid,
  markInvoiceSent,
  recordInvoiceId,
  startInvoice,
  startInvoiceSchema,
} from "./milestones.js";
export type {
  InvoicePaid,
  InvoiceSent,
  Milestone,
  MilestoneRefusal,
  MilestoneStatus,
  StartInvoice,
} from "./milestones.js";
export {
  DeliveryNotAllowedError,
  MAX_DELIVERY_FILES,
  answerDelivery,
  deliveryAnswers,
  VIEW_REPEAT_MS,
  listDeliveries,
  recordDeliveryDownloaded,
  recordDeliveryEmailed,
  recordDeliveryViewed,
  sendDelivery,
  sendDeliverySchema,
} from "./deliveries.js";
export type {
  AnswerInput,
  Delivery,
  DeliveryAnswer,
  DeliveryFile,
  DeliveryRefusal,
  SendDelivery,
} from "./deliveries.js";
export {
  CHANGE_ORDER_STATUSES,
  ChangeOrderNotAllowedError,
  acceptChangeOrder,
  changeOf,
  declineChangeOrder,
  listChangeOrders,
  proposeChangeOrder,
  withdrawChangeOrder,
  type AcceptChange,
  type ChangeOrder,
  type ChangeOrderRefusal,
  type ChangeOrderStatus,
  type DeclineChange,
  type ProposeChange,
  type ScopeChange,
  type WithdrawChange,
} from "./change-orders.js";
export {
  FORWARD_REASONS,
  MAX_QUESTIONS_PER_DEAL,
  QUESTION_STATUSES,
  QuestionNotAllowedError,
  answerQuestion,
  askQuestion,
  forwardInterruptedQuestions,
  forwardQuestion,
  listQuestions,
  recentModelRecords,
  recordAiAnswer,
  type AiAnswer,
  type AnswerQuestion,
  type AskQuestion,
  type BuyerQuestion,
  type ForwardQuestion,
  type ForwardReason,
  type QuestionRefusal,
  type QuestionStatus,
  type RecordAiAnswer,
} from "./questions.js";
export {
  DeliveryCheckNotAllowedError,
  MAX_CHECKS_PER_DEAL,
  listDeliveryChecks,
  recordDeliveryCheck,
  type DeliveryCheck,
  type DeliveryCheckRefusal,
  type NewDeliveryCheck,
} from "./delivery-checks.js";
export {
  MAX_REVIEWS_PER_DEAL,
  ReviewNotAllowedError,
  failMessageReview,
  failRunningMessageReviews,
  finishMessageReview,
  listMessageReviews,
  startMessageReview,
  type MessageReviewRecord,
  type ReviewRefusal,
  type StartMessageReview,
} from "./message-reviews.js";
