import { listAllMessages, listStepUpdates, readLedger, type Database } from "@pactpal/db";
import type { LedgerEntry } from "@pactpal/ledger";

/**
 * The deal's evidence log as the dispute record reads it (7m): every entry as logged, with the
 * words the log holds only by fingerprint filled in from their own tables, each already checked
 * against its fingerprint when read: a chat message's text (`message`) and a timeline update's
 * note (`note`). Positions and fingerprints are unchanged, so record lines cite the same entries.
 */
export async function recordEntries(db: Database, dealId: string): Promise<LedgerEntry[]> {
  const [entries, messages, updates] = await Promise.all([
    readLedger(db, dealId),
    listAllMessages(db, dealId),
    listStepUpdates(db, dealId),
  ]);
  const words = new Map<number, Record<string, string>>();
  for (const message of messages) {
    if (message.kind === "text" && message.ledgerSeq !== null) {
      words.set(message.ledgerSeq, { message: message.body });
    }
  }
  for (const update of updates) {
    if (update.note !== null) words.set(update.ledgerSeq, { note: update.note });
  }
  return entries.map((entry) => {
    const extra = words.get(entry.seq);
    const { payload } = entry;
    if (!extra || typeof payload !== "object" || payload === null || Array.isArray(payload)) {
      return entry;
    }
    return { ...entry, payload: { ...payload, ...extra } };
  });
}
