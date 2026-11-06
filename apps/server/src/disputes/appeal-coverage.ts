import { appealCheckSchema } from "@pactpal/claims";
import {
  listClaimAnalyses,
  type ContentStore,
  type Database,
  type Deal,
  type PacketExhibit,
} from "@pactpal/db";
import { docItemId } from "./appeal-items.js";
import { packetChoices } from "./packet-service.js";

/**
 * Which of the items an appeal relies on a packet leaves out (5i-2): a document (`D` + the start
 * of its fingerprint) must be among the packet's included exhibits, and a log entry (`E` + its
 * number) inside the packet's timeline (its seal). Returns the missing ids, in order. Pure.
 */
export function missingFromPacket(
  itemIds: readonly string[],
  packet: { chainEntries: number; exhibits: readonly PacketExhibit[] },
): string[] {
  const included = new Set(
    packet.exhibits.flatMap((e) => (e.number === undefined ? [] : [docItemId(e.sha256)])),
  );
  return itemIds.filter((id) => {
    const entry = /^E(\d+)$/.exec(id);
    // Entry #n is seq n - 1; the packet's timeline holds seqs 0 to chainEntries - 1.
    if (entry) return Number(entry[1]) > packet.chainEntries;
    return !included.has(id);
  });
}

/**
 * For the appeal send (5i-2): the items the newest ready appeal check found speaking to the claim,
 * and which of them `packet` leaves out, in words ("log entry #19", a file's name). Undefined
 * when there is no ready check that found anything.
 */
export async function appealGaps(
  db: Database,
  store: ContentStore,
  deal: Deal,
  disputeId: string,
  packet: { chainEntries: number; exhibits: readonly PacketExhibit[] },
): Promise<{ relied: string[]; missing: string[] } | undefined> {
  const checks = await listClaimAnalyses(db, disputeId, "appeal");
  const parsed = appealCheckSchema.safeParse(checks.find((c) => c.status === "ready")?.analysis);
  const relied = parsed.success
    ? parsed.data.items.filter((item) => item.answers).map((item) => item.id)
    : [];
  if (relied.length === 0) return undefined;
  const names = new Map(
    (await packetChoices(db, store, deal)).exhibits.map((e) => [docItemId(e.sha256), e.filename]),
  );
  const words = (id: string) => {
    const entry = /^E(\d+)$/.exec(id);
    return entry ? `log entry #${entry[1] ?? ""}` : (names.get(id) ?? id);
  };
  return { relied, missing: missingFromPacket(relied, packet).map(words) };
}
