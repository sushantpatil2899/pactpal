import { useEffect, useState } from "react";
import { SIGN_IN_PATH, getMe, signOut, type Me } from "./api";
import { DisputePage } from "./DisputePage";
import { DealPage } from "./DealPage";
import { DealsHome } from "./DealsHome";
import { LinkPage } from "./LinkPage";
import { SellerAppPanel } from "./SellerAppPanel";
import { Alert, ButtonLink } from "./design/parts";
import type { Route } from "./router/routes";
import { navigate, useRoute } from "./router/useRoute";
import { AppLayout, BuyerLayout, PublicLayout, Splash } from "./shell/layouts";

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

type Session = { kind: "loading" } | { kind: "signed-out" } | { kind: "signed-in"; me: Me };

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

/** The deal pages; `key` gives each deal a fresh page when the person moves between deals. */
function dealPage(route: Extract<Route, { page: "deal" | "dispute" }>) {
  return route.page === "dispute" ? (
    <DisputePage key={route.disputeId} dealId={route.dealId} disputeId={route.disputeId} />
  ) : (
    <DealPage key={route.dealId} dealId={route.dealId} />
  );
}

/** The whole app: finds out who is signed in, then shows the address's page in its layout. */
export function App() {
  const route = useRoute();
  const [session, setSession] = useState<Session>({ kind: "loading" });
  const [problem, setProblem] = useState<string | undefined>(initialProblem);

  // Asked again on each page: a buyer link signs the person in while the app is open.
  useEffect(() => {
    getMe().then(
      (me) => {
        setSession(me ? { kind: "signed-in", me } : { kind: "signed-out" });
      },
      (error: unknown) => {
        setSession({ kind: "signed-out" });
        setProblem(error instanceof Error ? error.message : "Something went wrong.");
      },
    );
  }, [route.page]);

  const onSignOut = () => {
    signOut().then(
      () => {
        setSession({ kind: "signed-out" });
        navigate("/");
      },
      (error: unknown) => {
        setProblem(error instanceof Error ? error.message : "Could not sign out.");
      },
    );
  };

  if (route.page === "link") {
    return (
      <BuyerLayout>
        <LinkPage />
      </BuyerLayout>
    );
  }
  if (session.kind === "loading") {
    return (
      <Splash>
        <p aria-busy="true">Checking whether you are signed in…</p>
      </Splash>
    );
  }
  const alert = problem !== undefined && <Alert problem>{problem}</Alert>;
  if (session.kind === "signed-out") {
    if (route.page !== "home") return <BuyerLayout>{dealPage(route)}</BuyerLayout>;
    return (
      <PublicLayout>
        {alert}
        <h1>AI that seals the deal.</h1>
        <p>
          <ButtonLink look="primary" large href={SIGN_IN_PATH}>
            Sign in with PayPal
          </ButtonLink>
        </p>
      </PublicLayout>
    );
  }
  const signedIn = { me: session.me, onSignOut };
  if (session.me.access !== "full") {
    return (
      <BuyerLayout {...signedIn}>
        {alert}
        {route.page === "home" ? <DealsHome /> : dealPage(route)}
      </BuyerLayout>
    );
  }
  return (
    <AppLayout {...signedIn}>
      {alert}
      {route.page === "home" ? (
        <>
          <DealsHome />
          <SellerAppPanel />
        </>
      ) : (
        dealPage(route)
      )}
    </AppLayout>
  );
}
