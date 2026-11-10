/** The person's theme choice: follow the device, or always light or dark. */
export type Theme = "auto" | "light" | "dark";

const ORDER: readonly Theme[] = ["auto", "light", "dark"];
const KEY = "pactpal-theme";

/** The choice after the current one, in the order the switch cycles through. */
export function nextTheme(current: Theme): Theme {
  return ORDER[(ORDER.indexOf(current) + 1) % ORDER.length] ?? "auto";
}

/** A stored value as a theme; anything unexpected follows the device. */
export function readTheme(stored: string | null): Theme {
  return ORDER.find((theme) => theme === stored) ?? "auto";
}

/** The saved choice. Storage can be blocked (private windows); then the device decides. */
export function savedTheme(): Theme {
  try {
    return readTheme(window.localStorage.getItem(KEY));
  } catch {
    return "auto";
  }
}

/** Applies a choice to the page and remembers it where storage allows. */
export function applyTheme(theme: Theme): void {
  if (theme === "auto") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem(KEY, theme);
  } catch {
    // The choice still holds for this visit.
  }
}

/** Whether the page is drawn dark: the person's choice, or the device's when they made none. */
export function isDark(choice: string | undefined, deviceDark: boolean): boolean {
  return choice === "dark" || (choice !== "light" && deviceDark);
}
