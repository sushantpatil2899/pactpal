import type { ComparisonRow, RecordLine } from "@pactpal/claims";
import { sha256Hex } from "@pactpal/ledger";
import { MAX_EVIDENCE_FILE_BYTES } from "@pactpal/paypal";
import { renderPdf, type Block } from "@pactpal/pdf";
import { disputeReasonWords, sizeWords } from "@pactpal/words";

/** Changes whenever the packet's wording or layout changes; printed on every page. */
export const PACKET_FORMAT = 2;

/**
 * PayPal's limits for one evidence upload: 10 MB a file, and the total for all files (50 MB as
 * documented; to be confirmed by the first real upload in 5g).
 */
export const PACKET_LIMITS = {
  maxFileBytes: MAX_EVIDENCE_FILE_BYTES,
  maxTotalBytes: 50 * 1024 * 1024,
};

/** The types PayPal takes as evidence files. */
const SENT_AS_IS = new Set(["application/pdf", "image/png", "image/jpeg", "image/gif"]);

/** A document that could go into the packet: the signed receipt or one of the deal's files. */
export interface ExhibitSource {
  /** "receipt", or the file's id. */
  id: string;
  kind: "receipt" | "deliverable" | "source";
  filename: string;
  mediaType: string;
  sizeBytes: number;
  sha256: string;
  addedBy: "seller" | "buyer" | "system";
  addedAt: Date;
  /** The payment stage a delivered file was sent for. */
  stage?: number;
}

/** Why a document is not in the packet. */
export type LeftOut = "unticked" | "type" | "too-large";

/** A document and how it goes to PayPal: as it is, a text file as a PDF, or not at all. */
export type ExhibitPlan = ExhibitSource &
  ({ send: "as-is" | "text-as-pdf" } | { send: "left-out"; reason: LeftOut });

const ORDER = { receipt: 0, deliverable: 1, source: 2 } as const;

/**
 * Which documents go into the packet and how, in the packet's order: the receipt, delivered
 * files by stage, then the deal's other files. PDF and pictures go as they are, plain text as a
 * PDF, anything else is left out, and so is a file over 10 MB or one the seller unticked. Pure.
 */
export function planExhibits(
  sources: readonly ExhibitSource[],
  leaveOut: ReadonlySet<string>,
): ExhibitPlan[] {
  return [...sources]
    .sort(
      (a, b) =>
        ORDER[a.kind] - ORDER[b.kind] ||
        (a.stage ?? 0) - (b.stage ?? 0) ||
        a.addedAt.getTime() - b.addedAt.getTime(),
    )
    .map((source): ExhibitPlan => {
      if (source.mediaType !== "text/plain" && !SENT_AS_IS.has(source.mediaType)) {
        return { ...source, send: "left-out", reason: "type" };
      }
      if (leaveOut.has(source.id)) return { ...source, send: "left-out", reason: "unticked" };
      if (source.sizeBytes > PACKET_LIMITS.maxFileBytes) {
        return { ...source, send: "left-out", reason: "too-large" };
      }
      return { ...source, send: source.mediaType === "text/plain" ? "text-as-pdf" : "as-is" };
    });
}

/** An included exhibit with the file PayPal would get: its name, type, bytes and fingerprint. */
export interface SentExhibit {
  plan: ExhibitPlan;
  number: number;
  filename: string;
  mediaType: string;
  bytes: Uint8Array;
  sha256: string;
}

const dateTime = (at: Date) =>
  `${at.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC`;

