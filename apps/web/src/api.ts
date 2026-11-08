import type { MessageReview } from "@pactpal/watcher";
import type { ImageFacts, LineCodeResult, Look } from "@pactpal/delivery-check";
import type { LineMark } from "@pactpal/words";
/** The one place the web app talks to the server. Answers are checked before use. */

export interface Me {
  id: string;
  email: string;
  displayName: string | null;
  paypalLinked: boolean;
  /** Everything (signed in with PayPal), or one deal (opened with a buyer link). */
  access: "full" | { dealId: string };
}

export const SIGN_IN_PATH = "/auth/paypal/start";

function isDealAccess(value: unknown): value is { dealId: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).dealId === "string"
  );
}

function isMe(value: unknown): value is Me {
  if (typeof value !== "object" || value === null) return false;
  const me = value as Record<string, unknown>;
  return (
    typeof me.id === "string" &&
    typeof me.email === "string" &&
    (typeof me.displayName === "string" || me.displayName === null) &&
    typeof me.paypalLinked === "boolean" &&
    (me.access === "full" || isDealAccess(me.access))
  );
}

/** The signed-in person, or null when nobody is signed in. */
export async function getMe(): Promise<Me | null> {
  const response = await fetch("/api/me", { headers: { Accept: "application/json" } });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error(`Could not check who is signed in (${response.status})`);
  const body: unknown = await response.json();
  if (!isMe(body)) throw new Error("The server's answer about who is signed in was not readable");
  return body;
}

export async function signOut(): Promise<void> {
  const response = await fetch("/auth/logout", { method: "POST" });
  if (!response.ok) throw new Error(`Could not sign out (${response.status})`);
}

/** Why a buyer link did not let the person in. */
export type LinkProblem = "unknown" | "expired" | "replaced" | "unavailable";

/** Uses a buyer link's secret; resolves with the deal it opens, or the reason it was refused. */
export async function redeemLink(
  token: string,
): Promise<{ ok: true; dealId: string } | { ok: false; problem: LinkProblem }> {
  const response = await fetch("/api/links/redeem", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ token }),
  });
  const body: unknown = await response.json().catch(() => null);
  const field = (name: string): unknown =>
    typeof body === "object" && body !== null ? (body as Record<string, unknown>)[name] : undefined;
  const dealId = field("dealId");
  if (response.ok && typeof dealId === "string") return { ok: true, dealId };
  const error = field("error");
  const known: LinkProblem[] = ["unknown", "expired", "replaced", "unavailable"];
  return {
    ok: false,
    problem: known.find((problem) => problem === error) ?? "unknown",
  };
}

// --- Deals ---------------------------------------------------------------------------------
// Answers come from our own server; each is checked for the fields the pages use.

export interface DealOptions {
  categories: { id: string; label: string }[];
  currencies: string[];
}

export interface DealSummary {
  id: string;
  title: string;
  kind: string;
  category: string;
  categoryLabel: string;
  currency: string;
  status: string;
  createdAt: string;
  hasBuyer: boolean;
  role: "seller" | "buyer";
  /** For the seller: who the buyer is, once added. */
  buyer?: { name: string | null; email: string } | null;
  /** For the buyer: the seller's name. */
  seller?: { name: string };
}

export interface LedgerEntryView {
  seq: number;
  type: string;
  actor: "seller" | "buyer" | "system";
  actorName: string | null;
  serverTime: string;
  entryHash: string;
  /** What the entry records; its shape depends on the type. */
  payload: unknown;
}

export type LedgerCheck =
  | { status: "unchanged"; entries: number; latestFingerprint: string }
  | { status: "changed"; atEntry: number; reason: string };

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isDeal = (value: unknown): value is DealSummary =>
  isObject(value) &&
  typeof value.id === "string" &&
  typeof value.title === "string" &&
  typeof value.categoryLabel === "string" &&
  typeof value.currency === "string" &&
  typeof value.status === "string" &&
  typeof value.createdAt === "string" &&
  (value.role === "seller" || value.role === "buyer");

const isEntry = (value: unknown): value is LedgerEntryView =>
  isObject(value) &&
  typeof value.seq === "number" &&
  typeof value.type === "string" &&
  typeof value.serverTime === "string" &&
  typeof value.entryHash === "string" &&
  (value.actorName === null || typeof value.actorName === "string");

/** Reads a JSON answer and checks it; any other answer becomes an error with a plain message. */
async function readChecked<T>(
  response: Response,
  check: (body: unknown) => body is T,
  what: string,
): Promise<T> {
  if (!response.ok) throw new Error(`Could not ${what} (${String(response.status)})`);
  const body: unknown = await response.json();
  if (!check(body)) throw new Error(`The server's answer when trying to ${what} was not readable`);
  return body;
}

export async function getDealOptions(): Promise<DealOptions> {
  return readChecked(
    await fetch("/api/deal-options"),
    (body): body is DealOptions =>
      isObject(body) && Array.isArray(body.categories) && Array.isArray(body.currencies),
    "load the deal choices",
  );
}

export async function listDeals(): Promise<DealSummary[]> {
  const body = await readChecked(
    await fetch("/api/deals"),
    (b): b is { deals: unknown[] } => isObject(b) && Array.isArray(b.deals),
    "load your deals",
  );
  return body.deals.filter(isDeal);
}

export async function createDeal(input: {
  title: string;
  category: string;
  currency: string;
}): Promise<DealSummary> {
  return readChecked(
    await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(input),
    }),
    isDeal,
    "create the deal",
  );
}

export async function getDeal(id: string): Promise<DealSummary> {
  return readChecked(await fetch(`/api/deals/${encodeURIComponent(id)}`), isDeal, "open the deal");
}

export async function getLedger(id: string): Promise<LedgerEntryView[]> {
  const body = await readChecked(
    await fetch(`/api/deals/${encodeURIComponent(id)}/ledger`),
    (b): b is { entries: unknown[] } => isObject(b) && Array.isArray(b.entries),
    "load the evidence log",
  );
  return body.entries.filter(isEntry);
}

export async function checkLedger(id: string): Promise<LedgerCheck> {
  return readChecked(
    await fetch(`/api/deals/${encodeURIComponent(id)}/ledger/check`),
    (b): b is LedgerCheck =>
      isObject(b) &&
      ((b.status === "unchanged" && typeof b.entries === "number") ||
        (b.status === "changed" && typeof b.atEntry === "number")),
    "check the evidence log",
  );
}

/** A refused action's message from the server, or a plain fallback. */
async function errorMessage(response: Response, fallback: string): Promise<string> {
  const body: unknown = await response.json().catch(() => null);
  return isObject(body) && typeof body.error === "string" ? body.error : fallback;
}

