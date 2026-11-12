import { activeConnection, startInvoice } from "@pactpal/db";
import { TEST_NOW, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { SecretBox } from "@pactpal/net";
import { DisputeActionNotAllowed, type DisputeParty } from "@pactpal/paypal";
import { describe, expect, it } from "vitest";
import { fakeDisputes, fakeWriter, signedDispute } from "../disputes/test-support.js";
import { sandboxSettler } from "./sandbox-settle.js";
import { fakeAppClients } from "./test-support.js";

const db = useMigratedTestDatabase();
const box = new SecretBox(Buffer.alloc(32, 5));

/** A seller app stand-in whose dispute client records sandbox settlements, or refuses them. */
function settlingApp(refuse = false) {
  const settled: [string, DisputeParty][] = [];
  const disputes = {
    ...fakeDisputes().reader,
    ...fakeWriter().writer,
    adjudicate: (disputeId: string, winner: DisputeParty) => {
      if (refuse) throw new DisputeActionNotAllowed(disputeId, "adjudicate", []);
      settled.push([disputeId, winner]);
      return Promise.resolve({ data: {}, transport: "rest" });
    },
  };
  return { settled, connect: () => fakeAppClients({ disputes }) };
}

/** Dispute PP-R-TEST-1 on a stage invoiced from the seller's own linked app. */
async function disputeOnOwnApp(connect: () => ReturnType<typeof fakeAppClients>) {
  const deal = await signedDispute(db, [], {
    sellerApps: {
      box,
      check: () => Promise.resolve({ ok: true, merchantId: "OWN1", scopes: [] }),
      connect,
    },
  });
  await deal.call("POST", "/api/seller-app", deal.token, { clientId: "own", clientSecret: "s" });
  await startInvoice(
    db,
    {
      dealId: deal.dealId,
      sellerId: deal.seller.id,
      version: 1,
      stage: 1,
      amountMinor: 12_000,
      currency: "USD",
      requestId: "pp-own-1",
      invoiceSha256: "a".repeat(64),
      sellerConnectionId: (await activeConnection(db, deal.seller.id))?.id ?? "",
    },
    TEST_NOW,
  );
  return deal;
}

describe("settling a sandbox dispute for the demo seed (9b-2c)", () => {
  it("asks PayPal through the app the disputed stage was invoiced from, for the side given", async () => {
    const app = settlingApp();
    const deal = await disputeOnOwnApp(app.connect);
    const settle = sandboxSettler(db, box, app.connect, () => testId(990));
    expect(await settle("PP-R-TEST-1", "seller")).toEqual({ kind: "asked" });
    expect(app.settled).toEqual([["PP-R-TEST-1", "seller"]]);
    await deal.app.close();
  });

  it("says when PayPal does not allow a decision yet, or no linked app answers the dispute", async () => {
    const refusing = settlingApp(true);
    const deal = await disputeOnOwnApp(refusing.connect);
    expect(await sandboxSettler(db, box, refusing.connect)("PP-R-TEST-1", "buyer")).toEqual({
      kind: "not-allowed",
    });
    expect(await sandboxSettler(db, box, refusing.connect)("PP-R-NONE", "buyer")).toEqual({
      kind: "failed",
      reason: "no linked seller app answers this dispute",
    });
    await deal.app.close();
  });
});
