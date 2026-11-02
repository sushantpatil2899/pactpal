import type { Deal, ScopeVersion } from "@pactpal/db";
import { describe, expect, it } from "vitest";
import { invoiceFor } from "./invoice-text.js";

const deal: Deal = {
  id: "00000000-0000-4000-8000-000000000100",
  sellerId: "00000000-0000-4000-8000-000000000001",
  buyerId: "00000000-0000-4000-8000-000000000002",
  title: "Food truck logo – Taco Rueda",
  kind: "service",
  category: "art-and-design",
  currency: "USD",
  status: "active",
  createdAt: new Date("2026-11-02T10:00:00Z"),
  updatedAt: new Date("2026-11-02T10:00:00Z"),
};

const scope: ScopeVersion = {
  dealId: deal.id,
  version: 1,
  content: {
    format: 1,
    summary: "A logo",
    deliverables: ["Logo"],
    exclusions: [],
    milestones: [
      { title: "Deposit", amountMinor: 15_000 },
      { title: "Final files", amountMinor: 15_000, dueDate: "2026-11-27" },
    ],
  },
  contentSha256: "7".repeat(64),
  createdBy: deal.sellerId,
  ledgerSeq: 2,
  createdAt: new Date("2026-11-02T10:00:00Z"),
};

const acceptance = { typedName: "Diego Ramos", createdAt: new Date("2026-11-02T18:30:00Z") };

describe("invoiceFor", () => {
  it("words the invoice as approved, from the signed record only", () => {
    expect(invoiceFor({ deal, scope, acceptance, stage: 1 })).toEqual({
      stage: 1,
      stageCount: 2,
      title: "Deposit",
      dueDate: null,
      amount: { minor: 15_000, currency: "USD", text: "150.00" },
      itemName: "Stage 1 of 2: Deposit",
      description: "Food truck logo – Taco Rueda",
      scopeReference: `"Food truck logo – Taco Rueda", version 1, signed by Diego Ramos on 2 Nov 2026. Fingerprint (SHA-256): ${"7".repeat(64)}. Record kept by PactPal, deal ${deal.id}.`,
      note: `Agreed scope: "Food truck logo – Taco Rueda", version 1, signed by Diego Ramos on 2 Nov 2026. Fingerprint (SHA-256): ${"7".repeat(64)}. Record kept by PactPal, deal ${deal.id}.`,
      requestId: `pp-${deal.id}-v1-s1`,
      invoiceSha256: expect.stringMatching(/^[0-9a-f]{64}$/) as unknown,
    });
  });

  it("gives each stage its own request id and fingerprint, the same every time", () => {
    const one = invoiceFor({ deal, scope, acceptance, stage: 1 });
    const two = invoiceFor({ deal, scope, acceptance, stage: 2 });
    expect(two).toMatchObject({ itemName: "Stage 2 of 2: Final files", dueDate: "2026-11-27" });
    expect(two?.requestId).not.toBe(one?.requestId);
    expect(two?.invoiceSha256).not.toBe(one?.invoiceSha256);
    expect(invoiceFor({ deal, scope, acceptance, stage: 1 })).toEqual(one);
    expect((one?.requestId.length ?? 99) < 64).toBe(true);
  });

  it("has no invoice for a stage that does not exist", () => {
    expect(invoiceFor({ deal, scope, acceptance, stage: 0 })).toBeUndefined();
    expect(invoiceFor({ deal, scope, acceptance, stage: 3 })).toBeUndefined();
  });
});
