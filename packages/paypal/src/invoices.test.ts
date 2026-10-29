import { describe, expect, it } from "vitest";
import { PayPalApiError, PayPalMcpError } from "./errors.js";
import { DEFAULT_FALLBACK_POLICY, McpFallback } from "./fallback.js";
import { InvoiceSendError, PayPalInvoices, type InvoiceDraft } from "./invoices.js";
import type { RestRequest, RestResponse } from "./rest.js";

const draft: InvoiceDraft = {
  recipientEmail: "buyer@example.com",
  amount: { minor: 1050, currency: "USD" },
  itemName: "Milestone 1: sketches",
  description: "Three pencil sketches",
  scopeReference: "scope v1 sha256:ab12",
  requestId: "deal-1-m1",
};

const setupError = new PayPalMcpError(
  "x",
  "PAYPAL_API_SETUP_ERROR",
  "failed",
  "Unsupported cache mode",
);

const invoiceBody = {
  id: "INV2-AAAA",
  status: "SENT",
  detail: {
    currency_code: "USD",
    note: "Agreed scope: scope v1 sha256:ab12",
    metadata: { recipient_view_url: "https://www.sandbox.paypal.com/invoice/p/#INV2-AAAA" },
  },
  primary_recipients: [{ billing_info: { email_address: "buyer@example.com" } }],
  amount: { currency_code: "USD", value: "10.50" },
};

/** Fake REST client: answers from a queue, checking answers with the request's schema like the real one. */
function setup(options: { rest?: unknown[]; mcp?: unknown[] | "none" } = {}) {
  const restReplies = [...(options.rest ?? [])];
  const mcpReplies = options.mcp === "none" ? [] : [...(options.mcp ?? [])];
  const restCalls: RestRequest<unknown>[] = [];
  const mcpCalls: { tool: string; args: Record<string, unknown> }[] = [];

  const rest = {
    request: <T>(request: RestRequest<T>): Promise<RestResponse<T>> => {
      restCalls.push(request);
      const reply = restReplies.shift();
      if (reply instanceof Error) return Promise.reject(reply);
      return Promise.resolve({
        data: request.schema.parse(reply),
        status: 200,
        debugId: "dbg-rest",
      });
    },
  };
  const mcp = {
    callTool: (tool: string, args: Record<string, unknown>) => {
      mcpCalls.push({ tool, args });
      const reply = mcpReplies.shift() ?? setupError;
      return reply instanceof Error ? Promise.reject(reply) : Promise.resolve(reply);
    },
  };
  const fallback = new McpFallback({ policy: { ...DEFAULT_FALLBACK_POLICY, mcpTimeoutMs: 50 } });
  const invoices = new PayPalInvoices(rest, options.mcp === "none" ? undefined : mcp, fallback);
  return { invoices, restCalls, mcpCalls };
}

