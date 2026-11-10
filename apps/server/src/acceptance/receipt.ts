import type { Acceptance } from "@pactpal/db";
import type { LedgerEntry } from "@pactpal/ledger";
import { renderPdf, type Block } from "@pactpal/pdf";
import { listingLines, listingSource, dayWords, markedLine, stepLine } from "@pactpal/words";
import { z } from "zod";
import { acceptanceDocumentSchema, type AcceptanceDocument } from "./document.js";

/** Changes whenever the receipt's wording or layout changes; printed on every page. */
export const RECEIPT_FORMAT = 1;

/** The signed copy and its log entry do not agree, so no receipt is made from them. */
export class ReceiptIntegrityError extends Error {
  override readonly name = "ReceiptIntegrityError";
}

const acceptedPayload = z.object({
  documentSha256: z.string(),
  typedName: z.string(),
  access: z.enum(["link", "paypal"]),
});

const dateTime = (at: Date) =>
  `${at.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC`;
const day = dayWords;

const REACHED = { link: "by private link", paypal: "signed in with PayPal" } as const;

/**
 * The receipt's content (format 1, wording approved by the owner), from the signed copy only:
 * never from today's deal or agreed work, which may have changed since.
 */
export function receiptBlocks(
  document: AcceptanceDocument,
  signed: {
    typedName: string;
    at: Date;
    access: "link" | "paypal";
    documentSha256: string;
    entry: LedgerEntry;
  },
): Block[] {
  const { terms, notice } = document;
  const version = String(terms.version);
  // The deal page numbers log entries from 1; the stored position (seq) counts from 0.
  const entryNumber = String(signed.entry.seq + 1);
  const extras = [
    ...(terms.revisionsIncluded === null
      ? []
      : [{ label: "Revisions included", value: String(terms.revisionsIncluded) }]),
    ...(terms.dueDate === null ? [] : [{ label: "Due date", value: day(terms.dueDate) }]),
  ];
  return [
    { kind: "title", text: "PactPal agreement receipt" },
    { kind: "paragraph", text: "PayPal sandbox demo: no real money moves.", style: "small" },
    { kind: "heading", text: "The deal" },
    {
      kind: "fields",
      rows: [
        { label: "Title", value: document.title },
        { label: "Category", value: document.category },
        { label: "Deal id", value: document.dealId },
        { label: "Seller", value: document.sellerName },
        { label: "Signed by", value: signed.typedName },
        { label: "Signed at", value: dateTime(signed.at) },
        { label: "Reached the page", value: REACHED[signed.access] },
      ],
    },
    { kind: "heading", text: `What was agreed (version ${version})` },
    { kind: "paragraph", text: terms.summary },
    { kind: "paragraph", text: "What will be delivered", style: "bold" },
    {
      kind: "list",
      items: terms.deliverables.map((line, n) =>
        markedLine(line, terms.deliverableKinds?.[n], terms.milestones),
      ),
    },
    ...(terms.exclusions.length === 0
      ? []
      : ([
          { kind: "paragraph", text: "Not included", style: "bold" },
          { kind: "list", items: terms.exclusions },
        ] satisfies Block[])),
    ...(terms.buyerProvides === undefined || terms.buyerProvides.length === 0
      ? []
      : ([
          { kind: "paragraph", text: "The buyer provides", style: "bold" },
          {
            kind: "list",
            items: terms.buyerProvides.map((item) =>
              item.dueDate === null ? item.text : `${item.text} (by ${day(item.dueDate)})`,
            ),
          },
        ] satisfies Block[])),
    ...(terms.timeline === undefined
      ? []
      : ([
          { kind: "paragraph", text: "Timeline (in this order)", style: "bold" },
          { kind: "list", items: terms.timeline.map((step) => stepLine(step, terms.currency)) },
        ] satisfies Block[])),
    ...(terms.listing === undefined
      ? []
      : ([
          {
            kind: "paragraph",
            text: `What is being sold, as listed on ${listingSource(terms.listing)}`,
            style: "bold",
          },
          { kind: "list", items: listingLines(terms.listing) },
          {
            kind: "paragraph",
            text: `Listing page: ${terms.listing.url}. Photos kept as the deal's files: ${terms.listing.photos.map((p) => p.filename).join(", ") || "none"}.`,
          },
        ] satisfies Block[])),
    ...(extras.length === 0 ? [] : [{ kind: "fields", rows: extras } satisfies Block]),
    {
      kind: "table",
      columns: ["Payment stage", `Amount (${terms.currency})`, "Due"],
      rows: terms.milestones.map((stage) => [
        stage.title,
        stage.amount.text,
        stage.dueDate === null ? "" : day(stage.dueDate),
      ]),
      footer: ["Total", terms.total.text, ""],
    },
    { kind: "heading", text: `Notice shown before signing (version ${String(notice.version)})` },
    { kind: "paragraph", text: notice.title, style: "bold" },
    { kind: "list", items: notice.lines },
    { kind: "heading", text: "Fingerprints (SHA-256)" },
    { kind: "code", label: `Agreed work, version ${version}`, value: terms.contentSha256 },
    { kind: "code", label: "Signed page", value: signed.documentSha256 },
    {
      kind: "code",
      label: `Evidence log entry ${entryNumber} (buyer signed)`,
      value: signed.entry.entryHash,
    },
    { kind: "heading", text: "How to check this receipt" },
    {
      kind: "list",
      numbered: true,
      items: [
        'Open the deal in PactPal and press "Check this log": it recomputes every fingerprint in the evidence log.',
        `The signed-page fingerprint is the SHA-256 of the signed page's content, which PactPal keeps unchanged; the same fingerprint is in log entry ${entryNumber}.`,
        "Compare the fingerprints above with the ones shown in the deal; if any differ, the record has changed.",
      ],
    },
    {
      kind: "paragraph",
      style: "small",
      text: "The buyer's IP address and browser are kept in the evidence log. A typed name and an IP address are not proof of identity. PactPal records what was agreed; it is not legal advice and does not guarantee any dispute outcome.",
    },
  ];
}

