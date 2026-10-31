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
}

export interface LedgerEntryView {
  seq: number;
  type: string;
  actor: "seller" | "buyer" | "system";
  actorName: string | null;
  serverTime: string;
  entryHash: string;
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
