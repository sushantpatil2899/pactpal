import { createHash } from "node:crypto";
import { addArtifact, postgresContentStore, readLedger } from "@pactpal/db";
import { TEST_NOW, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
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
    expect(ids.some((id) => /^D[0-9a-f]{6}$/.test(id))).toBe(true);
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

describe("the appeal statement and sending the appeal", () => {
  it("drafts from the check, refuses a packet without the new item, then sends the appeal", async () => {
    const sent: { action: string; input: unknown }[] = [];
    const ok = (action: string) => (_id: string, input: unknown) => {
      sent.push({ action, input });
      return Promise.resolve({ data: { disputeId: "PP-R-TEST-1" }, transport: "rest" as const });
    };
    const reply: Record<string, unknown> = {};
    const writer = {
      escalate: ok("escalate"),
      provideEvidence: ok("provide_evidence"),
      sendMessage: ok("send_message"),
      makeOffer: ok("make_offer"),
      acceptClaim: ok("accept_claim"),
      appeal: ok("appeal"),
    };
    const { app, call, token, url, settle, dealId, seller } = await councilDispute(
      db,
      [reply, reply],
      FILES,
      { disputeWriter: writer },
    );
    await paypalState(db, dealId, {
      allowedActions: ["appeal"],
      outcome: "RESOLVED_BUYER_FAVOUR",
      buyerSays: "The site has no blog.",
    });
    const build = async () =>
      (await call("POST", `${url}/packet`, token, {})).json<{ id: string; packetSha256: string }>();
    const oldPacket = await build();
    // A file added after that packet, which the appeal will rely on.
    await addArtifact(
      db,
      postgresContentStore(db, () => TEST_NOW),
      {
        id: testId(650),
        dealId,
        kind: "source",
        filename: "change-order.pdf",
        bytes: new TextEncoder().encode("%PDF-1.4 change order"),
        addedBy: { actor: "seller", actorId: seller.id },
      },
      TEST_NOW,
    );
    const items = (await call("GET", `${url}/appeal`, token)).json<AppealView>().items;
    const relied = items.find((item) => item.words.startsWith("change-order.pdf"))?.id;
    reply.items = items.map((item) => ({
      id: item.id,
      answers: item.id === relied,
      why: item.id === relied ? "It shows the change the buyer declined." : "",
      record: [],
    }));
    reply.summary = "One new document speaks to the claim.";
    await call("POST", `${url}/appeal`, token, {});
    await settle();
    reply.statement = [
      { text: "The buyer declined the change that would add a blog.", record: [1] },
      { text: "The final work matches the agreement without it.", record: [] },
    ];
    reply.note = "The attached change order shows the buyer declined the blog.";
    const statements = `${url}/appeal/statements`;
    expect((await call("POST", statements, token, {})).statusCode).toBe(202);
    await settle();
    const drafted = (await call("GET", statements, token)).json<{
      statements: { status: string; statement: { note: string } | null }[];
    }>();
    expect(drafted.statements[0]).toMatchObject({
      status: "ready",
      statement: { note: reply.note },
    });
    const confirmed = (packet: { id: string; packetSha256: string }) => ({
      note: reply.note,
      noteSha256: createHash("sha256").update(String(reply.note)).digest("hex"),
      confirmed: true,
      packetId: packet.id,
      packetSha256: packet.packetSha256,
      evidenceType: "OTHER",
    });
    const actions = async () =>
      (await call("GET", `${url}/actions`, token)).json<{
        allowed: { appeal: boolean };
        draftAppealNote: string | null;
        appealMissing: string[] | null;
      }>();
    expect(await actions()).toMatchObject({
      allowed: { appeal: true },
      draftAppealNote: reply.note,
      appealMissing: ["change-order.pdf"],
    });
    const refused = await call("POST", `${url}/appeal/send`, token, confirmed(oldPacket));
    expect(refused.json()).toEqual({
      error:
        "the packet leaves out what the appeal relies on; build a new packet first: change-order.pdf",
    });
    const newPacket = await build();
    expect((await actions()).appealMissing).toEqual([]);
    expect((await call("POST", `${url}/appeal/send`, token, confirmed(newPacket))).statusCode).toBe(
      201,
    );
    expect(sent.map((s) => s.action)).toEqual(["appeal"]);
    expect((await readLedger(db, dealId)).at(-1)).toMatchObject({
      type: "APPEAL_SUBMITTED",
      payload: { packetId: newPacket.id, evidenceType: "OTHER" },
    });
    await app.close();
  });
});
