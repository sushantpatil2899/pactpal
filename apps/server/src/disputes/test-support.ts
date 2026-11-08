import { addArtifact, postgresContentStore, recordDispute, type Database } from "@pactpal/db";
import { TEST_NOW, createTestDeal, linkTestDispute, testId } from "@pactpal/db/testing";
import {
  PayPalNetworkError,
  type AcceptClaimInput,
  type DisputeDetails,
  type EscalateInput,
  type EvidenceInput,
  type MessageInput,
  type OfferInput,
} from "@pactpal/paypal";
import { expect } from "vitest";
import { councilOf } from "@pactpal/council/testing";
import {
  buyerVisitors,
  dealTestApp,
  queuedDrafting,
  signThroughRoutes,
  signedInAs,
} from "../deals/test-app.js";
import { inProcessClaimRunner } from "./checker.js";
import { runDisputeJob } from "./claim-job.js";
import type { LogSink } from "../payments/payment-sync.js";
import type { DisputeReader } from "./dispute-sync.js";
import type { DisputeWriter } from "./action-service.js";

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
  decisionReasons: [],
  sellerEvidence: [],
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

type WriteInput = EscalateInput | EvidenceInput | MessageInput | OfferInput | AcceptClaimInput;

/** Test code only: a stand-in for PayPal's dispute writes: keeps what it was sent, or fails as told. */
export function fakeWriter() {
  const sent: { action: string; disputeId: string; input: WriteInput }[] = [];
  const state: { fail: Error | undefined } = { fail: undefined };
  const answer = (action: string, disputeId: string, input: WriteInput) => {
    if (state.fail !== undefined) return Promise.reject(state.fail);
    sent.push({ action, disputeId, input });
    return Promise.resolve({ data: { disputeId }, transport: "rest" as const, debugId: "dbg-1" });
  };
  const writer: DisputeWriter = {
    escalate: (disputeId, input) => answer("escalate", disputeId, input),
    provideEvidence: (disputeId, input) => answer("provide_evidence", disputeId, input),
    sendMessage: (disputeId, input) => answer("send_message", disputeId, input),
    makeOffer: (disputeId, input) => answer("make_offer", disputeId, input),
    acceptClaim: (disputeId, input) => answer("accept_claim", disputeId, input),
    appeal: (disputeId, input) => answer("appeal", disputeId, input),
  };
  return { writer, sent, state };
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

/**
 * Test code only: PayPal's state of dispute PP-R-TEST-1 at the last check, tied to stage 1 of
 * `dealId`: what it allows, the offer types, the evidence it asks for and the buyer's messages.
 */
export const paypalState = (
  db: Database,
  dealId: string,
  state: {
    allowedActions: string[];
    offerTypes?: string[];
    requestedEvidence?: string[];
    buyerSays?: string;
    outcome?: string;
  },
) =>
  recordDispute(
    db,
    {
      disputeId: "PP-R-TEST-1",
      reason: "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED",
      status: "WAITING_FOR_SELLER_RESPONSE",
      stageName: "INQUIRY",
      amount: { minor: 12_000, currency: "USD" },
      allowedActions: state.allowedActions,
      offerTypes: state.offerTypes ?? [],
      ...(state.outcome === undefined ? {} : { outcome: state.outcome }),
      details: {
        requestedEvidence: state.requestedEvidence ?? [],
        messages:
          state.buyerSays === undefined ? [] : [{ postedBy: "BUYER", content: state.buyerSays }],
      },
    },
    { dealId, stage: 1, invoiceId: "INV2-TEST-PAID", matchedBy: "transaction" },
    TEST_NOW,
  );

/**
 * Test code only: a signed, disputed deal whose dispute council jobs run in process with stand-in
 * models answering `answers` (`settle` runs them), with `files` added as in `signedDispute`.
 */
export async function councilDispute(
  db: Database,
  answers: readonly object[],
  files: readonly TestFile[] = [],
  options: Omit<NonNullable<Parameters<typeof dealTestApp>[2]>, "claims"> = {},
) {
  const clients = councilOf(answers);
  const { runtime, settle } = queuedDrafting(clients);
  const claims = inProcessClaimRunner(runtime, (analysisId) =>
    runDisputeJob(
      { db, clients, council: runtime.council, clock: () => TEST_NOW, log: keptLog().log },
      analysisId,
    ),
  );
  const deal = await signedDispute(db, files, { ...options, claims });
  return { ...deal, settle, clients };
}
