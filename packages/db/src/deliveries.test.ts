import { sha256Hex } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import {
  DeliveryNotAllowedError,
  VIEW_REPEAT_MS,
  addArtifact,
  answerDelivery,
  deliveryAnswers,
  getDeal,
  getArtifact,
  listArtifacts,
  listDeliveries,
  postgresContentStore,
  readLedger,
  recordDeliveryDownloaded,
  recordDeliveryEmailed,
  recordDeliveryViewed,
  sendDelivery,
  verifyStoredLedger,
  type AnswerInput,
  type ArtifactKind,
  type SendDelivery,
} from "./index.js";
import { TEST_NOW, createSignedTestDeal, testId, useMigratedTestDatabase } from "./testing.js";

const db = useMigratedTestDatabase();
const at = (minutes: number) => new Date(TEST_NOW.getTime() + minutes * 60_000);
const refusal = (reason: string) => new DeliveryNotAllowedError(reason as never);
const store = postgresContentStore(db, () => TEST_NOW);
const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);

/** A signed deal with two delivered files and one source file, and a delivery ready to send. */
async function withFiles(terms: { revisionsIncluded?: number } = {}) {
  const deal = await createSignedTestDeal(db, terms);
  const add = (n: number, kind: ArtifactKind, name: string) =>
    addArtifact(
      db,
      store,
      {
        id: testId(300 + n),
        dealId: deal.dealId,
        kind,
        filename: name,
        bytes: new Uint8Array([...png, n]),
        addedBy: { actor: "seller", actorId: deal.seller.id },
      },
      at(1),
    );
  const sketch = await add(1, "deliverable", "sketch.png");
  const notes = await add(2, "deliverable", "notes.png");
  const chat = await add(3, "source", "chat.png");
  const send: SendDelivery = {
    id: testId(400),
    dealId: deal.dealId,
    sellerId: deal.seller.id,
    version: 1,
    stage: 1,
    message: "  Here is the sketch ",
    artifactIds: [notes.id, sketch.id],
  };
  return { ...deal, sketch, notes, chat, send };
}

const types = async (dealId: string) => (await readLedger(db, dealId)).map((e) => e.type);

