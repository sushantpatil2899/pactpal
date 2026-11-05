import { addArtifact, postgresContentStore, type Database } from "@pactpal/db";
import { TEST_NOW, createTestDeal, linkTestDispute, testId } from "@pactpal/db/testing";
import { PayPalNetworkError, type DisputeDetails } from "@pactpal/paypal";
import { expect } from "vitest";
import { buyerVisitors, dealTestApp, signThroughRoutes, signedInAs } from "../deals/test-app.js";
import type { LogSink } from "../payments/payment-sync.js";
import type { DisputeReader } from "./dispute-sync.js";

/** Test code only: a dispute as PayPal answers it, ready to override. */
export const testDispute = (overrides: Partial<DisputeDetails> = {}): DisputeDetails => ({
  disputeId: "PP-R-TEST-1",
  reason: "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED",
  status: "WAITING_FOR_SELLER_RESPONSE",
  state: "REQUIRED_ACTION",
  stage: "INQUIRY",
  amount: { minor: 12_000, currency: "USD" },
  createdAt: "2026-11-05T18:58:40.000Z",
  updatedAt: "2026-11-05T19:02:04.000Z",
  channel: "INTERNAL",
  sellerResponseDueDate: "2026-11-25T18:58:40.000Z",
  buyerResponseDueDate: undefined,
  transactions: [
    {
      sellerTransactionId: "4VS53548AF878232T",
      buyerTransactionId: "2PW6249589335761J",
      invoiceNumber: undefined,
    },
  ],
  messages: [{ postedBy: "BUYER", postedAt: undefined, content: "Not the style I wanted" }],
  allowedActions: ["escalate", "accept_claim", "send_message", "make_offer"],
  allowedOfferTypes: ["REFUND"],
  requestedEvidence: [],
  outcome: undefined,
  ...overrides,
});

/**
 * Test code only: a stand-in for PayPal's dispute reads. It answers with `disputes` as they are
 * when called, counts full reads, and fails every call while `down` is set.
 */
export function fakeDisputes(disputes: DisputeDetails[] = []) {
  const state = { down: false, reads: 0 };
  const answer = <T>(data: () => T) =>
    state.down
      ? Promise.reject(new PayPalNetworkError("read disputes", true))
      : Promise.resolve({ transport: "rest" as const, data: data() });
  const reader: DisputeReader = {
    list: () =>
      answer(() => ({
        disputes: disputes.map(
          ({ disputeId, reason, status, state: s, stage, amount, createdAt, updatedAt }) => ({
            disputeId,
            reason,
            status,
            state: s,
            stage,
            amount,
            createdAt,
            updatedAt,
          }),
        ),
        truncated: false,
      })),
    get: (disputeId) =>
      answer(() => {
        state.reads += 1;
        const found = disputes.find((d) => d.disputeId === disputeId);
        if (!found) throw new Error(`no dispute ${disputeId}`);
        return found;
      }),
  };
  return { reader, disputes, state };
}

/** Test code only: a log that keeps its lines, to check that nothing private is written. */
export function keptLog() {
  const lines: string[] = [];
  const keep = (details: object, message: string) => {
    lines.push(JSON.stringify({ ...details, message }));
  };
  const log: LogSink = { info: keep, warn: keep, error: keep };
  return { log, lines };
}

/**
 * Test code only: a dispute route answers its deal's buyer 403, and a dispute that is not this
 * deal's 404. `url` names dispute PP-R-TEST-1.
 */
export async function expectSellerOnly(
  call: (method: "GET", url: string, token?: string) => Promise<{ statusCode: number }>,
  url: string,
  sellerToken: string,
  buyerToken: string | undefined,
) {
  expect((await call("GET", url, buyerToken)).statusCode).toBe(403);
  expect((await call("GET", url.replace("PP-R-TEST-1", "PP-R-NONE"), sellerToken)).statusCode).toBe(
    404,
  );
}

/** Test code only: a file for `signedDispute`, as [name, kind, bytes, who added it]. */
export type TestFile = [string, "source" | "deliverable", Uint8Array, "seller" | "buyer"];

/**
 * Test code only: a deal signed through the routes (so its signed copy and receipt are real),
 * with dispute PP-R-TEST-1 tied to it and `files` added as ids testId(600), testId(601) and on.
 */
export async function signedDispute(
  db: Database,
  files: readonly TestFile[],
  options: Parameters<typeof dealTestApp>[2] = {},
) {
  const deal = await createTestDeal(db);
  const env = dealTestApp(db, undefined, options);
  const token = await signedInAs(db, deal.seller.id);
  const [, buyerLink = ""] = await buyerVisitors(db, deal.dealId, deal.buyer.id);
  await signThroughRoutes(env.call, deal.dealId, token, buyerLink);
  await linkTestDispute(db, deal.dealId, TEST_NOW);
  const store = postgresContentStore(db, () => TEST_NOW);
  for (const [i, [filename, kind, bytes, by]] of files.entries()) {
    await addArtifact(
      db,
      store,
      {
        id: testId(600 + i),
        dealId: deal.dealId,
        kind,
        filename,
        bytes,
        addedBy: { actor: by, actorId: by === "seller" ? deal.seller.id : deal.buyer.id },
      },
      TEST_NOW,
    );
  }
  const url = `/api/deals/${deal.dealId}/disputes/PP-R-TEST-1`;
  return { ...deal, ...env, token, url };
}