export async function addBuyer(
  dealId: string,
  input: { email: string; name?: string },
): Promise<DealSummary> {
  const response = await fetch(`/api/deals/${encodeURIComponent(dealId)}/buyer`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error(await errorMessage(response, "Could not add the buyer"));
  return readChecked(response, isDeal, "add the buyer");
}

// --- Agreed work -------------------------------------------------------------------------------

/** An amount in minor units (cents), with the same amount as text ("250.50"). */
export interface Money {
  minor: number;
  text: string;
}

/** The terms of one version of a deal's agreed work. */
/** How a delivered line can be judged; `null` when the seller did not mark it. */
export type DeliverableKind = LineMark;

export interface ScopeTerms {
  version: number;
  contentSha256: string;
  currency: string;
  summary: string;
  deliverables: string[];
  exclusions: string[];
  revisionsIncluded: number | null;
  dueDate: string | null;
  milestones: { title: string; amount: Money; dueDate: string | null }[];
  total: Money;
  /** One mark per delivered line; absent when no line is marked. */
  deliverableKinds?: DeliverableKind[];
  /** What the buyer provides; absent when the version lists nothing. */
  buyerProvides?: { text: string; dueDate: string | null }[];
}

/** One saved version of a deal's agreed work: its terms and when it was saved. */
export interface ScopeView extends ScopeTerms {
  savedAt: string;
}

/** What the seller saves; each stage's amount as typed ("250.50"). */
export interface ScopeInput {
  /** The AI draft this was made from, so the evidence log can link them. */
  draftId?: string;
  /** The letter of the draft chosen when the council could not rank its drafts. */
  draftLabel?: string;
  summary: string;
  deliverables: string[];
  exclusions: string[];
  revisionsIncluded?: number;
  dueDate?: string;
  milestones: { title: string; amount: string; dueDate?: string }[];
  buyerProvides?: { text: string; dueDate?: string }[];
  deliverableKinds?: DeliverableKind[];
}

/** The server refused some fields; `fields` names them, e.g. "milestones.0.amount". */
export class InvalidFieldsError extends Error {
  override readonly name = "InvalidFieldsError";
  constructor(readonly fields: string[]) {
    super("Some fields need fixing");
  }
}

const isMoney = (value: unknown): value is Money =>
  isObject(value) && typeof value.minor === "number" && typeof value.text === "string";

const isTerms = (value: unknown): value is ScopeTerms =>
  isObject(value) &&
  typeof value.version === "number" &&
  typeof value.contentSha256 === "string" &&
  typeof value.currency === "string" &&
  typeof value.summary === "string" &&
  Array.isArray(value.deliverables) &&
  Array.isArray(value.exclusions) &&
  Array.isArray(value.milestones) &&
  value.milestones.every((stage) => isObject(stage) && isMoney(stage.amount)) &&
  isMoney(value.total) &&
  (value.buyerProvides === undefined ||
    (Array.isArray(value.buyerProvides) &&
      value.buyerProvides.every((item) => isObject(item) && typeof item.text === "string")));

const isScope = (value: unknown): value is ScopeView =>
  isTerms(value) && isObject(value) && typeof value.savedAt === "string";

const hasScope = (body: unknown): body is { scope: ScopeView | null } =>
  isObject(body) && (body.scope === null || isScope(body.scope));

/** The deal's newest agreed work, or null before the seller saves any. */
export async function getScope(dealId: string): Promise<ScopeView | null> {
  const body = await readChecked(
    await fetch(`/api/deals/${encodeURIComponent(dealId)}/scope`),
    hasScope,
    "load the agreed work",
  );
  return body.scope;
}

/** Saves the agreed work as a new version; throws `InvalidFieldsError` naming bad fields. */
export async function saveScope(dealId: string, input: ScopeInput): Promise<ScopeView> {
  const response = await fetch(`/api/deals/${encodeURIComponent(dealId)}/scope`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(input),
  });
  if (response.status === 400) {
    const body: unknown = await response.json().catch(() => null);
    const fields = isObject(body) && Array.isArray(body.fields) ? body.fields : [];
    throw new InvalidFieldsError(fields.filter((f): f is string => typeof f === "string"));
  }
  if (!response.ok) throw new Error(await errorMessage(response, "Could not save the agreed work"));
  const body = await readChecked(response, hasScope, "save the agreed work");
  if (body.scope === null) throw new Error("The server did not return the saved version");
  return body.scope;
}

// --- Acceptance --------------------------------------------------------------------------------

/** Exactly what the buyer is asked to agree to; its fingerprint is checked on every step. */
export interface AcceptanceDocument {
  format: number;
  dealId: string;
  title: string;
  category: string;
  sellerName: string;
  terms: ScopeTerms;
  notice: { version: number; title: string; lines: string[] };
}

/** Where the deal's acceptance stands, as the asking person may see it. */
export interface AcceptanceView {
  status: string;
  /** While waiting, for both sides; in a draft, the seller's preview; once signed, the signed copy. */
  document: AcceptanceDocument | null;
  documentSha256: string | null;
  accepted: { version: number; typedName: string; at: string } | null;
  /** Seller only, in a draft: the buyer's last answer was a decline. */
  lastDecline: { at: string; reason: string | null } | null;
  /** Whether email is set up on the server at all. */
  emailOn: boolean;
  /** Once signed: when the receipt was last emailed to each side, or null if not yet. */
  receiptEmails: { buyer: string | null; seller: string | null } | null;
}

const isDocument = (value: unknown): value is AcceptanceDocument =>
  isObject(value) &&
  typeof value.title === "string" &&
  typeof value.sellerName === "string" &&
  typeof value.category === "string" &&
  isTerms(value.terms) &&
  isObject(value.notice) &&
  typeof value.notice.title === "string" &&
  Array.isArray(value.notice.lines) &&
  value.notice.lines.every((line) => typeof line === "string");

const isAcceptance = (value: unknown): value is AcceptanceView =>
  isObject(value) &&
  typeof value.status === "string" &&
  (value.document === null || isDocument(value.document)) &&
  (value.documentSha256 === null || typeof value.documentSha256 === "string") &&
  (value.accepted === null ||
    (isObject(value.accepted) && typeof value.accepted.typedName === "string")) &&
  (value.lastDecline === null || isObject(value.lastDecline)) &&
  typeof value.emailOn === "boolean" &&
  (value.receiptEmails === null || isObject(value.receiptEmails));

const acceptanceUrl = (dealId: string, step = "") =>
  `/api/deals/${encodeURIComponent(dealId)}/acceptance${step === "" ? "" : `/${step}`}`;

/** The receipt PDF of a signed deal, for both sides; the browser saves it as a file. */
export const receiptUrl = (dealId: string) => acceptanceUrl(dealId, "receipt");

export async function getAcceptance(dealId: string): Promise<AcceptanceView> {
  return readChecked(await fetch(acceptanceUrl(dealId)), isAcceptance, "load the acceptance");
}

