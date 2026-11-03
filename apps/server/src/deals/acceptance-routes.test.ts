import { getLatestAcceptance, readLedger, verifyStoredLedger } from "@pactpal/db";
import { TEST_NOW, createTestDeal, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { pdfTextLines } from "@pactpal/pdf/testing";
import { describe, expect, it } from "vitest";
import { ACCEPTANCE_NOTICE } from "../acceptance/document.js";
import { buyerVisitors, dealTestApp, signedInAs } from "./test-app.js";

const db = useMigratedTestDatabase();

const work = {
  summary: "A character illustration",
  deliverables: ["Full-body character, transparent PNG"],
  exclusions: ["Merchandise use"],
  revisionsIncluded: 2,
  milestones: [
    { title: "Sketch", amount: "120" },
    { title: "Final", amount: "120", dueDate: "2026-11-20" },
  ],
};

interface View {
  status: string;
  document: { terms: { version: number } } | null;
  documentSha256: string | null;
  accepted: { version: number; typedName: string; at: string } | null;
  lastDecline: { at: string; reason: string | null } | null;
}

/**
 * The test deal with its agreed work saved, the seller signed in with PayPal, and the buyer as a
 * PayPal session and a buyer-link session. `hops` sets how many proxies the server trusts.
 */
async function savedDeal(options: { trustProxyHops?: number; emailOff?: boolean } = {}) {
  const { seller, buyer, dealId } = await createTestDeal(db);
  await db.query("UPDATE users SET display_name = 'Maya' WHERE id = $1", [seller.id]);
  const env = dealTestApp(db, undefined, options);
  const token = await signedInAs(db, seller.id);
  expect((await env.call("POST", `/api/deals/${dealId}/scope`, token, work)).statusCode).toBe(201);
  const [buyerPayPal = "", buyerLink = ""] = await buyerVisitors(db, dealId, buyer.id);
  const base = `/api/deals/${dealId}/acceptance`;
  const read = async (who: string) => (await env.call("GET", base, who)).json<View>();
  return { ...env, seller, buyer, dealId, token, buyerPayPal, buyerLink, base, read };
}

/** Sends the seller's preview for acceptance and returns the document fingerprint sent. */
async function send(env: Awaited<ReturnType<typeof savedDeal>>) {
  const preview = await env.read(env.token);
  const res = await env.call("POST", `${env.base}/request`, env.token, {
    version: preview.document?.terms.version,
    documentSha256: preview.documentSha256,
  });
  expect(res.statusCode).toBe(200);
  return preview.documentSha256 ?? "";
}

/** A deal the buyer has signed by link, and the receipt's address. */
async function signedDeal(options: Parameters<typeof savedDeal>[0] = {}) {
  const env = await savedDeal(options);
  const documentSha256 = await send(env);
  await env.call("POST", `${env.base}/accept`, env.buyerLink, {
    documentSha256,
    typedName: "Chris Buyer",
  });
  return { ...env, documentSha256, receipt: `${env.base}/receipt` };
}

const types = async (dealId: string) => (await readLedger(db, dealId)).map((e) => e.type);

describe("acceptance", () => {
  it("shows the seller a preview of exactly what the buyer will see, and the buyer nothing yet", async () => {
    const { app, read, token, buyerLink, dealId } = await savedDeal();
    const preview = await read(token);
    expect(preview).toEqual({
      status: "draft",
      document: {
        format: 1,
        dealId,
        title: "Logo design",
        category: "Art and design commission",
        sellerName: "Maya",
        terms: {
          version: 1,
          contentSha256: expect.stringMatching(/^[0-9a-f]{64}$/) as unknown,
          currency: "USD",
          summary: "A character illustration",
          deliverables: ["Full-body character, transparent PNG"],
          exclusions: ["Merchandise use"],
          revisionsIncluded: 2,
          dueDate: null,
          milestones: [
            { title: "Sketch", amount: { minor: 12_000, text: "120.00" }, dueDate: null },
            { title: "Final", amount: { minor: 12_000, text: "120.00" }, dueDate: "2026-11-20" },
          ],
          total: { minor: 24_000, text: "240.00" },
        },
        notice: ACCEPTANCE_NOTICE,
      },
      documentSha256: expect.stringMatching(/^[0-9a-f]{64}$/) as unknown,
      accepted: null,
      lastDecline: null,
      emailOn: true,
      receiptEmails: null,
    });
    expect(await read(buyerLink)).toMatchObject({ status: "draft", document: null });
    await app.close();
  });

  it("shows what the buyer provides on the page the buyer signs and in the receipt", async () => {
    const env = await savedDeal();
    const { app, call, base, read, token, buyerLink, dealId } = env;
    const provides = [{ text: "Reference sketches", dueDate: "2026-11-10" }];
    await call("POST", `/api/deals/${dealId}/scope`, token, { ...work, buyerProvides: provides });
    const documentSha256 = await send(env);
    expect((await read(buyerLink)).document?.terms).toMatchObject({
      version: 2,
      buyerProvides: [{ text: "Reference sketches", dueDate: "2026-11-10" }],
    });
    const signedRes = await call("POST", `${base}/accept`, buyerLink, {
      documentSha256,
      typedName: "Chris Buyer",
    });
    expect(signedRes.statusCode).toBe(200);
    const receipt = await call("GET", `${base}/receipt`, buyerLink);
    expect(pdfTextLines(receipt.rawPayload).join("\n")).toContain(
      "Reference sketches (by 10 Nov 2026)",
    );
    await app.close();
  });

  it("sends, then the buyer signs by link: the deal is active, the signed copy is kept and logged", async () => {
    const env = await savedDeal();
    const { app, call, base, read, token, buyerLink, buyer, dealId, logs } = env;
    const documentSha256 = await send(env);
    expect((await read(buyerLink)).status).toBe("awaiting_acceptance");
    expect((await read(buyerLink)).documentSha256).toBe(documentSha256);
    // Editing is locked while waiting.
    expect((await call("POST", `/api/deals/${dealId}/scope`, token, work)).statusCode).toBe(409);

    const signed = await call(
      "POST",
      `${base}/accept`,
      buyerLink,
      { documentSha256, typedName: " Chris Buyer " },
      { "user-agent": "TestBrowser/1.0", "x-forwarded-for": "198.51.100.9" },
    );
    expect(signed.statusCode).toBe(200);
    expect(signed.json()).toMatchObject({
      status: "active",
      documentSha256,
      accepted: { version: 1, typedName: "Chris Buyer", at: TEST_NOW.toISOString() },
    });
    expect(await read(token)).toEqual(signed.json());

    const entries = await readLedger(db, dealId);
    expect(entries.map((e) => e.type)).toEqual([
      "DEAL_CREATED",
      "SCOPE_VERSIONED",
      "ACCEPTANCE_REQUESTED",
      "ACCEPTED",
      "RECEIPT_SENT",
      "RECEIPT_SENT",
    ]);
    const accepted = entries.find((e) => e.type === "ACCEPTED");
    expect(accepted).toMatchObject({
      actor: "buyer",
      actorId: buyer.id,
      userAgent: "TestBrowser/1.0",
      payload: { typedName: "Chris Buyer", noticeVersion: 1, access: "link", documentSha256 },
    });
    // Without a known number of proxies, no address is recorded.
    expect(accepted?.ip).toBeUndefined();
    expect((await getLatestAcceptance(db, dealId))?.documentSha256).toBe(documentSha256);
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
    expect(logs.join("")).not.toContain("Chris Buyer");
    await app.close();
  });

  it("records the visitor's address when the number of proxies is known", async () => {
    const env = await savedDeal({ trustProxyHops: 1 });
    const documentSha256 = await send(env);
    const res = await env.call(
      "POST",
      `${env.base}/accept`,
      env.buyerPayPal,
      { documentSha256, typedName: "Chris Buyer" },
      { "x-forwarded-for": "203.0.113.50, 198.51.100.9", "user-agent": "" },
    );
    expect(res.statusCode).toBe(200);
    const last = (await readLedger(db, env.dealId)).find((e) => e.type === "ACCEPTED");
    expect(last).toMatchObject({ ip: "198.51.100.9", payload: { access: "paypal" } });
    expect(last?.userAgent).toBeUndefined();
    expect(env.logs.join("")).not.toContain("198.51.100.9");
    await env.app.close();
  });

  it("goes back to draft on a decline with a reason the seller sees, and can be sent again", async () => {
    const env = await savedDeal();
    const { app, call, base, read, token, buyerLink, dealId } = env;
    const first = await send(env);
    const declined = await call("POST", `${base}/decline`, buyerLink, {
      documentSha256: first,
      reason: "  Can the final be due earlier? ",
    });
    expect(declined.json()).toMatchObject({ status: "draft", document: null, lastDecline: null });
    expect((await read(token)).lastDecline).toEqual({
      at: TEST_NOW.toISOString(),
      reason: "Can the final be due earlier?",
    });

    expect((await call("POST", `/api/deals/${dealId}/scope`, token, work)).statusCode).toBe(201);
    const second = await send(env);
    expect(second).not.toBe(first);
    expect((await read(token)).lastDecline).toBeNull();
    expect(await types(dealId)).toEqual([
      "DEAL_CREATED",
      "SCOPE_VERSIONED",
      "ACCEPTANCE_REQUESTED",
      "DECLINED",
      "SCOPE_VERSIONED",
      "ACCEPTANCE_REQUESTED",
    ]);
    await app.close();
  });

  it("shows a decline without a reason, and lets the seller withdraw", async () => {
    const env = await savedDeal();
    const { app, call, base, read, token, buyerLink } = env;
    const documentSha256 = await send(env);
    await call("POST", `${base}/decline`, buyerLink, { documentSha256 });
    expect((await read(token)).lastDecline).toEqual({ at: TEST_NOW.toISOString(), reason: null });

    await send(env);
    const withdrawn = await call("POST", `${base}/withdraw`, token);
    expect(withdrawn.json()).toMatchObject({ status: "draft", lastDecline: null });
    expect((await call("POST", `${base}/withdraw`, token)).json()).toEqual({
      error: "the deal is not at this stage any more; reload the page",
      reason: "wrong-status",
    });
    await app.close();
  });

  it("refuses a page that no longer shows the newest terms", async () => {
    const env = await savedDeal();
    const { app, call, base, read, token, buyerLink, dealId } = env;
    const preview = await read(token);
    const stale = { version: 1, documentSha256: "0".repeat(64) };
    expect((await call("POST", `${base}/request`, token, stale)).json()).toMatchObject({
      reason: "stale",
    });
    expect(
      (
        await call("POST", `${base}/request`, token, {
          version: 2,
          documentSha256: preview.documentSha256,
        })
      ).statusCode,
    ).toBe(409);

    await send(env);
    // The seller renames themselves while the buyer's page is open: what they saw is not current.
    await db.query("UPDATE users SET display_name = 'Maya Studio' WHERE id = $1", [env.seller.id]);
    const res = await call("POST", `${base}/accept`, buyerLink, {
      documentSha256: preview.documentSha256,
      typedName: "Chris Buyer",
    });
    expect(res.statusCode).toBe(409);
    expect(res.json()).toMatchObject({ reason: "stale" });
    expect((await call("POST", `${base}/decline`, buyerLink, stale)).statusCode).toBe(409);
    expect((await read(token)).status).toBe("awaiting_acceptance");
    expect(await types(dealId)).not.toContain("ACCEPTED");
    await app.close();
  });

  it("refuses each step to the wrong person or at the wrong stage", async () => {
    const env = await savedDeal();
    const { app, call, base, token, buyerLink, buyerPayPal } = env;
    const sha = { documentSha256: "a".repeat(64) };
    expect(
      (await call("POST", `${base}/request`, buyerPayPal, { version: 1, ...sha })).statusCode,
    ).toBe(403);
    expect((await call("POST", `${base}/withdraw`, buyerLink)).statusCode).toBe(403);
    expect(
      (await call("POST", `${base}/accept`, token, { ...sha, typedName: "Maya" })).statusCode,
    ).toBe(403);
    expect((await call("POST", `${base}/decline`, token, sha)).statusCode).toBe(403);
    // Signing before it was sent.
    expect(
      (await call("POST", `${base}/accept`, buyerLink, { ...sha, typedName: "Chris" })).json(),
    ).toMatchObject({ reason: "wrong-status" });

    const documentSha256 = await send(env);
    expect(
      (await call("POST", `${base}/request`, token, { version: 1, documentSha256 })).json(),
    ).toMatchObject({ reason: "wrong-status" });
    expect(
      (await call("POST", `${base}/accept`, buyerLink, { documentSha256, typedName: "C" }))
        .statusCode,
    ).toBe(400);
    await app.close();
  });

  it("refuses to send without saved work or without a buyer", async () => {
    const { seller, dealId } = await createTestDeal(db);
    const env = dealTestApp(db);
    const token = await signedInAs(db, seller.id);
    const body = { version: 1, documentSha256: "a".repeat(64) };
    expect(
      (await env.call("POST", `/api/deals/${dealId}/acceptance/request`, token, body)).json(),
    ).toMatchObject({ error: "save the agreed work first", reason: "no-scope" });

    const created = await env.call("POST", "/api/deals", token, {
      title: "No buyer yet",
      category: "art-and-design",
      currency: "USD",
    });
    const id = created.json<{ id: string }>().id;
    await env.call("POST", `/api/deals/${id}/scope`, token, work);
    const preview = (await env.call("GET", `/api/deals/${id}/acceptance`, token)).json<View>();
    const res = await env.call("POST", `/api/deals/${id}/acceptance/request`, token, {
      version: 1,
      documentSha256: preview.documentSha256,
    });
    expect(res.json()).toMatchObject({ error: "add the buyer first", reason: "no-buyer" });
    await env.app.close();
  });

  it("answers 401 signed out and 404 for a deal the person cannot see", async () => {
    const env = await savedDeal();
    expect((await env.call("GET", env.base)).statusCode).toBe(401);
    const missing = `/api/deals/${testId(999)}/acceptance`;
    expect((await env.call("GET", missing, env.token)).statusCode).toBe(404);
    await env.app.close();
  });
});

describe("the receipt", () => {
  it("gives both sides the same PDF, as a file to save", async () => {
    const { app, call, receipt, token, buyerLink, buyerPayPal } = await signedDeal();
    const fromSeller = await call("GET", receipt, token);
    expect(fromSeller.statusCode).toBe(200);
    expect(fromSeller.headers["content-type"]).toBe("application/pdf");
    expect(fromSeller.headers["content-disposition"]).toContain(
      'attachment; filename="pactpal-receipt-v1.pdf"',
    );
    expect(fromSeller.headers["content-security-policy"]).toBe("default-src 'none'; sandbox");
    expect(fromSeller.headers["cache-control"]).toBe("private, no-store");
    const lines = pdfTextLines(fromSeller.rawPayload);
    expect(lines).toContain("Chris Buyer");
    expect(lines).toContain("Maya");
    for (const visitor of [buyerLink, buyerPayPal]) {
      const fromBuyer = await call("GET", receipt, visitor);
      expect(fromBuyer.rawPayload.equals(fromSeller.rawPayload)).toBe(true);
    }
    await app.close();
  });

  it("is not there before the buyer signs, nor for someone who cannot see the deal", async () => {
    const env = await savedDeal();
    expect((await env.call("GET", `${env.base}/receipt`, env.token)).json()).toEqual({
      error: "not signed yet",
    });
    expect((await env.call("GET", `${env.base}/receipt`)).statusCode).toBe(401);
    expect(
      (await env.call("GET", `/api/deals/${testId(999)}/acceptance/receipt`, env.token)).statusCode,
    ).toBe(404);
    await env.app.close();
  });

  it("is refused, and logged, when the signed copy no longer matches its fingerprint", async () => {
    const { app, call, receipt, token, logs } = await signedDeal();
    await db.query("ALTER TABLE acceptances DISABLE TRIGGER acceptances_append_only");
    // A changed typed name (checked against the log entry) and a changed page (its fingerprint).
    await db.query(`UPDATE acceptances SET typed_name = 'Someone else'`);
    const renamed = await call("GET", receipt, token);
    expect(renamed.statusCode).toBe(409);
    expect(renamed.json()).toEqual({ error: "this receipt failed its check and was not sent" });
    await db.query(`UPDATE acceptances SET typed_name = 'Chris Buyer'`);
    expect((await call("GET", receipt, token)).statusCode).toBe(200);
    await db.query(`UPDATE acceptances SET document = jsonb_set(document, '{title}', '"Changed"')`);
    expect((await call("GET", receipt, token)).statusCode).toBe(409);
    expect(logs.join("")).toContain("Signed copy failed its check; no receipt sent");
    await app.close();
  });
});

describe("the receipt email", () => {
  const RECEIPT_SENT = (dealId: string) =>
    readLedger(db, dealId).then((entries) => entries.filter((e) => e.type === "RECEIPT_SENT"));

  it("goes to both sides after signing, with the downloadable PDF attached, and is logged", async () => {
    const { app, call, receipt, token, buyerLink, dealId, sent, logs } = await signedDeal();
    expect(sent.map((m) => [m.kind, m.to, m.idempotencyKey])).toEqual([
      ["receipt", "chris@example.com", `receipt:${dealId}:v1:buyer:1`],
      ["receipt", "maya@example.com", `receipt:${dealId}:v1:seller:1`],
    ]);
    const pdf = (await call("GET", receipt, token)).rawPayload;
    for (const mail of sent) {
      expect(Buffer.from(mail.attachments?.[0]?.bytes ?? []).equals(pdf)).toBe(true);
      expect(mail.attachments?.[0]?.filename).toBe("pactpal-receipt-v1.pdf");
    }
    expect(sent[0]?.text).toContain("You signed the agreement");
    expect(sent[1]?.text).toContain("Chris Buyer signed your agreement");

    const entries = await RECEIPT_SENT(dealId);
    expect(entries.map((e) => e.payload)).toEqual([
      expect.objectContaining({ to: "buyer", version: 1, providerMessageId: "msg_1" }),
      expect.objectContaining({ to: "seller", version: 1, providerMessageId: "msg_2" }),
    ]);
    expect(JSON.stringify(entries)).not.toContain("example.com");
    expect((await call("GET", `/api/deals/${dealId}/acceptance`, buyerLink)).json()).toMatchObject({
      emailOn: true,
      receiptEmails: { buyer: TEST_NOW.toISOString(), seller: TEST_NOW.toISOString() },
    });
    expect(logs.join("")).not.toContain("example.com");
    await app.close();
  });

  it("still signs when a send fails, shows it as not emailed, and the seller can send it again", async () => {
    const env = await savedDeal();
    env.failEmailTo.add("chris@example.com");
    const documentSha256 = await send(env);
    const signed = await env.call("POST", `${env.base}/accept`, env.buyerLink, {
      documentSha256,
      typedName: "Chris Buyer",
    });
    expect(signed.json()).toMatchObject({
      status: "active",
      receiptEmails: { buyer: null, seller: TEST_NOW.toISOString() },
    });
    expect(env.logs.join("")).toContain("Receipt email not sent");
    expect(env.logs.join("")).not.toContain("chris@example.com");

    env.failEmailTo.clear();
    // Only the seller may ask; the buyer gets 403.
    expect((await env.call("POST", `${env.base}/receipt-email`, env.buyerLink)).statusCode).toBe(
      403,
    );
    const again = await env.call("POST", `${env.base}/receipt-email`, env.token);
    expect(again.json()).toMatchObject({ receiptEmails: { buyer: TEST_NOW.toISOString() } });
    // The buyer's first email, and a second (new key) for the seller.
    expect(env.sent.map((m) => m.idempotencyKey)).toEqual([
      `receipt:${env.dealId}:v1:seller:1`,
      `receipt:${env.dealId}:v1:buyer:1`,
      `receipt:${env.dealId}:v1:seller:2`,
    ]);
    await env.app.close();
  });

  it("stops at 5 receipt emails for a version", async () => {
    const { app, call, base, token, dealId } = await signedDeal();
    expect((await call("POST", `${base}/receipt-email`, token)).statusCode).toBe(200);
    // 4 sent so far; the next round sends only one more, then refuses.
    expect((await call("POST", `${base}/receipt-email`, token)).statusCode).toBe(200);
    expect(await RECEIPT_SENT(dealId)).toHaveLength(5);
    const refused = await call("POST", `${base}/receipt-email`, token);
    expect(refused.statusCode).toBe(429);
    expect(refused.json()).toEqual({ error: "this receipt was already emailed 5 times" });
    await app.close();
  });

  it("sends nothing and logs nothing when email is off, and says so", async () => {
    const { app, call, base, token, dealId } = await signedDeal({ emailOff: true });
    expect(await RECEIPT_SENT(dealId)).toHaveLength(0);
    expect((await call("GET", base, token)).json()).toMatchObject({
      emailOn: false,
      receiptEmails: { buyer: null, seller: null },
    });
    expect((await call("POST", `${base}/receipt-email`, token)).json()).toEqual({
      error: "email is not set up",
    });
    await app.close();
  });

  it("is refused before signing", async () => {
    const env = await savedDeal();
    expect((await env.call("POST", `${env.base}/receipt-email`, env.token)).json()).toEqual({
      error: "not signed yet",
    });
    await env.app.close();
  });

  it("is refused when the signed copy fails its check", async () => {
    const { app, call, base, token } = await signedDeal();
    await db.query("ALTER TABLE acceptances DISABLE TRIGGER acceptances_append_only");
    await db.query(`UPDATE acceptances SET typed_name = 'Someone else'`);
    expect((await call("POST", `${base}/receipt-email`, token)).statusCode).toBe(409);
    await app.close();
  });

  it("does not undo the signature when the receipt cannot be built after signing", async () => {
    const env = await savedDeal();
    const documentSha256 = await send(env);
    // Break the ledger read used for the receipt, only for this one call.
    await db.query(`CREATE FUNCTION pactpal_fail() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN RAISE EXCEPTION 'receipt log broken'; END; $$`);
    await db.query(`CREATE TRIGGER fail_receipt BEFORE INSERT ON ledger_entries FOR EACH ROW
      WHEN (NEW.type = 'RECEIPT_SENT') EXECUTE FUNCTION pactpal_fail()`);
    const signed = await env.call("POST", `${env.base}/accept`, env.buyerLink, {
      documentSha256,
      typedName: "Chris Buyer",
    });
    expect(signed.statusCode).toBe(200);
    expect(signed.json()).toMatchObject({ status: "active" });
    expect(env.logs.join("")).toContain("Receipt email failed after signing");
    await env.app.close();
  });
});

describe("the buyer link email", () => {
  it("says whether the email went, with a key made from the link's fingerprint", async () => {
    const env = await savedDeal();
    const made = await env.call("POST", `/api/deals/${env.dealId}/buyer-link`, env.token);
    expect(made.json()).toMatchObject({ emailed: true });
    expect(env.sent.at(-1)?.idempotencyKey).toMatch(/^deal-link:[0-9a-f]{64}$/);

    env.failEmailTo.add("chris@example.com");
    expect(
      (await env.call("POST", `/api/deals/${env.dealId}/buyer-link`, env.token)).json(),
    ).toMatchObject({
      emailed: false,
    });
    expect(env.logs.join("")).toContain("Buyer link email not sent");
    await env.app.close();
  });

  it("is not reported as a failure when email is off", async () => {
    const off = await savedDeal({ emailOff: true });
    expect(
      (await off.call("POST", `/api/deals/${off.dealId}/buyer-link`, off.token)).json(),
    ).toMatchObject({
      emailed: false,
    });
    expect(off.logs.join("")).not.toContain("Buyer link email not sent");
    await off.app.close();
  });
});