describe("deliveries", () => {
  it("sends a delivery with its files in order and logs each file by fingerprint", async () => {
    const { dealId, seller, sketch, notes, send } = await withFiles();
    const { delivery, entry } = await sendDelivery(db, send, at(2));
    expect(delivery).toMatchObject({
      id: testId(400),
      version: 1,
      stage: 1,
      message: "Here is the sketch",
      sentBy: seller.id,
      ledgerSeq: entry.seq,
      createdAt: at(2),
    });
    expect(delivery.files.map((f) => f.filename)).toEqual(["notes.png", "sketch.png"]);
    expect(entry).toMatchObject({
      type: "DELIVERY_SENT",
      actor: "seller",
      payload: {
        deliveryId: testId(400),
        version: 1,
        stage: 1,
        message: "Here is the sketch",
        files: [
          {
            artifactId: notes.id,
            filename: "notes.png",
            sizeBytes: notes.sizeBytes,
            sha256: notes.sha256,
          },
          {
            artifactId: sketch.id,
            filename: "sketch.png",
            sizeBytes: sketch.sizeBytes,
            sha256: sketch.sha256,
          },
        ],
      },
    });
    expect(await listDeliveries(db, dealId)).toEqual([delivery]);
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
  });

  it("records a message-less delivery with none", async () => {
    const { dealId, send } = await withFiles();
    const { entry } = await sendDelivery(db, { ...send, message: " " }, at(2));
    expect(entry.payload).toMatchObject({ message: null });
    expect((await listDeliveries(db, dealId))[0]?.message).toBeUndefined();
  });

  it("refuses another person, an unsigned version, a missing stage and files that are not deliverables", async () => {
    const { buyer, chat, send } = await withFiles();
    await expect(sendDelivery(db, { ...send, sellerId: buyer.id }, at(2))).rejects.toEqual(
      refusal("not-your-deal"),
    );
    await expect(sendDelivery(db, { ...send, version: 2 }, at(2))).rejects.toEqual(
      refusal("not-signed"),
    );
    await expect(sendDelivery(db, { ...send, stage: 3 }, at(2))).rejects.toEqual(
      refusal("no-stage"),
    );
    await expect(sendDelivery(db, { ...send, artifactIds: [chat.id] }, at(2))).rejects.toEqual(
      refusal("bad-files"),
    );
    await expect(sendDelivery(db, { ...send, artifactIds: [testId(999)] }, at(2))).rejects.toEqual(
      refusal("bad-files"),
    );
    await expect(
      sendDelivery(db, { ...send, artifactIds: [chat.id, chat.id] }, at(2)),
    ).rejects.toThrow(/listed twice/);
  });

  it("logs the email, the buyer's opening (once per 10 minutes) and every download", async () => {
    const { dealId, buyer, sketch, send } = await withFiles();
    await sendDelivery(db, send, at(2));
    const emailed = await recordDeliveryEmailed(
      db,
      { dealId, deliveryId: send.id, email: "Chris@Example.com", providerMessageId: "msg_1" },
      at(3),
    );
    expect(emailed).toMatchObject({
      type: "DELIVERY_EMAILED",
      actor: "system",
      payload: {
        deliveryId: send.id,
        emailSha256: sha256Hex("chris@example.com"),
        providerMessageId: "msg_1",
      },
    });

    const step = {
      dealId,
      deliveryId: send.id,
      buyerId: buyer.id,
      ip: "203.0.113.9",
      userAgent: "Phone",
    };
    const viewed = await recordDeliveryViewed(db, { ...step, access: "link" }, at(4));
    expect(viewed).toMatchObject({
      type: "DELIVERY_VIEWED",
      actor: "buyer",
      actorId: buyer.id,
      ip: "203.0.113.9",
      userAgent: "Phone",
      payload: { deliveryId: send.id, access: "link" },
    });
    expect(await recordDeliveryViewed(db, { ...step, access: "link" }, at(5))).toBeUndefined();
    const later = new Date(at(4).getTime() + VIEW_REPEAT_MS);
    expect(
      await recordDeliveryViewed(
        db,
        { dealId, deliveryId: send.id, buyerId: buyer.id, access: "paypal" },
        later,
      ),
    ).toMatchObject({
      payload: { access: "paypal" },
    });

    const downloaded = await recordDeliveryDownloaded(
      db,
      { ...step, artifactId: sketch.id },
      at(30),
    );
    expect(downloaded).toMatchObject({
      type: "DELIVERY_DOWNLOADED",
      actor: "buyer",
      ip: "203.0.113.9",
      payload: {
        deliveryId: send.id,
        artifactId: sketch.id,
        filename: "sketch.png",
        sizeBytes: sketch.sizeBytes,
        sha256: sketch.sha256,
      },
    });
    await recordDeliveryDownloaded(
      db,
      { dealId, deliveryId: send.id, buyerId: buyer.id, artifactId: sketch.id },
      at(31),
    );
    expect(await types(dealId)).toEqual(
      expect.arrayContaining([
        "DELIVERY_SENT",
        "DELIVERY_EMAILED",
        "DELIVERY_VIEWED",
        "DELIVERY_DOWNLOADED",
      ]),
    );
    expect((await types(dealId)).filter((t) => t === "DELIVERY_VIEWED")).toHaveLength(2);
    expect((await types(dealId)).filter((t) => t === "DELIVERY_DOWNLOADED")).toHaveLength(2);
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
  });

  it("refuses steps on a delivery or file that is not this deal's, and a seller acting as buyer", async () => {
    const { dealId, buyer, seller, chat, send } = await withFiles();
    await sendDelivery(db, send, at(2));
    const unknown = { dealId, deliveryId: testId(499), buyerId: buyer.id };
    await expect(recordDeliveryViewed(db, { ...unknown, access: "link" }, at(3))).rejects.toEqual(
      refusal("not-found"),
    );
    await expect(
      recordDeliveryEmailed(
        db,
        { dealId, deliveryId: testId(499), email: "a@b.example", providerMessageId: "m" },
        at(3),
      ),
    ).rejects.toEqual(refusal("not-found"));
    await expect(
      recordDeliveryDownloaded(
        db,
        { dealId, deliveryId: send.id, buyerId: buyer.id, artifactId: chat.id },
        at(3),
      ),
    ).rejects.toEqual(refusal("not-found"));
    await expect(
      recordDeliveryViewed(
        db,
        { dealId, deliveryId: send.id, buyerId: seller.id, access: "paypal" },
        at(3),
      ),
    ).rejects.toThrow(/not the deal's buyer/);
  });

  it("keeps deliveries unchangeable", async () => {
    const { send } = await withFiles();
    await sendDelivery(db, send, at(2));
    for (const sql of [
      "UPDATE deliveries SET stage = 2",
      "DELETE FROM deliveries",
      "UPDATE delivery_files SET position = 9",
      "DELETE FROM delivery_files",
      "TRUNCATE delivery_files",
      "TRUNCATE deliveries CASCADE",
    ]) {
      await expect(db.query(sql)).rejects.toThrow(/append-only/);
    }
  });

  it("lists and reads files of one kind only when asked", async () => {
    const { dealId, sketch, chat } = await withFiles();
    expect((await listArtifacts(db, dealId, "source")).map((a) => a.id)).toEqual([chat.id]);
    expect(await listArtifacts(db, dealId, "deliverable")).toHaveLength(2);
    expect(await listArtifacts(db, dealId)).toHaveLength(3);
    await expect(getArtifact(db, store, sketch.id, dealId, "source")).rejects.toThrow(
      /No artifact/,
    );
    expect((await getArtifact(db, store, sketch.id, dealId, "deliverable")).artifact.id).toBe(
      sketch.id,
    );
  });
});

describe("answers to deliveries", () => {
  /** Sends a delivery (test id 400 + n) of the sketch for `stage` and opens it as the buyer. */
  async function delivered(deal: Awaited<ReturnType<typeof withFiles>>, n: number, stage = 1) {
    const id = testId(400 + n);
    await sendDelivery(db, { ...deal.send, id, stage, artifactIds: [deal.sketch.id] }, at(n));
    await recordDeliveryViewed(
      db,
      { dealId: deal.dealId, deliveryId: id, buyerId: deal.buyer.id, access: "link" },
      at(n),
    );
    return id;
  }
  const answer = (
    deal: Awaited<ReturnType<typeof withFiles>>,
    deliveryId: string,
    reply: AnswerInput,
    minutes: number,
  ) =>
    answerDelivery(
      db,
      { dealId: deal.dealId, deliveryId, buyerId: deal.buyer.id, answer: reply, ip: "203.0.113.4" },
      at(minutes),
    );

  it("counts change requests across the deal against the revisions included, never refusing one", async () => {
    const deal = await withFiles({ revisionsIncluded: 2 });
    const results = [];
    for (const n of [1, 2, 3]) {
      const id = await delivered(deal, n);
      results.push(
        await answer(deal, id, { kind: "changes", request: ` Change ${String(n)} ` }, n),
      );
    }
    expect(results.map((r) => r.entry.payload)).toEqual([
      expect.objectContaining({
        request: "Change 1",
        revision: 1,
        revisionsIncluded: 2,
        beyondIncluded: false,
      }),
      expect.objectContaining({ revision: 2, beyondIncluded: false }),
      expect.objectContaining({ revision: 3, beyondIncluded: true }),
    ]);
    expect(results[0]?.entry).toMatchObject({
      type: "CHANGE_REQUESTED",
      actor: "buyer",
      ip: "203.0.113.4",
    });
    expect(results[0]?.answer).toMatchObject({ kind: "changes", request: "Change 1", revision: 1 });
    expect(results.every((r) => !r.completed)).toBe(true);
    expect(
      (await deliveryAnswers(db, deal.dealId)).map((a) => (a.kind === "changes" ? a.revision : 0)),
    ).toEqual([1, 2, 3]);
  });

  it("says when the agreement states no revision limit", async () => {
    const deal = await withFiles();
    const id = await delivered(deal, 1);
    const { entry, revisionsIncluded } = await answer(
      deal,
      id,
      { kind: "changes", request: "Bigger" },
      2,
    );
    expect(revisionsIncluded).toBeUndefined();
    expect(entry.payload).toMatchObject({
      revision: 1,
      revisionsIncluded: null,
      beyondIncluded: false,
    });
  });

  it("approves a stage naming its files, and completes the deal once every stage is approved", async () => {
    const deal = await withFiles();
    const first = await delivered(deal, 1, 1);
    const one = await answer(deal, first, { kind: "approved" }, 2);
    expect(one.entry).toMatchObject({
      type: "MILESTONE_APPROVED",
      payload: {
        deliveryId: first,
        version: 1,
        stage: 1,
        files: [{ artifactId: deal.sketch.id, sha256: deal.sketch.sha256 }],
      },
    });
    expect(one.completed).toBe(false);
    expect(one.answer).toEqual(expect.objectContaining({ kind: "approved" }));
    expect(one.answer).not.toHaveProperty("request");
    // A second delivery for an approved stage, approved too, does not complete the deal.
    expect(
      (await answer(deal, await delivered(deal, 3, 1), { kind: "approved" }, 4)).completed,
    ).toBe(false);
    const last = await answer(deal, await delivered(deal, 5, 2), { kind: "approved" }, 6);
    expect(last.completed).toBe(true);
    expect((await getDeal(db, deal.dealId))?.status).toBe("completed");
    // A completed deal can still be delivered to and answered.
    expect(
      (await answer(deal, await delivered(deal, 7, 2), { kind: "changes", request: "One more" }, 8))
        .completed,
    ).toBe(false);
    expect((await verifyStoredLedger(db, deal.dealId)).valid).toBe(true);
  });

  it("refuses an unopened delivery, a second answer, another person and an unknown delivery", async () => {
    const deal = await withFiles();
    await sendDelivery(db, { ...deal.send, id: testId(401), artifactIds: [deal.sketch.id] }, at(1));
    await expect(answer(deal, testId(401), { kind: "approved" }, 2)).rejects.toEqual(
      refusal("not-opened"),
    );
    const id = await delivered(deal, 2);
    await answer(deal, id, { kind: "approved" }, 3);
    await expect(answer(deal, id, { kind: "changes", request: "x" }, 4)).rejects.toEqual(
      refusal("already-answered"),
    );
    await expect(
      answerDelivery(
        db,
        {
          dealId: deal.dealId,
          deliveryId: id,
          buyerId: deal.seller.id,
          answer: { kind: "approved" },
        },
        at(5),
      ),
    ).rejects.toEqual(refusal("not-your-deal"));
    await expect(answer(deal, testId(499), { kind: "approved" }, 5)).rejects.toEqual(
      refusal("not-found"),
    );
    await expect(
      answerDelivery(
        db,
        {
          dealId: testId(999),
          deliveryId: id,
          buyerId: deal.buyer.id,
          answer: { kind: "approved" },
        },
        at(5),
      ),
    ).rejects.toThrow(/No deal/);
    await expect(answer(deal, id, { kind: "changes", request: "   " }, 6)).rejects.toThrow();
    await expect(db.query("UPDATE delivery_answers SET kind = 'changes'")).rejects.toThrow(
      /append-only/,
    );
  });
});
