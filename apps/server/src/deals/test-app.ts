import { createDealLink, createSession, redeemDealLink, type Database } from "@pactpal/db";
import { TEST_NOW, testId } from "@pactpal/db/testing";
import { buildApp, type AppOptions } from "../app.js";
import type { ChatClient, ChatOutcome, ChatRequest } from "@pactpal/ai";
import { FakeChatClient, testSpec } from "@pactpal/ai/testing";
import { MAYA_DRAFT } from "@pactpal/scope-draft/testing";
import { createDraftingRuntime, type DraftingRuntime } from "../drafting/runtime.js";
import { SESSION_COOKIE } from "../auth/sign-in.js";
import type { InvoiceSender } from "../payments/invoice-sender.js";
import { StandInEmailSender } from "@pactpal/email";
import { capturingEmail } from "../email/email-test-support.js";

/**
 * Test code only: the app with deal routes on a test database, a fixed clock and numbered ids
 * (from 200), capturing sent email and log lines, optionally trusting a number of proxies.
 * Email is "live" and succeeds unless the address is in `failEmailTo`, or is off with
 * `emailOff`. `call` sends a request, signed in when given a session token, with an optional
 * body and headers.
 */
export function dealTestApp(
  db: Database | undefined,
  drafting?: DraftingRuntime,
  options: {
    trustProxyHops?: number;
    emailOff?: boolean;
    invoices?: InvoiceSender;
    inbound?: AppOptions["inbound"];
    disputes?: AppOptions["disputes"];
    claims?: AppOptions["claims"];
    disputeWriter?: AppOptions["disputeWriter"];
    sellerApps?: AppOptions["sellerApps"];
    webhooks?: AppOptions["webhooks"];
    products?: AppOptions["products"];
    remoteDrafts?: AppOptions["remoteDrafts"];
    store?: AppOptions["store"];
    /** The site's address; https by default. */
    publicBaseUrl?: string;
    /** The first numbered id, so several apps can share one database without clashing. */
    firstId?: number;
  } = {},
) {
  const mail = capturingEmail();
  const { sent, failEmailTo } = mail;
  const logs: string[] = [];
  const {
    emailOff = false,
    publicBaseUrl = "https://pactpal.test",
    firstId,
    ...appOptions
  } = options;
  let ids = firstId ?? 200;
  const email = emailOff ? new StandInEmailSender({ info: () => undefined }) : mail.email;
  const app = buildApp(
    { settings: [], features: [] },
    {
      logger: { stream: { write: (line) => logs.push(line) } },
      email,
      ...(drafting ? { drafting } : {}),
      ...appOptions,
      // Only the routes get the database: the app would close it when the app closes.
      signIn: {
        login: undefined,
        database: db,
        publicBaseUrl,
        clock: () => TEST_NOW,
        newId: () => testId(ids++),
      },
    },
  );
  const call = (
    method: "GET" | "POST" | "DELETE",
    url: string,
    token?: string,
    payload?: object,
    headers?: Record<string, string>,
  ) =>
    app.inject({
      method,
      url,
      ...(payload ? { payload } : {}),
      ...(headers ? { headers } : {}),
      ...(token ? { cookies: { [SESSION_COOKIE]: token } } : {}),
    });
  return { app, call, sent, failEmailTo, logs };
}

/** A signed-in (PayPal) session token for a user. */
export const signedInAs = async (db: Database, userId: string) =>
  (await createSession(db, userId, TEST_NOW)).token;

/** Session tokens for a deal's buyer: signed in with PayPal, and opened with their buyer link. */
export async function buyerVisitors(db: Database, dealId: string, buyerId: string) {
  const { token: link } = await createDealLink(db, { dealId, userId: buyerId }, TEST_NOW);
  const redeemed = await redeemDealLink(db, link, TEST_NOW);
  if (!redeemed.ok) throw new Error("expected a link session");
  return [await signedInAs(db, buyerId), redeemed.session.token];
}

