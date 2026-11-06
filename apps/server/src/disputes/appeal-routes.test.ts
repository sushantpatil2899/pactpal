import { readLedger } from "@pactpal/db";
import { useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors } from "../deals/test-app.js";
import { councilDispute, expectSellerOnly, paypalState, type TestFile } from "./test-support.js";

const db = useMigratedTestDatabase();
const FILES: TestFile[] = [
  [
    "homepage.png",
    "deliverable",
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1]),
    "seller",
  ],
];

interface AppealView {
  applies: boolean;
  canCheck: boolean;
  items: { id: string; words: string }[];
  cut: boolean;
  checks: {
    status: string;
    failureReason: string | null;
    check: {
      summary: string;
      items: { id: string; answers: boolean; record: { n: number; text: string }[] }[];
    } | null;
  }[];
}

/** The answer the stand-in models give; filled in once the new items are known. */
const answer = { items: [] as object[], summary: "One new document speaks to the claim." };

describe("the appeal check", () => {
  it("lists what was not sent, judges it after a buyer-favour decision, and logs a fingerprint", async () => {
    const { app, call, token, url, settle, dealId, buyer } = await councilDispute(
      db,
      [answer, answer],
      FILES,
    );
    const appeal = `${url}/appeal`;
    const before = (await call("GET", appeal, token)).json<AppealView>();
    expect(before).toMatchObject({ applies: false, canCheck: false });
    expect((await call("POST", appeal, token, {})).json()).toEqual({
      error: "PayPal has not decided this dispute for the buyer",
    });
    await paypalState(db, dealId, {
      allowedActions: ["appeal"],
      outcome: "RESOLVED_BUYER_FAVOUR",
      buyerSays: "The site has no blog.",
    });
    const view = (await call("GET", appeal, token)).json<AppealView>();
    expect(view).toMatchObject({ applies: true, canCheck: true, cut: false });
    const ids = view.items.map((item) => item.id);
    expect(ids).toContain("D1");
    expect(ids.some((id) => /^E\d+$/.test(id))).toBe(true);
    expect(view.items.find((item) => item.words.includes("homepage.png"))).toBeDefined();
    answer.items = ids.map((id, i) => ({
      id,
      answers: i === 0,
      why: "It relates to claim line 2.",
      record: [],
    }));
    expect((await call("POST", appeal, token, {})).statusCode).toBe(202);
    await settle();
    const done = (await call("GET", appeal, token)).json<AppealView>().checks[0];
    expect(done).toMatchObject({ status: "ready", check: { summary: answer.summary } });
    const entry = (await readLedger(db, dealId)).at(-1);
    expect(entry).toMatchObject({
      type: "APPEAL_CHECKED",
      actor: "system",
      payload: { speaking: 1 },
    });
    expect(JSON.stringify(entry?.payload)).not.toContain("claim line");
    await expectSellerOnly(call, appeal, token, (await buyerVisitors(db, dealId, buyer.id))[0]);
    await app.close();
  });
});
