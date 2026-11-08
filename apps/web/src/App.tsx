import { useEffect, useState } from "react";
import { SIGN_IN_PATH, getMe, signOut, type Me } from "./api";
import { DisputePage } from "./DisputePage";
import { DealPage } from "./DealPage";
import { DealsHome } from "./DealsHome";
import { LinkPage } from "./LinkPage";
import { SellerAppPanel } from "./SellerAppPanel";

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

type View = { kind: "loading" } | { kind: "signed-out" } | { kind: "signed-in"; me: Me };

/** Reads and removes the sign-in problem from the address, so a reload does not repeat it. */
function takeSignInProblem(): string | undefined {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("signin");
  if (code === null) return undefined;
  url.searchParams.delete("signin");
  window.history.replaceState(null, "", url.toString());
  return SIGN_IN_PROBLEMS[code] ?? SIGN_IN_PROBLEMS.failed;
}

// Read once when the page loads (React may run state set-up twice in development).
const initialProblem = takeSignInProblem();

/** The page shell: the buyer link page at /link, the home page everywhere else. */
export function App() {
  const path = window.location.pathname;
  const dealId = /^\/deals\/([0-9a-f-]{36})$/.exec(path)?.[1];
  const disputeMatch = /^\/deals\/([0-9a-f-]{36})\/disputes\/([A-Za-z0-9-]{1,100})$/.exec(path);
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 640,
        margin: "4rem auto",
        padding: "0 1rem",
      }}
    >
      <h1>PactPal</h1>
      <p>AI that seals the deal.</p>
      {path === "/link" ? (
        <LinkPage />
      ) : disputeMatch?.[1] !== undefined && disputeMatch[2] !== undefined ? (
        <DisputePage dealId={disputeMatch[1]} disputeId={disputeMatch[2]} />
      ) : dealId !== undefined ? (
        <DealPage dealId={dealId} />
      ) : (
        <Home />
      )}
      <p style={{ color: "#555", fontSize: 14 }}>
        Sandbox only. Not legal advice. PactPal records what was agreed and delivered; it does not
        guarantee any dispute outcome. Signing in with PayPal shows control of a PayPal account, not
        legal identity.
      </p>
    </main>
  );
}

function Home() {
  const [view, setView] = useState<View>({ kind: "loading" });
  const [problem, setProblem] = useState<string | undefined>(initialProblem);

  useEffect(() => {
    getMe().then(
      (me) => {
        setView(me ? { kind: "signed-in", me } : { kind: "signed-out" });
      },
      (error: unknown) => {
        setView({ kind: "signed-out" });
        setProblem(error instanceof Error ? error.message : "Something went wrong.");
      },
    );
  }, []);

  const onSignOut = () => {
    signOut().then(
      () => {
        setView({ kind: "signed-out" });
      },
      (error: unknown) => {
        setProblem(error instanceof Error ? error.message : "Could not sign out.");
      },
    );
  };

  return (
    <>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      {view.kind === "loading" && <p aria-busy="true">Checking whether you are signed in…</p>}
      {view.kind === "signed-out" && (
        <p>
          <a href={SIGN_IN_PATH}>Sign in with PayPal</a>
        </p>
      )}
      {view.kind === "signed-in" && (
        <section aria-label="Your account">
          <p>
            Signed in as <strong>{view.me.displayName ?? view.me.email}</strong> ({view.me.email})
            {view.me.access !== "full" && " with a link to one deal"}
          </p>
          <button type="button" onClick={onSignOut}>
            Sign out
          </button>
        </section>
      )}
      {view.kind === "signed-in" && <DealsHome />}
      {view.kind === "signed-in" && view.me.access === "full" && <SellerAppPanel />}
    </>
  );
}