/**
 * The receipt PDF for a signed acceptance, after checking that the stored copy is a format 1
 * document and that its `ACCEPTED` (or, for a change order, `CHANGE_ORDER_ACCEPTED`) log entry
 * names the same fingerprint, typed name and time.
 * The same acceptance always gives the same bytes (the file is dated at the signing time).
 */
export async function buildReceipt(acceptance: Acceptance, entry: LedgerEntry | undefined) {
  const document = acceptanceDocumentSchema.safeParse(acceptance.document);
  const payload = acceptedPayload.safeParse(entry?.payload);
  if (
    !document.success ||
    (entry?.type !== "ACCEPTED" && entry?.type !== "CHANGE_ORDER_ACCEPTED") ||
    !payload.success ||
    // The log entry is protected by the chain; the stored row must say exactly what it says.
    payload.data.documentSha256 !== acceptance.documentSha256 ||
    payload.data.typedName !== acceptance.typedName ||
    entry.serverTime !== acceptance.createdAt.toISOString()
  ) {
    throw new ReceiptIntegrityError(
      `Deal ${acceptance.dealId}: the signed copy of version ${String(acceptance.version)} does not match its log entry`,
    );
  }
  const { bytes } = await renderPdf({
    title: `Agreement receipt: ${document.data.title}`,
    author: "PactPal",
    createdAt: acceptance.createdAt,
    blocks: receiptBlocks(document.data, {
      typedName: acceptance.typedName,
      at: acceptance.createdAt,
      access: payload.data.access,
      documentSha256: acceptance.documentSha256,
      entry,
    }),
    footer: `PactPal agreement receipt, format ${String(RECEIPT_FORMAT)}`,
    replacedCharactersNote:
      "Some characters could not be shown here; the exact text is in the signed record.",
  });
  return {
    bytes,
    filename: `pactpal-receipt-v${String(acceptance.version)}.pdf`,
    /** The signed page the receipt was made from, already checked. */
    document: document.data,
  };
}
