import { recordLines, type AppealItem, type RecordEntry } from "@pactpal/claims";
import {
  getPacket,
  listDisputeActions,
  readLedger,
  type ContentStore,
  type Database,
  type Deal,
  type StoredDispute,
} from "@pactpal/db";
import { plainCode } from "@pactpal/words";
import { disputeFieldsOf } from "./dispute-view.js";
import { ADDED_BY, exhibitWhat } from "./packet.js";
import { packetChoices } from "./packet-service.js";

/** Most new items one appeal check lists (owner's choice, 5i); a longer list is cut and says so. */
export const MAX_APPEAL_ITEMS = 80;

/** Entries about answering the dispute itself, not about the deal: never "new evidence". */
const DISPUTE_PROCESS = new Set(["EVIDENCE_UPLOADED", "OFFER_MADE", "CLAIM_ACCEPTED"]);

/** One document the seller could still send, as the packet lists it. */
export interface HeldDocument {
  id: string;
  filename: string;
  sha256: string;
  kind: "receipt" | "deliverable" | "source";
  stage: number | null;
  mediaType: string;
  addedBy: keyof typeof ADDED_BY;
}

/** What was already sent to PayPal for the dispute, as fingerprints, names and a seal. */
export interface AlreadySent {
  /** Fingerprints of every file sent, as sent and as recorded before any change to PDF. */
  fileShas: ReadonlySet<string>;
  /** Document names PayPal lists as sent by the seller (also outside PactPal). */
  names: ReadonlySet<string>;
  /** Log entries in the newest sent packet's timeline (its seal), if any packet was sent. */
  seal: number | undefined;
}

/**
 * What PactPal holds that was not sent to PayPal before (5i), in code: documents whose fingerprint
 * (or, for evidence sent outside PactPal, name) is not among those sent, then evidence log entries
 * written after the newest sent packet's timeline (every entry if none was sent), leaving out the
 * dispute's own answers. At most `MAX_APPEAL_ITEMS`; `cut` says when the list is longer. Pure.
 */
export function appealItems(
  documents: readonly HeldDocument[],
  ledger: readonly RecordEntry[],
  sent: AlreadySent,
): { items: AppealItem[]; cut: boolean } {
  const docs = documents
    .filter((doc) => !sent.fileShas.has(doc.sha256) && !sent.names.has(doc.filename))
    .map((doc) => ({
      // Short ids with no colon (models copied "doc:x: name" wrongly in the 5i live run), stable
      // across checks: "D" and the start of the file's fingerprint.
      id: docItemId(doc.sha256),
      words: `${doc.filename} (added by ${ADDED_BY[doc.addedBy]}; ${exhibitWhat(doc)})`,
    }));
  const newer = ledger.filter(
    (entry) =>
      (sent.seal === undefined || entry.seq >= sent.seal) &&
      !entry.type.startsWith("DISPUTE_") &&
      !DISPUTE_PROCESS.has(entry.type),
  );
  const entries = recordLines(newer).lines.map((line) => ({
    id: entryItemId(line.n),
    words: line.text,
  }));
  const all = [...docs, ...entries];
  return { items: all.slice(0, MAX_APPEAL_ITEMS), cut: all.length > MAX_APPEAL_ITEMS };
}

/** The appeal item id of a document: "D" and the first 6 characters of its SHA-256. */
export const docItemId = (sha256: string) => `D${sha256.slice(0, 6)}`;

/** The appeal item id of a log entry: "E" and its number as the record shows it (seq + 1). */
export const entryItemId = (n: number) => `E${String(n)}`;

/** Whether the appeal check applies: PayPal decided for the buyer, or allows an appeal now. */
export const appealApplies = (dispute: StoredDispute) =>
  dispute.outcome?.includes("BUYER_FAVOUR") === true || dispute.allowedActions.includes("appeal");

/**
 * Everything the appeal check needs, read from the database: the new items, PayPal's decision and
 * what was sent (through PactPal, and as PayPal lists it), as plain lines written by code.
 */
export async function appealFacts(
  db: Database,
  store: ContentStore,
  deal: Deal,
  dispute: StoredDispute,
) {
  const [choices, ledger, actions] = await Promise.all([
    packetChoices(db, store, deal),
    readLedger(db, deal.id),
    listDisputeActions(db, dispute.disputeId),
  ]);
  const uploads = actions.filter((a) => a.kind === "evidence" && a.status === "sent");
  const packets = await Promise.all(
    uploads.flatMap((a) => (a.packetId === undefined ? [] : [getPacket(db, a.packetId)])),
  );
  const fields = disputeFieldsOf(dispute.details);
  const seals = packets.flatMap((p) => (p === undefined ? [] : [p.chainEntries]));
  const sent: AlreadySent = {
    fileShas: new Set([
      ...uploads.flatMap((a) => a.files.map((f) => f.sha256)),
      ...packets.flatMap(
        (p) => p?.exhibits.map((e) => (e.number === undefined ? "" : e.sha256)) ?? [],
      ),
    ]),
    names: new Set(fields.sellerEvidence.flatMap((e) => e.documents)),
    seal: seals.length === 0 ? undefined : Math.max(...seals),
  };
  const documents = choices.exhibits.filter((e) => e.send !== "left-out");
  const { items, cut } = appealItems(documents, ledger, sent);
  return {
    items,
    cut,
    decision: [
      `PayPal's status: ${plainCode(dispute.status)}${dispute.stageName === null ? "" : `, ${plainCode(dispute.stageName)} stage`}`,
      `PayPal decided: ${dispute.outcome === null ? "no decision yet" : plainCode(dispute.outcome)}`,
      ...fields.decisionReasons.map((reason) => `PayPal's reason code: ${plainCode(reason)}`),
    ],
    sent: [
      ...uploads.map(
        (a) =>
          `Upload of ${a.createdAt.toISOString().slice(0, 10)}: type ${plainCode(a.evidenceType ?? "OTHER")}; note: "${a.note}"; files: ${a.files.map((f) => f.name).join(", ")}`,
      ),
      ...fields.sellerEvidence.map(
        (e) =>
          `As PayPal lists it: type ${plainCode(e.type ?? "OTHER")}; files: ${e.documents.join(", ") || "none named"}`,
      ),
    ],
  };
}
