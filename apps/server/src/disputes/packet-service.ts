import {
  claimAnalysisSchema,
  comparisonRows,
  packetSummarySchema,
  recordLines,
} from "@pactpal/claims";
import {
  ArtifactIntegrityError,
  getArtifact,
  getClaimAnalysis,
  getLatestAcceptance,
  getUser,
  listArtifacts,
  listDeliveries,
  readLedger,
  recordPacket,
  type ActionFile,
  type ContentStore,
  type Database,
  type Deal,
  type EvidencePacket,
  type PacketExhibit,
  type StoredDispute,
} from "@pactpal/db";
import {
  canonicalJson,
  sha256Hex,
  verifyChain,
  verifyFile,
  type LedgerEntry,
} from "@pactpal/ledger";
import { ReceiptIntegrityError, buildReceipt } from "../acceptance/receipt.js";
import { addedByRole } from "../deals/file-routes.js";
import { nameOf } from "../deals/parties.js";
import { disputedAmountWords } from "./dispute-view.js";
import {
  packetMeter,
  pdfNameOf,
  planExhibits,
  renderPacket,
  textAsPdf,
  uploadFilesOf,
  type ExhibitPlan,
  type ExhibitSource,
  type SentExhibit,
} from "./packet.js";
import { recordEntries } from "./record-entries.js";

/** The packet cannot be built: the log failed its check, or the files are over PayPal's total. */
export class PacketBuildError extends Error {
  override readonly name = "PacketBuildError";
  constructor(readonly reason: "chain-broken" | "receipt-broken" | "over-limit" | "ai-not-ready") {
    super(`The packet was not built: ${reason}`);
  }
}

/** Where a deal's documents come from, read once per request. */
interface DealDocuments {
  ledger: LedgerEntry[];
  sources: ExhibitSource[];
  receipt: { bytes: Uint8Array } | undefined;
  signedAt: Date | null;
}

/** Every document that could go into the packet, with who added it and, for deliveries, the stage. */
async function documentsOf(db: Database, deal: Deal): Promise<DealDocuments> {
  const [ledger, files, deliveries, acceptance] = await Promise.all([
    readLedger(db, deal.id),
    listArtifacts(db, deal.id),
    listDeliveries(db, deal.id),
    getLatestAcceptance(db, deal.id),
  ]);
  const stageOf = new Map(
    deliveries.flatMap((d) => d.files.map((f) => [f.artifactId, d.stage] as const)),
  );
  const sources: ExhibitSource[] = files.map((file) => ({
    id: file.id,
    kind: file.kind,
    filename: file.filename,
    mediaType: file.mediaType,
    sizeBytes: file.sizeBytes,
    sha256: file.sha256,
    addedBy: addedByRole(file, deal),
    addedAt: file.createdAt,
    ...(stageOf.get(file.id) === undefined ? {} : { stage: stageOf.get(file.id) }),
  }));
  let receipt: { bytes: Uint8Array } | undefined;
  if (acceptance) {
    const built = await buildReceipt(
      acceptance,
      ledger.find((e) => e.seq === acceptance.ledgerSeq),
    ).catch((error: unknown) => {
      // A signed copy that no longer matches its log entry must stop the packet, never be skipped.
      throw error instanceof ReceiptIntegrityError ? new PacketBuildError("receipt-broken") : error;
    });
    receipt = { bytes: built.bytes };
    sources.push({
      id: "receipt",
      kind: "receipt",
      filename: built.filename,
      mediaType: "application/pdf",
      sizeBytes: built.bytes.byteLength,
      sha256: sha256Hex(built.bytes),
      addedBy: "system",
      addedAt: acceptance.createdAt,
    });
  }
  return { ledger, sources, receipt, signedAt: acceptance?.createdAt ?? null };
}

/**
 * The file PayPal would get for one included exhibit: the receipt, a stored file (its bytes
 * checked against its fingerprint first) or a text file turned into a PDF.
 */
async function sentFile(
  db: Database,
  store: ContentStore,
  deal: Deal,
  docs: DealDocuments,
  plan: ExhibitPlan,
  number: number,
): Promise<SentExhibit> {
  const bytes =
    plan.id === "receipt"
      ? (docs.receipt?.bytes ?? new Uint8Array())
      : (await getArtifact(db, store, plan.id, deal.id)).bytes;
  if (plan.send !== "text-as-pdf") {
    return {
      plan,
      number,
      filename: plan.filename,
      mediaType: plan.mediaType,
      bytes,
      sha256: sha256Hex(bytes),
    };
  }
  const pdf = await textAsPdf({
    number,
    filename: plan.filename,
    addedAt: plan.addedAt,
    text: new TextDecoder().decode(bytes),
  });
  return {
    plan,
    number,
    filename: pdfNameOf(plan.filename),
    mediaType: "application/pdf",
    bytes: pdf,
    sha256: sha256Hex(pdf),
  };
}

