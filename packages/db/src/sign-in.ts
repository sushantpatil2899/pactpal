import type { Database } from "./database.js";
import {
  UserConflictError,
  createUser,
  findUserByEmail,
  findUserByPayPalId,
  linkPayPal,
  type User,
} from "./users.js";

/** A person PayPal has identified (see `PayPalIdentity` in `@pactpal/paypal`). */
export interface SignedInPerson {
  paypalUserId: string;
  paypalPayerId: string | undefined;
  email: string | undefined;
  emailVerified: boolean;
  name: string | undefined;
}

export type SignInResult =
  | { ok: true; user: User; created: boolean }
  /**
   * `email-taken`: the email belongs to a user who has not proven it (or has another PayPal
   * account), so the accounts are not merged. `no-email`: PayPal shared no email.
   */
  | { ok: false; reason: "email-taken" | "no-email" };

/**
 * Finds or creates the user for someone who signed in with PayPal. The same PayPal id is always
 * the same user. A user who exists only by email is linked only when both PayPal and PactPal
 * have proven the address; otherwise nothing is merged. `newId` and `now` come from the caller.
 */
export async function signInWithPayPal(
  db: Database,
  person: SignedInPerson,
  newId: () => string,
  now: Date,
): Promise<SignInResult> {
  try {
    return await db.transaction(async (tx) => {
      const known = await findUserByPayPalId(tx, person.paypalUserId);
      if (known) return { ok: true, user: known, created: false };
      if (person.email === undefined) return { ok: false, reason: "no-email" };

      const sameEmail = await findUserByEmail(tx, person.email);
      if (sameEmail) {
        const linkable =
          sameEmail.paypalUserId === undefined &&
          sameEmail.emailVerifiedAt !== undefined &&
          person.emailVerified;
        if (!linkable) return { ok: false, reason: "email-taken" };
        const linked = await linkPayPal(
          tx,
          sameEmail.id,
          { paypalUserId: person.paypalUserId, paypalPayerId: person.paypalPayerId },
          now,
        );
        return { ok: true, user: linked, created: false };
      }

      const user = await createUser(
        tx,
        {
          id: newId(),
          email: person.email,
          emailVerifiedAt: person.emailVerified ? now : undefined,
          displayName: person.name,
          paypalUserId: person.paypalUserId,
          paypalPayerId: person.paypalPayerId,
        },
        now,
      );
      return { ok: true, user, created: true };
    });
  } catch (error) {
    // Two first sign-ins at once: the other one created the user, so use it.
    if (!(error instanceof UserConflictError)) throw error;
    const winner = await findUserByPayPalId(db, person.paypalUserId);
    return winner
      ? { ok: true, user: winner, created: false }
      : { ok: false, reason: "email-taken" };
  }
}
