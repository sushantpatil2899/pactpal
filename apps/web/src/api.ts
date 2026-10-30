/** The one place the web app talks to the server. Answers are checked before use. */

export interface Me {
  id: string;
  email: string;
  displayName: string | null;
  paypalLinked: boolean;
}

export const SIGN_IN_PATH = "/auth/paypal/start";

function isMe(value: unknown): value is Me {
  if (typeof value !== "object" || value === null) return false;
  const me = value as Record<string, unknown>;
  return (
    typeof me.id === "string" &&
    typeof me.email === "string" &&
    (typeof me.displayName === "string" || me.displayName === null) &&
    typeof me.paypalLinked === "boolean"
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
