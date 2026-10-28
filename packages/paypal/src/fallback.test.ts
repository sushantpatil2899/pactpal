import { describe, expect, it } from "vitest";
import { z } from "zod";
import { PayPalMcpError, PayPalResponseError } from "./errors.js";
import { DEFAULT_FALLBACK_POLICY, McpFallback, type FallbackRequest } from "./fallback.js";

const invoice = z.object({ id: z.string() });
type Invoice = z.infer<typeof invoice>;

const setupError = () =>
  new PayPalMcpError(
    "create_invoice",
    "PAYPAL_API_SETUP_ERROR",
    "failed",
    "Unsupported cache mode",
  );
const noAnswer = () => new PayPalMcpError("create_invoice", "NO_ANSWER", "unknown", "timed out");

function setup(policy = { ...DEFAULT_FALLBACK_POLICY, mcpTimeoutMs: 20 }) {
  let now = 0;
  const calls = { mcp: 0, rest: 0 };
  const fallback = new McpFallback({ policy, now: () => now });

  const request = (
    kind: "read" | "write",
    mcp: () => Promise<unknown>,
  ): FallbackRequest<Invoice> => ({
    operation: "create invoice",
    kind,
    mcp: {
      call: () => {
        calls.mcp += 1;
        return mcp();
      },
      schema: invoice,
    },
    rest: () => {
      calls.rest += 1;
      return Promise.resolve({ data: { id: "INV-REST" }, debugId: "dbg-rest" });
    },
  });

  return {
    fallback,
    calls,
    request,
    advance: (ms: number) => {
      now += ms;
    },
  };
}

const failing = (error: Error) => () => Promise.reject(error);

describe("McpFallback", () => {
  it("uses MCP when it answers in the expected shape", async () => {
    const { fallback, calls, request } = setup();
    const result = await fallback.run(request("write", () => Promise.resolve({ id: "INV-MCP" })));
    expect(result).toEqual({ data: { id: "INV-MCP" }, transport: "mcp" });
    expect(calls).toEqual({ mcp: 1, rest: 0 });
  });

  it("goes straight to REST when the operation has no MCP tool", async () => {
    const { fallback } = setup();
    const result = await fallback.run({
      operation: "provide evidence",
      kind: "write",
      rest: () => Promise.resolve({ data: { id: "E-1" } }),
    });
    expect(result).toEqual({ data: { id: "E-1" }, transport: "rest" });
  });

  it.each([
    ["read", "a PayPal error", setupError(), "MCP create_invoice failed: PAYPAL_API_SETUP_ERROR"],
    ["write", "a PayPal error", setupError(), "MCP create_invoice failed: PAYPAL_API_SETUP_ERROR"],
    ["read", "no answer", noAnswer(), "MCP create_invoice failed: NO_ANSWER"],
    ["read", "an unexpected error", new Error("socket hang up"), "socket hang up"],
  ] as const)("a %s falls back to REST after %s", async (kind, _label, error, reason) => {
    const { fallback, calls, request } = setup();
    const result = await fallback.run(request(kind, failing(error)));
    expect(result).toMatchObject({
      data: { id: "INV-REST" },
      transport: "rest",
      debugId: "dbg-rest",
    });
    expect(result.fallbackReason).toContain(reason);
    expect(calls).toEqual({ mcp: 1, rest: 1 });
  });

  it("falls back for a read whose MCP answer has the wrong shape", async () => {
    const { fallback, request } = setup();
    const result = await fallback.run(request("read", () => Promise.resolve({ id: 7 })));
    expect(result.transport).toBe("rest");
    expect(result.fallbackReason).toMatch(/unexpected response: id:/);
  });

  it("falls back for a read when MCP does not answer in time", async () => {
    const { fallback, request } = setup();
    const result = await fallback.run(request("read", () => new Promise(() => undefined)));
    expect(result.transport).toBe("rest");
    expect(result.fallbackReason).toContain("no answer within 20 ms");
  });

  it.each([
    ["no answer", failing(noAnswer())],
    ["an unexpected error", failing(new Error("socket hang up"))],
    ["a timeout", () => new Promise(() => undefined)],
  ])(
    "never repeats a write over REST after %s, because MCP may have done it",
    async (_label, mcp) => {
      const { fallback, calls, request } = setup();
      await expect(fallback.run(request("write", mcp))).rejects.toThrow();
      expect(calls.rest).toBe(0);
    },
  );

  it("never repeats a write over REST when MCP's answer has the wrong shape", async () => {
    const { fallback, calls, request } = setup();
    await expect(
      fallback.run(request("write", () => Promise.resolve({ unexpected: true }))),
    ).rejects.toBeInstanceOf(PayPalResponseError);
    expect(calls.rest).toBe(0);
  });

  it("skips MCP for 10 minutes after 3 failures in a row, then tries it again", async () => {
    const { fallback, calls, request, advance } = setup();
    const broken = request("read", failing(setupError()));
    for (let i = 0; i < 3; i++) await fallback.run(broken);
    expect(calls).toEqual({ mcp: 3, rest: 3 });

    const paused = await fallback.run(broken);
    expect(paused.fallbackReason).toBe("MCP paused after 3 failures in a row");
    expect(calls.mcp).toBe(3);

    advance(10 * 60_000 - 1);
    await fallback.run(broken);
    expect(calls.mcp).toBe(3);

    advance(1);
    const retried = await fallback.run(request("read", () => Promise.resolve({ id: "INV-MCP" })));
    expect(retried.transport).toBe("mcp");
  });

  it("resets the failure count after an MCP success", async () => {
    const { fallback, calls, request } = setup();
    const broken = request("read", failing(setupError()));
    await fallback.run(broken);
    await fallback.run(broken);
    await fallback.run(request("read", () => Promise.resolve({ id: "INV-MCP" })));
    await fallback.run(broken);
    await fallback.run(broken);
    expect(calls.mcp).toBe(5);
  });

  it("reports the REST error when REST also fails", async () => {
    const { fallback } = setup();
    await expect(
      fallback.run({
        operation: "list invoices",
        kind: "read",
        mcp: { call: failing(setupError()), schema: invoice },
        rest: () => Promise.reject(new Error("REST down")),
      }),
    ).rejects.toThrow("REST down");
  });

  it("uses the real clock by default", async () => {
    const result = await new McpFallback().run({
      operation: "list invoices",
      kind: "read",
      mcp: { call: () => Promise.resolve({ id: "x" }), schema: invoice },
      rest: () => Promise.resolve({ data: { id: "y" } }),
    });
    expect(result.transport).toBe("mcp");
  });
});
