import { parseServerFrame, type ServerFrame } from "@pactpal/live";
import { afterEach } from "vitest";
import WebSocket from "ws";
import type { Database } from "@pactpal/db";
import { createTestDeal } from "@pactpal/db/testing";
import { SESSION_COOKIE } from "../auth/sign-in.js";
import { buyerVisitors, dealTestApp, signedInAs } from "../deals/test-app.js";

/** Test code only: the test app's own address, from which pages may connect. */
const ORIGIN = "https://pactpal.test";
const opened: { close(): void }[] = [];

/** Closes every page a test opened, after each test of the file. */
export function closePagesAfterEach() {
  afterEach(() => {
    for (const socket of opened.splice(0)) socket.close();
  });
}

/** A connected page: every frame it got, and a way to wait for one. */
export function page(url: string, token: string | undefined, origin = ORIGIN) {
  const frames: ServerFrame[] = [];
  const waiters: { match: (f: ServerFrame) => boolean; resolve: (f: ServerFrame) => void }[] = [];
  const socket = new WebSocket(url, {
    headers: { origin, ...(token ? { cookie: `${SESSION_COOKIE}=${token}` } : {}) },
  });
  opened.push(socket);
  // Closing a socket that never opened reports an error; the tests read refusals elsewhere.
  socket.on("error", () => undefined);
  socket.on("message", (data: Buffer) => {
    const frame = parseServerFrame(data.toString("utf8"));
    if (!frame) throw new Error(`unreadable frame ${data.toString("utf8")}`);
    // A frame goes to the first step waiting for it, or into the buffer for a later one.
    const waiter = waiters.find((w) => w.match(frame));
    if (waiter) {
      waiters.splice(waiters.indexOf(waiter), 1);
      waiter.resolve(frame);
    } else {
      frames.push(frame);
    }
  });
  const next = <T extends ServerFrame["type"]>(
    type: T,
    match: (frame: Extract<ServerFrame, { type: T }>) => boolean = () => true,
  ) =>
    new Promise<Extract<ServerFrame, { type: T }>>((resolve) => {
      const test = (frame: ServerFrame) =>
        frame.type === type && match(frame as Extract<ServerFrame, { type: T }>);
      const earlier = frames.find(test);
      if (earlier) {
        frames.splice(frames.indexOf(earlier), 1);
        resolve(earlier as Extract<ServerFrame, { type: T }>);
        return;
      }
      waiters.push({
        match: test,
        resolve: (f) => {
          resolve(f as Extract<ServerFrame, { type: T }>);
        },
      });
    });
  const send = (frame: object | string) => {
    socket.send(typeof frame === "string" ? frame : JSON.stringify(frame));
  };
  const closed = new Promise<number>((resolve) =>
    socket.on("close", (code) => {
      resolve(code);
    }),
  );
  const refused = new Promise<number>((resolve) =>
    socket.on("unexpected-response", (_request, response) => {
      resolve(response.statusCode ?? 0);
    }),
  );
  return { socket, frames, next, send, closed, refused };
}

/** The test deal with its app listening on a free port, tokens for both sides and its addresses. */
export async function openLiveDeal(db: Database) {
  const deal = await createTestDeal(db);
  const [, buyerLink] = await buyerVisitors(db, deal.dealId, deal.buyer.id);
  const { app, call, sent } = dealTestApp(db);
  const address = await app.listen({ port: 0, host: "127.0.0.1" });
  return {
    ...deal,
    app,
    call,
    sent,
    sellerToken: await signedInAs(db, deal.seller.id),
    buyerToken: buyerLink ?? "",
    live: (after = 0) =>
      `${address.replace("http", "ws")}/api/deals/${deal.dealId}/live?after=${String(after)}`,
    chat: `/api/deals/${deal.dealId}/chat`,
  };
}
