import { sha256Hex } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import {
  DEAL_TABLES,
  RETENTION,
  addArtifact,
  createDeal,
  finishDraft,
  postMessage,
  postgresContentStore,
  purgeDeal,
  recordDispute,
  recordPacket,
  recordWebhookEvent,
  retentionCutoffs,
  runRetentionSweep,
  startDraft,
} from "./index.js";
import {
  TEST_NOW,
  createPaidTestDeal,
  linkTestDispute,
  testDeal,
  testId,
  useMigratedTestDatabase,
} from "./testing.js";

const db = useMigratedTestDatabase();
const store = postgresContentStore(db, () => TEST_NOW);
const daysAfter = (days: number) => new Date(TEST_NOW.getTime() + days * 86_400_000);
const chat = new TextEncoder().encode("Maya: a character for $250?\nChris: yes");

/** Rows left for the deal in every table that holds deal rows, plus the deal itself. */
async function rowsLeft(dealId: string): Promise<Record<string, number>> {
  const left: Record<string, number> = {};
  for (const table of [...DEAL_TABLES, "deals"]) {
    const column = table === "deals" ? "id" : "deal_id";
    const rows = await db.query(`SELECT count(*)::int AS n FROM ${table} WHERE ${column} = $1`, [
      dealId,
    ]);
    const n = Number(rows[0]?.n);
    if (n > 0) left[table] = n;
  }
  return left;
}

/** A second, unsigned deal (id 101) of the seller with its chat and a finished AI draft. */
async function draftedDeal(sellerId: string, at = TEST_NOW) {
  const { deal } = await createDeal(db, testDeal(sellerId, { id: testId(101) }), at);
  const file = await addArtifact(
    db,
    store,
    {
      id: testId(520),
      dealId: deal.id,
      kind: "source",
      filename: "draft-chat.txt",
      bytes: new TextEncoder().encode("Maya: a banner?"),
      addedBy: { actor: "seller", actorId: sellerId },
    },
    at,
  );
  const input = {
    id: testId(900),
    dealId: deal.id,
    sellerId,
    sourceArtifactId: file.id,
    sourceSha256: file.sha256,
    draftPromptVersion: 1,
    rankPromptVersion: 1,
  };
  await startDraft(db, input, at);
  await finishDraft(
    db,
    { draftId: input.id, draft: { format: 2 }, council: {}, ledgerPayload: { winnerModel: "m" } },
    at,
  );
  return deal.id;
}

/**
 * A paid deal with a chat file, a chat message, a dispute (resolved
 * unless `open`) and an evidence packet: rows in most of the deal tables, all at `TEST_NOW`.
 */
async function fullDeal(open = false) {
  const deal = await createPaidTestDeal(db);
  const by = { actor: "seller" as const, actorId: deal.seller.id };
  const file = await addArtifact(
    db,
    store,
    {
      id: testId(500),
      dealId: deal.dealId,
      kind: "source",
      filename: "chat.txt",
      bytes: chat,
      addedBy: by,
    },
    TEST_NOW,
  );
  await postMessage(
    db,
    { id: testId(501), dealId: deal.dealId, authorId: deal.buyer.id, body: "Thanks!" },
    TEST_NOW,
  );
  await linkTestDispute(db, deal.dealId, TEST_NOW);
  const pdf = new TextEncoder().encode("%PDF-1.7 retention");
  await recordPacket(
    db,
    store,
    {
      id: testId(700),
      dealId: deal.dealId,
      disputeId: "PP-R-TEST-1",
      sellerId: deal.seller.id,
      packet: pdf,
      packetSha256: sha256Hex(pdf),
      exhibits: [],
      totalBytes: pdf.length,
      chainEntries: 1,
      chainHead: "c".repeat(64),
    },
    TEST_NOW,
  );
  if (!open) {
    await recordDispute(
      db,
      {
        disputeId: "PP-R-TEST-1",
        status: "RESOLVED",
        allowedActions: [],
        offerTypes: [],
        details: {},
      },
      undefined,
      TEST_NOW,
    );
  }
  return { ...deal, file, pdfSha256: sha256Hex(pdf) };
}

const sweep = (days: number, dryRun = false, n = 1) =>
  runRetentionSweep(db, { now: daysAfter(days), runId: testId(800 + n), dryRun });

