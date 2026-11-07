import { PARTNER_FEATURES } from "@pactpal/paypal";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_RETURN_URL,
  formatActPreview,
  formatActReport,
  formatLinkPreview,
  formatReferral,
  formatStatus,
  listsInvoice,
  parsePartnerArgs,
  spikeDraft,
} from "./sandbox-partner-report.js";

const ALL = [...PARTNER_FEATURES];

describe("parsePartnerArgs", () => {
  it.each([
    [["--link"], { kind: "link", returnUrl: DEFAULT_RETURN_URL, features: ALL, send: false }],
    [
      ["--link", "--features", "READ_SELLER_DISPUTE, UPDATE_SELLER_DISPUTE,READ_SELLER_DISPUTE"],
      {
        kind: "link",
        returnUrl: DEFAULT_RETURN_URL,
        features: ["READ_SELLER_DISPUTE", "UPDATE_SELLER_DISPUTE"],
        send: false,
      },
    ],
    [
      ["--link", "--send", "--return-url", "https://pactpal.test/back"],
      { kind: "link", returnUrl: "https://pactpal.test/back", features: ALL, send: true },
    ],
    [
      ["--status", "pactpal-s0a-1"],
      { kind: "status", trackingId: "pactpal-s0a-1", partnerId: undefined },
    ],
    [
      ["--status", "t-1", "--partner-id", "PARTNER1"],
      { kind: "status", trackingId: "t-1", partnerId: "PARTNER1" },
    ],
    [["--act", "SELLER2"], { kind: "act", merchantId: "SELLER2", send: false }],
    [["--act", "SELLER2", "--send"], { kind: "act", merchantId: "SELLER2", send: true }],
  ])("reads %j", (argv, value) => {
    expect(parsePartnerArgs(argv)).toEqual({ ok: true, value });
  });

  it.each([
    [[], /exactly one of --link, --status or --act/],
    [["--link", "--act", "S"], /exactly one/],
    [["--status", "t-1", "--send"], /--send is only used with --link or --act/],
    [["--act", "S", "--partner-id", "P"], /--partner-id is only used with --status/],
    [["--act", "not an id!"], /--act needs a PayPal id/],
    [["--link", "--return-url", "http://pactpal.test/"], /--return-url needs an https address/],
    [["--link", "--colour"], /Unknown option '--colour'/],
    [["--link", "--features", "PAYMENT"], /--features takes INVOICE_READ_WRITE/],
    [["--act", "S", "--features", "READ_SELLER_DISPUTE"], /--features is only used with --link/],
  ])("rejects %j", (argv, error) => {
    const result = parsePartnerArgs(argv);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(error);
  });
});

describe("spikeDraft", () => {
  it("is a 1.00 USD invoice to a made-up address, keyed by the request id", () => {
    expect(spikeDraft("req-1")).toMatchObject({
      recipientEmail: "spike-buyer@example.com",
      amount: { minor: 100, currency: "USD" },
      requestId: "req-1",
    });
  });
});

describe("formatLinkPreview and formatReferral", () => {
  it("shows the permissions and the exact body, and says nothing was sent", () => {
    const text = formatLinkPreview("t-1", "https://pactpal.test/", ALL);
    expect(text).toContain("INVOICE_READ_WRITE, READ_SELLER_DISPUTE, UPDATE_SELLER_DISPUTE");
    expect(text).toContain('"tracking_id": "t-1"');
    expect(text).toContain('"return_url": "https://pactpal.test/"');
    expect(text).toContain("Dry run: nothing was sent");
  });

  it("gives the link and the next command", () => {
    const text = formatReferral("t-1", "https://www.sandbox.paypal.com/bizsignup/x", "dbg-1");
    expect(text).toContain("https://www.sandbox.paypal.com/bizsignup/x");
    expect(text).toContain("dbg-1");
    expect(text).toContain("pnpm sandbox:partner --status t-1");
    expect(formatReferral("t-1", "https://x.test")).toContain("Debug id            none");
  });
});

describe("formatStatus", () => {
  it("says when the seller has not connected yet", () => {
    expect(formatStatus("t-1", "P1", "client-id", { connected: false }, undefined)).toContain(
      "Not connected yet",
    );
  });

  it("lists only what was granted to this platform app", () => {
    const text = formatStatus(
      "t-1",
      "P1",
      "client-id",
      { connected: true, merchantId: "SELLER2" },
      {
        merchantId: "SELLER2",
        trackingId: "t-1",
        paymentsReceivable: true,
        emailConfirmed: undefined,
        grants: [
          { partnerClientId: "client-id", scopes: ["https://uri.paypal.com/services/invoicing"] },
          { partnerClientId: "someone-else", scopes: ["https://uri.paypal.com/other"] },
        ],
      },
    );
    expect(text).toMatch(/Seller payer id\s+SELLER2/);
    expect(text).toMatch(/Payments receivable\s+yes/);
    expect(text).toMatch(/Email confirmed\s+not stated/);
    expect(text).toMatch(/Granted to our app\s+1 permissions/);
    expect(text).toContain("https://uri.paypal.com/services/invoicing");
    expect(text).not.toContain("https://uri.paypal.com/other");
    expect(text).toContain("pnpm sandbox:partner --act SELLER2");
  });

  it("says when nothing was granted to this app", () => {
    const text = formatStatus(
      "t-1",
      "P1",
      "client-id",
      { connected: true, merchantId: "SELLER2" },
      {
        merchantId: "SELLER2",
        trackingId: undefined,
        paymentsReceivable: false,
        emailConfirmed: false,
        grants: [],
      },
    );
    expect(text).toMatch(/Granted to our app\s+nothing listed/);
    expect(text).toMatch(/Payments receivable\s+no/);
  });
});

describe("formatActPreview and formatActReport", () => {
  it("lists the four steps without sending", () => {
    const text = formatActPreview("SELLER2", spikeDraft("x"));
    expect(text).toContain("1.00 USD to spike-buyer@example.com, never sent");
    expect(text).toContain("Dry run: nothing was sent");
  });

  it("reports each step on its own, failures included", () => {
    const text = formatActReport("SELLER2", [
      ["1. Create draft", { ok: true, detail: "INV2-1" }],
      ["3. List disputes", { ok: false, error: "403 NOT_AUTHORIZED" }],
    ]);
    expect(text).toContain("1 of 2 steps passed");
    expect(text).toContain("ok: INV2-1");
    expect(text).toContain("FAILED: 403 NOT_AUTHORIZED");
  });
});

describe("listsInvoice", () => {
  it("finds the invoice id anywhere in an MCP answer, as a whole value", () => {
    expect(listsInvoice({ items: [{ id: "INV2-1" }] }, "INV2-1")).toBe(true);
    expect(listsInvoice({ items: [{ id: "INV2-10" }] }, "INV2-1")).toBe(false);
    expect(listsInvoice(undefined, "INV2-1")).toBe(false);
  });
});
