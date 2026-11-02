import { describe, expect, it } from "vitest";
import { formatInvoiceReport, parseInvoiceArgs } from "./sandbox-invoice-report.js";

describe("parseInvoiceArgs", () => {
  it("reads the recipient and converts the amount to minor units", () => {
    expect(parseInvoiceArgs(["--to", "buyer@example.com", "--amount", "1.00"])).toEqual({
      ok: true,
      args: { to: "buyer@example.com", amount: { minor: 100, currency: "USD" } },
    });
    expect(
      parseInvoiceArgs(["--to", "b@example.com", "--amount", "500", "--currency", "JPY"]),
    ).toMatchObject({ ok: true, args: { amount: { minor: 500, currency: "JPY" } } });
  });

  it.each([
    [["--amount", "1.00"], /email/],
    [["--to", "not-an-email", "--amount", "1.00"], /--to must be an email address/],
    [["--to", "b@example.com"], /--amount is required/],
    [["--to", "b@example.com", "--amount", "1.005"], /--amount: "1.005" is not a valid USD amount/],
    [["--to", "b@example.com", "--amount", "1", "--color", "red"], /Unknown option '--color'/],
  ])("rejects %j", (argv, message) => {
    const result = parseInvoiceArgs(argv);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(message);
  });
});

describe("formatInvoiceReport", () => {
  const sent = {
    invoiceId: "INV2-AAAA",
    create: { transport: "rest" as const, fallbackReason: "MCP setup error", debugId: "d1" },
    send: { transport: "mcp" as const, fallbackReason: undefined, debugId: undefined },
  };

  it("shows the invoice and which route served each step", () => {
    const text = formatInvoiceReport(
      sent,
      {
        invoiceId: "INV2-AAAA",
        status: "SENT",
        amount: { minor: 100, currency: "USD" },
        recipientEmail: "buyer@example.com",
        note: "Agreed scope: test",
        payerViewUrl: "https://www.sandbox.paypal.com/invoice/p/#INV2-AAAA",
        payments: { paidAmount: undefined, transactions: [] },
      },
      { transport: "rest", fallbackReason: "MCP paused after 3 failures in a row" },
    );
    expect(text).toContain("  Status        SENT\n");
    expect(text).toContain("  Amount        1.00 USD\n");
    expect(text).toContain("  Created via   rest (MCP skipped: MCP setup error)\n");
    expect(text).toContain("  Sent via      mcp\n");
    expect(text).toContain(
      "  Read via      rest (MCP skipped: MCP paused after 3 failures in a row)\n",
    );
  });

  it("marks missing details", () => {
    const text = formatInvoiceReport(
      sent,
      {
        invoiceId: "INV2-AAAA",
        status: "DRAFT",
        amount: undefined,
        recipientEmail: undefined,
        note: undefined,
        payerViewUrl: undefined,
        payments: { paidAmount: undefined, transactions: [] },
      },
      { transport: "rest" },
    );
    expect(text).toContain("  Amount        unknown\n");
    expect(text).toContain("  Recipient     unknown\n");
    expect(text).toContain("  Note          none\n");
    expect(text).toContain("  Payment link  not provided\n");
  });
});