describe("PayPalInvoices.createAndSend", () => {
  it("creates and sends over REST when MCP fails, with fixed request ids", async () => {
    const { invoices, restCalls, mcpCalls } = setup({
      rest: [
        { rel: "self", href: "https://api.sandbox.paypal.com/v2/invoicing/invoices/INV2-AAAA" },
        undefined,
      ],
    });
    const sent = await invoices.createAndSend(draft);

    expect(sent.invoiceId).toBe("INV2-AAAA");
    expect(sent.create).toEqual({
      transport: "rest",
      fallbackReason: "MCP x failed: PAYPAL_API_SETUP_ERROR: Unsupported cache mode",
      debugId: "dbg-rest",
    });
    expect(sent.send.transport).toBe("rest");
    expect(mcpCalls.map((call) => call.tool)).toEqual(["create_invoice", "send_invoice"]);

    const [create, send] = restCalls;
    expect(create).toMatchObject({
      method: "POST",
      path: "/v2/invoicing/invoices",
      requestId: "deal-1-m1",
      body: {
        detail: { currency_code: "USD", note: "Agreed scope: scope v1 sha256:ab12" },
        primary_recipients: [{ billing_info: { email_address: "buyer@example.com" } }],
        items: [
          {
            name: "Milestone 1: sketches",
            description: "Three pencil sketches",
            quantity: "1",
            unit_amount: { currency_code: "USD", value: "10.50" },
          },
        ],
      },
    });
    expect(send).toMatchObject({
      method: "POST",
      path: "/v2/invoicing/invoices/INV2-AAAA/send",
      requestId: "deal-1-m1-send",
      body: { send_to_recipient: true, send_to_invoicer: false },
    });
  });

  it("passes the same invoice details to the MCP tools and uses MCP when it works", async () => {
    const { invoices, restCalls, mcpCalls } = setup({ mcp: [{ id: "INV2-MCP" }, { ok: true }] });
    const sent = await invoices.createAndSend(draft);

    expect(sent).toMatchObject({
      invoiceId: "INV2-MCP",
      create: { transport: "mcp" },
      send: { transport: "mcp" },
    });
    expect(restCalls).toEqual([]);
    expect(mcpCalls[0]?.args).toEqual({
      currency_code: "USD",
      note: "Agreed scope: scope v1 sha256:ab12",
      primary_recipients: [{ billing_info: { email_address: "buyer@example.com" } }],
      items: [
        {
          name: "Milestone 1: sketches",
          description: "Three pencil sketches",
          quantity: "1",
          unit_amount: { currency_code: "USD", value: "10.50" },
        },
      ],
    });
    expect(mcpCalls[1]?.args).toEqual({ invoice_id: "INV2-MCP", send_to_recipient: true });
  });

  it("goes straight to REST when no MCP client is configured, reading the id from the invoice body", async () => {
    const { invoices, restCalls } = setup({ mcp: "none", rest: [{ id: "INV2-BBBB" }, {}] });
    const sent = await invoices.createAndSend(draft);
    expect(sent.invoiceId).toBe("INV2-BBBB");
    expect(sent.create).toEqual({
      transport: "rest",
      fallbackReason: undefined,
      debugId: "dbg-rest",
    });
    expect(restCalls).toHaveLength(2);
  });

  it("stops before sending when the create fails", async () => {
    const failure = new PayPalApiError(
      "POST /v2/invoicing/invoices",
      422,
      "UNPROCESSABLE_ENTITY",
      "x",
      [],
      "d",
    );
    const { invoices, restCalls } = setup({ mcp: "none", rest: [failure] });
    await expect(invoices.createAndSend(draft)).rejects.toBe(failure);
    expect(restCalls).toHaveLength(1);
  });

  it("rejects a create answer without an invoice id or link", async () => {
    const { invoices } = setup({ mcp: "none", rest: [{ rel: "self" }] });
    await expect(invoices.createAndSend(draft)).rejects.toThrow(/no invoice id or link/);
  });

  it("reports a failed send with the created invoice id so the send can be retried", async () => {
    const { invoices } = setup({
      mcp: "none",
      rest: [{ id: "INV2-CCCC" }, new Error("REST down")],
    });
    const error = await invoices.createAndSend(draft).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(InvoiceSendError);
    expect(error).toMatchObject({
      invoiceId: "INV2-CCCC",
      message: "Invoice INV2-CCCC was created but not sent",
    });
  });

  it("rejects an invalid amount before calling PayPal", async () => {
    const { invoices, restCalls, mcpCalls } = setup();
    await expect(
      invoices.createAndSend({ ...draft, amount: { minor: 10.5, currency: "USD" } }),
    ).rejects.toThrow(RangeError);
    expect([...restCalls, ...mcpCalls]).toEqual([]);
  });
});

describe("PayPalInvoices.get", () => {
  it("reads status, amount, recipient, note and payment link", async () => {
    const { invoices, restCalls } = setup({ rest: [invoiceBody] });
    const result = await invoices.get("INV2-AAAA");
    expect(result).toMatchObject({
      transport: "rest",
      data: {
        invoiceId: "INV2-AAAA",
        status: "SENT",
        amount: { minor: 1050, currency: "USD" },
        recipientEmail: "buyer@example.com",
        note: "Agreed scope: scope v1 sha256:ab12",
        payerViewUrl: "https://www.sandbox.paypal.com/invoice/p/#INV2-AAAA",
      },
    });
    expect(restCalls[0]).toMatchObject({ method: "GET", path: "/v2/invoicing/invoices/INV2-AAAA" });
  });

  it("reads a minimal invoice with optional fields missing", async () => {
    const { invoices } = setup({ mcp: [{ id: "INV2-D", status: "DRAFT" }] });
    const result = await invoices.get("INV2-D");
    expect(result).toEqual({
      transport: "mcp",
      data: {
        invoiceId: "INV2-D",
        status: "DRAFT",
        amount: undefined,
        recipientEmail: undefined,
        note: undefined,
        payerViewUrl: undefined,
      },
    });
  });
});
