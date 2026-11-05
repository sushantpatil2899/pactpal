import { createDealLink, createSession, redeemDealLink, type Database } from "@pactpal/db";
import { TEST_NOW, testId } from "@pactpal/db/testing";
import { buildApp, type AppOptions } from "../app.js";
import type { ChatClient } from "@pactpal/ai";
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
  } = {},
) {
  let ids = 200;
  const mail = capturingEmail();
  const { sent, failEmailTo } = mail;
  const logs: string[] = [];
  const { emailOff = false, ...appOptions } = options;
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
        publicBaseUrl: "https://pactpal.test",
        clock: () => TEST_NOW,
        newId: () => testId(ids++),
      },
    },
  );
  const call = (
    method: "GET" | "POST",
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
