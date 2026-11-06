import { createHash } from "node:crypto";
import { readLedger, recordDispute } from "@pactpal/db";
import { TEST_NOW, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import {
  DisputeActionNotAllowed,
  PayPalApiError,
  PayPalNetworkError,
  type EscalateInput,
  type EvidenceInput,
} from "@pactpal/paypal";
import { describe, expect, it } from "vitest";
import { buyerVisitors } from "../deals/test-app.js";
import type { DisputeWriter } from "./action-service.js";
import type { CheckRequest } from "./checker.js";
import { expectSellerOnly, signedDispute, type TestFile } from "./test-support.js";

const db = useMigratedTestDatabase();
const sha = (value: Uint8Array | string) => createHash("sha256").update(value).digest("hex");
const text = (value: string) => new TextEncoder().encode(value);
const png = (n: number) =>
  new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, ...new Uint8Array(n).fill(7)]);
const NOTE = "The buyer approved the stage 1 sketch on 8 Nov after one change to the pose.";

const FILES: TestFile[] = [
  ["chat.txt", "source", text("Maya: a clean, modern look\nChris: deal"), "seller"],
  ["sketch.png", "deliverable", png(60), "seller"],
];

/** A stand-in for PayPal's dispute writes: keeps what it was sent, or fails as told. */
function fakeWriter() {
  const sent: { action: string; disputeId: string; input: EscalateInput | EvidenceInput }[] = [];
  const state: { fail: Error | undefined } = { fail: undefined };
  const answer = (action: string, disputeId: string, input: EscalateInput | EvidenceInput) => {
    if (state.fail !== undefined) return Promise.reject(state.fail);
    sent.push({ action, disputeId, input });
    return Promise.resolve({ data: { disputeId }, transport: "rest" as const, debugId: "dbg-1" });
  };
  const writer: DisputeWriter = {
    escalate: (disputeId, input) => answer("escalate", disputeId, input),
    provideEvidence: (disputeId, input) => answer("provide_evidence", disputeId, input),
  };
  return { writer, sent, state };
}

interface ActionsView {
  canSend: boolean;
  allowed: { escalate: boolean; evidence: boolean };
  evidenceTypes: string[];
  suggestedType: string | null;
  draftNote: string | null;
  packet: {
    id: string;
    packetSha256: string;
    newerEntries: number;
    files: { exhibit: number | null; name: string; bytes: number; sha256: string }[];
    totalBytes: number;
    overLimit: boolean;
  } | null;
  actions: { id: string; kind: string; status: string; failure: string | null }[];
}

/** A signed deal with a dispute PayPal lets the seller act on, a stand-in PayPal and a checker. */
async function disputedDeal(options: { writer?: boolean } = {}) {
  const paypal = fakeWriter();
  const checks: CheckRequest[] = [];
  const deal = await signedDispute(db, FILES, {
    ...(options.writer === false ? {} : { disputeWriter: paypal.writer }),
    disputes: {
      start: (request) => {
        checks.push(request);
        return Promise.resolve();
      },
    },
  });
  /** PayPal's state of the dispute at the last check. */
  const paypalAllows = (allowedActions: string[], requestedEvidence: string[] = []) =>
    recordDispute(
      db,
      {
        disputeId: "PP-R-TEST-1",
        status: "WAITING_FOR_SELLER_RESPONSE",
        allowedActions,
        offerTypes: [],
        details: { requestedEvidence },
      },
      { dealId: deal.dealId, stage: 1, invoiceId: "INV2-TEST-PAID", matchedBy: "transaction" },
      TEST_NOW,
    );
  const actions = () => deal.call("GET", `${deal.url}/actions`, deal.token);
  const view = async () => (await actions()).json<ActionsView>();
  const buildPacket = async () => {
    expect((await deal.call("POST", `${deal.url}/packet`, deal.token, {})).statusCode).toBe(201);
    const packet = (await view()).packet;
    if (!packet) throw new Error("no packet");
    return packet;
  };
  return { ...deal, paypal, checks, paypalAllows, view, buildPacket };
}

