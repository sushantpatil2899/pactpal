import { describe, expect, it } from "vitest";
import { dealLinkEmail, dealLinkUrl } from "./deal-link-email.js";
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
