import { markInvoiceSent, readLedger, redeemDealLink, startInvoice } from "@pactpal/db";
import {
  TEST_NOW,
  createSignedTestDeal,
  createTestDeal,
  testId,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors, dealTestApp, signedInAs } from "./test-app.js";

const db = useMigratedTestDatabase();

interface OrderView {
  id: string;
  status: string;
  fromVersion: number;
  toVersion: number;
  message: string | null;
  reason: string | null;
  change: {
    addedLines: { text: string; mark: unknown }[];
    addedStages: { stage: number; title: string; amount: { text: string } }[];
    total: { from: { text: string }; to: { text: string } };
  };
  document?: { terms: { version: number; deliverables: string[] } };
  documentSha256?: string;
}
interface View {
  signed: boolean;
  signedVersion: number | null;
  canPropose: boolean;
  orders: OrderView[];
}

/** Online ordering: one line that can be checked and a third payment stage. */
const ORDERING = {
  addLines: [{ text: "Online ordering page", mark: { kind: "objective" } }],
  addStages: [{ title: "Ordering", amount: "400" }],
  message: "Online ordering, as you asked",
};

/** A signed deal, the app, the seller and the buyer (by link). */
async function signedDeal() {
  const deal = await createSignedTestDeal(db);
  const env = dealTestApp(db, undefined, { trustProxyHops: 1 });
  const seller = await signedInAs(db, deal.seller.id);
  const [, buyer = ""] = await buyerVisitors(db, deal.dealId, deal.buyer.id);
  const base = `/api/deals/${deal.dealId}/change-orders`;
  const list = async (who: string) => (await env.call("GET", base, who)).json<View>();
  const propose = (body: object = ORDERING) => env.call("POST", base, seller, body);
  /** The buyer signs the waiting change as shown to them. */
  const sign = async () => {
    const waiting = (await list(buyer)).orders.find((o) => o.status === "proposed");
    return env.call("POST", `${base}/${waiting?.id ?? ""}/accept`, buyer, {
      documentSha256: waiting?.documentSha256,
      typedName: "Chris Buyer",
    });
  };
  return { ...deal, ...env, sellerId: deal.seller.id, seller, buyer, base, list, propose, sign };
}