const confirmed = (note = NOTE) => ({ note, noteSha256: sha(note), confirmed: true });

describe("escalating a dispute", () => {
  it("sends only the confirmed note, logs DISPUTE_ESCALATED and checks the dispute again", async () => {
    const { app, call, token, url, view, paypal, checks, paypalAllows, dealId } =
      await disputedDeal();
    await paypalAllows(["escalate", "accept_claim"]);
    expect(await view()).toMatchObject({
      canSend: true,
      allowed: { escalate: true, evidence: false },
      evidenceTypes: ["OTHER"],
      suggestedType: null,
      draftNote: null,
      packet: null,
      actions: [],
    });
    const escalate = (body: object) => call("POST", `${url}/escalate`, token, body);
    expect((await escalate({ ...confirmed(), confirmed: false })).statusCode).toBe(400);
    expect((await escalate({ ...confirmed(), note: "Changed after the tick." })).json()).toEqual({
      error: "the note changed after you confirmed it; check it again",
    });
    const sent = await escalate(confirmed());
    expect(sent.statusCode).toBe(201);
    expect(paypal.sent).toEqual([
      {
        action: "escalate",
        disputeId: "PP-R-TEST-1",
        input: { note: NOTE, requestId: expect.stringMatching(/^pactpal-escalate-/) as string },
      },
    ]);
    expect(checks).toEqual([{ kind: "button", dealId }]);
    const entry = (await readLedger(db, dealId)).at(-1);
    expect(entry).toMatchObject({
      type: "DISPUTE_ESCALATED",
      actor: "seller",
      payload: { noteSha256: sha(NOTE), transport: "rest", debugId: "dbg-1" },
    });
    expect((await view()).actions).toMatchObject([{ kind: "escalate", status: "sent" }]);
    await app.close();
  });

  it("says when sending is not set up", async () => {
    const off = await disputedDeal({ writer: false });
    await off.paypalAllows(["escalate"]);
    expect((await off.view()).canSend).toBe(false);
    expect((await off.call("POST", `${off.url}/escalate`, off.token, confirmed())).statusCode).toBe(
      503,
    );
    await off.app.close();
  });

  it("refuses what PayPal does not allow at the last check, sending nothing", async () => {
    const { app, call, token, url, paypalAllows, paypal } = await disputedDeal();
    await paypalAllows(["accept_claim"]);
    expect((await call("POST", `${url}/escalate`, token, confirmed())).json()).toEqual({
      error: "PayPal does not allow this for the dispute now; check the dispute again",
    });
    expect(paypal.sent).toEqual([]);
    await app.close();
  });
});