/** One acceptance step; a refusal becomes an error with the server's plain message. */
async function acceptanceStep(
  dealId: string,
  step: "request" | "withdraw" | "accept" | "decline" | "receipt-email",
  body: object,
  what: string,
): Promise<AcceptanceView> {
  const response = await fetch(acceptanceUrl(dealId, step), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(await errorMessage(response, `Could not ${what}`));
  return readChecked(response, isAcceptance, what);
}

/** The seller sends the version they previewed (named by number and document fingerprint). */
export const requestAcceptance = (
  dealId: string,
  seen: { version: number; documentSha256: string },
) => acceptanceStep(dealId, "request", seen, "send for acceptance");

export const withdrawAcceptance = (dealId: string) =>
  acceptanceStep(dealId, "withdraw", {}, "withdraw the request");

/** The buyer signs the document they saw, with the name they typed. */
export const acceptTerms = (dealId: string, input: { documentSha256: string; typedName: string }) =>
  acceptanceStep(dealId, "accept", input, "sign");

export const declineTerms = (dealId: string, input: { documentSha256: string; reason?: string }) =>
  acceptanceStep(dealId, "decline", input, "decline");

/** The seller emails the signed receipt to both sides again. */
export const emailReceiptAgain = (dealId: string) =>
  acceptanceStep(dealId, "receipt-email", {}, "email the receipt");

// --- Payment stages and invoices ----------------------------------------------------------------

/** One payment stage of the signed agreement and its PayPal invoice. */
export interface StageView {
  stage: number;
  title: string;
  amount: Money & { currency: string };
  dueDate: string | null;
  status: "not_invoiced" | "sending" | "sent" | "paid";
  sentAt: string | null;
  /** Where the buyer views and pays the invoice on PayPal. */
  payUrl: string | null;
  /** When PayPal confirmed it paid, and PayPal's transaction id. */
  paidAt: string | null;
  transactionId: string | null;
  /** Seller only, before sending: exactly what PayPal will show the buyer. */
  invoice?: {
    to: string;
    /** The seller's own PayPal account it will be sent from (6h-3), or null for PactPal's. */
    fromAccount: string | null;
    itemName: string;
    description: string;
    note: string;
    invoiceSha256: string;
  };
}

export interface MilestonesView {
  signed: boolean;
  /** Whether PayPal invoicing is set up on the server. */
  invoicing: boolean;
  stages: StageView[];
}

const isMilestones = (value: unknown): value is MilestonesView =>
  isObject(value) &&
  typeof value.signed === "boolean" &&
  typeof value.invoicing === "boolean" &&
  Array.isArray(value.stages) &&
  value.stages.every(
    (stage) =>
      isObject(stage) &&
      typeof stage.stage === "number" &&
      typeof stage.title === "string" &&
      isMoney(stage.amount) &&
      typeof stage.status === "string",
  );

const milestonesUrl = (dealId: string) => `/api/deals/${encodeURIComponent(dealId)}/milestones`;

/** Asks PayPal whether the sent invoices were paid (a backup for PayPal's notifications). */
export async function checkPayments(dealId: string): Promise<MilestonesView> {
  const response = await fetch(`${milestonesUrl(dealId)}/check`, {
    method: "POST",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(await errorMessage(response, "Could not check the payments"));
  return readChecked(response, isMilestones, "check the payments");
}

export async function getMilestones(dealId: string): Promise<MilestonesView> {
  return readChecked(await fetch(milestonesUrl(dealId)), isMilestones, "load the payment stages");
}

/** One PayPal dispute on the deal, in PayPal's own words, as the seller's page shows it. */
export interface DisputeView {
  disputeId: string;
  /** The payment stage it is about. */
  stage: number | null;
  reason: string | null;
  status: string;
  /** PayPal's stage, e.g. "INQUIRY" or "CHARGEBACK". */
  paypalStage: string | null;
  amount: (Money & { currency: string }) | null;
  sellerDueAt: string | null;
  outcome: string | null;
  firstSeenAt: string;
}

export interface DisputesView {
  disputes: DisputeView[];
  /** The newest check of the seller's PayPal disputes; `ok` is null while it runs. */
  lastCheck: {
    source: string;
    startedAt: string;
    finishedAt: string | null;
    ok: boolean | null;
  } | null;
  /** Whether "Check now" is available on this server. */
  canCheck: boolean;
}

const isDisputes = (value: unknown): value is DisputesView =>
  isObject(value) &&
  Array.isArray(value.disputes) &&
  value.disputes.every(
    (d) => isObject(d) && typeof d.disputeId === "string" && typeof d.status === "string",
  ) &&
  (value.lastCheck === null || isObject(value.lastCheck)) &&
  typeof value.canCheck === "boolean";

const disputesUrl = (dealId: string) => `/api/deals/${encodeURIComponent(dealId)}/disputes`;

export async function getDisputes(dealId: string): Promise<DisputesView> {
  return readChecked(await fetch(disputesUrl(dealId)), isDisputes, "load the disputes");
}

/** One dispute in full, for its page (5c). */
export interface DisputePageView extends DisputeView {
  invoiceId: string | null;
  buyerDueAt: string | null;
  /** When the buyer opened it at PayPal (else when PactPal first saw it). */
  openedAt: string;
  /** When PactPal last read it from PayPal. */
  checkedAt: string;
  allowedActions: string[];
  offerTypes: string[];
  /** The messages as PayPal shows them; `from` is "BUYER" or "SELLER". */
  messages: { from: string; postedAt: string | null; text: string }[];
  messagesReadable: boolean;
  /** This dispute's evidence-log entries. */
  events: { seq: number; type: string; at: string; payload: unknown }[];
  /** The deal's files added since the buyer opened it. */
  filesSince: { id: string; filename: string; addedBy: DealFile["addedBy"]; addedAt: string }[];
  lastCheck: DisputesView["lastCheck"];
  canCheck: boolean;
  /** The emails PactPal sent the seller about this dispute (5j). */
  notices: { kind: "opened" | "changed" | "decided" | "reminder"; sentAt: string; sent: boolean }[];
}

const isDisputePage = (value: unknown): value is DisputePageView =>
  isObject(value) &&
  typeof value.disputeId === "string" &&
  typeof value.openedAt === "string" &&
  typeof value.checkedAt === "string" &&
  Array.isArray(value.allowedActions) &&
  Array.isArray(value.messages) &&
  Array.isArray(value.events) &&
  Array.isArray(value.filesSince) &&
  typeof value.canCheck === "boolean";

export async function getDisputePage(dealId: string, disputeId: string): Promise<DisputePageView> {
  return readChecked(
    await fetch(`${disputesUrl(dealId)}/${encodeURIComponent(disputeId)}`),
    isDisputePage,
    "load the dispute",
  );
}

/** One statement of the buyer's claim and what the record shows about it (an AI draft, 5d). */
export interface ClaimStatement {
  quote: string;
  line: number;
  finding: "covered" | "not-covered";
  agreement: { line: number; quote: string }[];
  record: { n: number; text: string }[];
  relation: string;
}

/** One council comparison of the claim with the record. */
export interface ClaimAnalysisView {
  id: string;
  status: "running" | "ready" | "failed";
  createdAt: string;
  finishedAt: string | null;
  failureReason: string | null;
  analysis: {
    statements: ClaimStatement[];
    suggestion: { action: string | null; evidenceType: string | null; why: string };
  } | null;
  council: CouncilView | null;
}

export interface ClaimAnalysesView {
  /** Whether comparisons can run on this server (AI models or Render set up). */
  canCompare: boolean;
  /** Whether the seller may paste the claim: only when PayPal shows no buyer message. */
  canPaste: boolean;
  analyses: ClaimAnalysisView[];
}

/** A dispute council job as the server shows it: id, status and council record. */
const isCouncilJob = (job: unknown) =>
  isObject(job) &&
  typeof job.id === "string" &&
  typeof job.status === "string" &&
  (job.council === null || isCouncil(job.council));

const isClaimAnalyses = (value: unknown): value is ClaimAnalysesView =>
  isObject(value) &&
  typeof value.canCompare === "boolean" &&
  typeof value.canPaste === "boolean" &&
  Array.isArray(value.analyses) &&
  value.analyses.every(isCouncilJob);

const analysesUrl = (dealId: string, disputeId: string) =>
  `${disputesUrl(dealId)}/${encodeURIComponent(disputeId)}/analyses`;

export async function getClaimAnalyses(
  dealId: string,
  disputeId: string,
): Promise<ClaimAnalysesView> {
  return readChecked(
    await fetch(analysesUrl(dealId, disputeId)),
    isClaimAnalyses,
    "load the comparisons",
  );
}

/** Starts a council comparison; `pasted` is the buyer's claim when PayPal shows none. */
export async function compareClaim(
  dealId: string,
  disputeId: string,
  pasted: string | undefined,
): Promise<ClaimAnalysesView> {
  const response = await fetch(analysesUrl(dealId, disputeId), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(pasted === undefined ? {} : { pasted }),
  });
  if (!response.ok) throw new Error(await errorMessage(response, "Could not start the comparison"));
  return readChecked(response, isClaimAnalyses, "start the comparison");
}

/** One document that can go into the evidence packet (5e). */
export interface PacketChoice {
  id: string;
  filename: string;
  kind: "receipt" | "deliverable" | "source";
  /** The payment stage a delivered file was sent for. */
  stage: number | null;
  addedBy: "seller" | "buyer" | "system";
  mediaType: string;
  send: "as-is" | "text-as-pdf" | "left-out";
  reason: "unticked" | "type" | "too-large" | null;
  /** The size PayPal would get (a text file's PDF); null when it cannot go. */
  sentBytes: number | null;
  /** A buyer claim the seller pasted: the page starts with it unticked (5k-fix-3). */
  pastedClaim?: boolean;
}

/** A built packet: its fingerprints and what went in. */
export interface BuiltPacket {
  id: string;
  createdAt: string;
  packetSha256: string;
  packetBytes: number;
  totalBytes: number;
  chainHead: string;
  exhibits: { id: string; filename: string; send: string; number?: number; sentSha256?: string }[];
  /** The AI comparison and summary it carries, if the seller included them. */
  analysisId: string | null;
  summaryId: string | null;
}

export interface PacketView {
  exhibits: PacketChoice[];
  meter: { totalBytes: number; largestBytes: number; maxFileBytes: number; maxTotalBytes: number };
  packets: BuiltPacket[];
}

const isPacketView = (value: unknown): value is PacketView =>
  isObject(value) &&
  Array.isArray(value.exhibits) &&
  value.exhibits.every(
    (e) => isObject(e) && typeof e.id === "string" && typeof e.send === "string",
  ) &&
  isObject(value.meter) &&
  typeof value.meter.totalBytes === "number" &&
  Array.isArray(value.packets);

const isBuiltPacket = (value: unknown): value is BuiltPacket =>
  isObject(value) && typeof value.id === "string" && typeof value.packetSha256 === "string";

const packetUrl = (dealId: string, disputeId: string) =>
  `${disputesUrl(dealId)}/${encodeURIComponent(disputeId)}/packet`;

export async function getPacketView(dealId: string, disputeId: string): Promise<PacketView> {
  return readChecked(await fetch(packetUrl(dealId, disputeId)), isPacketView, "load the packet");
}

/**
 * Builds a packet without the documents in `leaveOut`, with the checked AI comparison and summary
 * when `includeAi` names them; nothing is sent to PayPal.
 */
export async function buildPacket(
  dealId: string,
  disputeId: string,
  leaveOut: string[],
  includeAi?: { analysisId: string; summaryId: string },
): Promise<BuiltPacket> {
  const response = await fetch(packetUrl(dealId, disputeId), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ leaveOut, ...(includeAi === undefined ? {} : { includeAi }) }),
  });
  if (!response.ok) throw new Error(await errorMessage(response, "Could not build the packet"));
  return readChecked(response, isBuiltPacket, "build the packet");
}

/** Where a built packet's PDF, or one of its exhibits as PayPal would get it, downloads from. */
export const packetFileUrl = (
  dealId: string,
  disputeId: string,
  packetId: string,
  exhibit?: number,
) =>
  `${packetUrl(dealId, disputeId)}/${encodeURIComponent(packetId)}/${exhibit === undefined ? "file" : `exhibits/${String(exhibit)}`}`;

