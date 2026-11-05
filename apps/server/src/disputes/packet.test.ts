import { describe, expect, it } from "vitest";
import {
  PACKET_LIMITS,
  packetBlocks,
  packetMeter,
  pdfNameOf,
  planExhibits,
  renderPacket,
  textAsPdf,
  type ExhibitSource,
  type PacketFacts,
  type SentExhibit,
} from "./packet.js";

const at = (day: number) => new Date(`2026-11-${String(day).padStart(2, "0")}T10:00:00.000Z`);
const source = (overrides: Partial<ExhibitSource>): ExhibitSource => ({
  id: "f1",
  kind: "source",
  filename: "chat.txt",
  mediaType: "text/plain",
  sizeBytes: 100,
  sha256: "a".repeat(64),
  addedBy: "seller",
  addedAt: at(3),
  ...overrides,
});

const SOURCES = [
  source({ id: "chat", addedAt: at(2) }),
  source({
    id: "ref",
    filename: "ref.png",
    mediaType: "image/png",
    addedBy: "buyer",
    addedAt: at(4),
  }),
  source({ id: "zip", filename: "files.zip", mediaType: "application/octet-stream" }),
  source({
    id: "final",
    kind: "deliverable",
    filename: "final.png",
    mediaType: "image/png",
    stage: 2,
  }),
  source({
    id: "sketch",
    kind: "deliverable",
    filename: "sketch.png",
    mediaType: "image/png",
    stage: 1,
  }),
  source({
    id: "huge",
    kind: "deliverable",
    filename: "huge.pdf",
    mediaType: "application/pdf",
    sizeBytes: PACKET_LIMITS.maxFileBytes + 1,
    stage: 2,
  }),
  source({
    id: "receipt",
    kind: "receipt",
    filename: "pactpal-receipt-v1.pdf",
    mediaType: "application/pdf",
    addedBy: "system",
  }),
];

const FACTS: PacketFacts = {
  disputeId: "PP-D-EXAMPLE",
  reason: "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED",
  amount: "120.00 USD",
  stage: 2,
  deal: { id: "deal-1", title: "Character illustration" },
  sellerName: "Maya",
  buyerName: "Chris",
  signedAt: at(3),
  openedAt: at(17),
  builtAt: at(18),
  record: {
    lines: [{ n: 18, text: "#18 8 Nov 2026 14:05 UTC, buyer: approved a delivery (stage 1)" }],
    cut: true,
  },
  chain: { entries: 25, head: "f".repeat(64) },
};

describe("planExhibits", () => {
  it("orders the receipt, deliveries by stage, then other files, and says how each goes", () => {
    const plans = planExhibits(SOURCES, new Set(["ref"]));
    expect(plans.map((p) => [p.id, p.send, p.send === "left-out" ? p.reason : null])).toEqual([
      ["receipt", "as-is", null],
      ["sketch", "as-is", null],
      ["final", "as-is", null],
      ["huge", "left-out", "too-large"],
      ["chat", "text-as-pdf", null],
      ["zip", "left-out", "type"],
      ["ref", "left-out", "unticked"],
    ]);
  });
});

describe("the packet", () => {
  const sent = (id: string, number: number, bytes = 1000): SentExhibit => {
    const plan = planExhibits(SOURCES, new Set()).find((p) => p.id === id);
    if (!plan) throw new Error(id);
    return {
      plan,
      number,
      filename: plan.send === "text-as-pdf" ? pdfNameOf(plan.filename) : plan.filename,
      mediaType: "application/pdf",
      bytes: new Uint8Array(bytes),
      sha256: "e".repeat(64),
    };
  };

  it("holds the cover, timeline, exhibits, seal and the approved texts, and no AI words", () => {
    const blocks = packetBlocks(FACTS, [sent("receipt", 1), sent("chat", 2)]);
    const text = JSON.stringify(blocks);
    for (const words of [
      "PactPal evidence packet",
      "PP-D-EXAMPLE",
      "not as described",
      "Timeline from the evidence log",
      "approved a delivery",
      "only its first entries are shown",
      "Exhibit 2 original text SHA-256",
      "chat.pdf",
      "The record's seal",
      "f".repeat(64),
      "PactPal is a record-keeping tool and does not decide disputes.",
      "Statement (a template; not signed by PactPal)",
      "Signature: ____________________ Date: ____________",
      "How to check this packet",
    ]) {
      expect(text).toContain(words);
    }
    expect(text).not.toMatch(/legally binding|you will win|guarantee/i);
  });

  it("gives the same bytes for the same record, and turns text into a PDF the same way", async () => {
    const exhibits = [sent("receipt", 1)];
    const one = await renderPacket(FACTS, exhibits);
    const two = await renderPacket(FACTS, exhibits);
    expect(one.sha256).toBe(two.sha256);
    expect(new TextDecoder().decode(one.bytes.slice(0, 5))).toBe("%PDF-");
    const text = {
      number: 2,
      filename: "chat.txt",
      addedAt: at(2),
      text: "Maya: hi\nChris: hello",
    };
    expect(await textAsPdf(text)).toEqual(await textAsPdf(text));
    expect(pdfNameOf("Chat.TXT")).toBe("Chat.pdf");
  });

  it("measures each file and the total against PayPal's limits", () => {
    const meter = packetMeter([{ bytes: 3_000_000 }, { bytes: 1_000_000 }], 200_000);
    expect(meter).toMatchObject({
      totalBytes: 4_200_000,
      largestBytes: 3_000_000,
      overTotal: false,
    });
    expect(packetMeter([{ bytes: PACKET_LIMITS.maxTotalBytes }], 1).overTotal).toBe(true);
    expect(packetMeter([]).totalBytes).toBe(0);
  });
});
