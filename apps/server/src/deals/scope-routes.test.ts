import {
  addArtifact,
  draftFingerprint,
  failDraft,
  finishDraft,
  postgresContentStore,
  readLedger,
  startDraft,
  verifyStoredLedger,
} from "@pactpal/db";
import { TEST_NOW, createTestDeal, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { MAYA_DRAFT } from "@pactpal/scope-draft/testing";
import { describe, expect, it } from "vitest";
import { councilRecordOf } from "../council-test-support.js";
import { toJson } from "../drafting/council-record.js";
import { buyerVisitors, dealTestApp, signedInAs } from "./test-app.js";

const db = useMigratedTestDatabase();

const work = (overrides: object = {}) => ({
  summary: "A logo for a bakery",
  deliverables: ["Three concepts", "Final logo files"],
  exclusions: ["Printing"],
  revisionsIncluded: 2,
  milestones: [
    { title: "Concepts", amount: "100" },
    { title: "Final files", amount: "150.5", dueDate: "2026-11-20" },
  ],
  ...overrides,
});

/** The test deal (seller and buyer) and the app, with the seller signed in with PayPal. */
async function sellerDeal() {
  const { seller, buyer, dealId } = await createTestDeal(db);
  const env = dealTestApp(db);
  const url = `/api/deals/${dealId}/scope`;
  return { ...env, seller, buyer, dealId, url, token: await signedInAs(db, seller.id) };
}

describe("agreed work", () => {
  it("has none until the seller saves it, then shows each new version with amounts as text", async () => {
    const { app, call, url, token, dealId } = await sellerDeal();
    expect((await call("GET", url, token)).json()).toEqual({ scope: null });

    const first = await call("POST", url, token, work());
    expect(first.statusCode).toBe(201);
    expect(first.json()).toEqual({
      scope: {
        version: 1,
        contentSha256: expect.stringMatching(/^[0-9a-f]{64}$/) as unknown,
        savedAt: TEST_NOW.toISOString(),
        currency: "USD",
        summary: "A logo for a bakery",
        deliverables: ["Three concepts", "Final logo files"],
        exclusions: ["Printing"],
        revisionsIncluded: 2,
        dueDate: null,
        milestones: [
          { title: "Concepts", amount: { minor: 10_000, text: "100.00" }, dueDate: null },
          {
            title: "Final files",
            amount: { minor: 15_050, text: "150.50" },
            dueDate: "2026-11-20",
          },
        ],
        total: { minor: 25_050, text: "250.50" },
      },
    });

    await call("POST", url, token, work({ summary: "A logo and a sign" }));
    expect((await call("GET", url, token)).json()).toMatchObject({
      scope: { version: 2, summary: "A logo and a sign" },
    });
    expect((await readLedger(db, dealId)).map((e) => e.type)).toEqual([
      "DEAL_CREATED",
      "SCOPE_VERSIONED",
      "SCOPE_VERSIONED",
    ]);
    await app.close();
  });

  it("keeps what the buyer provides, with dates, and leaves an empty list out", async () => {
    const { app, call, url, token } = await sellerDeal();
    const provides = [{ text: "Menu text and photos", dueDate: "2026-11-20" }, { text: "Logo" }];
    const saved = await call("POST", url, token, work({ buyerProvides: provides }));
    expect(saved.json<{ scope: unknown }>().scope).toMatchObject({
      buyerProvides: [
        { text: "Menu text and photos", dueDate: "2026-11-20" },
        { text: "Logo", dueDate: null },
      ],
    });
    // Without a list, the terms have no such field, so documents for such versions are unchanged.
    const bare = (await call("POST", url, token, work({ buyerProvides: [] }))).json<{
      scope: Record<string, unknown>;
    }>().scope;
    expect("buyerProvides" in bare).toBe(false);
    const bad = await call(
      "POST",
      url,
      token,
      work({ buyerProvides: [{ text: "Photos", dueDate: "soon" }] }),
    );
    expect(bad.json()).toEqual({ error: "invalid", fields: ["buyerProvides.0.dueDate"] });
    await app.close();
  });

  it("keeps the marks on delivered lines, and refuses a matter of taste with no such stage", async () => {
    const { app, call, url, token } = await sellerDeal();
    const marks = [{ kind: "objective" }, { kind: "subjective", approvalStage: 1 }];
    const saved = await call("POST", url, token, work({ deliverableKinds: marks }));
    expect(saved.json<{ scope: unknown }>().scope).toMatchObject({ deliverableKinds: marks });
    const bad = await call(
      "POST",
      url,
      token,
      work({ deliverableKinds: [null, { kind: "subjective", approvalStage: 5 }] }),
    );
    expect(bad.json()).toEqual({ error: "invalid", fields: ["deliverableKinds.1.approvalStage"] });
    const unmarked = (
      await call("POST", url, token, work({ deliverableKinds: [null, null] }))
    ).json<{
      scope: Record<string, unknown>;
    }>().scope;
    expect("deliverableKinds" in unmarked).toBe(false);
    await app.close();
  });

  it("lets the buyer and a buyer-link visitor read it but not save it", async () => {
    const { app, call, url, token, buyer, dealId } = await sellerDeal();
    await call("POST", url, token, work());
    for (const visitor of await buyerVisitors(db, dealId, buyer.id)) {
      expect((await call("GET", url, visitor)).json()).toMatchObject({ scope: { version: 1 } });
      expect((await call("POST", url, visitor, work())).statusCode).toBe(403);
    }
    await app.close();
  });

  it.each([
    [
      "an amount with three decimals",
      { milestones: [{ title: "A", amount: "1.005" }] },
      ["milestones.0.amount"],
    ],
    [
      "an amount that is not a number",
      { milestones: [{ title: "A", amount: "ten" }] },
      ["milestones.0.amount"],
    ],
    ["a zero amount", { milestones: [{ title: "A", amount: "0.00" }] }, ["milestones.0.amount"]],
    [
      "an amount over the limit",
      { milestones: [{ title: "A", amount: "1000000" }] },
      ["milestones.0.amount"],
    ],
    ["no payment stages", { milestones: [] }, ["milestones"]],
    ["no deliverables", { deliverables: [] }, ["deliverables"]],
    ["an unknown field", { price: "1" }, [""]],
  ])("refuses %s and names the field", async (_name, overrides, fields) => {
    const { app, call, url, token, dealId } = await sellerDeal();
    const res = await call("POST", url, token, work(overrides));
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ error: "invalid", fields });
    expect(await readLedger(db, dealId)).toHaveLength(1);
    await app.close();
  });

  it("refuses changes once the deal is no longer a draft", async () => {
    const { app, call, url, token, dealId } = await sellerDeal();
    await db.query("UPDATE deals SET status = 'active' WHERE id = $1", [dealId]);
    const res = await call("POST", url, token, work());
    expect(res.statusCode).toBe(409);
    await app.close();
  });

  it("answers 404 for a deal that does not exist and 401 when signed out", async () => {
    const { app, call, token } = await sellerDeal();
    const missing = `/api/deals/${testId(999)}/scope`;
    expect((await call("GET", missing, token)).statusCode).toBe(404);
    expect((await call("GET", missing)).statusCode).toBe(401);
    await app.close();
  });
});

