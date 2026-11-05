import { FakeChatClient, testSpec } from "@pactpal/ai/testing";
import type { ChatOutcome, ChatRequest } from "@pactpal/ai";
import { readLedger } from "@pactpal/db";
import {
  TEST_NOW,
  addTestFile,
  createSignedTestDeal,
  createTestDeal,
  testId,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { png } from "@pactpal/delivery-check/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors, dealTestApp, signedInAs, testDrafting } from "./test-app.js";

const db = useMigratedTestDatabase();

interface ReadView {
  text: string;
  unreadable: number;
  screenshots: { fileId: string; filename: string; read: boolean; messages: number }[];
}

const FAILED: ChatOutcome = {
  ok: false,
  model: "x",
  kind: "rate_limited",
  message: "x: rate limited",
  status: 429,
};

/** A stand-in image model answering by screenshot number ("Screenshot 2 of 3."). */
const model = (name: string, answer: (n: number) => unknown, vision = true) =>
  new FakeChatClient(testSpec({ name, vision }), (request: ChatRequest) => {
    const n = Number(/Screenshot (\d+)/.exec(request.messages[1]?.content ?? "")?.[1]);
    const value = answer(n);
    return typeof value === "object" && value !== null && "ok" in value
      ? (value as ChatOutcome)
      : JSON.stringify(value);
  });

const PAGES: Record<number, unknown> = {
  1: { messages: [{ speaker: "Rosa", text: "I need a website for my bakery" }] },
  2: {
    messages: [
      { speaker: "Daniel", text: "It's $900 in total" },
      { speaker: "Rosa", text: "Menu text by [unreadable] November" },
    ],
  },
};

/** A deal in draft with two screenshots (ids 601, 602) and a chat file (603), and the app. */
async function draftDeal(clients: FakeChatClient[] | undefined, make = createTestDeal) {
  const deal = await make(db);
  const add = (n: number, filename: string, bytes: Uint8Array) =>
    addTestFile(db, deal, { id: testId(600 + n), kind: "source", filename, bytes }, TEST_NOW);
  await add(1, "IMG_1.png", png({ width: 2, height: 2 }));
  await add(2, "IMG_2.png", png({ width: 2, height: 2 }));
  await add(3, "chat.txt", new TextEncoder().encode("Rosa: hi"));
  const env = dealTestApp(db, testDrafting(clients));
  const seller = await signedInAs(db, deal.seller.id);
  const url = `/api/deals/${deal.dealId}/screenshots/read`;
  const copy = (fileId: string) => ({ fileId, mediaType: "image/jpeg", base64: "/9j/4AAQ" });
  const read = (fileIds = [testId(601), testId(602)], who = seller, copies = fileIds.map(copy)) =>
    env.call("POST", url, who, { fileIds, copies });
  return { ...env, ...deal, seller, read };
}

describe("reading chat screenshots", () => {
  it("joins the screenshots' messages in order, for the seller only, logging nothing", async () => {
    const qwen = model("qwen-groq", (n) => PAGES[n]);
    const textOnly = model("gpt-oss-groq", (n) => PAGES[n], false);
    const env = await draftDeal([textOnly, qwen]);
    const logged = (await readLedger(db, env.dealId)).length;
    const res = await env.read();
    expect(res.statusCode).toBe(200);
    expect(res.json<ReadView>()).toEqual({
      text: "Rosa: I need a website for my bakery\nDaniel: It's $900 in total\nRosa: Menu text by [unreadable] November",
      unreadable: 1,
      screenshots: [
        { fileId: testId(601), filename: "IMG_1.png", read: true, messages: 1 },
        { fileId: testId(602), filename: "IMG_2.png", read: true, messages: 2 },
      ],
    });
    expect(qwen.requests[1]?.messages[1]).toMatchObject({
      content: "Screenshot 2 of 2.",
      images: [{ base64: "/9j/4AAQ" }],
    });
    expect(textOnly.requests).toHaveLength(0);
    expect(await readLedger(db, env.dealId)).toHaveLength(logged);
    expect(env.logs.join("\n")).not.toMatch(/bakery|IMG_1/);
    const [, buyer = ""] = await buyerVisitors(db, env.dealId, env.buyer.id);
    expect((await env.read(undefined, buyer)).statusCode).toBe(403);
  });

  it("try the next image model when a reply fails, and say which screenshot none could read", async () => {
    const first = model("qwen-groq", (n) =>
      n === 2 ? { messages: [{ speaker: "", text: "x" }] } : PAGES[n],
    );
    const second = model("gemini", (n) => (n === 2 ? FAILED : PAGES[n]));
    const env = await draftDeal([first, second]);
    const view = (await env.read()).json<ReadView>();
    expect(view.screenshots.map((s) => s.read)).toEqual([true, false]);
    expect(view.text).toBe("Rosa: I need a website for my bakery");
    // A screenshot with no copy from the browser is not read.
    const noCopy = (await env.read([testId(601)], env.seller, [])).json<ReadView>();
    expect(noCopy).toMatchObject({ text: "", screenshots: [{ read: false, messages: 0 }] });
  });

  it("are refused for other files, without an image model, and once the work is no longer a draft", async () => {
    const env = await draftDeal([model("qwen-groq", (n) => PAGES[n])]);
    expect((await env.read([testId(603)])).statusCode).toBe(400);
    expect((await env.read([testId(699)])).statusCode).toBe(400);
    expect((await env.read([testId(601), testId(601)])).statusCode).toBe(400);
    const none = dealTestApp(db, testDrafting([model("gpt-oss-groq", (n) => PAGES[n], false)]));
    const res = await none.call("POST", `/api/deals/${env.dealId}/screenshots/read`, env.seller, {
      fileIds: [testId(601)],
      copies: [],
    });
    expect(res.statusCode).toBe(503);
  });

  it("need the agreed work to be a draft", async () => {
    const env = await draftDeal([model("qwen-groq", (n) => PAGES[n])], createSignedTestDeal);
    expect((await env.read()).statusCode).toBe(409);
  });
});
