import { createDealLink, createSession, redeemDealLink, type Database } from "@pactpal/db";
import { TEST_NOW, testId } from "@pactpal/db/testing";
import { buildApp } from "../app.js";
import type { DraftingRuntime } from "../drafting/runtime.js";
import { SESSION_COOKIE } from "../auth/sign-in.js";
import type { EmailMessage } from "../email/sender.js";

/**
 * Test code only: the app with deal routes on a test database, a fixed clock and numbered ids
 * (from 200), capturing sent email and log lines, optionally trusting a number of proxies. `call` sends a request, signed in when given a
 * session token, with an optional body and headers.
 */
export function dealTestApp(
  db: Database | undefined,
  drafting?: DraftingRuntime,
  options: { trustProxyHops?: number } = {},
) {
  let ids = 200;
  const sent: EmailMessage[] = [];
  const logs: string[] = [];
  const app = buildApp(
    { settings: [], features: [] },
    {
      logger: { stream: { write: (line) => logs.push(line) } },
      email: {
        send: (message) => {
          sent.push(message);
          return Promise.resolve();
        },
      },
      ...(drafting ? { drafting } : {}),
      ...options,
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
  return { app, call, sent, logs };
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
