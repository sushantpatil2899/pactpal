import type { LedgerEntry } from "@pactpal/ledger";
import { z } from "zod";
import type { ContentStore } from "./content-store.js";
import type { Database, Queryable } from "./database.js";
import { lockDeal } from "./deal-lock.js";
import { appendLedgerEvent } from "./ledger-store.js";

/** Most packets one dispute can have built, so a loop or a mistake cannot fill the database. */
export const MAX_PACKETS_PER_DISPUTE = 20;

/** Why a packet was not recorded. */
export type PacketRefusal =
  | "not-your-deal"
  | "not-this-deal"
  | "too-many"
  /** The AI comparison and summary named are not this dispute's ready pair. */
  | "ai-not-ready";

export class PacketNotAllowedError extends Error {
  override readonly name = "PacketNotAllowedError";
  constructor(readonly reason: PacketRefusal) {
    super(`The packet was not recorded: ${reason}`);
  }
}

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);

/** One document of a packet as recorded: what it is, how it goes to PayPal, or why it does not. */
export const packetExhibitSchema = z.object({
  id: z.string().min(1).max(100),
  filename: z.string().min(1).max(255),
  addedBy: z.enum(["seller", "buyer", "system"]),
  sha256,
  sizeBytes: z.number().int().min(0),
  send: z.enum(["as-is", "text-as-pdf", "left-out"]),
  reason: z.enum(["unticked", "type", "too-large"]).optional(),
  /** For an included exhibit: its number, and the file PayPal gets (a text file's PDF). */
  number: z.number().int().min(1).optional(),
  sentSha256: sha256.optional(),
  sentBytes: z.number().int().min(1).optional(),
});
export type PacketExhibit = z.output<typeof packetExhibitSchema>;

const packetRow = z
  .object({
    id: z.string(),
    deal_id: z.string(),
    dispute_id: z.string(),
    packet_sha256: z.string(),
    packet_bytes: z.number().int(),
    exhibits: z.array(packetExhibitSchema),
    total_bytes: z.number().int(),
    chain_entries: z.number().int(),
    chain_head: z.string(),
    built_by: z.string(),
    ledger_seq: z.number().int(),
    created_at: z.date(),
    analysis_id: z.string().nullable(),
    summary_id: z.string().nullable(),
  })
  .transform((row) => ({
    id: row.id,
    dealId: row.deal_id,
    disputeId: row.dispute_id,
    packetSha256: row.packet_sha256,
    packetBytes: row.packet_bytes,
    exhibits: row.exhibits,
    totalBytes: row.total_bytes,
    chainEntries: row.chain_entries,
    chainHead: row.chain_head,
    builtBy: row.built_by,
    ledgerSeq: row.ledger_seq,
    createdAt: row.created_at,
    analysisId: row.analysis_id ?? undefined,
    summaryId: row.summary_id ?? undefined,
  }));
/** A built evidence packet as recorded. */
export type EvidencePacket = z.output<typeof packetRow>;

const newPacketSchema = z.object({
  id: z.uuid(),
  dealId: z.uuid(),
  disputeId: z.string().min(1).max(100),
  sellerId: z.uuid(),
  packet: z.custom<Uint8Array>((value) => value instanceof Uint8Array),
  packetSha256: sha256,
  exhibits: z.array(packetExhibitSchema).max(100),
  totalBytes: z.number().int().min(1),
  chainEntries: z.number().int().min(1),
  chainHead: sha256,
  /** The AI comparison and summary the seller checked and put in the packet (5f), if any. */
  ai: z
    .object({
      analysisId: z.uuid(),
      summaryId: z.uuid(),
      analysisSha256: sha256,
      summarySha256: sha256,
    })
    .optional(),
});
export type NewPacket = z.input<typeof newPacketSchema>;

/**
 * Records a built packet: stores the packet PDF's bytes by fingerprint, then, with the deal row
 * locked, checks the seller, that the dispute is this deal's and the per-dispute limit, and writes
 * `PACKET_BUILT` (by the seller: ids, fingerprints, sizes and the seal; no file contents) and the
 * row in one transaction.
 */
