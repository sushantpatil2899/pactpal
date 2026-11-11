import { listNotifications, readLedger, turnOffIntakeKey } from "@pactpal/db";
import {
  TEST_NOW,
  createSignedTestDeal,
  testId,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors, dealTestApp, signedInAs } from "../deals/test-app.js";
import { fakePayPal } from "../payments/paypal-test-support.js";
import { mcpClient } from "./test-support.js";
import { AGENT_TOOLS, UNTRUSTED_NOTE } from "./tools.js";
import { AGENT_CALLS_PER_MINUTE } from "./mcp-routes.js";
import { memoryStore } from "../keyvalue.js";

const db = useMigratedTestDatabase();

/** A signed deal, the app with a fake PayPal, the seller's agent key and a way to call `/mcp`. */
async function agentDeal() {
  const deal = await createSignedTestDeal(db);
  const paypal = fakePayPal();
  const env = dealTestApp(db, undefined, { invoices: paypal.invoices });
  const client = await mcpClient(db, env.call, deal.seller.id);
  const sellerToken = await signedInAs(db, deal.seller.id);
  return { ...deal, ...env, ...paypal, ...client, sellerToken };
}

describe("the MCP server for agents", () => {
  it("needs a valid agent key that is on, and only answers POST", async () => {
    const env = await agentDeal();
    expect((await env.rpc("tools/list", {}, "")).status).toBe(401);
    expect((await env.rpc("tools/list", {}, "Bearer ppk_not-a-key")).status).toBe(401);
    expect((await env.call("GET", "/mcp")).statusCode).toBe(405);
    await turnOffIntakeKey(db, env.seller.id, TEST_NOW, "agent");
    expect((await env.rpc("tools/list")).status).toBe(401);
    await env.app.close();
  });

  it("lists its tools, with nothing to sign, accept or act for a buyer", async () => {
    const env = await agentDeal();
    const listed = await env.rpc("tools/list");
    expect(listed.status).toBe(200);
    const names = listed.body.result?.tools?.map((t) => t.name) ?? [];
    expect(names).toEqual(AGENT_TOOLS.map((t) => t.name));
    expect(names.join(" ")).not.toMatch(/sign|accept|offer|appeal|message/);
    await env.app.close();
  });

  it("reads the seller's deals, marked as other people's words, and nobody else's", async () => {
    const env = await agentDeal();
    const deals = await env.tool("list_deals");
    expect(deals.data?.note).toBe(UNTRUSTED_NOTE);
    expect(JSON.stringify(deals.data)).toContain(env.dealId);
    const one = await env.tool("get_deal", { dealId: env.dealId });
    expect(Object.keys(one.data ?? {})).toEqual([
      "note",
      "deal",
      "timeline",
      "evidenceScore",
      "payments",
    ]);
    expect(await env.tool("get_deal", { dealId: testId(999) })).toMatchObject({
      isError: true,
      text: "not found",
    });
    expect(await env.tool("get_deal", { dealId: "not-an-id" })).toMatchObject({ isError: true });
    // A listing lookup goes through the deal's own route: a service deal has none.
    expect(
      await env.tool("lookup_listing", { dealId: env.dealId, url: "https://shop.example/p/1" }),
    ).toMatchObject({ isError: true, text: "listings are for goods and digital products" });
    await env.app.close();
  });

  it("sends an invoice only after the seller approves and the agent passes the one-time code", async () => {
    const env = await agentDeal();
    const asked = await env.tool("request_send_invoice", { dealId: env.dealId, stage: 1 });
    expect(asked.isError).toBe(false);
    const requestId = String(asked.data?.requestId);
    expect(asked.data?.summary).toMatch(/^Send the PayPal invoice for payment stage 1 /);
    expect(env.drafts).toHaveLength(0);
    // The seller is told in the app and by email.
    expect((await listNotifications(db, env.seller.id)).map((n) => n.kind)).toEqual([
      "agent-request",
    ]);
    expect(env.sent.map((m) => m.kind)).toContain("notice-agent-request");

    expect(await env.tool("confirm_action", { requestId, code: "AAAAA-AAAAA" })).toMatchObject({
      isError: true,
      text: "the seller has not approved this request yet",
    });
    const open = await env.call("GET", `/api/agent-requests?dealId=${env.dealId}`, env.sellerToken);
    expect(open.json<{ requests: { id: string; status: string }[] }>().requests).toEqual([
      expect.objectContaining({ id: requestId, status: "waiting" }),
    ]);
    const approved = await env.call(
      "POST",
      `/api/agent-requests/${requestId}/approve`,
      env.sellerToken,
    );
    const code = approved.json<{ code: string }>().code;
    expect(code).toMatch(/^[A-Z2-9]{5}-[A-Z2-9]{5}$/);

    expect(await env.tool("confirm_action", { requestId, code: "WRONG-CODE1" })).toMatchObject({
      isError: true,
      text: "that is not the code for this request",
    });
    const done = await env.tool("confirm_action", { requestId, code });
    expect(done.data).toMatchObject({ requestId, status: "done", result: { status: 200 } });
    expect(env.drafts).toHaveLength(1);
    expect(await env.tool("confirm_action", { requestId, code })).toMatchObject({ isError: true });
    expect(await env.tool("get_request", { requestId })).toMatchObject({
      data: { status: "done" },
    });
    const types = (await readLedger(db, env.dealId)).map((e) => e.type);
    expect(types.slice(-4)).toEqual([
      "AGENT_REQUESTED",
      "AGENT_REQUEST_ANSWERED",
      "INVOICE_SENT",
      "AGENT_ACTED",
    ]);
    // The stage is sent now: asking again is refused.
    expect(await env.tool("request_send_invoice", { dealId: env.dealId, stage: 1 })).toMatchObject({
      isError: true,
      text: "this stage's invoice was already sent or paid",
    });
    await env.app.close();
  });

  it("lets only the seller signed in with PayPal see and answer requests", async () => {
    const env = await agentDeal();
    const asked = await env.tool("request_send_invoice", { dealId: env.dealId, stage: 2 });
    const requestId = String(asked.data?.requestId);
    const [, linkToken] = await buyerVisitors(db, env.dealId, env.buyer.id);
    expect((await env.call("GET", "/api/agent-requests", linkToken)).statusCode).toBe(403);
    expect(
      (await env.call("POST", `/api/agent-requests/${requestId}/approve`, linkToken)).statusCode,
    ).toBe(403);
    const buyerToken = await signedInAs(db, env.buyer.id);
    expect(
      (await env.call("POST", `/api/agent-requests/${requestId}/approve`, buyerToken)).statusCode,
    ).toBe(404);
    const declined = await env.call(
      "POST",
      `/api/agent-requests/${requestId}/decline`,
      env.sellerToken,
    );
    expect(declined.json()).toMatchObject({ request: { status: "declined" } });
    expect(declined.json()).not.toHaveProperty("code");
    expect(
      (await env.call("POST", `/api/agent-requests/${requestId}/approve`, env.sellerToken))
        .statusCode,
    ).toBe(409);
    expect(await env.tool("request_send_invoice", { dealId: env.dealId, stage: 9 })).toMatchObject({
      isError: true,
      text: "no such payment stage on the signed deal",
    });
    await env.app.close();
  });

  it("creates a draft deal from pasted text, counted against the key's daily limit", async () => {
    const env = await agentDeal();
    const made = await env.tool("create_deal_from_text", {
      text: "Chris: can you draw my character?\nMaya: yes, $240",
      title: "Character commission",
    });
    expect(made.data).toMatchObject({ status: "draft" });
    const created = (await readLedger(db, String(made.data?.dealId)))[0];
    expect(created?.payload).toMatchObject({ via: "agent", keyEnding: env.key.slice(-4) });
    expect(await env.tool("create_deal_from_text", { text: "   " })).toMatchObject({
      isError: true,
    });
    await env.app.close();
  });
});

describe("the agent call limit (9R-2)", () => {
  it("is counted in the shared store, per key and minute, so every server copy agrees", async () => {
    const deal = await createSignedTestDeal(db);
    const keys: string[] = [];
    const store = memoryStore();
    const counting = {
      ...store,
      hit: (key: string, windowSeconds: number) => {
        keys.push(key);
        return store.hit(key, windowSeconds);
      },
    };
    const env = dealTestApp(db, undefined, { store: counting });
    const { rpc } = await mcpClient(db, env.call, deal.seller.id);
    for (let n = 0; n < AGENT_CALLS_PER_MINUTE; n += 1) {
      expect((await rpc("tools/list")).status).toBe(200);
    }
    expect((await rpc("tools/list")).status).toBe(429);
    expect(new Set(keys).size).toBe(1);
    expect(keys[0]).toMatch(/^agent:[0-9a-f-]+:\d+$/);
    await env.app.close();
  }, 60_000);
});
