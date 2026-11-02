import { describe, expect, it } from "vitest";
import { dealLinkEmail, dealLinkUrl } from "./deal-link-email.js";
import { deliveryEmail } from "./delivery-email.js";
import { receiptEmail } from "./receipt-email.js";

const email = dealLinkEmail({
  publicBaseUrl: "https://pactpal.test",
  to: "chris@example.com",
  token: "SECRET-TOKEN",
  dealTitle: "Logo design",
  sellerName: "Maya",
  expiresAt: new Date("2026-11-14T10:00:00.000Z"),
});

describe("dealLinkEmail", () => {
  it("puts the link's secret after # so it never reaches the server", () => {
    expect(dealLinkUrl("https://pactpal.test", "T")).toBe("https://pactpal.test/link#t=T");
  });

  it("tells the buyer which deal, the private link, until when it works, and what it proves", () => {
    expect(email).toMatchObject({
      kind: "deal-link",
      to: "chris@example.com",
      subject: 'Maya shared "Logo design" with you on PactPal',
    });
    expect(email.text).toContain("https://pactpal.test/link#t=SECRET-TOKEN");
    expect(email.text).toContain("works until 2026-11-14 (UTC)");
    expect(email.text).toContain("only opens this deal");
    expect(email.text).toContain("not proof of identity");
  });
});

describe("receiptEmail", () => {
  const base = {
    to: "chris@example.com",
    dealTitle: "Character illustration",
    sellerName: "Maya",
    typedName: "Chris Buyer",
    signedAt: new Date("2026-11-01T22:06:00.000Z"),
    version: 2,
    receipt: {
      filename: "pactpal-receipt-v2.pdf",
      bytes: new Uint8Array([1, 2]),
      sha256: "a".repeat(64),
    },
    idempotencyKey: "receipt:deal:v2:buyer:1",
  };

  it("tells the buyer what they signed, attaches the receipt and gives its fingerprint", () => {
    const mail = receiptEmail({ ...base, role: "buyer" });
    expect(mail).toMatchObject({
      kind: "receipt",
      to: "chris@example.com",
      subject: 'Receipt: "Character illustration" was signed on PactPal',
      idempotencyKey: "receipt:deal:v2:buyer:1",
      attachments: [{ filename: "pactpal-receipt-v2.pdf", bytes: base.receipt.bytes }],
    });
    expect(mail.text.split("\n")[0]).toBe(
      'You signed the agreement "Character illustration" with Maya on 1 Nov 2026, 22:06 UTC (version 2).',
    );
    expect(mail.text).toContain(`Receipt fingerprint (SHA-256): ${"a".repeat(64)}`);
    expect(mail.text).toContain("not proof of identity");
    expect(mail.text).toContain("sandbox demo: no real money moves");
  });

  it("tells the seller who signed", () => {
    const mail = receiptEmail({ ...base, role: "seller", to: "maya@example.com" });
    expect(mail.text.split("\n")[0]).toBe(
      'Chris Buyer signed your agreement "Character illustration" on 1 Nov 2026, 22:06 UTC (version 2).',
    );
  });
});

describe("deliveryEmail", () => {
  const facts = {
    dealTitle: "Food truck logo",
    stage: 1,
    stageCount: 2,
    stageTitle: "Deposit",
    amountText: "150.00",
    currency: "USD",
  };
  const base = {
    to: "diego@example.com",
    sellerName: "Lena",
    facts,
    link: "https://pactpal.test/link#t=SECRET",
    linkExpiresAt: new Date("2026-11-16T18:00:00Z"),
    idempotencyKey: "delivery:1:abc",
  };

  it("says what was delivered, quotes the message and gives the private link", () => {
    const mail = deliveryEmail({ ...base, fileCount: 2, message: "Here is the sketch" });
    expect(mail).toMatchObject({
      kind: "delivery",
      subject: 'Delivery for "Food truck logo": stage 1 of 2, Deposit',
      idempotencyKey: "delivery:1:abc",
    });
    expect(mail.text.split("\n")).toEqual([
      'Lena delivered work for stage 1 of 2 of "Food truck logo" (Deposit): 2 files.',
      "",
      'Message from Lena: "Here is the sketch"',
      "",
      "Open the delivery (private link, works until 16 Nov 2026, 18:00 UTC, this deal only; please do not forward it):",
      "https://pactpal.test/link#t=SECRET",
      "",
      "PactPal records when you open the delivery and when you download each file, with the file's fingerprint. A typed name and an IP address are not proof of identity.",
      "",
      "PactPal (sandbox demo: no real money moves). Not legal advice.",
    ]);
  });

  it("leaves out the message line when there is none, and counts one file", () => {
    const mail = deliveryEmail({ ...base, fileCount: 1, message: undefined });
    expect(mail.text).toContain("(Deposit): 1 file.");
    expect(mail.text).not.toContain("Message from");
  });
});
