import { createSession, type Database } from "@pactpal/db";
import { TEST_NOW, testId } from "@pactpal/db/testing";
import { buildApp } from "../app.js";
import { SESSION_COOKIE } from "../auth/sign-in.js";
import type { EmailMessage } from "../email/sender.js";

/**
 * Test code only: the app with deal routes on a test database, a fixed clock and numbered ids
 * (from 200), capturing sent email and log lines. `call` sends a request, signed in when given a
 * session token.
 */
export function dealTestApp(db: Database | undefined) {
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
  const call = (method: "GET" | "POST", url: string, token?: string, payload?: object) =>
    app.inject({
      method,
      url,
      ...(payload ? { payload } : {}),
      ...(token ? { cookies: { [SESSION_COOKIE]: token } } : {}),
    });
  return { app, call, sent, logs };
}

/** A signed-in (PayPal) session token for a user. */
export const signedInAs = async (db: Database, userId: string) =>
  (await createSession(db, userId, TEST_NOW)).token;
