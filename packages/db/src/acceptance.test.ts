import { sha256Hex } from "@pactpal/ledger";
import { describe, expect, it } from "vitest";
import {
  AcceptanceIntegrityError,
  AcceptanceNotAllowedError,
  acceptTerms,
  declineTerms,
  documentFingerprint,
  getDeal,
  getLatestAcceptance,
  readLedger,
  recordReceiptSent,
  requestAcceptance,
  saveScopeVersion,
  verifyStoredLedger,
  withdrawAcceptance,
  type AcceptTerms,
  type Database,
  type ScopeContentInput,
} from "./index.js";
import { createDeal } from "./deals.js";
import { TEST_NOW, createTestDeal, testDeal, testId, useMigratedTestDatabase } from "./testing.js";

const db = useMigratedTestDatabase();
const at = (minutes: number) => new Date(TEST_NOW.getTime() + minutes * 60_000);

const work: ScopeContentInput = {
  format: 1,
  summary: "A character illustration",
  deliverables: ["Full-body character, transparent PNG"],
  exclusions: ["Merchandise use"],
  milestones: [{ title: "Whole work", amountMinor: 24_000 }],
};

/** Stands in for the server's acceptance document; any JSON is stored as given. */
const document = (version: number) => ({ format: 1, title: "Logo design", version });

/** The test deal with one saved version, and the fields every step needs. */
async function savedDeal() {
  const { seller, buyer, dealId } = await createTestDeal(db);
  const { scope } = await saveScopeVersion(
    db,
    { dealId, sellerId: seller.id, content: work },
    at(1),
  );
  const request = {
    dealId,
    sellerId: seller.id,
    version: scope.version,
    contentSha256: scope.contentSha256,
    documentSha256: documentFingerprint(document(1)),
  };
  const signing: AcceptTerms = {
    dealId,
    buyerId: buyer.id,
    version: 1,
    contentSha256: scope.contentSha256,
    document: document(1),
    noticeVersion: 1,
    typedName: "  Chris Buyer ",
    access: "link",
    ip: "203.0.113.7",
    userAgent: "Test browser",
  };
  return { seller, buyer, dealId, scope, request, signing };
}

const refusal = (reason: string) => new AcceptanceNotAllowedError(reason as never);
const statusOf = async (q: Database, id: string) => (await getDeal(q, id))?.status;

