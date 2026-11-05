import { createHash } from "node:crypto";
import { readLedger } from "@pactpal/db";
import { TEST_NOW, createTestDeal, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { attachmentHeader } from "./download.js";
import { buyerVisitors, dealTestApp, signedInAs } from "./test-app.js";

const db = useMigratedTestDatabase();

const MB = 1024 * 1024;
const sha256Hex = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const pdf = Buffer.from("%PDF-1.4\nchat export\n%%EOF\n");

/** The test deal and app with the seller signed in; `upload` sends bytes as a file. */
async function sellerDeal(trustProxyHops?: number) {
  const { seller, buyer, dealId } = await createTestDeal(db);
  const env = dealTestApp(db, undefined, trustProxyHops === undefined ? {} : { trustProxyHops });
  const token = await signedInAs(db, seller.id);
  const url = `/api/deals/${dealId}/files`;
  const upload = (
    bytes: Buffer,
    name: string | null = "chat.pdf",
    as = token,
    forwardedFor = "198.51.100.9",
  ) =>
    env.call("POST", url, as, bytes, {
      "content-type": "application/octet-stream",
      ...(name === null ? {} : { "x-file-name": encodeURIComponent(name) }),
      "user-agent": "TestBrowser/1.0",
      "x-forwarded-for": forwardedFor,
    });
  return { ...env, seller, buyer, dealId, token, url, upload };
}

describe("files on a deal", () => {
  it("lets the seller add a source file, logs it, and lists it", async () => {
    const { app, call, url, token, dealId, upload } = await sellerDeal();
    const res = await upload(pdf);
    expect(res.statusCode).toBe(201);
    const added = {
      id: testId(200),
      kind: "source",
      addedBy: "seller",
      filename: "chat.pdf",
      mediaType: "application/pdf",
      sizeBytes: pdf.byteLength,
      sha256: sha256Hex(pdf),
      addedAt: TEST_NOW.toISOString(),
    };
    expect(res.json()).toEqual(added);
    expect((await call("GET", url, token)).json()).toEqual({ files: [added] });
    const entry = (await readLedger(db, dealId)).at(-1);
    expect(entry).toMatchObject({
      type: "SOURCE_ADDED",
      actor: "seller",
      payload: { artifactId: testId(200), filename: "chat.pdf", sha256: sha256Hex(pdf) },
      userAgent: "TestBrowser/1.0",
    });
    expect(entry?.ip).toBeUndefined();
    await app.close();
  });

  it.each([
    // Render, measured 1 Nov 2026: whatever the visitor sends, then the visitor (added by
    // Cloudflare), then Cloudflare (added by Render's front server, the connection itself).
    [2, "1.2.3.4,160.79.106.128, 104.22.93.137", "160.79.106.128"],
    [1, "198.51.100.9", "198.51.100.9"],
    [0, "198.51.100.9", "127.0.0.1"],
  ])(
    "records the uploader's address when %i proxies are trusted",
    async (hops, forwardedFor, recorded) => {
      const { app, dealId, upload } = await sellerDeal(hops);
      expect((await upload(pdf, "chat.pdf", undefined, forwardedFor)).statusCode).toBe(201);
      expect((await readLedger(db, dealId)).at(-1)?.ip).toBe(recorded);
      await app.close();
    },
  );

  it("downloads the exact bytes as a saved file that cannot run in the page", async () => {
    const { app, call, url, token, upload } = await sellerDeal();
    await upload(pdf, 'Chat "final" été.pdf');
    const res = await call("GET", `${url}/${testId(200)}`, token);
    expect(res.statusCode).toBe(200);
    expect(res.rawPayload.equals(pdf)).toBe(true);
    expect(res.headers).toMatchObject({
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="Chat _final_ _t_.pdf"; filename*=UTF-8''Chat%20%22final%22%20%C3%A9t%C3%A9.pdf`,
      "content-security-policy": "default-src 'none'; sandbox",
      "x-content-type-options": "nosniff",
    });
    await app.close();
  });

  it("lets the buyer, signed in or by link, list, download and add reference files", async () => {
    const { app, call, url, buyer, dealId, upload, sent } = await sellerDeal();
    await upload(pdf);
    const visitors = await buyerVisitors(db, dealId, buyer.id);
    for (const [n, visitor] of visitors.entries()) {
      const listed = (await call("GET", url, visitor)).json<{ files: object[] }>().files;
      expect(listed[0]).toMatchObject({ id: testId(200), addedBy: "seller" });
      expect((await call("GET", `${url}/${testId(200)}`, visitor)).statusCode).toBe(200);
      const added = await upload(pdf, `brief-${String(n)}.pdf`, visitor);
      expect(added.statusCode).toBe(201);
      expect(added.json()).toMatchObject({ kind: "source", addedBy: "buyer" });
      expect((await readLedger(db, dealId)).at(-1)).toMatchObject({
        type: "SOURCE_ADDED",
        actor: "buyer",
        actorId: buyer.id,
        userAgent: "TestBrowser/1.0",
      });
    }
    // The seller is emailed once for each of the buyer's files, never for their own.
    expect(sent.map((m) => [m.kind, m.to, m.idempotencyKey])).toEqual([
      ["buyer-file", "maya@example.com", `buyer-file:${testId(201)}`],
      ["buyer-file", "maya@example.com", `buyer-file:${testId(202)}`],
    ]);
    expect(sent[0]?.text).toContain('The buyer added a file to "Logo design"');
    expect(sent[0]?.text).toContain("brief-0.pdf");
    await app.close();
  });

  it("keeps the buyer's file when the seller's email fails", async () => {
    const { app, buyer, dealId, upload, failEmailTo, logs } = await sellerDeal();
    failEmailTo.add("maya@example.com");
    const [paypalBuyer] = await buyerVisitors(db, dealId, buyer.id);
    expect((await upload(pdf, "brief.pdf", paypalBuyer)).statusCode).toBe(201);
    expect(logs.join("")).toContain("Buyer file email not sent");
    expect(logs.join("")).not.toContain("maya@example.com");
    await app.close();
  });

  it("refuses the buyer's delivered work and file types they may not add", async () => {
    const { app, call, url, buyer, dealId } = await sellerDeal();
    const [link = ""] = (await buyerVisitors(db, dealId, buyer.id)).slice(1);
    const send = (bytes: Buffer, query = "") =>
      call("POST", `${url}${query}`, link, bytes, {
        "content-type": "application/octet-stream",
        "x-file-name": "x.bin",
      });
    expect((await send(pdf, "?kind=deliverable")).statusCode).toBe(403);
    const other = await send(Buffer.from([0, 1, 2, 255]));
    expect(other.statusCode).toBe(415);
    expect(other.json()).toEqual({ error: "you can add PDF, PNG, JPEG, GIF or text files" });
    expect(await readLedger(db, dealId)).toHaveLength(1);
    await app.close();
  });

  it("answers 404 for a file of another deal, an unknown file or a bad id", async () => {
    const { app, call, token, upload } = await sellerDeal();
    await upload(pdf);
    const other = await call("POST", "/api/deals", token, {
      title: "Other",
      category: "art-and-design",
      currency: "USD",
    });
    const otherUrl = `/api/deals/${other.json<{ id: string }>().id}/files`;
    expect((await call("GET", `${otherUrl}/${testId(200)}`, token)).statusCode).toBe(404);
    expect((await call("GET", `${otherUrl}/${testId(999)}`, token)).statusCode).toBe(404);
    expect((await call("GET", `${otherUrl}/not-an-id`, token)).statusCode).toBe(404);
    await app.close();
  });

  it("refuses to send a file whose stored bytes no longer match its fingerprint", async () => {
    const { app, call, url, token, upload, logs } = await sellerDeal();
    await upload(pdf);
    await db.query("ALTER TABLE file_contents DISABLE TRIGGER file_contents_append_only");
    await db.query("UPDATE file_contents SET bytes = decode(repeat('41', $1::int), 'hex')", [
      pdf.byteLength,
    ]);
    const res = await call("GET", `${url}/${testId(200)}`, token);
    expect(res.statusCode).toBe(409);
    expect(logs.join("")).toContain("File failed its fingerprint check");
    await app.close();
  });

  it.each([
    ["no file name", pdf, null, 400],
    ["a name with a slash", pdf, "a/b.pdf", 400],
    ["an empty file", Buffer.alloc(0), "empty.txt", 400],
    ["a file over 10 MB", Buffer.alloc(10 * MB + 1, 65), "big.txt", 413],
  ] as const)("refuses %s", async (_name, bytes, name, status) => {
    const { app, dealId, upload } = await sellerDeal();
    expect((await upload(bytes, name)).statusCode).toBe(status);
    expect(await readLedger(db, dealId)).toHaveLength(1);
    await app.close();
  });

  it("refuses a name that is not valid URL encoding", async () => {
    const { app, call, url, token } = await sellerDeal();
    const res = await call("POST", url, token, pdf, {
      "content-type": "application/octet-stream",
      "x-file-name": "%E0%A4%A",
    });
    expect(res.statusCode).toBe(400);
    await app.close();
  });

  it("refuses a file that would take the deal over 50 MB", async () => {
    const { app, dealId, upload } = await sellerDeal();
    // A record claiming the deal's full 50 MB, without storing 50 MB in the test database.
    await db.query(
      `INSERT INTO artifacts (id, deal_id, kind, filename, media_type, size_bytes, sha256, ledger_seq, created_at)
       VALUES ($1, $2, 'source', 'full.bin', 'application/octet-stream', $3, $4, 0, now())`,
      [testId(900), dealId, 50 * MB, "a".repeat(64)],
    );
    expect((await upload(Buffer.from("one more"), "extra.txt")).statusCode).toBe(409);
    await app.close();
  });

  it("keeps the 1 MB limit on other routes", async () => {
    const { app, call, token } = await sellerDeal();
    const res = await call("POST", "/api/deals", token, {
      title: "x".repeat(2 * MB),
      category: "art-and-design",
      currency: "USD",
    });
    expect(res.statusCode).toBe(413);
    await app.close();
  });
});

describe("attachmentHeader", () => {
  it("keeps plain names readable and cannot be broken by quotes or line breaks", () => {
    expect(attachmentHeader("brief.txt")).toBe(
      `attachment; filename="brief.txt"; filename*=UTF-8''brief.txt`,
    );
    expect(attachmentHeader('a"\r\nb(1).txt')).toBe(
      `attachment; filename="a___b(1).txt"; filename*=UTF-8''a%22%0D%0Ab%281%29.txt`,
    );
  });
});