describe("agreed work saved from an AI draft", () => {
  /** The test deal with a ready draft (test id 900) holding the Maya draft, and the seller's session. */
  async function withReadyDraft(council: object = {}) {
    const env = await sellerDeal();
    const store = postgresContentStore(db, () => TEST_NOW);
    const file = await addArtifact(
      db,
      store,
      {
        id: testId(500),
        dealId: env.dealId,
        kind: "source",
        filename: "chat.txt",
        bytes: new TextEncoder().encode("Maya: a logo"),
        addedBy: { actor: "seller", actorId: env.seller.id },
      },
      TEST_NOW,
    );
    const start = (id: string) =>
      startDraft(
        db,
        {
          id,
          dealId: env.dealId,
          sellerId: env.seller.id,
          sourceArtifactId: file.id,
          sourceSha256: file.sha256,
          draftPromptVersion: 2,
          rankPromptVersion: 1,
        },
        TEST_NOW,
      );
    await start(testId(900));
    const { draft } = await finishDraft(
      db,
      {
        draftId: testId(900),
        draft: toJson(MAYA_DRAFT),
        council: toJson(council),
        ledgerPayload: {},
      },
      TEST_NOW,
    );
    return { ...env, draft, start };
  }

  const drafted = (overrides: object = {}) =>
    work({
      summary: MAYA_DRAFT.summary.status === "found" ? MAYA_DRAFT.summary.value : "",
      deliverables: MAYA_DRAFT.deliverables.map((item) => item.text),
      exclusions: MAYA_DRAFT.exclusions.map((item) => item.text),
      revisionsIncluded: undefined,
      milestones: [{ title: "Payment", amount: "240" }],
      ...overrides,
    });

  it("saves the version and logs which fields were kept and which changed, linking the draft", async () => {
    const { call, url, token, dealId, draft, app } = await withReadyDraft();
    const res = await call("POST", url, token, {
      ...drafted({ summary: "Maya will draw one character, in her own words" }),
      draftId: draft.id,
    });
    expect(res.statusCode).toBe(201);
    const ledger = await readLedger(db, dealId);
    expect(ledger.map((e) => e.type).slice(-3)).toEqual([
      "SCOPE_DRAFTED",
      "SCOPE_VERSIONED",
      "SCOPE_CONFIRMED",
    ]);
    const entry = ledger.at(-1);
    expect(entry).toMatchObject({ actor: "seller" });
    expect(entry?.payload).toMatchObject({
      version: 1,
      draftId: draft.id,
      draftSha256: draft.draftSha256,
      fields: {
        summary: "changed",
        deliverables: "unchanged",
        exclusions: "unchanged",
        totalPrice: "unchanged",
      },
    });
    // Fingerprints and statuses only: none of the words.
    expect(JSON.stringify(entry?.payload)).not.toMatch(/Maya|character|merchandise/);
    expect(await verifyStoredLedger(db, dealId)).toMatchObject({ valid: true });
    await app.close();
  });

  it("refuses a draft that is not a ready draft of this deal, and saves nothing", async () => {
    const { call, url, token, dealId, draft, start, app } = await withReadyDraft();
    await start(testId(901));
    const before = (await readLedger(db, dealId)).length;
    for (const draftId of [testId(999), testId(901), "not-an-id"]) {
      const res = await call("POST", url, token, { ...drafted(), draftId });
      expect(res.statusCode).toBe(400);
      expect(res.json()).toMatchObject({ error: "invalid", fields: ["draftId"] });
    }
    await failDraft(db, { draftId: testId(901), reason: "x" }, TEST_NOW);
    const failed = await call("POST", url, token, { ...drafted(), draftId: testId(901) });
    expect(failed.json()).toMatchObject({ fields: ["draftId"] });
    expect((await call("GET", url, token)).json()).toEqual({ scope: null });
    expect((await readLedger(db, dealId)).length).toBe(before);
    expect(draft.status).toBe("ready");
    await app.close();
  });

  it("does not let the buyer save from a draft", async () => {
    const { call, url, dealId, buyer, draft, app } = await withReadyDraft();
    for (const token of await buyerVisitors(db, dealId, buyer.id)) {
      const res = await call("POST", url, token, { ...drafted(), draftId: draft.id });
      expect(res.statusCode).toBe(403);
    }
    await app.close();
  });

  describe("when the council could not rank its drafts and the seller chose one", () => {
    const other = {
      ...MAYA_DRAFT,
      summary: {
        status: "found" as const,
        value: "Maya draws one space courier",
        citations: [{ line: 3, quote: "full-body character illustration" }],
      },
      deliverables: [{ text: "One PNG file", citations: [{ line: 10, quote: "PNG" }] }],
    };
    const drafts = [
      { modelName: "alpha", draft: MAYA_DRAFT },
      { modelName: "beta", draft: other },
    ];
    const fromOther = () =>
      work({
        summary: "Maya draws one space courier",
        deliverables: ["One PNG file"],
        exclusions: MAYA_DRAFT.exclusions.map((item) => item.text),
        revisionsIncluded: undefined,
        milestones: [{ title: "Payment", amount: "240" }],
      });

    it("compares the saved work with the chosen draft and logs its letter and fingerprint", async () => {
      const { call, url, token, dealId, draft, app } = await withReadyDraft(
        councilRecordOf(drafts, 0),
      );
      const res = await call("POST", url, token, {
        ...fromOther(),
        draftId: draft.id,
        draftLabel: "B",
      });
      expect(res.statusCode).toBe(201);
      const entry = (await readLedger(db, dealId)).at(-1);
      expect(entry?.type).toBe("SCOPE_CONFIRMED");
      expect(entry?.payload).toMatchObject({
        draftId: draft.id,
        // The row's own fingerprint is the stored winner's; the chosen draft has its own.
        draftSha256: draft.draftSha256,
        usedCandidate: { label: "B", sha256: draftFingerprint(toJson(other)) },
        fields: { summary: "unchanged", deliverables: "unchanged", exclusions: "unchanged" },
      });
      expect(draftFingerprint(toJson(other))).not.toBe(draft.draftSha256);
      expect(JSON.stringify(entry?.payload)).not.toMatch(/Maya|courier|PNG/);
      expect(await verifyStoredLedger(db, dealId)).toMatchObject({ valid: true });
      await app.close();
    });

    it("measures against the stored winner when no letter is given, as before", async () => {
      const { call, url, token, dealId, draft, app } = await withReadyDraft(
        councilRecordOf(drafts, 0),
      );
      await call("POST", url, token, { ...fromOther(), draftId: draft.id });
      const entry = (await readLedger(db, dealId)).at(-1);
      expect(entry?.payload).toMatchObject({ fields: { summary: "changed" } });
      expect(entry?.payload).not.toHaveProperty("usedCandidate");
      await app.close();
    });

    it("refuses a letter that does not exist", async () => {
      const env = await withReadyDraft(councilRecordOf(drafts, 0));
      const before = (await readLedger(db, env.dealId)).length;
      const res = await env.call("POST", env.url, env.token, {
        ...fromOther(),
        draftId: env.draft.id,
        draftLabel: "C",
      });
      expect(res.statusCode).toBe(400);
      expect(res.json()).toMatchObject({ error: "invalid", fields: ["draftLabel"] });
      expect((await readLedger(db, env.dealId)).length).toBe(before);
      await env.app.close();
    });

    it.each([
      ["a draft the council did rank", councilRecordOf(drafts, 2)],
      ["a draft with no readable council record", {}],
    ])("refuses a letter on %s, and saves nothing", async (_name, council) => {
      const env = await withReadyDraft(council);
      const res = await env.call("POST", env.url, env.token, {
        ...fromOther(),
        draftId: env.draft.id,
        draftLabel: "B",
      });
      expect(res.statusCode).toBe(400);
      expect(res.json()).toMatchObject({ fields: ["draftLabel"] });
      expect((await env.call("GET", env.url, env.token)).json()).toEqual({ scope: null });
      await env.app.close();
    });
  });
});
