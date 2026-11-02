import { readLedger, verifyStoredLedger } from "@pactpal/db";
import {
  TEST_NOW,
  createSignedTestDeal,
  createTestDeal,
  testId,
  useMigratedTestDatabase,
} from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { buyerVisitors, dealTestApp, signedInAs } from "./test-app.js";

const db = useMigratedTestDatabase();

const png = (n: number) => Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 7, 7, n]);

interface DeliveryView {
  id: string;
  stage: number;
  stageTitle: string;
  message: string | null;
  files: { id: string; filename: string; sha256: string }[];
  access: {
    emailedAt: string | null;
    emailCount: number;
    opened: { count: number; lastAt: string | null };
    downloads: Record<string, { count: number }>;
  };
}
interface DeliveriesView {
  signed: boolean;
  emailOn: boolean;
  stages: { stage: number; title: string }[];
  deliveries: DeliveryView[];
}

/** A signed deal, the app (optionally trusting 1 proxy), the seller and both buyer sessions. */
async function signedDeal(options: { emailOff?: boolean } = {}) {
  const deal = await createSignedTestDeal(db, { revisionsIncluded: 2 });
  const env = dealTestApp(db, undefined, { trustProxyHops: 1, ...options });
  const token = await signedInAs(db, deal.seller.id);
  const [buyerPayPal = "", buyerLink = ""] = await buyerVisitors(db, deal.dealId, deal.buyer.id);
  const base = `/api/deals/${deal.dealId}/deliveries`;
  const upload = async (name: string, n: number, kind = "deliverable") =>
    (
      await env.call("POST", `/api/deals/${deal.dealId}/files?kind=${kind}`, token, png(n), {
        "content-type": "application/octet-stream",
        "x-file-name": name,
      })
    ).json<{ id: string }>().id;
  const list = async (who = token) => (await env.call("GET", base, who)).json<DeliveriesView>();
  /** Uploads sketch.png and delivers it alone for stage 1; its file id and the delivery's id. */
  const deliverSketch = async () => {
    const sketch = await upload("sketch.png", 1);
    const answer = await env.call("POST", base, token, { stage: 1, fileIds: [sketch] });
    return { sketch, id: answer.json<DeliveriesView>().deliveries[0]?.id ?? "" };
  };
  return { ...deal, ...env, token, buyerPayPal, buyerLink, base, upload, list, deliverSketch };
}

const entriesOf = async (dealId: string, type: string) =>
  (await readLedger(db, dealId)).filter((e) => e.type === type);

