import {
  createAwaitingTestDeal,
  createPaidTestDeal,
  createSignedTestDeal,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors, dealTestApp, signedInAs } from "./test-app.js";

const db = useMigratedTestDatabase();

interface StepView {
  n: number;
  kind: string;
  state: string;
  waitingOn: string | null;
  next: string;
  canDo: string[];
  updates: { status: string; actor: string; note: string | null }[];
}
interface TimelineView {
  signed: boolean;
  version: number | null;
  steps: StepView[];
}

const STEPS = [
  { kind: "payment", stage: 1 },
  { kind: "review", text: "Pencil sketch" },
  { kind: "payment", stage: 2 },
] as const;

async function runningDeal() {
  const deal = await createSignedTestDeal(db, { timeline: [...STEPS] });
  const env = dealTestApp(db);
  const seller = await signedInAs(db, deal.seller.id);
  const [, buyer = ""] = await buyerVisitors(db, deal.dealId, deal.buyer.id);
  const url = `/api/deals/${deal.dealId}/timeline`;
  const read = async (who: string) => (await env.call("GET", url, who)).json<TimelineView>();
  const act = (who: string, step: number, body: object) =>
    env.call("POST", `${url}/${String(step)}`, who, body);
  return { ...deal, ...env, sellerToken: seller, buyerToken: buyer, url, read, act };
}

describe("the running timeline (7k)", () => {
  it("shows each step's state, who it waits for and what each side may do", async () => {
    const env = await runningDeal();
    const seen = await env.read(env.sellerToken);
    expect(seen).toMatchObject({ signed: true, version: 1 });
    expect(seen.steps.map((s) => [s.kind, s.state, s.waitingOn, s.canDo])).toEqual([
      ["payment", "open", "seller", []],
      ["review", "open", "seller", ["submitted"]],
      ["payment", "open", "seller", []],
    ]);
    expect((await env.read(env.buyerToken)).steps[1]?.canDo).toEqual([]);
    await env.app.close();
  });

  it("records a shared review and its approval, with a chat card and a notice to the other side", async () => {
    const env = await runningDeal();
    const shared = await env.act(env.sellerToken, 2, { status: "submitted", note: "Two poses" });
    expect(shared.statusCode).toBe(200);
    expect(shared.json<TimelineView>().steps[1]).toMatchObject({
      state: "submitted",
      waitingOn: "buyer",
      updates: [{ status: "submitted", actor: "seller", note: "Two poses" }],
    });
    // The buyer is emailed (the step waits for them) and finds a card in the chat.
    expect(env.sent.map((m) => [m.kind, m.to])).toEqual([["notice-step", "chris@example.com"]]);
    const chat = await env.call("GET", `/api/deals/${env.dealId}/chat`, env.buyerToken);
    expect(chat.json<{ messages: { body: string; notice: unknown }[] }>().messages).toEqual([
      expect.objectContaining({
        body: 'Maya Seller shared step 2 (Review (seller shares, buyer approves): "Pencil sketch") for review.',
        notice: { type: "step", step: 2 },
      }),
    ]);
    expect((await env.read(env.buyerToken)).steps[1]?.canDo).toEqual(["approved", "changes"]);

    const approved = await env.act(env.buyerToken, 2, { status: "approved" });
    expect(approved.json<TimelineView>().steps[1]).toMatchObject({
      state: "done",
      waitingOn: null,
    });
    // Approval waits for nobody, so no email; the seller sees it in the app, as news.
    expect(env.sent).toHaveLength(1);
    const notes = async (token: string) =>
      (await env.call("GET", `/api/notifications?dealId=${env.dealId}`, token)).json<{
        notifications: { kind: string; read: boolean }[];
      }>().notifications;
    expect((await notes(env.buyerToken)).map((n) => n.kind)).toEqual(["step"]);
    expect((await notes(env.sellerToken)).map((n) => n.kind)).toEqual(["step-news"]);
    // Opening the Timeline tab settles the news, not what waits for the person.
    const openTab = (token: string) =>
      env.call("POST", "/api/notifications/read", token, { dealId: env.dealId, tab: "timeline" });
    expect((await openTab(env.sellerToken)).json()).toEqual({ changed: 1 });
    expect((await openTab(env.buyerToken)).json()).toEqual({ changed: 0 });
    expect((await notes(env.buyerToken)).map((n) => n.read)).toEqual([false]);
    await env.app.close();
  });

  it("follows PayPal: a paid stage's payment step is done", async () => {
    const deal = await createPaidTestDeal(db, {}, { timeline: [...STEPS] });
    const env = dealTestApp(db);
    const token = await signedInAs(db, deal.seller.id);
    const seen = (
      await env.call("GET", `/api/deals/${deal.dealId}/timeline`, token)
    ).json<TimelineView>();
    expect(seen.steps.map((s) => [s.state, s.waitingOn, s.next])).toEqual([
      ["done", null, ""],
      ["open", "seller", "Share it for review"],
      ["open", "seller", "Send the PayPal invoice"],
    ]);
    await env.app.close();
  });

  it("refuses the wrong side and unknown steps", async () => {
    const env = await runningDeal();
    expect((await env.act(env.buyerToken, 2, { status: "submitted" })).json()).toEqual({
      error: "that is not the next thing for you on this step",
    });
    expect((await env.act(env.sellerToken, 9, { status: "done" })).statusCode).toBe(404);
    expect((await env.act(env.sellerToken, 0, { status: "done" })).statusCode).toBe(404);
    expect((await env.act(env.sellerToken, 2, { status: "finished" })).statusCode).toBe(400);
    await env.app.close();
  });

  it("waits for the buyer's signature", async () => {
    const awaiting = await createAwaitingTestDeal(db, {});
    const other = dealTestApp(db);
    const token = await signedInAs(db, awaiting.seller.id);
    const url = `/api/deals/${awaiting.dealId}/timeline`;
    expect((await other.call("GET", url, token)).json()).toEqual({
      signed: false,
      version: null,
      currency: "USD",
      steps: [],
    });
    expect((await other.call("POST", `${url}/1`, token, { status: "done" })).statusCode).toBe(409);
    await other.app.close();
  });
});
