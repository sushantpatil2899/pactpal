import { createHash } from "node:crypto";
import { readLedger, startClaimAnalysis } from "@pactpal/db";
import { TEST_NOW, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors } from "../deals/test-app.js";
import { expectSellerOnly, signedDispute, type TestFile } from "./test-support.js";

const db = useMigratedTestDatabase();
const sha = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
const png = (n: number) =>
  new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, ...new Uint8Array(n).fill(7)]);
const text = (value: string) => new TextEncoder().encode(value);

interface ChoicesView {
  exhibits: {
    id: string;
    filename: string;
    addedBy: string;
    send: string;
    reason: string | null;
    sentBytes: number | null;
    pastedClaim: boolean;
  }[];
  meter: { totalBytes: number; overTotal: boolean; maxTotalBytes: number };
  packets: {
    id: string;
    packetSha256: string;
    exhibits: { id: string; number?: number; sentSha256?: string }[];
  }[];
}

/** A signed deal with a dispute and ten files of several kinds and owners (eleven with the receipt). */
async function disputedDeal() {
  const files: TestFile[] = [
    ["chat.txt", "source", text("Maya: I can do it for $240\nChris: deal"), "seller"],
    ["brief.pdf", "source", text("%PDF-1.4 brief"), "seller"],
    ["reference.png", "source", png(40), "buyer"],
    ["notes.txt", "source", text("Chris: transparent background please"), "buyer"],
    ["sketch.png", "deliverable", png(100), "seller"],
    ["sketch-v2.png", "deliverable", png(120), "seller"],
    ["final.png", "deliverable", png(300), "seller"],
    ["final-small.png", "deliverable", png(60), "seller"],
    ["archive.zip", "source", new Uint8Array([0x50, 0x4b, 3, 4, 0, 255]), "seller"],
    ["moodboard.png", "source", png(80), "buyer"],
  ];
  const deal = await signedDispute(db, files);
  return { ...deal, url: `${deal.url}/packet` };
}

describe("evidence packets", () => {
  it("lists every document with how it goes to PayPal and the sizes so far", async () => {
    const { app, call, token, url } = await disputedDeal();
    const view = (await call("GET", url, token)).json<ChoicesView>();
    expect(view.exhibits.map((e) => [e.filename, e.send, e.reason])).toEqual([
      ["pactpal-receipt-v1.pdf", "as-is", null],
      ["sketch.png", "as-is", null],
      ["sketch-v2.png", "as-is", null],
      ["final.png", "as-is", null],
      ["final-small.png", "as-is", null],
      ["chat.txt", "text-as-pdf", null],
      ["brief.pdf", "as-is", null],
      ["reference.png", "as-is", null],
      ["notes.txt", "text-as-pdf", null],
      ["archive.zip", "left-out", "type"],
      ["moodboard.png", "as-is", null],
    ]);
    expect(view.exhibits.find((e) => e.filename === "reference.png")?.addedBy).toBe("buyer");
    expect(view.meter).toMatchObject({ overTotal: false, maxTotalBytes: 50 * 1024 * 1024 });
    expect(view.packets).toEqual([]);
    await app.close();
  });

  it("marks a buyer claim the seller pasted for this dispute, so the page starts with it unticked", async () => {
    const { app, call, token, url, dealId, seller } = await disputedDeal();
    const before = (await call("GET", url, token)).json<ChoicesView>();
    expect(before.exhibits.every((e) => !e.pastedClaim)).toBe(true);
    const notes = before.exhibits.find((e) => e.filename === "notes.txt");
    await startClaimAnalysis(
      db,
      {
        id: testId(810),
        dealId,
        disputeId: "PP-R-TEST-1",
        sellerId: seller.id,
        pastedArtifactId: notes?.id,
        promptVersion: 2,
        rankPromptVersion: 1,
      },
      TEST_NOW,
    );
    const after = (await call("GET", url, token)).json<ChoicesView>();
    expect(after.exhibits.filter((e) => e.pastedClaim).map((e) => e.filename)).toEqual([
      "notes.txt",
    ]);
    await app.close();
  });

  it("builds a packet of ten exhibits without the unticked one, logs it, and serves each file as recorded", async () => {
    const { app, call, token, url, dealId } = await disputedDeal();
    const built = await call("POST", url, token, { leaveOut: [testId(606)] });
    expect(built.statusCode).toBe(201);
    const packet = built.json<ChoicesView["packets"][number]>();
    const included = packet.exhibits.filter((e) => e.number !== undefined);
    // Spike 14: the receipt and nine files, final.png left out by the seller and the zip by type.
    expect(included).toHaveLength(9);
    expect(packet.exhibits.find((e) => e.id === testId(606))).toMatchObject({ send: "left-out" });
    const entry = (await readLedger(db, dealId)).at(-1);
    expect(entry).toMatchObject({
      type: "PACKET_BUILT",
      actor: "seller",
      payload: { packetSha256: packet.packetSha256, leftOut: 2 },
    });
    const file = await call("GET", `${url}/${packet.id}/file`, token);
    expect(file.statusCode).toBe(200);
    expect(file.headers["content-disposition"]).toContain("pactpal-packet-PP-R-TEST-1.pdf");
    expect(sha(file.rawPayload)).toBe(packet.packetSha256);
    const chat = included.find((e) => e.id === testId(600));
    const exhibit = await call(
      "GET",
      `${url}/${packet.id}/exhibits/${String(chat?.number)}`,
      token,
    );
    expect(exhibit.headers["content-type"]).toBe("application/pdf");
    expect(sha(exhibit.rawPayload)).toBe(chat?.sentSha256);
    expect((await call("GET", `${url}/${packet.id}/exhibits/99`, token)).statusCode).toBe(404);
    expect((await call("GET", url, token)).json<ChoicesView>().packets).toHaveLength(1);
    await app.close();
  });

  it("is for the seller only, and only for this deal's dispute and packets", async () => {
    const { app, call, token, url, dealId, buyer } = await disputedDeal();
    await expectSellerOnly(call, url, token, (await buyerVisitors(db, dealId, buyer.id))[0]);
    expect((await call("GET", `${url}/${testId(1)}/file`, token)).statusCode).toBe(404);
    expect((await call("GET", `${url}/not-an-id/exhibits/1`, token)).statusCode).toBe(404);
    await app.close();
  });

  it("refuses to build when the log fails its check", async () => {
    const { app, call, token, url, dealId } = await disputedDeal();
    await db.query("ALTER TABLE ledger_entries DISABLE TRIGGER ALL");
    await db.query(
      `UPDATE ledger_entries SET payload = '{"changed": true}'::jsonb WHERE deal_id = $1 AND seq = 1`,
      [dealId],
    );
    const refused = await call("POST", url, token, {});
    expect(refused.statusCode).toBe(409);
    expect(refused.json()).toEqual({
      error: "the deal's log failed its check, so no packet was built",
    });
    await app.close();
  });

  it("refuses plainly when the signed copy no longer matches its log entry", async () => {
    const { app, call, token, url, dealId } = await disputedDeal();
    await db.query("ALTER TABLE acceptances DISABLE TRIGGER ALL");
    await db.query("UPDATE acceptances SET typed_name = 'Someone Else' WHERE deal_id = $1", [
      dealId,
    ]);
    const refused = await call("GET", url, token);
    expect(refused.statusCode).toBe(409);
    expect(refused.json()).toEqual({
      error: "the signed copy failed its check, so no packet was built",
    });
    await app.close();
  });
});
