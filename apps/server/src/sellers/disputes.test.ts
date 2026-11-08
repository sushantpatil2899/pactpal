import { createHash } from "node:crypto";
import {
  activeConnection,
  disconnectSeller,
  linkOwnApp,
  listDealDisputes,
  startInvoice,
} from "@pactpal/db";
import { TEST_NOW, createPaidTestDeal, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { Secret, SecretBox } from "@pactpal/net";
import { describe, expect, it } from "vitest";
import { syncDisputes } from "../disputes/dispute-sync.js";
import { runDisputeTask } from "../disputes/task.js";
import {
  fakeDisputes,
  fakeWriter,
  keptLog,
  paypalState,
  signedDispute,
  testDispute,
} from "../disputes/test-support.js";
import { fakePayPal } from "../payments/paypal-test-support.js";
import { LinkedApps, invoicesFor, linkedDisputeAccounts } from "./linked-apps.js";
import { fakeAppClients } from "./test-support.js";

const db = useMigratedTestDatabase();
const KEY = Buffer.alloc(32, 3);
const box = new SecretBox(KEY);

/** Links an own app for `userId` to `merchantId` as link `n`, its secret sealed for real. */
const linkApp = (userId: string, merchantId: string, n: number) =>
  linkOwnApp(
    db,
    {
      id: testId(n),
      userId,
      clientId: `client-${String(n)}`,
      sealedSecret: box.seal(new Secret("s"), `${testId(n)}:client-${String(n)}`),
      merchantId,
      scopes: [],
    },
    TEST_NOW,
  );

/** A paid stage 1 invoiced from the seller's own app (account OWN1, link 90). */
async function paidFromOwnApp() {
  const deal = await createPaidTestDeal(db);
  await linkApp(deal.seller.id, "OWN1", 90);
  await db.query("UPDATE milestones SET seller_connection_id = $1 WHERE deal_id = $2", [
    testId(90),
    deal.dealId,
  ]);
  return deal;
}

let ids = 800;
const newId = () => testId(ids++);

/** A check of PactPal's own account and the seller's own app (link 90, account OWN1). */
const checkDeps = (
  pactpal: ReturnType<typeof fakeDisputes>,
  own: ReturnType<typeof fakeDisputes>,
  log = keptLog().log,
) => ({
  db,
  disputes: pactpal.reader,
  linkedAccounts: () =>
    Promise.resolve([{ connectionId: testId(90), merchantId: "OWN1", disputes: own.reader }]),
  clock: () => TEST_NOW,
  newId,
  log,
});

describe("disputes of sellers' own apps (6h-5)", () => {
  it("matches each account's disputes only to stages invoiced from that account", async () => {
    const { dealId } = await paidFromOwnApp();
    // PactPal's account and the seller's own both name the same payment: only the seller's matches.
    const pactpal = fakeDisputes([testDispute()]);
    const own = fakeDisputes([testDispute({ disputeId: "PP-R-OWN-1" })]);
    const result = await syncDisputes(checkDeps(pactpal, own), "schedule");
    expect(result).toMatchObject({ ok: true, listed: 2, matched: 1, unmatched: 1 });
    expect((await listDealDisputes(db, dealId)).map((d) => d.disputeId)).toEqual(["PP-R-OWN-1"]);
  });

  it("goes on when one seller's app fails, and fails the check when PactPal's own does", async () => {
    await paidFromOwnApp();
    const own = fakeDisputes([testDispute({ disputeId: "PP-R-OWN-1" })]);
    own.state.down = true;
    const pactpal = fakeDisputes([testDispute({ disputeId: "PP-R-PACTPAL" })]);
    const { log, lines } = keptLog();
    const deps = checkDeps(pactpal, own, log);
    expect(await syncDisputes(deps, "schedule")).toMatchObject({ ok: true, listed: 1 });
    expect(lines.join("\n")).toContain("Seller app not checked");
    pactpal.state.down = true;
    await expect(syncDisputes(deps, "schedule")).rejects.toThrow();
  });

  it("lists every live own app whose secret opens, and none that ended", async () => {
    const { seller, buyer } = await paidFromOwnApp();
    await linkApp(buyer.id, "OWN2", 91);
    const linked = new LinkedApps(db, box, () => fakeAppClients());
    expect((await linkedDisputeAccounts(db, linked)).map((a) => a.merchantId)).toEqual([
      "OWN1",
      "OWN2",
    ]);
    await disconnectSeller(db, seller.id, TEST_NOW);
    expect((await linkedDisputeAccounts(db, linked)).map((a) => a.merchantId)).toEqual(["OWN2"]);
  });

  it("checks payments through a relink of the same account, but never sends through it", async () => {
    const { seller } = await paidFromOwnApp();
    await disconnectSeller(db, seller.id, TEST_NOW);
    await linkApp(seller.id, "OWN1", 92);
    const linked = new LinkedApps(db, box, () => fakeAppClients());
    const accounts = { invoices: fakePayPal().invoices, linked };
    expect(await invoicesFor(accounts, testId(90), "account")).toMatchObject({
      ok: true,
      account: { kind: "own-app", merchantId: "OWN1" },
    });
    expect(await invoicesFor(accounts, testId(90))).toEqual({
      ok: false,
      reason: "account-unlinked",
    });
  });

  it("runs as the background job with only linked apps set up", async () => {
    await paidFromOwnApp();
    const own = fakeDisputes([testDispute({ disputeId: "PP-R-OWN-1" })]);
    const env = {
      DATABASE_URL: "postgres://pactpal@db.internal:5432/pactpal",
      SELLER_KEYS_ENCRYPTION_KEY: KEY.toString("base64"),
    };
    const result = await runDisputeTask(env, "schedule", {
      connect: () => ({ ...db, close: () => Promise.resolve() }),
      disputesFor: () => fakeDisputes().reader,
      connectApp: () => fakeAppClients({ disputes: { ...own.reader, ...fakeWriter().writer } }),
      clock: () => TEST_NOW,
      newId,
      log: keptLog().log,
    });
    expect(result).toMatchObject({ ok: true, listed: 1, matched: 1 });
  });
});

describe("answering a dispute from the account that was paid (6h-5)", () => {
  const sha = (value: string) => createHash("sha256").update(value).digest("hex");
  const NOTE = "The buyer approved the delivered logo on 8 Nov.";

  it("escalates through the seller's own app, is off once unlinked, and works again after a relink", async () => {
    const pactpal = fakeWriter();
    const own = fakeWriter();
    const deal = await signedDispute(db, [], {
      disputeWriter: pactpal.writer,
      sellerApps: {
        box,
        check: () => Promise.resolve({ ok: true, merchantId: "OWN1", scopes: [] }),
        connect: () => fakeAppClients({ disputes: { ...fakeDisputes().reader, ...own.writer } }),
      },
    });
    const { call, token, url, dealId, seller } = deal;
    const link = () =>
      call("POST", "/api/seller-app", token, { clientId: "own-client", clientSecret: "s" });
    await link();
    // Stage 1's invoice was sent from the seller's own app.
    await startInvoice(
      db,
      {
        dealId,
        sellerId: seller.id,
        version: 1,
        stage: 1,
        amountMinor: 12_000,
        currency: "USD",
        requestId: "pp-own-1",
        invoiceSha256: "a".repeat(64),
        sellerConnectionId: (await activeConnection(db, seller.id))?.id ?? "",
      },
      TEST_NOW,
    );
    await paypalState(db, dealId, { allowedActions: ["escalate"] });
    const canSend = async () =>
      (await call("GET", `${url}/actions`, token)).json<{ canSend: boolean }>().canSend;
    const escalate = () =>
      call("POST", `${url}/escalate`, token, {
        note: NOTE,
        noteSha256: sha(NOTE),
        confirmed: true,
      });

    expect(await canSend()).toBe(true);
    expect((await escalate()).statusCode).toBe(201);
    expect(own.sent).toHaveLength(1);
    expect(pactpal.sent).toHaveLength(0);

    await call("DELETE", "/api/seller-app", token);
    expect(await canSend()).toBe(false);
    expect((await escalate()).statusCode).toBe(503);

    await link();
    expect(await canSend()).toBe(true);
    expect((await escalate()).statusCode).toBe(201);
    expect(own.sent).toHaveLength(2);
    expect(pactpal.sent).toHaveLength(0);
  });
});