export async function recordPacket(
  db: Database,
  store: ContentStore,
  input: NewPacket,
  now: Date,
): Promise<{ packet: EvidencePacket; entry: LedgerEntry }> {
  const built = newPacketSchema.parse(input);
  await store.put(built.packetSha256, built.packet);
  return db.transaction(async (tx) => {
    const deal = await lockDeal(tx, built.dealId);
    if (deal.seller_id !== built.sellerId) throw new PacketNotAllowedError("not-your-deal");
    const owner = await tx.query("SELECT deal_id FROM disputes WHERE dispute_id = $1", [
      built.disputeId,
    ]);
    if (owner[0]?.deal_id !== built.dealId) throw new PacketNotAllowedError("not-this-deal");
    const count = z.coerce
      .number()
      .int()
      .parse(
        (
          await tx.query("SELECT count(*) AS n FROM evidence_packets WHERE dispute_id = $1", [
            built.disputeId,
          ])
        )[0]?.n,
      );
    if (count >= MAX_PACKETS_PER_DISPUTE) throw new PacketNotAllowedError("too-many");
    if (built.ai) {
      // The summary must be ready and based on the ready comparison named, both of this dispute.
      const pair = await tx.query(
        `SELECT 1 FROM claim_analyses s JOIN claim_analyses c ON c.id = s.based_on
          WHERE s.id = $1 AND s.kind = 'summary' AND s.status = 'ready'
            AND c.id = $2 AND c.kind = 'claim' AND c.status = 'ready' AND c.dispute_id = $3`,
        [built.ai.summaryId, built.ai.analysisId, built.disputeId],
      );
      if (pair.length === 0) throw new PacketNotAllowedError("ai-not-ready");
    }
    const included = built.exhibits.filter((e) => e.send !== "left-out");
    const entry = await appendLedgerEvent(
      tx,
      {
        dealId: built.dealId,
        type: "PACKET_BUILT",
        actor: "seller",
        actorId: built.sellerId,
        payload: {
          packetId: built.id,
          disputeId: built.disputeId,
          packetSha256: built.packetSha256,
          packetBytes: built.packet.byteLength,
          exhibits: included.map((e) => ({
            id: e.id,
            sha256: e.sha256,
            sentSha256: e.sentSha256 ?? null,
          })),
          leftOut: built.exhibits.length - included.length,
          totalBytes: built.totalBytes,
          chainEntries: built.chainEntries,
          chainHead: built.chainHead,
          ...(built.ai ? { ai: built.ai } : {}),
        },
      },
      now,
    );
    const rows = await tx.query(
      `INSERT INTO evidence_packets (id, deal_id, dispute_id, packet_sha256, packet_bytes, exhibits,
                                     total_bytes, chain_entries, chain_head, built_by, ledger_seq,
                                     created_at, analysis_id, summary_id)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        built.id,
        built.dealId,
        built.disputeId,
        built.packetSha256,
        built.packet.byteLength,
        JSON.stringify(built.exhibits),
        built.totalBytes,
        built.chainEntries,
        built.chainHead,
        built.sellerId,
        entry.seq,
        now,
        built.ai?.analysisId ?? null,
        built.ai?.summaryId ?? null,
      ],
    );
    return { packet: packetRow.parse(rows[0]), entry };
  });
}

/** A dispute's packets, newest first. */
export async function listPackets(q: Queryable, disputeId: string): Promise<EvidencePacket[]> {
  const rows = await q.query(
    "SELECT * FROM evidence_packets WHERE dispute_id = $1 ORDER BY created_at DESC, id DESC",
    [disputeId],
  );
  return rows.map((row) => packetRow.parse(row));
}

/** One packet, or undefined. */
export async function getPacket(q: Queryable, id: string): Promise<EvidencePacket | undefined> {
  const rows = await q.query("SELECT * FROM evidence_packets WHERE id = $1", [id]);
  return rows[0] === undefined ? undefined : packetRow.parse(rows[0]);
}