/** The included exhibits as PayPal would get them, numbered in the packet's order. */
async function sentExhibits(
  db: Database,
  store: ContentStore,
  deal: Deal,
  docs: DealDocuments,
  plans: readonly ExhibitPlan[],
): Promise<SentExhibit[]> {
  const included = plans.filter((plan) => plan.send !== "left-out");
  return Promise.all(included.map((plan, i) => sentFile(db, store, deal, docs, plan, i + 1)));
}

/**
 * The documents the seller can choose from, as the page lists them, and the sizes so far.
 * `pasted` holds the ids of buyer claims the seller pasted for this dispute: they are marked so
 * the page starts with them unticked, as they are the buyer's words, not evidence (5k-fix-3).
 */
export async function packetChoices(
  db: Database,
  store: ContentStore,
  deal: Deal,
  pasted: ReadonlySet<string> = new Set(),
) {
  const docs = await documentsOf(db, deal);
  const plans = planExhibits(docs.sources, new Set());
  const sent = await sentExhibits(db, store, deal, docs, plans);
  const sentBytes = new Map(sent.map((e) => [e.plan.id, e.bytes.byteLength]));
  return {
    exhibits: plans.map((plan) => ({
      id: plan.id,
      filename: plan.filename,
      sha256: plan.sha256,
      kind: plan.kind,
      stage: plan.stage ?? null,
      addedBy: plan.addedBy,
      mediaType: plan.mediaType,
      send: plan.send,
      reason: plan.send === "left-out" ? plan.reason : null,
      sentBytes: sentBytes.get(plan.id) ?? null,
      pastedClaim: pasted.has(plan.id),
    })),
    meter: packetMeter(sent.map((e) => ({ bytes: e.bytes.byteLength }))),
  };
}

/** One included exhibit made again from the deal's documents, if it still matches its record. */
async function rebuiltExhibit(
  db: Database,
  store: ContentStore,
  deal: Deal,
  docs: DealDocuments,
  recorded: PacketExhibit,
): Promise<SentExhibit | undefined> {
  if (recorded.number === undefined || recorded.send === "left-out") return undefined;
  const plan = planExhibits(docs.sources, new Set()).find((p) => p.id === recorded.id);
  if (!plan || plan.send === "left-out") return undefined;
  const number = recorded.number;
  const file = await sentFile(db, store, deal, docs, plan, number).catch((error: unknown) => {
    // A stored file whose bytes no longer match its own fingerprint is a changed file too.
    if (error instanceof ArtifactIntegrityError) return undefined;
    throw error;
  });
  return file?.sha256 === recorded.sentSha256 ? file : undefined;
}

/** One included exhibit of a built packet, made again and checked against what was recorded. */
export async function packetExhibitFile(
  db: Database,
  store: ContentStore,
  deal: Deal,
  recorded: PacketExhibit,
): Promise<SentExhibit | undefined> {
  return rebuiltExhibit(db, store, deal, await documentsOf(db, deal), recorded);
}

/** The stored packet PDF, if its bytes still match the fingerprint recorded when it was built. */
export async function storedPacketPdf(
  store: ContentStore,
  packet: Pick<EvidencePacket, "packetSha256" | "packetBytes">,
): Promise<Uint8Array | undefined> {
  const bytes = await store.get(packet.packetSha256);
  const fingerprint = {
    sha256: packet.packetSha256,
    size: packet.packetBytes,
    filename: "packet.pdf",
  };
  return bytes !== undefined && verifyFile(bytes, fingerprint) ? bytes : undefined;
}

/**
 * Every file one upload of a built packet sends (5g), with its bytes: the packet PDF, then each
 * included exhibit made again and checked against its recorded fingerprint. Undefined when any
 * file no longer matches, so nothing that changed is ever sent.
 */
export async function packetUploadFiles(
  db: Database,
  store: ContentStore,
  deal: Deal,
  packet: EvidencePacket,
): Promise<(ActionFile & { content: Uint8Array })[] | undefined> {
  const pdf = await storedPacketPdf(store, packet);
  if (!pdf) return undefined;
  const docs = await documentsOf(db, deal);
  const files: (ActionFile & { content: Uint8Array })[] = [];
  for (const listed of uploadFilesOf(packet)) {
    if (listed.exhibit === null) {
      files.push({ ...listed, mediaType: "application/pdf", content: pdf });
      continue;
    }
    const recorded = packet.exhibits.find((e) => e.number === listed.exhibit);
    const file = recorded && (await rebuiltExhibit(db, store, deal, docs, recorded));
    if (!file) return undefined;
    files.push({ ...listed, mediaType: file.mediaType, content: file.bytes });
  }
  return files;
}

/**
 * The checked AI comparison and summary as packet sections, with their fingerprints: read again
 * from the stored drafts through their schemas. Refused unless the summary is ready and based on
 * the ready comparison named (the database checks the pair again when recording).
 */
