/** The pages of the web app, worked out from the address alone. */
export type Route =
  | { page: "home" }
  | { page: "sign-in" }
  | { page: AppSection }
  | { page: "link" }
  | { page: "deal"; dealId: string }
  | { page: "dispute"; dealId: string; disputeId: string };

/** The seller's sections beside the dashboard, by address. */
export const APP_SECTIONS = {
  "/deals": "deals",
  "/new": "new-deal",
  "/notifications": "notifications",
  "/disputes": "disputes",
  "/insights": "insights",
  "/deadlines": "deadlines",
  "/settings": "settings",
} as const;
export type AppSection = (typeof APP_SECTIONS)[keyof typeof APP_SECTIONS];

/** The page that asks a seller to sign in (the sign-in itself starts on the server). */
export const SIGN_IN_PAGE = "/sign-in";

const DEAL = /^\/deals\/([0-9a-f-]{36})$/;
const DISPUTE = /^\/deals\/([0-9a-f-]{36})\/disputes\/([A-Za-z0-9-]{1,100})$/;

/** The page a path shows. Paths that name no page show the home page, as they always have. */
export function matchRoute(path: string): Route {
  if (path === "/link") return { page: "link" };
  if (path === SIGN_IN_PAGE) return { page: "sign-in" };
  const section = (APP_SECTIONS as Record<string, AppSection | undefined>)[path];
  if (section !== undefined) return { page: section };
  const dispute = DISPUTE.exec(path);
  if (dispute?.[1] !== undefined && dispute[2] !== undefined) {
    return { page: "dispute", dealId: dispute[1], disputeId: dispute[2] };
  }
  const deal = DEAL.exec(path)?.[1];
  if (deal !== undefined) return { page: "deal", dealId: deal };
  return { page: "home" };
}

/** Paths the server answers itself; a link to one must load from the server. */
const SERVER_PATHS = ["/api/", "/auth/", "/webhooks/", "/health", "/ready"];

export interface LinkClick {
  /** The link's full address. */
  href: string;
  /** The page's own address. */
  current: string;
  /** The link's `target`, empty when it has none. */
  target: string;
  download: boolean;
  /** A click the browser should handle itself: another button, or with a modifier key held. */
  modified: boolean;
}

/**
 * The path to show without reloading, or undefined when the browser should follow the link
 * itself: another site, a file, a server address, a new tab, or only a different `#part`.
 */
export function inAppPath(click: LinkClick): string | undefined {
  if (click.modified || click.download || (click.target !== "" && click.target !== "_self")) {
    return undefined;
  }
  const to = new URL(click.href, click.current);
  const from = new URL(click.current);
  if (to.origin !== from.origin) return undefined;
  if (SERVER_PATHS.some((prefix) => to.pathname.startsWith(prefix))) return undefined;
  if (/\.[a-z0-9]+$/i.test(to.pathname)) return undefined;
  if (to.pathname === from.pathname && to.search === from.search) return undefined;
  return to.pathname + to.search + to.hash;
}