describe("sending evidence", () => {
  it("uploads the packet PDF and each exhibit exactly as recorded, with a type PayPal asks for", async () => {
    const { app, call, token, url, paypalAllows, buildPacket, paypal, dealId, view } =
      await disputedDeal();
    await paypalAllows(["provide_evidence", "accept_claim"], ["PROOF_OF_FULFILLMENT", "OTHER"]);
    const packet = await buildPacket();
    expect(packet.files.map((f) => [f.exhibit, f.name])).toEqual([
      [null, "pactpal-packet-PP-R-TEST-1.pdf"],
      [1, "pactpal-receipt-v1.pdf"],
      [2, "sketch.png"],
      [3, "chat.pdf"],
    ]);
    const send = (body: object) => call("POST", `${url}/evidence`, token, body);
    const good = {
      ...confirmed(),
      packetId: packet.id,
      packetSha256: packet.packetSha256,
      evidenceType: "PROOF_OF_FULFILLMENT",
    };
    expect((await send({ ...good, evidenceType: "PROOF_OF_REFUND" })).json()).toEqual({
      error: "PayPal does not ask for that evidence type",
    });
    expect((await send({ ...good, packetSha256: "0".repeat(64) })).statusCode).toBe(409);
    expect((await send({ ...good, packetId: testId(999) })).statusCode).toBe(409);
    expect((await send(good)).statusCode).toBe(201);
    const [upload] = paypal.sent;
    const input = upload?.input as EvidenceInput;
    expect(input).toMatchObject({ evidenceType: "PROOF_OF_FULFILLMENT", notes: NOTE });
    // Every file PayPal got is the one listed on the review screen, byte for byte.
    expect(input.files.map((f) => [f.filename, sha(f.bytes)])).toEqual(
      packet.files.map((f) => [f.name, f.sha256]),
    );
    const entry = (await readLedger(db, dealId)).at(-1);
    expect(entry).toMatchObject({
      type: "EVIDENCE_UPLOADED",
      payload: {
        packetId: packet.id,
        evidenceType: "PROOF_OF_FULFILLMENT",
        totalBytes: packet.totalBytes,
      },
    });
    expect(JSON.stringify(entry?.payload)).not.toContain("sketch on 8 Nov");
    // Only the upload came after the packet's own entry.
    expect((await view()).packet?.newerEntries).toBe(1);
    await app.close();
  });

  it("refuses a file that no longer matches its fingerprint, sending nothing", async () => {
    const { app, call, token, url, paypalAllows, buildPacket, paypal } = await disputedDeal();
    await paypalAllows(["provide_evidence"]);
    const packet = await buildPacket();
    const sketch = packet.files.find((f) => f.name === "sketch.png");
    await db.query("ALTER TABLE file_contents DISABLE TRIGGER ALL");
    await db.query("UPDATE file_contents SET bytes = $2 WHERE sha256 = $1", [
      sketch?.sha256,
      png(60).map((b, i) => (i === 20 ? 9 : b)),
    ]);
    const sent = await call("POST", `${url}/evidence`, token, {
      ...confirmed(),
      packetId: packet.id,
      packetSha256: packet.packetSha256,
      evidenceType: "OTHER",
    });
    expect(sent.json()).toEqual({
      error: "a file no longer matches its fingerprint, so nothing was sent; build a new packet",
    });
    expect(paypal.sent).toEqual([]);
    await app.close();
  });
});

describe("when PayPal does not answer properly", () => {
  it("keeps a refusal with PayPal's code, and sends an unknown one again only when asked", async () => {
    const { app, call, token, url, paypalAllows, paypal, view, buyer, dealId } =
      await disputedDeal();
    await paypalAllows(["escalate"]);
    const escalate = () => call("POST", `${url}/escalate`, token, confirmed());
    paypal.state.fail = new PayPalApiError(
      "POST escalate",
      422,
      "UNPROCESSABLE_ENTITY",
      "x",
      [{ issue: "NOT_ELIGIBLE" }],
      "dbg-2",
    );
    expect((await escalate()).json()).toMatchObject({ error: "PayPal refused it (NOT_ELIGIBLE)" });
    paypal.state.fail = new DisputeActionNotAllowed("PP-R-TEST-1", "escalate", ["accept_claim"]);
    expect((await escalate()).statusCode).toBe(409);
    paypal.state.fail = new PayPalNetworkError("POST escalate", true);
    const unknown = await escalate();
    expect(unknown.statusCode).toBe(502);
    expect(unknown.json()).toMatchObject({
      error: "PayPal did not answer properly; it may have received it",
    });
    const actions = (await view()).actions;
    expect(actions.map((a) => a.status)).toEqual(["unknown", "refused", "refused"]);
    const resend = `${url}/actions/${actions[0]?.id ?? ""}/resend`;
    paypal.state.fail = undefined;
    expect((await call("POST", resend, token, {})).statusCode).toBe(400);
    expect((await call("POST", resend, token, { confirmed: true })).statusCode).toBe(201);
    expect(paypal.sent).toHaveLength(1);
    expect((await call("POST", resend, token, { confirmed: true })).statusCode).toBe(409);
    expect(
      (await call("POST", `${url}/actions/${testId(999)}/resend`, token, { confirmed: true }))
        .statusCode,
    ).toBe(404);
    await expectSellerOnly(
      call,
      `${url}/actions`,
      token,
      (await buyerVisitors(db, dealId, buyer.id))[0],
    );
    await app.close();
  });
});
