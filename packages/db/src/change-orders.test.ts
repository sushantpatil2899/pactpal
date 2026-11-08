import { describe, expect, it } from "vitest";
import {
  ChangeOrderNotAllowedError,
  acceptChangeOrder,
  changeOf,
  declineChangeOrder,
  getLatestAcceptance,
  listChangeOrders,
  proposeChangeOrder,
  readLedger,
  scopeContentSchema,
  startInvoice,
  verifyStoredLedger,
  withdrawChangeOrder,
  type ScopeContent,
  type ScopeContentInput,
} from "./index.js";
import { TEST_NOW, createSignedTestDeal, testId, useMigratedTestDatabase } from "./testing.js";

const db = useMigratedTestDatabase();
const at = (minutes: number) => new Date(TEST_NOW.getTime() + minutes * 60_000);

/** The test deal's signed version 1, as stored. */
const SIGNED: ScopeContentInput = {
  format: 1,
  summary: "A character illustration",
  deliverables: ["Full-body character, transparent PNG"],
  exclusions: [],
  milestones: [
    { title: "Deposit", amountMinor: 12_000 },
    { title: "Final files", amountMinor: 13_000, dueDate: "2026-11-27" },
  ],
};
const content = (overrides: Partial<ScopeContentInput> = {}): ScopeContent =>
  scopeContentSchema.parse({ ...SIGNED, ...overrides });

/** Version 1 plus an online-ordering line (can be checked) and a third stage. */
const ORDERING = content({
  deliverables: [...SIGNED.deliverables, "Online ordering page"],
  deliverableKinds: [null, { kind: "objective" }],
  milestones: [...SIGNED.milestones, { title: "Ordering", amountMinor: 40_000 }],
});

describe("changeOf", () => {
  it("lists what a change adds and what it changes", () => {
    const signed = content({ revisionsIncluded: 2, dueDate: "2026-11-27" });
    const proposed = content({
      ...ORDERING,
      exclusions: ["Printing"],
      buyerProvides: [{ text: "Menu text" }],
      revisionsIncluded: 3,
      dueDate: "2026-12-10",
    });
    expect(changeOf(signed, proposed)).toEqual({
      ok: true,
      change: {
        addedLines: [{ text: "Online ordering page", mark: { kind: "objective" } }],
        addedExclusions: ["Printing"],
        addedBuyerProvides: [{ text: "Menu text" }],
        addedStages: [{ title: "Ordering", amountMinor: 40_000 }],
        addedSteps: [],
        dueDate: { from: "2026-11-27", to: "2026-12-10" },
        revisionsIncluded: { from: 2, to: 3 },
        totalMinor: { from: 25_000, to: 65_000 },
      },
    });
  });

  it("allows a change of the due date alone, or more revisions alone", () => {
    expect(changeOf(content(), content({ dueDate: "2026-12-01" })).ok).toBe(true);
    expect(changeOf(content({ revisionsIncluded: 1 }), content({ revisionsIncluded: 2 })).ok).toBe(
      true,
    );
  });

  it.each([
    ["nothing changes", content(), ["nothing"]],
    ["the summary changes", content({ summary: "Something else" }), ["summary"]],
    ["a signed line is removed", content({ deliverables: ["Other"] }), ["deliverables"]],
    [
      "a signed line's mark changes",
      content({ deliverableKinds: [{ kind: "process" }] }),
      ["deliverables"],
    ],
    [
      "a signed stage is repriced",
      content({ milestones: [{ title: "Deposit", amountMinor: 1 }, SIGNED.milestones[1]!] }),
      ["milestones"],
    ],
    ["a stage is removed", content({ milestones: [SIGNED.milestones[0]!] }), ["milestones"]],
    [
      "a revision limit is added where none was stated",
      content({ revisionsIncluded: 2 }),
      ["revisionsIncluded"],
    ],
  ])("refuses a change where %s", (_name, proposed, problems) => {
    expect(changeOf(content(), proposed)).toEqual({ ok: false, problems });
  });

  it("refuses fewer revisions, removed exclusions and removed buyer-provides items", () => {
    const signed = content({
      revisionsIncluded: 2,
      exclusions: ["Printing"],
      buyerProvides: [{ text: "Logo" }],
    });
    expect(
      changeOf(signed, content({ revisionsIncluded: 1, exclusions: [], buyerProvides: [] })),
    ).toEqual({ ok: false, problems: ["exclusions", "buyerProvides", "revisionsIncluded"] });
  });
});

/** A signed deal (version 1) with a proposed ordering change (version 2, test id 600). */
async function proposed(overrides: { content?: ScopeContent; message?: string } = {}) {
  const deal = await createSignedTestDeal(db);
  const result = await proposeChangeOrder(
    db,
    {
      id: testId(600),
      dealId: deal.dealId,
      sellerId: deal.seller.id,
      content: overrides.content ?? ORDERING,
      message: overrides.message ?? "Online ordering, as you asked",
    },
    at(1),
  );
  return { ...deal, ...result };
}