describe("change orders", () => {
  it("are proposed by the seller and signed by the buyer, becoming the signed version", async () => {
    const env = await signedDeal();
    const { app, call, base, seller, buyer, list, propose, sign, dealId, sent } = env;
    expect((await list(seller)).canPropose).toBe(true);
    expect((await propose()).statusCode).toBe(200);

    const seen = await list(buyer);
    expect(seen).toMatchObject({ signed: true, signedVersion: 1, canPropose: false });
    expect(seen.orders[0]).toMatchObject({
      status: "proposed",
      fromVersion: 1,
      toVersion: 2,
      message: "Online ordering, as you asked",
      change: {
        addedLines: [{ text: "Online ordering page", mark: { kind: "objective" } }],
        addedStages: [{ stage: 3, title: "Ordering", amount: { text: "400.00" } }],
        total: { from: { text: "250.00" }, to: { text: "650.00" } },
      },
      document: { terms: { version: 2 } },
    });
    // Until signed, the agreement shown is still version 1.
    const scopeBefore = await call("GET", `/api/deals/${dealId}/scope`, buyer);
    expect(scopeBefore.json()).toMatchObject({ scope: { version: 1 } });

    const signed = await sign();
    expect(signed.statusCode).toBe(200);
    expect(signed.json<View>()).toMatchObject({ signedVersion: 2, canPropose: false });
    expect(signed.json<View>().orders[0]).toMatchObject({
      status: "accepted",
      acceptedBy: "Chris Buyer",
    });
    expect((await call("GET", `/api/deals/${dealId}/scope`, buyer)).json()).toMatchObject({
      scope: {
        version: 2,
        deliverables: ["Full-body character, transparent PNG", "Online ordering page"],
      },
    });
    expect((await call("GET", `/api/deals/${dealId}/acceptance`, seller)).json()).toMatchObject({
      accepted: { version: 2, typedName: "Chris Buyer" },
    });
    // The receipt of version 2 is emailed to both sides.
    expect(
      sent
        .filter((m) => m.kind === "receipt")
        .map((m) => m.to)
        .sort(),
    ).toEqual(["chris@example.com", "maya@example.com"]);
    const entries = await readLedger(db, dealId);
    expect(entries.map((e) => e.type)).toContain("CHANGE_ORDER_ACCEPTED");
    expect(entries.find((e) => e.type === "CHANGE_ORDER_ACCEPTED")).toMatchObject({
      actor: "buyer",
      payload: { version: 2, fromVersion: 1, typedName: "Chris Buyer" },
    });
    expect((await list(seller)).canPropose).toBe(true);
    // A second answer is refused.
    const again = await call(
      "POST",
      `${base}/${signed.json<View>().orders[0]?.id ?? ""}/decline`,
      buyer,
      {},
    );
    expect(again.statusCode).toBe(409);
    await app.close();
  });

  it("can be declined with a reason, keeping the signed agreement", async () => {
    const { app, call, base, buyer, seller, list, propose, dealId } = await signedDeal();
    await propose({ addExclusions: ["Blog"], message: "A blog too?" });
    const [waiting] = (await list(buyer)).orders;
    const declined = await call("POST", `${base}/${waiting?.id ?? ""}/decline`, buyer, {
      reason: "No blog, thanks",
    });
    expect(declined.json<View>().orders[0]).toMatchObject({
      status: "declined",
      reason: "No blog, thanks",
    });
    expect((await call("GET", `/api/deals/${dealId}/scope`, seller)).json()).toMatchObject({
      scope: { version: 1 },
    });
    const entry = (await readLedger(db, dealId)).find((e) => e.type === "CHANGE_ORDER_DECLINED");
    expect(entry).toMatchObject({
      actor: "buyer",
      payload: { version: 2, reason: "No blog, thanks" },
    });
    await app.close();
  });

  it("can be withdrawn by the seller, and only the right side can answer", async () => {
    const { app, call, base, buyer, seller, list, propose } = await signedDeal();
    await propose();
    const [waiting] = (await list(seller)).orders;
    const id = waiting?.id ?? "";
    expect((await call("POST", `${base}/${id}/withdraw`, buyer)).statusCode).toBe(403);
    expect(
      (
        await call("POST", `${base}/${id}/accept`, seller, {
          documentSha256: "0".repeat(64),
          typedName: "Maya",
        })
      ).statusCode,
    ).toBe(403);
    const withdrawn = await call("POST", `${base}/${id}/withdraw`, seller);
    expect(withdrawn.json<View>().orders[0]?.status).toBe("withdrawn");
    expect((await call("POST", `${base}/${testId(999)}/withdraw`, seller)).statusCode).toBe(404);
    await app.close();
  });

  it("refuse what is not an addition, bad amounts and stages, a stale page and a second change", async () => {
    const { app, call, base, buyer, propose } = await signedDeal();
    expect((await propose({ message: "Nothing really" })).json()).toEqual({
      error: "invalid",
      fields: ["nothing"],
    });
    expect((await propose({ addStages: [{ title: "Extra", amount: "abc" }] })).json()).toEqual({
      error: "invalid",
      fields: ["addStages.0.amount"],
    });
    expect(
      (
        await propose({
          addLines: [{ text: "Hand-drawn feel", mark: { kind: "subjective", approvalStage: 4 } }],
        })
      ).json(),
    ).toEqual({ error: "invalid", fields: ["addLines.0.mark.approvalStage"] });
    expect((await propose({ revisionsIncluded: 2 })).json()).toEqual({
      error: "invalid",
      fields: ["revisionsIncluded"],
    });
    await propose();
    expect((await propose()).json()).toEqual({
      error: "a change is already waiting for the buyer",
    });
    const waiting = (await call("GET", base, buyer)).json<View>().orders[0];
    const stale = await call("POST", `${base}/${waiting?.id ?? ""}/accept`, buyer, {
      documentSha256: "0".repeat(64),
      typedName: "Chris Buyer",
    });
    expect(stale.statusCode).toBe(409);
    await app.close();
  });

  it("need a signed deal", async () => {
    const { seller, dealId } = await createTestDeal(db);
    const { app, call } = dealTestApp(db);
    const token = await signedInAs(db, seller.id);
    const res = await call("POST", `/api/deals/${dealId}/change-orders`, token, ORDERING);
    expect(res.statusCode).toBe(409);
    expect((await call("GET", `/api/deals/${dealId}/change-orders`, token)).json()).toMatchObject({
      signed: false,
      canPropose: false,
      orders: [],
    });
    await app.close();
  });

  it("keep a stage's invoice across versions in the payment stages", async () => {
    const { app, call, seller, propose, sign, dealId, sellerId, scope } = await signedDeal();
    // Stage 1 was invoiced under version 1.
    const key = { dealId, version: 1, stage: 1, sellerId };
    await startInvoice(
      db,
      {
        ...key,
        amountMinor: 12_000,
        currency: "USD",
        requestId: `pp-${dealId}-v1-s1`,
        invoiceSha256: "a".repeat(64),
      },
      TEST_NOW,
    );
    await markInvoiceSent(
      db,
      {
        ...key,
        invoiceId: "INV2-STAGE-ONE",
        transport: "rest",
        recipientEmail: "chris@example.com",
        contentSha256: scope.contentSha256,
      },
      TEST_NOW,
    );
    await propose();
    await sign();
    const stages = (await call("GET", `/api/deals/${dealId}/milestones`, seller)).json<{
      stages: { stage: number; status: string }[];
    }>().stages;
    expect(stages.map((s) => [s.stage, s.status])).toEqual([
      [1, "sent"],
      [2, "not_invoiced"],
      [3, "not_invoiced"],
    ]);
    await app.close();
  });
});

