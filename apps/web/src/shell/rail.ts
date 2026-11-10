/** Where the seller's choice of an open or closed sidebar is kept between visits. */
export const RAIL_KEY = "pactpal-rail";

/** Below this width the sidebar starts closed unless the seller opened it before. */
export const RAIL_WIDE = 1280;

/** Whether the sidebar starts closed: the seller's last choice, else closed on narrower screens. */
export function startClosed(saved: string | null, width: number): boolean {
  if (saved === "closed") return true;
  if (saved === "open") return false;
  return width < RAIL_WIDE;
}

/** ⌘\ on a Mac, Ctrl+\ elsewhere: opens or closes the sidebar, even while typing. */
export const isRailKey = (event: {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}): boolean =>
  event.key === "\\" && (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey;

export function savedRail(): boolean {
  try {
    return startClosed(window.localStorage.getItem(RAIL_KEY), window.innerWidth);
  } catch {
    return startClosed(null, window.innerWidth);
  }
}

export function saveRail(closed: boolean): void {
  try {
    window.localStorage.setItem(RAIL_KEY, closed ? "closed" : "open");
  } catch {
    // The choice still holds for this visit.
  }
}
