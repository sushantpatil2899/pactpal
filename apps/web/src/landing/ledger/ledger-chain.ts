/**
 * The landing page's working copy of PactPal's evidence log, small enough to run in a visitor's
 * browser with real SHA-256: each entry's hash covers the one before it, so changing any entry
 * changes its hash and every hash after it, and a check finds the first entry that no longer
 * matches what was recorded. The server's log (packages/ledger) works the same way.
 */

export interface DemoEntry {
  type: string;
  actor: string;
  at: string;
  text: string;
}

/** The hash a log starts from, before its first entry. */
export const GENESIS = "0".repeat(64);

export async function sha256(text: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Each entry's hash, in order: the hash of the previous entry's hash and this entry's fields. */
export async function sealChain(entries: readonly DemoEntry[]): Promise<string[]> {
  const hashes: string[] = [];
  let previous = GENESIS;
  for (const entry of entries) {
    previous = await sha256([previous, entry.type, entry.actor, entry.at, entry.text].join("|"));
    hashes.push(previous);
  }
  return hashes;
}

export type EntryCheck = "sealed" | "changed" | "after";

/**
 * Compares the hashes worked out now with the ones recorded: entries match until the first one
 * that does not ("changed"); everything after it can no longer be trusted ("after").
 */
export function checkChain(recorded: readonly string[], now: readonly string[]): EntryCheck[] {
  const first = recorded.findIndex((hash, i) => hash !== now[i]);
  return recorded.map((_, i) => {
    if (first === -1 || i < first) return "sealed";
    return i === first ? "changed" : "after";
  });
}

/** A hash as the app shows it: the first and last four characters. */
export const shortHash = (hash: string): string => `${hash.slice(0, 4)}…${hash.slice(-4)}`;