/** Stand-in models as a drafting runtime with fixed markers, or none (no model has a key). */
export const testDrafting = (clients: readonly ChatClient[] | undefined) =>
  clients
    ? createDraftingRuntime({
        clients,
        council: { rng: () => 0.5, newMarker: () => "abcdef123456", now: () => 0 },
      })
    : undefined;

/**
 * Stand-in models as a drafting runtime that keeps jobs until `settle` runs them, so tests choose
 * when a council finishes; `queued` counts the jobs waiting.
 */
export function queuedDrafting(
  clients: readonly ChatClient[],
  maxConcurrent = 2,
  newMarker: () => string = () => "abcdef123456",
) {
  const queue: (() => Promise<void>)[] = [];
  let tick = 0;
  const runtime = createDraftingRuntime({
    clients,
    maxConcurrent,
    council: { rng: () => 0.5, newMarker, now: () => (tick += 10) },
    run: (job) => {
      queue.push(job);
    },
  });
  const settle = async () => {
    for (let job = queue.shift(); job; job = queue.shift()) await job();
  };
  return { runtime, settle, queued: () => queue.length };
}

/** Test code only: agreed work as the seller's form sends it (two payment stages). */
export const TEST_WORK = {
  summary: "A character illustration",
  deliverables: ["Full-body character, transparent PNG"],
  exclusions: ["Merchandise use"],
  revisionsIncluded: 2,
  milestones: [
    { title: "Sketch", amount: "120" },
    { title: "Final", amount: "120", dueDate: "2026-11-20" },
  ],
};

type Call = ReturnType<typeof dealTestApp>["call"];

/** Test code only: the seller sends the newest version for acceptance; returns the page's fingerprint. */
export async function sendForAcceptance(call: Call, dealId: string, sellerToken: string) {
  const base = `/api/deals/${dealId}/acceptance`;
  const preview = (await call("GET", base, sellerToken)).json<{
    document: { terms: { version: number } } | null;
    documentSha256: string | null;
  }>();
  const res = await call("POST", `${base}/request`, sellerToken, {
    version: preview.document?.terms.version,
    documentSha256: preview.documentSha256,
  });
  if (res.statusCode !== 200)
    throw new Error(`send for acceptance answered ${String(res.statusCode)}`);
  return preview.documentSha256 ?? "";
}

/**
 * Test code only: saves `TEST_WORK`, sends it for acceptance and has the buyer sign it, all
 * through the routes, so the signed copy and its receipt are real.
 */
export async function signThroughRoutes(
  call: Call,
  dealId: string,
  sellerToken: string,
  buyerToken: string,
) {
  const saved = await call("POST", `/api/deals/${dealId}/scope`, sellerToken, TEST_WORK);
  if (saved.statusCode !== 201)
    throw new Error(`saving the work answered ${String(saved.statusCode)}`);
  const documentSha256 = await sendForAcceptance(call, dealId, sellerToken);
  await call("POST", `/api/deals/${dealId}/acceptance/accept`, buyerToken, {
    documentSha256,
    typedName: "Chris Buyer",
  });
  return documentSha256;
}

const isRanking = (request: ChatRequest) =>
  request.messages[0]?.content.includes("careful reviewer") === true;

/** A model that drafts as `draft` (JSON text or a failure) and ranks the drafts in the order shown. */
export function standInMember(name: string, draft: object | string | ChatOutcome = MAYA_DRAFT) {
  const spec = testSpec({ name });
  return new FakeChatClient(spec, (request) => {
    if (isRanking(request)) {
      const user = request.messages[1]?.content ?? "";
      const labels = [...user.matchAll(/label="(\w+)"/g)].map((m) => m[1]);
      return JSON.stringify({ ranking: labels });
    }
    if (typeof draft === "string") return draft;
    if ("ok" in draft) return draft;
    return JSON.stringify(draft);
  });
}
