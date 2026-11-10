import { useEffect, useState } from "react";
import { SIGN_IN_PATH, getMe, signOut, type Me } from "./api";
import { DisputePage } from "./DisputePage";
import { DealPage } from "./DealPage";
import { DealsHome } from "./DealsHome";
import { LinkPage } from "./LinkPage";
import { Dashboard } from "./app/Dashboard";
import { NewDealPage } from "./app/NewDealPage";
import {
  DealsPage,
  DisputesPage,
  InsightsPage,
  NotificationsPage,
  SettingsPage,
} from "./app/pages";
import { useOverview, type Overview } from "./app/useOverview";
import { Alert, ButtonLink } from "./design/parts";
import { SIGN_IN_PAGE, type Route } from "./router/routes";
import { SignInPage } from "./SignInPage";
import { signInReturn } from "./sign-in-words";
import { navigate, useRoute } from "./router/useRoute";
import { AppLayout, BuyerLayout, PublicLayout, Splash } from "./shell/layouts";

type Session = { kind: "loading" } | { kind: "signed-out" } | { kind: "signed-in"; me: Me };

// Read once when the page loads (React may run state set-up twice in development): a sign-in
// that did not finish comes back as `/?signin=reason` and is shown on the sign-in page.
const signInBack = signInReturn(window.location.href, SIGN_IN_PAGE);
if (signInBack) window.history.replaceState(null, "", signInBack.address);

type DealRoute = Extract<Route, { page: "deal" | "dispute" }>;
const isDealRoute = (route: Route): route is DealRoute =>
  route.page === "deal" || route.page === "dispute";

/** The deal pages; `key` gives each deal a fresh page when the person moves between deals. */
function dealPage(route: DealRoute) {
  return route.page === "dispute" ? (
    <DisputePage key={route.disputeId} dealId={route.dealId} disputeId={route.disputeId} />
  ) : (
    <DealPage key={route.dealId} dealId={route.dealId} />
  );
}

/** The page a signed-in seller sees at this address. */
function sellerPage(route: Route, overview: Overview) {
  switch (route.page) {
    case "deal":
    case "dispute":
      return dealPage(route);
    case "deals":
      return <DealsPage overview={overview} />;
    case "new-deal":
      return <NewDealPage />;
    case "notifications":
      return <NotificationsPage />;
    case "disputes":
      return <DisputesPage overview={overview} />;
    case "insights":
      return <InsightsPage overview={overview} />;
    case "settings":
      return <SettingsPage />;
    case "home":
    case "sign-in":
    case "link":
      return <Dashboard overview={overview} />;
  }
}

/** The whole app: finds out who is signed in, then shows the address's page in its layout. */
export function App() {
  const route = useRoute();
  const [session, setSession] = useState<Session>({ kind: "loading" });
  const [problem, setProblem] = useState<string | undefined>();

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

  // Someone already signed in has no use for the sign-in page.
  const signedIn = session.kind === "signed-in";
  useEffect(() => {
    if (route.page === "sign-in" && signedIn) navigate("/");
  }, [route.page, signedIn]);

  // The seller's deals, for the rail and the list pages; read again as the address changes.
  const fullAccess = session.kind === "signed-in" && session.me.access === "full";
  const overview = useOverview(fullAccess, window.location.pathname);

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
  if (route.page === "sign-in") {
    return (
      <PublicLayout briefFooter>
        <SignInPage problem={signInBack?.problem ?? problem} />
      </PublicLayout>
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
    if (isDealRoute(route)) return <BuyerLayout>{dealPage(route)}</BuyerLayout>;
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
  const account = { me: session.me, onSignOut };
  if (session.me.access !== "full") {
    return (
      <BuyerLayout {...account}>
        {alert}
        {isDealRoute(route) ? dealPage(route) : <DealsHome />}
      </BuyerLayout>
    );
  }
  return (
    <AppLayout
      {...account}
      page={route.page}
      dealId={"dealId" in route ? route.dealId : undefined}
      deals={overview.deals}
    >
      {alert}
      {sellerPage(route, overview)}
    </AppLayout>
  );
}