describe("the retention clean-up (9c)", () => {
  it("measures 210 days for deals and 60 for notifications and drafts", () => {
    expect(RETENTION).toMatchObject({ dealDays: 210, shortDays: 60 });
    expect(retentionCutoffs(daysAfter(210))).toEqual({
      dealsBefore: TEST_NOW,
      shortBefore: daysAfter(150),
    });
  });

  it("removes a whole deal 210 days after its last activity, and its unused file bytes", async () => {
    const deal = await fullDeal();
    const drafted = await draftedDeal(deal.seller.id);
    expect(Object.keys(await rowsLeft(deal.dealId)).length).toBeGreaterThanOrEqual(9);
    expect((await sweep(210)).counts.deals).toBe(0);
    const { counts, failedDeals } = await sweep(211, false, 2);
    expect(failedDeals).toEqual([]);
    expect(counts).toMatchObject({ deals: 2, dealsHeld: 0, dealsFailed: 0, files: 3 });
    expect(await rowsLeft(deal.dealId)).toEqual({});
    expect(await rowsLeft(drafted)).toEqual({});
    expect(await db.query("SELECT sha256 FROM file_contents")).toEqual([]);
    // The people stay: an account is not part of a deal's record.
    expect(await db.query("SELECT id FROM users ORDER BY id")).toHaveLength(2);
    const runs = await db.query("SELECT dry_run, counts FROM retention_runs ORDER BY ran_at");
    expect(runs.map((r) => r.dry_run)).toEqual([false, false]);
  });

  it("keeps a deal whose PayPal dispute is still open, however old", async () => {
    const deal = await fullDeal(true);
    const { counts } = await sweep(400);
    expect(counts).toMatchObject({ deals: 0, dealsHeld: 1 });
    expect((await rowsLeft(deal.dealId)).ledger_entries).toBeGreaterThan(0);
  });

  it("counts without removing anything in a dry run", async () => {
    const deal = await fullDeal();
    await recordWebhookEvent(
      db,
      { source: "paypal", eventId: "WH-OLD", eventType: "X", body: {} },
      TEST_NOW,
    );
    const before = await rowsLeft(deal.dealId);
    const { counts } = await sweep(211, true);
    expect(counts).toMatchObject({ deals: 1, webhookEvents: 1 });
    expect(await rowsLeft(deal.dealId)).toEqual(before);
    expect(await db.query("SELECT event_id FROM webhook_events")).toHaveLength(1);
    expect(await db.query("SELECT dry_run FROM retention_runs")).toEqual([{ dry_run: true }]);
  });

  it("removes raw notifications and finished drafts after 60 days, keeping the deal", async () => {
    const deal = await fullDeal();
    const drafted = await draftedDeal(deal.seller.id);
    await recordWebhookEvent(
      db,
      { source: "paypal", eventId: "WH-OLD", eventType: "X", body: {} },
      TEST_NOW,
    );
    await recordWebhookEvent(
      db,
      { source: "paypal", eventId: "WH-NEW", eventType: "X", body: {} },
      daysAfter(30),
    );
    const { counts } = await sweep(61);
    expect(counts).toMatchObject({ deals: 0, webhookEvents: 1, scopeDrafts: 1, files: 0 });
    expect(await db.query("SELECT event_id FROM webhook_events")).toEqual([{ event_id: "WH-NEW" }]);
    const left = await rowsLeft(drafted);
    expect(left.scope_drafts).toBeUndefined();
    expect(left.artifacts).toBe(1);
    expect((await rowsLeft(deal.dealId)).ledger_entries).toBeGreaterThan(0);
  });

  it("keeps file bytes another deal still uses", async () => {
    const deal = await fullDeal();
    const { deal: other } = await createDeal(
      db,
      testDeal(deal.seller.id, { id: testId(101), title: "Second logo" }),
      daysAfter(200),
    );
    await addArtifact(
      db,
      store,
      {
        id: testId(510),
        dealId: other.id,
        kind: "source",
        filename: "same-chat.txt",
        bytes: chat,
        addedBy: { actor: "seller", actorId: deal.seller.id },
      },
      daysAfter(200),
    );
    const { counts } = await sweep(211);
    expect(counts).toMatchObject({ deals: 1, files: 1 });
    expect(await db.query("SELECT sha256 FROM file_contents")).toEqual([
      { sha256: deal.file.sha256 },
    ]);
  });

  it("goes on with the other deals when one cannot be removed", async () => {
    const first = await fullDeal();
    const { deal: second } = await createDeal(
      db,
      testDeal(first.seller.id, { id: testId(101) }),
      TEST_NOW,
    );
    // Something outside the deal tables still points at the first deal.
    await db.query("CREATE TABLE stray (deal_id uuid REFERENCES deals (id))");
    await db.query("INSERT INTO stray VALUES ($1)", [first.dealId]);
    const { counts, failedDeals } = await sweep(211);
    expect(failedDeals).toEqual([first.dealId]);
    expect(counts).toMatchObject({ deals: 1, dealsFailed: 1 });
    expect(await rowsLeft(second.id)).toEqual({});
    // The failed deal is untouched, not half removed.
    expect((await rowsLeft(first.dealId)).ledger_entries).toBeGreaterThan(0);
  });

  it("still refuses every change and deletion outside the clean-up, and every change inside it", async () => {
    const deal = await fullDeal();
    for (const sql of [
      "DELETE FROM ledger_entries WHERE deal_id = $1",
      "DELETE FROM disputes WHERE deal_id = $1",
      "UPDATE ledger_entries SET type = 'X' WHERE deal_id = $1",
    ]) {
      await expect(db.query(sql, [deal.dealId])).rejects.toThrow(/not allowed/);
    }
    await expect(
      db.transaction(async (tx) => {
        await tx.query("SET LOCAL pactpal.retention_purge = 'on'");
        await tx.query("UPDATE ledger_entries SET type = 'X' WHERE deal_id = $1", [deal.dealId]);
      }),
    ).rejects.toThrow(/not allowed/);
    // The switch ends with its transaction.
    await purgeDeal(db, testId(999));
    await expect(
      db.query("DELETE FROM ledger_entries WHERE deal_id = $1", [deal.dealId]),
    ).rejects.toThrow(/not allowed/);
  });
});
