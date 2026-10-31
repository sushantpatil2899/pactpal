import { describe, expect, it } from "vitest";
import { dealLinkEmail, dealLinkUrl } from "./deal-link-email.js";
import { StandInEmailSender } from "./sender.js";

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

describe("StandInEmailSender", () => {
  it("sends nothing and logs only the kind of email, never the address or the link", async () => {
    const lines: string[] = [];
    const sender = new StandInEmailSender({
      info: (details, message) => lines.push(JSON.stringify({ details, message })),
    });
    await sender.send(email);
    expect(lines).toEqual([
      JSON.stringify({
        details: { kind: "deal-link" },
        message: "Email not sent: no email service yet",
      }),
    ]);
  });
});