/** One council packet summary (5f): sentences citing log entries, document picks and a note. */
export interface PacketSummaryView {
  id: string;
  status: "running" | "ready" | "failed";
  createdAt: string;
  failureReason: string | null;
  /** The comparison it was drafted from. */
  basedOn: string | null;
  summary: {
    summary: { text: string; record: { n: number; text: string }[] }[];
    exhibits: { id: string; use: boolean; why: string }[];
    note: string;
  } | null;
  council: CouncilView | null;
}

export interface PacketSummariesView {
  /** Whether a summary can be drafted: models set up and a ready comparison. */
  canDraft: boolean;
  summaries: PacketSummaryView[];
}

const isSummaries = (value: unknown): value is PacketSummariesView =>
  isObject(value) &&
  typeof value.canDraft === "boolean" &&
  Array.isArray(value.summaries) &&
  value.summaries.every(isCouncilJob);

const summariesUrl = (dealId: string, disputeId: string) =>
  `${disputesUrl(dealId)}/${encodeURIComponent(disputeId)}/summaries`;

export async function getSummaries(
  dealId: string,
  disputeId: string,
): Promise<PacketSummariesView> {
  return readChecked(
    await fetch(summariesUrl(dealId, disputeId)),
    isSummaries,
    "load the summaries",
  );
}

/** Starts a council summary from the newest ready comparison. */
export const draftSummary = (dealId: string, disputeId: string) =>
  postStep(summariesUrl(dealId, disputeId), {}, "start the summary", isSummaries);

/** One file of an evidence upload: the packet PDF (exhibit null) or a numbered exhibit (5g). */
export interface UploadFileView {
  exhibit: number | null;
  name: string;
  bytes: number;
  sha256?: string;
}

/** An escalation or evidence upload the seller confirmed, and how it ended. */
export interface DisputeActionView {
  id: string;
  kind: "escalate" | "evidence" | "message" | "offer" | "accept" | "appeal";
  status: "sending" | "sent" | "unknown" | "refused";
  evidenceType: string | null;
  offerType: string | null;
  amount: { minor: number; currency: string } | null;
  note: string;
  files: UploadFileView[];
  totalBytes: number;
  failure: string | null;
  createdAt: string;
  finishedAt: string | null;
}

/** What the seller can send PayPal now, for the review screens (5g). */
export interface DisputeActionsView {
  /** Whether this server can send to PayPal (the seller app's keys are set). */
  canSend: boolean;
  allowed: {
    escalate: boolean;
    evidence: boolean;
    message: boolean;
    offer: boolean;
    accept: boolean;
    appeal: boolean;
  };
  /** The appeal statement's note (5i-2), a starting point for the appeal note. */
  draftAppealNote: string | null;
  /** What the newest packet leaves out of what the appeal relies on (null: nothing to check). */
  appealMissing: string[] | null;
  /** The disputed amount: an offer's limit and what accepting refunds. */
  disputed: { minor: number; currency: string; words: string } | null;
  /** Answer help's drafts (5h), starting points for a message and an offer note. */
  draftMessage: string | null;
  draftOfferNote: string | null;
  /** The evidence types PayPal asks for (or only OTHER), with the comparison's suggestion. */
  evidenceTypes: string[];
  suggestedType: string | null;
  /** The packet summary's draft note for PayPal (5f), if one is ready. */
  draftNote: string | null;
  packet: {
    id: string;
    packetSha256: string;
    createdAt: string;
    newerEntries: number;
    files: UploadFileView[];
    totalBytes: number;
    overLimit: boolean;
  } | null;
  limits: { maxFileBytes: number; maxTotalBytes: number };
  actions: DisputeActionView[];
}

const isDisputeActions = (value: unknown): value is DisputeActionsView =>
  isObject(value) &&
  typeof value.canSend === "boolean" &&
  isObject(value.allowed) &&
  Array.isArray(value.evidenceTypes) &&
  isObject(value.limits) &&
  Array.isArray(value.actions);

const isActionAnswer = (value: unknown): value is { action: DisputeActionView } =>
  isObject(value) && isObject(value.action) && typeof value.action.id === "string";

const disputeStepUrl = (dealId: string, disputeId: string, step: string) =>
  `${disputesUrl(dealId)}/${encodeURIComponent(disputeId)}/${step}`;

export async function getDisputeActions(
  dealId: string,
  disputeId: string,
): Promise<DisputeActionsView> {
  return readChecked(
    await fetch(disputeStepUrl(dealId, disputeId, "actions")),
    isDisputeActions,
    "load what can be sent",
  );
}

/** The note the seller confirmed, with the fingerprint the server checks it against. */
export interface ConfirmedNote {
  note: string;
  noteSha256: string;
}

/** Escalates the dispute to PayPal with the confirmed note. */
export const escalateDispute = (dealId: string, disputeId: string, note: ConfirmedNote) =>
  postStep(
    disputeStepUrl(dealId, disputeId, "escalate"),
    { ...note, confirmed: true },
    "escalate the dispute",
    isActionAnswer,
  );

/** Sends the confirmed packet, evidence type and note to PayPal. */
export const sendEvidence = (
  dealId: string,
  disputeId: string,
  input: ConfirmedNote & { packetId: string; packetSha256: string; evidenceType: string },
) =>
  postStep(
    disputeStepUrl(dealId, disputeId, "evidence"),
    { ...input, confirmed: true },
    "send the evidence",
    isActionAnswer,
  );

/** Sends the buyer a message through PayPal (5h). */
export const sendDisputeMessage = (dealId: string, disputeId: string, note: ConfirmedNote) =>
  postStep(
    disputeStepUrl(dealId, disputeId, "message"),
    { ...note, confirmed: true },
    "send the message",
    isActionAnswer,
  );

/** Offers the buyer a refund of the amount the seller typed (5h). */
export const makeRefundOffer = (
  dealId: string,
  disputeId: string,
  input: ConfirmedNote & { amount: { minor: number; currency: string } },
) =>
  postStep(
    disputeStepUrl(dealId, disputeId, "offer"),
    { ...input, confirmed: true },
    "make the offer",
    isActionAnswer,
  );

/** Accepts the claim: PayPal refunds the disputed amount and closes the case (5h). */
export const acceptDisputeClaim = (dealId: string, disputeId: string, note: ConfirmedNote) =>
  postStep(
    disputeStepUrl(dealId, disputeId, "accept"),
    { ...note, confirmed: true, understandsRefund: true },
    "accept the claim",
    isActionAnswer,
  );

/** One option PayPal allows, with its fixed facts (by code) and the AI's note on this case. */
export interface AnswerOptionView {
  code: string;
  facts: string;
  fits: string;
  record: { n: number; text: string }[];
}

/** One answer help draft (5h): a message, notes on each option and an offer note. */
export interface ResponseView {
  id: string;
  status: "running" | "ready" | "failed";
  createdAt: string;
  failureReason: string | null;
  draft: { message: string; offerNote: string; options: AnswerOptionView[] } | null;
  council: CouncilView | null;
}

export interface ResponsesView {
  canDraft: boolean;
  responses: ResponseView[];
}

const isResponses = (value: unknown): value is ResponsesView =>
  isObject(value) &&
  typeof value.canDraft === "boolean" &&
  Array.isArray(value.responses) &&
  value.responses.every(isCouncilJob);

export async function getResponses(dealId: string, disputeId: string): Promise<ResponsesView> {
  return readChecked(
    await fetch(disputeStepUrl(dealId, disputeId, "responses")),
    isResponses,
    "load the answer help",
  );
}

/** Starts a council draft of answer help. */
export const draftResponse = (dealId: string, disputeId: string) =>
  postStep(
    disputeStepUrl(dealId, disputeId, "responses"),
    {},
    "start the answer help",
    isResponses,
  );

/** One judgement of a new item by the appeal check (5i). */
export interface AppealCheckView {
  id: string;
  status: "running" | "ready" | "failed";
  createdAt: string;
  failureReason: string | null;
  check: {
    summary: string;
    items: { id: string; answers: boolean; why: string; record: { n: number; text: string }[] }[];
  } | null;
  council: CouncilView | null;
}

export interface AppealView {
  /** Whether PayPal decided for the buyer, or allows an appeal now. */
  applies: boolean;
  canCheck: boolean;
  /** What PactPal holds that was not sent to PayPal before (found by code). */
  items: { id: string; words: string }[];
  cut: boolean;
  checks: AppealCheckView[];
}

const isAppeal = (value: unknown): value is AppealView =>
  isObject(value) &&
  typeof value.applies === "boolean" &&
  typeof value.canCheck === "boolean" &&
  Array.isArray(value.items) &&
  Array.isArray(value.checks) &&
  value.checks.every(isCouncilJob);

