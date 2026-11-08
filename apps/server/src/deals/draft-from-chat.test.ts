import {
  getArtifact,
  getDraft,
  listArtifacts,
  postgresContentStore,
  type Artifact,
} from "@pactpal/db";
import {
  TEST_NOW,
  addTestFile,
  createTestDeal,
  testId,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { ALL_MISSING_DRAFT } from "@pactpal/scope-draft/testing";
import type { LightMyRequestResponse } from "fastify";
import { describe, expect, it } from "vitest";
import {
  buyerVisitors,
  dealTestApp,
  queuedDrafting,
  signedInAs,
  standInMember,
} from "./test-app.js";

const db = useMigratedTestDatabase();
const store = postgresContentStore(db, () => TEST_NOW);

/** Models that agree on a draft stating nothing, which is valid for any text. */
const models = () =>
  queuedDrafting(["a", "b", "c"].map((name) => standInMember(name, ALL_MISSING_DRAFT)));

async function chatDeal() {
  const deal = await createTestDeal(db);
  const runtime = models();
  const env = dealTestApp(db, runtime.runtime);
  const seller = await signedInAs(db, deal.seller.id);
  const [, buyer = ""] = await buyerVisitors(db, deal.dealId, deal.buyer.id);
  const say = (token: string, body: string) =>
    env.call("POST", `/api/deals/${deal.dealId}/chat`, token, { body });
  const draft = (body: object) =>
    env.call("POST", `/api/deals/${deal.dealId}/drafts/from-chat`, seller, body);
  /** The transcript the newest draft read. */
  const transcript = async () => {
    const files = await listArtifacts(db, deal.dealId, "source");
    const file = files.filter((f: Artifact) => f.filename.startsWith("pactpal-chat-")).at(-1);
    if (!file) throw new Error("no transcript");
    return new TextDecoder().decode((await getArtifact(db, store, file.id, deal.dealId)).bytes);
  };
  const draftId = (res: LightMyRequestResponse) => res.json<{ draft: { id: string } }>().draft.id;
  const owner = { dealId: deal.dealId, seller: deal.seller };
  return { ...deal, ...env, ...runtime, owner, seller, buyer, say, draft, transcript, draftId };
}

describe("drafts from the deal's chat (7h)", () => {
  it("reads the in-app chat, keeps the exact text as a source file, and remembers how far it read", async () => {
    const env = await chatDeal();
    await env.say(env.seller, "Logo: three concepts, $300 total");
    await env.say(env.buyer, "Deal. Half up front?");
    const res = await env.draft({ chat: true });
    expect(res.statusCode).toBe(202);
    const text = await env.transcript();
    expect(text).toContain("=== The deal's chat in PactPal ===");
    expect(text).toContain("Maya Seller (seller): Logo: three concepts, $300 total");
    expect(text).toContain("Buyer (buyer): Deal. Half up front?");
    const record = await getDraft(db, env.dealId, env.draftId(res));
    expect(record).toMatchObject({ chatThroughSeq: 2 });
    expect(record?.basedOnVersion).toBeUndefined();
    // Pasted chats on the Chat tab leave out PactPal's own transcripts.
    const pasted = await env.call("GET", `/api/deals/${env.dealId}/chat/pasted`, env.buyer);
    expect(pasted.json()).toEqual({ chats: [] });
    await env.settle();
    expect((await getDraft(db, env.dealId, env.draftId(res)))?.status).toBe("ready");
    await env.app.close();
  });

  it("adds pasted chats after the in-app chat, or uses them alone", async () => {
    const env = await chatDeal();
    await addTestFile(
      db,
      env.owner,
      {
        id: testId(300),
        kind: "source",
        filename: "whatsapp.txt",
        bytes: new TextEncoder().encode("Maya: deposit first?\nChris: sure"),
      },
      TEST_NOW,
    );
    await env.say(env.buyer, "Also blue, please");
    expect((await env.draft({ chat: true, pastedFileIds: [testId(300)] })).statusCode).toBe(202);
    const both = await env.transcript();
    expect(both.indexOf("PactPal ===")).toBeLessThan(both.indexOf("whatsapp.txt ==="));
    await env.settle();
    const alone = await env.draft({ chat: false, pastedFileIds: [testId(300)] });
    expect((await getDraft(db, env.dealId, env.draftId(alone)))?.chatThroughSeq).toBeUndefined();
    expect(await env.transcript()).not.toContain("Also blue");
    await env.app.close();
  });

  it("refuses no sources, an empty chat, transcripts as pasted chats, and other deals' files", async () => {
    const env = await chatDeal();
    expect((await env.draft({ chat: false })).json()).toEqual({
      error: "invalid",
      fields: ["chat"],
    });
    expect((await env.draft({ chat: true })).json()).toEqual({
      error: "the chat has no messages yet",
    });
    expect((await env.draft({ pastedFileIds: [testId(999)] })).statusCode).toBe(404);
    await env.say(env.seller, "Hi");
    await env.draft({ chat: true });
    await env.settle();
    const [transcript] = (await listArtifacts(db, env.dealId, "source")).filter((f: Artifact) =>
      f.filename.startsWith("pactpal-chat-"),
    );
    expect((await env.draft({ pastedFileIds: [transcript?.id ?? ""] })).json()).toEqual({
      error: "only pasted chats can be added",
    });
    await env.app.close();
  });
});

describe("updates from the latest chat (7i)", () => {
  it("start from the agreement as it stands and read only the messages since the last draft", async () => {
    const env = await chatDeal();
    await env.say(env.seller, "Three concepts for $300");
    await env.draft({ chat: true });
    await env.settle();
    expect((await env.draft({ update: true })).json()).toEqual({
      error: "there is no agreement to update yet",
    });

    const saved = await env.call("POST", `/api/deals/${env.dealId}/scope`, env.seller, {
      summary: "Three logo concepts",
      deliverables: ["Three concepts"],
      exclusions: [],
      milestones: [{ title: "Full price", amount: "300" }],
    });
    expect(saved.statusCode).toBe(201);
    await env.say(env.buyer, "Can we make it four concepts for $380?");
    const res = await env.draft({ update: true });
    expect(res.statusCode).toBe(202);
    const text = await env.transcript();
    expect(text.startsWith("=== The agreement as it stands (version 1) ===")).toBe(true);
    expect(text).toContain("Summary: Three logo concepts");
    expect(text).toContain("four concepts for $380");
    expect(text).not.toContain("Three concepts for $300");
    expect(await getDraft(db, env.dealId, env.draftId(res))).toMatchObject({
      chatThroughSeq: 2,
      basedOnVersion: 1,
    });
    await env.app.close();
  });
});
