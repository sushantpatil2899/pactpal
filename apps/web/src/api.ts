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

/** One saved version of a deal's agreed work. */
export interface ScopeView {
  version: number;
  contentSha256: string;
  savedAt: string;
  currency: string;
  summary: string;
  deliverables: string[];
  exclusions: string[];
  revisionsIncluded: number | null;
  dueDate: string | null;
  milestones: { title: string; amount: Money; dueDate: string | null }[];
  total: Money;
}

/** What the seller saves; each stage's amount as typed ("250.50"). */
export interface ScopeInput {
  /** The AI draft this was made from, so the evidence log can link them. */
  draftId?: string;
  summary: string;
  deliverables: string[];
  exclusions: string[];
  revisionsIncluded?: number;
  dueDate?: string;
  milestones: { title: string; amount: string; dueDate?: string }[];
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

const isScope = (value: unknown): value is ScopeView =>
  isObject(value) &&
  typeof value.version === "number" &&
  typeof value.contentSha256 === "string" &&
  typeof value.savedAt === "string" &&
  typeof value.summary === "string" &&
  Array.isArray(value.deliverables) &&
  Array.isArray(value.exclusions) &&
  Array.isArray(value.milestones) &&
  value.milestones.every((stage) => isObject(stage) && isMoney(stage.amount)) &&
  isMoney(value.total);

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

// --- Files -------------------------------------------------------------------------------------

/** The largest file the server accepts (10 MB), checked here too so nothing big is sent in vain. */
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export interface DealFile {
  id: string;
  kind: string;
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
  typeof value.addedAt === "string";

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
export async function addFile(dealId: string, file: File): Promise<DealFile> {
  const response = await fetch(`/api/deals/${encodeURIComponent(dealId)}/files`, {
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

export async function makeBuyerLink(dealId: string): Promise<{ url: string; expiresAt: string }> {
  const response = await fetch(`/api/deals/${encodeURIComponent(dealId)}/buyer-link`, {
    method: "POST",
  });
  if (!response.ok) throw new Error(await errorMessage(response, "Could not make the link"));
  return readChecked(
    response,
    (b): b is { url: string; expiresAt: string } =>
      isObject(b) && typeof b.url === "string" && typeof b.expiresAt === "string",
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
export interface DraftContent {
  summary: Stated<{ value: string }>;
  deliverables: { text: string; citations: Citation[] }[];
  exclusions: { text: string; citations: Citation[] }[];
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
  category: { fromChat: string; label: string; verdict: CategoryVerdict; note: string } | null;
  needsReview: boolean | null;
  reviewReasons: string[];
  council: CouncilView | null;
}

const isStated = (value: unknown): boolean =>
  isObject(value) &&
  (value.status === "missing" || (value.status === "found" && Array.isArray(value.citations)));

const isDraftContent = (value: unknown): value is DraftContent =>
  isObject(value) &&
  value.format === 2 &&
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
