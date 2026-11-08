import { documentFingerprint, type Acceptance } from "@pactpal/db";
import type { LedgerEntry } from "@pactpal/ledger";
import { pdfTextLines } from "@pactpal/pdf/testing";
import { describe, expect, it } from "vitest";
import { ACCEPTANCE_NOTICE, type AcceptanceDocument } from "./document.js";
import { ReceiptIntegrityError, buildReceipt } from "./receipt.js";

const SIGNED_AT = new Date("2026-11-01T22:06:00.000Z");

const document: AcceptanceDocument = {
  format: 1,
  dealId: "00000000-0000-4000-8000-000000000100",
  title: "Character illustration",
  category: "Art and design commission",
  sellerName: "Maya",
  terms: {
    version: 2,
    contentSha256: "c".repeat(64),
    currency: "USD",
    summary: "A character for a game store page",
    deliverables: ["Full-body character, transparent PNG"],
    exclusions: ["Merchandise use"],
    revisionsIncluded: 2,
    dueDate: "2026-11-20",
    milestones: [
      { title: "Sketch", amount: { minor: 12_000, text: "120.00" }, dueDate: null },
      { title: "Final file", amount: { minor: 12_000, text: "120.00" }, dueDate: "2026-11-20" },
    ],
    total: { minor: 24_000, text: "240.00" },
  },
  notice: { ...ACCEPTANCE_NOTICE, lines: [...ACCEPTANCE_NOTICE.lines] },
};

/** A signed acceptance of `doc` and its ACCEPTED entry; override either to break a rule. */
function signed(doc: unknown = document, entry: Partial<LedgerEntry> = {}) {
  const documentSha256 = documentFingerprint(doc as AcceptanceDocument);
  const acceptance: Acceptance = {
    dealId: document.dealId,
    version: 2,
    document: doc as Acceptance["document"],
    documentSha256,
    buyerId: "00000000-0000-4000-8000-000000000002",
    typedName: "Chris Buyer",
    ledgerSeq: 7,
    createdAt: SIGNED_AT,
  };
  const accepted: LedgerEntry = {
    dealId: document.dealId,
    seq: 7,
    type: "ACCEPTED",
    actor: "buyer",
    payload: { version: 2, documentSha256, typedName: "Chris Buyer", access: "link" },
    payloadHash: "p".repeat(64),
    prevHash: "q".repeat(64),
    entryHash: "e".repeat(64),
    serverTime: SIGNED_AT.toISOString(),
    ...entry,
  };
  return { acceptance, accepted };
}

/** The ACCEPTED payload `signed()` writes for the standard document. */
const signedPayload = () => signed().accepted.payload as Record<string, unknown>;