/** A text file as a PDF: a heading naming the exhibit, then its lines. Same text, same bytes. */
export async function textAsPdf(input: {
  number: number;
  filename: string;
  addedAt: Date;
  text: string;
}): Promise<Uint8Array> {
  const { bytes } = await renderPdf({
    title: `Exhibit ${String(input.number)}: ${input.filename}`,
    author: "PactPal",
    createdAt: input.addedAt,
    blocks: [
      {
        kind: "heading",
        text: `Exhibit ${String(input.number)}: ${input.filename}, text as added on ${dateTime(input.addedAt)}`,
      },
      { kind: "paragraph", text: input.text },
    ],
    footer: `PactPal evidence packet exhibit, format ${String(PACKET_FORMAT)}`,
    replacedCharactersNote:
      "Some characters could not be shown here; the exact text is the file with the fingerprint listed in the packet.",
  });
  return bytes;
}

/** The PDF file name an included text file is sent as. */
export const pdfNameOf = (filename: string) => `${filename.replace(/\.txt$/i, "")}.pdf`;

/** One file of an evidence upload: the packet PDF (exhibit null) or a numbered exhibit. */
export interface UploadFile {
  exhibit: number | null;
  name: string;
  bytes: number;
  sha256: string;
}

/** The packet PDF's name as PayPal gets it (and as it downloads). */
export const packetFilename = (disputeId: string) => `pactpal-packet-${disputeId}.pdf`;

/**
 * What one upload of a built packet sends, in order: the packet PDF, then each included exhibit
 * by number, with the name, size and fingerprint recorded when it was built. Pure.
 */
export function uploadFilesOf(packet: {
  disputeId: string;
  packetSha256: string;
  packetBytes: number;
  exhibits: readonly {
    filename: string;
    send: ExhibitPlan["send"];
    number?: number | undefined;
    sentSha256?: string | undefined;
    sentBytes?: number | undefined;
  }[];
}): UploadFile[] {
  const exhibits = packet.exhibits.flatMap((e) =>
    e.send === "left-out" ||
    e.number === undefined ||
    e.sentSha256 === undefined ||
    e.sentBytes === undefined
      ? []
      : [
          {
            exhibit: e.number,
            name: e.send === "text-as-pdf" ? pdfNameOf(e.filename) : e.filename,
            bytes: e.sentBytes,
            sha256: e.sentSha256,
          },
        ],
  );
  return [
    {
      exhibit: null,
      name: packetFilename(packet.disputeId),
      bytes: packet.packetBytes,
      sha256: packet.packetSha256,
    },
    ...exhibits.sort((a, b) => a.exhibit - b.exhibit),
  ];
}

/** Sizes against PayPal's limits; `packetBytes` is the packet PDF itself, once built. */
export function packetMeter(exhibits: readonly { bytes: number }[], packetBytes = 0) {
  const totalBytes = exhibits.reduce((sum, e) => sum + e.bytes, packetBytes);
  const largestBytes = Math.max(packetBytes, ...exhibits.map((e) => e.bytes));
  return {
    totalBytes,
    largestBytes,
    maxFileBytes: PACKET_LIMITS.maxFileBytes,
    maxTotalBytes: PACKET_LIMITS.maxTotalBytes,
    overTotal: totalBytes > PACKET_LIMITS.maxTotalBytes,
  };
}

export const ADDED_BY = { seller: "the seller", buyer: "the buyer", system: "PactPal" } as const;
const TYPE_WORDS: Record<string, string> = {
  "application/pdf": "PDF",
  "image/png": "PNG picture",
  "image/jpeg": "JPEG picture",
  "image/gif": "GIF picture",
  "image/webp": "WebP picture (PayPal does not take this type)",
  "text/plain": "text (sent as PDF)",
};

/**
 * What a document is, in words for the summary council: its kind (with the stage for delivered
 * work) and its type, so the models never guess from a file name. Pure.
 */
export function exhibitWhat(document: {
  kind: ExhibitSource["kind"];
  stage?: number | null;
  mediaType: string;
}): string {
  const type = TYPE_WORDS[document.mediaType] ?? document.mediaType;
  switch (document.kind) {
    case "receipt":
      return `the signed agreement with its fingerprints, made by PactPal; ${type}`;
    case "deliverable":
      return `delivered work${document.stage == null ? "" : ` for stage ${String(document.stage)}`}; ${type}`;
    case "source":
      return `a file added during the deal; ${type}`;
  }
}

