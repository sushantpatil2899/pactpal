import { useState, type ReactNode } from "react";
import type { Me } from "../api";
import { CommandPalette } from "../app/CommandPalette";
import { byUrgency, isOpen, otherName } from "../app/overview-words";
import { Avatar, Unread } from "../app/parts";
import { Icon, type IconName } from "../design/icons";
import { Logo } from "../design/Logo";
import type { DealOverview } from "../overview-api";
import { Button } from "../design/parts";
import { applyTheme, nextTheme, savedTheme, type Theme } from "../design/theme";
import "./shell.css";

const THEME_WORDS: Record<Theme, string> = {
  auto: "Theme: device",
  light: "Theme: light",
  dark: "Theme: dark",
};

/** Cycles the theme: the device's setting, light, dark. */
function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>(savedTheme);
  return (
    <Button
      look="quiet"
      onClick={() => {
        const next = nextTheme(theme);
        applyTheme(next);
        setTheme(next);
      }}
    >
      {THEME_WORDS[theme]}
    </Button>
  );
}

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
      <ThemeSwitch />
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

const SECTIONS: { path: string; page: string; title: string; icon: IconName }[] = [
  { path: "/", page: "home", title: "Dashboard", icon: "home" },
  { path: "/deals", page: "deals", title: "Deals", icon: "deals" },
  { path: "/notifications", page: "notifications", title: "Needs you", icon: "bell" },
  { path: "/disputes", page: "disputes", title: "Disputes", icon: "dispute" },
  { path: "/settings", page: "settings", title: "Settings", icon: "settings" },
];

/** How many open deals the rail lists; the quick switcher reaches the rest. */
const RAIL_DEALS = 8;

interface AppLayoutProps extends SignedIn {
  /** The page being shown, to mark its section. */
  page: string;
  /** The open deal, to mark it in the list. */
  dealId?: string | undefined;
  deals: readonly DealOverview[] | undefined;
  children: ReactNode;
}

/** The seller's app: a rail of sections and open deals beside the page. */
export function AppLayout({ me, onSignOut, page, dealId, deals, children }: AppLayoutProps) {
  const open = (deals ?? []).filter(isOpen).sort(byUrgency);
  const unread = (deals ?? []).reduce((sum, deal) => sum + deal.unreadNotifications, 0);
  const disputes = open.filter((deal) => deal.dispute !== null).length;
  const counts: Record<string, number> = { notifications: unread, disputes };
  // A deal page belongs to the Deals section.
  const section = page === "deal" || page === "dispute" || page === "new-deal" ? "deals" : page;
  return (
    <div className="pp-app">
      <SkipLink />
      <header className="pp-rail">
        <Logo />
        <CommandPalette deals={deals ?? []} />
        <nav aria-label="Sections">
          {SECTIONS.map((item) => (
            <a
              key={item.path}
              href={item.path}
              aria-current={item.page === section ? "page" : undefined}
            >
              <Icon name={item.icon} />
              {item.title}
              {(counts[item.page] ?? 0) > 0 && (
                <span className="pp-count">{counts[item.page]}</span>
              )}
            </a>
          ))}
        </nav>
        {open.length > 0 && (
          <nav aria-label="Open deals" className="pp-rail-deals">
            <span className="pp-caption">Open deals</span>
            {open.slice(0, RAIL_DEALS).map((deal) => (
              <a
                key={deal.id}
                href={`/deals/${deal.id}`}
                aria-current={deal.id === dealId ? "page" : undefined}
              >
                <Avatar name={otherName(deal)} />
                <span>{deal.title}</span>
                <Unread deal={deal} />
              </a>
            ))}
          </nav>
        )}
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
