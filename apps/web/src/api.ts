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
