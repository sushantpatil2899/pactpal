import { createUser, readLedger } from "@pactpal/db";
import { TEST_NOW, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { signedInAs } from "../deals/test-app.js";
import { closePagesAfterEach, openLiveDeal, page } from "./live-test-support.js";
import { originAllowed } from "./live-routes.js";

const db = useMigratedTestDatabase();
closePagesAfterEach();
const liveDeal = () => openLiveDeal(db);

describe("the live chat", () => {
  it("sends messages, typing, presence and reading to the other side at once", async () => {
    const deal = await liveDeal();
    const seller = page(deal.live(), deal.sellerToken);
    expect(await seller.next("hello")).toEqual({
      type: "hello",
      role: "seller",
      online: { seller: true, buyer: false },
      read: { seller: 0, buyer: 0 },
    });

    const buyer = page(deal.live(), deal.buyerToken);
    expect((await buyer.next("hello")).online).toEqual({ seller: true, buyer: true });
    expect(await seller.next("presence")).toEqual({
      type: "presence",
      role: "buyer",
      online: true,
    });

    await deal.call("POST", deal.chat, deal.sellerToken, { body: "Logo by Friday?" });
    const arrived = await buyer.next("messages");
    expect(arrived.messages).toMatchObject([{ seq: 1, role: "seller", body: "Logo by Friday?" }]);
    // The sender's own page gets it too, so a second tab stays in step.
    expect((await seller.next("messages")).messages).toHaveLength(1);

    buyer.send({ type: "typing", typing: true });
    expect(await seller.next("typing")).toEqual({ type: "typing", role: "buyer", typing: true });
    buyer.send({ type: "read", seq: 1 });
    expect(await seller.next("read")).toEqual({ type: "read", role: "buyer", seq: 1 });
    expect(await buyer.next("read")).toEqual({ type: "read", role: "buyer", seq: 1 });
    buyer.send({ type: "ping" });
    expect(await buyer.next("pong")).toEqual({ type: "pong" });

    buyer.socket.close();
    expect(await seller.next("presence", (f) => !f.online)).toEqual({
      type: "presence",
      role: "buyer",
      online: false,
    });
    const reads = (await readLedger(db, deal.dealId)).filter((e) => e.type === "MESSAGES_READ");
    expect(reads.map((entry) => entry.payload)).toEqual([{ upToSeq: 1 }]);
    await deal.app.close();
  });

  it("sends a reconnecting page only what it missed", async () => {
    const deal = await liveDeal();
    for (const body of ["one", "two", "three"]) {
      await deal.call("POST", deal.chat, deal.sellerToken, { body });
    }
    const buyer = page(deal.live(2), deal.buyerToken);
    expect((await buyer.next("messages")).messages.map((m) => m.body)).toEqual(["three"]);
    await deal.app.close();
  });

  it("refuses other sites, signed-out visitors and strangers before connecting", async () => {
    const deal = await liveDeal();
    await createUser(db, { id: testId(9), email: "x@example.com" }, TEST_NOW);
    const stranger = await signedInAs(db, testId(9));
    expect(await page(deal.live(), deal.sellerToken, "https://evil.example").refused).toBe(403);
    expect(await page(deal.live(), undefined).refused).toBe(401);
    expect(await page(deal.live(), stranger).refused).toBe(404);
    expect(await page(deal.live().replace("after=0", "after=x"), deal.sellerToken).refused).toBe(
      400,
    );
    await deal.app.close();
  });

  it("disconnects a page that sends something other than its three frames", async () => {
    const deal = await liveDeal();
    const seller = page(deal.live(), deal.sellerToken);
    await seller.next("hello");
    seller.send({ type: "message", body: "sent through the socket" });
    expect(await seller.closed).toBe(1008);
    const again = page(deal.live(), deal.sellerToken);
    await again.next("hello");
    again.send("x".repeat(2000));
    expect(await again.closed).toBe(1009);
    await deal.app.close();
  });
});

describe("which pages may connect", () => {
  it.each([
    ["the site's own address", "https://pactpal.test", "internal:3000", true],
    ["the host it reached", "http://localhost:5173", "localhost:5173", true],
    ["another site", "https://evil.example", "localhost:5173", false],
    ["no origin", undefined, "localhost:5173", false],
    ["an unreadable origin", "::::", "localhost:5173", false],
  ])("%s", (_name, origin, host, expected) => {
    expect(originAllowed(origin, host, "https://pactpal.test")).toBe(expected);
  });

  it("uses the host alone when the site's address is not set", () => {
    expect(originAllowed("http://localhost:3000", "localhost:3000", undefined)).toBe(true);
    expect(originAllowed("http://localhost:3000", undefined, undefined)).toBe(false);
  });
});
