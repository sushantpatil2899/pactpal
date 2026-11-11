import { useEffect, useState } from "react";
import { isDark } from "./theme";

const DEVICE = "(prefers-color-scheme: dark)";
const now = () => isDark(document.documentElement.dataset.theme, window.matchMedia(DEVICE).matches);

/** Whether the page is dark right now, for parts drawn on a canvas that cannot read the tokens. */
export function useDark(): boolean {
  const [dark, setDark] = useState(now);
  useEffect(() => {
    const update = () => {
      setDark(now());
    };
    const device = window.matchMedia(DEVICE);
    const choice = new MutationObserver(update);
    choice.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    device.addEventListener("change", update);
    return () => {
      choice.disconnect();
      device.removeEventListener("change", update);
    };
  }, []);
  return dark;
}
