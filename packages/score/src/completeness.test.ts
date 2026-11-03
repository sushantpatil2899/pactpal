import type { EventType, JsonValue, LedgerEntry } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import { completenessScore, type Completeness, type ScoredAgreement } from "./completeness.js";

const BUYER_EMAIL = "a".repeat(64);
const OTHER_EMAIL = "b".repeat(64);
const FILE = "c".repeat(64);

let seq = 0;
const entry = (type: EventType, payload: JsonValue): LedgerEntry => ({
  dealId: "00000000-0000-4000-8000-000000000100",
  seq: seq++,
  type,
  actor: "system",
  payload,
  payloadHash: "0".repeat(64),
  prevHash: "0".repeat(64),
  entryHash: "0".repeat(64),
  serverTime: "2026-11-03T10:00:00.000Z",
});

const signed: ScoredAgreement = { version: 1, stages: 2, exclusions: 1, signed: true };

/** The log entries of one stage delivered, emailed, downloaded and approved. */
const stageDone = (stage: number, id: string, version = 1): LedgerEntry[] => [
  entry("INVOICE_SENT", { version, stage, recipientEmailSha256: BUYER_EMAIL }),
  entry("PAYMENT_RECEIVED", { version, stage }),
  entry("DELIVERY_SENT", { deliveryId: id, version, stage }),
  entry("DELIVERY_EMAILED", { deliveryId: id, emailSha256: BUYER_EMAIL }),
  entry("DELIVERY_DOWNLOADED", { deliveryId: id, sha256: FILE }),
  entry("MILESTONE_APPROVED", { deliveryId: id, version, stage }),
];
const agreed = (version = 1): LedgerEntry[] => [
  entry("SCOPE_CONFIRMED", { version }),
  entry("ACCEPTED", { version }),
  entry("RECEIPT_SENT", { version, to: "seller" }),
  entry("RECEIPT_SENT", { version, to: "buyer" }),
];

const byId = (result: Completeness) => Object.fromEntries(result.items.map((i) => [i.id, i]));