describe("change order emails", () => {
  it("email the buyer the change with a working private link, and the seller each answer", async () => {
    const env = await signedDeal();
    const { app, call, base, propose, sign, sent } = env;
    const proposed = await propose();
    expect(proposed.json()).toMatchObject({ buyerEmail: "sent" });
    const [notice] = sent.filter((m) => m.kind === "change-proposed");
    expect(notice).toMatchObject({
      to: "chris@example.com",
      subject: 'Change proposed: "Logo design" (version 2)',
    });
    expect(notice?.idempotencyKey).toMatch(/^change:[0-9a-f-]{36}:[0-9a-f]{16}$/);
    expect(notice?.text).toContain("- Added: Online ordering page (can be checked)");
    expect(notice?.text).toContain('Message from Maya Seller: "Online ordering, as you asked"');
    // The link opens the deal for the buyer, who sees the change waiting.
    const token = /link#t=([\w-]{43})/.exec(notice?.text ?? "")?.[1] ?? "";
    const redeemed = await redeemDealLink(db, token, TEST_NOW);
    if (!redeemed.ok) throw new Error("the emailed link did not work");
    const seen = (await call("GET", base, redeemed.session.token)).json<View>();
    expect(seen.orders[0]?.status).toBe("proposed");

    await sign();
    const [accepted] = sent.filter((m) => m.kind === "change-accepted");
    expect(accepted).toMatchObject({
      to: "maya@example.com",
      subject: 'Change accepted: "Logo design" (now version 2)',
    });
    expect(accepted?.idempotencyKey).toMatch(/^change-answer:/);
    expect(accepted?.text).toContain("You can send the invoice for the new payment stages");

    await propose({ addExclusions: ["Blog"] });
    const waiting = (await call("GET", base, env.buyer))
      .json<View>()
      .orders.find((o) => o.status === "proposed");
    await call("POST", `${base}/${waiting?.id ?? ""}/decline`, env.buyer, {
      reason: "No blog, thanks",
    });
    const [declined] = sent.filter((m) => m.kind === "change-declined");
    expect(declined?.text).toContain('Their reason: "No blog, thanks"');
    // Withdrawing emails nobody.
    const before = sent.length;
    await propose({ addExclusions: ["Printing"] });
    const third = (await call("GET", base, env.seller))
      .json<View>()
      .orders.find((o) => o.status === "proposed");
    await call("POST", `${base}/${third?.id ?? ""}/withdraw`, env.seller);
    expect(sent.length).toBe(before + 1);
    await app.close();
  });

  it("keep the change when the buyer's email fails, and say so", async () => {
    const env = await signedDeal();
    env.failEmailTo.add("chris@example.com");
    const res = await env.propose();
    expect(res.json()).toMatchObject({ buyerEmail: "failed" });
    expect(res.json<View>().orders[0]?.status).toBe("proposed");
    expect(env.logs.join("")).not.toContain("chris@example.com");
    await env.app.close();
  });

  it("say when email is off", async () => {
    const deal = await createSignedTestDeal(db);
    const { app, call } = dealTestApp(db, undefined, { emailOff: true });
    const seller = await signedInAs(db, deal.seller.id);
    const res = await call("POST", `/api/deals/${deal.dealId}/change-orders`, seller, ORDERING);
    expect(res.json()).toMatchObject({ buyerEmail: "off" });
    await app.close();
  });
});
