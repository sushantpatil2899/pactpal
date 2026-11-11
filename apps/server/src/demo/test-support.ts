import { createUser, type Database } from "@pactpal/db";
import { TEST_NOW, testId } from "@pactpal/db/testing";

/** Every demo person's email: the 5 sellers, then the 8 buyers (hackathon/demo-plan.md). */
export const DEMO_PEOPLE = [
  "maya.lin@pact-pal.app",
  "daniel.okafor@pact-pal.app",
  "priya.raman@pact-pal.app",
  "jun.tanaka@pact-pal.app",
  "lena.fischer@pact-pal.app",
  "chris.park@pact-pal.app",
  "nora.quinn@pact-pal.app",
  "ethan.brooks@pact-pal.app",
  "aisha.khan@pact-pal.app",
  "rosa.alvarez@pact-pal.app",
  "tom.becker.allowappeal@pact-pal.app",
  "alex.morgan@pact-pal.app",
  "sam.patel@pact-pal.app",
] as const;

/**
 * Test code only: these people as if each had signed in with PayPal once (a linked PayPal id and
 * a confirmed email), with ids `testId(1)` onwards in the order given.
 */
export async function signedUpWithPayPal(db: Database, emails: readonly string[]): Promise<void> {
  for (const [i, email] of emails.entries()) {
    await createUser(
      db,
      {
        id: testId(i + 1),
        email,
        displayName: email,
        emailVerifiedAt: TEST_NOW,
        paypalUserId: `paypal-user-${String(i + 1)}`,
      },
      TEST_NOW,
    );
  }
}