async function aiSections(
  db: Database,
  ids: { analysisId: string; summaryId: string },
  record: ReturnType<typeof recordLines>,
) {
  const [comparison, summary] = await Promise.all([
    getClaimAnalysis(db, ids.analysisId),
    getClaimAnalysis(db, ids.summaryId),
  ]);
  const analysis = claimAnalysisSchema.safeParse(comparison?.analysis);
  const drafted = packetSummarySchema.safeParse(summary?.analysis);
  if (!analysis.success || !drafted.success || summary?.basedOn !== ids.analysisId) {
    throw new PacketBuildError("ai-not-ready");
  }
  const recordText = new Map(record.lines.map(({ n, text }) => [n, text]));
  const entries = (numbers: readonly number[]) => numbers.map((n) => `#${String(n)}`).join(", ");
  return {
    sections: {
      comparison: comparisonRows(analysis.data, recordText),
      summary: drafted.data.summary.map(
        (s) =>
          `${s.text} (${s.record.length === 0 ? "no log entry" : `log entries ${entries(s.record)}`})`,
      ),
    },
    ai: {
      ...ids,
      analysisSha256: sha256Hex(canonicalJson(analysis.data)),
      summarySha256: sha256Hex(canonicalJson(drafted.data)),
    },
  };
}

/**
 * Builds and records a packet for one dispute: checks the whole log first (a broken chain stops
 * it), plans the exhibits without the ones the seller unticked, makes each file PayPal would get,
 * writes the packet PDF, checks PayPal's total and records it with `PACKET_BUILT`.
 */
export async function buildPacket(
  deps: { db: Database; store: ContentStore; clock: () => Date; newId: () => string },
  input: {
    deal: Deal;
    dispute: StoredDispute;
    sellerId: string;
    leaveOut: ReadonlySet<string>;
    /** The checked AI comparison and summary to put in the packet (5f), if the seller chose to. */
    includeAi?: { analysisId: string; summaryId: string };
  },
) {
  const { db, store, clock } = deps;
  const { deal, dispute } = input;
  const docs = await documentsOf(db, deal);
  const chain = verifyChain(docs.ledger);
  const head = docs.ledger.at(-1);
  if (!chain.valid || head === undefined) throw new PacketBuildError("chain-broken");
  const plans = planExhibits(docs.sources, input.leaveOut);
  const sent = await sentExhibits(db, store, deal, docs, plans);
  const [seller, buyer] = await Promise.all([
    getUser(db, deal.sellerId),
    deal.buyerId === undefined ? undefined : getUser(db, deal.buyerId),
  ]);
  const builtAt = clock();
  // The chain is checked on the log as stored; the record shows the chat's and notes' words (7m).
  const record = recordLines(await recordEntries(db, deal.id));
  const ai =
    input.includeAi === undefined ? undefined : await aiSections(db, input.includeAi, record);
  const packet = await renderPacket(
    {
      disputeId: dispute.disputeId,
      reason: dispute.reason,
      amount: disputedAmountWords(dispute),
      stage: dispute.stage,
      deal: { id: deal.id, title: deal.title },
      sellerName: nameOf(seller, "Seller"),
      buyerName: nameOf(buyer, "Buyer"),
      signedAt: docs.signedAt,
      openedAt: dispute.paypalCreatedAt ?? dispute.firstSeenAt,
      builtAt,
      record,
      chain: { entries: docs.ledger.length, head: head.entryHash },
      ...(ai === undefined ? {} : { ai: ai.sections }),
    },
    sent,
  );
  const meter = packetMeter(
    sent.map((e) => ({ bytes: e.bytes.byteLength })),
    packet.bytes.byteLength,
  );
  if (meter.overTotal) throw new PacketBuildError("over-limit");
  const sentById = new Map(sent.map((e) => [e.plan.id, e]));
  const exhibits: PacketExhibit[] = plans.map((plan) => {
    const file = sentById.get(plan.id);
    return {
      id: plan.id,
      filename: plan.filename,
      addedBy: plan.addedBy,
      sha256: plan.sha256,
      sizeBytes: plan.sizeBytes,
      send: plan.send,
      ...(plan.send === "left-out" ? { reason: plan.reason } : {}),
      ...(file === undefined
        ? {}
        : { number: file.number, sentSha256: file.sha256, sentBytes: file.bytes.byteLength }),
    };
  });
  return recordPacket(
    db,
    store,
    {
      id: deps.newId(),
      dealId: deal.id,
      disputeId: dispute.disputeId,
      sellerId: input.sellerId,
      packet: packet.bytes,
      packetSha256: packet.sha256,
      exhibits,
      totalBytes: meter.totalBytes,
      chainEntries: docs.ledger.length,
      chainHead: head.entryHash,
      ...(ai === undefined ? {} : { ai: ai.ai }),
    },
    builtAt,
  );
}