/** How PactPal keeps records (section 6; wording approved by the owner, 5e). */
const HOW_RECORDS_ARE_KEPT =
  "PactPal records each step of a deal as it happens: what was agreed and signed, invoices and payments read from PayPal, deliveries, downloads and approvals. Each step is an entry in a log. Every entry holds the SHA-256 fingerprint of the entry before it, so changing, removing or back-dating any entry breaks every fingerprint after it. Every file is kept with its own SHA-256 fingerprint and size. Times are the PactPal server's time in UTC. IP addresses and browsers are recorded where shown. A typed name and an IP address are not proof of identity. This packet was produced by PactPal from that log; PactPal is a record-keeping tool and does not decide disputes. Sandbox demo: no real money moved.";

/** The statement template (section 7; approved by the owner, 5e). PactPal never fills it in. */
const STATEMENT_TEMPLATE = [
  "I, ____________________ (name), am the seller in this deal and kept these records using PactPal. The exhibits listed above are true copies of the files in the deal's record, as their fingerprints show. To the best of my knowledge, the timeline above reflects what happened.",
  "Signature: ____________________ Date: ____________",
];

/** How to check this packet (section 8; approved by the owner, 5e). */
const HOW_TO_CHECK = [
  "Compute the SHA-256 fingerprint of each exhibit file (for example, `shasum -a 256 <file>` on a Mac or `certutil -hashfile <file> SHA256` on Windows) and compare it with the table above.",
  'Ask the seller to open the deal in PactPal and press "Check this log": PactPal recomputes every entry\'s fingerprint and names the first one that does not match.',
  "The log's latest fingerprint above must match the one PactPal shows for this deal.",
];

/** What the packet is about; display names only, never email addresses. */
export interface PacketFacts {
  disputeId: string;
  reason: string | null;
  amount: string | null;
  stage: number | null;
  deal: { id: string; title: string };
  sellerName: string;
  buyerName: string;
  signedAt: Date | null;
  openedAt: Date;
  builtAt: Date;
  record: { lines: readonly RecordLine[]; cut: boolean };
  chain: { entries: number; head: string };
  /** The AI comparison and summary, only when the seller checked them and chose to include them (5f). */
  ai?: { comparison: readonly ComparisonRow[]; summary: readonly string[] };
}

/** The label on both AI sections (5f). */
const AI_LABEL = "Drafted with AI help from the record and checked by the seller before sending.";

/** The claim comparison and summary, when included: plain sections marked as AI-assisted. */
function aiBlocks(ai: NonNullable<PacketFacts["ai"]>): Block[] {
  return [
    { kind: "heading", text: "Claim against the record" },
    { kind: "paragraph", text: AI_LABEL, style: "small" },
    {
      kind: "table",
      columns: ["No.", "The buyer said", "What the record shows"],
      rows: ai.comparison.map((row) => [String(row.number), row.said, row.shows]),
    },
    { kind: "heading", text: "Summary" },
    { kind: "paragraph", text: AI_LABEL, style: "small" },
    { kind: "list", items: [...ai.summary] },
  ];
}

/**
 * The packet's content (format 1): cover, timeline from the evidence log, every included exhibit
 * with its fingerprints, the log's seal, how PactPal keeps records, the statement template and
 * how to check. Pure; AI text only when the seller included the checked comparison and summary.
 */