/** The buyer's signature of the waiting change shown on version 2's page. */
const signature = (deal: Awaited<ReturnType<typeof proposed>>) => ({
  dealId: deal.dealId,
  buyerId: deal.buyer.id,
  changeOrderId: testId(600),
  version: 2,
  contentSha256: deal.scope.contentSha256,
  document: { format: 1, version: 2 },
  noticeVersion: 1,
  typedName: "Chris Buyer",
  access: "link" as const,
  ip: "198.51.100.7",
});

const refusal = (reason: string) =>
  expect.objectContaining({ name: "ChangeOrderNotAllowedError", reason }) as unknown;

describe("changeOf with a timeline (7f)", () => {
  const signedSteps = [
    { kind: "payment" as const, stage: 1 },
    { kind: "review" as const, text: "Sketch" },
    { kind: "payment" as const, stage: 2 },
  ];
  const signed = content({ timeline: signedSteps });

  it("allows steps added after the signed ones", () => {
    const proposed = content({
      milestones: [...SIGNED.milestones, { title: "Extra", amountMinor: 1000 }],
      timeline: [
        ...signedSteps,
        { kind: "review", text: "Colour proof" },
        { kind: "payment", stage: 3 },
      ],
    });
    const result = changeOf(signed, proposed);
    expect(result.ok && result.change.addedSteps).toEqual([
      { kind: "review", text: "Colour proof" },
      { kind: "payment", stage: 3 },
    ]);
  });

  it("allows a step added alone, and refuses signed steps reordered or removed", () => {
    const added = changeOf(
      signed,
      content({ timeline: [...signedSteps, { kind: "review", text: "Proof" }] }),
    );
    expect(added.ok).toBe(true);
    const reordered = content({
      timeline: [signedSteps[2], signedSteps[1], signedSteps[0]] as typeof signedSteps,
    });
    expect(changeOf(signed, reordered)).toEqual({ ok: false, problems: ["timeline"] });
  });
});