describe("deliveries", () => {
  it("sends a stage's files with a message, emails the buyer a private link, and logs both", async () => {
    const { app, call, base, token, upload, list, sent, dealId, logs } = await signedDeal();
    expect((await list()).stages).toEqual([
      { stage: 1, title: "Deposit" },
      { stage: 2, title: "Final files" },
    ]);
    const sketch = await upload("sketch.png", 1);
    const notes = await upload("notes.png", 2);
    const res = await call("POST", base, token, {
      stage: 1,
      message: "Here is the sketch",
      fileIds: [sketch, notes],
    });
    expect(res.statusCode).toBe(200);
    const [delivery] = res.json<DeliveriesView>().deliveries;
    expect(delivery).toMatchObject({
      stage: 1,
      stageTitle: "Deposit",
      message: "Here is the sketch",
      files: [
        { id: sketch, filename: "sketch.png" },
        { id: notes, filename: "notes.png" },
      ],
      access: { emailedAt: TEST_NOW.toISOString(), emailCount: 1, opened: { count: 0 } },
    });
    expect(sent.map((m) => [m.kind, m.to])).toEqual([["delivery", "chris@example.com"]]);
    expect(sent[0]?.text).toContain("Maya Seller delivered work for stage 1 of 2");
    expect(sent[0]?.text).toMatch(/https:\/\/pactpal\.test\/link#t=[\w-]{43}/);
    expect((await entriesOf(dealId, "DELIVERY_SENT"))[0]?.payload).toMatchObject({
      stage: 1,
      message: "Here is the sketch",
    });
    expect(await entriesOf(dealId, "DELIVERY_EMAILED")).toHaveLength(1);
    expect(logs.join("")).not.toContain("chris@example.com");
    expect(logs.join("")).not.toContain("Here is the sketch");
    // Delivered files are not listed or served as ordinary files.
    expect((await call("GET", `/api/deals/${dealId}/files`, token)).json()).toEqual({ files: [] });
    expect((await call("GET", `/api/deals/${dealId}/files/${sketch}`, token)).statusCode).toBe(404);
    await app.close();
  });

  it("logs the buyer opening (once per 10 minutes) and each download with its fingerprint", async () => {
    const env = await signedDeal();
    const { app, call, base, token, buyerLink, buyerPayPal, list, dealId, deliverSketch } = env;
    const { sketch, id } = await deliverSketch();
    const headers = { "x-forwarded-for": "198.51.100.20", "user-agent": "Phone" };
    expect(
      (await call("POST", `${base}/${id}/open`, buyerLink, undefined, headers)).statusCode,
    ).toBe(200);
    await call("POST", `${base}/${id}/open`, buyerLink, undefined, headers);
    expect((await call("POST", `${base}/${id}/open`, token)).statusCode).toBe(403);
    const viewed = await entriesOf(dealId, "DELIVERY_VIEWED");
    expect(viewed).toHaveLength(1);
    expect(viewed[0]).toMatchObject({
      ip: "198.51.100.20",
      userAgent: "Phone",
      payload: { access: "link" },
    });

    const file = `${base}/${id}/files/${sketch}`;
    const got = await call("GET", file, buyerPayPal, undefined, headers);
    expect(got.statusCode).toBe(200);
    expect(got.rawPayload.equals(png(1))).toBe(true);
    expect(got.headers["content-disposition"]).toContain('filename="sketch.png"');
    await call("GET", file, buyerLink);
    // The seller's own downloads are not evidence.
    expect((await call("GET", file, token)).statusCode).toBe(200);
    const downloads = await entriesOf(dealId, "DELIVERY_DOWNLOADED");
    expect(downloads).toHaveLength(2);
    expect(downloads[0]).toMatchObject({
      actor: "buyer",
      ip: "198.51.100.20",
      payload: { artifactId: sketch, filename: "sketch.png" },
    });
    expect((await list(buyerLink)).deliveries[0]?.access).toMatchObject({
      opened: { count: 1 },
      downloads: { [sketch]: { count: 2 } },
    });
    expect((await list(buyerLink)).stages).toEqual([]);
    expect((await verifyStoredLedger(db, dealId)).valid).toBe(true);
    await app.close();
  });

  it("refuses a tampered file, unknown deliveries and files, and files that are not delivered work", async () => {
    const { app, call, base, token, buyerLink, upload, dealId, logs, deliverSketch } =
      await signedDeal();
    const { sketch, id } = await deliverSketch();
    const chat = await upload("chat.png", 3, "source");
    expect((await call("POST", base, token, { stage: 1, fileIds: [chat] })).json()).toEqual({
      error: "those files are not this deal's delivered files",
    });
    expect((await call("POST", base, token, { stage: 3, fileIds: [sketch] })).statusCode).toBe(400);
    expect((await call("GET", `${base}/${id}/files/${chat}`, buyerLink)).statusCode).toBe(404);
    expect(
      (await call("GET", `${base}/${testId(999)}/files/${sketch}`, buyerLink)).statusCode,
    ).toBe(404);
    expect((await call("POST", `${base}/${testId(999)}/open`, buyerLink)).statusCode).toBe(404);
    expect((await call("POST", `${base}/x/open`, buyerLink)).statusCode).toBe(404);

    await db.query("ALTER TABLE file_contents DISABLE TRIGGER USER");
    await db.query("UPDATE file_contents SET bytes = $1", [Buffer.from("changed!!!!")]);
    expect((await call("GET", `${base}/${id}/files/${sketch}`, buyerLink)).statusCode).toBe(409);
    expect(logs.join("")).toContain("File failed its fingerprint check");
    expect(await entriesOf(dealId, "DELIVERY_DOWNLOADED")).toHaveLength(0);
    await app.close();
  });

  it("keeps the delivery when the email fails, and lets the seller send it again, up to 3 times", async () => {
    const env = await signedDeal();
    const { app, call, base, token, list, failEmailTo, dealId, buyerLink, deliverSketch } = env;
    failEmailTo.add("chris@example.com");
    const { id } = await deliverSketch();
    expect((await list()).deliveries[0]?.access.emailCount).toBe(0);
    expect((await call("POST", `${base}/${id}/email`, token)).json()).toEqual({
      error: "the email was not sent; try again later",
    });
    failEmailTo.clear();
    for (let n = 1; n <= 3; n++) {
      expect(
        (await call("POST", `${base}/${id}/email`, token)).json<DeliveriesView>().deliveries[0]
          ?.access.emailCount,
      ).toBe(n);
    }
    expect((await call("POST", `${base}/${id}/email`, token)).json()).toEqual({
      error: "this delivery was already emailed 3 times",
    });
    expect((await call("POST", `${base}/${id}/email`, buyerLink)).statusCode).toBe(403);
    expect((await call("POST", `${base}/${testId(999)}/email`, token)).statusCode).toBe(404);
    expect(await entriesOf(dealId, "DELIVERY_EMAILED")).toHaveLength(3);
    await app.close();
  });

  it("says email is off and sends nothing then", async () => {
    const { app, call, base, token, sent, deliverSketch } = await signedDeal({ emailOff: true });
    const { id } = await deliverSketch();
    expect(sent).toHaveLength(0);
    expect((await call("POST", `${base}/${id}/email`, token)).json()).toEqual({
      error: "email is not set up",
    });
    await app.close();
  });
});

describe("deliveries before signing", () => {
  it("shows nothing and refuses to deliver", async () => {
    const { seller, dealId } = await createTestDeal(db);
    const env = dealTestApp(db);
    const token = await signedInAs(db, seller.id);
    const base = `/api/deals/${dealId}/deliveries`;
    expect((await env.call("GET", base, token)).json()).toEqual({
      signed: false,
      emailOn: true,
      stages: [],
      deliveries: [],
    });
    expect(
      (await env.call("POST", base, token, { stage: 1, fileIds: [testId(5)] })).json(),
    ).toEqual({
      error: "the deal is not signed yet",
    });
    await env.app.close();
  });
});

describe("answers to deliveries", () => {
  interface Answered extends DeliveriesView {
    revisions: { used: number; included: number | null };
    deliveries: (DeliveryView & {
      answer: { kind: string; request: string | null; revision: number | null } | null;
    })[];
  }

  it("lets the buyer request changes on an opened delivery, counts the revision and emails the seller", async () => {
    const env = await signedDeal();
    const { app, call, base, buyerLink, token, sent, dealId, deliverSketch, logs } = env;
    const { id } = await deliverSketch();
    const ask = (who: string, body: object = { request: "Turn the wheel" }) =>
      call("POST", `${base}/${id}/request-changes`, who, body);
    expect((await ask(buyerLink)).json()).toEqual({ error: "open the delivery first" });
    await call("POST", `${base}/${id}/open`, buyerLink);
    expect((await ask(token)).statusCode).toBe(403);
    expect((await ask(buyerLink, { request: " " })).statusCode).toBe(400);
    const res = await ask(buyerLink, { request: " Turn the wheel " });
    expect(res.statusCode).toBe(200);
    const view = res.json<Answered>();
    expect(view.revisions).toEqual({ used: 1, included: 2 });
    expect(view.deliveries[0]?.answer).toMatchObject({
      kind: "changes",
      request: "Turn the wheel",
      revision: 1,
    });
    expect((await ask(buyerLink)).json()).toEqual({ error: "this delivery was already answered" });
    const mail = sent.filter((m) => m.kind === "changes");
    expect(mail.map((m) => [m.to, m.idempotencyKey])).toEqual([
      ["maya@example.com", `answer:${id}`],
    ]);
    expect(mail[0]?.text).toContain("This is revision 1 of the 2 included in the agreement.");
    expect((await readLedger(db, dealId)).at(-1)).toMatchObject({
      type: "CHANGE_REQUESTED",
      actor: "buyer",
      payload: {
        request: "Turn the wheel",
        revision: 1,
        revisionsIncluded: 2,
        beyondIncluded: false,
      },
    });
    expect(logs.join("")).not.toContain("Turn the wheel");
    await app.close();
  });

  it("completes the deal when every stage is approved, and says so to the seller", async () => {
    const env = await signedDeal();
    const { app, call, base, buyerLink, token, sent, dealId, upload } = env;
    const approveStage = async (stage: number, n: number) => {
      const file = await upload(`stage${String(stage)}.png`, n);
      const id =
        (await call("POST", base, token, { stage, fileIds: [file] }))
          .json<DeliveriesView>()
          .deliveries.at(-1)?.id ?? "";
      await call("POST", `${base}/${id}/open`, buyerLink);
      return call("POST", `${base}/${id}/approve`, buyerLink);
    };
    expect((await approveStage(1, 1)).statusCode).toBe(200);
    expect((await call("GET", `/api/deals/${dealId}`, token)).json()).toMatchObject({
      status: "active",
    });
    const last = await approveStage(2, 2);
    expect(last.json<Answered>().deliveries.map((d) => d.answer?.kind)).toEqual([
      "approved",
      "approved",
    ]);
    expect((await call("GET", `/api/deals/${dealId}`, token)).json()).toMatchObject({
      status: "completed",
    });
    const approvals = sent.filter((m) => m.kind === "approved");
    expect(approvals).toHaveLength(2);
    expect(approvals[0]?.text).not.toContain("Every stage of the agreement is now approved.");
    expect(approvals[1]?.text).toContain("Every stage of the agreement is now approved.");
    // A completed deal still shows its deliveries and can still be delivered to.
    expect((await call("GET", base, buyerLink)).json<Answered>().signed).toBe(true);
    await app.close();
  });

  it("keeps the answer when the seller's email fails", async () => {
    const env = await signedDeal();
    const { app, call, base, buyerLink, failEmailTo, dealId, deliverSketch, logs } = env;
    const { id } = await deliverSketch();
    await call("POST", `${base}/${id}/open`, buyerLink);
    failEmailTo.add("maya@example.com");
    expect((await call("POST", `${base}/${id}/approve`, buyerLink)).statusCode).toBe(200);
    expect((await readLedger(db, dealId)).at(-1)?.type).toBe("MILESTONE_APPROVED");
    expect(logs.join("")).toContain('"sent":false');
    expect((await call("POST", `${base}/x/approve`, buyerLink)).statusCode).toBe(404);
    await app.close();
  });
});
