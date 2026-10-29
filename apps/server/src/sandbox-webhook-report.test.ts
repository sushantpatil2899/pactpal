import { describe, expect, it } from "vitest";
import {
  formatEvents,
  formatPreview,
  formatRegistered,
  formatRegistrations,
  parseWebhookArgs,
} from "./sandbox-webhook-report.js";

describe("parseWebhookArgs", () => {
  it.each([
    [["--list"], { kind: "list" }],
    [["--events"], { kind: "events" }],
    [
      ["--register", "https://pactpal.onrender.com/webhooks/paypal"],
      { kind: "register", url: "https://pactpal.onrender.com/webhooks/paypal", send: false },
    ],
    [
      ["--register", "https://x.example/w", "--send"],
      { kind: "register", url: "https://x.example/w", send: true },
    ],
    [
      ["--delete", "8PT597110X687430LKGECATA", "--send"],
      { kind: "delete", webhookId: "8PT597110X687430LKGECATA", send: true },
    ],
  ])("reads %j", (argv, value) => {
    expect(parseWebhookArgs(argv)).toEqual({ ok: true, value });
  });

  it.each([
    [[], /exactly one of/],
    [["--list", "--events"], /exactly one of/],
    [["--register", "http://insecure.example/w"], /--register needs an https address/],
    [["--register", "not a url"], /--register needs an https address/],
    [["--delete", "../x"], /--delete needs a webhook id/],
    [["--list", "--send"], /--send is only used with --register or --delete/],
    [["--colour"], /Unknown option '--colour'/],
  ])("rejects %j", (argv, message) => {
    const result = parseWebhookArgs(argv);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(message);
  });
});

describe("webhook output", () => {
  const registration = { webhookId: "WH-ID", url: "https://x.example/w", eventTypes: ["A", "B"] };

  it("lists registrations, or none", () => {
    expect(formatRegistrations([])).toBe("Registered notification addresses: none\n");
    expect(formatRegistrations([registration])).toBe(
      "Registered notification addresses: 1\n  WH-ID  https://x.example/w\n    A, B\n",
    );
  });

  it("previews without sending", () => {
    expect(formatPreview({ kind: "register", url: "https://x.example/w", send: false })).toContain(
      "Would register https://x.example/w\n  for: INVOICING.INVOICE.CREATED,",
    );
    expect(formatPreview({ kind: "delete", webhookId: "WH-ID", send: false })).toBe(
      "Would remove webhook WH-ID\nDry run: nothing was sent. Add --send to send it.\n",
    );
  });

  it("shows the new id and what to do next", () => {
    expect(formatRegistered(registration)).toContain(
      "Next: set PAYPAL_WEBHOOK_ID=WH-ID in Render's Environment page.\n",
    );
  });

  it("shows recent notifications with their deliveries", () => {
    expect(formatEvents([])).toBe("Recent notifications: none\n");
    expect(
      formatEvents([
        {
          eventId: "WH-1",
          eventType: "INVOICING.INVOICE.CREATED",
          createdAt: "2026-10-29T10:00:00Z",
          summary: undefined,
          deliveries: [{ url: "https://x.example/w", status: "SUCCESS", httpStatus: 200 }],
        },
        {
          eventId: "WH-2",
          eventType: "X",
          createdAt: undefined,
          summary: undefined,
          deliveries: [],
        },
        {
          eventId: "WH-3",
          eventType: "Y",
          createdAt: undefined,
          summary: undefined,
          deliveries: [{ url: undefined, status: undefined, httpStatus: undefined }],
        },
      ]),
    ).toBe(
      "Recent notifications: 3\n" +
        "  2026-10-29T10:00:00Z  INVOICING.INVOICE.CREATED  WH-1\n    SUCCESS 200 https://x.example/w\n" +
        "  -  X  WH-2\n    delivery: PayPal does not report it here; check the server's logs\n" +
        "  -  Y  WH-3\n    - - -\n",
    );
  });
});