describe("change orders", () => {
  it("are proposed as the next version, logged, and wait for the buyer", async () => {
    const deal = await proposed();
    expect(deal.scope.version).toBe(2);
    expect(deal.changeOrder).toMatchObject({
      id: testId(600),
      fromVersion: 1,
      toVersion: 2,
      status: "proposed",
      message: "Online ordering, as you asked",
      answeredSeq: null,
    });
    expect(deal.entry).toMatchObject({
      type: "CHANGE_ORDER_PROPOSED",
      actor: "seller",
      payload: {
        changeOrderId: testId(600),
        fromVersion: 1,
        version: 2,
        totalMinor: 65_000,
        currency: "USD",
        added: { lines: 1, exclusions: 0, buyerProvides: 0, stages: 1 },
        message: "Online ordering, as you asked",
      },
    });
    // Version 1 is still the signed one.
    expect((await getLatestAcceptance(db, deal.dealId))?.version).toBe(1);
    const [listed] = await listChangeOrders(db, deal.dealId);
    expect(listed?.change.addedStages).toEqual([{ title: "Ordering", amountMinor: 40_000 }]);
  });

  it("are signed by the buyer, making the new version the signed one", async () => {
    const deal = await proposed();
    const { changeOrder, acceptance, entry } = await acceptChangeOrder(db, signature(deal), at(2));
    expect(changeOrder).toMatchObject({ status: "accepted", answeredSeq: entry.seq });
    expect(acceptance).toMatchObject({ version: 2, typedName: "Chris Buyer" });
    expect(entry).toMatchObject({
      type: "CHANGE_ORDER_ACCEPTED",
      actor: "buyer",
      ip: "198.51.100.7",
      payload: { changeOrderId: testId(600), fromVersion: 1, version: 2, access: "link" },
    });
    expect((await getLatestAcceptance(db, deal.dealId))?.version).toBe(2);
    // A second answer is refused.
    await expect(acceptChangeOrder(db, signature(deal), at(3))).rejects.toEqual(
      refusal("not-waiting"),
    );
    expect((await verifyStoredLedger(db, deal.dealId)).valid).toBe(true);
  });

  it("refuse a page that is not the waiting change", async () => {
    const deal = await proposed();
    await expect(
      acceptChangeOrder(db, { ...signature(deal), contentSha256: "0".repeat(64) }, at(2)),
    ).rejects.toEqual(refusal("stale"));
    await expect(acceptChangeOrder(db, { ...signature(deal), version: 3 }, at(2))).rejects.toEqual(
      refusal("stale"),
    );
  });

  it("can be declined with a reason, leaving the signed agreement as it was", async () => {
    const deal = await proposed();
    const { changeOrder, entry } = await declineChangeOrder(
      db,
      {
        dealId: deal.dealId,
        buyerId: deal.buyer.id,
        changeOrderId: testId(600),
        reason: " No blog ",
      },
      at(2),
    );
    expect(changeOrder).toMatchObject({ status: "declined", reason: "No blog" });
    expect(entry).toMatchObject({
      type: "CHANGE_ORDER_DECLINED",
      payload: { changeOrderId: testId(600), version: 2, reason: "No blog" },
    });
    expect((await getLatestAcceptance(db, deal.dealId))?.version).toBe(1);
    // Another change can now be proposed, as version 3.
    const next = await proposeChangeOrder(
      db,
      { id: testId(601), dealId: deal.dealId, sellerId: deal.seller.id, content: ORDERING },
      at(3),
    );
    expect(next.scope.version).toBe(3);
  });

  it("can be withdrawn by the seller", async () => {
    const deal = await proposed();
    const step = { dealId: deal.dealId, changeOrderId: testId(600) };
    await expect(
      withdrawChangeOrder(db, { ...step, sellerId: deal.buyer.id }, at(2)),
    ).rejects.toEqual(refusal("not-your-deal"));
    const { changeOrder, entry } = await withdrawChangeOrder(
      db,
      { ...step, sellerId: deal.seller.id },
      at(2),
    );
    expect(changeOrder.status).toBe("withdrawn");
    expect(entry).toMatchObject({ type: "CHANGE_ORDER_WITHDRAWN", actor: "seller" });
    await expect(
      declineChangeOrder(db, { ...step, buyerId: deal.buyer.id }, at(3)),
    ).rejects.toEqual(refusal("not-waiting"));
  });

  it("refuse a second waiting change, a change that is not an addition, and the wrong party", async () => {
    const deal = await proposed();
    const again = { id: testId(601), dealId: deal.dealId, sellerId: deal.seller.id };
    await expect(proposeChangeOrder(db, { ...again, content: ORDERING }, at(2))).rejects.toEqual(
      refusal("already-waiting"),
    );
    await withdrawChangeOrder(
      db,
      { dealId: deal.dealId, changeOrderId: testId(600), sellerId: deal.seller.id },
      at(2),
    );
    const error: unknown = await proposeChangeOrder(
      db,
      { ...again, content: content({ summary: "Else" }) },
      at(3),
    ).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ChangeOrderNotAllowedError);
    expect((error as ChangeOrderNotAllowedError).problems).toEqual(["summary"]);
    await expect(
      proposeChangeOrder(db, { ...again, sellerId: deal.buyer.id, content: ORDERING }, at(3)),
    ).rejects.toEqual(refusal("not-your-deal"));
  });

  it("need a signed deal", async () => {
    const deal = await createSignedTestDeal(db);
    await db.query("UPDATE deals SET status = 'draft' WHERE id = $1", [deal.dealId]);
    await expect(
      proposeChangeOrder(
        db,
        { id: testId(600), dealId: deal.dealId, sellerId: deal.seller.id, content: ORDERING },
        at(1),
      ),
    ).rejects.toEqual(refusal("not-signed"));
  });

  it("make a completed deal active again when they add stages", async () => {
    const deal = await proposed();
    await db.query("UPDATE deals SET status = 'completed' WHERE id = $1", [deal.dealId]);
    await acceptChangeOrder(db, signature(deal), at(2));
    const rows = await db.query("SELECT status FROM deals WHERE id = $1", [deal.dealId]);
    expect(rows[0]).toEqual({ status: "active" });
  });

  it("keep a stage's invoice across versions: a carried stage is not invoiced twice", async () => {
    const deal = await createSignedTestDeal(db);
    const invoice = {
      dealId: deal.dealId,
      sellerId: deal.seller.id,
      stage: 1,
      amountMinor: 12_000,
      currency: "USD",
      invoiceSha256: "a".repeat(64),
    };
    await startInvoice(db, { ...invoice, version: 1, requestId: "r-v1-s1" }, at(1));
    const change = await proposeChangeOrder(
      db,
      { id: testId(600), dealId: deal.dealId, sellerId: deal.seller.id, content: ORDERING },
      at(2),
    );
    await acceptChangeOrder(db, signature({ ...deal, ...change }), at(3));
    // Under version 2, stage 1 is the same stage: its reservation from version 1 comes back.
    const again = await startInvoice(db, { ...invoice, version: 2, requestId: "r-v2-s1" }, at(4));
    expect(again).toMatchObject({ version: 1, stage: 1, requestId: "r-v1-s1" });
    // The database itself allows one invoice per stage.
    await expect(
      db.query(
        `INSERT INTO milestones (deal_id, version, stage, amount_minor, currency, status,
                                 request_id, invoice_sha256, created_at)
         VALUES ($1, 2, 1, 12000, 'USD', 'sending', 'r-dup', $2, now())`,
        [deal.dealId, "a".repeat(64)],
      ),
    ).rejects.toThrow(/milestones_one_per_stage/);
  });

  it("keep their rows: an answered change cannot change again or be removed", async () => {
    const deal = await proposed();
    await withdrawChangeOrder(
      db,
      { dealId: deal.dealId, changeOrderId: testId(600), sellerId: deal.seller.id },
      at(2),
    );
    await expect(db.query("UPDATE change_orders SET status = 'accepted'")).rejects.toThrow(
      /append-only/,
    );
    await expect(db.query("DELETE FROM change_orders")).rejects.toThrow(/append-only/);
    const types = (await readLedger(db, deal.dealId)).map((e) => e.type).slice(-2);
    expect(types).toEqual(["CHANGE_ORDER_PROPOSED", "CHANGE_ORDER_WITHDRAWN"]);
  });
});
