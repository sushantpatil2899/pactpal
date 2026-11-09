import { useEffect, useState } from "react";
import { inAppPath, matchRoute, type Route } from "./routes";

/** Tells the app the address changed without a page load. */
const CHANGED = "pactpal:route";

/** Shows another page of the app without reloading it. */
export function navigate(path: string): void {
  window.history.pushState(null, "", path);
  window.dispatchEvent(new Event(CHANGED));
  window.scrollTo(0, 0);
}

function onClick(event: MouseEvent): void {
  if (event.defaultPrevented || !(event.target instanceof Element)) return;
  const link = event.target.closest("a[href]");
  if (!(link instanceof HTMLAnchorElement)) return;
  const path = inAppPath({
    href: link.href,
    current: window.location.href,
    target: link.target,
    download: link.hasAttribute("download"),
    modified:
      event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey,
  });
  if (path === undefined) return;
  event.preventDefault();
  navigate(path);
}

/**
 * The page the address names, kept current as the person moves around. Ordinary links to the
 * app's own pages are followed without a reload, so pages need no special link component.
 */
export function useRoute(): Route {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const onChange = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener("popstate", onChange);
    window.addEventListener(CHANGED, onChange);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener(CHANGED, onChange);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return matchRoute(path);
}
