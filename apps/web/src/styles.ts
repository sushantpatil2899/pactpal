import type { CSSProperties } from "react";

/** A text box as wide as its column, so nothing runs off a phone screen. */
export const FULL_WIDTH: CSSProperties = { width: "100%", boxSizing: "border-box" };

/** A wide table scrolls inside its own box instead of widening the page. */
export const SCROLL_X: CSSProperties = { overflowX: "auto" };

/** Long unbroken text (a link, a long quote) wraps instead of widening the page. */
export const WRAP: CSSProperties = { overflowWrap: "anywhere" };

/** Keeps a short column (a time, a count) on one line. */
export const NO_WRAP: CSSProperties = { whiteSpace: "nowrap" };
