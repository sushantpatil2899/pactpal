import type { RecordEntry } from "@pactpal/claims";
import { describe, expect, it } from "vitest";
import { MAX_APPEAL_ITEMS, appealItems, type HeldDocument } from "./appeal-items.js";

const at = "2026-10-12T10:00:00.000Z";
const entry = (seq: number, type: string, payload: object = {}): RecordEntry => ({
  seq,
  type,
  actor: "buyer",
  serverTime: at,
  payload,
});
const doc = (id: string, sha: string, filename = `${id}.png`): HeldDocument => ({
  id,
  filename,
  sha256: sha.repeat(64),
  kind: "deliverable",
  stage: 1,
  mediaType: "image/png",
  addedBy: "seller",
});
const LEDGER = [
  entry(0, "DEAL_CREATED"),
  entry(4, "CHANGE_ORDER_DECLINED"),
  entry(7, "DISPUTE_OPENED", { disputeId: "PP-1" }),
  entry(8, "EVIDENCE_UPLOADED", { disputeId: "PP-1" }),
  entry(9, "MILESTONE_APPROVED", { stage: 3 }),
];

describe("what was not sent to PayPal before", () => {
  it("lists documents not sent (by fingerprint, or by name as PayPal lists it) and every entry when no packet went", () => {
    const { items, cut } = appealItems(
      [doc("a", "a"), doc("b", "b"), doc("c", "c", "chat.pdf")],
      LEDGER,
      { fileShas: new Set(["a".repeat(64)]), names: new Set(["chat.pdf"]), seal: undefined },
    );
    expect(cut).toBe(false);
    expect(items.map((item) => item.id)).toEqual(["D1", "E1", "E5", "E10"]);
    expect(items[0]?.words).toBe(
      "b.png (added by the seller; delivered work for stage 1; PNG picture)",
    );
  });

  it("lists only entries after the newest sent packet's timeline, never the dispute's own", () => {
    const { items } = appealItems([], LEDGER, { fileShas: new Set(), names: new Set(), seal: 5 });
    expect(items.map((item) => item.id)).toEqual(["E10"]);
    expect(
      appealItems([], LEDGER, { fileShas: new Set(), names: new Set(), seal: 10 }).items,
    ).toEqual([]);
  });

  it("cuts a long list and says so", () => {
    const many = Array.from({ length: MAX_APPEAL_ITEMS + 3 }, (_, i) => doc(`d${String(i)}`, "f"));
    const { items, cut } = appealItems(many, [], {
      fileShas: new Set(),
      names: new Set(),
      seal: 0,
    });
    expect(items).toHaveLength(MAX_APPEAL_ITEMS);
    expect(cut).toBe(true);
  });
});
