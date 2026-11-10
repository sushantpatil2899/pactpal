import { createDeal, createUser } from "@pactpal/db";
import { TEST_NOW, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { dealTestApp, signedInAs } from "../deals/test-app.js";
import { closePagesAfterEach, openLiveDeal, page } from "./live-test-support.js";

const db = useMigratedTestDatabase();
closePagesAfterEach();

interface NoteBody {
  notifications: { kind: string; tab: string; text: string; read: boolean; dealId: string }[];
}

describe("notifications", () => {
  it("tell the seller about a message while away, once per unread spell, by app and email", async () => {
    const deal = await openLiveDeal(db);
    const { app, call, sent } = dealTestApp(db);
    await call("POST", deal.chat, deal.buyerToken, { body: "Can we start Monday?" });
    await call("POST", deal.chat, deal.buyerToken, { body: "Also, blue please" });

    const listed = (await call("GET", "/api/notifications", deal.sellerToken)).json<NoteBody>();
    expect(listed.notifications).toEqual([
      expect.objectContaining({
        kind: "message",
        tab: "chat",
        text: "Buyer: Can we start Monday?",
        read: false,
        dealId: deal.dealId,
      }),
    ]);
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({
      kind: "notice-message",
      to: "maya@example.com",
      subject: 'New message: "Logo design"',
    });
    expect(sent[0]?.text).toContain(`https://pactpal.test/deals/${deal.dealId}#chat`);
    expect(sent[0]?.text).not.toContain("Monday");

    const read = await call("POST", "/api/notifications/read", deal.sellerToken, {
      dealId: deal.dealId,
    });
    expect(read.json()).toEqual({ changed: 1 });
    await call("POST", deal.chat, deal.buyerToken, { body: "Hello again" });
    expect(sent).toHaveLength(2);
    await app.close();
    await deal.app.close();
  });

  it("email the buyer with a fresh private link", async () => {
    const deal = await openLiveDeal(db);
    const { app, call, sent } = dealTestApp(db);
    await call("POST", deal.chat, deal.sellerToken, { body: "Draft is ready" });
    expect(sent[0]).toMatchObject({ to: "chris@example.com", kind: "notice-message" });
    expect(sent[0]?.text).toMatch(/https:\/\/pactpal\.test\/link#t=[\w-]+/);
    await app.close();
    await deal.app.close();
  });

  it("are shown live but not emailed while the person has the deal open, and settle when read", async () => {
    const deal = await openLiveDeal(db);
    const seller = page(deal.live(), deal.sellerToken);
    await seller.next("hello");
    await deal.call("POST", deal.chat, deal.buyerToken, { body: "Are you there?" });
    await seller.next("notify");
    const messages = await seller.next("messages");
    expect(deal.sent).toHaveLength(0);

    seller.send({ type: "read", seq: messages.messages.at(-1)?.seq ?? 0 });
    await seller.next("notify");
    const listed = (
      await deal.call("GET", "/api/notifications", deal.sellerToken)
    ).json<NoteBody>();
    expect(listed.notifications.map((n) => n.read)).toEqual([true]);
    await deal.app.close();
  });

  it("show a buyer-link visitor only their link's deal", async () => {
    const deal = await openLiveDeal(db);
    const other = await createUser(db, { id: testId(9), email: "x@example.com" }, TEST_NOW);
    const { deal: second } = await createDeal(
      db,
      {
        id: testId(101),
        sellerId: other.id,
        buyerId: deal.buyer.id,
        title: "Other",
        category: "art-and-design",
        currency: "USD",
      },
      TEST_NOW,
    );
    const { app, call } = dealTestApp(db);
    await call("POST", `/api/deals/${second.id}/chat`, await signedInAs(db, other.id), {
      body: "Hi",
    });
    await call("POST", deal.chat, deal.sellerToken, { body: "Hello" });
    const all = (
      await call("GET", "/api/notifications", await signedInAs(db, deal.buyer.id))
    ).json<NoteBody>();
    expect(all.notifications).toHaveLength(2);
    const byLink = (await call("GET", "/api/notifications", deal.buyerToken)).json<NoteBody>();
    expect(byLink.notifications.map((n) => n.dealId)).toEqual([deal.dealId]);
    expect(
      (await call("GET", `/api/notifications?dealId=${second.id}`, deal.buyerToken)).json(),
    ).toEqual({ notifications: [] });
    expect(
      (await call("POST", "/api/notifications/read", deal.buyerToken, { dealId: second.id }))
        .statusCode,
    ).toBe(404);
    expect(
      (
        await call("POST", "/api/notifications/read", deal.buyerToken, {
          dealId: second.id,
          tab: "timeline",
        })
      ).statusCode,
    ).toBe(404);
    await app.close();
    await deal.app.close();
  });

  it("refuse bad requests", async () => {
    const deal = await openLiveDeal(db);
    const { app, call } = dealTestApp(db);
    expect((await call("GET", "/api/notifications?dealId=x", deal.sellerToken)).statusCode).toBe(
      400,
    );
    expect(
      (await call("POST", "/api/notifications/read", deal.sellerToken, { ids: [] })).statusCode,
    ).toBe(400);
    expect(
      (
        await call("POST", "/api/notifications/read", deal.sellerToken, {
          dealId: deal.dealId,
          tab: "elsewhere",
        })
      ).statusCode,
    ).toBe(400);
    expect((await call("GET", "/api/notifications")).statusCode).toBe(401);
    const off = dealTestApp(undefined);
    expect((await off.call("GET", "/api/notifications")).statusCode).toBe(503);
    expect(
      (await off.call("POST", "/api/notifications/read", undefined, { ids: [] })).statusCode,
    ).toBe(503);
    await off.app.close();
    await app.close();
    await deal.app.close();
  });
});
