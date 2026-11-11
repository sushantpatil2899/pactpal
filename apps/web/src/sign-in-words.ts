/** Messages for the reasons the server gives when a sign-in did not finish (`?signin=`). */
const SIGN_IN_PROBLEMS: Record<string, string> = {
  unavailable: "Signing in is not available right now.",
  cancelled: "Sign-in was cancelled on PayPal.",
  expired: "That sign-in took too long or was not started here. Please try again.",
  failed: "PayPal could not confirm who you are. Please try again.",
  "email-taken":
    "Your PayPal email already belongs to another PactPal account. Open the link we emailed you first.",
  "no-email": "PayPal did not share an email address, which PactPal needs.",
  "other-account":
    "You signed in with a PayPal account that is not the one invited to that deal. Sign in with the PayPal account that uses the invited email, or open your link again to continue without an account.",
};

/**
 * What to do with an address the server sent back after a sign-in that did not finish: the
 * message to show, and the sign-in page's address without the code, so a reload does not repeat
 * it. Undefined when the address carries no sign-in problem.
 */
export function signInReturn(
  href: string,
  signInPage: string,
): { problem: string; address: string } | undefined {
  const url = new URL(href);
  const code = url.searchParams.get("signin");
  if (code === null) return undefined;
  url.searchParams.delete("signin");
  url.pathname = signInPage;
  const problem = SIGN_IN_PROBLEMS[code] ?? SIGN_IN_PROBLEMS.failed ?? "";
  return { problem, address: url.pathname + url.search + url.hash };
}
