import { describe, expect, it } from "vitest";
import { dealLinkEmail, dealLinkUrl } from "./deal-link-email.js";
import { answerEmail } from "./answer-email.js";
import { changeAnswerEmail, changeProposedEmail } from "./change-email.js";
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

describe("answerEmail", () => {
  const facts = {
    dealTitle: "Food truck logo",
    stage: 1,
    stageCount: 2,
    stageTitle: "Sketch",
    amountText: "150.00",
    currency: "USD",
  };
  const base = {
    to: "lena@example.com",
    facts,
    answeredAt: new Date("2026-11-03T09:30:00Z"),
    idempotencyKey: "answer:d1",
  };
  const lines = (answer: Parameters<typeof answerEmail>[0]["answer"]) =>
    answerEmail({ ...base, answer }).text.split("\n");

  it("tells the seller a stage was approved, and when it completes the deal", () => {
    const mail = answerEmail({ ...base, answer: { kind: "approved", completesDeal: false } });
    expect(mail).toMatchObject({
      kind: "approved",
      subject: 'Approved: "Food truck logo", stage 1 of 2 (Sketch)',
      idempotencyKey: "answer:d1",
    });
    expect(mail.text.split("\n")).toEqual([
      'The buyer approved your delivery for stage 1 of 2 of "Food truck logo" (Sketch) on 3 Nov 2026, 09:30 UTC.',
      "",
      "The approval is in this deal's evidence log.",
      "",
      "PactPal (sandbox demo: no real money moves). Not legal advice.",
    ]);
    expect(lines({ kind: "approved", completesDeal: true })[1]).toBe(
      "Every stage of the agreement is now approved.",
    );
  });

  it("tells the seller what to change and where it stands against the revisions included", () => {
    const changes = {
      kind: "changes" as const,
      request: "Turn the wheel",
      revision: 1,
      revisionsIncluded: 2,
    };
    const mail = answerEmail({ ...base, answer: changes });
    expect(mail.subject).toBe('Changes requested: "Food truck logo", stage 1 of 2 (Sketch)');
    expect(mail.text.split("\n").slice(0, 6)).toEqual([
      'The buyer asked for changes to your delivery for stage 1 of 2 of "Food truck logo" (Sketch) on 3 Nov 2026, 09:30 UTC.',
      "This is revision 1 of the 2 included in the agreement.",
      "",
      'Their request: "Turn the wheel"',
      "",
      "Open the deal in PactPal to deliver again.",
    ]);
    expect(lines({ ...changes, revision: 3 })[1]).toBe(
      "This is beyond the 2 revisions included in the agreement; it may be extra work.",
    );
    expect(lines({ ...changes, revisionsIncluded: undefined })[1]).toBe(
      "The agreement states no revision limit.",
    );
  });
});

describe("change order emails", () => {
  const AT = new Date("2026-11-04T18:40:00.000Z");
  const change = {
    addedLines: [{ text: "Online ordering page", mark: { kind: "objective" as const } }],
    addedExclusions: [],
    addedBuyerProvides: [],
    addedStages: [{ stage: 3, title: "Ordering", amount: { text: "400.00" }, dueDate: null }],
    dueDate: null,
    revisionsIncluded: null,
    total: { from: { text: "1500.00" }, to: { text: "1900.00" } },
  };
  const proposed = (message: string | undefined) =>
    changeProposedEmail({
      to: "rosa@example.com",
      sellerName: "Daniel",
      dealTitle: "Sunrise Bakes website",
      version: 2,
      proposedAt: AT,
      message,
      change,
      currency: "USD",
      stages: [{ title: "Design" }, { title: "Build" }, { title: "Ordering" }],
      link: "https://pactpal.test/link#t=abc",
      linkExpiresAt: new Date("2026-11-18T18:40:00.000Z"),
      idempotencyKey: "change:1:ab",
    });

  it("tell the buyer what changes, with the seller's message and a private link", () => {
    const email = proposed("Online ordering, as you asked");
    expect(email).toMatchObject({
      kind: "change-proposed",
      to: "rosa@example.com",
      subject: 'Change proposed: "Sunrise Bakes website" (version 2)',
      idempotencyKey: "change:1:ab",
    });
    expect(email.text.split("\n")).toEqual([
      'Daniel proposed a change to your agreement "Sunrise Bakes website" on 4 Nov 2026, 18:40 UTC.',
      "",
      'Message from Daniel: "Online ordering, as you asked"',
      "",
      "What changes:",
      "- Added: Online ordering page (can be checked)",
      "- Added payment stage 3: Ordering, 400.00 USD",
      "- Total: 1500.00 → 1900.00 USD",
      "",
      "Nothing changes unless you agree. Read the full new agreement, then agree or decline (private link, works until 18 Nov 2026, 18:40 UTC, this deal only; please do not forward it):",
      "https://pactpal.test/link#t=abc",
      "",
      "PactPal (sandbox demo: no real money moves). Not legal advice.",
    ]);
    expect(proposed(undefined).text).not.toContain("Message from");
  });

  const answered = (answer: Parameters<typeof changeAnswerEmail>[0]["answer"]) =>
    changeAnswerEmail({
      to: "daniel@example.com",
      dealTitle: "Sunrise Bakes website",
      fromVersion: 1,
      toVersion: 2,
      answer,
      answeredAt: AT,
      idempotencyKey: "change-answer:1",
    });

  it("tell the seller the buyer agreed, and about invoicing new stages", () => {
    const email = answered({ kind: "accepted", typedName: "Rosa Diaz", addsStages: true });
    expect(email).toMatchObject({
      kind: "change-accepted",
      subject: 'Change accepted: "Sunrise Bakes website" (now version 2)',
    });
    expect(email.text).toContain(
      'Rosa Diaz agreed to your change to "Sunrise Bakes website" on 4 Nov 2026, 18:40 UTC. Version 2 is now the signed agreement; its receipt comes in a separate email.',
    );
    expect(email.text).toContain("You can send the invoice for the new payment stages");
    expect(
      answered({ kind: "accepted", typedName: "Rosa Diaz", addsStages: false }).text,
    ).not.toContain("invoice");
  });

  it("tell the seller the buyer declined, with the reason when given", () => {
    const email = answered({ kind: "declined", reason: "No blog, thanks" });
    expect(email).toMatchObject({
      kind: "change-declined",
      subject: 'Change declined: "Sunrise Bakes website" (version 2)',
    });
    expect(email.text.split("\n")).toEqual([
      'The buyer declined your change to "Sunrise Bakes website" on 4 Nov 2026, 18:40 UTC.',
      "",
      'Their reason: "No blog, thanks"',
      "",
      "The signed agreement (version 1) stays as it was. The decline is in this deal's evidence log.",
      "",
      "PactPal (sandbox demo: no real money moves). Not legal advice.",
    ]);
    expect(answered({ kind: "declined", reason: undefined }).text).not.toContain("reason");
  });
});