describe("evidence completeness score", () => {
  it("gives every measured point to a fully recorded deal, and lists the unmeasured ones", () => {
    const result = completenessScore({
      entries: [...agreed(), ...stageDone(1, "d1"), ...stageDone(2, "d2")],
      agreement: signed,
    });
    expect(result.score).toBe(81);
    expect(result.measurable).toBe(81);
    expect(result.items.reduce((sum, i) => sum + i.points, 0)).toBe(100);
    expect(result.items.filter((i) => i.status === "missing")).toEqual([]);
    expect(result.items.filter((i) => i.status === "not-measured").map((i) => i.points)).toEqual([
      12, 3, 4,
    ]);
    expect(byId(result).approvals).toMatchObject({ earned: 12, detail: "2 of 2 stages" });
  });

  it("earns stage items in proportion, rounded down, and names the missing stages", () => {
    const three = { ...signed, stages: 3 };
    const result = completenessScore({
      entries: [...agreed(), ...stageDone(1, "d1")],
      agreement: three,
    });
    const items = byId(result);
    expect(items.approvals).toMatchObject({
      earned: 4,
      status: "missing",
      detail: "1 of 3 stages",
      fix: "Ask the buyer to approve the delivery for stages 2 and 3.",
    });
    expect(items.payment?.earned).toBe(3);
    expect(items["delivery-access"]?.fix).toBe(
      "Ask the buyer to download the delivery for stages 2 and 3.",
    );
    expect(result.score).toBe(10 + 8 + 15 + 3 + 3 + 4 + 4 + 4);
  });

  it("matches the Maya story: the final delivery downloaded but not approved", () => {
    const entries = [...agreed(), ...stageDone(1, "d1"), ...stageDone(2, "d2")].filter(
      (e) => !(e.type === "MILESTONE_APPROVED" && JSON.stringify(e.payload).includes('"d2"')),
    );
    const result = completenessScore({ entries, agreement: signed });
    expect(result.score).toBe(75);
    expect(byId(result).approvals?.fix).toBe("Ask the buyer to approve the delivery for stage 2.");
  });

  it("scores a draft before signing from its newest version, with fixes that still apply", () => {
    const draft = { version: 2, stages: 2, exclusions: 0, signed: false };
    const result = completenessScore({
      entries: [entry("SCOPE_CONFIRMED", { version: 1 })],
      agreement: draft,
    });
    const items = byId(result);
    expect(items["scope-citations"]).toMatchObject({
      earned: 0,
      fix: "Draft the agreed work from the chat and confirm it before sending it for signature.",
    });
    expect(items.exclusions?.fix).toBe(
      "List what the price does not include before sending it for signature.",
    );
    expect(items.acceptance).toMatchObject({
      earned: 0,
      fix: "Send the agreed work to the buyer to sign.",
    });
    expect(items.approvals?.fix).toBe("Ask the buyer to approve the delivery for stages 1 and 2.");
    expect(result.score).toBe(0);
  });

  it("says a signed agreement's terms cannot change, and asks for a missing receipt", () => {
    const result = completenessScore({
      entries: [
        entry("ACCEPTED", { version: 1 }),
        entry("RECEIPT_SENT", { version: 1, to: "seller" }),
      ],
      agreement: { ...signed, exclusions: 0 },
    });
    const items = byId(result);
    expect(items["scope-citations"]?.fix).toContain("only a new signed version");
    expect(items.exclusions?.fix).toContain("only a new signed version");
    expect(items.acceptance).toMatchObject({
      earned: 10,
      status: "missing",
      fix: "Email the receipt again from the Agreement section.",
    });
  });

  it("scores nothing before the first version, and counts one stage in the singular", () => {
    const none = completenessScore({ entries: [entry("DEAL_CREATED", {})], agreement: undefined });
    expect(none.score).toBe(0);
    expect(byId(none).approvals).toMatchObject({
      detail: "no payment stages yet",
      fix: "Save the agreed work first.",
    });
    expect(byId(none).exclusions?.fix).toBe("Save the agreed work first.");
    const one = completenessScore({
      entries: stageDone(1, "d1"),
      agreement: { ...signed, stages: 1 },
    });
    expect(byId(one).approvals?.detail).toBe("1 of 1 stage");
  });

  it("checks the invoice and delivery emails went to the same address", () => {
    const differ = completenessScore({
      entries: [
        ...stageDone(1, "d1"),
        entry("INVOICE_SENT", { version: 1, stage: 2, recipientEmailSha256: OTHER_EMAIL }),
      ],
      agreement: signed,
    });
    expect(byId(differ)["email-match"]).toMatchObject({
      earned: 0,
      fix: "Send invoices and deliveries to the same buyer email.",
    });
    const noDelivery = completenessScore({
      entries: [entry("INVOICE_SENT", { version: 1, stage: 1, recipientEmailSha256: BUYER_EMAIL })],
      agreement: signed,
    });
    expect(byId(noDelivery)["email-match"]?.detail).toBe(
      "needs an invoice and an emailed delivery",
    );
  });

  it("ignores other versions, unknown stages, unknown deliveries and odd payloads", () => {
    const result = completenessScore({
      entries: [
        ...agreed(2),
        ...stageDone(1, "old", 2),
        entry("MILESTONE_APPROVED", { version: 1, stage: 9 }),
        entry("DELIVERY_DOWNLOADED", { deliveryId: "unknown", sha256: FILE }),
        entry("DELIVERY_SENT", { deliveryId: "d9", version: 1, stage: 1 }),
        entry("DELIVERY_DOWNLOADED", { deliveryId: "d9" }),
        entry("DELIVERY_EMAILED", { deliveryId: "d9" }),
        entry("PAYMENT_RECEIVED", ["not", "an", "object"]),
        entry("NOTE_ADDED", null),
      ],
      agreement: signed,
    });
    const items = byId(result);
    expect(items.approvals?.earned).toBe(0);
    expect(items["delivery-access"]?.earned).toBe(0);
    expect(items["delivery-emailed"]?.earned).toBe(5);
    expect(items["email-match"]?.earned).toBe(0);
    expect(items.acceptance?.earned).toBe(0);
  });
});