export async function getAppeal(dealId: string, disputeId: string): Promise<AppealView> {
  return readChecked(
    await fetch(disputeStepUrl(dealId, disputeId, "appeal")),
    isAppeal,
    "load the appeal check",
  );
}

/** Starts the council's appeal check of the new items. */
export const checkAppeal = (dealId: string, disputeId: string) =>
  postStep(disputeStepUrl(dealId, disputeId, "appeal"), {}, "start the appeal check", isAppeal);

/** Sends the appeal with the confirmed packet, type and note (5i-2). */
export const sendAppeal = (
  dealId: string,
  disputeId: string,
  input: ConfirmedNote & { packetId: string; packetSha256: string; evidenceType: string },
) =>
  postStep(
    disputeStepUrl(dealId, disputeId, "appeal/send"),
    { ...input, confirmed: true },
    "send the appeal",
    isActionAnswer,
  );

/** One appeal statement draft (5i-2): sentences citing log entries, and the note for PayPal. */
export interface StatementView {
  id: string;
  status: "running" | "ready" | "failed";
  createdAt: string;
  failureReason: string | null;
  statement: {
    note: string;
    sentences: { text: string; record: { n: number; text: string }[] }[];
  } | null;
  council: CouncilView | null;
}

export interface StatementsView {
  canDraft: boolean;
  statements: StatementView[];
}

const isStatements = (value: unknown): value is StatementsView =>
  isObject(value) &&
  typeof value.canDraft === "boolean" &&
  Array.isArray(value.statements) &&
  value.statements.every(isCouncilJob);

export async function getStatements(dealId: string, disputeId: string): Promise<StatementsView> {
  return readChecked(
    await fetch(disputeStepUrl(dealId, disputeId, "appeal/statements")),
    isStatements,
    "load the appeal statement",
  );
}

/** Starts a council draft of the appeal statement from the newest appeal check. */
export const draftStatement = (dealId: string, disputeId: string) =>
  postStep(
    disputeStepUrl(dealId, disputeId, "appeal/statements"),
    {},
    "start the appeal statement",
    isStatements,
  );

/** Sends an action whose outcome was unknown again, with the same content and request id. */
export const resendAction = (dealId: string, disputeId: string, actionId: string) =>
  postStep(
    disputeStepUrl(dealId, disputeId, `actions/${encodeURIComponent(actionId)}/resend`),
    { confirmed: true },
    "send it again",
    isActionAnswer,
  );

/** The SHA-256 fingerprint of a text as UTF-8, in hex, as the server takes it. */
export async function textFingerprint(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Starts a check of the seller's PayPal disputes; the result shows up in `getDisputes`. */
export async function checkDisputes(dealId: string): Promise<void> {
  const response = await fetch(`${disputesUrl(dealId)}/check`, {
    method: "POST",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(await errorMessage(response, "Could not start the check"));
}

/** The seller sends one stage's invoice, naming the invoice text they confirmed. */
export async function sendInvoice(
  dealId: string,
  stage: number,
  invoiceSha256: string,
): Promise<MilestonesView> {
  const response = await fetch(`${milestonesUrl(dealId)}/${String(stage)}/invoice`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ invoiceSha256 }),
  });
  if (!response.ok) throw new Error(await errorMessage(response, "Could not send the invoice"));
  return readChecked(response, isMilestones, "send the invoice");
}

// --- Deliveries ------------------------------------------------------------------------------

export interface DeliveryView {
  id: string;
  stage: number;
  stageTitle: string;
  message: string | null;
  sentAt: string;
  files: { id: string; filename: string; mediaType: string; sizeBytes: number; sha256: string }[];
  access: {
    emailedAt: string | null;
    emailCount: number;
    opened: { count: number; lastAt: string | null };
    downloads: Partial<Record<string, { count: number; lastAt: string }>>;
  };
  /** The buyer's answer, once given: approved, or changes requested (with the revision number). */
  answer: {
    kind: "approved" | "changes";
    request: string | null;
    revision: number | null;
    at: string;
  } | null;
  /** Delivered lines marked as matters of taste that approving this stage also accepts. */
  mattersOfTaste?: string[];
}

export interface DeliveriesView {
  signed: boolean;
  emailOn: boolean;
  /** Seller only: the stages to deliver for. */
  stages: { stage: number; title: string }[];
  /** Change requests so far, against the revisions the agreement includes (null: no limit). */
  revisions?: { used: number; included: number | null };
  deliveries: DeliveryView[];
}

const isDeliveries = (value: unknown): value is DeliveriesView =>
  isObject(value) &&
  typeof value.signed === "boolean" &&
  typeof value.emailOn === "boolean" &&
  Array.isArray(value.stages) &&
  Array.isArray(value.deliveries) &&
  value.deliveries.every(
    (d) => isObject(d) && typeof d.id === "string" && Array.isArray(d.files) && isObject(d.access),
  );

const deliveriesUrl = (dealId: string) => `/api/deals/${encodeURIComponent(dealId)}/deliveries`;

export async function getDeliveries(dealId: string): Promise<DeliveriesView> {
  return readChecked(await fetch(deliveriesUrl(dealId)), isDeliveries, "load the deliveries");
}

/** A delivery step that answers with the deliveries; a refusal becomes the server's message. */
/**
 * Posts one step and reads the checked answer. A refusal naming fields becomes
 * `InvalidFieldsError`; any other refusal an error with the server's plain message.
 */
async function postStep<T>(
  url: string,
  body: object | undefined,
  what: string,
  check: (value: unknown) => value is T,
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok) {
    const answer: unknown = await response.json().catch(() => null);
    if (isObject(answer) && Array.isArray(answer.fields)) {
      throw new InvalidFieldsError(answer.fields.filter((f): f is string => typeof f === "string"));
    }
    throw new Error(
      isObject(answer) && typeof answer.error === "string" ? answer.error : `Could not ${what}`,
    );
  }
  return readChecked(response, check, what);
}

const deliveryStep = (url: string, body: object | undefined, what: string) =>
  postStep(url, body, what, isDeliveries);

/** The seller sends uploaded delivered files for one stage, with an optional message. */
export const sendDelivery = (
  dealId: string,
  input: { stage: number; message?: string; fileIds: string[] },
) => deliveryStep(deliveriesUrl(dealId), input, "send the delivery");

export const emailDeliveryAgain = (dealId: string, deliveryId: string) =>
  deliveryStep(`${deliveriesUrl(dealId)}/${deliveryId}/email`, undefined, "email the delivery");

/** The buyer opens a delivery; the server logs it. */
export const openDelivery = (dealId: string, deliveryId: string) =>
  deliveryStep(`${deliveriesUrl(dealId)}/${deliveryId}/open`, undefined, "open the delivery");

/** The buyer approves a delivery they opened. */
export const approveDelivery = (dealId: string, deliveryId: string) =>
  deliveryStep(`${deliveriesUrl(dealId)}/${deliveryId}/approve`, undefined, "approve the delivery");

/** The buyer asks for changes to a delivery they opened. */
export const requestChanges = (dealId: string, deliveryId: string, request: string) =>
  deliveryStep(
    `${deliveriesUrl(dealId)}/${deliveryId}/request-changes`,
    { request },
    "request changes",
  );

/** Where one delivered file downloads from (the buyer's downloads are logged). */
export const deliveryFileUrl = (dealId: string, deliveryId: string, fileId: string) =>
  `${deliveriesUrl(dealId)}/${deliveryId}/files/${fileId}`;

// --- Files -------------------------------------------------------------------------------------

/** The largest file the server accepts (10 MB), checked here too so nothing big is sent in vain. */
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export interface DealFile {
  id: string;
  kind: string;
  /** Who added it: the seller, the buyer (reference files, 5b) or PactPal itself. */
  addedBy: "seller" | "buyer" | "system";
  filename: string;
  mediaType: string;
  sizeBytes: number;
  sha256: string;
  addedAt: string;
}

const isFile = (value: unknown): value is DealFile =>
  isObject(value) &&
  typeof value.id === "string" &&
  typeof value.filename === "string" &&
  typeof value.mediaType === "string" &&
  typeof value.sizeBytes === "number" &&
  typeof value.sha256 === "string" &&
  typeof value.addedAt === "string" &&
  (value.addedBy === "seller" || value.addedBy === "buyer" || value.addedBy === "system");

export async function listFiles(dealId: string): Promise<DealFile[]> {
  const body = await readChecked(
    await fetch(`/api/deals/${encodeURIComponent(dealId)}/files`),
    (b): b is { files: unknown[] } => isObject(b) && Array.isArray(b.files),
    "load the files",
  );
  return body.files.filter(isFile);
}