describe("buildReceipt", () => {
  it("prints the signed terms, who signed and when, and the fingerprints to check", async () => {
    const { acceptance, accepted } = signed();
    const { bytes, filename } = await buildReceipt(acceptance, accepted);
    expect(filename).toBe("pactpal-receipt-v2.pdf");
    const lines = pdfTextLines(bytes);
    for (const expected of [
      "PactPal agreement receipt",
      "PayPal sandbox demo: no real money moves.",
      "Character illustration",
      "Art and design commission",
      document.dealId,
      "Maya",
      "Chris Buyer",
      "1 Nov 2026, 22:06 UTC",
      "by private link",
      "What was agreed (version 2)",
      "A character for a game store page",
      "Full-body character, transparent PNG",
      "Merchandise use",
      "Revisions included",
      "20 Nov 2026",
      "Amount (USD)",
      "Sketch",
      "240.00",
      "Notice shown before signing (version 1)",
      "Before you sign",
      "Agreed work, version 2",
      "c".repeat(64),
      acceptance.documentSha256,
      "Evidence log entry 8 (buyer signed)",
      "e".repeat(64),
      "How to check this receipt",
      "PactPal agreement receipt, format 1",
    ]) {
      expect(lines.join("\n")).toContain(expected);
    }
    expect(lines.join(" ")).toContain(
      "The buyer's IP address and browser are kept in the evidence log.",
    );
  });

  it("lists what the buyer provides, with dates where agreed", async () => {
    const withList: AcceptanceDocument = {
      ...document,
      terms: {
        ...document.terms,
        buyerProvides: [
          { text: "Reference sketches", dueDate: "2026-11-10" },
          { text: "Game logo", dueDate: null },
        ],
      },
    };
    const { acceptance, accepted } = signed(withList);
    const text = pdfTextLines((await buildReceipt(acceptance, accepted)).bytes).join("\n");
    expect(text).toContain("The buyer provides");
    expect(text).toContain("Reference sketches (by 10 Nov 2026)");
    expect(text).toMatch(/Game logo$/m);
  });

  it("prints the agreed timeline in order, when the version has one (7f)", async () => {
    const withSteps: AcceptanceDocument = {
      ...document,
      terms: {
        ...document.terms,
        timeline: [
          {
            n: 1,
            kind: "payment",
            owner: "buyer",
            title: "Sketch",
            dueDate: null,
            stage: 1,
            amount: { minor: 12_000, text: "120.00" },
          },
          {
            n: 2,
            kind: "review",
            owner: "seller",
            title: "Pencil sketch",
            dueDate: "2026-11-12",
            stage: null,
            amount: null,
          },
        ],
      },
    };
    const { acceptance, accepted } = signed(withSteps);
    const text = pdfTextLines((await buildReceipt(acceptance, accepted)).bytes).join(" ");
    expect(text).toContain("Timeline (in this order)");
    expect(text).toContain("1. Payment: Sketch, 120.00 USD (by the buyer)");
    expect(text).toContain("Pencil sketch (by the seller, due 12 Nov 2026)");
    const { acceptance: plain, accepted: plainEntry } = signed();
    const without = pdfTextLines((await buildReceipt(plain, plainEntry)).bytes).join(" ");
    expect(without).not.toContain("Timeline");
  });

  it("prints each delivered line with its mark", async () => {
    const marked: AcceptanceDocument = {
      ...document,
      terms: {
        ...document.terms,
        deliverables: ["Transparent PNG", "Rough sketch first", "Warm hand-drawn style", "Notes"],
        deliverableKinds: [
          { kind: "objective" },
          { kind: "process" },
          { kind: "subjective", approvalStage: 1 },
          null,
        ],
      },
    };
    const { acceptance, accepted } = signed(marked);
    const text = pdfTextLines((await buildReceipt(acceptance, accepted)).bytes).join(" ");
    expect(text).toContain("Transparent PNG (can be checked)");
    expect(text).toContain("Rough sketch first (a step in the work)");
    expect(text).toContain(
      "Warm hand-drawn style (a matter of taste: settled when the buyer approves stage 1, Sketch)",
    );
    expect(text).toMatch(/Notes(?! \()/);
  });

  it("gives the same bytes every time, dated at the signing time", async () => {
    const { acceptance, accepted } = signed();
    const [first, second] = await Promise.all([
      buildReceipt(acceptance, accepted),
      buildReceipt(acceptance, accepted),
    ]);
    expect(Buffer.from(first.bytes).equals(Buffer.from(second.bytes))).toBe(true);
  });

  it("leaves out what was not agreed, says how a PayPal sign-in reached the page, and flags undrawable characters", async () => {
    const bare: AcceptanceDocument = {
      ...document,
      sellerName: "李 Studio",
      terms: { ...document.terms, exclusions: [], revisionsIncluded: null, dueDate: null },
    };
    const { acceptance, accepted } = signed(bare);
    const paypal = { ...accepted, payload: { ...(accepted.payload as object), access: "paypal" } };
    const lines = pdfTextLines((await buildReceipt(acceptance, paypal)).bytes);
    const text = lines.join("\n");
    expect(text).toContain("signed in with PayPal");
    expect(text).toContain("? Studio");
    expect(text).toContain(
      "Some characters could not be shown here; the exact text is in the signed record.",
    );
    expect(text).not.toContain("Not included");
    expect(text).not.toContain("Revisions included");
    expect(text).not.toContain("Due date");
    expect(text).not.toContain("The buyer provides");
  });

  it.each([
    ["no log entry", () => ({ ...signed(), accepted: undefined })],
    ["an entry of another type", () => signed(document, { type: "DECLINED" })],
    [
      "an entry naming another page",
      () => signed(document, { payload: { documentSha256: "0".repeat(64), access: "link" } }),
    ],
    ["a stored copy that is not a format 1 page", () => signed({ format: 9 })],
    [
      "a typed name that differs from the log entry",
      () => signed(document, { payload: { ...signedPayload(), typedName: "Someone else" } }),
    ],
    [
      "a signing time that differs from the log entry",
      () => signed(document, { serverTime: "2026-11-01T22:07:00.000Z" }),
    ],
  ])("refuses %s", async (_name, make) => {
    const { acceptance, accepted } = make();
    await expect(buildReceipt(acceptance, accepted)).rejects.toBeInstanceOf(ReceiptIntegrityError);
  });
});
