import { plainCode } from "@pactpal/words";

/** One evidence-log entry, as much of it as the record lines need. */
export interface RecordEntry {
  seq: number;
  type: string;
  actor: string;
  serverTime: string;
  payload: unknown;
}

/** One line of the record: its number as the deal page shows it (position + 1), and its text. */
export interface RecordLine {
  n: number;
  text: string;
}

/** At most this many record lines go to the models; a longer record is cut and says so. */
export const MAX_RECORD_LINES = 300;

/**
 * Entries that are AI output or PactPal's own working notes, not evidence of what the people did:
 * they never go to the models (owner's choice, 5d).
 */
const LEFT_OUT = new Set([
  "SCOPE_DRAFTED",
  "SCOPE_CONFIRMED",
  "AI_ANSWER_SHOWN",
  "MESSAGE_CLASSIFIED",
  "CLAIM_ANALYZED",
  "SUMMARY_DRAFTED",
  "PACKET_BUILT",
  "APPEAL_CHECKED",
  "RECORD_EXPORTED",
]);

/** What each entry type means, in plain words; unknown types are shown in plain letters. */
const LABELS: Record<string, string> = {
  DEAL_CREATED: "created the deal",
  BUYER_ADDED: "added the buyer",
  SOURCE_ADDED: "added a file",
  DELIVERABLE_ADDED: "uploaded delivered work",
  SCOPE_VERSIONED: "saved the agreed work",
  ACCEPTANCE_REQUESTED: "sent the agreement for signing",
  ACCEPTANCE_WITHDRAWN: "withdrew the agreement before signing",
  ACCEPTED: "signed the agreement",
  DECLINED: "declined the agreement",
  RECEIPT_SENT: "emailed the signed receipt",
  INVOICE_SENT: "sent a PayPal invoice",
  PAYMENT_RECEIVED: "recorded a PayPal payment",
  DELIVERY_SENT: "sent a delivery",
  DELIVERY_EMAILED: "emailed the delivery to the buyer",
  DELIVERY_VIEWED: "opened a delivery",
  DELIVERY_DOWNLOADED: "downloaded a delivered file",
  MILESTONE_APPROVED: "approved a delivery",
  CHANGE_REQUESTED: "requested changes",
  CHANGE_ORDER_PROPOSED: "proposed a change to the agreement",
  CHANGE_ORDER_ACCEPTED: "signed a change to the agreement",
  CHANGE_ORDER_DECLINED: "declined a change to the agreement",
  CHANGE_ORDER_WITHDRAWN: "withdrew a proposed change",
  BUYER_QUESTION: "asked a question about the agreement",
  QUESTION_FORWARDED: "sent a question to the seller",
  QUESTION_ANSWERED: "answered a question",
  REFUND_ISSUED: "issued a refund",
  DISPUTE_OPENED: "found a PayPal dispute",
  DISPUTE_UPDATED: "saw the PayPal dispute change",
  DISPUTE_ESCALATED: "asked PayPal to decide the dispute (escalated it)",
  EVIDENCE_UPLOADED: "sent evidence to PayPal",
  DISPUTE_RESOLVED: "saw PayPal decide the dispute",
  NOTE_ADDED: "added a note",
};

const WHO: Record<string, string> = { seller: "seller", buyer: "buyer", system: "PactPal" };

/** "2 Nov 2026 14:03 UTC", from the server's own time. */
function timeWords(iso: string): string {
  const at = new Date(iso);
  const day = at.toLocaleDateString("en-GB", { dateStyle: "medium", timeZone: "UTC" });
  const time = at.toISOString().slice(11, 16);
  return `${day} ${time} UTC`;
}

const fieldsOf = (payload: unknown): Record<string, unknown> =>
  typeof payload === "object" && payload !== null && !Array.isArray(payload)
    ? (payload as Record<string, unknown>)
    : {};

const text = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
const count = (value: unknown): string | undefined =>
  typeof value === "number" ? String(value) : undefined;

/** The file names an entry names: one `filename`, or each file of a delivery. */
function filesOf(fields: Record<string, unknown>): string[] {
  const one = text(fields.filename);
  if (one !== undefined) return [one];
  const files = Array.isArray(fields.files) ? fields.files : [];
  return files.flatMap((file) => {
    const name = text(fieldsOf(file).filename);
    return name === undefined ? [] : [name];
  });
}

/** The details worth showing for an entry, in brackets; the people's own words are quoted. */
function detailsOf(type: string, payload: unknown): string {
  const fields = fieldsOf(payload);
  const parts: string[] = [];
  const stage = count(fields.stage);
  if (stage !== undefined && !type.startsWith("DISPUTE_")) parts.push(`stage ${stage}`);
  const version = count(fields.version);
  if (version !== undefined) parts.push(`agreement version ${version}`);
  const files = filesOf(fields);
  if (files.length > 0) parts.push(files.join(", "));
  if (type === "CHANGE_REQUESTED" && fields.beyondIncluded === true) {
    parts.push("beyond the included revisions");
  }
  for (const key of ["request", "reason", "question", "answer", "message"] as const) {
    const words = text(fields[key]);
    if (words !== undefined && !type.startsWith("DISPUTE_")) parts.push(`"${words}"`);
  }
  const status = text(fields.status);
  if (type.startsWith("DISPUTE_") && status !== undefined) parts.push(plainCode(status));
  const evidenceType = text(fields.evidenceType);
  if (type === "EVIDENCE_UPLOADED" && Array.isArray(fields.files)) {
    const n = fields.files.length;
    parts.push(`${String(n)} file${n === 1 ? "" : "s"}`);
    if (evidenceType !== undefined) parts.push(`type ${plainCode(evidenceType)}`);
  }
  const outcome = text(fields.outcome);
  if (outcome !== undefined) parts.push(plainCode(outcome));
  return parts.length === 0 ? "" : ` (${parts.join("; ")})`;
}

/**
 * The deal's record as numbered lines, written by code from the evidence log (never by a model):
 * "#14 2 Nov 2026 14:03 UTC, buyer: approved a delivery (stage 1; agreement version 1)". AI
 * output and working notes are left out; at most `MAX_RECORD_LINES`, oldest first. Pure.
 */
export function recordLines(entries: readonly RecordEntry[]): {
  lines: RecordLine[];
  cut: boolean;
} {
  const kept = entries.filter((entry) => !LEFT_OUT.has(entry.type));
  const lines = kept.slice(0, MAX_RECORD_LINES).map((entry) => {
    const n = entry.seq + 1;
    const label = LABELS[entry.type] ?? plainCode(entry.type);
    const who = WHO[entry.actor] ?? entry.actor;
    return {
      n,
      text: `#${String(n)} ${timeWords(entry.serverTime)}, ${who}: ${label}${detailsOf(entry.type, entry.payload)}`,
    };
  });
  return { lines, cut: kept.length > MAX_RECORD_LINES };
}