export function packetBlocks(facts: PacketFacts, exhibits: readonly SentExhibit[]): Block[] {
  const exhibitRows = exhibits.map((e) => [
    String(e.number),
    e.filename,
    ADDED_BY[e.plan.addedBy],
    TYPE_WORDS[e.plan.mediaType] ?? e.plan.mediaType,
    sizeWords(e.bytes.byteLength),
  ]);
  const fingerprints: Block[] = exhibits.flatMap((e): Block[] => [
    { kind: "code", label: `Exhibit ${String(e.number)} SHA-256`, value: e.sha256 },
    ...(e.plan.send === "text-as-pdf"
      ? [
          {
            kind: "code" as const,
            label: `Exhibit ${String(e.number)} original text SHA-256`,
            value: e.plan.sha256,
          },
        ]
      : []),
  ]);
  return [
    { kind: "title", text: "PactPal evidence packet" },
    { kind: "paragraph", text: "PayPal sandbox demo: no real money moves.", style: "small" },
    {
      kind: "fields",
      rows: [
        { label: "PayPal dispute", value: facts.disputeId },
        {
          label: "Reason",
          value: facts.reason === null ? "not given" : disputeReasonWords(facts.reason),
        },
        { label: "Amount", value: facts.amount ?? "not given" },
        { label: "Deal", value: `${facts.deal.title} (${facts.deal.id})` },
        { label: "Seller", value: facts.sellerName },
        { label: "Buyer", value: facts.buyerName },
        ...(facts.stage === null ? [] : [{ label: "Payment stage", value: String(facts.stage) }]),
        ...(facts.signedAt === null
          ? []
          : [{ label: "Agreement signed", value: dateTime(facts.signedAt) }]),
        { label: "Dispute opened", value: dateTime(facts.openedAt) },
        { label: "Packet built", value: dateTime(facts.builtAt) },
      ],
    },
    ...(facts.ai === undefined ? [] : aiBlocks(facts.ai)),
    { kind: "heading", text: "Timeline from the evidence log" },
    { kind: "list", items: facts.record.lines.map(({ text }) => text) },
    ...(facts.record.cut
      ? [
          {
            kind: "paragraph" as const,
            text: "The log is longer; only its first entries are shown here. The whole log can be checked in PactPal.",
            style: "small" as const,
          },
        ]
      : []),
    { kind: "heading", text: "Exhibits and fingerprints" },
    {
      kind: "table",
      columns: ["No.", "File", "Added by", "Type", "Size"],
      rows: exhibitRows,
    },
    ...fingerprints,
    { kind: "heading", text: "The record's seal" },
    {
      kind: "fields",
      rows: [
        { label: "Log entries", value: String(facts.chain.entries) },
        {
          label: "Checked",
          value: `Every fingerprint in the log was recomputed and matched on ${dateTime(facts.builtAt)}.`,
        },
      ],
    },
    { kind: "code", label: "Latest log entry SHA-256", value: facts.chain.head },
    { kind: "heading", text: "How PactPal keeps records" },
    { kind: "paragraph", text: HOW_RECORDS_ARE_KEPT },
    { kind: "heading", text: "Statement (a template; not signed by PactPal)" },
    ...STATEMENT_TEMPLATE.map((text): Block => ({ kind: "paragraph", text })),
    { kind: "heading", text: "How to check this packet" },
    { kind: "list", items: HOW_TO_CHECK, numbered: true },
  ];
}

/** The packet PDF: dated at the build time, so the same record and exhibits give the same bytes. */
export async function renderPacket(facts: PacketFacts, exhibits: readonly SentExhibit[]) {
  const { bytes } = await renderPdf({
    title: `Evidence packet: ${facts.disputeId}`,
    author: "PactPal",
    createdAt: facts.builtAt,
    // PactPal's look (9h), in black: PayPal's reviewers read it. Packets are stored once built.
    brand: { reference: `Evidence packet, PayPal case ${facts.disputeId}`, headings: "ink" },
    blocks: packetBlocks(facts, exhibits),
    footer: `PactPal evidence packet, format ${String(PACKET_FORMAT)}, dispute ${facts.disputeId}`,
    replacedCharactersNote:
      "Some characters could not be shown here; the exact text is in the deal's record.",
  });
  return { bytes, sha256: sha256Hex(bytes) };
}
