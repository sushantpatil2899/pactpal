import type { ReactNode } from "react";
import type { Me } from "../api";
import { Logo } from "../design/Logo";
import { Button } from "../design/parts";
import "./shell.css";

/**
 * What every page says about PactPal's limits. `brief` leaves out what the page itself already
 * says beside its action (the sign-in page states the test mode and what signing in shows).
 */
function Footer({ brief = false }: { brief?: boolean }) {
  return (
    <footer className="pp-footer">
      <p>
        {!brief && "PactPal currently runs in test mode. No real money moves. "}
        Not legal advice. PactPal records what was agreed and delivered; it does not guarantee any
        dispute outcome.
        {!brief && " Signing in with PayPal shows control of a PayPal account, not legal identity."}
      </p>
    </footer>
  );
}

const SkipLink = () => (
  <a className="pp-skip" href="#content">
    Skip to the content
  </a>
);

/** Who is signed in, and the way out. */
function Account({ me, onSignOut }: { me: Me; onSignOut: () => void }) {
  return (
    <section className="pp-account" aria-label="Your account">
      <span title={me.email}>
        Signed in as <strong>{me.displayName ?? me.email}</strong>
        {me.access !== "full" && " with a link to one deal"}
      </span>
      <Button onClick={onSignOut}>Sign out</Button>
    </section>
  );
}

interface SignedIn {
  me: Me;
  onSignOut: () => void;
}

/** Pages anyone can open: the kraft ground, the logo, the content. */
export function PublicLayout({
  briefFooter,
  children,
}: {
  briefFooter?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="pp-public">
      <SkipLink />
      <header className="pp-bar">
        <Logo />
      </header>
      <main id="content" className="pp-public-main">
        {children}
      </main>
      <Footer brief={briefFooter} />
    </div>
  );
}

/** The seller's app: a rail of sections beside the page. */
export function AppLayout({ me, onSignOut, children }: SignedIn & { children: ReactNode }) {
  return (
    <div className="pp-app">
      <SkipLink />
      <header className="pp-rail">
        <Logo />
        <nav aria-label="Sections">
          <a href="/" aria-current={window.location.pathname === "/" ? "page" : undefined}>
            Deals
          </a>
        </nav>
        <Account me={me} onSignOut={onSignOut} />
      </header>
      <div className="pp-app-body">
        <main id="content" className="pp-app-main">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

/** The buyer's pages, and anyone's deal opened with a link: one calm column. */
export function BuyerLayout({
  me,
  onSignOut,
  children,
}: Partial<SignedIn> & { children: ReactNode }) {
  return (
    <div className="pp-buyer">
      <SkipLink />
      <header className="pp-bar">
        <Logo />
        {me && onSignOut && <Account me={me} onSignOut={onSignOut} />}
      </header>
      <main id="content" className="pp-buyer-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}

/** Shown while the app finds out who is signed in, before it knows which layout applies. */
export function Splash({ children }: { children: ReactNode }) {
  return (
    <main className="pp-splash">
      <Logo />
      {children}
    </main>
  );
}