describe("acceptance", () => {
  it("sends, then signs: stores the document and typed name, logs both and makes the deal active", async () => {
    const { buyer, dealId, scope, request, signing } = await savedDeal();
    const requested = await requestAcceptance(db, request, at(2));
    expect(requested).toMatchObject({
      type: "ACCEPTANCE_REQUESTED",
      actor: "seller",
      payload: {
        version: 1,
        contentSha256: scope.contentSha256,
        documentSha256: request.documentSha256,
      },
    });
    expect(await statusOf(db, dealId)).toBe("awaiting_acceptance");

    const { acceptance, entry } = await acceptTerms(db, signing, at(3));
    expect(acceptance).toEqual({
      dealId,
      version: 1,
      document: document(1),
      documentSha256: documentFingerprint(document(1)),
      buyerId: buyer.id,
      typedName: "Chris Buyer",
      ledgerSeq: entry.seq,
      createdAt: at(3),
    });
    expect(entry).toMatchObject({
      type: "ACCEPTED",
      actor: "buyer",
      actorId: buyer.id,
      ip: "203.0.113.7",
      userAgent: "Test browser",
      payload: {
        version: 1,
        contentSha256: scope.contentSha256,
        documentSha256: documentFingerprint(document(1)),
        typedName: "Chris Buyer",
        noticeVersion: 1,
        access: "link",
      },
    });
    expect(await statusOf(db, dealId)).toBe("active");
    expect(await getLatestAcceptance(db, dealId)).toEqual(acceptance);
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
  });

  it("leaves out the connection details when they are not known", async () => {
    const { request, signing } = await savedDeal();
    await requestAcceptance(db, request, at(2));
    const { entry } = await acceptTerms(
      db,
      { ...signing, ip: undefined, userAgent: undefined },
      at(3),
    );
    expect(entry.ip).toBeUndefined();
    expect(entry.userAgent).toBeUndefined();
  });

  it("goes back to draft on a withdrawal or a decline, so the seller can edit and send again", async () => {
    const { seller, buyer, dealId, request } = await savedDeal();
    await requestAcceptance(db, request, at(2));
    expect(await withdrawAcceptance(db, { dealId, sellerId: seller.id }, at(3))).toMatchObject({
      type: "ACCEPTANCE_WITHDRAWN",
      payload: { version: 1 },
    });
    expect(await statusOf(db, dealId)).toBe("draft");

    await requestAcceptance(db, request, at(4));
    const declined = await declineTerms(
      db,
      {
        dealId,
        buyerId: buyer.id,
        version: 1,
        documentSha256: request.documentSha256,
        reason: "  The price is too high ",
        userAgent: "Test browser",
      },
      at(5),
    );
    expect(declined).toMatchObject({
      type: "DECLINED",
      actor: "buyer",
      userAgent: "Test browser",
      payload: {
        version: 1,
        documentSha256: request.documentSha256,
        reason: "The price is too high",
      },
    });
    expect(declined.ip).toBeUndefined();
    expect(await statusOf(db, dealId)).toBe("draft");

    const { scope } = await saveScopeVersion(
      db,
      { dealId, sellerId: seller.id, content: { ...work, summary: "Cheaper" } },
      at(6),
    );
    await requestAcceptance(
      db,
      { ...request, version: 2, contentSha256: scope.contentSha256 },
      at(7),
    );
    expect(await getLatestAcceptance(db, dealId)).toBeUndefined();
    expect((await readLedger(db, dealId)).map((e) => e.type)).toEqual([
      "DEAL_CREATED",
      "SCOPE_VERSIONED",
      "ACCEPTANCE_REQUESTED",
      "ACCEPTANCE_WITHDRAWN",
      "ACCEPTANCE_REQUESTED",
      "DECLINED",
      "SCOPE_VERSIONED",
      "ACCEPTANCE_REQUESTED",
    ]);
  });

  it("records a blank decline reason as none", async () => {
    const { buyer, dealId, request } = await savedDeal();
    await requestAcceptance(db, request, at(2));
    const declined = await declineTerms(
      db,
      {
        dealId,
        buyerId: buyer.id,
        version: 1,
        documentSha256: request.documentSha256,
        reason: " ",
      },
      at(3),
    );
    expect(declined.payload).toEqual({ version: 1, documentSha256: request.documentSha256 });
  });

  it("refuses the wrong person for each step", async () => {
    const { seller, buyer, dealId, request, signing } = await savedDeal();
    await expect(requestAcceptance(db, { ...request, sellerId: buyer.id }, at(2))).rejects.toEqual(
      refusal("not-your-deal"),
    );
    await requestAcceptance(db, request, at(2));
    await expect(withdrawAcceptance(db, { dealId, sellerId: buyer.id }, at(3))).rejects.toEqual(
      refusal("not-your-deal"),
    );
    await expect(acceptTerms(db, { ...signing, buyerId: seller.id }, at(3))).rejects.toEqual(
      refusal("not-your-deal"),
    );
    await expect(
      declineTerms(
        db,
        { dealId, buyerId: seller.id, version: 1, documentSha256: request.documentSha256 },
        at(3),
      ),
    ).rejects.toEqual(refusal("not-your-deal"));
  });

  it("refuses steps at the wrong stage", async () => {
    const { seller, dealId, request, signing } = await savedDeal();
    await expect(acceptTerms(db, signing, at(2))).rejects.toEqual(refusal("wrong-status"));
    await expect(withdrawAcceptance(db, { dealId, sellerId: seller.id }, at(2))).rejects.toEqual(
      refusal("wrong-status"),
    );
    await requestAcceptance(db, request, at(2));
    await expect(requestAcceptance(db, request, at(3))).rejects.toEqual(refusal("wrong-status"));
    await acceptTerms(db, signing, at(3));
    await expect(acceptTerms(db, signing, at(4))).rejects.toEqual(refusal("wrong-status"));
    await expect(withdrawAcceptance(db, { dealId, sellerId: seller.id }, at(4))).rejects.toEqual(
      refusal("wrong-status"),
    );
  });

  it("refuses to send without a buyer or without agreed work", async () => {
    const { seller, dealId } = await createTestDeal(db);
    const request = {
      dealId,
      sellerId: seller.id,
      version: 1,
      contentSha256: "a".repeat(64),
      documentSha256: "b".repeat(64),
    };
    await expect(requestAcceptance(db, request, at(1))).rejects.toEqual(refusal("no-scope"));
    const { deal } = await createDeal(db, testDeal(seller.id, { id: testId(101) }), at(1));
    await expect(requestAcceptance(db, { ...request, dealId: deal.id }, at(2))).rejects.toEqual(
      refusal("no-buyer"),
    );
  });

  it("refuses a version that is not the newest, or whose content changed", async () => {
    const { seller, dealId, request, signing } = await savedDeal();
    await expect(requestAcceptance(db, { ...request, version: 2 }, at(2))).rejects.toEqual(
      refusal("stale"),
    );
    await expect(
      requestAcceptance(db, { ...request, contentSha256: "c".repeat(64) }, at(2)),
    ).rejects.toEqual(refusal("stale"));
    await saveScopeVersion(db, { dealId, sellerId: seller.id, content: work }, at(2));
    await expect(requestAcceptance(db, request, at(3))).rejects.toEqual(refusal("stale"));

    await requestAcceptance(db, { ...request, version: 2 }, at(3));
    await expect(acceptTerms(db, signing, at(4))).rejects.toEqual(refusal("stale"));
    expect(await statusOf(db, dealId)).toBe("awaiting_acceptance");
  });

  it("refuses an unknown deal and a typed name that is too short", async () => {
    const { request, signing } = await savedDeal();
    await requestAcceptance(db, request, at(2));
    await expect(acceptTerms(db, { ...signing, typedName: " C " }, at(3))).rejects.toThrow();
    await expect(
      withdrawAcceptance(db, { dealId: testId(999), sellerId: request.sellerId }, at(3)),
    ).rejects.toThrow(/No deal/);
  });

  it("keeps acceptances unchangeable and notices a changed document", async () => {
    const { dealId, request, signing } = await savedDeal();
    await requestAcceptance(db, request, at(2));
    await acceptTerms(db, signing, at(3));
    await expect(db.query("UPDATE acceptances SET typed_name = 'Someone else'")).rejects.toThrow(
      /append-only/,
    );
    await expect(db.query("DELETE FROM acceptances")).rejects.toThrow(/append-only/);
    await expect(db.query("TRUNCATE acceptances")).rejects.toThrow(/append-only/);

    // Switching the guard off, as someone with full access could, is still noticed on reading.
    await db.query("ALTER TABLE acceptances DISABLE TRIGGER acceptances_append_only");
    await db.query(`UPDATE acceptances SET document = '{"format": 1, "title": "Changed"}'`);
    await expect(getLatestAcceptance(db, dealId)).rejects.toBeInstanceOf(AcceptanceIntegrityError);
  });

  it("records a receipt email by the system, with the address only as a fingerprint", async () => {
    const { dealId, request, signing } = await savedDeal();
    await requestAcceptance(db, request, at(2));
    await acceptTerms(db, signing, at(3));
    const entry = await recordReceiptSent(
      db,
      {
        dealId,
        version: 1,
        to: "buyer",
        receiptSha256: "d".repeat(64),
        email: "Chris@Example.com",
        providerMessageId: "msg_1",
      },
      at(4),
    );
    expect(entry).toMatchObject({
      type: "RECEIPT_SENT",
      actor: "system",
      payload: {
        version: 1,
        to: "buyer",
        receiptSha256: "d".repeat(64),
        emailSha256: sha256Hex("chris@example.com"),
        providerMessageId: "msg_1",
      },
    });
    expect(entry.actorId).toBeUndefined();
    expect(JSON.stringify(entry)).not.toContain("xample.com");
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
  });
});