/** Where a file downloads from; the server always sends it as a download. */
export const fileUrl = (dealId: string, fileId: string) =>
  `/api/deals/${encodeURIComponent(dealId)}/files/${encodeURIComponent(fileId)}`;

/** Sends a file's bytes, with its name in a header; the server checks the type from the bytes. */
/** Uploads a file: a source of the deal, or (`deliverable`) delivered work for a delivery. */
export async function addFile(
  dealId: string,
  file: File,
  kind: "source" | "deliverable" = "source",
): Promise<DealFile> {
  const response = await fetch(`/api/deals/${encodeURIComponent(dealId)}/files?kind=${kind}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "X-File-Name": encodeURIComponent(file.name),
      Accept: "application/json",
    },
    body: file,
  });
  if (!response.ok) throw new Error(await errorMessage(response, "Could not add the file"));
  return readChecked(response, isFile, "add the file");
}

/** A new buyer link; `emailed` says whether it was emailed to the buyer too. */
export async function makeBuyerLink(
  dealId: string,
): Promise<{ url: string; expiresAt: string; emailed: boolean }> {
  const response = await fetch(`/api/deals/${encodeURIComponent(dealId)}/buyer-link`, {
    method: "POST",
  });
  if (!response.ok) throw new Error(await errorMessage(response, "Could not make the link"));
  return readChecked(
    response,
    (b): b is { url: string; expiresAt: string; emailed: boolean } =>
      isObject(b) &&
      typeof b.url === "string" &&
      typeof b.expiresAt === "string" &&
      typeof b.emailed === "boolean",
    "make the link",
  );
}

// --- AI drafts ---------------------------------------------------------------------------------

/** Where in the pasted chat a fact comes from: a line number and words copied from that line. */
export interface Citation {
  line: number;
  quote: string;
}

/** A line the draft's models quoted, with its number. */
export interface ChatLine {
  n: number;
  text: string;
}

type Stated<T> = ({ status: "found"; citations: Citation[] } & T) | { status: "missing" };

/** The drafted agreed work: every statement carries quotes, or is marked missing. */
/** A draft's suggested mark for a delivered line (format 3 drafts only). */
export type DraftMark = "objective" | "process" | "subjective" | "unsure";

export interface DraftContent {
  /** 2: older drafts, without marks or buyer duties; 3: drafting prompt version 3. */
  format: 2 | 3;
  summary: Stated<{ value: string }>;
  deliverables: { text: string; citations: Citation[]; mark?: DraftMark }[];
  exclusions: { text: string; citations: Citation[] }[];
  /** What the buyer must provide, by the chat; absent in format 2 drafts. */
  buyerProvides?: { text: string; dueDate: string | null; citations: Citation[] }[];
  price: Stated<{ amount: string; currency: string; minor: number | null }>;
  paymentTerms: Stated<{ value: string }>;
  dueDate: Stated<{ value: string }>;
  revisionsIncluded: Stated<{ value: number }>;
  vagueTerms: {
    phrase: string;
    kind: "subjective" | "unmeasurable";
    suggestedRewrite: string;
    citations: Citation[];
  }[];
  category: { id: string; citations: Citation[]; note: string };
}

export type CategoryVerdict = "agrees" | "mismatch" | "blocked" | "unclear";

/** What the council did for one draft. */
export interface CouncilView {
  answers: {
    modelName: string;
    status: "valid" | "invalid" | "call_failed";
    errors: string[];
    latencyMs?: number;
    usage?: { promptTokens: number; completionTokens: number };
  }[];
  votes: {
    voter: string;
    status: "ballot" | "call_failed" | "unreadable" | "not_asked";
    reason?: string;
  }[];
  labels: { label: string; modelName: string }[];
  scores: { label: string; modelName: string; score: number; votes: number }[];
  agreement: number;
  needsReview: boolean;
  reviewReasons: string[];
  rejectedBallots: { voter: string; reason: string }[];
  usage: {
    calls: number;
    callsWithoutUsage: number;
    promptTokens: number;
    completionTokens: number;
  };
  durationMs: number;
}

export type DraftStatus = "running" | "ready" | "failed";

/** What the models read from the chat is being sold, compared with the deal's category. */
export interface DraftCategory {
  fromChat: string;
  label: string;
  verdict: CategoryVerdict;
  note: string;
}

/** One valid draft the council could not rank, offered for the seller to choose. */
export interface DraftCandidate {
  label: string;
  modelName: string;
  draft: DraftContent;
  category: DraftCategory;
}

export interface DraftView {
  id: string;
  status: DraftStatus;
  createdAt: string;
  finishedAt: string | null;
  /**
   * The chat file it was made from. `lines` is its numbered text and `hiddenLines` the numbers of
   * lines hidden from the models because they look like orders to an AI; both are given only for
   * finished drafts.
   */
  source: {
    fileId: string;
    sha256: string;
    lines: ChatLine[] | null;
    hiddenLines: number[] | null;
  };
  failureReason: string | null;
  draft: DraftContent | null;
  category: DraftCategory | null;
  needsReview: boolean | null;
  reviewReasons: string[];
  /** The council could not rank its drafts, so `candidates` holds every valid one to choose from. */
  unranked: boolean | null;
  candidates: DraftCandidate[];
  council: CouncilView | null;
}

const isStated = (value: unknown): boolean =>
  isObject(value) &&
  (value.status === "missing" || (value.status === "found" && Array.isArray(value.citations)));

const isDraftContent = (value: unknown): value is DraftContent =>
  isObject(value) &&
  (value.format === 2 || value.format === 3) &&
  isStated(value.summary) &&
  isStated(value.price) &&
  isStated(value.paymentTerms) &&
  isStated(value.dueDate) &&
  isStated(value.revisionsIncluded) &&
  Array.isArray(value.deliverables) &&
  Array.isArray(value.exclusions) &&
  Array.isArray(value.vagueTerms) &&
  isObject(value.category) &&
  typeof value.category.id === "string";

const isDraftCandidate = (value: unknown): value is DraftCandidate =>
  isObject(value) &&
  typeof value.label === "string" &&
  typeof value.modelName === "string" &&
  isDraftContent(value.draft) &&
  isObject(value.category);

const isCouncil = (value: unknown): value is CouncilView =>
  isObject(value) &&
  Array.isArray(value.answers) &&
  Array.isArray(value.votes) &&
  Array.isArray(value.labels) &&
  Array.isArray(value.scores) &&
  Array.isArray(value.rejectedBallots) &&
  Array.isArray(value.reviewReasons) &&
  typeof value.agreement === "number" &&
  typeof value.needsReview === "boolean" &&
  typeof value.durationMs === "number" &&
  isObject(value.usage) &&
  typeof value.usage.calls === "number";

const isDraftView = (value: unknown): value is DraftView =>
  isObject(value) &&
  typeof value.id === "string" &&
  (value.status === "running" || value.status === "ready" || value.status === "failed") &&
  typeof value.createdAt === "string" &&
  isObject(value.source) &&
  typeof value.source.fileId === "string" &&
  (value.source.lines === null || Array.isArray(value.source.lines)) &&
  (value.source.hiddenLines === null || Array.isArray(value.source.hiddenLines)) &&
  Array.isArray(value.reviewReasons) &&
  (value.unranked === null || typeof value.unranked === "boolean") &&
  Array.isArray(value.candidates) &&
  value.candidates.every(isDraftCandidate) &&
  (value.draft === null || isDraftContent(value.draft)) &&
  (value.council === null || isCouncil(value.council));

const draftsUrl = (dealId: string) => `/api/deals/${encodeURIComponent(dealId)}/drafts`;

/** The deal's drafts, newest first (without their numbered chats). */
export async function listDrafts(dealId: string): Promise<DraftView[]> {
  const body = await readChecked(
    await fetch(draftsUrl(dealId)),
    (b): b is { drafts: unknown[] } => isObject(b) && Array.isArray(b.drafts),
    "load the drafts",
  );
  return body.drafts.filter(isDraftView);
}

/** One draft; a finished one comes with its numbered chat. */
export async function getDraftById(dealId: string, draftId: string): Promise<DraftView> {
  const body = await readChecked(
    await fetch(`${draftsUrl(dealId)}/${encodeURIComponent(draftId)}`),
    (b): b is { draft: DraftView } => isObject(b) && isDraftView(b.draft),
    "load the draft",
  );
  return body.draft;
}

/** Starts a draft from a text file on the deal; it comes back `running`. */
export async function startDraft(dealId: string, sourceFileId: string): Promise<DraftView> {
  const response = await fetch(draftsUrl(dealId), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ sourceFileId }),
  });
  if (!response.ok) throw new Error(await errorMessage(response, "Could not start the draft"));
  const body = await readChecked(
    response,
    (b): b is { draft: DraftView } => isObject(b) && isDraftView(b.draft),
    "start the draft",
  );
  return body.draft;
}

/** Saves pasted text as a text source file on the deal (the same upload as any other file). */
export const addPastedChat = (dealId: string, text: string): Promise<DealFile> =>
  addFile(dealId, new File([text], "pasted-chat.txt", { type: "text/plain" }));

/** One item of the evidence completeness score. */
export interface CompletenessItem {
  id: string;
  label: string;
  points: number;
  earned: number;
  status: "helping" | "missing" | "not-measured";
  detail: string;
  fix?: string;
}

/** How complete a deal's records are (seller only); never a prediction of any outcome. */
export interface CompletenessView {
  score: number;
  measurable: number;
  items: CompletenessItem[];
}

const ITEM_STATUSES = new Set(["helping", "missing", "not-measured"]);

const isCompleteness = (value: unknown): value is CompletenessView =>
  isObject(value) &&
  typeof value.score === "number" &&
  typeof value.measurable === "number" &&
  Array.isArray(value.items) &&
  value.items.every(
    (item) =>
      isObject(item) &&
      typeof item.id === "string" &&
      typeof item.label === "string" &&
      typeof item.points === "number" &&
      typeof item.earned === "number" &&
      typeof item.status === "string" &&
      ITEM_STATUSES.has(item.status) &&
      typeof item.detail === "string" &&
      (item.fix === undefined || typeof item.fix === "string"),
  );

export async function getCompleteness(dealId: string): Promise<CompletenessView> {
  return readChecked(
    await fetch(`/api/deals/${encodeURIComponent(dealId)}/completeness`),
    isCompleteness,
    "load the evidence completeness score",
  );
}

// --- Change orders -----------------------------------------------------------------------------

/** What a change order adds to, or changes in, the signed agreement. */
export interface ChangeView {
  addedLines: { text: string; mark: DeliverableKind }[];
  addedExclusions: string[];
  addedBuyerProvides: { text: string; dueDate: string | null }[];
  addedStages: { stage: number; title: string; amount: Money; dueDate: string | null }[];
  dueDate: { from: string | null; to: string | null } | null;
  revisionsIncluded: { from: number; to: number } | null;
  total: { from: Money; to: Money };
}

export type ChangeOrderStatus = "proposed" | "accepted" | "declined" | "withdrawn";

/** One change order; the one waiting carries the page the buyer signs and its fingerprint. */
export interface ChangeOrderView {
  id: string;
  status: ChangeOrderStatus;
  fromVersion: number;
  toVersion: number;
  message: string | null;
  reason: string | null;
  proposedAt: string;
  answeredAt: string | null;
  /** For an accepted change: the name the buyer typed to sign it. */
  acceptedBy: string | null;
  change: ChangeView;
  document?: AcceptanceDocument;
  documentSha256?: string;
}

export interface ChangeOrdersView {
  signed: boolean;
  signedVersion: number | null;
  /** The seller may propose a change now (signed, and none waiting). */
  canPropose: boolean;
  orders: ChangeOrderView[];
  /** After a proposal: whether the buyer was emailed (`off`: email is not set up). */
  buyerEmail?: "sent" | "failed" | "off";
}

/** What the seller adds in a change order; amounts as typed ("400.00"). */
export interface ChangeProposal {
  addLines: { text: string; mark: DeliverableKind }[];
  addExclusions: string[];
  addBuyerProvides: { text: string; dueDate?: string }[];
  addStages: { title: string; amount: string; dueDate?: string }[];
  dueDate?: string;
  revisionsIncluded?: number;
  message?: string;
}

const CHANGE_STATUSES = new Set(["proposed", "accepted", "declined", "withdrawn"]);

const isChangeOrders = (value: unknown): value is ChangeOrdersView =>
  isObject(value) &&
  typeof value.signed === "boolean" &&
  typeof value.canPropose === "boolean" &&
  Array.isArray(value.orders) &&
  value.orders.every(
    (order) =>
      isObject(order) &&
      typeof order.id === "string" &&
      typeof order.status === "string" &&
      CHANGE_STATUSES.has(order.status) &&
      typeof order.toVersion === "number" &&
      isObject(order.change) &&
      Array.isArray(order.change.addedLines) &&
      Array.isArray(order.change.addedStages) &&
      (order.document === undefined || isDocument(order.document)),
  );

const changeOrdersUrl = (dealId: string) =>
  `/api/deals/${encodeURIComponent(dealId)}/change-orders`;

export async function getChangeOrders(dealId: string): Promise<ChangeOrdersView> {
  return readChecked(await fetch(changeOrdersUrl(dealId)), isChangeOrders, "load the changes");
}

/** The seller proposes a change; throws `InvalidFieldsError` naming parts that are not right. */
export const proposeChange = (dealId: string, proposal: ChangeProposal) =>
  postStep(changeOrdersUrl(dealId), proposal, "propose the change", isChangeOrders);

const changeStep = (
  dealId: string,
  changeId: string,
  step: "accept" | "decline" | "withdraw",
  body: object | undefined,
  what: string,
) =>
  postStep(
    `${changeOrdersUrl(dealId)}/${encodeURIComponent(changeId)}/${step}`,
    body,
    what,
    isChangeOrders,
  );

/** The buyer signs the change shown (named by its page's fingerprint). */
export const acceptChange = (
  dealId: string,
  changeId: string,
  input: { documentSha256: string; typedName: string },
) => changeStep(dealId, changeId, "accept", input, "sign the change");

export const declineChange = (dealId: string, changeId: string, input: { reason?: string }) =>
  changeStep(dealId, changeId, "decline", input, "decline the change");

export const withdrawChange = (dealId: string, changeId: string) =>
  changeStep(dealId, changeId, "withdraw", undefined, "withdraw the change");

export type QuestionStatus = "asked" | "answered" | "forwarded" | "seller-answered";
export type ForwardReason = "not-in-agreement" | "quote-not-found" | "no-model" | "buyer-asked";

/** One buyer question as both sides see it; the automatic answer quotes numbered agreement lines. */
export interface QuestionView {
  id: string;
  version: number;
  question: string;
  status: QuestionStatus;
  askedAt: string;
  answer: { text: string; citations: { line: number; quote: string }[] } | null;
  forwardReason: ForwardReason | null;
  sellerAnswer: string | null;
  updatedAt: string;
}

export interface QuestionsView {
  /** The buyer may ask now (asked to sign, none being answered, under the limit). */
  canAsk: boolean;
  questions: QuestionView[];
  /** After the seller answers: whether the buyer was emailed (`off`: email is not set up). */
  buyerEmail?: "sent" | "failed" | "off";
}

const QUESTION_STATUSES = new Set(["asked", "answered", "forwarded", "seller-answered"]);

const isQuestions = (value: unknown): value is QuestionsView =>
  isObject(value) &&
  typeof value.canAsk === "boolean" &&
  Array.isArray(value.questions) &&
  value.questions.every(
    (q) =>
      isObject(q) &&
      typeof q.id === "string" &&
      typeof q.question === "string" &&
      typeof q.status === "string" &&
      QUESTION_STATUSES.has(q.status) &&
      (q.answer === null || (isObject(q.answer) && Array.isArray(q.answer.citations))),
  );

const questionsUrl = (dealId: string) => `/api/deals/${encodeURIComponent(dealId)}/questions`;

export async function getQuestions(dealId: string): Promise<QuestionsView> {
  return readChecked(await fetch(questionsUrl(dealId)), isQuestions, "load the questions");
}

/** The buyer asks about the page they see (named by its fingerprint); answered before it returns. */
export const askAboutAgreement = (
  dealId: string,
  input: { question: string; documentSha256: string },
) => postStep(questionsUrl(dealId), input, "send the question", isQuestions);

const questionStep = (dealId: string, questionId: string, step: "forward" | "answer") =>
  `${questionsUrl(dealId)}/${encodeURIComponent(questionId)}/${step}`;

/** "Ask the seller instead": the buyer sends an automatically answered question on. */
export const askSellerInstead = (dealId: string, questionId: string) =>
  postStep(questionStep(dealId, questionId, "forward"), undefined, "ask the seller", isQuestions);

export const answerBuyerQuestion = (dealId: string, questionId: string, answer: string) =>
  postStep(questionStep(dealId, questionId, "answer"), { answer }, "send the answer", isQuestions);

/** One image's look in a pre-delivery check, or that no model answered. */
export type LookView =
  { fileId: string; promptVersion: number; look: Look } | { fileId: string; unavailable: true };

/** A pre-delivery check as its seller sees it (4l): advice, never shown to the buyer. */
export interface DeliveryCheckView {
  id: string;
  stage: number;
  version: number;
  checkedAt: string;
  files: { fileId: string; filename: string }[];
  report: {
    lines: { n: number; text: string }[];
    files: { fileId: string; filename: string; facts: ImageFacts }[];
    code: LineCodeResult[];
    looks: LookView[];
  };
}

export interface DeliveryChecksView {
  checks: DeliveryCheckView[];
}

const isChecks = (value: unknown): value is DeliveryChecksView =>
  isObject(value) &&
  Array.isArray(value.checks) &&
  value.checks.every(
    (c) =>
      isObject(c) &&
      typeof c.id === "string" &&
      isObject(c.report) &&
      Array.isArray(c.report.lines) &&
      Array.isArray(c.report.files) &&
      Array.isArray(c.report.code) &&
      Array.isArray(c.report.looks),
  );

const checksUrl = (dealId: string) => `/api/deals/${encodeURIComponent(dealId)}/delivery-checks`;

export async function getDeliveryChecks(dealId: string): Promise<DeliveryChecksView> {
  return readChecked(await fetch(checksUrl(dealId)), isChecks, "load the checks");
}

/** Checks uploaded delivered files; `copies` are the browser's smaller copies of the images. */
export const runDeliveryCheck = (
  dealId: string,
  input: {
    stage: number;
    fileIds: string[];
    copies: { fileId: string; mediaType: "image/jpeg"; base64: string }[];
  },
) => postStep(checksUrl(dealId), input, "check the files", isChecks);

/** One council review of a buyer's message (4m), for the seller only. */
export interface MessageReviewView {
  id: string;
  status: "running" | "ready" | "failed";
  version: number;
  createdAt: string;
  finishedAt: string | null;
  file: { id: string; filename: string };
  message: string;
  review: MessageReview | null;
  /** The models did not agree, or only one answer was valid. */
  needsReview: boolean;
  failureReason: string | null;
}

export interface MessagesView {
  canCheck: boolean;
  /** Change requests so far against the revisions included, once signed. */
  revisions: { used: number; included: number | null } | null;
  reviews: MessageReviewView[];
}

const isMessages = (value: unknown): value is MessagesView =>
  isObject(value) &&
  typeof value.canCheck === "boolean" &&
  Array.isArray(value.reviews) &&
  value.reviews.every(
    (r) =>
      isObject(r) &&
      typeof r.id === "string" &&
      typeof r.status === "string" &&
      typeof r.message === "string" &&
      (r.review === null || (isObject(r.review) && Array.isArray(r.review.requests))),
  );

const messagesUrl = (dealId: string) => `/api/deals/${encodeURIComponent(dealId)}/messages`;

export async function getMessages(dealId: string): Promise<MessagesView> {
  return readChecked(await fetch(messagesUrl(dealId)), isMessages, "load the messages");
}

/** Saves a buyer's message as a deal file and starts the council's review of it. */
export const checkMessage = (dealId: string, text: string) =>
  postStep(messagesUrl(dealId), { text }, "check the message", isMessages);

/** What the image models read from chat screenshots (4o): the text for the chat box. */
export interface ScreenshotReading {
  text: string;
  /** Words the models marked [unreadable]. */
  unreadable: number;
  screenshots: { fileId: string; filename: string; read: boolean; messages: number }[];
}

const isReading = (value: unknown): value is ScreenshotReading =>
  isObject(value) &&
  typeof value.text === "string" &&
  typeof value.unreadable === "number" &&
  Array.isArray(value.screenshots);

/** Reads saved screenshots (in this order) into chat text; `copies` are the browser's smaller copies. */
export const readScreenshots = (
  dealId: string,
  input: {
    fileIds: string[];
    copies: { fileId: string; mediaType: "image/jpeg"; base64: string }[];
  },
) =>
  postStep(
    `/api/deals/${encodeURIComponent(dealId)}/screenshots/read`,
    input,
    "read the screenshots",
    isReading,
  );

/** An intake key or forwarding address as the settings show it: never the secret itself. */
export interface IntakeSecretView {
  ending: string;
  defaultCategory: string;
  defaultCurrency: string;
  createdAt: string;
  lastUsedAt: string | null;
}

/** The seller's intake key (4p) and forwarding address (4p-2), except once when made. */
export interface IntakeKeyView {
  key: IntakeSecretView | null;
  address: IntakeSecretView | null;
  /** Whether email forwarding is set up on the server. */
  forwarding: boolean;
  /** The only sender whose forwarded emails are accepted. */
  sellerEmail: string;
  /** Only in the answer that made a key or address: the secret itself, shown once. */
  secret?: string;
}

const isSecretView = (value: unknown) =>
  value === null || (isObject(value) && typeof value.ending === "string");

const isIntakeKey = (value: unknown): value is IntakeKeyView =>
  isObject(value) &&
  isSecretView(value.key) &&
  isSecretView(value.address) &&
  typeof value.forwarding === "boolean" &&
  typeof value.sellerEmail === "string" &&
  (value.secret === undefined || typeof value.secret === "string");

export async function getIntakeKey(): Promise<IntakeKeyView> {
  return readChecked(await fetch("/api/intake/key"), isIntakeKey, "load the intake key");
}

export type IntakeKind = "key" | "address";
interface IntakeDefaults {
  defaultCategory: string;
  defaultCurrency: string;
}

/** Makes a new intake key or forwarding address (turning off the old one), with its defaults. */
export const makeIntakeSecret = (kind: IntakeKind, defaults: IntakeDefaults) =>
  postStep(`/api/intake/${kind}`, defaults, `make a ${kind}`, isIntakeKey);

export const turnOffIntakeSecret = (kind: IntakeKind) =>
  postStep(`/api/intake/${kind}/off`, undefined, `turn the ${kind} off`, isIntakeKey);

// --- Your PayPal app (6h-2) ----------------------------------------------------------------------

/** A seller's own linked PayPal app; the secret is never sent back. */
export interface SellerAppLink {
  merchantId: string;
  clientId: string;
  linkedAt: string;
}

export interface SellerAppState {
  /** Whether this server can link apps at all (database and encryption key set). */
  available: boolean;
  link: SellerAppLink | null;
}

/** Why linking did not work, as the server names it; `other` for anything unexpected. */
export type SellerAppProblem =
  | "login-failed"
  | "missing-features"
  | "account-unreadable"
  | "account-taken"
  | "paypal-unavailable"
  | "unavailable"
  | "invalid"
  | "other";

const SELLER_APP_PROBLEMS: readonly SellerAppProblem[] = [
  "login-failed",
  "missing-features",
  "account-unreadable",
  "account-taken",
  "paypal-unavailable",
  "unavailable",
  "invalid",
];

const isSellerAppLink = (value: unknown): value is SellerAppLink =>
  isObject(value) &&
  typeof value.merchantId === "string" &&
  typeof value.clientId === "string" &&
  typeof value.linkedAt === "string";

const isSellerAppState = (value: unknown): value is SellerAppState =>
  isObject(value) &&
  typeof value.available === "boolean" &&
  (value.link === null || isSellerAppLink(value.link));

const SELLER_APP_URL = "/api/seller-app";

export async function getSellerApp(): Promise<SellerAppState> {
  return readChecked(await fetch(SELLER_APP_URL), isSellerAppState, "load your PayPal app");
}

/** Links the seller's own app; the secret goes to the server once and is never shown again. */
export async function linkSellerApp(input: {
  clientId: string;
  clientSecret: string;
}): Promise<
  { ok: true; link: SellerAppLink } | { ok: false; problem: SellerAppProblem; missing: string[] }
> {
  const response = await fetch(SELLER_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(input),
  });
  const body: unknown = await response.json().catch(() => null);
  if (response.ok && isObject(body) && isSellerAppLink(body.link)) {
    return { ok: true, link: body.link };
  }
  const error = isObject(body) ? body.error : undefined;
  const missing = isObject(body) && Array.isArray(body.missing) ? body.missing : [];
  return {
    ok: false,
    problem: SELLER_APP_PROBLEMS.find((problem) => problem === error) ?? "other",
    missing: missing.filter((name): name is string => typeof name === "string"),
  };
}

/** Unlinks the seller's own app; the server deletes the stored secret. */
export async function unlinkSellerApp(): Promise<void> {
  const response = await fetch(SELLER_APP_URL, { method: "DELETE" });
  if (!response.ok)
    throw new Error(`Could not unlink your PayPal app (${String(response.status)})`);
}
