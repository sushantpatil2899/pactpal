import { describe, expect, it } from "vitest";
import { formatSandboxReport } from "./sandbox-report.js";

describe("formatSandboxReport", () => {
  it("shows each app's login, needed features and permissions", () => {
    const now = 1_000_000;
    const text = formatSandboxReport(
      {
        seller: {
          status: "ok",
          token: {
            expiresAt: now + 9 * 3_600_000,
            appId: "APP-80W",
            scopes: [
              "https://uri.paypal.com/services/invoicing",
              "https://uri.paypal.com/services/disputes/read-seller",
            ],
          },
          mcp: {
            connected: true,
            tools: 43,
            testCall: { ok: false, error: "MCP list_invoices failed: PAYPAL_API_SETUP_ERROR: x" },
          },
        },
        buyerBiz: {
          status: "failed",
          error: "PayPalApiError: POST /v1/oauth2/token failed with 401",
        },
        platform: { status: "skipped" },
      },
      now,
    );

    expect(text).toBe(
      [
        "Seller app (APP-80W)",
        "  Login               ok, token valid for 9.0 hours",
        "  Invoicing           yes",
        "  Disputes            yes",
        "  Transaction search  no",
        "  MCP connection      ok, 43 tools",
        "  MCP list_invoices   failed: MCP list_invoices failed: PAYPAL_API_SETUP_ERROR: x",
        "  Permissions (2)",
        "    https://uri.paypal.com/services/invoicing",
        "    https://uri.paypal.com/services/disputes/read-seller",
        "",
        "Buyer business app",
        "  Login  failed: PayPalApiError: POST /v1/oauth2/token failed with 401",
        "",
        "Platform app",
        "  Login  skipped: keys not set",
        "",
      ].join("\n"),
    );
  });

  it("omits the app id when PayPal does not send one", () => {
    const text = formatSandboxReport(
      {
        seller: {
          status: "ok",
          token: { expiresAt: 0, appId: undefined, scopes: [] },
          mcp: { connected: false, error: "MCP tools/list failed: CONNECT_FAILED: refused" },
        },
        buyerBiz: { status: "skipped" },
        platform: { status: "skipped" },
      },
      0,
    );
    expect(text.startsWith("Seller app\n")).toBe(true);
    expect(text).toContain("Permissions (0)\n");
    expect(text).toContain(
      "MCP connection      failed: MCP tools/list failed: CONNECT_FAILED: refused\n",
    );
    expect(text).not.toContain("MCP list_invoices");
  });
});
