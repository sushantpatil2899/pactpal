import { postNotice } from "@pactpal/db";
import { createTestDeal, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import type { ServerFrame } from "@pactpal/live";
import { describe, expect, it, vi } from "vitest";
import { memoryBus, postgresBus, type BusSignal, type Listen } from "./bus.js";
import { LiveHub, type LivePage } from "./live-hub.js";

const db = useMigratedTestDatabase();
const settle = () => new Promise((resolve) => setTimeout(resolve, 10));

/** A card in the deal's chat, written directly, as the background worker would. */
const addCard = (dealId: string) =>
  db.transaction((tx) =>
    postNotice(
      tx,
      { id: testId(600), dealId, body: "x", notice: { type: "step", step: 1 } },
      new Date(),
    ),
  );

/** A stand-in `listen`: the test fires notifications, failures and (re)starts by hand. */
function fakeListen() {
  let handlers: Parameters<Listen>[0] | undefined;
  const close = vi.fn(() => Promise.resolve());
  const listen: Listen = (given) => {
    handlers = given;
    return { close };
  };
  const on = () => {
    if (!handlers) throw new Error("not listening");
    return handlers;
  };
  return { listen, on, close };
}

describe("the chat bus", () => {
  it("in memory, delivers to every listener after the publisher continues", async () => {
    const bus = memoryBus();
    const got: BusSignal[] = [];
    const stop = bus.subscribe((signal) => got.push(signal));
    const sent = bus.publish({ type: "messages", dealId: testId(100) });
    expect(got).toEqual([]);
    await sent;
    expect(got).toEqual([{ type: "messages", dealId: testId(100) }]);
    stop();
    await bus.publish({ type: "notify", userId: testId(1) });
    expect(got).toHaveLength(1);
    await bus.close();
  });

  it("over Postgres, sends with pg_notify and delivers what comes back, once", async () => {
    const { listen, on, close } = fakeListen();
    const warn = vi.fn();
    const bus = postgresBus(db, listen, { warn });
    const got: BusSignal[] = [];
    bus.subscribe((signal) => got.push(signal));
    expect(on().channel).toBe("pactpal_chat");
    await bus.publish({ type: "messages", dealId: testId(100) });
    expect(got).toEqual([]);

    on().onNotification(JSON.stringify({ type: "messages", dealId: testId(100) }));
    on().onNotification("not json");
    expect(got).toEqual([{ type: "messages", dealId: testId(100) }]);
    expect(warn).toHaveBeenCalledWith({}, "Unreadable chat event ignored");

    // The first start is not a resync; a restart after a failure is.
    on().onListening();
    on().onError(new Error("connection lost"));
    on().onListening();
    expect(got.at(-1)).toEqual({ type: "resync" });
    expect(got.filter((s) => s.type === "resync")).toHaveLength(1);
    await bus.close();
    expect(close).toHaveBeenCalled();
  });
});

describe("the live hub", () => {
  /** The test deal and a hub on this copy ("here") with an in-memory bus. */
  async function hubOnTestDeal() {
    const deal = await createTestDeal(db);
    const bus = memoryBus();
    const warn = vi.fn();
    const hub = new LiveHub({ db, bus, serverId: "here", clock: () => new Date(), log: { warn } });
    return { deal, bus, warn, hub };
  }

  function testPage(dealId: string, userId: string, role: "seller" | "buyer") {
    const frames: ServerFrame[] = [];
    const page: LivePage = { dealId, userId, role, send: (frame) => frames.push(frame) };
    return { page, frames };
  }

  it("counts pages on other server copies as online, and re-sends after a resync", async () => {
    const { deal, bus, hub } = await hubOnTestDeal();
    const seller = testPage(deal.dealId, deal.seller.id, "seller");
    await hub.join(seller.page, 0);

    await bus.publish({
      type: "presence",
      dealId: deal.dealId,
      role: "buyer",
      online: true,
      server: "there",
    });
    expect(seller.frames.at(-1)).toEqual({ type: "presence", role: "buyer", online: true });
    await bus.publish({
      type: "presence",
      dealId: deal.dealId,
      role: "buyer",
      online: false,
      server: "there",
    });
    expect(seller.frames.at(-1)).toEqual({ type: "presence", role: "buyer", online: false });

    await addCard(deal.dealId);
    await bus.publish({ type: "notify", userId: deal.seller.id });
    expect(seller.frames.some((f) => f.type === "messages")).toBe(false);
    await (bus as unknown as { publish(s: BusSignal): Promise<void> }).publish({ type: "resync" });
    await settle();
    expect(seller.frames.at(-1)).toMatchObject({ type: "messages", messages: [{ seq: 1 }] });
    expect(hub.pageCount()).toBe(1);
    hub.close();
  });

  it("logs a failed send instead of throwing", async () => {
    const { deal, bus, warn, hub } = await hubOnTestDeal();
    const broken: LivePage = {
      dealId: deal.dealId,
      userId: deal.seller.id,
      role: "seller",
      send: (frame) => {
        if (frame.type === "messages") throw new Error("socket gone");
      },
    };
    await hub.join(broken, 0);
    await addCard(deal.dealId);
    await bus.publish({ type: "messages", dealId: deal.dealId });
    await settle();
    expect(warn).toHaveBeenCalledWith(
      { err: "socket gone" },
      "Could not send chat messages to a page",
    );
    hub.close();
  });
});
